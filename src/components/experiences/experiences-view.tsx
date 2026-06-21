"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Waves, Mountain, Utensils, Camera, Compass, ArrowLeft, Clock, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { cardImage, SHIMMER_BLUR } from "@/lib/image";
import { toPersianDigits } from "@/lib/persian";

const experiences = [
  {
    id: 1,
    title: "غواصی در آب‌های کیش",
    desc: "کاوش در دنیای زیرین دریای فیروزه‌ای کیش همراه با مربیان حرفه‌ای. مناسب برای مبتدی‌ها و حرفه‌ای‌ها.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    duration: "۳ ساعت",
    guests: "۱-۶ نفر",
    price: 850000,
    category: "آبی",
    rating: 4.9,
  },
  {
    id: 2,
    title: "سفار کویر یزد",
    desc: "تجربه شب‌نشینی در کویر، تماشای ستارگان و سوار شدن بر شتر. سفری به اعماق فرهنگ ایرانی.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    duration: "۸ ساعت",
    guests: "۲-۱۲ نفر",
    price: 1200000,
    category: "کویر",
    rating: 4.8,
  },
  {
    id: 3,
    title: "کلاس آشپزی سنتی شیراز",
    desc: "آموزش پخت غذاهای محلی شیراز مانند کباب کرمانی، آش رشته و شیرینی‌های سنتی.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
    duration: "۴ ساعت",
    guests: "۲-۸ نفر",
    price: 650000,
    category: "غذایی",
    rating: 4.7,
  },
  {
    id: 4,
    title: "تور عکاسی اصفهان",
    desc: "گشت عکاسی در میدان نقش جهان، سی‌وسه‌پل و مسجد شیخ لطف‌الله با راهنمای عکاسی حرفه‌ای.",
    image: "https://images.unsplash.com/photo-1542315192-1f61a1792f33",
    duration: "۶ ساعت",
    guests: "۱-۱۰ نفر",
    price: 750000,
    category: "فرهنگی",
    rating: 4.9,
  },
  {
    id: 5,
    title: "پیاده‌روی جنگل‌های گیلان",
    desc: "کاوش در جنگل‌های هیرکانی، تماشای آبشارها و استراحت در ویلاهای چوبی. آرامش مطلق.",
    image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    duration: "۵ ساعت",
    guests: "۲-۱۵ نفر",
    price: 450000,
    category: "طبیعت",
    rating: 4.8,
  },
  {
    id: 6,
    title: "قایق‌سواری در سواحل قشم",
    desc: "گشت با قایق در خور قشم، تماشای دره ستارگان و جزیره هرمز. ماجراجویی فراموش‌نشدنی.",
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1",
    duration: "۴ ساعت",
    guests: "۲-۱۰ نفر",
    price: 950000,
    category: "آبی",
    rating: 4.7,
  },
  {
    id: 7,
    title: "اسکی در دماوند",
    desc: "اسکی در دامنه‌های کوه دماوند، بلندترین قله ایران. مناسب برای اسکی‌بازان متوسط و حرفه‌ای.",
    image: "https://images.unsplash.com/photo-1551524559-8af4e6624178",
    duration: "۸ ساعت",
    guests: "۱-۸ نفر",
    price: 1500000,
    category: "کوهستان",
    rating: 4.9,
  },
  {
    id: 8,
    title: "تور باغ‌های مازندران",
    desc: "گشت در باغ‌های چای و مرکبات مازندران، آشنایی با فرآیند تولید و چشیدن چای تازه.",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb",
    duration: "۵ ساعت",
    guests: "۲-۱۲ نفر",
    price: 550000,
    category: "طبیعت",
    rating: 4.6,
  },
];

const categories = [
  { icon: Waves, label: "آبی", color: "from-teal-500/20 to-emerald-500/5" },
  { icon: Mountain, label: "کوهستان", color: "from-emerald-500/20 to-green-500/5" },
  { icon: Utensils, label: "غذایی", color: "from-amber-500/20 to-yellow-500/5" },
  { icon: Camera, label: "فرهنگی", color: "from-rose-500/20 to-amber-500/5" },
  { icon: Compass, label: "کویر", color: "from-yellow-500/20 to-amber-500/5" },
  { icon: Sparkles, label: "طبیعت", color: "from-green-500/20 to-teal-500/5" },
];

export function ExperiencesView() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-gold/8 via-background to-background py-16 sm:py-20">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge className="mb-4 gap-1.5 rounded-full bg-gold/15 px-4 py-1.5 text-gold-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              تجربه‌های فراموش‌نشدنی
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              فراتر از اقامت،
              <br />
              <span className="text-gradient-gold">تجربه زندگی</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              فعالیت‌ها و تجربه‌های منحصربه‌فرد را در مقاصد مختلف ایران کشف کنید.
              از غواصی در کیش تا سفر کویر در یزد.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories filter */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`group flex items-center gap-2 rounded-full bg-gradient-to-br ${cat.color} border border-border/60 px-4 py-2 text-sm font-medium transition-all hover:scale-105 hover:shadow-md`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading subtitle="پیشنهاد ویژه" title="تجربه‌های محبوب" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp, i) => (
            <motion.article
              key={exp.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: Math.min(i * 0.07, 0.4), duration: 0.5 }}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="img-shine relative aspect-[5/4] overflow-hidden bg-muted">
                <Image
                  src={cardImage(exp.image)}
                  alt={exp.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={SHIMMER_BLUR}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                <Badge className="absolute right-3 top-3 glass border-white/20 text-white">
                  {exp.category}
                </Badge>
                <div className="absolute bottom-3 left-3 rounded-full glass px-3 py-1.5 text-sm font-bold text-white">
                  <span className="ltr-nums">{toPersianDigits(exp.rating)}</span>
                  <span className="mr-1 text-gold">★</span>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-bold leading-tight">{exp.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{exp.desc}</p>
                <div className="flex items-center gap-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {exp.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {exp.guests}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">شروع از</span>
                    <p className="text-lg font-bold text-gradient-emerald">
                      {toPersianDigits(exp.price.toLocaleString("en-US"))}
                      <span className="mr-1 text-xs font-normal text-muted-foreground">تومان</span>
                    </p>
                  </div>
                  <Button size="sm" className="rounded-full">
                    رزرو تجربه
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-gold/10 p-8 text-center sm:p-12">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative space-y-4">
            <h2 className="text-3xl font-bold">تجربه‌ی دلخواه خود را پیدا نکردید؟</h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              تیم ویلاستا می‌تواند تجربه‌ای سفارشی برای شما طراحی کند. کافی است با ما در تماس باشید.
            </p>
            <Button size="lg" onClick={() => setView("home")} className="gap-2 rounded-full">
              تماس با ما
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
