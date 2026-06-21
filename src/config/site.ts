// ============================================================================
//  Site configuration
// ============================================================================

import {
  Home,
  Building2,
  Palmtree,
  Trees,
  Building,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  name: "ویلاستا",
  fullName: "ویلاستا — اقامتگاه‌های لوکس ایران",
  tagline: "اقامتگاه‌های لوکس در سراسر ایران",
  description:
    "پلتفرم رزرو آنلاین ویلا، هتل و اقامتگاه‌های لوکس. تجربه‌ای متفاوت از سفر در ایران.",
  url: "https://vilasta.ir",
  phone: "۰۲۱-۹۱۰۰۲۰۳۰",
  email: "themahdikga@gmail.com",
  social: {
    instagram: "https://instagram.com/vilasta",
    telegram: "https://t.me/vilasta",
    twitter: "https://twitter.com/vilasta",
  },
};

export const propertyTypeMeta: Record<
  string,
  { label: string; icon: LucideIcon; color: string }
> = {
  villa: { label: "ویلا", icon: Home, color: "text-emerald-brand" },
  hotel: { label: "هتل", icon: Building, color: "text-gold" },
  apartment: { label: "آپارتمان", icon: Building2, color: "text-primary" },
  resort: { label: "اقامتگاه", icon: Palmtree, color: "text-emerald-brand" },
  cottage: { label: "کلبه", icon: Trees, color: "text-primary" },
};

export const amenityMeta: Record<string, { label: string; icon: string }> = {
  wifi: { label: "اینترنت رایگان", icon: "wifi" },
  pool: { label: "استخر", icon: "waves" },
  parking: { label: "پارکینگ", icon: "car" },
  ac: { label: "تهویه مطبوع", icon: "snowflake" },
  kitchen: { label: "آشپزخانه", icon: "chef-hat" },
  tv: { label: "تلویزیون", icon: "tv" },
  washer: { label: "لباسشویی", icon: "washing-machine" },
  heater: { label: "بخاری", icon: "flame" },
  breakfast: { label: "صبحانه", icon: "utensils" },
  gym: { label: "باشگاه", icon: "dumbbell" },
  spa: { label: "اسپا", icon: "sparkles" },
  balcony: { label: "بالکن", icon: "panel-top" },
  garden: { label: "باغ", icon: "flower-2" },
  bbq: { label: "باربیکیو", icon: "flame" },
  fireplace: { label: "شومینه", icon: "flame" },
  elevator: { label: "آسانسور", icon: "arrow-up-down" },
  security: { label: "نگهبان", icon: "shield-check" },
  seaView: { label: "دید دریا", icon: "waves" },
  mountainView: { label: "دید کوه", icon: "mountain" },
  petFriendly: { label: "حیوانات مجاز", icon: "paw-print" },
};

export const navItems = [
  { label: "خانه", view: "home" as const },
  { label: "کاوش", view: "listing" as const },
  { label: "مقاصد", view: "destinations" as const },
  { label: "تجربه‌ها", view: "experiences" as const },
  { label: "میزبان شوید", view: "host-intro" as const },
];
