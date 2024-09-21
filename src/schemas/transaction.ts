import { TransactionType } from "@prisma/client";
import { z } from "zod";

export const AddTransactionSchema = z.object({
  name: z.string().min(1, { message: "Please enter a transaction name" }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0" })
    .multipleOf(0.01, { message: "Amount must be in 2 decimal places" }),
  category: z.string().min(1, { message: "Please select a category" }),
  budget: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
  type: z.nativeEnum(TransactionType), // Use nativeEnum to validate enum values
});
