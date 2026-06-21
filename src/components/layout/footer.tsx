"use client";

import { motion } from "framer-motion";
import { Instagram, Send, Phone, Mail, MapPin, ShieldCheck, CreditCard, Headphones, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";

const linkGroups = [
  {
    title: "ویلاستا",
    links: [
      { label: "درباره ما", view: "home" as const },
      { label: "قوانین و مقررات", view: "home" as const },
      { label: "حریم خصوصی", view: "home" as const },
      { label: "تماس با ما", view: "home" as const },
    ],
  },
  {
    title: "کاوش",
    links: [
      { label: "ویلاهای لوکس", view: "listing" as const },
      { label: "هتل‌ها", view: "listing" as const },
      { label: "اقامتگاه‌های بوم‌گردی", view: "listing" as const },
      { label: "مقاصد محبوب", view: "destinations" as const },
    ],
  },
  {
    title: "میزبانان",
    links: [
      { label: "میزبان شوید", view: "host-intro" as const },
      { label: "راهنمای میزبان", view: "host-intro" as const },
      { label: "ابزارهای میزبان", view: "dashboard-host" as const },
      { label: "کسب درآمد", view: "host-intro" as const },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { label: "مرکز راهنما", view: "home" as const },
      { label: "سوالات متداول", view: "home" as const },
      { label: "روند رزرو", view: "home" as const },
      { label: "گزارش مشکل", view: "home" as const },
    ],
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: "پرداخت امن", desc: "تراکنش‌های رمزنگاری شده" },
  { icon: CreditCard, label: "رزرو فوری", desc: "تأیید آنی رزرو" },
  { icon: Headphones, label: "پشتیبانی ۲۴/۷", desc: "همیشه در کنار شما" },
];

export function Footer() {
  const setView = useAppStore((s) => s.setView);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("عضویت شما در خبرنامه ثبت شد 🎉");
  };

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      {/* Trust strip */}
      <div className="border-b border-border/60 bg-card/50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {trustBadges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-center gap-3 sm:justify-start"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{b.label}</p>
                <p className="truncate text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Brand + newsletter row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <Logo size="lg" />
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            {/* Social */}
            <div className="flex gap-2">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition-all hover:border-primary/40 hover:bg-accent"
                aria-label="اینستاگرام"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition-all hover:border-primary/40 hover:bg-accent"
                aria-label="تلگرام"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <h4 className="font-semibold">عضویت در خبرنامه</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              جدیدترین اقامتگاه‌ها و تخفیف‌های ویژه را اول شما دریافت کنید.
            </p>
            <form onSubmit={onSubscribe} className="mt-3 space-y-2">
              <Input
                type="email"
                placeholder="ایمیل شما"
                required
                className="bg-background"
              />
              <Button type="submit" className="group w-full gap-2 rounded-xl">
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                عضویت
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-border/60" />

        {/* Link groups */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
          {linkGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="space-y-3"
            >
              <h4 className="text-sm font-bold text-foreground">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => setView(link.view)}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact + copyright */}
        <div className="mt-10 flex flex-col gap-5 border-t border-border/60 pt-6">
          {/* Contact items */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2.5 text-sm transition-colors hover:bg-accent"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">تلفن</p>
                <p className="truncate font-medium">{siteConfig.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2.5 text-sm transition-colors hover:bg-accent"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">ایمیل</p>
                <p className="truncate font-medium" dir="ltr">{siteConfig.email}</p>
              </div>
            </a>
            <div className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2.5 text-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">آدرس</p>
                <p className="truncate font-medium">تهران، ایران</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
            <p>© ۱۴۰۵ {siteConfig.name}. تمام حقوق محفوظ است.</p>
            <p className="flex items-center gap-1.5">
              ساخته شده با
              <span className="text-destructive">❤</span>
              برای مسافران ایرانی
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
