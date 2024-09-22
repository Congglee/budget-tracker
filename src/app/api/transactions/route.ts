import { getHistoriesByTransactionsDate } from "@/data/history";
import {
  getTransactionsByIds,
  verifyUserTransactions,
} from "@/data/transaction";
import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { formatZodErrors, normalizeDate } from "@/lib/utils";
import {
  AddTransactionSchema,
  DeleteTransactionsSchema,
} from "@/schemas/transaction";
import { Transaction, TransactionType } from "@prisma/client";
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

export async function DELETE(req: Request) {
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
    const { list_id } = DeleteTransactionsSchema.parse(body);

    const checkTransactions = await verifyUserTransactions(userId, list_id);
    if (!checkTransactions) {
      throw new Error("Transactions not found");
    }

    const transactions = await getTransactionsByIds(list_id, userId);
    if (transactions.length > 0) {
      const transactionsByDate: Record<string, Transaction[]> = {};
      const transactionsByBudget: Record<string, Transaction[]> = {};

      for (const transaction of transactions) {
        const dateKey = `${transaction.date.getUTCDate()}-${
          transaction.date.getUTCMonth() + 1
        }-${transaction.date.getUTCFullYear()}`;

        if (!transactionsByDate[dateKey]) {
          transactionsByDate[dateKey] = [];
        }
        transactionsByDate[dateKey].push(transaction);

        if (
          transaction.type === TransactionType.EXPENSE &&
          transaction.budgetId
        ) {
          if (!transactionsByBudget[transaction.budgetId]) {
            transactionsByBudget[transaction.budgetId] = [];
          }
          transactionsByBudget[transaction.budgetId].push(transaction);
        }
      }

      const histories = await getHistoriesByTransactionsDate(
        transactionsByDate,
        userId
      );

      const historyUpdates = histories.map((history) => {
        const dateKey = `${history.day}-${history.month}-${history.year}`;
        const relatedTransactions = transactionsByDate[dateKey] || [];

        let newIncome = history.income;
        let newExpense = history.expense;

        for (const transaction of relatedTransactions) {
          if (transaction.type === TransactionType.INCOME) {
            newIncome -= transaction.amount;
          } else if (transaction.type === TransactionType.EXPENSE) {
            newExpense -= transaction.amount;
          }
        }

        newIncome = Math.max(newIncome, 0);
        newExpense = Math.max(newExpense, 0);

        if (newIncome === 0 && newExpense === 0) {
          return prisma.history.delete({ where: { id: history.id } });
        } else {
          return prisma.history.update({
            where: { id: history.id },
            data: { income: newIncome, expense: newExpense },
          });
        }
      });

      const budgetUpdates = Object.entries(transactionsByBudget).map(
        ([budgetId, transactions]) => {
          const totalAmount = transactions.reduce(
            (sum, t) => sum + t.amount,
            0
          );
          return prisma.budget.update({
            where: { id: budgetId },
            data: {
              totalSpent: { decrement: totalAmount },
              remaining: { increment: totalAmount },
            },
          });
        }
      );

      await Promise.all([...historyUpdates, ...budgetUpdates]);
    }

    const deletedTransactions = await prisma.transaction.deleteMany({
      where: { id: { in: list_id }, userId: user.id },
    });
    return NextResponse.json(
      {
        message: `Delete ${deletedTransactions.count} transactions successfully`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message ?? "Internal server error" } },
      { status: error.status ?? 500 }
    );
  }
}
