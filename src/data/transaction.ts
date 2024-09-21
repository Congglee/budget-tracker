import prisma from "@/lib/prisma";
import { DateRange } from "@/types";
import { TransactionType } from "@prisma/client";

export async function getFinancialSummary(
  userId: string,
  dateRange?: DateRange
) {
  const transactionSums = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      ...(dateRange && {
        date: { gte: dateRange.from, lte: dateRange.to },
      }),
    },
    _sum: { amount: true },
  });

  const totalExpense =
    transactionSums.find((item) => item.type === TransactionType.EXPENSE)?._sum
      .amount || 0;
  const totalIncome =
    transactionSums.find((item) => item.type === TransactionType.INCOME)?._sum
      .amount || 0;
  const totalBalance = totalIncome - totalExpense;

  return { totalExpense, totalIncome, totalBalance };
}
