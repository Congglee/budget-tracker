import prisma from "@/lib/prisma";

export async function getTwoFactorConfirmationByUserId(userId: string) {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      { where: { userId } }
    );

    return twoFactorConfirmation;
  } catch {
    return null;
  }
}
