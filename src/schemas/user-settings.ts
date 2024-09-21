import { z } from "zod";

export const AddUserSettingsSchema = z.object({
  currency: z.string().min(1, { message: "Please select a currency" }).max(32),
});
