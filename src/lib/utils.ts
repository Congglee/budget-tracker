import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZodErrors(errors: ZodIssue[]) {
  return errors.map((error) => ({
    field: error.path.join("."),
    message: error.message,
  }));
}

export function generateVercelAvatar(name: string) {
  return `https://avatar.vercel.sh/${name.replace(/\s+/g, "-").toLowerCase()}`;
}
