import { z } from "zod";

export const transactionCreateSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name" }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0" })
    .multipleOf(0.01, { message: "Amount must be in 2 decimal places" }),
  category: z.string().min(1, { message: "Please select a category" }),
  date: z.coerce.date(),
  description: z.string().optional(),
  type: z.union([z.literal("income"), z.literal("expense")]), // Optional for the transaction type
});
