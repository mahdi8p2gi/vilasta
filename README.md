<div align="center">

# 🏛️ ویلاستا — Vilasta

### Persian Villa & Hotel Booking Platform

**اقامتگاه‌های لوکس ایران — از سواحل کیش تا جنگل‌های گیلان**

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

<p>
  <img src="https://img.shields.io/badge/RTL-Persian-059669?style=flat-square" />
  <img src="https://img.shields.io/badge/Dark_Mode-✓-1a1a2e?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-gold?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Production_Ready-emerald?style=flat-square" />
</p>

---

</div>

## ✨ معرفی — Overview

**ویلاستا** یک پلتفرم مدرن و لوکس برای رزرو آنلاین ویلا، هتل و اقامتگاه‌های بوم‌گردی در سراسر ایران است. این پروژه با جدیدترین تکنولوژی‌های روز دنیا ساخته شده و تجربه‌ای فراموش‌نشدنی از سفر دیجیتال را ارائه می‌دهد.

> A production-ready, luxury Persian booking platform built with Next.js 16, featuring a premium design system, full RTL support, dark/light themes, and a complete multi-role dashboard system.

---

## 🎯 ویژگی‌ها — Features

### 🏠 صفحات اصلی — Core Pages
- **صفحه خانه** — هیرو تمام‌صفحه با جستجوی هوشمند، اقامتگاه‌های منتخب، مقاصد محبوب، دسته‌بندی‌ها، نظرات، سوالات متداول
- **کاوش اقامتگاه‌ها** — فیلترهای پیشرفته (قیمت، امتیاز، نوع، امکانات)، مرتب‌سازی، صفحه‌بندی
- **جزئیات اقامتگاه** — گالری تصاویر تمام‌صفحه، نقشه استایل‌شده، تقویم موجودی، نظرات با امتیازدهی چندوجهی، اقامتگاه‌های مشابه
- **مقاصد** — صفحه اختصاصی با مقاصد منتخب و اقامتگاه‌های هر شهر
- **تجربه‌ها** — فعالیت‌های تفریحی (غواصی، کویرنوردی، آشپزی، عکاسی)
- **میزبان شوید** — صفحه فرود میزبانان با آمار، مزایا، مراحل و نظرات

### 🔐 احراز هویت — Authentication
- ورود، ثبت‌نام، بازیابی رمز عبور
- ورود سریع دمو برای ۳ نقش (مدیر، میزبان، کاربر)
- اعتبارسنجی با Zod + React Hook Form
- مدیریت نشست JWT-ready

### 👥 نقش‌های کاربری — Roles
| نقش | دسترسی |
|------|--------|
| 🟢 **مشتری** | پروفایل، رزروها، علاقه‌مندی‌ها، اعلان‌ها، نظرات، امنیت |
| 🔵 **میزبان** | مدیریت اقامتگاه‌ها، افزودن ویلا، تحلیل درآمد، تقویم، رزروهای مسافران |
| 🟡 **مدیر** | تحلیل کل پلتفرم، مدیریت کاربران/اقامتگاه‌ها/رزروها/نظرات، گزارش‌ها |

### 💳 سیستم رزرو — Booking System
- انتخاب تاریخ با تقویم شمسی (Jalali)
- انتخاب تعداد مسافران
- محاسبه قیمت آنی (شب × قیمت + هزینه پاکسازی + کارمزد - تخفیف هفتگی/ماهانه)
- فرآیند پرداخت ۴ مرحله‌ای با تأییدیه انیمیشنی

### 🎨 طراحی — Design
- **پالت لوکس** — سبز زمردی + طلایی گرم (بدون آبی/نیلی)
- **فونت وزیرمتن** — تایپوگرافی حرفه‌ای فارسی
- **Glassmorphism** — جایی که لازم است
- **انیمیشن‌های نرم** — Framer Motion در تمام تعاملات
- **Dark/Light Mode** — با persist و transition نرم
- **پریلودر برند** — انیمیشن لوگو هنگام بارگذاری
- **دکمه بازگشت به بالا** — با پالس رینگ
- **افکت Shine** — حرکت نور روی تصاویر هنگام هاور

---

## 🛠 تکنولوژی‌ها — Tech Stack

| لایه | تکنولوژی |
|------|----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, Shadcn/UI (New York) |
| **Animation** | Framer Motion |
| **Forms** | React Hook Form + Zod |
| **State** | Zustand (client), TanStack Query (server) |
| **Database** | Prisma ORM + SQLite (PostgreSQL-ready) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Font** | Vazirmatn (Google Fonts) |

---

## 📁 ساختار پروژه — Project Structure

```
vilasta/
├── prisma/
│   ├── schema.prisma          # 8 مدل: User, Property, Booking, Review, ...
│   └── seed.ts                # داده اولیه: 12 اقامتگاه، 8 مقصد، 5 دسته
├── src/
│   ├── app/
│   │   ├── api/               # 18 endpoint: properties, bookings, auth, analytics
│   │   ├── globals.css        # طراحی سیستم لوکس (emerald + gold)
│   │   ├── layout.tsx         # RTL، Vazirmatn، ThemeProvider
│   │   └── page.tsx           # AppShell (SPA view routing)
│   ├── components/
│   │   ├── home/              # Hero, SmartSearch, Categories, Destinations, FAQ
│   │   ├── property/          # ListingView, PropertyDetailView
│   │   ├── booking/           # 4-step checkout flow
│   │   ├── dashboard/         # User/Host/Admin dashboards + shared shell
│   │   ├── destinations/      # مقاصد page
│   │   ├── experiences/       # تجربه‌ها page
│   │   ├── host/              # میزبان شوید landing
│   │   ├── auth/              # AuthModal (login/register/forgot)
│   │   ├── shared/            # PropertyCard, SearchModal, BackToTop, ...
│   │   ├── layout/            # Navbar, Footer, AppShell, Preloader
│   │   └── ui/                # Shadcn/UI components
│   ├── hooks/                 # use-api.ts (TanStack Query hooks)
│   ├── lib/                   # db, persian utils, image utils, api helpers
│   ├── store/                 # app-store.ts (Zustand: routing, auth, favorites)
│   ├── types/                 # Domain types
│   └── config/                # site config, property meta, amenity meta
└── public/
    └── favicon.svg            # Brand monogram
```

---

## 🚀 شروع سریع — Quick Start

```bash
# نصب وابستگی‌ها
bun install

# تنظیم دیتابیس
bun run db:push
bun run prisma/seed.ts

# اجرای سرور توسعه
bun run dev
```

### حساب‌های دمو — Demo Accounts
| نقش | ایمیل |
|------|-------|
| مدیر | `admin@villa.ir` |
| میزبان | `host@villa.ir` |
| کاربر | `user@villa.ir` |

> رمز عبور: هر چیزی (demo mode)

---

## 🌈 طراحی سیستم — Design System

### رنگ‌ها — Colors
```
ـ سبز زمردی (Primary):  oklch(0.42 0.09 165) / oklch(0.62 0.11 165) dark
ـ طلایی گرم (Gold):     oklch(0.72 0.14 75) / oklch(0.82 0.14 75) dark
ـ پس‌زمینه:             oklch(0.99 0.004 95) / oklch(0.16 0.012 255) dark
```

### کامپوننت‌های کلیدی
- `SmartSearch` — نوار جستجوی شیشه‌ای با popover های مقصد/تاریخ/مسافر
- `PropertyCard` — کارت اقامتگاه با افکت shine + zoom کند هنگام هاور
- `AuthModal` — مودال احراز هویت با انیمیشن تعویض حالت
- `DashboardShell` — لایه مشترک داشبورد با سایدبار و هدر
- `BackToTop` — دکمه بازگشت به بالا با پالس رینگ

---

## 📊 API Endpoints

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET | `/api/properties` | لیست با فیلتر، صفحه‌بندی، مرتب‌سازی |
| GET | `/api/properties/featured` | اقامتگاه‌های منتخب |
| GET | `/api/properties/[id]` | جزئیات + نظرات |
| GET | `/api/properties/[id]/reviews` | نظرات + میانگین امتیازها |
| GET | `/api/properties/[id]/similar` | اقامتگاه‌های مشابه |
| GET/POST | `/api/properties/host` | ویلاهای میزبان / افزودن |
| GET/POST | `/api/bookings` | رزروهای کاربر / ثبت رزرو |
| POST | `/api/auth/login` | ورود |
| POST | `/api/auth/register` | ثبت‌نام |
| GET | `/api/destinations` | مقاصد |
| GET | `/api/categories` | دسته‌بندی‌ها |
| GET/POST | `/api/favorites` | علاقه‌مندی‌ها |
| GET | `/api/notifications` | اعلان‌ها |
| GET | `/api/analytics/host` | تحلیل میزبان |
| GET | `/api/analytics/admin` | تحلیل مدیر |

---

## 🔧 اسکریپت‌ها — Scripts

```bash
bun run dev          # سرور توسعه (port 3000)
bun run lint         # بررسی کد با ESLint
bun run db:push      # همگام‌سازی schema با دیتابیس
bun run db:generate  # تولید Prisma Client
bun run db:migrate   # مهاجرت
bun run db:reset     # ریست دیتابیس
```

---

## 📝 تصمیمات معماری — Architecture Decisions

1. **SPA View Routing** — از Zustand برای routing بین view ها استفاده شده (بدون Next.js route per page) تا تجربه روان‌تری داشته باشد
2. **API Routes** — تمام منطق backend در `/api` با Next.js Route Handlers
3. **JSON-encoded arrays** — برای SQLite، آرایه‌ها (amenities, images) به صورت JSON string ذخیره می‌شوند
4. **Image Optimization** — تابع `cardImage()` برای URL های با اندازه مناسب + blur placeholder + lazy loading
5. **Persisted Store** — favorites، user session و search params در localStorage ذخیره می‌شوند

---

## 📞 تماس — Contact

- **ایمیل:** themahdikga@gmail.com
- **تهران، ایران**

---

<div align="center">

**© ۱۴۰۵ ویلاستا. تمام حقوق محفوظ است.**

ساخته شده با ❤️ برای مسافران ایرانی

</div>
