import { TransactionType } from "@/types";
import { format, setMonth } from "date-fns";

export type Option<T = string> = {
  value: T;
  label: string;
  locale?: string;
};

export const currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
];

export const transactionTypesOptions: Array<{
  value: TransactionType;
  label: string;
}> = [
  { value: "income", label: "Income 🤑" },
  { value: "expense", label: "Expense 😤" },
];

export const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const date = setMonth(new Date(), i);
  return {
    value: (i + 1).toString(),
    label: format(date, "MMMM"),
  };
});

export function generateYearOptions(startYear: number, endYear: number) {
  const yearOptions = [];
  for (let year = startYear; year <= endYear; year++) {
    yearOptions.push({
      value: year.toString(),
      label: year.toString(),
    });
  }
  return yearOptions;
}
