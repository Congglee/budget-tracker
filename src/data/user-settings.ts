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
