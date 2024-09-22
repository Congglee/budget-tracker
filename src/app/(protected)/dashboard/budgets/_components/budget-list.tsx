"use client";

import BudgetCard from "@/app/(protected)/dashboard/budgets/_components/budget-card";
import BudgetCardSkeleton from "@/app/(protected)/dashboard/budgets/_components/budget-card-skeleton";
import { useAppContext } from "@/app/app-context";
import ConfirmDialog from "@/components/confirm-dialog";
import FilterPopover from "@/components/filter-popover";
import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { exportToCsv, getCurrencyLabel } from "@/lib/utils";
import { ExtendedBudget } from "@/types";
import { Category, TransactionType, UserSettings } from "@prisma/client";
import { format } from "date-fns";
import { motion, Variants } from "framer-motion";
import { Download, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

interface BudgetListProps {
  userSettings: UserSettings;
  categories: Category[];
}

export default function BudgetList({
  userSettings,
  categories,
}: BudgetListProps) {
  const [budget, setBudget] = useState<ExtendedBudget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteBudgetAlertOpen, setDeleteBudgetAlertOpen] =
    useState<boolean>(false);
  const [budgets, setBudgets] = useState<ExtendedBudget[]>([]);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const debouncedKeyword = useDebounce(keyword, 500);
  const { trigger, setTrigger } = useAppContext();
  const [ref, inView] = useInView({ threshold: 0 });
  const router = useRouter();
  const userCurrencyLabel = getCurrencyLabel(userSettings.currency);

  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    setBudgets([]);
    setPage(1);
  }, [debouncedKeyword, categoryIds, trigger]);

  const fetchUserBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "6",
        page: page.toString(),
        keyword: debouncedKeyword,
      });
      categoryIds.forEach((id) => params.append("categoryIds", id));

      const response = await fetch(`/api/budgets?${params.toString()}`);
      const result = await parseApiResponse<{
        budgets: ExtendedBudget[];
        totalPages: number;
      }>(response);

      setBudgets((prev) => {
        if (page === 1) {
          return result.data?.budgets || [];
        }
        return [...prev, ...(result.data?.budgets || [])];
      });
      setTotalPages(result.data?.totalPages || 1);
    } catch (error) {
      handleErrorResponse({ error });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedKeyword, categoryIds, page]);

  useEffect(() => {
    fetchUserBudgets();
  }, [fetchUserBudgets, page, trigger]);

  useEffect(() => {
    if (inView && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [inView, totalPages, page]);

  const categoriesOptions = useMemo(() => {
    return categories.length > 0
      ? categories
          .filter((category) => category.type === TransactionType.EXPENSE)
          .map((category) => ({
            value: category.id,
            label: `${category.icon} ${category.name}`,
          }))
      : [];
  }, [categories]);

  const handleExportCSV = useCallback(() => {
    if (!budgets.length) {
      toast.info("No data to export.");
      return;
    }
    const currency = userCurrencyLabel.split(" ")[0] || "$";
    const csvData = budgets.length
      ? budgets.map((budget) => ({
          id: budget.id,
          name: budget.name,
          amount: `${currency}${budget.amount}`,
          total_spent: `${currency}${budget.totalSpent}`,
          remaining: `${currency}${budget.remaining}`,
          start_date: budget.startDate
            ? format(budget.startDate, "dd/MM/yyyy")
            : "",
          end_date: budget.endDate ? format(budget.endDate, "dd/MM/yyyy") : "",
          category: budget.category.name,
        }))
      : [];
    exportToCsv(csvData, "budgets");
  }, [budgets, userCurrencyLabel]);

  const handleDeleteBudget = async (budgetId: string) => {
    setIsDeleteLoading(true);
    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: "DELETE",
      });
      const result = await parseApiResponse<string>(response);
      if (response.ok) {
        toast.success(result.message);
        setDeleteBudgetAlertOpen(false);
        setBudget(null);
        router.refresh();
        setTrigger(!trigger);
      }
    } catch (error) {
      handleErrorResponse({ error });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-6">
          <div className="flex flex-wrap flex-col w-full sm:flex-row sm:flex-1 sm:items-center gap-2">
            <Input
              type="search"
              placeholder="Filter budget..."
              className="h-8 sm:w-[150px] lg:w-[250px]"
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
            />
            <FilterPopover
              onFilterChange={(values) => setCategoryIds(values)}
              title="Category"
              options={categoriesOptions}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 lg:flex"
            onClick={() => handleExportCSV()}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <BudgetCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {budgets.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {budgets.map((budget, index) => (
                  <motion.div
                    key={index}
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: index * 0.35,
                      ease: "linear",
                      duration: 0.5,
                    }}
                    viewport={{ amount: 0 }}
                  >
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      userSettings={userSettings}
                      onSetBudget={setBudget}
                      onDeleteBudgetAlertOpen={setDeleteBudgetAlertOpen}
                      hasModifyActions={true}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyPlaceholder>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <WalletCards className="w-10 h-10" />
                </div>
                <EmptyPlaceholder.Title>
                  No budgets found
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Add an budget to start monitoring your expenses.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            )}
          </>
        )}
      </div>
      <div
        ref={ref}
        className="mt-2 flex space-x-2 justify-center items-center w-full"
      >
        {page + 1 < totalPages && (
          <>
            <span className="sr-only">Loading...</span>
            <div className="h-6 w-6 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="h-6 w-6 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="h-6 w-6 bg-primary rounded-full animate-bounce" />
          </>
        )}
      </div>
      <ConfirmDialog
        open={deleteBudgetAlertOpen}
        onOpenStateChange={setDeleteBudgetAlertOpen}
        title="Are you sure you want to delete this budget?"
        description="This action cannot be undone."
        onConfirm={() => {
          handleDeleteBudget(budget?.id as string);
        }}
        isSubmitLoading={isDeleteLoading}
      />
    </>
  );
}
