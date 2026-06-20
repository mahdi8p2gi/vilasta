"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useDestinations } from "@/hooks/use-api";
import { useAppStore } from "@/store/app-store";
import { SectionHeading } from "@/components/shared/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { toPersianDigits } from "@/lib/persian";

export function PopularDestinations() {
  const { data, isLoading } = useDestinations();
  const setSearch = useAppStore((s) => s.setSearch);
  const setView = useAppStore((s) => s.setView);

  const onSelect = (name: string) => {
    setSearch({ city: name });
    setView("listing");
  };

  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="کجا می‌روید؟"
          title="مقاصد محبوب ایران"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {(isLoading ? Array.from({ length: 8 }) : data)?.map((dest: any, i) => (
            <motion.button
              key={dest?.id ?? i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              onClick={() => dest && onSelect(dest.name)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              {dest ? (
                <>
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <MapPin className="h-3 w-3" />
                      {dest.province}
                    </div>
                    <h3 className="mt-1 text-lg font-bold">{dest.name}</h3>
                    <p className="text-xs text-white/70">
                      {toPersianDigits(dest.propertyCount)} اقامتگاه
                    </p>
                  </div>
                </>
              ) : (
                <Skeleton className="h-full w-full" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
