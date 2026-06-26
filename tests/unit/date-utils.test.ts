import { describe, it, expect, vi } from "vitest";
import { jalaliToday, jalaliPlusDays, jalaliPlusMonths, upcomingMonths } from "@/lib/date-utils";

describe("jalaliToday", () => { it("returns a Date close to now", () => { expect(Math.abs(jalaliToday().getTime() - Date.now())).toBeLessThan(1000); }); });

describe("jalaliPlusDays", () => {
  it("returns a date N days in the future", () => { vi.useFakeTimers(); vi.setSystemTime(new Date("2024-07-01T12:00:00Z")); expect(jalaliPlusDays(7).getDate()).toBe(8); vi.useRealTimers(); });
  it("handles zero days", () => { vi.useFakeTimers(); vi.setSystemTime(new Date("2024-07-01T12:00:00Z")); expect(jalaliPlusDays(0).getDate()).toBe(1); vi.useRealTimers(); });
  it("handles negative days", () => { vi.useFakeTimers(); vi.setSystemTime(new Date("2024-07-10T12:00:00Z")); expect(jalaliPlusDays(-5).getDate()).toBe(5); vi.useRealTimers(); });
});

describe("jalaliPlusMonths", () => {
  it("adds months to current date", () => { vi.useFakeTimers(); vi.setSystemTime(new Date("2024-01-15T12:00:00Z")); expect(jalaliPlusMonths(2).getMonth()).toBe(2); vi.useRealTimers(); });
});

describe("upcomingMonths", () => {
  it("returns N months starting from current", () => { vi.useFakeTimers(); vi.setSystemTime(new Date("2024-01-15T12:00:00Z")); const r = upcomingMonths(3); expect(r).toHaveLength(3); expect(r[0].month).toBe(0); expect(r[1].month).toBe(1); expect(r[2].month).toBe(2); vi.useRealTimers(); });
  it("each entry has year, month, and label", () => { const r = upcomingMonths(1); expect(r[0]).toHaveProperty("year"); expect(r[0]).toHaveProperty("month"); expect(r[0]).toHaveProperty("label"); });
  it("handles year rollover", () => { vi.useFakeTimers(); vi.setSystemTime(new Date("2024-11-15T12:00:00Z")); const r = upcomingMonths(3); expect(r[2].month).toBe(0); expect(r[2].year).toBe(2025); vi.useRealTimers(); });
});
