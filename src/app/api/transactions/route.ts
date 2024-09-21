import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { formatZodErrors, normalizeDate } from "@/lib/utils";
import { AddTransactionSchema } from "@/schemas/transaction";
import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const userId = user.id as string;

  try {
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
        budgetId: budget ? budget : null,
      },
    });

    if (transaction) {
      const historyUpdate = prisma.history.upsert({
        where: {
          day_month_year_userId: {
            day,
            month,
            year,
            userId,
          },
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
          income:
            type === TransactionType.INCOME ? { increment: amount } : undefined,
          expense:
            type === TransactionType.EXPENSE
              ? { increment: amount }
              : undefined,
        },
      });

      const operations: any[] = [historyUpdate];

      if (budget && type === TransactionType.EXPENSE) {
        const budgetUpdate = prisma.budget.update({
          where: { id: budget },
          data: {
            totalSpent: { increment: amount },
            remaining: { decrement: amount },
          },
        });
        operations.push(budgetUpdate);
      }

      await prisma.$transaction(operations);
    }

    return NextResponse.json(
      { message: "Transaction created successfully!", data: transaction },
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
