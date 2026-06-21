"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useFeaturedProperties } from "@/hooks/use-api";
import { useAppStore } from "@/store/app-store";
import { SectionHeading } from "@/components/shared/section-heading";
import { PropertyCard, PropertyCardSkeleton } from "@/components/shared/property-card";
import { Button } from "@/components/ui/button";

export function FeaturedProperties({ title = "اقامتگاه‌های منتخب", limit = 8 }: { title?: string; limit?: number }) {
  const { data, isLoading } = useFeaturedProperties();
  const setView = useAppStore((s) => s.setView);

  const items = data?.slice(0, limit) ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        subtitle="پیشنهاد ویژه ویلاستا"
        title={title}
        action={
          <Button variant="outline" onClick={() => setView("listing")} className="gap-1.5 rounded-full">
            مشاهده همه
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          : items.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
      </div>
    </section>
  );
}
