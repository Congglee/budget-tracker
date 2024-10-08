import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required and must be valid" }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email is required and must be valid" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required and must be valid" }),
});

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Minimum 6 characters required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const UpdateProfileSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    image: z.optional(z.string().url({ message: "Invalid image URL" })),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    { message: "New password is required!", path: ["newPassword"] }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    { message: "Password is required!", path: ["password"] }
  );
