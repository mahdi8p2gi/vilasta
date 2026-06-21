"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCategories } from "@/hooks/use-api";
import { useAppStore } from "@/store/app-store";
import { propertyTypeMeta } from "@/config/site";
import { SectionHeading } from "@/components/shared/section-heading";
import { toPersianDigits } from "@/lib/persian";
import { cardImage, SHIMMER_BLUR } from "@/lib/image";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoriesSection() {
  const { data, isLoading } = useCategories();
  const setSearch = useAppStore((s) => s.setSearch);
  const setView = useAppStore((s) => s.setView);

  const onSelect = (slug: string) => {
    setSearch({ type: slug });
    setView("listing");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        subtitle="دسته‌بندی اقامتگاه‌ها"
        title="به دنبال چه نوع اقامتی هستید؟"
      />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {(isLoading ? Array.from({ length: 5 }) : data)?.map((cat: any, i) => {
          const meta = propertyTypeMeta[cat?.slug];
          const Icon = meta?.icon;
          return (
            <motion.button
              key={cat?.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              onClick={() => cat && onSelect(cat.slug)}
              className="img-shine group relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-1000 ease-out hover:-translate-y-2 hover:shadow-card-hover"
            >
              {cat ? (
                <>
                  <Image
                    src={cardImage(cat.image)}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={SHIMMER_BLUR}
                    className="object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                    {Icon && (
                      <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl glass text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                    <p className="text-xs text-white/70">{toPersianDigits(cat.propertyCount)} اقامتگاه</p>
                  </div>
                </>
              ) : (
                <Skeleton className="h-full w-full" />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
