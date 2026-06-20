"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  SearchX,
  RotateCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useAppStore, type SearchParams } from "@/store/app-store";
import { useProperties } from "@/hooks/use-api";
import { propertyTypeMeta, amenityMeta } from "@/config/site";
import { AmenityIcon } from "@/components/shared/amenity-icon";
import {
  PropertyCard,
  PropertyCardSkeleton,
} from "@/components/shared/property-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  toPersianDigits,
  formatTomanCompact,
} from "@/lib/persian";
import { cn } from "@/lib/utils";
import type { PropertyFilters, PropertyType } from "@/types";

// ============================================================================
//  Constants
// ============================================================================

const PRICE_MIN = 0;
const PRICE_MAX = 10_000_000;
const PRICE_STEP = 250_000;
const PAGE_SIZE = 9;
const SKELETON_COUNT = 9;

type SortKey = NonNullable<PropertyFilters["sort"]>;

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "پیشنهادی" },
  { value: "price_asc", label: "ارزان‌ترین" },
  { value: "price_desc", label: "گران‌ترین" },
  { value: "rating", label: "بالاترین امتیاز" },
  { value: "newest", label: "جدیدترین" },
];

const ratingOptions = [
  { value: 0, label: "همه امتیازها" },
  { value: 4.5, label: "۴٫۵ به بالا" },
  { value: 4.0, label: "۴٫۰ به بالا" },
  { value: 3.5, label: "۳٫۵ به بالا" },
];

const bedroomOptions = [1, 2, 3, 4, 5];
const guestOptions = [1, 2, 3, 4, 5];

const propertyTypeKeys: (PropertyType | "all")[] = [
  "all",
  "villa",
  "hotel",
  "apartment",
  "resort",
  "cottage",
];

const amenityKeys = Object.keys(amenityMeta);

// ============================================================================
//  Inline useDebounce hook
// ============================================================================

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ============================================================================
//  Filter state
// ============================================================================

interface FilterState {
  q: string;
  type: PropertyType | "all";
  city: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  bedrooms: number | undefined;
  guests: number | undefined;
  amenities: string[];
  sort: SortKey;
  page: number;
}

function buildInitial(search: SearchParams): FilterState {
  return {
    q: search.q ?? "",
    type: (search.type as PropertyType | "all") || "all",
    city: search.city ?? "",
    minPrice: PRICE_MIN,
    maxPrice: PRICE_MAX,
    minRating: 0,
    bedrooms: undefined,
    guests: search.guests || undefined,
    amenities: [],
    sort: "recommended",
    page: 1,
  };
}

// ============================================================================
//  Filter section wrapper
// ============================================================================

function FilterSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}

// ============================================================================
//  Filter panel — shared by desktop sidebar and mobile sheet
// ============================================================================

function FilterPanel({
  filters,
  update,
  toggleAmenity,
  clearFilters,
  activeCount,
}: {
  filters: FilterState;
  update: (patch: Partial<FilterState>) => void;
  toggleAmenity: (a: string) => void;
  clearFilters: () => void;
  activeCount: number;
}) {
  return (
    <div className="space-y-6 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-emerald-brand" />
          فیلترها
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {toPersianDigits(activeCount)}
            </Badge>
          )}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          disabled={activeCount === 0}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          پاک کردن
        </Button>
      </div>

      <Separator />

      {/* Text search */}
      <FilterSection title="جستجوی متن" icon={<Search className="h-4 w-4 text-muted-foreground" />}>
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="نام، شهر، استان..."
            className="pr-9"
            aria-label="جستجوی متن"
          />
        </div>
      </FilterSection>

      {/* Property type */}
      <FilterSection title="نوع اقامتگاه">
        <div className="grid grid-cols-2 gap-2">
          {propertyTypeKeys.map((key) => {
            const isActive = filters.type === key;
            const meta = key === "all" ? null : propertyTypeMeta[key];
            const Icon = meta?.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ type: key })}
                aria-pressed={isActive}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                  isActive
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background hover:border-primary/40 hover:bg-accent"
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                <span className="truncate">{key === "all" ? "همه" : meta?.label}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Price range */}
      <FilterSection title="محدوده قیمت (هر شب)">
        <div className="mb-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs">
          <span className="text-muted-foreground">از</span>
          <span className="font-semibold text-foreground ltr-nums">
            {formatTomanCompact(filters.minPrice)}
          </span>
          <span className="text-muted-foreground">تا</span>
          <span className="font-semibold text-foreground ltr-nums">
            {formatTomanCompact(filters.maxPrice)}
          </span>
        </div>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          onValueChange={(v) => update({ minPrice: v[0], maxPrice: v[1] })}
          dir="ltr"
          className="w-full"
          aria-label="محدوده قیمت"
        />
        <p className="mt-2 text-[11px] text-muted-foreground">به تومان</p>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="حداقل امتیاز">
        <RadioGroup
          value={String(filters.minRating)}
          onValueChange={(v) => update({ minRating: Number(v) })}
          className="gap-2"
        >
          {ratingOptions.map((r) => (
            <div
              key={r.value}
              className="flex items-center gap-2.5 rounded-md px-1 py-0.5 transition-colors hover:bg-accent/50"
            >
              <RadioGroupItem value={String(r.value)} id={`rating-${r.value}`} />
              <Label
                htmlFor={`rating-${r.value}`}
                className="cursor-pointer text-sm font-normal text-foreground"
              >
                {r.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="تعداد اتاق خواب">
        <Select
          value={filters.bedrooms ? String(filters.bedrooms) : "any"}
          onValueChange={(v) =>
            update({ bedrooms: v === "any" ? undefined : Number(v) })
          }
        >
          <SelectTrigger className="w-full" aria-label="تعداد اتاق خواب">
            <SelectValue placeholder="هر تعداد" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">هر تعداد</SelectItem>
            {bedroomOptions.map((b) => (
              <SelectItem key={b} value={String(b)}>
                {toPersianDigits(b)} خواب به بالا
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Guests */}
      <FilterSection title="تعداد مهمان">
        <Select
          value={filters.guests ? String(filters.guests) : "any"}
          onValueChange={(v) =>
            update({ guests: v === "any" ? undefined : Number(v) })
          }
        >
          <SelectTrigger className="w-full" aria-label="تعداد مهمان">
            <SelectValue placeholder="هر تعداد" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">هر تعداد</SelectItem>
            {guestOptions.map((g) => (
              <SelectItem key={g} value={String(g)}>
                {g === 5
                  ? `${toPersianDigits(g)} نفر به بالا`
                  : `${toPersianDigits(g)} نفر`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="امکانات اقامتگاه">
        <div className="scrollbar-thin max-h-64 space-y-1 overflow-y-auto pl-1">
          {amenityKeys.map((a) => {
            const meta = amenityMeta[a];
            const checked = filters.amenities.includes(a);
            return (
              <div
                key={a}
                className="flex items-center gap-2.5 rounded-md px-1 py-1 transition-colors hover:bg-accent/50"
              >
                <Checkbox
                  id={`amen-${a}`}
                  checked={checked}
                  onCheckedChange={() => toggleAmenity(a)}
                />
                <Label
                  htmlFor={`amen-${a}`}
                  className="flex flex-1 cursor-pointer items-center gap-2 text-sm font-normal text-foreground"
                >
                  <AmenityIcon amenity={a} size={16} className="text-emerald-brand" />
                  {meta?.label ?? a}
                </Label>
              </div>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
}

// ============================================================================
//  Pagination bar — RTL aware
// ============================================================================

function PaginationBar({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build a compact page list with ellipsis
  const pages: (number | "ellipsis")[] = [1];
  if (page > 3) pages.push("ellipsis");
  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(totalPages - 1, page + 1);
    i++
  ) {
    pages.push(i);
  }
  if (page < totalPages - 2) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  const stop = (e: React.MouseEvent) => e.preventDefault();

  return (
    <Pagination className="mt-10 justify-center">
      <PaginationContent className="gap-1">
        {/* Previous (RTL: points right) */}
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              stop(e);
              if (page < totalPages) onPage(page + 1);
            }}
            aria-label="صفحه قبلی"
            className={cn(
              "gap-1 px-3",
              page >= totalPages && "pointer-events-none opacity-40"
            )}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="hidden sm:inline">قبلی</span>
          </PaginationLink>
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  stop(e);
                  onPage(p);
                }}
                isActive={p === page}
                aria-label={`صفحه ${toPersianDigits(p)}`}
                className="ltr-nums"
              >
                {toPersianDigits(p)}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next (RTL: points left) */}
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              stop(e);
              if (page > 1) onPage(page - 1);
            }}
            aria-label="صفحه بعدی"
            className={cn(
              "gap-1 px-3",
              page <= 1 && "pointer-events-none opacity-40"
            )}
          >
            <span className="hidden sm:inline">بعدی</span>
            <ChevronLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// ============================================================================
//  Main ListingView
// ============================================================================

export function ListingView() {
  const search = useAppStore((s) => s.search);
  const [filters, setFilters] = useState<FilterState>(() => buildInitial(search));
  const [mobileOpen, setMobileOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const debouncedQ = useDebounce(filters.q, 300);

  // Sync from store when hero search updates — use the "adjust state during
  // render" pattern (avoids setState-in-effect). React docs:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [trackedSearch, setTrackedSearch] = useState(search);
  if (
    search.q !== trackedSearch.q ||
    search.city !== trackedSearch.city ||
    search.type !== trackedSearch.type ||
    search.guests !== trackedSearch.guests
  ) {
    setTrackedSearch(search);
    setFilters((f) => ({
      ...f,
      q: search.q ?? "",
      city: search.city ?? "",
      type: (search.type as PropertyType | "all") || "all",
      guests: search.guests || undefined,
      page: 1,
    }));
  }

  const apiFilters: Partial<PropertyFilters> = useMemo(
    () => ({
      q: debouncedQ || undefined,
      type: filters.type,
      city: filters.city || undefined,
      minPrice: filters.minPrice > PRICE_MIN ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice < PRICE_MAX ? filters.maxPrice : undefined,
      minRating: filters.minRating || undefined,
      bedrooms: filters.bedrooms,
      guests: filters.guests,
      amenities: filters.amenities.length ? filters.amenities : undefined,
      sort: filters.sort,
      page: filters.page,
      limit: PAGE_SIZE,
    }),
    [debouncedQ, filters]
  );

  const { data, isLoading, isError, refetch } = useProperties(apiFilters);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.page ?? filters.page;

  // ---- handlers ----
  const update = (patch: Partial<FilterState>) =>
    setFilters((f) => ({ ...f, ...patch, page: 1 }));

  const toggleAmenity = (a: string) =>
    setFilters((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
      page: 1,
    }));

  const clearFilters = () =>
    setFilters({
      q: "",
      type: "all",
      city: "",
      minPrice: PRICE_MIN,
      maxPrice: PRICE_MAX,
      minRating: 0,
      bedrooms: undefined,
      guests: undefined,
      amenities: [],
      sort: "recommended",
      page: 1,
    });

  const handlePage = (p: number) => {
    setFilters((f) => ({ ...f, page: p }));
    setMobileOpen(false);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.q) n++;
    if (filters.type !== "all") n++;
    if (filters.city) n++;
    if (filters.minPrice > PRICE_MIN || filters.maxPrice < PRICE_MAX) n++;
    if (filters.minRating > 0) n++;
    if (filters.bedrooms) n++;
    if (filters.guests) n++;
    if (filters.amenities.length) n++;
    return n;
  }, [filters]);

  const panelProps = {
    filters,
    update,
    toggleAmenity,
    clearFilters,
    activeCount: activeFilterCount,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* ============ Header ============ */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-emerald-brand">کاوش ویلاستا</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="text-gradient-emerald">کاوش اقامتگاه‌ها</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "در حال جستجو..."
                : `${toPersianDigits(total)} اقامتگاه لوکس یافت شد`}
            </p>
          </div>

          {/* Mobile filter trigger */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <SlidersHorizontal className="h-4 w-4" />
                  فیلترها
                  {activeFilterCount > 0 && (
                    <Badge variant="default" className="ml-1 h-5 px-1.5 text-[10px]">
                      {toPersianDigits(activeFilterCount)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[90%] gap-0 p-0 sm:max-w-md"
              >
                <SheetHeader className="border-b border-border/70 px-5 py-4">
                  <SheetTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-emerald-brand" />
                    فیلترهای جستجو
                  </SheetTitle>
                </SheetHeader>
                <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4">
                  <FilterPanel {...panelProps} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* ============ Layout: sidebar + results ============ */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Sidebar (desktop) — appears on the right in RTL */}
        <aside className="hidden lg:block lg:w-72 lg:shrink-0">
          <div className="scrollbar-thin lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <FilterPanel {...panelProps} />
          </div>
        </aside>

        {/* Main */}
        <div ref={resultsRef} className="min-w-0 flex-1 scroll-mt-20">
          {/* ---- Sort bar ---- */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">نمایش</span>
              <span className="font-semibold text-foreground ltr-nums">
                {toPersianDigits(total)}
              </span>
              <span>اقامتگاه</span>
            </div>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="sort-select"
                className="text-xs text-muted-foreground"
              >
                مرتب‌سازی:
              </Label>
              <Select
                value={filters.sort}
                onValueChange={(v) => update({ sort: v as SortKey })}
              >
                <SelectTrigger
                  id="sort-select"
                  size="sm"
                  className="w-[140px] sm:w-[160px]"
                  aria-label="مرتب‌سازی"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ---- Results ---- */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">خطا در بارگذاری</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  بارگذاری اقامتگاه‌ها با مشکل مواجه شد. لطفاً دوباره تلاش کنید.
                </p>
              </div>
              <Button variant="outline" onClick={() => refetch()}>
                <RotateCcw className="h-4 w-4" />
                تلاش مجدد
              </Button>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="اقامتگاهی یافت نشد"
              description="با تغییر فیلترها یا پاک کردن آن‌ها می‌توانید نتایج بیشتری را ببینید."
              action={
                <Button onClick={clearFilters} variant="default">
                  <RotateCcw className="h-4 w-4" />
                  پاک کردن فیلترها
                </Button>
              }
            />
          ) : (
            <>
              <motion.div
                key={`page-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </motion.div>

              <PaginationBar
                page={currentPage}
                totalPages={totalPages}
                onPage={handlePage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
