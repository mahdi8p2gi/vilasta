<div align="center">

# 🏛️ Vilasta

### Persian Villa & Hotel Booking Platform

**Luxury accommodations across Iran — from the shores of Kish to the forests of Gilan**

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

## 📖 Overview

**Vilasta** is a modern, luxury booking platform for villas, hotels, and boutique accommodations across Iran. Built with the latest web technologies, it delivers a premium digital travel experience with full RTL Persian support, dark/light themes, and a complete multi-role dashboard system.

> A production-ready Persian booking platform featuring a luxury emerald-and-gold design system, full RTL support, instant theme switching, and a complete booking flow with multi-role dashboards (Customer, Host, Admin).

---

## ✨ Features

### 🏠 Core Pages
- **Home** — Full-screen hero with smart search, featured properties, popular destinations, categories, testimonials, FAQ
- **Explore** — Advanced filters (price, rating, type, amenities), sorting, pagination
- **Property Detail** — Fullscreen image gallery, stylized map, availability calendar, multi-dimensional reviews, similar properties
- **Destinations** — Dedicated page with featured travel insights and per-city properties
- **Experiences** — Recreational activities (diving, desert tours, cooking classes, photography)
- **Become a Host** — Host landing page with stats, perks, process steps, testimonials, FAQ

### 🔐 Authentication
- Login, Register, Forgot Password
- Quick demo login for 3 roles (Admin, Host, Customer)
- Zod + React Hook Form validation
- JWT-ready session management

### 👥 User Roles
| Role | Access |
|------|--------|
| 🟢 **Customer** | Profile, bookings, favorites, notifications, reviews, security |
| 🔵 **Host** | Property management, add villa, revenue analytics, calendar, guest bookings |
| 🟡 **Admin** | Platform analytics, manage users/properties/bookings/reviews, reports |

### 💳 Booking System
- Jalali (Persian solar) date picker
- Guest count selector
- Instant price calculation (nights × price + cleaning fee + service fee − weekly/monthly discount)
- 4-step checkout flow with animated confirmation

### 🎨 Design
- **Luxury palette** — Deep emerald + warm gold (no indigo/blue)
- **Vazirmatn font** — Professional Persian typography
- **Glassmorphism** — Used selectively where appropriate
- **Smooth animations** — Framer Motion throughout
- **Dark/Light Mode** — With instant switching and persistence
- **Brand preloader** — Logo animation on initial load
- **Back-to-top button** — With pulse ring animation
- **Shine effect** — Light sweep on image hover
- **Slow cinematic hover** — 1s card lift + 1.8s image zoom

---

## 🛠 Tech Stack

| Layer | Technology |
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

## 📁 Project Structure

```
vilasta/
├── prisma/
│   ├── schema.prisma          # 8 models: User, Property, Booking, Review, ...
│   └── seed.ts                # Seed data: 12 properties, 8 destinations, 5 categories
├── public/
│   └── favicon.svg            # Brand monogram
├── src/
│   ├── app/
│   │   ├── api/               # 18 REST endpoints
│   │   │   ├── auth/          # login, register
│   │   │   ├── properties/    # CRUD, featured, reviews, similar, host
│   │   │   ├── bookings/      # GET, POST
│   │   │   ├── analytics/     # host, admin
│   │   │   ├── destinations/  # GET
│   │   │   ├── categories/    # GET
│   │   │   ├── favorites/     # GET, POST
│   │   │   └── notifications/ # GET
│   │   ├── globals.css        # Luxury design system (emerald + gold)
│   │   ├── layout.tsx         # RTL, Vazirmatn, ThemeProvider, QueryProvider
│   │   └── page.tsx           # AppShell (SPA view routing)
│   ├── components/
│   │   ├── home/              # Hero, SmartSearch, Categories, Destinations, FAQ
│   │   ├── property/          # ListingView, PropertyDetailView
│   │   ├── booking/           # 4-step checkout flow
│   │   ├── dashboard/         # User/Host/Admin dashboards + shared shell
│   │   ├── destinations/      # Destinations page
│   │   ├── experiences/       # Experiences page
│   │   ├── host/              # Become-a-host landing page
│   │   ├── auth/              # AuthModal (login/register/forgot)
│   │   ├── shared/            # PropertyCard, SearchModal, BackToTop, etc.
│   │   ├── layout/            # Navbar, Footer, AppShell, Preloader
│   │   ├── providers/         # ThemeProvider, QueryProvider
│   │   └── ui/                # Shadcn/UI component library
│   ├── hooks/
│   │   └── use-api.ts         # TanStack Query hooks for all endpoints
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── persian.ts         # Persian digits, currency, Jalali dates
│   │   ├── image.ts           # Image URL optimization, blur placeholders
│   │   ├── api.ts             # API helpers (serialize, json, error)
│   │   └── date-utils.ts      # Jalali date utilities
│   ├── store/
│   │   └── app-store.ts       # Zustand store (routing, auth, favorites, search)
│   ├── types/
│   │   └── index.ts           # Domain types (Property, Booking, Review, etc.)
│   └── config/
│       └── site.ts            # Site config, property type meta, amenity meta
├── .env.example               # Environment variable template
├── .gitignore
├── next.config.ts             # Next.js + image config
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)
- A package manager (npm, yarn, pnpm, or bun)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vilasta.git
cd vilasta

# Install dependencies
bun install
# or: npm install

# Set up environment variables
cp .env.example .env

# Set up the database
bun run db:push
bun run prisma/seed.ts

# Start the development server
bun run dev
```

The app will be available at `http://localhost:3000`

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@villa.ir` | any |
| Host | `host@villa.ir` | any |
| Customer | `user@villa.ir` | any |

---

## 📜 Scripts

```bash
bun run dev          # Start dev server (port 3000)
bun run lint         # Run ESLint
bun run db:push      # Push schema to database
bun run db:generate  # Generate Prisma Client
bun run db:migrate   # Create and apply migration
bun run db:reset     # Reset database
```

---

## 🌈 Design System

### Colors
```css
/* Light mode */
--primary:        oklch(0.42 0.09 165);  /* Deep emerald */
--gold:           oklch(0.72 0.14 75);   /* Warm gold */
--background:     oklch(0.99 0.004 95);  /* Near white */
--foreground:     oklch(0.18 0.01 240);  /* Near black */

/* Dark mode */
--primary:        oklch(0.62 0.11 165);
--gold:           oklch(0.82 0.14 75);
--background:     oklch(0.16 0.012 255);
--foreground:     oklch(0.96 0.005 95);
```

### Key Components
- `SmartSearch` — Glassmorphic search bar with destination/date/guest popovers
- `PropertyCard` — Card with shine effect + slow cinematic hover (1.8s zoom)
- `AuthModal` — Auth modal with animated mode transitions
- `DashboardShell` — Shared dashboard layout with sidebar and header
- `BackToTop` — Floating button with pulse ring animation

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | List with filters, pagination, sorting |
| GET | `/api/properties/featured` | Featured properties |
| GET | `/api/properties/[id]` | Property details + reviews |
| GET | `/api/properties/[id]/reviews` | Reviews + rating averages |
| GET | `/api/properties/[id]/similar` | Similar properties |
| GET/POST | `/api/properties/host` | Host's properties / add new |
| GET/POST | `/api/bookings` | User bookings / create booking |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/destinations` | All destinations |
| GET | `/api/categories` | All categories |
| GET/POST | `/api/favorites` | Favorites (GET list / POST toggle) |
| GET | `/api/notifications` | User notifications |
| GET | `/api/analytics/host` | Host analytics (revenue, charts) |
| GET | `/api/analytics/admin` | Admin platform analytics |

---

## 🏗 Architecture Decisions

1. **SPA View Routing** — Uses Zustand for client-side view routing (no per-page Next.js routes) for a smoother SPA experience
2. **API Routes** — All backend logic in `/api` using Next.js Route Handlers
3. **JSON-encoded arrays** — For SQLite compatibility, arrays (amenities, images) stored as JSON strings
4. **Image Optimization** — `cardImage()` helper for right-sized URLs + blur placeholders + lazy loading
5. **Persisted Store** — Favorites, user session, and search params persisted in localStorage
6. **Instant Theme Switch** — `disableTransitionOnChange` for zero-lag dark/light toggle

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Set Environment Variables** in Vercel dashboard:
   ```
   DATABASE_URL=postgresql://...  # Use Neon, Supabase, or Vercel Postgres
   ```

4. **Deploy** — Vercel builds and deploys automatically

> **Note:** SQLite (`file:`) doesn't work on Vercel (serverless, no persistent filesystem). Switch to PostgreSQL:
> - Update `prisma/schema.prisma`: change `provider = "sqlite"` to `provider = "postgresql"`
> - Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
> - Run `bun run db:push` with the new `DATABASE_URL`

### Other Platforms
The app is a standard Next.js 16 project — deploys to any Node.js host (Netlify, Railway, Render, Docker, etc.)

---

## 📝 License

MIT © 2025 Vilasta

---

## 📞 Contact

- **Email:** themahdikga@gmail.com
- **Location:** Arak, Iran

---

<div align="center">

**© 2025 Vilasta. All rights reserved.**

Built with ❤️ for Iranian travelers

</div>
