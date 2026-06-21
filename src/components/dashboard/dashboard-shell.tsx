"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Menu,
  Home as HomeIcon,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAppStore, type DashboardTab } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/shared/logo";
import { toPersianDigits } from "@/lib/persian";
import { useNotifications } from "@/hooks/use-api";

export interface NavItem {
  tab: DashboardTab;
  label: string;
  icon: LucideIcon;
}

const roleMeta: Record<
  "customer" | "host" | "admin",
  { label: string; badgeClass: string }
> = {
  customer: {
    label: "کاربر",
    badgeClass:
      "border-transparent bg-accent text-accent-foreground",
  },
  host: {
    label: "میزبان",
    badgeClass:
      "border-transparent bg-gold/15 text-gold-foreground",
  },
  admin: {
    label: "مدیر",
    badgeClass:
      "border-transparent bg-primary text-primary-foreground",
  },
};

export function DashboardShell({
  navItems,
  activeTab,
  onTabChange,
  title,
  subtitle,
  children,
  role,
  headerActions,
}: {
  navItems: NavItem[];
  activeTab: DashboardTab;
  onTabChange: (t: DashboardTab) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  role: "customer" | "host" | "admin";
  headerActions?: React.ReactNode;
}) {
  const user = useAppStore((s) => s.user);
  const setView = useAppStore((s) => s.setView);
  const logout = useAppStore((s) => s.logout);
  const openAuth = useAppStore((s) => s.openAuth);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { data: notifs } = useNotifications(user?.id ?? null);
  const unreadCount = notifs?.filter((n) => !n.read).length ?? 0;

  const roleInfo = roleMeta[role];

  const goTab = (t: DashboardTab) => {
    onTabChange(t);
    setMobileOpen(false);
  };

  const renderNavList = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.tab === activeTab;
        return (
          <button
            key={item.tab}
            onClick={() => {
              goTab(item.tab);
              onNavigate?.();
            }}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-luxury"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                active
                  ? "bg-primary-foreground/15"
                  : "bg-muted/60 group-hover:bg-background"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex-1 text-right">{item.label}</span>
            {active && (
              <span className="absolute -right-0.5 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-gold" />
            )}
          </button>
        );
      })}
    </nav>
  );

  const renderUserCard = () => (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3">
      <Avatar className="h-11 w-11 ring-2 ring-primary/30">
        {user?.avatar ? (
          <AvatarImage src={user.avatar} alt={user.name ?? "avatar"} />
        ) : null}
        <AvatarFallback className="bg-primary/10 text-primary">
          {user?.name?.[0] ?? "U"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {user?.name ?? "کاربر"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user?.email}
        </p>
      </div>
      <Badge className={cn("text-[10px]", roleInfo.badgeClass)}>
        {roleInfo.label}
      </Badge>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Mobile top bar */}
      <header className="glass sticky top-0 z-30 flex items-center justify-between border-b border-border/60 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="منو">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-4">
              <SheetHeader className="px-0">
                <SheetTitle className="text-right">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-2">
                {renderUserCard()}
              </div>
              <div className="mt-4">
                {renderNavList(() => setMobileOpen(false))}
              </div>
              <div className="mt-4 border-t border-border/60 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => setView("home")}
                >
                  <HomeIcon className="h-4 w-4" />
                  بازگشت به سایت
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4" />
                  خروج از حساب
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Logo />
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle compact />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="اعلان‌ها"
            onClick={() => goTab("notifications")}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {toPersianDigits(unreadCount)}
              </span>
            )}
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-0 px-0 lg:gap-6 lg:px-6 lg:py-6">
        {/* Desktop sidebar (right side in RTL) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col gap-4 overflow-y-auto scrollbar-thin rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="px-1">
              <Logo />
            </div>
            {renderUserCard()}
            <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
              <span>منو</span>
              <span className="h-px flex-1 mx-2 bg-border/60" />
            </div>
            {renderNavList()}
            <div className="mt-auto space-y-1 border-t border-border/60 pt-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => setView("home")}
              >
                <HomeIcon className="h-4 w-4" />
                بازگشت به سایت
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                خروج از حساب
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-4 lg:px-0 lg:py-0">
          {/* Desktop header */}
          <div className="mb-6 hidden items-center justify-between gap-4 lg:flex">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                <span className="text-gradient-emerald">{title}</span>
              </motion.h1>
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="اعلان‌ها"
                onClick={() => goTab("notifications")}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {toPersianDigits(unreadCount)}
                  </span>
                )}
              </Button>
              <ThemeToggle compact />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView("home")}
                className="gap-2"
              >
                <HomeIcon className="h-4 w-4" />
                بازگشت به سایت
              </Button>
            </div>
          </div>

          {/* Mobile page title */}
          <div className="mb-4 lg:hidden">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-gradient-emerald">{title}</span>
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {children}
        </main>
      </div>

      {!user && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <Button onClick={() => openAuth("login")} className="shadow-luxury">
            ورود به حساب کاربری
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------- Reusable: StatCard ---------- */
export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  tone = "emerald",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  tone?: "emerald" | "gold" | "amber" | "rose";
}) {
  const toneMap: Record<string, string> = {
    emerald: "bg-primary/10 text-primary",
    gold: "bg-gold/15 text-gold-foreground",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    rose: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  };
  const trendColor =
    trend === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : trend === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:shadow-luxury"
    >
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight ltr-nums">
            {value}
          </p>
          {trendLabel && (
            <p className={cn("mt-1.5 text-[11px] font-medium", trendColor)}>
              {trendLabel}
            </p>
          )}
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            toneMap[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </motion.div>
  );
}

/* ---------- Reusable: PageCard ---------- */
export function PageCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6",
        className
      )}
    >
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/* ---------- Reusable: LoginPrompt ---------- */
export function LoginPrompt({
  title = "برای دسترسی به داشبورد وارد شوید",
  description = "لطفاً برای ادامه وارد حساب کاربری خود شوید.",
}: {
  title?: string;
  description?: string;
}) {
  const openAuth = useAppStore((s) => s.openAuth);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80"
          alt=""
          fill
          className="object-cover opacity-20"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button onClick={() => openAuth("login")}>ورود / ثبت‌نام</Button>
    </div>
  );
}

/* ---------- Reusable: StatusBadge ---------- */
const statusMeta: Record<string, { label: string; className: string }> = {
  // Booking
  pending: {
    label: "در انتظار",
    className: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  confirmed: {
    label: "تأیید شده",
    className: "border-transparent bg-primary/15 text-primary",
  },
  cancelled: {
    label: "لغو شده",
    className: "border-transparent bg-destructive/15 text-destructive",
  },
  completed: {
    label: "تکمیل شده",
    className: "border-transparent bg-emerald-600/15 text-emerald-700 dark:text-emerald-400",
  },
  // Property
  active: {
    label: "فعال",
    className: "border-transparent bg-emerald-600/15 text-emerald-700 dark:text-emerald-400",
  },
  suspended: {
    label: "معلق",
    className: "border-transparent bg-destructive/15 text-destructive",
  },
  // Payment
  paid: {
    label: "پرداخت شده",
    className: "border-transparent bg-emerald-600/15 text-emerald-700 dark:text-emerald-400",
  },
  unpaid: {
    label: "پرداخت نشده",
    className: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  refunded: {
    label: "بازگشت‌یافته",
    className: "border-transparent bg-muted text-muted-foreground",
  },
  // User role
  admin: {
    label: "مدیر",
    className: "border-transparent bg-primary text-primary-foreground",
  },
  host: {
    label: "میزبان",
    className: "border-transparent bg-gold/15 text-gold-foreground",
  },
  customer: {
    label: "کاربر",
    className: "border-transparent bg-accent text-accent-foreground",
  },
  guest: {
    label: "مهمان",
    className: "border-transparent bg-muted text-muted-foreground",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = statusMeta[status] ?? {
    label: status,
    className: "border-transparent bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="outline" className={cn("text-[10px]", meta.className)}>
      {meta.label}
    </Badge>
  );
}

/* ---------- Reusable: Loading grid ---------- */
export function DashboardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border/60 bg-card"
        >
          <div className="h-32 animate-shimmer rounded-none" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-1/2 animate-shimmer rounded" />
            <div className="h-3 w-3/4 animate-shimmer rounded" />
            <div className="flex gap-2">
              <div className="h-7 w-20 animate-shimmer rounded-md" />
              <div className="h-7 w-20 animate-shimmer rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
