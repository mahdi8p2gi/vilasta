"use client";

// ============================================================================
//  BookingView — Multi-step checkout flow (RTL Persian, emerald + gold)
//  Steps: 1) Date & Guests → 2) Contact Info → 3) Payment → 4) Confirmation
// ============================================================================

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { faIR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import {
  ArrowRight,
  CalendarDays,
  Users,
  Plus,
  Minus,
  User as UserIcon,
  Phone,
  Mail,
  CreditCard,
  ShieldCheck,
  Lock,
  Check,
  CheckCircle2,
  Home,
  MapPin,
  Star,
  BadgeCheck,
  Wallet,
  Landmark,
  Banknote,
  Sparkles,
  Moon,
  Ticket,
  Loader2,
  CalendarX2,
  KeyRound,
} from "lucide-react";

import { useProperty } from "@/hooks/use-api";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { RatingStars } from "@/components/shared/rating-stars";
import { propertyTypeMeta } from "@/config/site";
import {
  formatToman,
  formatTomanCompact,
  toPersianDigits,
  toEnglishDigits,
  formatJalali,
  formatJalaliShort,
  nightsBetween,
  pluralFa,
} from "@/lib/persian";
import { jalaliPlusDays } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { Property, Booking } from "@/types";

// ============================================================================
//  Calendar Persian formatters
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
//  Step config
// ============================================================================
const STEPS = [
  { id: 1, label: "تاریخ و مسافر", short: "تاریخ", icon: CalendarDays },
  { id: 2, label: "اطلاعات تماس", short: "تماس", icon: UserIcon },
  { id: 3, label: "پرداخت", short: "پرداخت", icon: CreditCard },
  { id: 4, label: "تأیید", short: "تأیید", icon: CheckCircle2 },
] as const;

// ============================================================================
//  Pricing
// ============================================================================
interface Pricing {
  nights: number;
  pricePerNight: number;
  subtotal: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  discount: number;
  discountLabel: string;
  cleaningFee: number;
  serviceFee: number;
  total: number;
}

function computePricing(
  property: Property,
  checkIn: Date | null,
  checkOut: Date | null
): Pricing {
  const nights =
    checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const pricePerNight = property.pricePerNight;
  const subtotal = nights * pricePerNight;
  const cleaningFee = property.cleaningFee;
  const serviceFee = property.serviceFee;

  let weeklyDiscount = 0;
  let monthlyDiscount = 0;
  let discount = 0;
  let discountLabel = "";

  if (nights >= 30 && property.monthlyDiscount > 0) {
    monthlyDiscount = Math.round((subtotal * property.monthlyDiscount) / 100);
    discount = monthlyDiscount;
    discountLabel = `تخفیف ماهانه (${toPersianDigits(property.monthlyDiscount)}٪)`;
  } else if (nights >= 7 && property.weeklyDiscount > 0) {
    weeklyDiscount = Math.round((subtotal * property.weeklyDiscount) / 100);
    discount = weeklyDiscount;
    discountLabel = `تخفیف هفتگی (${toPersianDigits(property.weeklyDiscount)}٪)`;
  }

  const total = Math.max(0, subtotal - discount + cleaningFee + serviceFee);

  return {
    nights,
    pricePerNight,
    subtotal,
    weeklyDiscount,
    monthlyDiscount,
    discount,
    discountLabel,
    cleaningFee,
    serviceFee,
    total,
  };
}

// ============================================================================
//  Main entry
// ============================================================================
export function BookingView({ propertyId }: { propertyId: string | null }) {
  // Hooks must be called unconditionally — useProperty has enabled: !!id guard
  const { data, isLoading, isError } = useProperty(propertyId);

  if (!propertyId) return <BookingMissing />;
  if (isLoading) return <BookingSkeleton />;
  if (isError || !data?.property) return <BookingMissing />;

  return <BookingContent property={data.property} />;
}

// ============================================================================
//  Not found / missing
// ============================================================================
function BookingMissing() {
  const goBack = useAppStore((s) => s.goBack);
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <EmptyState
        icon={CalendarX2}
        title="اقامتگاهی برای رزرو یافت نشد"
        description="ممکن است لینک رزرو نامعتبر باشد یا اقامتگاه حذف شده باشد."
        action={
          <Button onClick={() => goBack()} className="gap-1.5">
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
        }
      />
    </div>
  );
}

// ============================================================================
//  Loading skeleton
// ============================================================================
function BookingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <Skeleton className="mb-4 h-8 w-32" />
      <Skeleton className="mb-6 h-10 w-full" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
//  Content shell
// ============================================================================
function BookingContent({ property }: { property: Property }) {
  const goBack = useAppStore((s) => s.goBack);
  const user = useAppStore((s) => s.user);
  const openAuth = useAppStore((s) => s.openAuth);
  const setView = useAppStore((s) => s.setView);
  const goDashboard = useAppStore((s) => s.goDashboard);
  const bookingDraft = useAppStore((s) => s.bookingDraft);
  const setBookingDraft = useAppStore((s) => s.setBookingDraft);

  const isMobile = useIsMobile();

  const [step, setStep] = useState<number>(1);
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (bookingDraft.checkIn && bookingDraft.checkOut) {
      return {
        from: new Date(bookingDraft.checkIn),
        to: new Date(bookingDraft.checkOut),
      };
    }
    return { from: jalaliPlusDays(2), to: jalaliPlusDays(5) };
  });
  const [guests, setGuests] = useState<number>(
    bookingDraft.guests && bookingDraft.guests > 0 ? bookingDraft.guests : 2
  );

  const [paymentMethod, setPaymentMethod] = useState<string>("gateway");
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);

  // Persist draft back to store whenever range/guests change
  useEffect(() => {
    if (range?.from && range?.to) {
      setBookingDraft({
        checkIn: range.from.toISOString(),
        checkOut: range.to.toISOString(),
        guests,
      });
    }
  }, [range, guests, setBookingDraft]);

  const pricing = useMemo(
    () => computePricing(property, range?.from ?? null, range?.to ?? null),
    [property, range]
  );

  const stepperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Scroll stepper into view on step change (smooth, not jarring)
    if (stepperRef.current) {
      const top = stepperRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [step]);

  const canAdvanceStep1 = !!(range?.from && range?.to) && pricing.nights > 0;

  const goNext = () => {
    if (step === 1) {
      if (!canAdvanceStep1) {
        toast.error("لطفاً تاریخ ورود و خروج را انتخاب کنید");
        return;
      }
      if (!user) {
        toast.info("برای ادامه، وارد حساب خود شوید");
        openAuth("login");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step < 4) setStep((s) => s + 1);
  };

  const goPrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const onPay = async () => {
    if (!user) {
      openAuth("login");
      return;
    }
    if (!range?.from || !range?.to) {
      toast.error("تاریخ رزرو ناقص است");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          userId: user.id,
          checkIn: range.from.toISOString(),
          checkOut: range.to.toISOString(),
          guests,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "خطا در ثبت رزرو");
      }
      const booking: Booking = await res.json();
      setBookingResult(booking);
      setStep(4);
      toast.success("رزرو با موفقیت ثبت شد");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا در پرداخت");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      {/* Back */}
      <button
        onClick={() => goBack()}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت
      </button>

      {/* Header */}
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="text-gradient-emerald">تکمیل رزرو</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {property.title} — {property.city}، {property.province}
        </p>
      </div>

      {/* Stepper */}
      <div ref={stepperRef}>
        <Stepper currentStep={step} onJump={(s) => s < step && setStep(s)} />
      </div>

      {/* Two-column layout (RTL: main right, aside left) */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {step === 1 && (
                <StepDateGuests
                  property={property}
                  range={range}
                  setRange={setRange}
                  guests={guests}
                  setGuests={setGuests}
                  pricing={pricing}
                  isMobile={isMobile}
                  onContinue={goNext}
                />
              )}
              {step === 2 && (
                <StepContact
                  key={user?.id || "guest"}
                  isMobile={isMobile}
                  total={pricing.total}
                  onContinue={goNext}
                  onBack={goPrev}
                />
              )}
              {step === 3 && (
                <StepPayment
                  property={property}
                  pricing={pricing}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  submitting={submitting}
                  isMobile={isMobile}
                  onPay={onPay}
                  onBack={goPrev}
                />
              )}
              {step === 4 && bookingResult && (
                <StepConfirmation
                  property={property}
                  booking={bookingResult}
                  pricing={pricing}
                  onMyBookings={() => goDashboard("bookings")}
                  onHome={() => setView("home")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Sticky summary sidebar */}
        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-20">
            <BookingSummary
              property={property}
              pricing={pricing}
              checkIn={range?.from ?? null}
              checkOut={range?.to ?? null}
              guests={guests}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

// ============================================================================
//  Stepper
// ============================================================================
function Stepper({
  currentStep,
  onJump,
}: {
  currentStep: number;
  onJump: (s: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start">
        {STEPS.map((s, i) => {
          const completed = s.id < currentStep;
          const current = s.id === currentStep;
          const clickable = s.id < currentStep;
          return (
            <Fragment key={s.id}>
              <button
                type="button"
                onClick={() => clickable && onJump(s.id)}
                disabled={!clickable}
                className={cn(
                  "flex min-w-[56px] flex-col items-center gap-2 text-center",
                  clickable && "cursor-pointer",
                  !clickable && "cursor-default"
                )}
              >
                <StepCircle
                  icon={s.icon}
                  completed={completed}
                  current={current}
                />
                <span
                  className={cn(
                    "max-w-[72px] text-[10px] leading-tight sm:max-w-none sm:text-xs sm:leading-none",
                    current
                      ? "font-semibold text-primary"
                      : completed
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.short}</span>
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="relative mx-1 mt-5 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                  <motion.div
                    initial={false}
                    animate={{ width: completed ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-y-0 right-0 bg-primary"
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function StepCircle({
  icon: Icon,
  completed,
  current,
}: {
  icon: typeof CalendarDays;
  completed: boolean;
  current: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ scale: current ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors sm:h-10 sm:w-10",
        completed && "border-primary bg-primary text-primary-foreground",
        current &&
          "border-primary bg-primary/10 text-primary ring-4 ring-primary/10",
        !completed && !current && "border-border bg-card text-muted-foreground"
      )}
    >
      {completed ? (
        <Check className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} />
      ) : (
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      )}
    </motion.div>
  );
}

// ============================================================================
//  Step 1 — Date & Guests
// ============================================================================
function StepDateGuests({
  property,
  range,
  setRange,
  guests,
  setGuests,
  pricing,
  isMobile,
  onContinue,
}: {
  property: Property;
  range: DateRange | undefined;
  setRange: (r: DateRange | undefined) => void;
  guests: number;
  setGuests: (n: number) => void;
  pricing: Pricing;
  isMobile: boolean;
  onContinue: () => void;
}) {
  const meta = propertyTypeMeta[property.type];
  const canContinue = !!(range?.from && range?.to) && pricing.nights > 0;

  return (
    <Card className="border-border/70 shadow-luxury">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="h-5 w-5 text-emerald-brand" />
          تاریخ و تعداد مسافر
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Calendar */}
        <div className="flex justify-center overflow-x-auto scrollbar-thin">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={isMobile ? 1 : 2}
            locale={faIR}
            disabled={{ before: new Date() }}
            dir="rtl"
            formatters={calendarFormatters}
          />
        </div>

        {/* Selected range summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <DateCell
            label="ورود"
            value={range?.from ? formatJalaliShort(range.from) : "—"}
          />
          <DateCell
            label="خروج"
            value={range?.to ? formatJalaliShort(range.to) : "—"}
          />
          <div className="col-span-2 flex flex-col gap-1 rounded-xl border border-border/70 bg-muted/30 px-3 py-2 sm:col-span-1">
            <span className="text-[10px] font-medium uppercase text-muted-foreground">
              مدت اقامت
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <Moon className="h-3.5 w-3.5 text-emerald-brand" />
              {toPersianDigits(pricing.nights)} شب
            </span>
          </div>
        </div>

        <Separator />

        {/* Guests */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-brand/10 text-emerald-brand">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                تعداد مسافر
              </div>
              <p className="text-xs text-muted-foreground">
                حداکثر {toPersianDigits(property.maxGuests)} نفر
                {meta ? ` · ${meta.label}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              disabled={guests <= 1}
              aria-label="کاهش مسافر"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-base font-bold ltr-nums">
              {toPersianDigits(guests)}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
              disabled={guests >= property.maxGuests}
              aria-label="افزایش مسافر"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <StepFooter
          isMobile={isMobile}
          total={pricing.total}
          onContinue={onContinue}
          continueDisabled={!canContinue}
          continueLabel="ادامه"
        />
      </CardContent>
    </Card>
  );
}

function DateCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/70 bg-muted/30 px-3 py-2">
      <span className="text-[10px] font-medium uppercase text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold ltr-nums">{value}</span>
    </div>
  );
}

// ============================================================================
//  Step 2 — Contact Info
// ============================================================================
interface ContactForm {
  name: string;
  phone: string;
  email: string;
  note: string;
}

function StepContact({
  isMobile,
  total,
  onContinue,
  onBack,
}: {
  isMobile: boolean;
  total: number;
  onContinue: () => void;
  onBack: () => void;
}) {
  const user = useAppStore((s) => s.user);
  const openAuth = useAppStore((s) => s.openAuth);

  const [form, setForm] = useState<ContactForm>({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    note: "",
  });
  const [touched, setTouched] = useState(false);

  if (!user) {
    return (
      <Card className="border-border/70 shadow-luxury">
        <CardContent className="pt-6">
          <EmptyState
            icon={Lock}
            title="برای ادامه، وارد حساب خود شوید"
            description="برای تکمیل رزرو، اطلاعات تماس شما لازم است. لطفاً وارد شوید یا ثبت‌نام کنید."
            action={
              <Button onClick={() => openAuth("login")} className="gap-1.5">
                <KeyRound className="h-4 w-4" />
                ورود / ثبت‌نام
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  const nameValid = form.name.trim().length >= 3;
  const phoneValid = /^09\d{9}$/.test(toEnglishDigits(form.phone).replace(/\s/g, ""));
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const valid = nameValid && phoneValid && emailValid;

  const submit = () => {
    setTouched(true);
    if (!valid) {
      toast.error("لطفاً اطلاعات تماس را کامل و صحیح وارد کنید");
      return;
    }
    onContinue();
  };

  return (
    <Card className="border-border/70 shadow-luxury">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserIcon className="h-5 w-5 text-emerald-brand" />
          اطلاعات تماس
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="contact-name"
            label="نام و نام خانوادگی"
            icon={UserIcon}
            error={touched && !nameValid ? "نام باید حداقل ۳ حرف باشد" : undefined}
          >
            <Input
              id="contact-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="مثلاً: علی محمدی"
              className="h-11"
            />
          </Field>
          <Field
            id="contact-phone"
            label="شماره موبایل"
            icon={Phone}
            error={touched && !phoneValid ? "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)" : undefined}
            dir="ltr"
          >
            <Input
              id="contact-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="09123456789"
              inputMode="tel"
              className="h-11 text-right"
              dir="ltr"
            />
          </Field>
        </div>

        <Field
          id="contact-email"
          label="ایمیل"
          icon={Mail}
          error={touched && !emailValid ? "ایمیل معتبر نیست" : undefined}
          dir="ltr"
        >
          <Input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="h-11 text-right"
            dir="ltr"
          />
        </Field>

        <Field
          id="contact-note"
          label="درخواست ویژه (اختیاری)"
          icon={Sparkles}
        >
          <Textarea
            id="contact-note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="هر درخواست خاصی دارید اینجا بنویسید…"
            className="min-h-24 resize-y"
          />
        </Field>

        <div className="flex items-start gap-2 rounded-xl border border-emerald-brand/20 bg-emerald-brand/5 p-3 text-xs text-emerald-brand">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            اطلاعات تماس شما فقط برای میزبان و هماهنگی رزرو استفاده می‌شود و محرمانه می‌ماند.
          </span>
        </div>

        <StepFooter
          isMobile={isMobile}
          total={total}
          onContinue={submit}
          onBack={onBack}
          continueLabel="ادامه"
        />
      </CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  error,
  dir,
  children,
}: {
  id: string;
  label: string;
  icon: typeof UserIcon;
  error?: string;
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5" dir={dir}>
      <Label htmlFor={id} className="flex items-center gap-1.5 text-sm">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ============================================================================
//  Step 3 — Payment
// ============================================================================
type PaymentMethod = {
  id: string;
  label: string;
  description: string;
  icon: typeof CreditCard;
  available: boolean;
};

function StepPayment({
  property,
  pricing,
  paymentMethod,
  setPaymentMethod,
  submitting,
  isMobile,
  onPay,
  onBack,
}: {
  property: Property;
  pricing: Pricing;
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
  submitting: boolean;
  isMobile: boolean;
  onPay: () => void;
  onBack: () => void;
}) {
  // Pay-at-location is allowed for hotels & resorts (typical hospitality flow)
  const allowPayAtLocation =
    property.type === "hotel" || property.type === "resort";

  const methods: PaymentMethod[] = [
    {
      id: "gateway",
      label: "درگاه بانکی آنلاین",
      description: "پرداخت آنی با کارت بانکی شتاب",
      icon: CreditCard,
      available: true,
    },
    {
      id: "card-to-card",
      label: "کارت به کارت",
      description: "انتقال مستقیم به کارت میزبان، با تأیید دستی",
      icon: Landmark,
      available: true,
    },
    {
      id: "on-arrival",
      label: "پرداخت در محل",
      description: "پرداخت نقدی هنگام تحویل کلید",
      icon: Wallet,
      available: allowPayAtLocation,
    },
  ].filter((m) => m.available);

  return (
    <Card className="border-border/70 shadow-luxury">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-emerald-brand" />
          روش پرداخت
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="gap-3"
        >
          {methods.map((m) => {
            const active = paymentMethod === m.id;
            return (
              <label
                key={m.id}
                htmlFor={`pm-${m.id}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all",
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <RadioGroupItem
                  value={m.id}
                  id={`pm-${m.id}`}
                  className="mt-1"
                />
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-emerald-brand/10 text-emerald-brand"
                  )}
                >
                  <m.icon className="h-4.5 w-4.5" />
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="text-sm font-semibold">{m.label}</div>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                </div>
              </label>
            );
          })}
        </RadioGroup>

        {/* Card form (only for gateway) */}
        <AnimatePresence mode="wait">
          {paymentMethod === "gateway" && (
            <motion.div
              key="card-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <CardForm />
            </motion.div>
          )}
        </AnimatePresence>

        {paymentMethod === "card-to-card" && (
          <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-gold-foreground">
              <Banknote className="h-4 w-4" />
              اطلاعات کارت میزبان
            </div>
            <p className="ltr-nums text-muted-foreground" dir="ltr">
              ۶۰۳۷-۹۹۱۱-۲۲۳۳-۴۴۵۵ — به نام میزبان
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              پس از واریز، رسید را در پنل کاربری ارسال کنید تا رزرو تأیید شود.
            </p>
          </div>
        )}

        {paymentMethod === "on-arrival" && (
          <div className="rounded-xl border border-emerald-brand/20 bg-emerald-brand/5 p-4 text-sm text-emerald-brand">
            <ShieldCheck className="ml-1 inline h-4 w-4" />
            مبلغ {formatToman(pricing.total)} هنگام تحویل کلید به میزبان پرداخت می‌شود.
            رزرو شما با وضعیت «در انتظار پرداخت» ثبت می‌شود.
          </div>
        )}

        {/* Price breakdown */}
        <PriceBreakdown pricing={pricing} />

        {/* Trust signals */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-brand" />
            پرداخت امن
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-brand" />
            محافظت از خریدار
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="h-3.5 w-3.5 text-emerald-brand" />
            تأیید فوری رزرو
          </span>
        </div>

        <StepFooter
          isMobile={isMobile}
          total={pricing.total}
          onContinue={onPay}
          onBack={onBack}
          continueDisabled={submitting}
          continueLoading={submitting}
          continueLabel="پرداخت و رزرو"
          continueIcon={<Lock className="h-4 w-4" />}
        />
      </CardContent>
    </Card>
  );
}

// ============================================================================
//  Card form (mock) with animated preview
// ============================================================================
function CardForm() {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cvvFocused, setCvvFocused] = useState(false);

  const brand = detectBrand(number);

  return (
    <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4">
      {/* Card preview */}
      <div className="flex justify-center">
        <div className="relative h-52 w-full max-w-sm [perspective:1200px]">
          <motion.div
            animate={{ rotateY: cvvFocused ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative h-full w-full [transform-style:preserve-3d]"
          >
            {/* Front */}
            <div
              dir="ltr"
              className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-brand via-primary to-emerald-brand/80 p-5 text-white shadow-luxury [backface-visibility:hidden]"
            >
              {/* decorative blobs */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-10 rounded-md bg-gradient-to-br from-gold to-amber-600 shadow-inner" />
                  <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                    {brand}
                  </span>
                </div>
                <CreditCard className="h-6 w-6 opacity-80" />
              </div>

              <div className="relative font-mono text-lg tracking-[0.2em] ltr-nums sm:text-xl">
                {number || "•••• •••• •••• ••••"}
              </div>

              <div className="relative flex items-end justify-between text-xs">
                <div>
                  <div className="mb-0.5 text-[9px] uppercase opacity-70">
                    Card Holder
                  </div>
                  <div className="font-medium uppercase tracking-wide">
                    {name || "FULL NAME"}
                  </div>
                </div>
                <div>
                  <div className="mb-0.5 text-[9px] uppercase opacity-70">
                    Expires
                  </div>
                  <div className="font-mono ltr-nums">
                    {expiry || "MM/YY"}
                  </div>
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              dir="ltr"
              className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-emerald-brand p-5 text-white shadow-luxury [backface-visibility:hidden] [transform:rotateY(180deg)]"
            >
              <div className="-mx-5 mt-4 h-10 bg-black/70" />
              <div className="mt-6 space-y-2">
                <div className="text-[9px] uppercase opacity-70">CVV</div>
                <div className="flex h-9 items-center rounded-md bg-white/85 px-3 font-mono text-sm text-black ltr-nums">
                  {cvv || "•••"}
                </div>
              </div>
              <div className="mt-auto text-[10px] opacity-70">
                این یک کارت نمایشی است — هیچ پرداخت واقعی انجام نمی‌شود.
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="card-number" className="flex items-center gap-1.5 text-sm">
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
            شماره کارت
          </Label>
          <Input
            id="card-number"
            value={number}
            onChange={(e) => setNumber(formatCardNumber(e.target.value))}
            placeholder="۴۲۱۳ ۱۲۳۴ ۵۶۷۸ ۹۰۱۲"
            inputMode="numeric"
            className="h-11 font-mono tracking-wider ltr-nums"
            dir="ltr"
            maxLength={19}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="card-name" className="flex items-center gap-1.5 text-sm">
            <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
            نام روی کارت
          </Label>
          <Input
            id="card-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="FULL NAME"
            className="h-11"
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="card-expiry" className="flex items-center gap-1.5 text-sm">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              انقضا
            </Label>
            <Input
              id="card-expiry"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              inputMode="numeric"
              className="h-11 font-mono ltr-nums"
              dir="ltr"
              maxLength={5}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="card-cvv" className="flex items-center gap-1.5 text-sm">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              CVV
            </Label>
            <Input
              id="card-cvv"
              value={cvv}
              onChange={(e) => setCvv(formatCvv(e.target.value))}
              onFocus={() => setCvvFocused(true)}
              onBlur={() => setCvvFocused(false)}
              placeholder="•••"
              inputMode="numeric"
              className="h-11 font-mono ltr-nums"
              dir="ltr"
              maxLength={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCardNumber(v: string): string {
  const digits = toEnglishDigits(v).replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string): string {
  const digits = toEnglishDigits(v).replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvv(v: string): string {
  return toEnglishDigits(v).replace(/\D/g, "").slice(0, 4);
}

function detectBrand(num: string): string {
  const n = toEnglishDigits(num).replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6/.test(n)) return "Discover";
  return "Bank";
}

// ============================================================================
//  Step 4 — Confirmation
// ============================================================================
function StepConfirmation({
  property,
  booking,
  pricing,
  onMyBookings,
  onHome,
}: {
  property: Property;
  booking: Booking;
  pricing: Pricing;
  onMyBookings: () => void;
  onHome: () => void;
}) {
  return (
    <Card className="overflow-hidden border-border/70 shadow-luxury">
      <CardContent className="pt-6">
        {/* Success animation */}
        <SuccessAnimation />

        <div className="space-y-4 text-center">
          <div>
            <h2 className="text-2xl font-bold text-gradient-emerald">
              رزرو شما تأیید شد!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              یک ایمیل تأییدیه برای شما ارسال شد. میزبان منتظر شماست.
            </p>
          </div>

          {/* Booking card */}
          <div className="mx-auto max-w-md rounded-2xl border border-border/70 bg-muted/30 p-4 text-right">
            <div className="flex gap-3">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="truncate font-semibold">{property.title}</h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {property.city}، {property.province}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-gold text-gold" />
                  <span className="font-medium ltr-nums">
                    {toPersianDigits(property.rating.toFixed(1))}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <dl className="space-y-2 text-sm">
              <ConfirmRow
                icon={CalendarDays}
                label="تاریخ ورود"
                value={formatJalali(booking.checkIn)}
              />
              <ConfirmRow
                icon={CalendarDays}
                label="تاریخ خروج"
                value={formatJalali(booking.checkOut)}
              />
              <ConfirmRow
                icon={Moon}
                label="مدت اقامت"
                value={`${toPersianDigits(pricing.nights)} شب`}
              />
              <ConfirmRow
                icon={Users}
                label="تعداد مسافر"
                value={pluralFa(booking.guests, "نفر", "نفر")}
              />
              <ConfirmRow
                icon={Ticket}
                label="کد رزرو"
                value={
                  <span className="font-mono ltr-nums" dir="ltr">
                    {booking.id.slice(0, 8).toUpperCase()}
                  </span>
                }
              />
            </dl>

            <Separator className="my-3" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">مبلغ پرداخت‌شده</span>
              <span className="text-lg font-bold text-gradient-gold ltr-nums">
                {formatToman(pricing.total)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={onMyBookings} className="gap-1.5">
              <Ticket className="h-4 w-4" />
              مشاهده رزروهای من
            </Button>
            <Button variant="outline" onClick={onHome} className="gap-1.5">
              <Home className="h-4 w-4" />
              بازگشت به خانه
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConfirmRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-emerald-brand" />
        {label}
      </dt>
      <dd className="font-medium ltr-nums">{value}</dd>
    </div>
  );
}

function SuccessAnimation() {
  // Confetti particles
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2 + (i % 2 ? 0.1 : -0.1);
        const dist = 70 + (i % 4) * 22;
        const colors = [
          "var(--emerald-brand)",
          "var(--gold)",
          "var(--primary)",
          "#34d399",
          "#fbbf24",
        ];
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          color: colors[i % colors.length],
          size: 6 + (i % 3) * 3,
          delay: 0.2 + (i % 6) * 0.04,
        };
      }),
    []
  );

  return (
    <div className="relative mx-auto mb-4 flex h-32 w-32 items-center justify-center">
      {/* Pulse rings */}
      <motion.span
        className="absolute inset-0 rounded-full bg-emerald-brand/15"
        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-2 rounded-full bg-emerald-brand/20"
        animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
      />

      {/* Confetti */}
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              background: p.color,
              width: p.size,
              height: p.size,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0, 1, 0.6] }}
            transition={{ duration: 1.1, delay: p.delay, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Main check */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-brand to-primary text-white shadow-luxury"
      >
        <motion.span
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        >
          <Check className="h-10 w-10" strokeWidth={3} />
        </motion.span>
      </motion.div>
    </div>
  );
}

// ============================================================================
//  Sticky summary sidebar
// ============================================================================
function BookingSummary({
  property,
  pricing,
  checkIn,
  checkOut,
  guests,
}: {
  property: Property;
  pricing: Pricing;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}) {
  const meta = propertyTypeMeta[property.type];
  const TypeIcon = meta?.icon;

  return (
    <Card className="overflow-hidden border-border/70 shadow-card-hover">
      {/* Property preview */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <Image
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
        {TypeIcon && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-xs font-medium shadow-sm">
            <TypeIcon className="h-3.5 w-3.5 text-emerald-brand" />
            {meta.label}
          </span>
        )}
      </div>

      <CardContent className="space-y-4 p-5">
        {/* Title + location */}
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 font-semibold leading-snug">
            {property.title}
          </h3>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {property.city}، {property.province}
          </p>
          {property.reviewCount > 0 && (
            <RatingStars
              rating={property.rating}
              size={12}
              showValue
              reviewCount={property.reviewCount}
            />
          )}
        </div>

        {/* Host */}
        {property.host && (
          <>
            <Separator />
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9 ring-2 ring-emerald-brand/20">
                {property.host.avatar ? (
                  <AvatarImage
                    src={property.host.avatar}
                    alt={property.host.name || ""}
                  />
                ) : null}
                <AvatarFallback className="bg-emerald-brand/10 text-xs text-emerald-brand">
                  {(property.host.name || "م").slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-sm font-medium">
                    {property.host.name || "میزبان"}
                  </span>
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-brand" />
                </div>
                <p className="text-[10px] text-muted-foreground">میزبان تأییدشده</p>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Dates & guests summary */}
        {checkIn && checkOut ? (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-muted/40 p-2">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] uppercase text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                ورود
              </div>
              <div className="font-medium ltr-nums">
                {formatJalaliShort(checkIn)}
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-2">
              <div className="mb-0.5 flex items-center gap-1 text-[10px] uppercase text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                خروج
              </div>
              <div className="font-medium ltr-nums">
                {formatJalaliShort(checkOut)}
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between rounded-lg bg-muted/40 p-2">
              <span className="flex items-center gap-1 text-[10px] uppercase text-muted-foreground">
                <Users className="h-3 w-3" />
                مسافر
              </span>
              <span className="font-medium ltr-nums">
                {toPersianDigits(guests)} نفر
              </span>
            </div>
          </div>
        ) : null}

        {/* Price breakdown */}
        <PriceBreakdown pricing={pricing} />

        {/* Free cancellation */}
        <div className="flex items-start gap-2 rounded-lg bg-emerald-brand/5 p-2.5 text-xs text-emerald-brand">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>شما باز هم هزینه‌ای پرداخت نمی‌کنید — تا ۴۸ ساعت قبل رایگان لغو کنید.</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
//  Price breakdown (shared)
// ============================================================================
function PriceBreakdown({
  pricing,
}: {
  pricing: Pricing;
}) {
  const { nights, pricePerNight, subtotal, discount, discountLabel, cleaningFee, serviceFee, total } =
    pricing;

  if (nights <= 0) {
    return (
      <div className="rounded-lg bg-muted/30 p-3 text-center text-xs text-muted-foreground">
        برای محاسبه قیمت، تاریخ ورود و خروج را انتخاب کنید.
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-border/70 bg-muted/20 p-4 text-sm">
      <PriceRow
        label={`${toPersianDigits(nights)} شب × ${formatTomanCompact(pricePerNight)}`}
        value={formatToman(subtotal)}
      />
      {discount > 0 && (
        <PriceRow
          label={discountLabel}
          value={`− ${formatToman(discount)}`}
          valueClass="text-emerald-brand"
        />
      )}
      <PriceRow label="هزینه پاکسازی" value={formatToman(cleaningFee)} />
      <PriceRow label="کارمزد خدمات" value={formatToman(serviceFee)} />
      <Separator className="my-1.5" />
      <div className="flex items-center justify-between gap-3 pt-0.5">
        <span className="font-semibold">مجموع</span>
        <span className="text-lg font-bold text-gradient-gold ltr-nums">
          {formatToman(total)}
        </span>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium ltr-nums", valueClass)}>{value}</span>
    </div>
  );
}

// ============================================================================
//  Step footer (continue + back + mobile total pill)
// ============================================================================
function StepFooter({
  isMobile,
  total,
  onContinue,
  onBack,
  continueLabel,
  continueDisabled,
  continueLoading,
  continueIcon,
}: {
  isMobile: boolean;
  total: number;
  onContinue: () => void;
  onBack?: () => void;
  continueLabel: string;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  continueIcon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-1.5 self-start sm:self-auto"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </Button>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-3 self-end sm:self-auto">
        {isMobile && (
          <div className="text-left">
            <div className="text-[10px] text-muted-foreground">مجموع</div>
            <div className="text-sm font-bold text-gradient-gold ltr-nums">
              {formatTomanCompact(total)}
            </div>
          </div>
        )}
        <Button
          onClick={onContinue}
          disabled={continueDisabled}
          className="gap-2 rounded-xl px-6 shadow-luxury"
          size="lg"
        >
          {continueLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            continueIcon
          )}
          {continueLabel}
        </Button>
      </div>
    </div>
  );
}
