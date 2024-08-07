import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getUserSettings(userId: User["id"]) {
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (!userSettings) {
    await prisma.userSettings.create({
      data: { userId, currency: "USD" },
    });
  }

  return userSettings;
}
