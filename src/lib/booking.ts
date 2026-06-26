export interface BookingPriceInput { pricePerNight: number; nights: number; cleaningFee: number; serviceFee: number; weeklyDiscount: number; monthlyDiscount: number; }
export interface BookingPriceResult { subtotal: number; discount: number; discountLabel: string; cleaningFee: number; serviceFee: number; total: number; }

export function calculateBookingPrice(input: BookingPriceInput): BookingPriceResult {
  const { pricePerNight, nights, cleaningFee, serviceFee, weeklyDiscount, monthlyDiscount } = input;
  const subtotal = pricePerNight * nights;
  let discount = 0; let discountLabel = "";
  if (nights >= 30 && monthlyDiscount > 0) { discount = Math.round(subtotal * (monthlyDiscount / 100)); discountLabel = `تخفیف ماهانه (${monthlyDiscount}%)`; }
  else if (nights >= 7 && weeklyDiscount > 0) { discount = Math.round(subtotal * (weeklyDiscount / 100)); discountLabel = `تخفیف هفتگی (${weeklyDiscount}%)`; }
  const total = Math.max(0, subtotal - discount + cleaningFee + serviceFee);
  return { subtotal, discount, discountLabel, cleaningFee, serviceFee, total };
}

export function validateBooking(data: { checkIn: string | null; checkOut: string | null; guests: number; maxGuests: number; }): string | null {
  if (!data.checkIn) return "تاریخ ورود را انتخاب کنید";
  if (!data.checkOut) return "تاریخ خروج را انتخاب کنید";
  const ci = new Date(data.checkIn); const co = new Date(data.checkOut);
  if (co <= ci) return "تاریخ خروج باید بعد از تاریخ ورود باشد";
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (ci < today) return "تاریخ ورود نمی‌تواند در گذشته باشد";
  if (data.guests < 1) return "حداقل ۱ مسافر";
  if (data.guests > data.maxGuests) return `حداکثر ${data.maxGuests} مسافر مجاز است`;
  return null;
}
