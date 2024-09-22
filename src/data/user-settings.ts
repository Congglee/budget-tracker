import prisma from "@/lib/prisma";

export async function getUserSettingsById(id: string) {
  try {
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: id },
    });

    return userSettings;
  } catch {
    return null;
  }
}

export async function getOrCreateUserSettings(id: string) {
  const userSettings = await prisma.userSettings.upsert({
    where: { userId: id },
    update: {},
    create: { userId: id, currency: "USD" },
  });

  return userSettings;
}
