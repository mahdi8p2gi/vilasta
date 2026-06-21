"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits, ratingLabel } from "@/lib/persian";

export function RatingStars({
  rating,
  size = 14,
  showValue = true,
  showLabel = false,
  reviewCount,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  showLabel?: boolean;
  reviewCount?: number;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rounded - (i - 1)));
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-muted-foreground/30" style={{ width: size, height: size }} fill="currentColor" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="text-gold" style={{ width: size, height: size }} fill="currentColor" />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold ltr-nums">
          {toPersianDigits(rating.toFixed(1))}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">
          ({toPersianDigits(reviewCount)} نظر)
        </span>
      )}
      {showLabel && (
        <span className="text-xs font-medium text-emerald-brand">{ratingLabel(rating)}</span>
      )}
    </div>
  );
}
