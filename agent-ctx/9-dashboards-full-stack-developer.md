# Task 9 — Dashboards (User, Host, Admin)

**Agent:** full-stack-developer (Dashboards)
**Task ID:** 9
**Date:** 2026-06-20

## Context Reviewed
- `/home/z/my-project/worklog.md` (Tasks 1, 6, 7)
- `/home/z/my-project/src/store/app-store.ts` (view, dashboardTab, goDashboard, goProperty, setView, openAuth, toggleFavorite, isFavorite, user, logout)
- `/home/z/my-project/src/hooks/use-api.ts` (useBookings, useFavorites, useNotifications, useHostProperties, useHostAnalytics, useAdminAnalytics)
- `/home/z/my-project/src/types/index.ts` (User, Property, Booking, Notification, Review, UserRole)
- `/home/z/my-project/src/lib/persian.ts` (formatToman, formatTomanCompact, toPersianDigits, formatJalali, formatJalaliShort, relativeTime, ratingLabel, pluralFa)
- `/home/z/my-project/src/config/site.ts` (propertyTypeMeta, amenityMeta)
- `/home/z/my-project/src/components/shared/{property-card,rating-stars,empty-state,section-heading,theme-toggle,logo}.tsx`
- `/home/z/my-project/src/app/globals.css` design tokens (glass, shadow-luxury, text-gradient-emerald/gold, bg-grid, chart CSS vars)
- `/home/z/my-project/src/app/api/{properties/host,analytics/host,analytics/admin,bookings}/route.ts` to understand response shapes
- Existing shadcn primitives: Button, Input, Textarea, Select, Checkbox, Switch, Avatar, Badge, Card, Table, Sheet, AlertDialog, Form, Separator, Calendar, Skeleton

## Files Created / Overwritten
1. `src/components/dashboard/dashboard-shell.tsx` (NEW, 556 lines)
2. `src/components/dashboard/user-dashboard.tsx` (OVERWROTE stub, 933 lines)
3. `src/components/dashboard/host-dashboard.tsx` (OVERWROTE stub, 1346 lines)
4. `src/components/dashboard/admin-dashboard.tsx` (OVERWROTE stub, 1047 lines)

## Implementation Summary

### DashboardShell (`dashboard-shell.tsx`)
- RTL sidebar on the visual right (sticky on desktop ≥lg, Sheet drawer on mobile)
- Mobile top bar with menu trigger + Logo + theme toggle + notifications bell (unread dot)
- Desktop header with page title (gradient emerald), subtitle, headerActions slot, theme toggle, notifications bell, "بازگشت به سایت" button (`setView("home")`)
- Sidebar contains: Logo, user card (avatar + name + email + role badge), nav list with active highlighting (primary bg + gold indicator strip), and bottom "بازگشت به سایت" + "خروج از حساب" buttons
- Exports reusable helpers: `StatCard` (glass card with icon circle + big number + trend), `PageCard`, `LoginPrompt`, `StatusBadge` (booking/property/payment/role status mapping), `DashboardSkeleton`
- Color tones: emerald/gold/amber/rose only — NO indigo/blue
- Render helpers (`renderNavList`, `renderUserCard`) declared as plain functions to satisfy `react-hooks/static-components` lint rule

### UserDashboard (`user-dashboard.tsx`) — 6 tabs
- **profile**: avatar with camera upload button, summary card (member since, phone, badges), edit form with React Hook Form + Zod (name/email/phone/bio), save toast
- **bookings**: list from `useBookings(user.id)` with thumbnail + title + Jalali dates + status badge + total + guests + "مشاهده جزئیات" (goProperty) + cancel AlertDialog; EmptyState if none; DashboardSkeleton while loading
- **favorites**: grid from `useFavorites(user.id)` using `PropertyCard`; EmptyState if none
- **notifications**: list from `useNotifications(user.id)` with type-based icon (info/success/warning/error), title, message, relative time, unread dot; "علامت‌گذاری همه" button (toast)
- **reviews**: derived from completed bookings (deterministic mock rating + Persian comment); EmptyState "نظری ثبت نکرده‌اید"
- **security**: change password form (RHF+Zod with confirm match refine), 2FA Switch toggle, active sessions list (Monitor/Smartphone icons), delete-account AlertDialog danger zone

### HostDashboard (`host-dashboard.tsx`) — 5 tabs
- **properties**: grid from `useHostProperties(user.id)` — each card with thumbnail, status badge, type badge, rating, mini stats (bookings/beds/guests), price, edit/view/delete actions (toast/AlertDialog); "افزودن اقامتگاه" button in header
- **add-property**: full multi-section form (RHF + Zod):
  - Basic info: title, type (select w/ icons), pricePerNight, city, province, size, address
  - Capacity: maxGuests, bedrooms, beds, bathrooms
  - Description with char counter
  - Amenities: 20 amenity checkboxes from `amenityMeta` (toggle highlight)
  - Images: dynamic URL inputs with thumbnail preview + remove
  - Submit POSTs to `/api/properties/host` with hostId, then invalidates `["properties","host",hostId]` query, success toast, navigates to "properties" tab
  - Sticky bottom action bar
- **revenue**: 4 StatCards (revenue, bookings, active properties, avg rating) + Recharts AreaChart (monthly revenue, emerald gradient) + BarChart (monthly bookings, gold) + top-properties Table
- **calendar**: custom Persian month grid (RTL, week starts Saturday) with booked-day highlighting (deterministic mock from property id hash), prev/next/today nav, occupation-rate summary cards
- **bookings**: deterministic mock guest bookings table (guest avatar+name, property, dates, total, status) since no host-specific bookings API exists

### AdminDashboard (`admin-dashboard.tsx`) — 6 tabs
- **analytics**: 6 StatCards (users, properties, bookings, reviews, revenue, avg rating) + Recharts dual-axis AreaChart (revenue + bookings growth) + PieChart (role breakdown) + BarChart (property type breakdown) using `var(--primary)`, `var(--gold)`, `var(--chart-*)` CSS vars
- **users**: paginated table from `useAdminAnalytics().users` with avatar, name, email, role badge, joined date; actions: role change Select + suspend/activate button (toast); client-side search + pagination (10/page)
- **properties**: table from `useAdminAnalytics().properties` with thumbnail, title, type, host, city, rating, status; approve/suspend actions (toast)
- **bookings**: table from `useAdminAnalytics().bookings` — property, guest, dates, total, payment status, booking status
- **reviews**: table from `useAdminAnalytics().reviews` — property, user, rating stars, comment snippet, date; delete AlertDialog
- **reports**: key metrics summary grid + 6 downloadable report cards (download buttons trigger toasts) + top-5 properties ranking

## Store Integration
- Reads `user` (if null → LoginPrompt with openAuth); role guard (host/admin)
- Reads `dashboardTab`; validates against tab whitelist for each dashboard; falls back to first valid tab if mismatched (e.g., switching roles)
- `goDashboard(tab)` to switch tabs
- `goProperty(id)` to navigate to property detail from bookings/properties tables
- `setView("home")` for "back to site"
- `logout()` for sign-out

## Persian Formatting
- All numbers: `toPersianDigits`
- All money: `formatToman` / `formatTomanCompact`
- All dates: `formatJalali` / `formatJalaliShort` / `relativeTime`
- Rating labels: `ratingLabel`
- Plural helper: `pluralFa`
- Chart tick formatters convert numbers to Persian digits and compact Toman labels
- Chart tooltips set `direction: rtl` and use Persian labels

## Charts (Recharts)
- All charts wrapped in `dir="ltr"` container with `ResponsiveContainer width="100%" height="100%"`
- Colors: `var(--primary)` (emerald), `var(--gold)`, `var(--chart-5)`, `var(--chart-4)` — NO indigo/blue
- AreaCharts with linear gradient fills (`stopColor="var(--primary)"`)
- BarCharts with rounded tops (`radius={[6,6,0,0]}`)
- PieChart with `innerRadius=60 outerRadius=100` donut style
- Legend + Tooltip with RTL styling

## Design System Compliance
- RTL throughout, Vazirmatn font inherited
- Luxury emerald + gold palette only (NO indigo/blue)
- Glass effect on mobile top bar
- `shadow-luxury` on StatCards hover and sticky action bar
- `text-gradient-emerald` on page titles
- Custom scrollbar styling (`scrollbar-thin`) on desktop sidebar
- Mobile-first responsive: sidebar collapses to Sheet drawer; tables scroll horizontally; grids stack
- Touch-friendly: 44px+ tap targets on nav items and action buttons
- Loading: `DashboardSkeleton` with shimmer animation
- Empty states: `EmptyState` component with icon + title + description + action
- Toast notifications (sonner) for all mock actions
- AlertDialog for destructive actions (cancel booking, delete property, delete review, delete account)

## Lint & Build Verification
- `bunx eslint src/components/dashboard/` → **0 errors, 0 warnings** across all 4 files
- `bun run lint` → 5 problems reported, ALL in pre-existing files (`search-modal.tsx`, `theme-toggle.tsx`) from prior tasks; none in dashboard files
- Dev server log: `GET / 200`, `GET /api/analytics/admin 200`, `GET /api/notifications 200`, all dashboards compile successfully with no errors
- Validated `/api/analytics/admin` response shape (4 users, 12 properties, 6 bookings, 20 reviews) — matches table rendering expectations

## Notes
- HostBookingsTab uses deterministic mock bookings (seeded from property id) because the existing `/api/bookings?userId=` only returns the user's own bookings as a guest, not bookings across the host's properties. No new API routes were added per task rules.
- CalendarTab uses deterministic mock booked days (seeded from property id hash) for the same reason — no host-specific booking list API exists.
- Role guard: UserDashboard allows any logged-in user; HostDashboard requires `host` or `admin` role; AdminDashboard requires `admin` role. Wrong role → `LoginPrompt` with role-specific copy.
- The `react-hooks/static-components` lint rule required converting inner `NavList` and `UserCard` arrow components to plain render-function calls (`renderNavList()`, `renderUserCard()`).
- The dashboard is rendered inside AppShell with the global Navbar above it (consistent with property/booking views); the dashboard's own header serves as a secondary page-level contextual header.
