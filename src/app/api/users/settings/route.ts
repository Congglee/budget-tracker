import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { userSettingsCreateSchema } from "@/lib/validations/user";
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
    const parsedData = userSettingsCreateSchema.safeParse(body);
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
    const { currency } = parsedData.data;

    let userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    if (!userSettings) {
      userSettings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          currency,
        },
      });
    }

    return NextResponse.json(
      { message: "Settings saved successfully", data: userSettings },
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
