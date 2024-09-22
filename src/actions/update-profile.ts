"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { generateVerificationToken } from "@/lib/tokens";
import { UpdateProfileSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function updateProfile(
  values: z.infer<typeof UpdateProfileSchema>
) {
  const user = await currentUser();
  if (!user) {
    return { error: { status: 401, payload: "Unauthorized" } };
  }

  const userId = user.id as string;

  const userDB = await getUserById(userId);
  if (!userDB) {
    return { error: { status: 401, payload: "Unauthorized" } };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== userId) {
      return {
        error: {
          status: 400,
          payload: { message: "Email already in use!" },
        },
      };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { message: "Verification email sent!" };
  }

  if (values.password && values.newPassword && userDB.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      userDB.password
    );

    if (!passwordsMatch) {
      return {
        error: { status: 400, payload: { message: "Incorrect password!" } },
      };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { ...values },
  });

  return { message: "Profile updated!" };
}
