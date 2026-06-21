---
# Task 8 — Booking View (full-stack-developer)

## What I built
Single React client component `src/components/booking/booking-view.tsx` (~1700 lines).
Multi-step checkout flow: Date & Guests → Contact Info → Payment → Confirmation.

## Context read before starting
- `worklog.md` (Tasks 1, 6, 7 — foundation, listing, property detail)
- `src/store/app-store.ts` — goBack, goDashboard, setView, openAuth, bookingDraft, setBookingDraft, user
- `src/hooks/use-api.ts` — useProperty(id) → { property, reviews }
- `src/types/index.ts` — Property, Booking, HostSummary
- `src/lib/persian.ts` — formatToman, formatTomanCompact, toPersianDigits, toEnglishDigits, formatJalali, formatJalaliShort, nightsBetween, pluralFa
- `src/lib/date-utils.ts` — jalaliPlusDays
- `src/components/shared/rating-stars.tsx` — RatingStars component
- `src/components/shared/empty-state.tsx` — EmptyState component
- `src/components/property/property-detail-view.tsx` — BookingWidget (pricing logic, calendar formatters, faIR locale usage)
- `src/app/globals.css` — design tokens (glass, shadow-luxury, shadow-card-hover, text-gradient-emerald, text-gradient-gold, animate-pulse-ring, bg-grid)
- `src/app/api/bookings/route.ts` — POST handler (creates booking with property-derived pricing, returns serializeBooking with property+host)
- shadcn primitives: Button, Card(+parts), Input, Label, Textarea, Calendar, RadioGroup, Separator, Skeleton, Avatar

## Components
- `BookingView` (entry): calls `useProperty(propertyId)` unconditionally (rules-of-hooks), then guards: !propertyId → BookingMissing, isLoading → BookingSkeleton, isError → BookingMissing, else BookingContent
- `BookingMissing`: EmptyState with CalendarX2 icon + "بازگشت" button (goBack)
- `BookingSkeleton`: full skeleton layout matching the 2-column grid
- `BookingContent` (shell): manages step state (1–4), range (DateRange), guests, paymentMethod, submitting, bookingResult. Persists range/guests back to store via useEffect. Computes pricing via useMemo. Scroll-to-stepper on step change.
- `Stepper`: 4 circles + connecting lines. Completed steps get Check icon + primary fill. Current step gets ring-4 + scale 1.08. Completed steps are clickable to jump back. Labels are responsive (short on mobile, full on sm+).
- `StepCircle`: animated circle (spring scale)
- `StepDateGuests`: Calendar mode="range" (numberOfMonths = isMobile ? 1 : 2, faIR locale, dir="rtl", disabled past dates, Persian formatters). Date cells (check-in / check-out / nights). Guests stepper (min 1, max property.maxGuests). "ادامه" button (disabled if no range).
- `StepContact`: if !user → EmptyState with Lock icon + "ورود / ثبت‌نام" button (openAuth). Else form: name (≥3 chars), phone (Iranian mobile regex /^09\d{9}$/ after toEnglishDigits), email (standard regex), special requests textarea. Pre-fills from store user. Validation on submit (touched state). Re-mounts on user change via key={user?.id}.
- `StepPayment`: RadioGroup of payment-method cards (gateway default, card-to-card, pay-at-location for hotel/resort only). Animated card form (CardForm) for gateway. Card-to-card shows host card info. Pay-at-location shows pay-on-arrival note. Price breakdown. Trust signals (Lock, ShieldCheck, BadgeCheck). "پرداخت و رزرو" button → onPay (POST /api/bookings).
- `CardForm`: animated 3D-flip card preview (front: chip, brand, number, name, expiry; back: CVV strip). Flips when CVV focused. Inputs: card number (auto-format 4-4-4-4, Persian digit conversion, brand detection), name, expiry (MM/YY auto-slash), CVV (3-4 digits). Mock only — no real processing.
- `StepConfirmation`: SuccessAnimation (spring checkmark + pulse rings + 18 confetti particles radiating outward) + booking card (thumbnail, title, location, rating, dates, nights, guests, booking ID, total paid) + action buttons ("مشاهده رزروهای من" → goDashboard("bookings"), "بازگشت به خانه" → setView("home"))
- `BookingSummary` (sticky aside): property image + type badge, title, location, RatingStars, host avatar (emerald ring) + verified, dates & guests grid, full price breakdown, free-cancellation note with ShieldCheck
- `PriceBreakdown` (shared): nights × pricePerNight = subtotal, discount (weekly if ≥7 nights, monthly if ≥30 nights), cleaning fee, service fee, total (gold gradient, large)
- `StepFooter`: back button (ghost) + continue button (primary, shadow-luxury). On mobile, shows compact total pill next to continue button.

## Store integration
- `useAppStore`: goBack, user, openAuth, setView, goDashboard, bookingDraft (initial range/guests), setBookingDraft (persist on change)
- Step 1 → 2 transition: if !user, opens auth modal + toast, stays on step 1
- Step 3 pay: POST /api/bookings with { propertyId, userId: user.id, checkIn, checkOut, guests }
- Step 4: goDashboard("bookings") or setView("home")

## Pricing logic (mirrors property detail BookingWidget)
- nights = nightsBetween(checkIn, checkOut)
- subtotal = nights × pricePerNight
- if nights ≥ 30 && monthlyDiscount > 0: discount = subtotal × monthlyDiscount%
- else if nights ≥ 7 && weeklyDiscount > 0: discount = subtotal × weeklyDiscount%
- total = subtotal − discount + cleaningFee + serviceFee

## API verification
- `curl POST /api/bookings` with valid propertyId + userId → HTTP 201, returns full booking object with property + host
- Note: API computes its own totalPrice (without discount); UI displays discount-aware total for transparency. Both are consistent for short stays (no discount).

## Persian formatting
- All prices: formatToman / formatTomanCompact
- All numbers: toPersianDigits
- Card inputs: toEnglishDigits (convert Persian digits for processing)
- Dates: formatJalali (confirmation), formatJalaliShort (summary, date cells)
- Nights: nightsBetween

## Design
- RTL Persian throughout, Vazirmatn font (inherited)
- Emerald + gold palette (NO indigo/blue)
- shadow-luxury on cards, shadow-card-hover on summary
- text-gradient-emerald for header, text-gradient-gold for totals
- Framer Motion: step transitions (slide x), stepper circle spring, success animation (spring + confetti), card form expand/collapse, card 3D flip
- Mobile-first: single column on mobile (summary below step content), 2-col on lg (main right, aside left sticky). Mobile total pill in footer.
- Trust signals: ShieldCheck, Lock, BadgeCheck icons; "پرداخت امن", "محافظت از خریدار"
- Calendar localized to fa-IR with Persian digit formatters

## Lint
- `bunx eslint src/components/booking/booking-view.tsx` → 0 errors, 0 warnings
- Fixed: rules-of-hooks (moved useProperty before conditional returns), removed unused Badge import, removed redundant isMobileOrNarrow helper, removed redundant BrandIcon variable, fixed summary dates to use actual range instead of jalaliPlusDays

## Responsive
- Stepper: min-w-[56px] circles, short labels on mobile, full labels on sm+
- Calendar: 1 month on mobile, 2 on desktop (useIsMobile)
- Layout: grid-cols-1 → lg:grid-cols-5 (main col-span-3, aside col-span-2)
- Footer: flex-col-reverse on mobile, flex-row on sm+
