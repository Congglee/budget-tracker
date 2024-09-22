"use client";

import { useAppContext } from "@/app/app-context";
import AddCategoryForm from "@/components/category/add-category-form";
import ComboboxInput from "@/components/form/combobox-input";
import DatePickerInput from "@/components/form/date-picker-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { handleErrorResponse, parseApiResponse } from "@/lib/helper";
import { cn, getCurrencyLabel } from "@/lib/utils";
import { AddBudgetSchema } from "@/schemas/budget";
import { ExtendedBudget } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, TransactionType, UserSettings } from "@prisma/client";
import { LoaderCircle, PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface BudgetFormProps {
  budget: ExtendedBudget;
  userSettings: UserSettings;
  categories: Category[];
}

type FormData = z.infer<typeof AddBudgetSchema>;

export default function BudgetForm({
  budget,
  userSettings,
  categories,
}: BudgetFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(AddBudgetSchema),
    defaultValues: {
      name: "",
      amount: 0,
      start_date: undefined,
      end_date: undefined,
      category: "",
    },
  });
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
    setError,
  } = form;

  const [addCategoryDrawerOpen, setAddCategoryDrawerOpen] =
    useState<boolean>(false);

  const userCurrencyLabel = getCurrencyLabel(userSettings.currency);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { sidebarOpen } = useAppContext();
  const router = useRouter();

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

  useEffect(() => {
    if (budget) {
      setValue("name", budget.name);
      setValue("amount", budget.amount);
      setValue("start_date", budget.startDate ? budget.startDate : undefined);
      setValue("end_date", budget.endDate ? budget.endDate : undefined);
      setValue("category", budget.categoryId);
    }
  }, [budget, setValue]);

  const onSelectStartDate = useCallback(
    (date: Date) => {
      if (date) {
        setValue("start_date", date);
      }
    },
    [setValue]
  );

  const onSelectEndDate = useCallback(
    (date: Date) => {
      if (date) {
        setValue("end_date", date);
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<string>(response);
      if (response.ok) {
        toast.success(result.message);
        router.refresh();
      }
    } catch (error: any) {
      handleErrorResponse({ error, setError });
    }
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Budget Details</CardTitle>
              <CardDescription>
                Enter the new details for the budget.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Budget name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel htmlFor="amount">
                        Amount {`(${userCurrencyLabel})`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          id="amount"
                          min={0}
                          placeholder="Budget amount..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        isDesktop && sidebarOpen
                          ? "col-span-2"
                          : "col-span-2 sm:col-span-1"
                      )}
                    >
                      <FormLabel htmlFor="type">Start Date</FormLabel>
                      <DatePickerInput
                        value={field.value}
                        onSelect={onSelectStartDate}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        isDesktop && sidebarOpen
                          ? "col-span-2"
                          : "col-span-2 sm:col-span-1"
                      )}
                    >
                      <FormLabel htmlFor="type">End Date</FormLabel>
                      <DatePickerInput
                        value={field.value}
                        onSelect={onSelectEndDate}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="col-span-2 overflow-hidden">
                      <FormLabel htmlFor="type">Expense Category</FormLabel>
                      <ComboboxInput
                        value={field.value}
                        options={categoriesOptions}
                        onSelect={(value) => setValue("category", value)}
                        placeholder="Select category"
                        emptyText="No category found"
                      >
                        <Button
                          variant="ghost"
                          className="rounded-none w-full"
                          onClick={() => setAddCategoryDrawerOpen(true)}
                        >
                          <PlusSquare className="mr-2 h-4 w-4" />
                          Create new
                        </Button>
                      </ComboboxInput>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start md:items-center md:flex-row gap-4 pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full md:w-auto"
                disabled={isSubmitting}
                onClick={() =>
                  reset({
                    name: budget?.name || "",
                    amount: budget?.amount || 0,
                    start_date: budget?.startDate || undefined,
                    end_date: budget?.endDate || undefined,
                    category: budget?.categoryId || "",
                  })
                }
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <AddCategoryForm
        open={addCategoryDrawerOpen}
        onOpenChange={setAddCategoryDrawerOpen}
        type={TransactionType.EXPENSE}
      />
    </>
  );
}
