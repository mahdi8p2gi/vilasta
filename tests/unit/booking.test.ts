import { describe, it, expect } from "vitest";
import { calculateBookingPrice, validateBooking } from "@/lib/booking";

describe("calculateBookingPrice", () => {
  const base = { pricePerNight: 4_500_000, nights: 3, cleaningFee: 450_000, serviceFee: 225_000, weeklyDiscount: 10, monthlyDiscount: 20 };
  it("calculates total without discount for short stays", () => { const r = calculateBookingPrice(base); expect(r.subtotal).toBe(13_500_000); expect(r.discount).toBe(0); expect(r.discountLabel).toBe(""); expect(r.total).toBe(14_175_000); });
  it("applies weekly discount for 7+ night stays", () => { const r = calculateBookingPrice({ ...base, nights: 7 }); expect(r.subtotal).toBe(31_500_000); expect(r.discount).toBe(3_150_000); expect(r.discountLabel).toContain("هفتگی"); });
  it("applies monthly discount for 30+ night stays", () => { const r = calculateBookingPrice({ ...base, nights: 30 }); expect(r.discount).toBe(27_000_000); expect(r.discountLabel).toContain("ماهانه"); });
  it("prefers monthly over weekly discount for 30+ nights", () => { const r = calculateBookingPrice({ ...base, nights: 30 }); expect(r.discountLabel).toContain("ماهانه"); expect(r.discountLabel).not.toContain("هفتگی"); });
  it("does not apply discount when weeklyDiscount is 0", () => { expect(calculateBookingPrice({ ...base, nights: 7, weeklyDiscount: 0 }).discount).toBe(0); });
  it("includes cleaning and service fees in total", () => { expect(calculateBookingPrice({ ...base, nights: 1 }).total).toBe(4_500_000 + 450_000 + 225_000); });
  it("handles 1-night stay", () => { const r = calculateBookingPrice({ ...base, nights: 1 }); expect(r.subtotal).toBe(4_500_000); expect(r.discount).toBe(0); });
  it("handles zero fees", () => { expect(calculateBookingPrice({ pricePerNight: 1_000_000, nights: 2, cleaningFee: 0, serviceFee: 0, weeklyDiscount: 0, monthlyDiscount: 0 }).total).toBe(2_000_000); });
});

describe("validateBooking", () => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  it("returns null for valid booking data", () => { expect(validateBooking({ checkIn: today.toISOString(), checkOut: tomorrow.toISOString(), guests: 2, maxGuests: 8 })).toBeNull(); });
  it("returns error when checkIn is missing", () => { expect(validateBooking({ checkIn: null, checkOut: tomorrow.toISOString(), guests: 2, maxGuests: 8 })).toContain("ورود"); });
  it("returns error when checkOut is missing", () => { expect(validateBooking({ checkIn: today.toISOString(), checkOut: null, guests: 2, maxGuests: 8 })).toContain("خروج"); });
  it("returns error when checkOut is before checkIn", () => { expect(validateBooking({ checkIn: tomorrow.toISOString(), checkOut: today.toISOString(), guests: 2, maxGuests: 8 })).toContain("بعد از"); });
  it("returns error when checkIn is in the past", () => { const y = new Date(today); y.setDate(y.getDate() - 1); expect(validateBooking({ checkIn: y.toISOString(), checkOut: tomorrow.toISOString(), guests: 2, maxGuests: 8 })).toContain("گذشته"); });
  it("returns error when guests is less than 1", () => { expect(validateBooking({ checkIn: today.toISOString(), checkOut: tomorrow.toISOString(), guests: 0, maxGuests: 8 })).toContain("۱ مسافر"); });
  it("returns error when guests exceeds maxGuests", () => { expect(validateBooking({ checkIn: today.toISOString(), checkOut: tomorrow.toISOString(), guests: 10, maxGuests: 8 })).toContain("8"); });
});
