"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, TrendingUp, Clock, ArrowLeft } from "lucide-react";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/app-store";
import { useDestinations } from "@/hooks/use-api";
import { useProperties } from "@/hooks/use-api";
import { PropertyCard } from "@/components/shared/property-card";
import { toPersianDigits } from "@/lib/persian";

const popularSearches = ["ویلا کیش", "هتل تهران", "اقامتگاه یزد", "کلبه جنگلی"];

export function SearchModal() {
  const { searchModalOpen, setSearchModal, setSearch, setView, goProperty } = useAppStore();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: destinations } = useDestinations();
  const { data: results, isLoading } = useProperties(q ? { q, limit: 4 } : {});

  useEffect(() => {
    if (searchModalOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ("");
  }, [searchModalOpen]);

  useEffect(() => {
    const r = localStorage.getItem("vilasta-recent-searches");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (r) setRecent(JSON.parse(r));
  }, []);

  const saveRecent = (term: string) => {
    const next = [term, ...recent.filter((s) => s !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem("vilasta-recent-searches", JSON.stringify(next));
  };

  const onSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecent(term);
    setSearch({ q: term });
    setSearchModal(false);
    setView("listing");
  };

  return (
    <Dialog open={searchModalOpen} onOpenChange={setSearchModal}>
      <DialogContent showCloseButton={false} className="max-w-2xl overflow-hidden p-0 gap-0">
        <DialogTitle className="sr-only">جستجوی مقصد و اقامتگاه</DialogTitle>
        <DialogDescription className="sr-only">
          مقصد، عنوان یا شهر مورد نظر خود را جستجو کنید
        </DialogDescription>
        {/* Search input + close button in same row */}
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-muted px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
              placeholder="مقصد، عنوان یا شهر مورد نظر..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground shrink-0">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full hover:bg-accent" aria-label="بستن">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-4">
          {/* Live results */}
          {q && results && results.items.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                نتایج جستجو ({toPersianDigits(results.total)} اقامتگاه)
              </p>
              <div className="space-y-2">
                {results.items.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { goProperty(p.id); setSearchModal(false); }}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-right transition-colors hover:bg-accent"
                  >
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {p.city}، {p.province}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      {toPersianDigits(p.rating.toFixed(1))} ★
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => onSearch(q)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-sm font-medium hover:bg-accent"
              >
                مشاهده همه نتایج
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          )}

          {q && !isLoading && results && results.items.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              نتیجه‌ای برای «{q}» یافت نشد
            </div>
          )}

          {!q && (
            <>
              {/* Recent searches */}
              {recent.length > 0 && (
                <div className="mb-6">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    جستجوهای اخیر
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((s) => (
                      <button
                        key={s}
                        onClick={() => onSearch(s)}
                        className="rounded-full bg-muted px-3 py-1.5 text-xs hover:bg-accent"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular */}
              <div className="mb-6">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  جستجوهای پرطرفدار
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => onSearch(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destinations */}
              <div>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  مقاصد محبوب
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {destinations?.slice(0, 6).map((d) => (
                    <button
                      key={d.id}
                      onClick={() => { setSearch({ city: d.name }); setSearchModal(false); setView("listing"); }}
                      className="flex items-center gap-2 rounded-xl border border-border p-2 text-right hover:bg-accent"
                    >
                      <img src={d.image} alt={d.name} className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                      <div>
                        <p className="text-sm font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{toPersianDigits(d.propertyCount)} اقامتگاه</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
