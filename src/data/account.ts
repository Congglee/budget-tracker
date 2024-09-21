import prisma from "@/lib/prisma";

export async function getAccountByUserId(userId: string) {
  try {
    const account = await prisma.account.findFirst({
      where: { userId },
    });

    return account;
  } catch {
    return null;
  }
}
