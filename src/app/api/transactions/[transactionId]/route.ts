import { getTransactionById, verifyUserTransaction } from "@/data/transaction";
import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { formatZodErrors, normalizeDate } from "@/lib/utils";
import { AddTransactionSchema } from "@/schemas/transaction";
import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const RouteContextSchema = z.object({
  params: z.object({
    transactionId: z.string().uuid(),
  }),
});

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
    const checkTransaction = await verifyUserTransaction(
      userId,
      params.transactionId
    );
    if (!checkTransaction) {
      throw new Error("Transaction not found");
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

    const currentTransaction = await getTransactionById(params.transactionId);
    if (!currentTransaction) {
      throw new Error("Transaction not found");
    }

    const currentDate = new Date(currentTransaction.date);

    await prisma.$transaction(async (ctx) => {
      await ctx.transaction.update({
        where: { id: params.transactionId },
        data: {
          name,
          amount,
          description,
          date: transactionDate,
          type,
          categoryId: category,
          budgetId: budget ? budget : null,
          updatedAt: new Date(),
        },
      });

      if (currentTransaction.budgetId) {
        const oldBudget = await ctx.budget.findUnique({
          where: { id: currentTransaction.budgetId },
        });
        if (oldBudget) {
          const amountDiff = amount - currentTransaction.amount;

          if (type !== currentTransaction.type) {
            if (type === TransactionType.INCOME) {
              await ctx.budget.update({
                where: { id: oldBudget.id },
                data: {
                  totalSpent: { decrement: currentTransaction.amount },
                  remaining: { increment: currentTransaction.amount },
                },
              });
            } else {
              await ctx.budget.update({
                where: { id: oldBudget.id },
                data: {
                  totalSpent: { increment: amount },
                  remaining: { decrement: amount },
                },
              });
            }
          } else if (budget === currentTransaction.budgetId) {
            await ctx.budget.update({
              where: { id: oldBudget.id },
              data: {
                totalSpent: { increment: amountDiff },
                remaining: { decrement: amountDiff },
              },
            });
          } else {
            await ctx.budget.update({
              where: { id: oldBudget.id },
              data: {
                totalSpent: { decrement: currentTransaction.amount },
                remaining: { increment: currentTransaction.amount },
              },
            });

            if (budget) {
              await ctx.budget.update({
                where: { id: budget },
                data: {
                  totalSpent: { increment: amount },
                  remaining: { decrement: amount },
                },
              });
            }
          }
        }
      } else if (budget) {
        await ctx.budget.update({
          where: { id: budget },
          data: {
            totalSpent: { increment: amount },
            remaining: { decrement: amount },
          },
        });
      }

      const oldHistory = await ctx.history.findFirst({
        where: {
          userId: user.id,
          day: currentDate.getUTCDate(),
          month: currentDate.getUTCMonth() + 1,
          year: currentDate.getUTCFullYear(),
        },
      });
      if (oldHistory) {
        const fieldToUpdate =
          currentTransaction.type === TransactionType.INCOME
            ? "income"
            : "expense";
        const newAmount = oldHistory[fieldToUpdate] - currentTransaction.amount;

        if (
          newAmount <= 0 &&
          oldHistory.income + oldHistory.expense - currentTransaction.amount <=
            0
        ) {
          await ctx.history.delete({ where: { id: oldHistory.id } });
        } else {
          await ctx.history.update({
            where: { id: oldHistory.id },
            data: { [fieldToUpdate]: Math.max(newAmount, 0) },
          });
        }
      }

      await ctx.history.upsert({
        where: {
          day_month_year_userId: {
            day: transactionDate.getUTCDate(),
            month: transactionDate.getUTCMonth() + 1,
            year: transactionDate.getUTCFullYear(),
            userId,
          },
        },
        update: {
          income:
            type === TransactionType.INCOME ? { increment: amount } : undefined,
          expense:
            type === TransactionType.EXPENSE
              ? { increment: amount }
              : undefined,
        },
        create: {
          day: transactionDate.getUTCDate(),
          month: transactionDate.getUTCMonth() + 1,
          year: transactionDate.getUTCFullYear(),
          income: type === TransactionType.INCOME ? amount : 0,
          expense: type === TransactionType.EXPENSE ? amount : 0,
          userId,
        },
      });
    });

    return NextResponse.json(
      { message: "Transaction updated successfully" },
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
    const checkTransaction = await verifyUserTransaction(
      userId,
      params.transactionId
    );
    if (!checkTransaction) {
      throw new Error("Transaction not found");
    }

    const transaction = await prisma.transaction.delete({
      where: { id: params.transactionId },
    });

    if (transaction) {
      const history = await prisma.history.update({
        where: {
          day_month_year_userId: {
            day: transaction.date.getUTCDate(),
            month: transaction.date.getUTCMonth() + 1,
            year: transaction.date.getUTCFullYear(),
            userId,
          },
        },
        data: {
          ...(transaction.type === TransactionType.INCOME && {
            income: { decrement: transaction.amount },
          }),
          ...(transaction.type === TransactionType.EXPENSE && {
            expense: { decrement: transaction.amount },
          }),
        },
      });

      if (history && history.income === 0 && history.expense === 0) {
        await prisma.history.delete({ where: { id: history.id } });
      }

      if (
        transaction.type === TransactionType.EXPENSE &&
        transaction.budgetId
      ) {
        await prisma.budget.update({
          where: { id: transaction.budgetId },
          data: {
            totalSpent: { decrement: transaction.amount },
            remaining: { increment: transaction.amount },
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message ?? "Internal server error" } },
      { status: error.status ?? 500 }
    );
  }
}
