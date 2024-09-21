"use server";

import { ENTITY_ERROR_STATUS, EntityErrorPayload } from "@/lib/helper";
import { formatZodErrors, generateVercelAvatar } from "@/lib/utils";
import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    const errors = formatZodErrors(validatedFields.error.errors);
    const errorPayload: EntityErrorPayload = {
      message: "Validation errors",
      errors,
    };
    return { error: { status: ENTITY_ERROR_STATUS, payload: errorPayload } };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      error: { status: 400, payload: { message: "Email already in use!" } },
    };
  }

  const avatar = generateVercelAvatar(name);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      image: avatar,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { message: "Confirmation email sent!" };
}
