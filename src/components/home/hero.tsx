"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { SmartSearch } from "@/components/home/smart-search";
import { Badge } from "@/components/ui/badge";
import { toPersianDigits } from "@/lib/persian";

const stats = [
  { value: "+۲۵۰", label: "اقامتگاه لوکس" },
  { value: "+۱۸", label: "شهر ایران" },
  { value: "+۱۵٬۰۰۰", label: "مسافر راضی" },
  { value: "۴٫۹", label: "میانگین امتیاز" },
];

const trustPills = [
  { icon: ShieldCheck, label: "پرداخت امن" },
  { icon: TrendingUp, label: "بهترین قیمت" },
  { icon: Sparkles, label: "اقامتگاه‌های منتخب" },
];

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80"
          alt="ویلای لوکس ساحلی"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/30 via-transparent to-gold/20" />
      </div>

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-gold/20 blur-[100px] animate-float" />
        <div className="absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-primary/25 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-5 gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-white backdrop-blur-md border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium">پلتفرم رزرو اقامتگاه لوکس ایران</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            اقامتگاهی لوکس،
            <br />
            <span className="bg-gradient-to-l from-gold via-amber-200 to-gold bg-clip-text text-transparent">
              تجربه‌ای فراموش‌نشدنی
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            از ویلاهای ساحلی کیش تا اقامتگاه‌های بوم‌گردی یزد؛ بهترین اقامتگاه‌های
            ایران را با اطمینان و راحتی رزرو کنید.
          </motion.p>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {trustPills.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/15"
              >
                <p.icon className="h-3.5 w-3.5 text-gold" />
                {p.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Search */}
        <div className="mt-10 max-w-4xl">
          <SmartSearch variant="hero" />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-white">
              <p className="text-2xl font-bold sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
