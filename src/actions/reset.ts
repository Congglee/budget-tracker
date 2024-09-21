"use server";

import { getUserByEmail } from "@/data/user";
import { ENTITY_ERROR_STATUS, EntityErrorPayload } from "@/lib/helper";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { formatZodErrors } from "@/lib/utils";
import { ResetSchema } from "@/schemas";
import { z } from "zod";

export async function reset(values: z.infer<typeof ResetSchema>) {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    const errors = formatZodErrors(validatedFields.error.errors);
    const errorPayload: EntityErrorPayload = {
      message: "Validation errors",
      errors,
    };
    return { error: { status: ENTITY_ERROR_STATUS, payload: errorPayload } };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return {
      error: { status: 404, payload: { message: "Email not found!" } },
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { message: "Password reset email sent!" };
}
