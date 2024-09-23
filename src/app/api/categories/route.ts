import { getUniqueCategory, verifyUserCategories } from "@/data/category";
import { getTransactionsByCategoryIds } from "@/data/transaction";
import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { formatZodErrors } from "@/lib/utils";
import { AddCategorySchema, DeleteCategoriesSchema } from "@/schemas/category";
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
    const parsedData = AddCategorySchema.safeParse(body);
    if (!parsedData.success) {
      const errors = formatZodErrors(parsedData.error.errors);
      throw new EntityError({
        status: 422,
        payload: { message: "Validation Error", errors },
      });
    }

    const { name, icon, type } = parsedData.data;
    const existingCategory = await getUniqueCategory(name, type, userId);
    if (existingCategory) {
      throw new Error("Category already exists");
    }

    const category = await prisma.category.create({
      data: { name, icon, type, userId },
    });

    return NextResponse.json(
      { message: "Category created successfully", data: category },
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
    const { list_id } = DeleteCategoriesSchema.parse(body);

    const checkCategories = await verifyUserCategories(userId, list_id);
    if (!checkCategories) {
      throw new Error("Categories not found");
    }

    const categoriesTransactions = await getTransactionsByCategoryIds(list_id);
    if (categoriesTransactions.length > 0) {
      throw new Error("Categories are being used in transactions");
    }

    const deletedCategories = await prisma.category.deleteMany({
      where: { id: { in: list_id }, userId: user.id },
    });

    return NextResponse.json(
      { message: `Delete ${deletedCategories.count} categories successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message ?? "Internal server error" } },
      { status: error.status ?? 500 }
    );
  }
}
