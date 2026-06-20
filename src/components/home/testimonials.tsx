"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/persian";

const testimonials = [
  {
    name: "سارا محمدی",
    role: "مسافر کیش",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    text: "تجربه فوق‌العاده‌ای با ویلاستا داشتم. ویلا دقیقاً مطابق عکس‌ها بود و فرآیند رزرو بسیار ساده و سریع بود. حتماً دوباره استفاده می‌کنم.",
  },
  {
    name: "رضا احمدی",
    role: "مسافر یزد",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "اقامتگاه بوم‌گردی که رزرو کردیم واقعاً خاص بود. معماری سنتی و خدمات عالی. ویلاستا بهترین پلتفرم رزرو اقامتگاه در ایران است.",
  },
  {
    name: "مریم حسینی",
    role: "مسافر تهران",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 5,
    text: "پشتیبانی ۲۴ ساعته واقعاً عالی بود. وقتی سوالی داشتم سریع جواب دادند. قیمت‌ها هم منصفانه و رقابتی بود. پیشنهاد می‌کنم.",
  },
  {
    name: "علی رضایی",
    role: "میزبان ویلا",
    avatar: "https://i.pravatar.cc/150?img=33",
    rating: 5,
    text: "به عنوان میزبان، داشبورد ویلاستا بسیار کاربردی است. مدیریت رزروها و درآمد به راحتی انجام می‌شود. درآمد من ۳ برابر شد.",
  },
  {
    name: "زهرا کریمی",
    role: "مسافر شیراز",
    avatar: "https://i.pravatar.cc/150?img=20",
    rating: 5,
    text: "بوتیک‌هاتلی در شیراز رزرو کردم، واقعاً شگفت‌انگیز بود. حس اقامت در یک خانه تاریخی با امکانات مدرن. ممنون از ویلاستا.",
  },
  {
    name: "محمد علوی",
    role: "مسافر مازندران",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 4,
    text: "کلبه چوبی در جنگل مازندران، آرامش مطلق. فرآیند رزرو شفاف و بدون مشکل. فقط ای کاش گزینه‌های فیلتر بیشتر بود.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        subtitle="نظرات مسافران"
        title="تجربه‌هایی که می‌گویند"
        align="center"
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <Card className="relative h-full overflow-hidden p-6 transition-shadow hover:shadow-card-hover">
              <Quote className="absolute -left-2 -top-2 h-16 w-16 text-primary/5" fill="currentColor" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={j < t.rating ? "text-gold" : "text-muted-foreground/30"}
                      fill="currentColor"
                      style={{ width: 14, height: 14 }}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.text}</p>
                <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
