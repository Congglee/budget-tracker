"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import {
  AUTHENTICATION_ERROR_STATUS,
  ENTITY_ERROR_STATUS,
  EntityErrorPayload,
} from "@/lib/helper";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { formatZodErrors } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    const errors = formatZodErrors(validatedFields.error.errors);
    const errorPayload: EntityErrorPayload = {
      message: "Validation errors",
      errors,
    };
    return { error: { status: ENTITY_ERROR_STATUS, payload: errorPayload } };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: {
        status: 404,
        payload: { message: "Email does not exist!" },
      },
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email as string
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { message: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return {
          error: { status: 400, payload: { message: "Invalid code!" } },
        };
      }

      if (twoFactorToken.token !== code) {
        return {
          error: { status: 400, payload: { message: "Invalid code!" } },
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return {
          error: { status: 400, payload: { message: "Code has expired!" } },
        };
      }

      await prisma.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        existingUser.password
      );
      if (!passwordsMatch) {
        return {
          error: {
            status: 400,
            payload: { message: "Invalid email or password!" },
          },
        };
      }

      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { message: "Two-factor code sent!", data: { twoFactor: true } };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: {
              status: AUTHENTICATION_ERROR_STATUS,
              payload: { message: "Invalid email or password!" },
            },
          };
        default:
          return {
            error: {
              status: 500,
              payload: { message: "Something went wrong!" },
            },
          };
      }
    }
    throw error;
  }
}
