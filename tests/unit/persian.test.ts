import { describe, it, expect } from "vitest";
import { toPersianDigits, toEnglishDigits, formatNumber, formatToman, formatTomanCompact, pricePerNightLabel, truncate, ratingLabel, pluralFa, nightsBetween } from "@/lib/persian";

describe("toPersianDigits", () => {
  it("converts English digits to Persian", () => { expect(toPersianDigits("123456")).toBe("۱۲۳۴۵۶"); expect(toPersianDigits(7890)).toBe("۷۸۹۰"); });
  it("converts digits within mixed text", () => { expect(toPersianDigits("قیمت: 4500000 تومان")).toBe("قیمت: ۴۵۰۰۰۰۰ تومان"); });
  it("handles empty strings", () => { expect(toPersianDigits("")).toBe(""); });
  it("returns strings without digits unchanged", () => { expect(toPersianDigits("ویلاستا")).toBe("ویلاستا"); });
  it("handles all digits 0-9", () => { expect(toPersianDigits("0123456789")).toBe("۰۱۲۳۴۵۶۷۸۹"); });
  it("handles large numbers", () => { expect(toPersianDigits(1000000)).toBe("۱۰۰۰۰۰۰"); });
});

describe("toEnglishDigits", () => {
  it("converts Persian digits to English", () => { expect(toEnglishDigits("۱۲۳۴۵۶")).toBe("123456"); });
  it("converts Arabic-Indic digits to English", () => { expect(toEnglishDigits("١٢٣٤٥٦")).toBe("123456"); });
  it("converts mixed Persian and Arabic digits", () => { expect(toEnglishDigits("۱۲٣٤۵۶")).toBe("123456"); });
  it("leaves English digits unchanged", () => { expect(toEnglishDigits("123456")).toBe("123456"); });
  it("handles text with digits", () => { expect(toEnglishDigits("قیمت: ۴۵۰۰۰۰۰ تومان")).toBe("قیمت: 4500000 تومان"); });
});

describe("formatNumber", () => {
  it("formats numbers with thousands separators", () => { expect(formatNumber(4500000)).toBe("۴,۵۰۰,۰۰۰"); });
  it("formats small numbers without separators", () => { expect(formatNumber(42)).toBe("۴۲"); });
  it("handles zero", () => { expect(formatNumber(0)).toBe("۰"); });
  it("rounds decimal numbers", () => { expect(formatNumber(4500000.9)).toBe("۴,۵۰۰,۰۰۱"); });
  it("handles negative numbers", () => { expect(formatNumber(-1000)).toBe("-۱,۰۰۰"); });
});

describe("formatToman", () => {
  it("appends تومان suffix", () => { expect(formatToman(4500000)).toBe("۴,۵۰۰,۰۰۰ تومان"); });
  it("formats small amounts", () => { expect(formatToman(500)).toBe("۵۰۰ تومان"); });
  it("handles zero", () => { expect(formatToman(0)).toBe("۰ تومان"); });
});

describe("formatTomanCompact", () => {
  it("formats billions", () => { expect(formatTomanCompact(1_500_000_000)).toBe("۱.۵ میلیارد"); });
  it("formats millions", () => { expect(formatTomanCompact(4_500_000)).toBe("۴.۵ میلیون"); expect(formatTomanCompact(2_000_000)).toBe("۲.۰ میلیون"); });
  it("formats thousands", () => { expect(formatTomanCompact(45_000)).toBe("۴۵ هزار"); expect(formatTomanCompact(100_000)).toBe("۱۰۰ هزار"); });
  it("returns full number for amounts under 1000", () => { expect(formatTomanCompact(500)).toBe("۵۰۰"); });
  it("handles exactly 1 million", () => { expect(formatTomanCompact(1_000_000)).toBe("۱.۰ میلیون"); });
  it("handles exactly 1 billion", () => { expect(formatTomanCompact(1_000_000_000)).toBe("۱.۰ میلیارد"); });
});

describe("pricePerNightLabel", () => {
  it("appends / شب suffix", () => { expect(pricePerNightLabel(4_500_000)).toBe("۴.۵ میلیون / شب"); });
});

describe("truncate", () => {
  it("truncates long text with ellipsis", () => { expect(truncate("ویلا لوکس ساحلی کیش", 10)).toBe("ویلا لوکس…"); });
  it("returns short text unchanged", () => { expect(truncate("ویلا", 10)).toBe("ویلا"); });
  it("returns text at max length unchanged", () => { const t = "۰۱۲۳۴۵"; expect(truncate(t, 6)).toBe(t); });
  it("handles empty string", () => { expect(truncate("", 10)).toBe(""); });
});

describe("ratingLabel", () => {
  it('returns "عالی" for ratings >= 4.8', () => { expect(ratingLabel(4.9)).toBe("عالی"); expect(ratingLabel(5.0)).toBe("عالی"); expect(ratingLabel(4.8)).toBe("عالی"); });
  it('returns "بسیار خوب" for ratings 4.5–4.7', () => { expect(ratingLabel(4.7)).toBe("بسیار خوب"); expect(ratingLabel(4.5)).toBe("بسیار خوب"); });
  it('returns "خوب" for ratings 4.0–4.4', () => { expect(ratingLabel(4.4)).toBe("خوب"); expect(ratingLabel(4.0)).toBe("خوب"); });
  it('returns "متوسط" for ratings 3.5–3.9', () => { expect(ratingLabel(3.9)).toBe("متوسط"); expect(ratingLabel(3.5)).toBe("متوسط"); });
  it('returns "ضعیف" for ratings below 3.5', () => { expect(ratingLabel(3.4)).toBe("ضعیف"); expect(ratingLabel(0)).toBe("ضعیف"); });
});

describe("pluralFa", () => {
  it("uses singular form when count is 1", () => { expect(pluralFa(1, "خوابگاه", "خوابگاه")).toBe("۱ خوابگاه"); });
  it("uses plural form when count is not 1", () => { expect(pluralFa(3, "خوابگاه", "خوابگاه")).toBe("۳ خوابگاه"); });
  it("uses plural form for zero", () => { expect(pluralFa(0, "اقامتگاه", "اقامتگاه")).toBe("۰ اقامتگاه"); });
});

describe("nightsBetween", () => {
  it("calculates nights between two dates", () => { expect(nightsBetween(new Date("2024-07-01"), new Date("2024-07-05"))).toBe(4); });
  it("returns minimum 1 night for same-day", () => { const d = new Date("2024-07-01"); expect(nightsBetween(d, d)).toBe(1); });
  it("returns minimum 1 night for past dates", () => { expect(nightsBetween(new Date("2024-07-05"), new Date("2024-07-01"))).toBe(1); });
  it("handles week-long stays", () => { expect(nightsBetween(new Date("2024-07-01"), new Date("2024-07-08"))).toBe(7); });
  it("handles month-long stays", () => { expect(nightsBetween(new Date("2024-07-01"), new Date("2024-08-01"))).toBe(31); });
});
