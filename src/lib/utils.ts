import { currencies } from "@/config/options";
import { SearchParams, TimeFrame } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
      // date.getHours(),
      // date.getMinutes(),
      // date.getSeconds(),
      // date.getMilliseconds()
    )
  );
}

export function parseDateRangeParams(searchParams: SearchParams) {
  if (
    !searchParams.from ||
    isNaN(Date.parse(searchParams.from)) ||
    !searchParams.to ||
    isNaN(Date.parse(searchParams.to))
  ) {
    const dateRange = {
      from: new Date(),
      to: new Date(),
    };
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    dateRange.from = oneYearAgo;

    return dateRange;
  }

  return {
    from: normalizeDate(new Date(searchParams.from)),
    to: normalizeDate(new Date(searchParams.to)),
  };
}

export function parseTimeFrameParams(searchParams: {
  time_frame?: TimeFrame;
  year?: string;
  month?: string;
}) {
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

export function formatCurrency(currency: string) {
  const locale = currencies.find((c) => c.value === currency)?.locale;
  return new Intl.NumberFormat(locale, { style: "currency", currency });
}

export function getCurrencyLabel(currencyCode: string) {
  const currency = currencies.find((c) => c.value === currencyCode) as {
    value: string;
    label: string;
  };
  return currency.label || currencies[0].label;
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
