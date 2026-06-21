"use client";

import { motion } from "framer-motion";
import { Instagram, Send, Phone, Mail, MapPin, ShieldCheck, CreditCard, Headphones } from "lucide-react";
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
      { label: "مقاصد محبوب", view: "listing" as const },
    ],
  },
  {
    title: "میزبانان",
    links: [
      { label: "میزبان شوید", view: "home" as const },
      { label: "راهنمای میزبان", view: "home" as const },
      { label: "ابزارهای میزبان", view: "home" as const },
      { label: "کسب درآمد", view: "home" as const },
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
  { icon: ShieldCheck, label: "پرداخت امن" },
  { icon: CreditCard, label: "رزرو فوری" },
  { icon: Headphones, label: "پشتیبانی ۲۴/۷" },
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
      <div className="border-b border-border/60">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex items-center justify-center gap-3 sm:justify-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{b.label}</p>
                <p className="text-xs text-muted-foreground">تضمین ویلاستا</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand + newsletter */}
          <div className="col-span-2 space-y-5">
            <Logo size="lg" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <form onSubmit={onSubscribe} className="space-y-2">
              <label className="text-sm font-medium">عضویت در خبرنامه</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="ایمیل شما"
                  required
                  className="bg-background"
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <div className="flex gap-2">
              <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-background transition-colors hover:bg-accent">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.telegram} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-background transition-colors hover:bg-accent">
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-sm font-semibold">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => setView(link.view)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              {siteConfig.email}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              تهران، ایران
            </span>
          </div>
          <p>© ۱۴۰۵ {siteConfig.name}. تمام حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
