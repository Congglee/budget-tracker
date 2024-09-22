import prisma from "@/lib/prisma";
import { DateRange, ExtendedCategory } from "@/types";
import { TransactionType } from "@prisma/client";

export async function getCategoriesByUserId(userId: string) {
  const categories = (await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      budgets: {
        select: { id: true, name: true, remaining: true, amount: true },
      },
    },
  })) as ExtendedCategory[];

  return categories;
}

export async function getUniqueCategory(
  name: string,
  type: TransactionType,
  userId: string,
  id?: string
) {
  try {
    const uniqueCategory = await prisma.category.findFirst({
      where: {
        name,
        type,
        userId,
        ...(id && { NOT: { id } }),
      },
    });

    return uniqueCategory;
  } catch {
    return null;
  }
}

export async function getCategorySummary(
  userId: string,
  dateRange?: DateRange
) {
  const categoryTransaction = await prisma.transaction.groupBy({
    by: ["type", "categoryId"],
    where: {
      userId,
      ...(dateRange && {
        date: { gte: dateRange.from, lte: dateRange.to },
      }),
    },
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

export async function verifyUserCategory(userId: string, categoryId: string) {
  const count = await prisma.category.count({
    where: { id: categoryId, userId },
  });

  return count > 0;
}

export async function verifyUserCategories(
  userId: string,
  categoryIds: string[]
) {
  const count = await prisma.category.count({
    where: { id: { in: categoryIds }, userId },
  });

  return count === categoryIds.length;
}

export async function getCategoriesByIdsAndUserId(
  categoryIds: string[],
  userId: string
) {
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds }, userId },
  });

  return categories;
}
