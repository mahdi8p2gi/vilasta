"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { faIR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import {
  MapPin,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Users,
  BedDouble,
  Bath,
  Maximize,
  Bed,
  ShieldCheck,
  MessageSquarePlus,
  MapPinned,
  ArrowRight,
  Plus,
  Minus,
  CalendarDays,
  Sparkles,
  Check,
  Star,
  Home,
  ChevronLeft as BackIcon,
} from "lucide-react";

import {
  useProperty,
  usePropertyReviews,
  useSimilarProperties,
} from "@/hooks/use-api";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RatingStars } from "@/components/shared/rating-stars";
import { AmenityBadge } from "@/components/shared/amenity-icon";
import { PropertyCard } from "@/components/shared/property-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ReviewWriteModal } from "@/components/property/review-write-modal";
import { propertyTypeMeta } from "@/config/site";
import {
  formatToman,
  formatTomanCompact,
  toPersianDigits,
  formatJalali,
  formatJalaliShort,
  ratingLabel,
  pluralFa,
  nightsBetween,
} from "@/lib/persian";
import { jalaliPlusDays } from "@/lib/date-utils";
import { detailImage, cardImage, SHIMMER_BLUR } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Property, Review } from "@/types";

// ============================================================================
//  Calendar formatters — Persian digits + Jalali captions
// ============================================================================
const calendarFormatters = {
  formatDay: (date: Date) => toPersianDigits(date.getDate()),
  formatMonthCaption: (date: Date) =>
    new Intl.DateTimeFormat("fa-IR", {
      month: "long",
      year: "numeric",
    }).format(date),
  formatWeekdayName: (date: Date) =>
    new Intl.DateTimeFormat("fa-IR", { weekday: "narrow" }).format(date),
};

// ============================================================================
//  Main entry
// ============================================================================
export function PropertyDetailView({
  propertyId,
}: {
  propertyId: string | null;
}) {
  const { data, isLoading, isError } = useProperty(propertyId);

  if (isLoading) return <PropertyDetailSkeleton />;
  if (isError || !data?.property) return <PropertyDetailNotFound />;

  return <PropertyDetailContent property={data.property} />;
}

// ============================================================================
//  Content shell
// ============================================================================
function PropertyDetailContent({ property }: { property: Property }) {
  const goBack = useAppStore((s) => s.goBack);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6 lg:px-8"
    >
      {/* Back */}
      <button
        onClick={() => goBack()}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت
      </button>

      {/* Gallery */}
      <Gallery property={property} onOpen={(i) => setLightboxIndex(i)} />

      {/* Main 2-col layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <HeaderSection property={property} />
          <KeyFeaturesStrip property={property} />
          <AmenitiesSection property={property} />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <BookingWidget property={property} />
          </div>
        </div>
      </div>

      {/* Full-width sections */}
      <div className="mt-16 space-y-16">
        <MapSection property={property} />
        <ReviewsSection
          propertyId={property.id}
          propertyTitle={property.title}
          rating={property.rating}
          reviewCount={property.reviewCount}
        />
        <SimilarSection propertyId={property.id} />
        <AvailabilitySection property={property} />
      </div>

      {/* Lightbox */}
      <Lightbox
        images={property.images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndex={setLightboxIndex}
        title={property.title}
      />
    </motion.div>
  );
}

// ============================================================================
//  1) Image Gallery
// ============================================================================
function Gallery({
  property,
  onOpen,
}: {
  property: Property;
  onOpen: (i: number) => void;
}) {
  const all = property.images.length
    ? property.images
    : ["/placeholder.svg"];

  const hero = all[0];
  // Build exactly 4 thumbnails, reusing if fewer exist
  const thumbs = useMemo(() => {
    const t: string[] = [];
    for (let i = 0; i < 4; i++) {
      const src = all[(i % all.length) + (all.length > 1 ? 1 : 0)] || all[0];
      t.push(src);
    }
    return t;
  }, [all]);

  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = useAppStore((s) => s.favorites.includes(property.id));
  const user = useAppStore((s) => s.user);
  const openAuth = useAppStore((s) => s.openAuth);

  const onFav = () => {
    if (!user) {
      openAuth("login");
      return;
    }
    toggleFavorite(property.id);
    toast.success(isFavorite ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد");
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: property.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("لینک کپی شد");
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative">
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2 md:h-[480px]">
        {/* Hero */}
        <button
          onClick={() => onOpen(0)}
          className="group relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-2xl bg-muted md:aspect-auto"
          aria-label="نمایش همه تصاویر"
        >
          <Image
            src={detailImage(hero)}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            placeholder="blur"
            blurDataURL={SHIMMER_BLUR}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </button>

        {/* Thumbnails */}
        {thumbs.map((img, i) => (
          <button
            key={i}
            onClick={() => onOpen(i + 1)}
            className="group relative hidden overflow-hidden rounded-2xl bg-muted md:block"
            aria-label={`تصویر ${toPersianDigits(i + 2)}`}
          >
            <Image
              src={cardImage(img)}
              alt=""
              fill
              sizes="25vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL={SHIMMER_BLUR}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {i === 3 && all.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  +{toPersianDigits(all.length - 5)} تصویر
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Overlay actions */}
      <div className="absolute left-3 top-3 z-10 flex gap-2">
        <button
          onClick={onShare}
          className="flex h-10 w-10 items-center justify-center rounded-full glass shadow-sm transition-all hover:scale-110 active:scale-95"
          aria-label="اشتراک‌گذاری"
        >
          <Share2 className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
        </button>
        <button
          onClick={onFav}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full glass shadow-sm transition-all hover:scale-110 active:scale-95",
            isFavorite && "ring-2 ring-destructive/40"
          )}
          aria-label="افزودن به علاقه‌مندی‌ها"
        >
          <Heart
            className={cn(
              "transition-all",
              isFavorite ? "fill-destructive text-destructive" : "text-foreground/80"
            )}
            style={{ width: 18, height: 18 }}
          />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
//  2) Header section
// ============================================================================
function HeaderSection({ property }: { property: Property }) {
  const meta = propertyTypeMeta[property.type];
  const TypeIcon = meta?.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        {TypeIcon && (
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
            <TypeIcon className="h-3.5 w-3.5 text-emerald-brand" />
            {meta.label}
          </Badge>
        )}
        {property.reviewCount > 0 && (
          <Badge
            variant="outline"
            className="gap-1.5 rounded-full border-gold/30 bg-gold/5 px-3 py-1 text-gold-foreground"
          >
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {ratingLabel(property.rating)}
          </Badge>
        )}
      </div>

      <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
        {property.title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-emerald-brand" />
          {property.city}، {property.province}
        </span>
        {property.size && (
          <>
            <span className="hidden h-3 w-px bg-border sm:block" />
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4" />
              {toPersianDigits(property.size)} متر مربع
            </span>
          </>
        )}
      </div>

      {property.reviewCount > 0 && (
        <RatingStars
          rating={property.rating}
          size={16}
          showValue
          showLabel
          reviewCount={property.reviewCount}
        />
      )}

      <Separator />

      {/* Host */}
      {property.host && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-emerald-brand/20">
              {property.host.avatar ? (
                <AvatarImage src={property.host.avatar} alt={property.host.name || ""} />
              ) : null}
              <AvatarFallback className="bg-emerald-brand/10 text-emerald-brand">
                {(property.host.name || "م").slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{property.host.name || "میزبان"}</span>
                <ShieldCheck className="h-4 w-4 text-emerald-brand" />
              </div>
              <p className="text-xs text-muted-foreground">میزبان تأییدشده</p>
            </div>
          </div>
        </div>
      )}

      <p className="max-w-3xl leading-relaxed text-muted-foreground">
        {property.description}
      </p>
    </motion.section>
  );
}

// ============================================================================
//  3) Key features strip
// ============================================================================
function KeyFeaturesStrip({ property }: { property: Property }) {
  const items = [
    { icon: Users, value: property.maxGuests, label: "نفر" },
    { icon: BedDouble, value: property.bedrooms, label: pluralFa(property.bedrooms, "اتاق", "اتاق") },
    { icon: Bed, value: property.beds, label: "تخت" },
    { icon: Bath, value: property.bathrooms, label: "حمام" },
    ...(property.size
      ? [{ icon: Maximize, value: property.size, label: "متر مربع" }]
      : []),
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-2 gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-luxury sm:grid-cols-3 lg:grid-cols-5"
    >
      {items.map((it, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-brand/10 text-emerald-brand">
            <it.icon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-base font-bold ltr-nums">
              {toPersianDigits(it.value)}
            </div>
            <div className="text-xs text-muted-foreground">{it.label}</div>
          </div>
        </div>
      ))}
    </motion.section>
  );
}

// ============================================================================
//  4) Amenities section
// ============================================================================
function AmenitiesSection({ property }: { property: Property }) {
  if (!property.amenities?.length) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <SectionHeading title="امکانات و ویژگی‌ها" subtitle="راحتی شما" />
      <Card className="shadow-luxury">
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
            {property.amenities.map((a) => (
              <AmenityBadge key={a} amenity={a} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}

// ============================================================================
//  5) Booking widget (sticky)
// ============================================================================
function BookingWidget({ property }: { property: Property }) {
  const user = useAppStore((s) => s.user);
  const openAuth = useAppStore((s) => s.openAuth);
  const goBooking = useAppStore((s) => s.goBooking);
  const setBookingDraft = useAppStore((s) => s.setBookingDraft);
  const bookingDraft = useAppStore((s) => s.bookingDraft);

  const [range, setRange] = useState<DateRange | undefined>(() =>
    bookingDraft.checkIn && bookingDraft.checkOut
      ? {
          from: new Date(bookingDraft.checkIn),
          to: new Date(bookingDraft.checkOut),
        }
      : { from: jalaliPlusDays(2), to: jalaliPlusDays(5) }
  );
  const [guests, setGuests] = useState<number>(
    bookingDraft.guests && bookingDraft.guests > 0 ? bookingDraft.guests : 2
  );
  const [open, setOpen] = useState(false);

  const nights = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    return nightsBetween(range.from, range.to);
  }, [range]);

  const subtotal = nights * property.pricePerNight;

  // Discounts
  let discount = 0;
  let discountLabel = "";
  if (nights >= 30 && property.monthlyDiscount > 0) {
    discount = Math.round((subtotal * property.monthlyDiscount) / 100);
    discountLabel = `تخفیف ماهانه (${toPersianDigits(property.monthlyDiscount)}٪)`;
  } else if (nights >= 7 && property.weeklyDiscount > 0) {
    discount = Math.round((subtotal * property.weeklyDiscount) / 100);
    discountLabel = `تخفیف هفتگی (${toPersianDigits(property.weeklyDiscount)}٪)`;
  }

  const total = Math.max(0, subtotal - discount + property.cleaningFee + property.serviceFee);

  const onBook = () => {
    if (!user) {
      openAuth("login");
      return;
    }
    if (!range?.from || !range?.to) {
      toast.error("لطفاً تاریخ ورود و خروج را انتخاب کنید");
      return;
    }
    setBookingDraft({
      checkIn: range.from.toISOString(),
      checkOut: range.to.toISOString(),
      guests,
    });
    goBooking(property.id);
  };

  return (
    <Card className="overflow-hidden border-border/70 shadow-card-hover">
      <CardContent className="space-y-4 p-5">
        {/* Price */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold">
              {formatTomanCompact(property.pricePerNight)}
            </span>
            <span className="text-sm text-muted-foreground">/ شب</span>
          </div>
          {property.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span className="font-semibold ltr-nums">
                {toPersianDigits(property.rating.toFixed(1))}
              </span>
              <span className="text-muted-foreground">
                ({toPersianDigits(property.reviewCount)})
              </span>
            </div>
          )}
        </div>

        {/* Discount badges */}
        {(property.weeklyDiscount > 0 || property.monthlyDiscount > 0) && (
          <div className="flex flex-wrap gap-2">
            {property.weeklyDiscount > 0 && (
              <Badge
                variant="outline"
                className="gap-1 border-emerald-brand/30 bg-emerald-brand/5 text-emerald-brand"
              >
                <Sparkles className="h-3 w-3" />
                {toPersianDigits(property.weeklyDiscount)}٪ تخفیف هفتگی
              </Badge>
            )}
            {property.monthlyDiscount > 0 && (
              <Badge
                variant="outline"
                className="gap-1 border-gold/30 bg-gold/5 text-gold-foreground"
              >
                <Sparkles className="h-3 w-3" />
                {toPersianDigits(property.monthlyDiscount)}٪ تخفیف ماهانه
              </Badge>
            )}
          </div>
        )}

        {/* Date range */}
        <div className="rounded-xl border border-border/70">
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border/70">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button className="flex flex-col items-start gap-0.5 px-3 py-2.5 text-right transition-colors hover:bg-accent/50">
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">
                    ورود
                  </span>
                  <span className="text-sm font-medium">
                    {range?.from ? formatJalaliShort(range.from) : "انتخاب"}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                sideOffset={6}
              >
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={1}
                  locale={faIR}
                  disabled={{ before: new Date() }}
                  dir="rtl"
                  formatters={calendarFormatters}
                />
              </PopoverContent>
            </Popover>
            <div className="flex flex-col items-start gap-0.5 px-3 py-2.5">
              <span className="text-[10px] font-medium uppercase text-muted-foreground">
                خروج
              </span>
              <span className="text-sm font-medium">
                {range?.to ? formatJalaliShort(range.to) : "انتخاب"}
              </span>
            </div>
          </div>
          {/* Guests */}
          <div className="flex items-center justify-between border-t border-border/70 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-brand" />
              <span className="text-sm font-medium">میهمان</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
                aria-label="کاهش میهمان"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-7 text-center text-sm font-bold ltr-nums">
                {toPersianDigits(guests)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() =>
                  setGuests((g) => Math.min(property.maxGuests, g + 1))
                }
                disabled={guests >= property.maxGuests}
                aria-label="افزایش میهمان"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full gap-2 rounded-xl shadow-luxury"
          onClick={onBook}
        >
          <CalendarDays className="h-4 w-4" />
          رزرو کنید
        </Button>

        {!user && (
          <p className="text-center text-xs text-muted-foreground">
            برای ادامه رزرو وارد حساب خود شوید
          </p>
        )}

        {/* Price breakdown */}
        {nights > 0 && (
          <div className="space-y-2 border-t border-border/70 pt-3 text-sm">
            <Row
              label={`${toPersianDigits(nights)} شب × ${formatTomanCompact(
                property.pricePerNight
              )}`}
              value={formatToman(subtotal)}
            />
            {discount > 0 && (
              <Row
                label={discountLabel}
                value={`− ${formatToman(discount)}`}
                valueClass="text-emerald-brand"
              />
            )}
            <Row
              label="هزینه پاکسازی"
              value={formatToman(property.cleaningFee)}
            />
            <Row
              label="کارمزد خدمات"
              value={formatToman(property.serviceFee)}
            />
            <Separator className="my-2" />
            <Row
              label="مجموع"
              value={formatToman(total)}
              bold
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  bold,
  valueClass,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={cn("text-muted-foreground", bold && "font-semibold text-foreground")}>
        {label}
      </span>
      <span
        className={cn(
          "ltr-nums",
          bold ? "font-bold" : "font-medium",
          valueClass
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================================================
//  6) Map section (stylized placeholder)
// ============================================================================
function MapSection({ property }: { property: Property }) {
  // Normalize Iran bounds: lat 25..40, lng 44..63
  const lat = property.lat ?? 32.0;
  const lng = property.lng ?? 53.0;
  const x = ((lng - 44) / (63 - 44)) * 100; // 0..100
  const y = ((40 - lat) / (40 - 25)) * 100; // 0..100

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <SectionHeading title="موقعیت مکانی" subtitle="کی مقصد است" />
      <Card className="overflow-hidden border-border/70 shadow-luxury">
        <div
          dir="ltr"
          className="relative h-72 w-full bg-gradient-to-br from-emerald-brand/10 via-accent to-gold/10"
        >
          {/* Decorative grid */}
          <div className="bg-grid absolute inset-0 opacity-60" />
          {/* Decorative blobs */}
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-emerald-brand/15 blur-3xl" />
          <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />

          {/* City label */}
          <div className="absolute right-4 top-4 rounded-full glass px-3 py-1.5 text-sm font-medium shadow-sm">
            <MapPin className="ml-1 inline h-3.5 w-3.5 text-emerald-brand" />
            {property.city}
          </div>

          {/* Pin marker */}
          <div
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="relative flex flex-col items-center">
              <div className="absolute -bottom-1 h-6 w-6 animate-pulse-ring rounded-full bg-emerald-brand/30" />
              <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-brand text-white shadow-luxury ring-4 ring-background">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="mt-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm">
                {property.city}
              </div>
            </div>
          </div>
        </div>
        <CardContent className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium">{property.address}</p>
            <p className="text-xs text-muted-foreground">
              {property.city}، {property.province}
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-1.5 rounded-full"
            onClick={() => {
              const lat = property.lat ?? 35.6892;
              const lng = property.lng ?? 51.3890;
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
                "_blank"
              );
            }}
          >
            <MapPinned className="h-4 w-4" />
            مشاهده روی نقشه
          </Button>
        </CardContent>
      </Card>
    </motion.section>
  );
}

// ============================================================================
//  7) Reviews section
// ============================================================================
const categoryLabels: { key: keyof Review; label: string }[] = [
  { key: "cleanliness", label: "تمیزی" },
  { key: "communication", label: "ارتباط" },
  { key: "checkIn", label: "ورود" },
  { key: "accuracy", label: "دقت" },
  { key: "location", label: "موقعیت" },
  { key: "value", label: "ارزش" },
];

function ReviewsSection({
  propertyId,
  propertyTitle,
  rating,
  reviewCount,
}: {
  propertyId: string;
  propertyTitle: string;
  rating: number;
  reviewCount: number;
}) {
  const { data, isLoading } = usePropertyReviews(propertyId);
  const user = useAppStore((s) => s.user);
  const openAuth = useAppStore((s) => s.openAuth);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const reviews = data?.items ?? [];
  const summary = data?.summary;

  const onWrite = () => {
    if (!user) {
      openAuth("login");
      return;
    }
    setReviewModalOpen(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <SectionHeading
        title="نظرات میهمانان"
        subtitle="تجربه واقعی"
        action={
          <Button
            variant="outline"
            className="gap-1.5 rounded-full"
            onClick={onWrite}
          >
            <MessageSquarePlus className="h-4 w-4" />
            نظر خود را بنویسید
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary card */}
        <Card className="shadow-luxury lg:col-span-1">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <div className="text-5xl font-bold ltr-nums text-emerald-brand">
              {toPersianDigits(rating.toFixed(1))}
            </div>
            <RatingStars rating={rating} size={18} showValue={false} />
            <div className="text-sm font-medium">{ratingLabel(rating)}</div>
            <div className="text-xs text-muted-foreground">
              {toPersianDigits(reviewCount)} نظر ثبت شده
            </div>
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card className="shadow-luxury lg:col-span-2">
          <CardContent className="space-y-3 pt-2">
            {categoryLabels.map((cat) => {
              const val = summary ? (summary as any)[cat.key] ?? 0 : rating;
              return (
                <div
                  key={cat.key}
                  className="flex items-center gap-3"
                >
                  <span className="w-20 shrink-0 text-sm text-muted-foreground">
                    {cat.label}
                  </span>
                  <Progress
                    value={(val / 5) * 100}
                    className="h-2 flex-1"
                  />
                  <span className="w-10 shrink-0 text-left text-sm font-medium ltr-nums">
                    {toPersianDigits(val.toFixed(1))}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Review list */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 pt-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.slice(0, 6).map((r, i) => (
            <ReviewCard key={r.id} review={r} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquarePlus}
          title="هنوز نظری ثبت نشده"
          description="اولین نفری باشید که تجربه خود را به اشتراک می‌گذارد."
        />
      )}

      <ReviewWriteModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
      />
    </motion.section>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const name = review.user?.name || "کاربر";
  const initial = name.slice(0, 1);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="h-full border-border/70 shadow-sm">
        <CardContent className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-emerald-brand/15">
              {review.user?.avatar ? (
                <AvatarImage src={review.user.avatar} alt={name} />
              ) : null}
              <AvatarFallback className="bg-emerald-brand/10 text-emerald-brand">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">
                {formatJalali(review.createdAt)}
              </div>
            </div>
            <RatingStars rating={review.rating} size={12} showValue={false} />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
            {review.comment}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
//  8) Similar properties
// ============================================================================
function SimilarSection({ propertyId }: { propertyId: string }) {
  const { data, isLoading } = useSimilarProperties(propertyId);
  const items = data?.slice(0, 4) ?? [];

  if (!isLoading && items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <SectionHeading title="اقامتگاه‌های مشابه" subtitle="پیشنهاد دیگر" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
            ))
          : items.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} variant="compact" />
            ))}
      </div>
    </motion.section>
  );
}

// ============================================================================
//  9) Availability calendar (mock)
// ============================================================================
function AvailabilitySection({ property }: { property: Property }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Generate mock booked dates (deterministic by property id)
  const bookedDates = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const last = new Date(y, m + 1, 0).getDate();
    let h = 0;
    for (let i = 0; i < property.id.length; i++) {
      h = (h * 31 + property.id.charCodeAt(i)) >>> 0;
    }
    const booked: Date[] = [];
    for (let i = 0; i < 6; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      const day = (h % last) + 1;
      const d = new Date(y, m, day);
      if (d >= today) booked.push(d);
    }
    return booked;
  }, [property.id]);

  const disabledDates = bookedDates;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <SectionHeading title="تقویم دسترسی" subtitle="روزهای خالی" />
      <Card className="shadow-luxury">
        <CardContent className="flex flex-col items-center gap-6 py-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              numberOfMonths={1}
              locale={faIR}
              disabled={[
                { before: new Date() },
                ...disabledDates.map((d) => ({ from: d, to: d })),
              ]}
              dir="rtl"
              formatters={calendarFormatters}
            />
          </div>

          <div className="w-full max-w-xs space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">راهنمای تقویم</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-3 w-3 rounded-sm bg-primary" />
                روزهای قابل انتخاب
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-3 w-3 rounded-sm bg-muted" />
                رزرو شده
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-3 w-3 rounded-sm bg-accent" />
                امروز
              </div>
            </div>

            {selectedDate && (
              <div className="rounded-xl border border-border/70 bg-accent/30 p-3">
                <p className="text-xs text-muted-foreground">تاریخ انتخاب‌شده</p>
                <p className="mt-1 text-sm font-medium">
                  {formatJalali(selectedDate)}
                </p>
                <Button
                  size="sm"
                  className="mt-3 w-full gap-1.5"
                  onClick={() =>
                    toast.success(
                      `ورود در ${formatJalaliShort(selectedDate)} انتخاب شد`
                    )
                  }
                >
                  <Check className="h-3.5 w-3.5" />
                  انتخاب به عنوان ورود
                </Button>
              </div>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              روزهای رزروشده به‌صورت نمایشی هستند. برای رزرو نهایی، از فرم کناری
              استفاده کنید.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}

// ============================================================================
//  Lightbox (fullscreen gallery carousel)
// ============================================================================
function Lightbox({
  images,
  index,
  onClose,
  onIndex,
  title,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number | null) => void;
  title: string;
}) {
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index !== null) {
        onIndex((index + 1) % images.length);
      }
      if (e.key === "ArrowLeft" && index !== null) {
        onIndex((index - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onClose, onIndex]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-5xl border-border/40 bg-black/95 p-0 sm:rounded-2xl"
      >
        <DialogTitle className="sr-only">{title} — نمایشگر تصاویر</DialogTitle>
        <DialogDescription className="sr-only">
          نمایش تمام‌صفحه تصاویر اقامتگاه با امکان جابه‌جایی
        </DialogDescription>
        <div className="relative h-[80vh] w-full">
          {index !== null && images[index] && (
            <Image
              src={detailImage(images[index])}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
              placeholder="blur"
              blurDataURL={SHIMMER_BLUR}
              priority
            />
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full glass text-white shadow-sm transition-all hover:scale-110"
            aria-label="بستن"
          >
            <BackIcon className="h-5 w-5" />
          </button>

          {/* Counter */}
          {index !== null && (
            <div className="absolute right-4 top-4 z-20 rounded-full glass px-3 py-1.5 text-xs font-medium text-white shadow-sm">
              {toPersianDigits(index + 1)} / {toPersianDigits(images.length)}
            </div>
          )}

          {/* Prev / Next (RTL: ArrowRight visually points right) */}
          {images.length > 1 && index !== null && (
            <>
              <button
                onClick={() => onIndex((index - 1 + images.length) % images.length)}
                className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass text-white shadow-sm transition-all hover:scale-110"
                aria-label="قبلی"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => onIndex((index + 1) % images.length)}
                className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass text-white shadow-sm transition-all hover:scale-110"
                aria-label="بعدی"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
//  Loading skeleton
// ============================================================================
function PropertyDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <Skeleton className="mb-4 h-8 w-24 rounded-full" />
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2 md:h-[480px]">
        <Skeleton className="col-span-2 row-span-2 h-full rounded-2xl" />
        <Skeleton className="hidden rounded-2xl md:block" />
        <Skeleton className="hidden rounded-2xl md:block" />
        <Skeleton className="hidden rounded-2xl md:block" />
        <Skeleton className="hidden rounded-2xl md:block" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
//  Not found / error
// ============================================================================
function PropertyDetailNotFound() {
  const setView = useAppStore((s) => s.setView);
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <EmptyState
        icon={Home}
        title="اقامتگاه یافت نشد"
        description="ممکن است این اقامتگاه حذف شده باشد یا لینک نادرست است."
        action={
          <Button onClick={() => setView("home")} className="gap-1.5 rounded-full">
            بازگشت به خانه
            <ArrowRight className="h-4 w-4" />
          </Button>
        }
      />
    </div>
  );
}
