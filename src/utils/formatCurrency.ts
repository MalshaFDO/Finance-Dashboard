import type { CurrencyCode } from "../types/currency";

const getLocaleForCurrency = (currency: CurrencyCode) => {
  if (currency === "LKR") return "en-LK";
  if (currency === "JPY") return "ja-JP";
  return "en-US";
};

const getFractionDigitsForCurrency = (currency: CurrencyCode) => {
  if (currency === "LKR" || currency === "JPY") return 0;
  return 2;
};

export const formatNumber = (value: number, currency: CurrencyCode) =>
  new Intl.NumberFormat(getLocaleForCurrency(currency), {
    style: "decimal",
    minimumFractionDigits: getFractionDigitsForCurrency(currency),
    maximumFractionDigits: getFractionDigitsForCurrency(currency),
  }).format(value);

export const formatCurrency = (value: number, currency: CurrencyCode) =>
  new Intl.NumberFormat(getLocaleForCurrency(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: getFractionDigitsForCurrency(currency),
    maximumFractionDigits: getFractionDigitsForCurrency(currency),
  }).format(value);

export const formatCurrencyCompact = (value: number, currency: CurrencyCode) => {
  const fractionDigits = currency === "LKR" || currency === "JPY" ? 0 : 1;

  return new Intl.NumberFormat(getLocaleForCurrency(currency), {
    style: "currency",
    currency,
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};

export const formatNumberCompact = (value: number, currency: CurrencyCode) => {
  const fractionDigits = currency === "LKR" || currency === "JPY" ? 0 : 1;

  return new Intl.NumberFormat(getLocaleForCurrency(currency), {
    style: "decimal",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};
