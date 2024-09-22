import { currencies } from "@/config/options";
import { SearchParams } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { ZodIssue } from "zod";
import { download, generateCsv } from "export-to-csv";
import { csvConfig } from "@/config/csv";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZodErrors(errors: ZodIssue[]) {
  return errors.map((error) => ({
    field: error.path.join("."),
    message: error.message,
  }));
}

export function normalizeDate(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  );
}

export function parseDateRangeParams({ from, to }: SearchParams) {
  if (!from || isNaN(Date.parse(from)) || !to || isNaN(Date.parse(to))) {
    return undefined;
  }

  return {
    from: normalizeDate(new Date(from)),
    to: normalizeDate(new Date(to)),
  };
}

export function parseTimeFrameParams(searchParams: SearchParams) {
  const now = new Date();
  const timeFrame = searchParams.time_frame || "year";

  const year = searchParams.year
    ? Number(searchParams.year)
    : now.getFullYear();
  const month = searchParams.month
    ? Number(searchParams.month)
    : now.getMonth() + 1;

  return { timeFrame, year, month };
}

export function generateVercelAvatar(name: string) {
  return `https://avatar.vercel.sh/${name.replace(/\s+/g, "-").toLowerCase()}`;
}

export function buildQueryString(params: any) {
  const queryString = Object.keys(params)
    .filter(
      (key) =>
        params[key] !== "" && params[key] !== undefined && params[key] !== null
    )
    .map(
      (key: string) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");

  return queryString;
}

export function getCurrencyLabel(currencyCode: string) {
  const currency = currencies.find((c) => c.value === currencyCode) as {
    value: string;
    label: string;
  };
  return currency.label || currencies[0].label;
}

export function formatCurrency(currency: string) {
  const locale = currencies.find((c) => c.value === currency)?.locale;
  return new Intl.NumberFormat(locale, { style: "currency", currency });
}

export function formatDateRange(from: string, to: string, dateFormat?: string) {
  const formatString = dateFormat ? dateFormat : "MMM d, yyyy";
  return `${format(from, formatString)} - ${format(to, formatString)}`;
}

export function exportToCsv(data: any[], filename?: string) {
  const csvOutput = generateCsv(csvConfig)(data);
  download({ ...csvConfig, filename: filename || "generated" })(csvOutput);
}
