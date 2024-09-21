import { getUniqueCategory } from "@/data/category";
import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { formatZodErrors } from "@/lib/utils";
import { AddCategorySchema } from "@/schemas/category";
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
      throw new Error("Category already exists!");
    }

    const category = await prisma.category.create({
      data: { name, icon, type, userId },
    });

    return NextResponse.json(
      { message: "Category created successfully!", data: category },
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
