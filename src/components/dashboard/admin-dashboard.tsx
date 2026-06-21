"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import {
  BarChart3,
  Users as UsersIcon,
  Building2,
  BookMarked,
  Star,
  FileText,
  Shield,
  CheckCircle2,
  Ban,
  Trash2,
  Download,
  Wallet,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAppStore, type DashboardTab } from "@/store/app-store";
import { useAdminAnalytics } from "@/hooks/use-api";
import {
  formatToman,
  formatTomanCompact,
  formatJalaliShort,
  toPersianDigits,
  ratingLabel,
} from "@/lib/persian";
import { propertyTypeMeta } from "@/config/site";
import {
  DashboardShell,
  LoginPrompt,
  PageCard,
  StatCard,
  StatusBadge,
  DashboardSkeleton,
  type NavItem,
} from "@/components/dashboard/dashboard-shell";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const navItems: NavItem[] = [
  { tab: "analytics", label: "تحلیل کلی", icon: BarChart3 },
  { tab: "users", label: "کاربران", icon: UsersIcon },
  { tab: "properties", label: "اقامتگاه‌ها", icon: Building2 },
  { tab: "bookings", label: "رزروها", icon: BookMarked },
  { tab: "reviews", label: "نظرات", icon: Star },
  { tab: "reports", label: "گزارش‌ها", icon: FileText },
];

const PIE_COLORS = ["var(--primary)", "var(--gold)", "var(--chart-5)", "var(--chart-4)"];

export function AdminDashboard() {
  const user = useAppStore((s) => s.user);
  const dashboardTab = useAppStore((s) => s.dashboardTab);
  const goDashboard = useAppStore((s) => s.goDashboard);

  // Ensure the active tab is valid for this dashboard; otherwise default to analytics.
  const validTabs: DashboardTab[] = ["analytics", "users", "properties", "bookings", "reviews", "reports"];
  const activeTab: DashboardTab = validTabs.includes(dashboardTab)
    ? dashboardTab
    : "analytics";

  if (!user) return <LoginPrompt />;
  if (user.role !== "admin") {
    return (
      <LoginPrompt
        title="دسترسی مخصوص مدیران"
        description="این بخش فقط برای مدیران سیستم قابل دسترسی است."
      />
    );
  }

  const setTab = (t: DashboardTab) => goDashboard(t);

  const tabMeta: Record<DashboardTab, { title: string; subtitle?: string }> = {
    analytics: { title: "تحلیل کلی پلتفرم", subtitle: "نمای کلی از عملکرد ویلاستا" },
    users: { title: "مدیریت کاربران", subtitle: "تمام کاربران ثبت‌نام‌شده" },
    properties: { title: "مدیریت اقامتگاه‌ها", subtitle: "تأیید و نظارت بر اقامتگاه‌ها" },
    bookings: { title: "همه رزروها", subtitle: "مشاهده رزروهای پلتفرم" },
    reviews: { title: "مدیریت نظرات", subtitle: "نظرات ثبت‌شده کاربران" },
    reports: { title: "گزارش‌ها", subtitle: "گزارش‌های مدیریتی و دانلودها" },
    profile: { title: "پروفایل" },
    favorites: { title: "علاقه‌مندی" },
    notifications: { title: "اعلان‌ها" },
    security: { title: "امنیت" },
    "add-property": { title: "افزودن اقامتگاه" },
    revenue: { title: "درآمد" },
    calendar: { title: "تقویم" },
  };

  return (
    <DashboardShell
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setTab}
      role="admin"
      title={tabMeta[activeTab].title}
      subtitle={tabMeta[activeTab].subtitle}
    >
      {activeTab === "analytics" && <AnalyticsTab />}
      {activeTab === "users" && <UsersTab />}
      {activeTab === "properties" && <AdminPropertiesTab />}
      {activeTab === "bookings" && <AdminBookingsTab />}
      {activeTab === "reviews" && <AdminReviewsTab />}
      {activeTab === "reports" && <ReportsTab />}
    </DashboardShell>
  );
}

/* ============================ ANALYTICS ============================ */
function AnalyticsTab() {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-shimmer rounded-2xl" />
          ))}
        </div>
        <div className="h-80 animate-shimmer rounded-2xl" />
      </div>
    );
  }
  if (!data) {
    return (
      <EmptyState
        icon={BarChart3}
        title="داده‌ای موجود نیست"
        description="هنوز داده تحلیلی برای پلتفرم ثبت نشده است."
      />
    );
  }

  const stats = data.stats;
  const growth = (data.growth ?? []).map((d: any) => ({
    ...d,
    label: toPersianDigits(d.label),
  }));

  const roleData = Object.entries(data.roleBreakdown ?? {}).map(([k, v]) => ({
    name: ({ admin: "مدیر", host: "میزبان", customer: "کاربر", guest: "مهمان" } as Record<string, string>)[k] ?? k,
    value: v as number,
  }));
  const typeData = Object.entries(data.typeBreakdown ?? {}).map(([k, v]) => ({
    name: propertyTypeMeta[k]?.label ?? k,
    value: v as number,
  }));

  return (
    <div className="space-y-6">
      {/* 6 stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={UsersIcon}
          label="کل کاربران"
          value={toPersianDigits(stats.totalUsers)}
          trend="up"
          trendLabel="در کل پلتفرم"
          tone="emerald"
        />
        <StatCard
          icon={Building2}
          label="کل اقامتگاه‌ها"
          value={toPersianDigits(stats.totalProperties)}
          trend="up"
          trendLabel="منتشرشده"
          tone="gold"
        />
        <StatCard
          icon={BookMarked}
          label="کل رزروها"
          value={toPersianDigits(stats.totalBookings)}
          trend="up"
          trendLabel="در کل دوره"
          tone="amber"
        />
        <StatCard
          icon={Star}
          label="کل نظرات"
          value={toPersianDigits(stats.totalReviews)}
          trend="neutral"
          trendLabel="ثبت‌شده"
          tone="rose"
        />
        <StatCard
          icon={Wallet}
          label="درآمد کل"
          value={formatTomanCompact(stats.totalRevenue)}
          trend="up"
          trendLabel="ناخالص"
          tone="emerald"
        />
        <StatCard
          icon={Crown}
          label="میانگین امتیاز"
          value={toPersianDigits(stats.avgRating.toFixed(1))}
          trend="up"
          trendLabel={ratingLabel(stats.avgRating)}
          tone="gold"
        />
      </div>

      {/* Growth chart */}
      <PageCard
        title="رشد پلتفرم"
        description="روند درآمد و رزروها در ۸ ماه اخیر"
      >
        <div className="h-80 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bkG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={60}
                tickFormatter={(v) => toPersianDigits(formatTomanCompact(Number(v)).replace(/ تومان$/, ""))}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={30}
                tickFormatter={(v) => toPersianDigits(v)}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  direction: "rtl",
                }}
                formatter={(value: any, name: any) =>
                  name === "درآمد"
                    ? [formatToman(Number(value)), "درآمد"]
                    : [toPersianDigits(value), name]
                }
              />
              <Legend
                formatter={(v) => <span className="text-xs">{v}</span>}
                wrapperStyle={{ direction: "rtl" }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="درآمد"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#revG)"
                dot={false}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                name="رزروها"
                stroke="var(--gold)"
                strokeWidth={2.5}
                fill="url(#bkG)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </PageCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User role breakdown */}
        <PageCard
          title="توزیع نقش کاربران"
          description="تفکیک کاربران بر اساس نقش"
        >
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {roleData.map((entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    direction: "rtl",
                  }}
                  formatter={(v: any) => [toPersianDigits(v), "کاربر"]}
                />
                <Legend
                  formatter={(v) => <span className="text-xs">{v}</span>}
                  wrapperStyle={{ direction: "rtl" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </PageCard>

        {/* Property type breakdown */}
        <PageCard
          title="توزیع نوع اقامتگاه‌ها"
          description="تفکیک اقامتگاه‌ها بر اساس نوع"
        >
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                  tickFormatter={(v) => toPersianDigits(v)}
                />
                <Tooltip
                  cursor={{ fill: "var(--accent)", opacity: 0.3 }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    direction: "rtl",
                  }}
                  formatter={(v: any) => [toPersianDigits(v), "اقامتگاه"]}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PageCard>
      </div>
    </div>
  );
}

/* ============================ USERS ============================ */
function UsersTab() {
  const { data, isLoading } = useAdminAnalytics();
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const pageSize = 10;

  const users = (data?.users ?? []) as any[];
  const filtered = users.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  if (isLoading) return <DashboardSkeleton count={3} />;

  return (
    <PageCard
      title={`مدیریت کاربران (${toPersianDigits(filtered.length)})`}
      description="مشاهده، تعلیق و تغییر نقش کاربران"
      action={
        <Input
          placeholder="جستجوی نام یا ایمیل…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="h-9 w-48"
        />
      }
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border/60">
            <TableHead className="text-right">کاربر</TableHead>
            <TableHead className="text-right">ایمیل</TableHead>
            <TableHead className="text-right">نقش</TableHead>
            <TableHead className="text-right">عضویت</TableHead>
            <TableHead className="text-right">اقدامات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((u: any) => (
            <TableRow key={u.id} className="border-border/60">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    {u.avatar ? <AvatarImage src={u.avatar} alt={u.name ?? ""} /> : null}
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {u.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{u.name ?? "بدون نام"}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs" dir="ltr">
                {u.email}
              </TableCell>
              <TableCell>
                <StatusBadge status={u.role} />
              </TableCell>
              <TableCell className="text-xs">{formatJalaliShort(u.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Select
                    defaultValue={u.role}
                    onValueChange={(v) =>
                      toast.success(`نقش کاربر به «${({ admin: "مدیر", host: "میزبان", customer: "کاربر", guest: "مهمان" } as Record<string, string>)[v] ?? v}» تغییر کرد`)
                    }
                  >
                    <SelectTrigger className="h-8 w-28" size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">مدیر</SelectItem>
                      <SelectItem value="host">میزبان</SelectItem>
                      <SelectItem value="customer">کاربر</SelectItem>
                      <SelectItem value="guest">مهمان</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
                    onClick={() =>
                      toast.success(u.role === "suspended" ? "کاربر فعال شد" : "کاربر تعلیق شد")
                    }
                  >
                    <Ban className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {pageItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                کاربری یافت نشد
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            صفحه {toPersianDigits(safePage)} از {toPersianDigits(totalPages)}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </PageCard>
  );
}

/* ============================ ADMIN PROPERTIES ============================ */
function AdminPropertiesTab() {
  const { data, isLoading } = useAdminAnalytics();
  const goProperty = useAppStore((s) => s.goProperty);

  if (isLoading) return <DashboardSkeleton count={3} />;
  const properties = (data?.properties ?? []) as any[];

  if (properties.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="اقامتگاهی موجود نیست"
        description="هنوز هیچ اقامتگاهی در پلتفرم ثبت نشده است."
      />
    );
  }

  return (
    <PageCard
      title={`اقامتگاه‌های پلتفرم (${toPersianDigits(properties.length)})`}
      description="تأیید، تعلیق و مدیریت اقامتگاه‌ها"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border/60">
            <TableHead className="text-right">اقامتگاه</TableHead>
            <TableHead className="text-right">نوع</TableHead>
            <TableHead className="text-right">میزبان</TableHead>
            <TableHead className="text-right">شهر</TableHead>
            <TableHead className="text-right">امتیاز</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
            <TableHead className="text-right">اقدامات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((p: any) => {
            const meta = propertyTypeMeta[p.type];
            return (
              <TableRow key={p.id} className="border-border/60">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={p.images?.[0] ?? ""}
                        alt={p.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <button
                      className="truncate text-right font-medium hover:text-primary"
                      onClick={() => goProperty(p.id)}
                    >
                      {p.title}
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  {meta && (
                    <Badge variant="secondary" className="gap-1">
                      <meta.icon className="h-3 w-3" />
                      {meta.label}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs">{p.host?.name ?? "—"}</TableCell>
                <TableCell className="text-xs">{p.city}</TableCell>
                <TableCell>
                  <RatingStars rating={p.rating} size={12} showValue />
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {p.status !== "active" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                        onClick={() => toast.success("اقامتگاه تأیید و فعال شد")}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        تأیید
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
                        onClick={() => toast.success("اقامتگاه تعلیق شد")}
                      >
                        <Ban className="h-3.5 w-3.5" />
                        تعلیق
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </PageCard>
  );
}

/* ============================ ADMIN BOOKINGS ============================ */
function AdminBookingsTab() {
  const { data, isLoading } = useAdminAnalytics();
  const goProperty = useAppStore((s) => s.goProperty);

  if (isLoading) return <DashboardSkeleton count={3} />;
  const bookings = (data?.bookings ?? []) as any[];

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={BookMarked}
        title="رزروی موجود نیست"
        description="هنوز رزروی در پلتفرم ثبت نشده است."
      />
    );
  }

  return (
    <PageCard
      title={`رزروهای پلتفرم (${toPersianDigits(bookings.length)})`}
      description="همه رزروهای ثبت‌شده در سیستم"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border/60">
            <TableHead className="text-right">اقامتگاه</TableHead>
            <TableHead className="text-right">مسافر</TableHead>
            <TableHead className="text-right">ورود</TableHead>
            <TableHead className="text-right">خروج</TableHead>
            <TableHead className="text-right">مبلغ</TableHead>
            <TableHead className="text-right">پرداخت</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b: any) => (
            <TableRow key={b.id} className="border-border/60">
              <TableCell>
                <button
                  className="truncate text-right font-medium hover:text-primary"
                  onClick={() => goProperty(b.propertyId)}
                >
                  {b.property?.title ?? "—"}
                </button>
              </TableCell>
              <TableCell className="text-xs">{b.user?.name ?? "—"}</TableCell>
              <TableCell className="text-xs">{formatJalaliShort(b.checkIn)}</TableCell>
              <TableCell className="text-xs">{formatJalaliShort(b.checkOut)}</TableCell>
              <TableCell className="font-semibold ltr-nums">
                {formatTomanCompact(b.totalPrice)}
              </TableCell>
              <TableCell>
                <StatusBadge status={b.paymentStatus} />
              </TableCell>
              <TableCell>
                <StatusBadge status={b.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageCard>
  );
}

/* ============================ ADMIN REVIEWS ============================ */
function AdminReviewsTab() {
  const { data, isLoading } = useAdminAnalytics();
  const goProperty = useAppStore((s) => s.goProperty);

  if (isLoading) return <DashboardSkeleton count={3} />;
  const reviews = (data?.reviews ?? []) as any[];

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="نظری موجود نیست"
        description="هنوز نظری در پلتفرم ثبت نشده است."
      />
    );
  }

  return (
    <PageCard
      title={`نظرات کاربران (${toPersianDigits(reviews.length)})`}
      description="مدیریت و حذف نظرات ثبت‌شده"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border/60">
            <TableHead className="text-right">اقامتگاه</TableHead>
            <TableHead className="text-right">کاربر</TableHead>
            <TableHead className="text-right">امتیاز</TableHead>
            <TableHead className="text-right">نظر</TableHead>
            <TableHead className="text-right">تاریخ</TableHead>
            <TableHead className="text-right">اقدام</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((r: any) => (
            <TableRow key={r.id} className="border-border/60">
              <TableCell>
                <button
                  className="truncate text-right font-medium hover:text-primary"
                  onClick={() => goProperty(r.propertyId)}
                >
                  {r.property?.title ?? "—"}
                </button>
              </TableCell>
              <TableCell className="text-xs">{r.user?.name ?? "—"}</TableCell>
              <TableCell>
                <RatingStars rating={r.rating} size={12} showValue />
              </TableCell>
              <TableCell className="max-w-[280px]">
                <p className="truncate text-xs text-muted-foreground">{r.comment}</p>
              </TableCell>
              <TableCell className="text-xs">{formatJalaliShort(r.createdAt)}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف نظر</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا از حذف این نظر مطمئن هستید؟ این عملیات قابل بازگشت نیست.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>انصراف</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => toast.success("نظر حذف شد")}
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageCard>
  );
}

/* ============================ REPORTS ============================ */
function ReportsTab() {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading) return <DashboardSkeleton count={3} />;
  if (!data) {
    return (
      <EmptyState
        icon={FileText}
        title="گزارشی موجود نیست"
        description="داده کافی برای تولید گزارش وجود ندارد."
      />
    );
  }

  const stats = data.stats;
  const reportCards = [
    {
      title: "گزارش درآمد",
      desc: "خلاصه درآمد ماهانه و سالانه پلتفرم",
      icon: Wallet,
      tone: "emerald",
      meta: `درآمد کل: ${formatTomanCompact(stats.totalRevenue)}`,
    },
    {
      title: "گزارش رزروها",
      desc: "آمار رزروها، نرخ اشغال و ترندها",
      icon: BookMarked,
      tone: "gold",
      meta: `کل رزروها: ${toPersianDigits(stats.totalBookings)}`,
    },
    {
      title: "گزارش کاربران",
      desc: "رشد کاربران، نقش‌ها و فعالیت‌ها",
      icon: UsersIcon,
      tone: "amber",
      meta: `کل کاربران: ${toPersianDigits(stats.totalUsers)}`,
    },
    {
      title: "گزارش اقامتگاه‌ها",
      desc: "وضعیت اقامتگاه‌ها، تأیید و تعلیق",
      icon: Building2,
      tone: "rose",
      meta: `کل اقامتگاه‌ها: ${toPersianDigits(stats.totalProperties)}`,
    },
    {
      title: "گزارش نظرات",
      desc: "تحلیل نظرات و رضایت کاربران",
      icon: Star,
      tone: "emerald",
      meta: `میانگین امتیاز: ${toPersianDigits(stats.avgRating.toFixed(1))}`,
    },
    {
      title: "گزارش امنیت",
      desc: "نشست‌های فعال، رویدادهای امنیتی",
      icon: Shield,
      tone: "gold",
      meta: "بدون رویداد بحرانی",
    },
  ];

  const toneMap: Record<string, string> = {
    emerald: "bg-primary/10 text-primary",
    gold: "bg-gold/15 text-gold-foreground",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    rose: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  };

  const topProperties = (data.properties ?? [])
    .slice()
    .sort((a: any, b: any) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key metrics summary */}
      <PageCard
        title="خلاصه شاخص‌های کلیدی"
        description="نمای کلی از مهم‌ترین معیارهای پلتفرم"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Metric label="کاربران" value={toPersianDigits(stats.totalUsers)} icon={UsersIcon} />
          <Metric label="اقامتگاه‌ها" value={toPersianDigits(stats.totalProperties)} icon={Building2} />
          <Metric label="رزروها" value={toPersianDigits(stats.totalBookings)} icon={BookMarked} />
          <Metric label="نظرات" value={toPersianDigits(stats.totalReviews)} icon={Star} />
          <Metric label="درآمد" value={formatTomanCompact(stats.totalRevenue)} icon={Wallet} />
          <Metric label="امتیاز" value={toPersianDigits(stats.avgRating.toFixed(1))} icon={Crown} />
        </div>
      </PageCard>

      {/* Report cards grid */}
      <PageCard
        title="گزارش‌های قابل دانلود"
        description="گزارش‌های تفصیلی در قالب فایل"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportCards.map((r) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:shadow-luxury"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneMap[r.tone]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() =>
                      toast.success("دانلود گزارش آغاز شد", {
                        description: `گزارش «${r.title}» آماده دانلود است.`,
                      })
                    }
                  >
                    <Download className="h-3.5 w-3.5" />
                    دانلود
                  </Button>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
                <div className="mt-auto border-t border-border/60 pt-2 text-xs">
                  <span className="text-muted-foreground">{r.meta}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </PageCard>

      {/* Top performing properties */}
      <PageCard
        title="برترین اقامتگاه‌ها"
        description="پربازدیدترین و بالاترین امتیاز"
      >
        <div className="space-y-3">
          {topProperties.map((p: any, idx: number) => {
            const meta = propertyTypeMeta[p.type];
            return (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    idx === 0
                      ? "bg-gold/20 text-gold-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {toPersianDigits(idx + 1)}
                </span>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={p.images?.[0] ?? ""}
                    alt={p.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold">{p.title}</h4>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    {meta && <meta.icon className="h-3 w-3" />}
                    {p.city}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">امتیاز</p>
                    <p className="text-sm font-bold ltr-nums">
                      {toPersianDigits(p.rating.toFixed(1))}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">قیمت/شب</p>
                    <p className="text-sm font-bold ltr-nums">
                      {formatTomanCompact(p.pricePerNight)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageCard>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
      <Icon className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
      <p className="text-base font-bold ltr-nums sm:text-lg">{value}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
