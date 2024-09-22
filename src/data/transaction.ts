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

export async function getTransactionsByUserId(
  userId: string,
  dateRange?: DateRange
) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(dateRange && {
        date: { gte: dateRange.from, lte: dateRange.to },
      }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { id: true, name: true, type: true, icon: true },
      },
      budget: {
        select: { id: true, name: true },
      },
    },
  });

  return transactions;
}

export async function getTransactionsByIdsAndUserId(
  transactionIds: string[],
  userId: string
) {
  const transactions = await prisma.transaction.findMany({
    where: { id: { in: transactionIds }, userId },
  });

  return transactions;
}

export async function getTransactionsByCategoryIds(categoryIds: string[]) {
  const transactions = await prisma.transaction.findMany({
    where: { categoryId: { in: categoryIds } },
  });

  return transactions;
}

export async function verifyUserTransaction(
  userId: string,
  transactionId: string
) {
  const count = await prisma.transaction.count({
    where: { id: transactionId, userId },
  });

  return count > 0;
}

export async function verifyUserTransactions(
  userId: string,
  transactionIds: string[]
) {
  const count = await prisma.transaction.count({
    where: { id: { in: transactionIds }, userId },
  });

  return count === transactionIds.length;
}

export async function getTransactionById(id: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { budget: true },
    });

    return transaction;
  } catch {
    return null;
  }
}

export async function getTransactionByIdAndUserId(id: string, userId: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id, userId },
      include: {
        category: {
          select: { id: true, name: true, type: true, icon: true },
        },
      },
    });

    return transaction;
  } catch {
    return null;
  }
}

export async function getTransactionsByCategoryId(categoryId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { categoryId },
  });

  return transactions;
}
