import { getBudgets, getUniqueBudget } from "@/data/budget";
import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { formatZodErrors, normalizeDate } from "@/lib/utils";
import { AddBudgetSchema } from "@/schemas/budget";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const userId = user.id as string;

  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const keyword = searchParams.get("keyword");
    const categoryIds = searchParams.getAll("categoryIds");

    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (keyword) {
      where.OR = [{ name: { contains: keyword.toLowerCase() } }];
    }

    if (categoryIds.length > 0) {
      where.categoryId = { in: categoryIds };
    }

    const budgets = await getBudgets({ condition: where, limit, skip });

    const totalCount = await prisma.budget.count({ where });

    const response = {
      message: "Get User Budgets",
      data: {
        budgets,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message ?? "Internal server error" } },
      { status: error.status ?? 500 }
    );
  }
}

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

    const existingBudget = await getUniqueBudget(name, userId);
    if (existingBudget) {
      throw new Error("Budget already exists");
    }

    const budget = await prisma.budget.create({
      data: {
        name,
        amount,
        remaining: amount,
        categoryId: category,
        userId,
        startDate,
        endDate,
      },
    });

    return NextResponse.json(
      { message: "Budget created successfully", data: budget },
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
