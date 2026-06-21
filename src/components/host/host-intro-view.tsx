"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  BadgeDollarSign, ShieldCheck, TrendingUp, Headphones, Users, Star,
  ArrowLeft, Check, Sparkles, Building2, Calendar, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { detailImage, cardImage, SHIMMER_BLUR } from "@/lib/image";
import { toPersianDigits } from "@/lib/persian";

const perks = [
  { icon: BadgeDollarSign, title: "کسب درآمد دلاری", desc: "تا ۸۰٪ سود خالص برای میزبانان ویلاستا", color: "from-emerald-500/20 to-emerald-500/5" },
  { icon: ShieldCheck, title: "تأمین امنیت", desc: "بیمه اقامتگاه و پرداخت امن تضمین‌شده", color: "from-amber-500/20 to-amber-500/5" },
  { icon: TrendingUp, title: "بازاریابی هوشمند", desc: "تبلیغات خودکار اقامتگاه شما به میلیون‌ها مسافر", color: "from-emerald-500/20 to-emerald-500/5" },
  { icon: Headphones, title: "پشتیبانی اختصاصی", desc: "مدیر حساب اختصاصی ۲۴/۷ برای میزبانان", color: "from-amber-500/20 to-amber-500/5" },
];

const steps = [
  { icon: Building2, title: "ثبت اقامتگاه", desc: "اقامتگاه خود را با عکس‌ها و اطلاعات کامل ثبت کنید. رایگان و سریع." },
  { icon: ShieldCheck, title: "تأیید و انتشار", desc: "تیم ویلاستا پس از بررسی، اقامتگاه شما را در سایت منتشر می‌کند." },
  { icon: Calendar, title: "دریافت رزرو", desc: "مسافران رزرو می‌کنند و شما بلافاصله مطلع می‌شوید. مدیریت آسان با داشبورد." },
  { icon: Wallet, title: "دریافت درآمد", desc: "پس از اتمام اقامت، درآمد شما به‌صورت خودکار واریز می‌شود." },
];

const stats = [
  { value: "+۱٬۲۰۰", label: "میزبان فعال" },
  { value: "+۲۵۰٬۰۰۰", label: "مسافر راضی" },
  { value: "۴٫۹", label: "میانگین امتیاز" },
  { value: "۸۰٪", label: "سهم میزبان" },
];

const testimonials = [
  { name: "مهدی صادقی", role: "میزبان ویلا، کیش", text: "از زمانی که با ویلاستا شروع به کار کردم، درآمدم ۳ برابر شده است. داشبورد فوق‌العاده کاربردی است.", avatar: "https://i.pravatar.cc/150?img=33", rating: 5 },
  { name: "نازنین رحیمی", role: "میزبان بوتیک‌هتل، شیراز", text: "پشتیبانی ۲۴ ساعته واقعاً عالی است. تیم ویلاستا همیشه کنار من بوده است.", avatar: "https://i.pravatar.cc/150?img=45", rating: 5 },
];

const faqs = [
  { q: "ثبت‌نام به‌عنوان میزبان رایگان است؟", a: "بله، ثبت‌نام و افزودن اقامتگاه کاملاً رایگان است. ویلاستا تنها درصدی از هر رزرو موفق را به‌عنوان کارمزد دریافت می‌کند." },
  { q: "چقدر طول می‌کشد تا اقامتگاهم منتشر شود؟", a: "پس از ثبت، تیم ما ظرف ۲۴ تا ۴۸ ساعت اقامتگاه شما را بررسی و منتشر می‌کند." },
  { q: "درآمد من چگونه پرداخت می‌شود؟", a: "درآمد شما ۲۴ ساعت پس از پایان اقامت مسافر، به حساب بانکی شما واریز می‌شود." },
  { q: "آیا اقامتگاه من بیمه می‌شود؟", a: "بله، تمام اقامتگاه‌های ویلاستا تحت پوشش بیمه آسیب‌های احتمالی قرار دارند." },
];

export function HostIntroView() {
  const { openAuth, setView } = useAppStore();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage("https://images.unsplash.com/photo-1564013799919-ab600027ffc6")}
            alt="ویلای لوکس"
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={SHIMMER_BLUR}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl text-white"
          >
            <Badge className="mb-5 gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-white backdrop-blur-md border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              برنامه میزبانان ویلاستا
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              اقامتگاه خود را
              <br />
              <span className="bg-gradient-to-l from-gold via-amber-200 to-gold bg-clip-text text-transparent">
                به درآمد تبدیل کنید
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              به بیش از ۱٬۲۰۰ میزبان موفق بپیوندید و اقامتگاه خود را در معرض دید
              میلیون‌ها مسافر قرار دهید. ثبت‌نام رایگان است.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => openAuth("register")} className="gap-2 rounded-full bg-gradient-to-l from-primary to-emerald-brand">
                شروع میزبانی
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setView("home")} className="rounded-full border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20">
                اطلاعات بیشتر
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-gradient-emerald sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">چرا ویلاستا؟</h2>
          <p className="mt-3 text-muted-foreground">مزایای میزبانی با پلتفرم ویلاستا</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-2xl border border-border/60 bg-gradient-to-br ${p.color} p-6`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm">
                <p.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">چگونه میزبان شویم؟</h2>
            <p className="mt-3 text-muted-foreground">در ۴ گام ساده شروع کنید</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                <Card className="relative h-full overflow-hidden p-6">
                  <span className="absolute -left-2 -top-3 text-6xl font-bold text-foreground/5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <s.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">میزبانان درباره ما می‌گویند</h2>
          <p className="mt-3 text-muted-foreground">تجربه میزبانان موفق ویلاستا</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full p-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-gold" fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t.text}</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                  <Image src={t.avatar} alt={t.name} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">سوالات متداول</h2>
            <p className="mt-3 text-muted-foreground">پاسخ به پرسش‌های رایج میزبانان</p>
          </div>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="overflow-hidden p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{f.q}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/15 via-card to-gold/15 p-8 text-center sm:p-14">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative space-y-5">
            <Users className="mx-auto h-10 w-10 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              آماده شروع هستید؟
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              همین امروز به جمع میزبانان ویلاستا بپیوندید و اقامتگاه خود را به یک منبع درآمد پایدار تبدیل کنید.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => openAuth("register")} className="gap-2 rounded-full bg-gradient-to-l from-primary to-emerald-brand">
                ثبت‌نام میزبان
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setView("home")} className="rounded-full">
                بازگشت به خانه
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

// local import alias to avoid duplicate
function heroImage(url: string) {
  return detailImage(url);
}
