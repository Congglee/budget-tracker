import { TransactionType } from "@/constants/type";
import prisma from "@/lib/prisma";
import { DateRange, Period, TimeFrame } from "@/types";
import { User } from "@prisma/client";
import { getDaysInMonth } from "date-fns";

export async function getDashboardOverview(
  userId: User["id"],
  dateRange: DateRange,
  timeFrame: TimeFrame,
  period: Period
) {
  const financialSummary = await getFinancialSummary(userId, dateRange);
  const categorySummary = await getCategorySummary(userId, dateRange);
  const historyData = await getHistoryData(userId, timeFrame, period);
  const historyPeriods = await getHistoryPeriods(userId);
  return { financialSummary, categorySummary, historyData, historyPeriods };
}

async function getFinancialSummary(userId: User["id"], dateRange: DateRange) {
  const transactionSums = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: { gte: dateRange.from, lte: dateRange.to },
    },
    _sum: { amount: true },
  });
  const totalExpense =
    transactionSums.find((item) => item.type === TransactionType.Expense)?._sum
      .amount || 0;
  const totalIncome =
    transactionSums.find((item) => item.type === TransactionType.Income)?._sum
      .amount || 0;
  const totalBalance = totalIncome - totalExpense;
  return { totalExpense, totalIncome, totalBalance };
}

async function getCategorySummary(userId: User["id"], dateRange: DateRange) {
  const categoryTransaction = await prisma.transaction.groupBy({
    by: ["type", "categoryId"],
    where: { userId, date: { gte: dateRange.from, lte: dateRange.to } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });
  const categories = await prisma.category.findMany({
    where: {
      id: { in: categoryTransaction.map((item) => item.categoryId) },
    },
  });
  const categoryDetails = categoryTransaction.map((transaction) => ({
    ...transaction,
    category: categories.find(
      (category) => category.id === transaction.categoryId
    ),
  }));
  return categoryDetails;
}

async function getHistoryData(
  userId: User["id"],
  timeFrame: TimeFrame,
  period: Period
) {
  switch (timeFrame) {
    case "month":
      return await getMonthlyHistory(userId, period.year, period.month);
    case "year":
      return await getYearlyHistory(userId, period.year);
  }
}

async function getMonthlyHistory(
  userId: User["id"],
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth() + 1
) {
  const monthlyHistory = await prisma.history.groupBy({
    by: ["day"],
    where: { userId, year, month },
    _sum: { expense: true, income: true },
    orderBy: [{ day: "asc" }],
  });
  if (!monthlyHistory.length) return [];
  let history = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;
    const day = monthlyHistory.find((item) => item.day === i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }
    history.push({ day: i, expense, income, year, month });
  }
  return history;
}

async function getYearlyHistory(
  userId: User["id"],
  year: number = new Date().getFullYear()
) {
  const yearlyHistory = await prisma.history.groupBy({
    by: ["month"],
    where: { userId, year },
    _sum: { expense: true, income: true },
    orderBy: [{ month: "asc" }],
  });
  if (!yearlyHistory.length) return [];
  let history = [];
  for (let i = 1; i <= 12; i++) {
    let expense = 0;
    let income = 0;
    const month = yearlyHistory.find((item) => item.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }
    history.push({ month: i, expense, income, year });
  }
  return history;
}

async function getHistoryPeriods(userId: User["id"]) {
  const historyPeriods = await prisma.history.findMany({
    where: { userId },
    select: { year: true },
    distinct: ["year"],
    orderBy: [{ year: "asc" }],
  });
  const years = historyPeriods.map((item) => item.year);
  if (!historyPeriods.length) {
    return [new Date().getFullYear()];
  }
  return years;
}
