export type CurrencyCode = "LKR" | "USD" | "EUR" | "GBP" | "JPY";

export const supportedCurrencies: Array<{ code: CurrencyCode; label: string }> = [
  { code: "LKR", label: "LKR" },
  { code: "USD", label: "USD" },
  { code: "EUR", label: "EUR" },
  { code: "GBP", label: "GBP" },
  { code: "JPY", label: "JPY" },
];

export const isCurrencyCode = (value: unknown): value is CurrencyCode =>
  value === "LKR" || value === "USD" || value === "EUR" || value === "GBP" || value === "JPY";
