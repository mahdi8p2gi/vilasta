# Task 6 — Listing View (full-stack-developer)

**Agent:** full-stack-developer
**Task ID:** 6
**Target file:** `/home/z/my-project/src/components/property/listing-view.tsx`
**Status:** ✅ Complete

## Context reviewed
- `worklog.md` (Task 1 foundation: Prisma schema, design system, store, API layer, shared components)
- `src/store/app-store.ts` — `search` params, `goProperty`, view routing
- `src/hooks/use-api.ts` — `useProperties(filters)` returns `Paginated<Property>`
- `src/types/index.ts` — `PropertyFilters`, `Paginated`, `Property`, `PropertyType`
- `src/lib/persian.ts` — `toPersianDigits`, `formatTomanCompact`
- `src/config/site.ts` — `propertyTypeMeta`, `amenityMeta`
- `src/components/shared/property-card.tsx` — `PropertyCard` + `PropertyCardSkeleton`
- `src/components/shared/empty-state.tsx` — `EmptyState`
- `src/app/globals.css` — design tokens, `glass`, `text-gradient-emerald`, `scrollbar-thin`, `shadow-*`
- Existing shadcn/ui components: Button, Input, Select, Slider, Checkbox, RadioGroup, Sheet, Pagination, Badge, Separator, Label

## What was built
A single client component `ListingView` plus three internal helpers in the same file:
- `useDebounce<T>(value, delay=300)` — inline debounce hook
- `FilterPanel` — all filters (search, type pills, price slider, rating radio, bedrooms/guests selects, amenities checkboxes, clear button) — shared between desktop sidebar and mobile Sheet
- `PaginationBar` — RTL-aware pagination (قبلی=ChevronRight, بعدی=ChevronLeft, ellipsis, Persian digits)
- `FilterSection` — small wrapper for titled groups

### Layout
- Header: `کاوش ویلاستا` subtitle, `کاوش اقامتگاه‌ها` gradient title, live result count
- Desktop (`lg:`): `flex-row` → aside first (renders right in RTL) sticky sidebar `lg:w-72`, main results `flex-1`
- Mobile: filter button in header opens right-side `Sheet` (width 90% / sm:max-w-md) with same `FilterPanel`

### Filters (all in `FilterPanel`)
1. **Text search** — Input bound to `filters.q`, debounced 300ms → `debouncedQ` → `apiFilters.q`
2. **Property type** — 2-col pill buttons (all + 5 types from `propertyTypeMeta`)
3. **Price range** — dual-thumb `Slider`, 0–10,000,000 Toman, step 250,000, labels via `formatTomanCompact`
4. **Rating** — `RadioGroup`: any / 4.5+ / 4.0+ / 3.5+
5. **Bedrooms** — `Select`: any / 1+…5+
6. **Guests** — `Select`: any / 1…5+
7. **Amenities** — `Checkbox` list (20 amenities, scrollable `max-h-64 scrollbar-thin`) with `AmenityIcon` + `amenityMeta` labels
8. **Clear filters** button — disabled when `activeCount === 0`

### Sort bar
- Result count text (`toPersianDigits(total) اقامتگاه`)
- `Select` with 5 sort options (recommended / price_asc / price_desc / rating / newest)

### States
- **Loading** — 9 × `PropertyCardSkeleton` in the results grid
- **Empty** — `EmptyState` with `SearchX` icon, message, and a clear-filters `Button`
- **Error** — custom block with `AlertCircle`, message, and retry `Button` calling `refetch()`

### Pagination
- Only rendered when `totalPages > 1`
- Builds compact page list: first page, ellipsis if needed, current ±1, last page
- `handlePage` updates `filters.page` and scrolls `resultsRef` into view (`scroll-mt-20`)
- All numbers in Persian digits, `ltr-nums` on the link to keep digits readable

### Design details
- RTL throughout; Vazirmatn via layout
- Emerald + gold palette only (no indigo/blue)
- `text-gradient-emerald` on title
- Framer Motion: header fade-up, results grid keyed by page for re-entrance
- Sticky sidebar with custom scrollbar
- Fully responsive: 1 col mobile, 2 cols sm, 3 cols lg

### Store integration
- `buildInitial(search)` seeds `filters` from `store.search` (q, city, type, guests)
- Ongoing hero-search updates synced via the **"adjust state during render"** pattern (track `search` snapshot, `setFilters` only when snapshot changes) — avoids `setState-in-effect` lint error
- `update()` and `toggleAmenity()` always reset `page` to 1
- `goProperty(id)` is handled inside `PropertyCard` — no extra wiring needed

## Side fix
`/src/app/api/properties/route.ts` had a Prisma 6 incompatibility: `orderBy` used a plain object for the multi-field "recommended" sort (`{ rating: "desc", reviewCount: "desc" }`). Prisma 6 requires an array. Converted all branches to array form. Verified via `curl /api/properties?...` → HTTP 200.

## Lint
`bun run lint` reports **zero** errors/warnings in `listing-view.tsx`. (Pre-existing errors in `search-modal.tsx` and `theme-toggle.tsx` from prior agents are out of scope.)

## Files touched
- `src/components/property/listing-view.tsx` (overwritten — stub → full implementation)
- `src/app/api/properties/route.ts` (orderBy array fix — minimal, required for listing view to function)
- `worklog.md` (appended Task 6 section)
- `agent-ctx/6-full-stack-developer-listing-view.md` (this file)
