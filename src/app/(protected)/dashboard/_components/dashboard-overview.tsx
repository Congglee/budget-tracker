"use client";

import CategorySummaryCard from "@/app/(protected)/dashboard/_components/category-summary-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryConfig } from "@/hooks/use-query-config";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { Category, TransactionType, UserSettings } from "@prisma/client";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";
import CountUp from "react-countup";

interface DashboardOverviewProps {
  data: {
    financialSummary: {
      totalExpense: number;
      totalIncome: number;
      totalBalance: number;
    };
    categorySummary: {
      category: Category | undefined;
      type: string;
      categoryId: string;
      _sum: { amount: number | null };
    }[];
  };
  userSettings: UserSettings;
}

export default function DashboardOverview({
  data,
  userSettings,
}: DashboardOverviewProps) {
  const { from, to } = useQueryConfig();

  const formatUserCurrency = useMemo(() => {
    return formatCurrency(userSettings.currency);
  }, [userSettings]);

  const incomeCategories = useMemo(() => {
    return data.categorySummary.filter(
      (item) => item.type === TransactionType.INCOME
    );
  }, [data.categorySummary]);

  const expenseCategories = useMemo(() => {
    return data.categorySummary.filter(
      (item) => item.type === TransactionType.EXPENSE
    );
  }, [data.categorySummary]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              <CountUp
                preserveValue
                redraw={false}
                end={data.financialSummary.totalIncome}
                decimals={2}
                formattingFn={(value) => formatUserCurrency.format(value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {from && to ? formatDateRange(from, to) : "All time"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expense</CardTitle>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              <CountUp
                preserveValue
                redraw={false}
                end={data.financialSummary.totalExpense}
                decimals={2}
                formattingFn={(value) => formatUserCurrency.format(value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {from && to ? formatDateRange(from, to) : "All time"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              <CountUp
                preserveValue
                redraw={false}
                end={data.financialSummary.totalBalance}
                decimals={2}
                formattingFn={(value) => formatUserCurrency.format(value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {from && to ? formatDateRange(from, to) : "All time"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <CategorySummaryCard
          categories={incomeCategories}
          title="Incomes by category"
          formatUserCurrency={formatUserCurrency}
        />
        <CategorySummaryCard
          categories={expenseCategories}
          title="Expenses by category"
          formatUserCurrency={formatUserCurrency}
        />
      </div>
    </div>
  );
}
