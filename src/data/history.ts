import prisma from "@/lib/prisma";
import { HistoryData, TimeFrame } from "@/types";
import { Transaction } from "@prisma/client";
import { getDaysInMonth } from "date-fns";

export async function getHistoryPeriods(userId: string) {
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

export async function getHistoryData(
  userId: string,
  timeFrame: TimeFrame,
  period: Pick<HistoryData, "year" | "month">
) {
  switch (timeFrame) {
    case "month":
      return await getMonthlyHistory(userId, period.year, period.month);
    case "year":
      return await getYearlyHistory(userId, period.year);
  }
}

async function getMonthlyHistory(
  userId: string,
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

  const history = [];
  const daysInMonth = getDaysInMonth(new Date(year, month - 1));

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
  userId: string,
  year: number = new Date().getFullYear()
) {
  const yearlyHistory = await prisma.history.groupBy({
    by: ["month"],
    where: { userId, year },
    _sum: { expense: true, income: true },
    orderBy: [{ month: "asc" }],
  });
  if (!yearlyHistory.length) return [];

  const history = [];

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

export async function getHistoriesByTransactionsDate(
  transactionsDate: Record<string, Transaction[]>,
  userId: string
) {
  const histories = await prisma.history.findMany({
    where: {
      userId,
      OR: Object.keys(transactionsDate).map((dateKey) => {
        const [day, month, year] = dateKey.split("-").map(Number);
        return { day, month, year };
      }),
    },
  });

  return histories;
}
