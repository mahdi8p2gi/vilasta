"use client";

import { useState } from "react";
import { Search, MapPin, CalendarDays, Users, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const cities = ["کیش", "تهران", "اصفهان", "شیراز", "یزد", "قشم", "مازندران", "گیلان"];

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className={cn(
        "relative w-full",
        variant === "hero"
          ? "glass rounded-3xl p-2 shadow-2xl"
          : "rounded-2xl border border-border bg-card p-2 shadow-luxury"
      )}
    >
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-[1.2fr_1.4fr_1fr_auto] sm:divide-x sm:divide-y-0 sm:divide-x-reverse rtl:sm:divide-x-reverse">
        {/* Destination */}
        <Popover open={cityOpen} onOpenChange={setCityOpen}>
          <PopoverTrigger asChild>
            <button className="flex flex-col items-start gap-0.5 rounded-2xl px-4 py-3 text-right transition-colors hover:bg-accent">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> مقصد
              </span>
              <span className={cn("text-sm font-medium", !search.city && "text-muted-foreground/70")}>
                {search.city || "کجا می‌روید؟"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="start">
            <div className="space-y-1">
              <button
                onClick={() => { setSearch({ city: "" }); setCityOpen(false); }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent"
              >
                همه شهرها
                {!search.city && <Badge variant="secondary">انتخاب شده</Badge>}
              </button>
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => { setSearch({ city: c }); setCityOpen(false); }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {c}
                  </span>
                  {search.city === c && <Badge variant="secondary">✓</Badge>}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date range */}
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <button className="flex flex-col items-start gap-0.5 rounded-2xl px-4 py-3 text-right transition-colors hover:bg-accent">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> تاریخ
              </span>
              <span className="text-sm font-medium">
                {dateRange?.from
                  ? `${formatJalaliShort(dateRange.from)}${dateRange?.to ? ` — ${formatJalaliShort(dateRange.to)}` : ""}`
                  : "انتخاب تاریخ"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
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
            <button className="flex flex-col items-start gap-0.5 rounded-2xl px-4 py-3 text-right transition-colors hover:bg-accent">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> مسافران
              </span>
              <span className="text-sm font-medium">
                {toPersianDigits(guests)} نفر
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4" align="start">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">تعداد مسافر</p>
                <p className="text-xs text-muted-foreground">بزرگسال</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                >−</Button>
                <span className="w-6 text-center text-sm font-semibold">{toPersianDigits(guests)}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setGuests((g) => Math.min(16, g + 1))}
                >+</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search button */}
        <div className="p-1">
          <Button
            onClick={onSearch}
            size="lg"
            className="h-full w-full gap-2 rounded-2xl bg-gradient-to-l from-primary to-emerald-brand text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Search className="h-4 w-4" />
            <span>جستجو</span>
          </Button>
        </div>
      </div>

      {nights > 0 && variant === "hero" && (
        <div className="px-3 pb-2 pt-1">
          <Badge variant="outline" className="gap-1 text-xs">
            <CalendarDays className="h-3 w-3" />
            {toPersianDigits(nights)} شب اقامت
          </Badge>
        </div>
      )}
    </motion.div>
  );
}
