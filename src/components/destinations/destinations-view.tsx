"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ArrowLeft, Search, Compass, Star } from "lucide-react";
import { useDestinations } from "@/hooks/use-api";
import { useProperties } from "@/hooks/use-api";
import { useAppStore } from "@/store/app-store";
import { SectionHeading } from "@/components/shared/section-heading";
import { PropertyCard, PropertyCardSkeleton } from "@/components/shared/property-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cardImage, SHIMMER_BLUR } from "@/lib/image";
import { toPersianDigits, formatTomanCompact } from "@/lib/persian";
import { useState } from "react";

const featuredInsights = [
  {
    title: "کیش، جزیره آرامش",
    desc: "سواحل زرین، ویلاهای لوکس و آب‌های فیروزه‌ای. مقصدی برای استراحت و تفریح.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    tag: "ساحلی",
  },
  {
    title: "اصفهان، نصف جهان",
    desc: "میدان نقش جهان، سی‌وسه‌پل و مساجد فیروزه‌ای. شهری از شکوه و هنر صفوی.",
    image: "https://images.unsplash.com/photo-1595872018818-97555653a011",
    tag: "تاریخی",
  },
  {
    title: "گیلان، سرسبزی همیشگی",
    desc: "جنگل‌های هیرکانی، ویلاهای جنگلی و غذاهای محلی. بهشتی در شمال ایران.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    tag: "جنگلی",
  },
];

export function DestinationsView() {
  const { data: destinations, isLoading } = useDestinations();
  const { setSearch, setView } = useAppStore();
  const [selected, setSelected] = useState<string | null>(null);

  const { data: cityProperties, isLoading: loadingProps } = useProperties(
    selected ? { city: selected, limit: 6 } : { limit: 6 }
  );

  const onSelectCity = (name: string) => {
    setSelected(name);
    setSearch({ city: name });
  };

  const onExploreAll = () => {
    setSearch({ city: selected || "" });
    setView("listing");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/8 via-background to-background py-16 sm:py-20">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge className="mb-4 gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
              <Compass className="h-3.5 w-3.5" />
              کاوش ایران
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              مقاصد محبوب <span className="text-gradient-emerald">ایران</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              از سواحل زرین کیش تا جنگل‌های سرسبز گیلان؛ مقصد بعدی خود را کشف کنید.
              هر شهر، داستانی برای گفتن دارد.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured insights */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading subtitle="ویژه ویلاستا" title="الهام از سفر" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featuredInsights.map((ins, i) => (
            <motion.article
              key={ins.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="img-shine group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <Image
                src={cardImage(ins.image)}
                alt={ins.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL={SHIMMER_BLUR}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute right-4 top-4">
                <Badge className="glass border-white/20 text-white">{ins.tag}</Badge>
              </div>
              <div className="absolute bottom-0 right-0 left-0 p-6 text-white">
                <h3 className="text-xl font-bold">{ins.title}</h3>
                <p className="mt-1.5 text-sm text-white/80">{ins.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* All destinations grid */}
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="همه مقاصد"
            title="شهرها و استان‌ها"
            action={
              <Button variant="outline" onClick={() => setView("listing")} className="gap-1.5 rounded-full">
                مشاهده همه اقامتگاه‌ها
                <ArrowLeft className="h-4 w-4" />
              </Button>
            }
          />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {(isLoading ? Array.from({ length: 8 }) : destinations)?.map((dest: any, i) => {
              const active = selected === dest?.name;
              return (
                <motion.button
                  key={dest?.id ?? i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => dest && onSelectCity(dest.name)}
                  className={`img-shine group relative aspect-square overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-card-hover ${
                    active ? "border-primary ring-2 ring-primary/40" : "border-border/60"
                  }`}
                >
                  {dest ? (
                    <>
                      <Image
                        src={cardImage(dest.image)}
                        alt={dest.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={SHIMMER_BLUR}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                        <div className="flex items-center gap-1 text-xs text-white/70">
                          <MapPin className="h-3 w-3" />
                          {dest.province}
                        </div>
                        <h3 className="mt-0.5 text-lg font-bold">{dest.name}</h3>
                        <p className="text-xs text-white/70">{toPersianDigits(dest.propertyCount)} اقامتگاه</p>
                      </div>
                      {active && (
                        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Star className="h-3.5 w-3.5" fill="currentColor" />
                        </div>
                      )}
                    </>
                  ) : (
                    <Skeleton className="h-full w-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Properties in selected city */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle={selected ? `اقامتگاه‌های ${selected}` : "اقامتگاه‌های منتخب"}
          title={selected ? `بهترین‌های ${selected}` : "پیشنهاد ویلاستا"}
          action={
            <Button variant="outline" onClick={onExploreAll} className="gap-1.5 rounded-full">
              مشاهده همه
              <ArrowLeft className="h-4 w-4" />
            </Button>
          }
        />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loadingProps
            ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : cityProperties?.items.slice(0, 6).map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
        </div>
      </section>
    </div>
  );
}
