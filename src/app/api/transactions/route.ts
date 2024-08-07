import { TransactionType } from "@/constants/type";
import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { normalizeDate } from "@/lib/utils";
import { transactionCreateSchema } from "@/lib/validations/transaction";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user } = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsedData = transactionCreateSchema.safeParse(body);
    if (!parsedData.success) {
      const errors = parsedData.error.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }));
      throw new EntityError({
        status: 422,
        payload: { message: "Validation Error", errors },
      });
    }

    const { name, amount, description, date, type, category } = parsedData.data;

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
        userId: user.id,
        categoryId: category,
      },
    });

    if (transaction) {
      await prisma.history.upsert({
        where: { day_month_year_userId: { day, month, year, userId: user.id } },
        create: {
          userId: user.id,
          day,
          month,
          year,
          income: type === TransactionType.Income ? amount : 0,
          expense: type === TransactionType.Expense ? amount : 0,
        },
        update: {
          income: { increment: type === TransactionType.Income ? amount : 0 },
          expense: {
            increment: type === TransactionType.Expense ? amount : 0,
          },
        },
      });
    }

    return NextResponse.json(
      { message: "Transaction created successfully", data: transaction },
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
