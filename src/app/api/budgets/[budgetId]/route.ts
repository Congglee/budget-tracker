import {
  getBudgetById,
  getUniqueBudget,
  verifyUserBudget,
} from "@/data/budget";
import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { formatZodErrors, normalizeDate } from "@/lib/utils";
import { AddBudgetSchema } from "@/schemas/budget";
import { AddTransactionSchema } from "@/schemas/transaction";
import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const RouteContextSchema = z.object({
  params: z.object({
    budgetId: z.string().uuid(),
  }),
});

export async function POST(
  req: Request,
  context: z.infer<typeof RouteContextSchema>
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const userId = user.id as string;

  try {
    const { params } = RouteContextSchema.parse(context);
    const checkBudget = await verifyUserBudget(userId, params.budgetId);
    if (!checkBudget) {
      throw new Error("Budget not found");
    }

    const body = await req.json();
    const parsedData = AddTransactionSchema.safeParse(body);
    if (!parsedData.success) {
      const errors = formatZodErrors(parsedData.error.errors);
      throw new EntityError({
        status: 422,
        payload: { message: "Validation Error", errors },
      });
    }

    const { name, amount, description, date, type, category, budget } =
      parsedData.data;
    const transactionDate = normalizeDate(date);
    const day = transactionDate.getUTCDate();
    const month = transactionDate.getUTCMonth() + 1;
    const year = transactionDate.getUTCFullYear();

    const transaction = await prisma.transaction.create({
      data: {
        name,
        amount,
        description,
        date: transactionDate,
        type,
        userId,
        categoryId: category,
        budgetId: budget,
      },
    });

    if (transaction && transaction.type === TransactionType.EXPENSE) {
      await Promise.all([
        prisma.history.upsert({
          where: {
            day_month_year_userId: { day, month, year, userId },
          },
          create: {
            userId,
            day,
            month,
            year,
            income: type === TransactionType.INCOME ? amount : 0,
            expense: type === TransactionType.EXPENSE ? amount : 0,
          },
          update: {
            income: {
              increment: type === TransactionType.INCOME ? amount : 0,
            },
            expense: {
              increment: type === TransactionType.EXPENSE ? amount : 0,
            },
          },
        }),
        prisma.budget.update({
          where: { id: params.budgetId },
          data: {
            totalSpent: { increment: amount },
            remaining: { decrement: amount },
          },
        }),
      ]);
    }

    return NextResponse.json(
      { message: "Add expense transaction to budget successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof EntityError) {
      return NextResponse.json(
        {
          error: {
            message: error.payload.message,
            errors: error.payload.errors,
          },
        },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: { message: error.message ?? "Internal server error" } },
      { status: error.status ?? 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof RouteContextSchema>
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const userId = user.id as string;

  try {
    const { params } = RouteContextSchema.parse(context);
    const checkBudget = await verifyUserBudget(userId, params.budgetId);
    if (!checkBudget) {
      throw new Error("Budget not found");
    }

    const body = await req.json();
    const parsedData = AddBudgetSchema.safeParse(body);
    if (!parsedData.success) {
      const errors = formatZodErrors(parsedData.error.errors);
      throw new EntityError({
        status: 422,
        payload: { message: "Validation Error", errors },
      });
    }

    const { name, amount, category, end_date, start_date } = parsedData.data;
    const startDate = start_date ? normalizeDate(start_date) : null;
    const endDate = end_date ? normalizeDate(end_date) : null;

    const existingBudget = await getUniqueBudget(name, userId, params.budgetId);
    if (existingBudget) {
      throw new Error("Budget already exists");
    }

    const budget = await getBudgetById(params.budgetId);
    if (!budget) {
      throw new Error("Budget not found");
    }

    const newRemaining = amount - budget.totalSpent;
    await prisma.budget.update({
      where: { id: params.budgetId },
      data: {
        name,
        amount,
        remaining: newRemaining,
        categoryId: category,
        startDate,
        endDate,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Budget updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof EntityError) {
      return NextResponse.json(
        {
          error: {
            message: error.payload.message,
            errors: error.payload.errors,
          },
        },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: { message: error.message ?? "Internal server error" } },
      { status: error.status ?? 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof RouteContextSchema>
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const userId = user.id as string;

  try {
    const { params } = RouteContextSchema.parse(context);
    const checkBudget = await verifyUserBudget(userId, params.budgetId);
    if (!checkBudget) {
      throw new Error("Budget not found");
    }

    const budget = await prisma.budget.delete({
      where: { id: params.budgetId },
    });

    if (budget) {
      await prisma.transaction.updateMany({
        where: { budgetId: params.budgetId },
        data: { budgetId: null },
      });
    }

    return NextResponse.json(
      { message: "Budget deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message ?? "Internal server error" } },
      { status: error.status ?? 500 }
    );
  }
}
