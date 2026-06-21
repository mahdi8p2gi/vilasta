"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, CreditCard, KeyRound } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  {
    icon: Search,
    title: "جستجو کنید",
    desc: "مقصد و تاریخ مورد نظر خود را انتخاب کنید و از بین صدها اقامتگاه لوکس، بهترین را پیدا کنید.",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: CalendarCheck,
    title: "انتخاب کنید",
    desc: "اقامتگاه دلخواه خود را با بررسی عکس‌ها، امکانات و نظرات دیگران انتخاب کنید.",
    color: "from-amber-500/20 to-amber-500/5",
  },
  {
    icon: CreditCard,
    title: "رزرو کنید",
    desc: "با پرداخت آنلاین و امن، رزرو خود را ثبت کنید و بلافاصله تأییدیه دریافت کنید.",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: KeyRound,
    title: "اقامت کنید",
    desc: "به اقامتگاه بروید و از یک تجربه بی‌نظیر لذت ببرید. ما در تمام مراحل کنار شما هستیم.",
    color: "from-amber-500/20 to-amber-500/5",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading subtitle="روند کار" title="رزرو در ۴ گام ساده" align="center" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative"
          >
            <div className={`relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${s.color} p-6`}>
              <span className="absolute -left-2 -top-3 text-6xl font-bold text-foreground/5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="absolute -left-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center lg:flex">
                <div className="h-px w-6 bg-border" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
