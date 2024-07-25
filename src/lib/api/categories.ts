import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getCategoriesByType(userId: User["id"]) {
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  return categories;
}
