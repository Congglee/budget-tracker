import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name" }),
  icon: z.string(),
  type: z.enum(["income", "expense"]), // Required for the category type
});
