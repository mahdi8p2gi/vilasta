"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, BedDouble, Bath, Users, Maximize, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { RatingStars } from "@/components/shared/rating-stars";
import { propertyTypeMeta } from "@/config/site";
import {
  formatTomanCompact, pricePerNightLabel, toPersianDigits, pluralFa,
} from "@/lib/persian";
import { cardImage, SHIMMER_BLUR } from "@/lib/image";
import type { Property } from "@/types";
import { toast } from "sonner";

export function PropertyCard({
  property,
  index = 0,
  variant = "default",
}: {
  property: Property;
  index?: number;
  variant?: "default" | "compact";
}) {
  const goProperty = useAppStore((s) => s.goProperty);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = useAppStore((s) => s.favorites.includes(property.id));
  const user = useAppStore((s) => s.user);
  const openAuth = useAppStore((s) => s.openAuth);

  const meta = propertyTypeMeta[property.type];
  const TypeIcon = meta?.icon;

  const onFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuth("login");
      return;
    }
    toggleFavorite(property.id);
    toast.success(isFavorite ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      onClick={() => goProperty(property.id)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-card-hover hover:border-primary/40"
    >
      {/* Image */}
      <div className="img-shine relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={cardImage(property.images[0])}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL={SHIMMER_BLUR}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* type badge */}
        {TypeIcon && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            <TypeIcon className="h-3.5 w-3.5 text-emerald-brand" />
            {meta.label}
          </span>
        )}

        {/* favorite */}
        <button
          onClick={onFav}
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass shadow-sm transition-all hover:scale-110 active:scale-95"
          aria-label="افزودن به علاقه‌مندی‌ها"
        >
          <Heart
            className={cn(
              "h-4.5 w-4.5 transition-all",
              isFavorite
                ? "fill-destructive text-destructive"
                : "text-foreground/80"
            )}
            style={{ width: 18, height: 18 }}
          />
        </button>

        {/* price tag */}
        <div className="absolute bottom-3 right-3 flex items-baseline gap-1 rounded-full glass px-3 py-1.5 text-sm font-bold text-foreground shadow-sm">
          <span>{formatTomanCompact(property.pricePerNight)}</span>
          <span className="text-xs font-normal text-muted-foreground">/ شب</span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h3 className="truncate font-semibold leading-tight">{property.title}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{property.city}، {property.province}</span>
            </p>
          </div>
          <RatingStars rating={property.rating} size={12} showValue />
        </div>

        {variant === "default" && (
          <div className="flex items-center gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {pluralFa(property.bedrooms, "خوابگاه", "خوابگاه")}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {toPersianDigits(property.bathrooms)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {toPersianDigits(property.maxGuests)} نفر
            </span>
            {property.size && (
              <span className="mr-auto flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" />
                {toPersianDigits(property.size)} متر مربع
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="aspect-[4/3] animate-shimmer rounded-none" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-shimmer rounded" />
        <div className="h-3 w-1/2 animate-shimmer rounded" />
        <div className="flex gap-3 pt-2">
          <div className="h-3 w-12 animate-shimmer rounded" />
          <div className="h-3 w-12 animate-shimmer rounded" />
          <div className="h-3 w-12 animate-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}

// re-export to satisfy BadgeCheck import usage tree-shaking
export { BadgeCheck };
