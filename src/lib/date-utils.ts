// ============================================================================
//  Date helpers — Jalali-aware utilities built on Intl + Date
// ============================================================================

import { formatJalali, formatJalaliShort } from "./persian";

export { formatJalali, formatJalaliShort };

export function jalaliToday(): Date {
  return new Date();
}

export function jalaliPlusDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function jalaliPlusMonths(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d;
}

/** Returns an array of the next N months for calendar grids */
export function upcomingMonths(count: number): { year: number; month: number; label: string }[] {
  const out: { year: number; month: number; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    out.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: new Intl.DateTimeFormat("fa-IR", { month: "long", year: "numeric" }).format(d),
    });
  }
  return out;
}
