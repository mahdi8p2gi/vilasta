"use client";

import { useState } from "react";
import { Search, MapPin, CalendarDays, Users, ChevronDown, Sparkles, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAppStore } from "@/store/app-store";
import { toPersianDigits } from "@/lib/persian";
import { cn } from "@/lib/utils";
import { jalaliToday, jalaliPlusDays, formatJalaliShort } from "@/lib/date-utils";
import { type DateRange } from "react-day-picker";

const cities = [
  { name: "کیش", emoji: "🏝️" },
  { name: "تهران", emoji: "🏙️" },
  { name: "اصفهان", emoji: "🕌" },
  { name: "شیراز", emoji: "🌸" },
  { name: "یزد", emoji: "🏜️" },
  { name: "قشم", emoji: "🌊" },
  { name: "مازندران", emoji: "🌲" },
  { name: "گیلان", emoji: "🌿" },
];

export function SmartSearch({ variant = "hero" }: { variant?: "hero" | "inline" }) {
  const { search, setSearch, setView } = useAppStore();
  const [guests, setGuests] = useState(search.guests || 2);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    search.checkIn && search.checkOut
      ? { from: new Date(search.checkIn), to: new Date(search.checkOut) }
      : { from: jalaliToday(), to: jalaliPlusDays(3) }
  );
  const [cityOpen, setCityOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  const onSearch = () => {
    setSearch({
      city: search.city,
      checkIn: dateRange?.from?.toISOString() || "",
      checkOut: dateRange?.to?.toISOString() || "",
      guests,
    });
    setView("listing");
  };

  const nights = dateRange?.from && dateRange?.to
    ? Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / 86400000)
    : 0;

  const isHero = variant === "hero";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative w-full",
        isHero
          ? "rounded-3xl border border-border/50 bg-card/95 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl"
          : "rounded-2xl border border-border bg-card p-2 shadow-luxury"
      )}
    >
      {/* Inner container with segments */}
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-[1.3fr_1.5fr_1.1fr_auto] sm:gap-0">
        {/* Destination */}
        <Popover open={cityOpen} onOpenChange={setCityOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "group flex flex-col items-start gap-1 rounded-2xl px-4 py-3 text-right transition-all duration-300",
                "hover:bg-accent",
                cityOpen && "bg-accent"
              )}
            >
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-brand">
                <MapPin className="h-3.5 w-3.5" />
                مقصد
              </span>
              <span className="flex items-center gap-1.5">
                <span className={cn("text-sm font-bold text-foreground", !search.city && "font-normal text-muted-foreground")}>
                  {search.city || "کجا می‌روید؟"}
                </span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-300", cityOpen && "rotate-180")} />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2" align="start" sideOffset={8}>
            <div className="space-y-0.5">
              <button
                onClick={() => { setSearch({ city: "" }); setCityOpen(false); }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent"
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className="text-lg">🌍</span>
                  همه شهرها
                </span>
                {!search.city && <Badge variant="secondary" className="rounded-full">✓</Badge>}
              </button>
              <div className="my-1 h-px bg-border/60" />
              {cities.map((c) => (
                <button
                  key={c.name}
                  onClick={() => { setSearch({ city: c.name }); setCityOpen(false); }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg">{c.emoji}</span>
                    <span className="font-medium">{c.name}</span>
                  </span>
                  {search.city === c.name && (
                    <Badge variant="secondary" className="rounded-full">✓</Badge>
                  )}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date range */}
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "group flex flex-col items-start gap-1 rounded-2xl px-4 py-3 text-right transition-all duration-300 sm:border-x sm:border-border/60",
                "hover:bg-accent",
                dateOpen && "bg-accent"
              )}
            >
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-brand">
                <CalendarDays className="h-3.5 w-3.5" />
                تاریخ سفر
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">
                  {dateRange?.from
                    ? `${formatJalaliShort(dateRange.from)}${dateRange?.to ? ` — ${formatJalaliShort(dateRange.to)}` : ""}`
                    : "انتخاب تاریخ"}
                </span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-300", dateOpen && "rotate-180")} />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(r) => { setDateRange(r); if (r?.to) setDateOpen(false); }}
              numberOfMonths={2}
              dir="rtl"
              disabled={[{ before: jalaliToday() }]}
            />
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <Popover open={guestOpen} onOpenChange={setGuestOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "group flex flex-col items-start gap-1 rounded-2xl px-4 py-3 text-right transition-all duration-300",
                "hover:bg-accent",
                guestOpen && "bg-accent"
              )}
            >
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-brand">
                <Users className="h-3.5 w-3.5" />
                مسافران
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">
                  {toPersianDigits(guests)} نفر
                </span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-300", guestOpen && "rotate-180")} />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start" sideOffset={8}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">تعداد مسافر</p>
                <p className="text-xs text-muted-foreground">بزرگسال (۱۶+ سال)</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 rounded-full border-primary/30 hover:border-primary hover:bg-primary/10"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  disabled={guests <= 1}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-8 text-center text-base font-bold">{toPersianDigits(guests)}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 rounded-full border-primary/30 hover:border-primary hover:bg-primary/10"
                  onClick={() => setGuests((g) => Math.min(16, g + 1))}
                  disabled={guests >= 16}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search button */}
        <div className="p-1">
          <Button
            onClick={onSearch}
            size="lg"
            className="group relative h-full w-full min-w-[120px] gap-2 overflow-hidden rounded-2xl bg-gradient-to-l from-primary to-emerald-brand text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/40"
          >
            <Search className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-bold">جستجو</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </Button>
        </div>
      </div>

      {/* Nights indicator */}
      <AnimatePresence>
        {nights > 0 && isHero && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 pb-2 pt-1">
              <Badge variant="outline" className="gap-1.5 border-emerald-brand/30 bg-emerald-brand/10 px-3 py-1 text-xs text-emerald-brand">
                <Sparkles className="h-3 w-3 text-gold" />
                {toPersianDigits(nights)} شب اقامت
              </Badge>
              {search.city && (
                <Badge variant="outline" className="gap-1.5 border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold-foreground">
                  <MapPin className="h-3 w-3 text-gold" />
                  {search.city}
                </Badge>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
