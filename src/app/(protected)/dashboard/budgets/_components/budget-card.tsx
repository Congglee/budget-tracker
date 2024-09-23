"use client";

import { ExtendedBudget } from "@/types";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Ellipsis, Plus, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency, getCurrencyLabel } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import AddExpenseDialog from "@/components/budget/add-expense-dialog";

interface BudgetCardProps {
  budget: ExtendedBudget;
  userSettings: UserSettings;
  hasModifyActions?: boolean;
  isEdit?: boolean;

  onSetBudget?: (budget: ExtendedBudget) => void;
  onDeleteBudgetAlertOpen?: (open: boolean) => void;
}

export default function BudgetCard({
  budget,
  onSetBudget,
  onDeleteBudgetAlertOpen,
  userSettings,
  hasModifyActions,
  isEdit,
}: BudgetCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const formatUserCurrency = useMemo(() => {
    return formatCurrency(userSettings.currency);
  }, [userSettings]);

  const userCurrencyLabel = getCurrencyLabel(userSettings.currency);

  const percentageSpent =
    budget.totalSpent > budget.amount
      ? 100
      : (budget.totalSpent / budget.amount) * 100;

  return (
    <>
      <Card className="grid overflow-hidden">
        <CardHeader
          className={cn(
            "py-3 flex flex-col xs:flex-row gap-6 bg-muted/50 px-5 space-y-0 items-start xs:items-center",
            isEdit && "xs:items-start"
          )}
        >
          <div className="space-y-1 flex flex-col flex-1">
            <CardTitle
              className={cn(
                "text-lg leading-6 line-clamp-2",
                isEdit && "line-clamp-none"
              )}
            >
              <Link
                href={`/dashboard/budgets/${budget.id}/edit`}
                className="hover:underline hover:text-primary"
              >
                {budget.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-[12.5px]">
              {budget.startDate && budget.endDate
                ? `Date: ${format(budget.startDate, "dd/MM/yyyy")} - ${format(
                    budget.endDate,
                    "dd/MM/yyyy"
                  )}`
                : "No date range"}
            </CardDescription>
          </div>
          <div className="ml-auto flex gap-2 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-8 h-8 p-1"
                    onClick={() => {
                      setOpen(true);
                      onSetBudget && onSetBudget(budget);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add expense to budget</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {hasModifyActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-8 h-8 p-1">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href={`/dashboard/budgets/${budget.id}/edit`}>
                        <SquarePen className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        onSetBudget && onSetBudget(budget);
                        onDeleteBudgetAlertOpen &&
                          onDeleteBudgetAlertOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-5 text-xs xs:text-sm text-muted-foreground">
          <div className="relative w-full top-1/2 -translate-y-1/2">
            <Progress value={percentageSpent} className="h-5" />
            <div className="text-xs absolute top-1/2 -translate-y-1/2 right-4 overflow-hidden text-foreground font-semibold">
              Amount: {formatUserCurrency.format(budget.amount)}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-5 py-3 text-muted-foreground text-xs">
          <div className="flex flex-col xs:flex-row gap-y-4 gap-x-6 items-start xs:justify-between w-full">
            <div className="flex flex-col gap-1 font-semibold basis-1/2">
              <span>Spent: {formatUserCurrency.format(budget.totalSpent)}</span>
              <span>
                Remaining: {formatUserCurrency.format(budget.remaining)}
              </span>
            </div>
            <div
              className={cn(
                "xs:text-right basis-1/2 line-clamp-3",
                isEdit && "line-clamp-none"
              )}
            >
              Category: {budget.category.name}
            </div>
          </div>
        </CardFooter>
      </Card>
      <AddExpenseDialog
        open={open}
        onOpenChange={setOpen}
        userCurrencyLabel={userCurrencyLabel}
        budget={budget}
      />
    </>
  );
}
