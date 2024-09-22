import prisma from "@/lib/prisma";
import { ExtendedBudget } from "@/types";

export async function getBudgetById(id: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id },
    });

    return budget;
  } catch {
    return null;
  }
}

export async function getBudgetByIdAndUserId(id: string, userId: string) {
  try {
    const budget = (await prisma.budget.findUnique({
      where: { id, userId },
      include: {
        category: {
          select: { id: true, name: true, type: true, icon: true },
        },
        transactions: {
          select: {
            id: true,
            name: true,
            description: true,
            amount: true,
            date: true,
            updatedAt: true,
            type: true,
          },
        },
      },
    })) as ExtendedBudget;
    return budget;
  } catch {
    return null;
  }
}

export async function getUniqueBudget(
  name: string,
  userId: string,
  id?: string
) {
  try {
    const uniqueBudget = await prisma.budget.findFirst({
      where: {
        name,
        userId,
        ...(id && { NOT: { id } }),
      },
    });

    return uniqueBudget;
  } catch {
    return null;
  }
}

export async function getBudgets({
  condition,
  limit,
  skip,
}: { condition?: any; limit?: number; skip?: number } = {}) {
  const budgets = (await prisma.budget.findMany({
    where: condition,
    include: {
      category: {
        select: { id: true, name: true, type: true, icon: true },
      },
    },
    take: limit,
    skip,
  })) as ExtendedBudget[];

  return budgets;
}

export async function verifyUserBudget(userId: string, budgetId: string) {
  const count = await prisma.budget.count({
    where: { id: budgetId, userId },
  });

  return count > 0;
}
