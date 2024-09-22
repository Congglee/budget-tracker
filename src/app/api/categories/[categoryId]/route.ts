import { getUniqueCategory, verifyUserCategory } from "@/data/category";
import { getTransactionsByCategoryId } from "@/data/transaction";
import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { formatZodErrors } from "@/lib/utils";
import { AddCategorySchema } from "@/schemas/category";
import { NextResponse } from "next/server";
import { z } from "zod";

const RouteContextSchema = z.object({
  params: z.object({
    categoryId: z.string().uuid(),
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
    const checkCategory = await verifyUserCategory(userId, params.categoryId);
    if (!checkCategory) {
      throw new Error("Category not found");
    }

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

    const existingCategory = await getUniqueCategory(
      name,
      type,
      userId,
      params.categoryId
    );
    if (existingCategory) {
      throw new Error("Category already exists");
    }

    const category = await prisma.category.update({
      where: { id: params.categoryId },
      data: { name, icon, type, updatedAt: new Date() },
    });

    return NextResponse.json(
      { message: "Category updated successfully", data: category },
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
    const checkCategory = await verifyUserCategory(userId, params.categoryId);
    if (!checkCategory) {
      throw new Error("Category not found");
    }

    const categoryTransactions = await getTransactionsByCategoryId(
      params.categoryId
    );
    if (categoryTransactions.length > 0) {
      throw new Error("Category is in use");
    }
    await prisma.category.delete({ where: { id: params.categoryId } });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message ?? "Internal server error" } },
      { status: error.status ?? 500 }
    );
  }
}
