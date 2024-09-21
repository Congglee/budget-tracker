import { TransactionType } from "@prisma/client";
import { z } from "zod";

export const AddCategorySchema = z.object({
  name: z.string().min(1, { message: "Please enter a category name" }),
  icon: z.string(),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]),
});
