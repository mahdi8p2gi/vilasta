"use client";

import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, ShieldCheck, Headphones, BadgeDollarSign } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";

const perks = [
  { icon: BadgeDollarSign, title: "کسب درآمد دلاری", desc: "تا ۸۰٪ سود خالص برای میزبانان" },
  { icon: ShieldCheck, title: "تأمین امنیت", desc: "بیمه اقامتگاه و پرداخت امن" },
  { icon: TrendingUp, title: "بازاریابی هوشمند", desc: "تبلیغات خودکار اقامتگاه شما" },
  { icon: Headphones, title: "پشتیبانی اختصاصی", desc: "مدیر حساب اختصاصی برای میزبانان" },
];

export function HostCta() {
  const openAuth = useAppStore((s) => s.openAuth);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-gold/10">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="relative grid gap-8 p-8 lg:grid-cols-2 lg:items-center lg:p-12">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <BadgeDollarSign className="h-3.5 w-3.5" />
                برنامه میزبانان ویلاستا
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                اقامتگاه خود را به
                <span className="text-gradient-emerald"> درآمد </span>
                تبدیل کنید
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                به هزاران میزبان موفق بپیوندید و اقامتگاه خود را در معرض دید
                میلیون‌ها مسافر قرار دهید. ثبت‌نام رایگان است.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {perks.map((p) => (
                <div key={p.title} className="flex items-start gap-3 rounded-xl bg-background/60 p-3 backdrop-blur-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <p.icon className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button size="lg" onClick={() => openAuth("register")} className="gap-2 rounded-full">
                شروع میزبانی
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80"
                alt="ویلای لوکس"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            {/* Floating earning card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -right-4 rounded-2xl glass p-4 shadow-xl"
            >
              <p className="text-xs text-muted-foreground">درآمد این ماه</p>
              <p className="text-xl font-bold text-gradient-emerald">۴۲٬۵۰۰٬۰۰۰ ت</p>
              <p className="text-xs text-emerald-brand">↑ ۲۴٪ نسبت به ماه قبل</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
