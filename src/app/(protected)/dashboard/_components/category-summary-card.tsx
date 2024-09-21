"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Category, TransactionType } from "@prisma/client";
import { Activity } from "lucide-react";
import { useMemo } from "react";

interface CategorySummaryCardProps {
  categories: {
    category: Category | undefined;
    type: string;
    categoryId: string;
    _sum: { amount: number | null };
  }[];
  title: string;
  formatUserCurrency: Intl.NumberFormat;
}

export default function CategorySummaryCard({
  categories,
  title,
  formatUserCurrency,
}: CategorySummaryCardProps) {
  const totalCategoriesAmount = useMemo(() => {
    return categories.reduce((acc, item) => acc + (item._sum.amount || 0), 0);
  }, [categories]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length ? (
          <ScrollArea className="h-[20rem] rounded-lg">
            <div className="space-y-4">
              {categories.map((item) => {
                const percentage =
                  ((item._sum.amount || 0) * 100) / totalCategoriesAmount;
                const categoryItem = item.category as Category;
                return (
                  <div
                    className="flex items-center justify-between gap-2"
                    key={item.categoryId}
                  >
                    <div className="space-y-2 w-full">
                      <div className="flex gap-x-3 flex-wrap items-center justify-between">
                        <span>
                          {categoryItem.icon} {categoryItem.name}
                        </span>
                        <span>
                          {formatUserCurrency.format(item._sum.amount || 0)}
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        indicatorClassName={cn(
                          item.type === TransactionType.INCOME &&
                            "bg-emerald-500",
                          item.type === TransactionType.EXPENSE && "bg-red-500"
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <EmptyPlaceholder className="min-h-[20rem]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Activity className="w-10 h-10" />
            </div>
            <EmptyPlaceholder.Title>
              No data for the selected date range
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Try changing the date range to see data for a different period or
              add some transactions to get started.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </CardContent>
    </Card>
  );
}
