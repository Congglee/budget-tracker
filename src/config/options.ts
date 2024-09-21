import { TransactionType } from "@prisma/client";
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
  { value: TransactionType.INCOME, label: "INCOME 🤑" },
  { value: TransactionType.EXPENSE, label: "EXPENSE 😤" },
];

export const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const date = setMonth(new Date(), i);
  return {
    value: (i + 1).toString(),
    label: format(date, "MMMM"),
  };
});
