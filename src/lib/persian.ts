// ============================================================================
//  Persian Utilities — formatting, numbers, dates, currency
// ============================================================================

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert any number/string to Persian digits */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

/** Convert Persian/Arabic digits to English */
export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** Format a number with thousands separators (Persian digits) */
export function formatNumber(n: number): string {
  return toPersianDigits(Math.round(n).toLocaleString("en-US"));
}

/** Format Toman currency — e.g. 4,500,000 → "۴٬۵۰۰٬۰۰۰ تومان" */
export function formatToman(n: number): string {
  return `${formatNumber(n)} تومان`;
}

/** Compact Toman — e.g. 4_500_000 → "۴٫۵ میلیون" */
export function formatTomanCompact(n: number): string {
  if (n >= 1_000_000_000) return `${toPersianDigits((n / 1_000_000_000).toFixed(1))} میلیارد`;
  if (n >= 1_000_000) return `${toPersianDigits((n / 1_000_000).toFixed(1))} میلیون`;
  if (n >= 1_000) return `${toPersianDigits((n / 1_000).toFixed(0))} هزار`;
  return formatNumber(n);
}

/** Per-night price label */
export function pricePerNightLabel(n: number): string {
  return `${formatTomanCompact(n)} / شب`;
}

/** Truncate text with ellipsis */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

/** Relative time in Persian */
export function relativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (day > 30) return toPersianDigits(d.toLocaleDateString("fa-IR"));
  if (day > 0) return `${toPersianDigits(day)} روز پیش`;
  if (hour > 0) return `${toPersianDigits(hour)} ساعت پیش`;
  if (min > 0) return `${toPersianDigits(min)} دقیقه پیش`;
  return "لحظاتی پیش";
}

/** Simple Jalali (Persian solar) date formatter using Intl */
export function formatJalali(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opts,
  }).format(d);
}

export function formatJalaliShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric" }).format(d);
}

/** Night difference between two dates */
export function nightsBetween(checkIn: Date, checkOut: Date): number {
  return Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000));
}

/** Star rating → Persian label */
export function ratingLabel(r: number): string {
  if (r >= 4.8) return "عالی";
  if (r >= 4.5) return "بسیار خوب";
  if (r >= 4.0) return "خوب";
  if (r >= 3.5) return "متوسط";
  return "ضعیف";
}

/** Pluralize helper (simple Persian) */
export function pluralFa(n: number, singular: string, plural: string): string {
  return `${toPersianDigits(n)} ${n === 1 ? singular : plural}`;
}
