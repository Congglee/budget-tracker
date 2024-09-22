import prisma from "@/lib/prisma";

export async function getBudgetById(id: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id },
    });

    return budget;
  } catch {
    return null;
  }
}
