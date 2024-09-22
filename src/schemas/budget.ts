import { z } from "zod";

export const AddBudgetSchema = z
  .object({
    name: z.string().min(1, { message: "Please enter a budget name" }),
    amount: z.coerce
      .number()
      .positive({ message: "Amount must be greater than 0" })
      .multipleOf(0.01, { message: "Amount must be in 2 decimal places" }),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
    category: z.string().min(1, { message: "Please select a category" }),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.start_date <= data.end_date;
      }
      return true;
    },
    {
      message: "End date cannot be less than start date",
      path: ["end_date"],
    }
  )
  .refine(
    (data) => {
      if (data.start_date && !data.end_date) {
        return false;
      }
      return true;
    },
    {
      message: "Both start date and end date must be set together",
      path: ["start_date"],
    }
  )
  .refine(
    (data) => {
      if (data.end_date && !data.start_date) {
        return false;
      }
      return true;
    },
    {
      message: "Both start date and end date must be set together",
      path: ["end_date"],
    }
  );
