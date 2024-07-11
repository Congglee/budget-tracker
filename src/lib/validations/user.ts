import { z } from "zod";

export const userSettingsCreateSchema = z.object({
  currency: z
    .string()
    .min(1, { message: "Please select a currency" })
    .min(3)
    .max(32),
});
