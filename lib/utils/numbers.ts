/**
 * Converts English digits to Persian numerals
 * @param value - The number or string to convert
 * @returns String with Persian numerals
 */
export function toPersianNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const stringValue = String(value);
  let result = "";

  for (let i = 0; i < stringValue.length; i++) {
    const char = stringValue[i];
    const digitIndex = englishDigits.indexOf(char);
    if (digitIndex !== -1) {
      result += persianDigits[digitIndex];
    } else {
      result += char;
    }
  }

  return result;
}

/**
 * Formats a number with Persian numerals and locale string formatting
 * @param value - The number to format
 * @param options - Optional formatting options (same as toLocaleString)
 * @returns Formatted string with Persian numerals
 */
export function formatPersianNumber(
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions,
): string {
  if (value === null || value === undefined) {
    return "";
  }

  const formatted = value.toLocaleString("en-US", options);
  return toPersianNumber(formatted);
}

/**
 * Formats currency with Persian numerals
 * @param value - The number to format as currency
 * @param currency - Currency symbol (default: "$")
 * @returns Formatted currency string with Persian numerals
 */
export function formatPersianCurrency(
  value: number | null | undefined,
  currency: string = "$",
): string {
  if (value === null || value === undefined || value <= 0) {
    return "—";
  }

  const formatted = value.toLocaleString("en-US");
  return `${currency}${toPersianNumber(formatted)}`;
}

