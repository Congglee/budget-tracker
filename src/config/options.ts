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
  value: "income" | "expense";
  label: string;
}> = [
  { value: "income", label: "Income 🤑" },
  { value: "expense", label: "Expense 😤" },
];
