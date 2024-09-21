import { EntityError } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { formatZodErrors } from "@/lib/utils";
import { AddUserSettingsSchema } from "@/schemas/user-settings";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsedData = AddUserSettingsSchema.safeParse(body);
    if (!parsedData.success) {
      const errors = formatZodErrors(parsedData.error.errors);
      throw new EntityError({
        status: 422,
        payload: { message: "Validation Error", errors },
      });
    }
    const { currency } = parsedData.data;

    const userSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { currency },
      create: { userId: user.id as string, currency },
    });

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
