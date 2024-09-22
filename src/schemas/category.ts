import { TransactionType } from "@prisma/client";
import { z } from "zod";

export const AddCategorySchema = z.object({
  name: z.string().min(1, { message: "Please enter a category name" }),
  icon: z.string(),
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE]),
});

export const DeleteCategoriesSchema = z.object({
  list_id: z.array(z.string().uuid()).nonempty({
    message: "list_id must be a non-empty array of transaction ids",
  }),
});
