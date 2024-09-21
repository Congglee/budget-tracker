"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { ENTITY_ERROR_STATUS, EntityErrorPayload } from "@/lib/helper";
import { formatZodErrors } from "@/lib/utils";
import { NewPasswordSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function newPassword(
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) {
  if (!token) {
    return {
      error: { status: 400, payload: { message: "Missing token!" } },
    };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    const errors = formatZodErrors(validatedFields.error.errors);
    const errorPayload: EntityErrorPayload = {
      message: "Validation errors",
      errors,
    };
    return { error: { status: ENTITY_ERROR_STATUS, payload: errorPayload } };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: { status: 404, payload: { message: "Invalid token!" } } };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return {
      error: { status: 400, payload: { message: "Token has expired!" } },
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: { status: 404, payload: { message: "Email does not exist!" } },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { message: "Password updated successfully!" };
}
