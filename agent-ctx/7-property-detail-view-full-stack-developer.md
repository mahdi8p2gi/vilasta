---
# Task 7 — Property Detail View (full-stack-developer)

## What I built
Single React client component `src/components/property/property-detail-view.tsx` (~1100 lines).

## Components
- `PropertyDetailView` (entry): handles loading skeleton / not-found / content states
- `PropertyDetailContent`: shell — back button + gallery + 2-col grid + full-width sections + lightbox
- `Gallery`: hero (md:col-span-2 row-span-2) + 4 thumbnails grid; overlay favorite & share buttons; click → opens lightbox
- `HeaderSection`: type badge, rating badge, title, location/size, RatingStars, host avatar (Avatar with emerald ring), description
- `KeyFeaturesStrip`: 5-cell grid with icons (Users / BedDouble / Bed / Bath / Maximize) + Persian digits
- `AmenitiesSection`: 2-4 col grid of `AmenityBadge`
- `BookingWidget` (sticky lg:sticky lg:top-20): price/night big, discount badges, date range Popover+Calendar (faIR locale, Persian formatters), guests stepper, "رزرو کنید" CTA, full price breakdown with discount
- `MapSection`: stylized CSS gradient map with bg-grid + blobs + animated pulse-ring pin marker positioned by normalized lat/lng (Iran bounds), city label, address, "مشاهده روی نقشه" button
- `ReviewsSection`: summary card (big number, stars), category breakdown bars (cleanliness/communication/checkIn/accuracy/location/value) using Progress, list of `ReviewCard` with Avatar + name + Jalali date + comment, "نظر خود را بنویسید" button → opens auth if logged out, toast if logged in
- `SimilarSection`: 4-col grid of `PropertyCard` (compact variant) from `useSimilarProperties`
- `AvailabilitySection`: Calendar (mode="single", Persian locale) with mock booked dates deterministically generated from property id; legend + selected-date summary with "انتخاب به عنوان ورود" toast
- `Lightbox`: Dialog-based fullscreen carousel with prev/next, ESC/arrow keyboard nav, image counter, RTL-aware icon direction

## Store integration
- `useAppStore`: `goBack`, `goBooking(property.id)`, `toggleFavorite`, `isFavorite` via `favorites` array, `user`, `openAuth`, `bookingDraft` (initial state for date range & guests), `setBookingDraft({checkIn, checkOut, guests})`

## Hooks used
- `useProperty(propertyId)` → `{ property, reviews }`
- `usePropertyReviews(propertyId)` → `{ items, summary }`
- `useSimilarProperties(propertyId)` → `Property[]`

## Persian formatting
- `formatToman`, `formatTomanCompact`, `toPersianDigits`, `formatJalali`, `formatJalaliShort`, `ratingLabel`, `pluralFa`, `nightsBetween`
- `jalaliPlusDays` for default date range
- Custom `calendarFormatters` for the react-day-picker Calendar (Persian digits + Intl.DateTimeFormat fa-IR for month/weekday captions)

## Design choices
- RTL throughout, no indigo/blue. Emerald + gold + warm stone.
- Premium feel: `shadow-luxury`, `shadow-card-hover`, `glass` overlays, generous padding, Framer Motion entrance animations on each section.
- Layout: `grid lg:grid-cols-3` with content `lg:col-span-2` on visual right (RTL first column) + booking widget `lg:col-span-1` sticky on visual left.
- Mobile: hero only, all sections stacked; booking widget inline (not sticky on mobile).
- Used `next/image` with `fill` + `sizes` everywhere.
- Custom scrollbar not needed (no long scroll containers in main flow).
- Accessibility: ARIA labels on icon buttons, sr-only DialogTitle, keyboard support in lightbox.

## Lint
- `bunx eslint src/components/property/property-detail-view.tsx` → no errors, no warnings.

## Runtime verification (dev.log)
- `GET /api/properties/{id} 200`
- `GET /api/properties/{id}/similar 200`
- `GET /api/properties/{id}/reviews 200`
- Page compiled successfully after edits (no TS / bundler errors).
- Property detail navigation works end-to-end (property → 3 API calls → render).

## Files touched
- `src/components/property/property-detail-view.tsx` (OVERWRITTEN, ~1100 lines, full implementation)
