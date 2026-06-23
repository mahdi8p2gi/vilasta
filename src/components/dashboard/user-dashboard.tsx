"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import {
  User as UserIcon,
  CalendarCheck,
  Heart,
  Bell,
  Star,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Trash2,
  CheckCheck,
  Camera,
  Lock,
  Smartphone,
  Monitor,
  LogOut,
  ChevronLeft,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useAppStore, type DashboardTab } from "@/store/app-store";
import {
  useBookings,
  useFavorites,
  useNotifications,
  useUploadImage,
  useMarkAllNotificationsRead,
} from "@/hooks/use-api";
import {
  formatToman,
  formatTomanCompact,
  formatJalali,
  formatJalaliShort,
  toPersianDigits,
  relativeTime,
  ratingLabel,
  pluralFa,
} from "@/lib/persian";
import { propertyTypeMeta } from "@/config/site";
import {
  DashboardShell,
  LoginPrompt,
  PageCard,
  StatusBadge,
  DashboardSkeleton,
  type NavItem,
} from "@/components/dashboard/dashboard-shell";
import { PropertyCard } from "@/components/shared/property-card";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
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
  { tab: "profile", label: "پروفایل", icon: UserIcon },
  { tab: "bookings", label: "رزروهای من", icon: CalendarCheck },
  { tab: "favorites", label: "علاقه‌مندی‌ها", icon: Heart },
  { tab: "notifications", label: "اعلان‌ها", icon: Bell },
  { tab: "reviews", label: "نظرات من", icon: Star },
  { tab: "security", label: "امنیت", icon: Shield },
];

const profileSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ نویسه باشد"),
  email: z.string().email("ایمیل نامعتبر است"),
  phone: z.string().min(10, "شماره تلفن نامعتبر است").or(z.literal("")),
  bio: z.string().max(300, "حداکثر ۳۰۰ نویسه").or(z.literal("")),
});
type ProfileForm = z.infer<typeof profileSchema>;

const securitySchema = z
  .object({
    currentPassword: z.string().min(6, "حداقل ۶ نویسه"),
    newPassword: z.string().min(8, "رمز جدید باید حداقل ۸ نویسه باشد"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "رمزها مطابقت ندارند",
    path: ["confirmPassword"],
  });
type SecurityForm = z.infer<typeof securitySchema>;

const notifIconMap: Record<string, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};
const notifColorMap: Record<string, string> = {
  info: "bg-primary/10 text-primary",
  success: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  error: "bg-destructive/15 text-destructive",
};

export function UserDashboard() {
  const user = useAppStore((s) => s.user);
  const dashboardTab = useAppStore((s) => s.dashboardTab);
  const goDashboard = useAppStore((s) => s.goDashboard);

  // Ensure the active tab is valid for this dashboard; otherwise default to profile.
  const validTabs: DashboardTab[] = ["profile", "bookings", "favorites", "notifications", "reviews", "security"];
  const activeTab: DashboardTab = validTabs.includes(dashboardTab)
    ? dashboardTab
    : "profile";

  if (!user) {
    return <LoginPrompt />;
  }

  const setTab = (t: DashboardTab) => goDashboard(t);

  const tabMeta: Record<DashboardTab, { title: string; subtitle?: string }> = {
    profile: { title: "پروفایل من", subtitle: "اطلاعات حساب کاربری خود را مدیریت کنید" },
    bookings: { title: "رزروهای من", subtitle: "تاریخچه و وضعیت رزروهای شما" },
    favorites: { title: "علاقه‌مندی‌ها", subtitle: "اقامتگاه‌های ذخیره‌شده شما" },
    notifications: { title: "اعلان‌ها", subtitle: "آخرین اعلان‌های سیستم" },
    reviews: { title: "نظرات من", subtitle: "نظراتی که ثبت کرده‌اید" },
    security: { title: "امنیت حساب", subtitle: "رمز عبور و دسترسی‌ها" },
    // (host/admin tabs — not shown but required by type)
    properties: { title: "اقامتگاه‌ها" },
    "add-property": { title: "افزودن اقامتگاه" },
    revenue: { title: "درآمد" },
    calendar: { title: "تقویم" },
    users: { title: "کاربران" },
    analytics: { title: "تحلیل" },
    reports: { title: "گزارش‌ها" },
  };

  return (
    <DashboardShell
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setTab}
      role="customer"
      title={tabMeta[activeTab].title}
      subtitle={tabMeta[activeTab].subtitle}
    >
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "bookings" && <BookingsTab />}
      {activeTab === "favorites" && <FavoritesTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "reviews" && <ReviewsTab />}
      {activeTab === "security" && <SecurityTab />}
    </DashboardShell>
  );
}

/* ============================ PROFILE ============================ */
function ProfileTab() {
  const user = useAppStore((s) => s.user)!;
  const setUser = useAppStore((s) => s.setUser);
  const uploadImage = useUploadImage();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onAvatarClick = () => fileInputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم تصویر نباید بیشتر از ۲ مگابایت باشد");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        await uploadImage.mutateAsync({ dataUrl, userId: user.id });
        setUser({ ...user, avatar: dataUrl });
        toast.success("تصویر پروفایل با موفقیت به‌روزرسانی شد");
      } catch (err: any) {
        toast.error(err.message || "خطا در آپلود تصویر");
      }
    };
    reader.readAsDataURL(file);
  };

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email,
      phone: user.phone ?? "",
      bio: user.bio ?? "",
    },
  });

  const onSubmit = (data: ProfileForm) => {
    toast.success("اطلاعات پروفایل با موفقیت ذخیره شد", {
      description: `خوش آمدید، ${data.name}`,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Avatar / summary card */}
      <PageCard className="lg:col-span-1">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <Avatar className="h-28 w-28 ring-4 ring-primary/15">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name ?? "avatar"} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-3xl font-bold text-primary">
                {user.name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-1 left-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-luxury transition-transform hover:scale-110"
              aria-label="تغییر تصویر"
              onClick={onAvatarClick}
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold">{user.name ?? "کاربر"}</h3>
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              عضو از {formatJalaliShort(user.createdAt)}
            </Badge>
            {user.phone && (
              <Badge variant="outline" className="gap-1">
                <Phone className="h-3 w-3" />
                {toPersianDigits(user.phone)}
              </Badge>
            )}
          </div>
        </div>
        <Separator className="my-5" />
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="رزروها" value="—" />
          <Stat label="نظرات" value="—" />
          <Stat label="علاقه‌مندی" value="—" />
        </div>
      </PageCard>

      {/* Edit form */}
      <PageCard
        title="ویرایش اطلاعات"
        description="اطلاعات حساب کاربری خود را به‌روز کنید"
        className="lg:col-span-2"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام و نام خانوادگی</FormLabel>
                    <FormControl>
                      <Input placeholder="مثلاً علی رضایی" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        dir="ltr"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره تلفن</FormLabel>
                    <FormControl>
                      <Input
                        dir="ltr"
                        placeholder="0912xxxxxxx"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>اختیاری</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>شهر</FormLabel>
                <Input placeholder="مثلاً تهران" disabled defaultValue="" />
                <FormDescription>به‌زودی فعال می‌شود</FormDescription>
              </FormItem>
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>درباره من</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="خودتان را کوتاه معرفی کنید…"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {toPersianDigits((field.value ?? "").length)} / ۳۰۰ نویسه
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-4">
              <Button type="button" variant="ghost" onClick={() => form.reset()}>
                بازنشانی
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                ذخیره تغییرات
              </Button>
            </div>
          </form>
        </Form>
      </PageCard>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 px-2 py-3">
      <p className="text-lg font-bold ltr-nums">{value}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

/* ============================ BOOKINGS ============================ */
function BookingsTab() {
  const user = useAppStore((s) => s.user)!;
  const goProperty = useAppStore((s) => s.goProperty);
  const { data, isLoading } = useBookings(user.id);

  if (isLoading) return <DashboardSkeleton count={3} />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="هنوز رزروی ندارید"
        description="اقامتگاه‌های لوکس را کاوش کنید و اولین رزرو خود را انجام دهید."
        action={<Button onClick={() => useAppStore.getState().setView("listing")}>کاوش اقامتگاه‌ها</Button>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pluralFa(data.length, "رزرو", "رزرو")} ثبت‌شده
        </p>
      </div>
      {data.map((b, i) => {
        const property = b.property;
        const meta = property ? propertyTypeMeta[property.type] : null;
        return (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
          >
            <Card className="overflow-hidden py-0">
              <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
                {/* Thumbnail */}
                <div
                  className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-muted sm:aspect-auto"
                  onClick={() => property && goProperty(property.id)}
                >
                  {property && (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      sizes="200px"
                      className="object-cover transition-transform hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Body */}
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {meta && (
                          <Badge variant="secondary" className="gap-1">
                            <meta.icon className="h-3 w-3" />
                            {meta.label}
                          </Badge>
                        )}
                        <StatusBadge status={b.status} />
                      </div>
                      <h3 className="truncate text-base font-semibold sm:text-lg">
                        {property?.title ?? "اقامتگاه"}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {property?.city}، {property?.province}
                      </p>
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="text-xs text-muted-foreground">مبلغ کل</p>
                      <p className="text-base font-bold ltr-nums">
                        {formatTomanCompact(b.totalPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs sm:grid-cols-4">
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground">تاریخ ورود</p>
                      <p className="font-medium">{formatJalaliShort(b.checkIn)}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground">تاریخ خروج</p>
                      <p className="font-medium">{formatJalaliShort(b.checkOut)}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground">مدت اقامت</p>
                      <p className="font-medium">{toPersianDigits(b.nights)} شب</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground">مسافران</p>
                      <p className="font-medium">
                        <Users className="ml-1 inline h-3 w-3" />
                        {toPersianDigits(b.guests)} نفر
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => property && goProperty(property.id)}
                    >
                      مشاهده جزئیات
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    {b.status !== "cancelled" && b.status !== "completed" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Trash2 className="h-3.5 w-3.5" />
                            کنسلی
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>کنسلی رزرو</AlertDialogTitle>
                            <AlertDialogDescription>
                              آیا از کنسلی این رزرو مطمئن هستید؟ این عملیات قابل بازگشت نیست.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() =>
                                toast.success("درخواست کنسلی ثبت شد", {
                                  description: "ظرف ۲۴ ساعت مبلغ بازگردانده می‌شود.",
                                })
                              }
                            >
                              تأیید کنسلی
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================ FAVORITES ============================ */
function FavoritesTab() {
  const user = useAppStore((s) => s.user)!;
  const { data, isLoading } = useFavorites(user.id);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] animate-shimmer rounded-2xl"
          />
        ))}
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="لیست علاقه‌مندی‌ها خالی است"
        description="اقامتگاه‌های مورد علاقه خود را برای دسترسی سریع‌تر ذخیره کنید."
        action={<Button onClick={() => useAppStore.getState().setView("listing")}>کاوش اقامتگاه‌ها</Button>}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((p, i) => (
        <PropertyCard key={p.id} property={p} index={i} />
      ))}
    </div>
  );
}

/* ============================ NOTIFICATIONS ============================ */
function NotificationsTab() {
  const user = useAppStore((s) => s.user)!;
  const { data, isLoading } = useNotifications(user.id);
  const markAllRead = useMarkAllNotificationsRead();

  const onMarkAll = async () => {
    try {
      await markAllRead.mutateAsync(user.id);
      toast.success("همه اعلان‌ها به‌عنوان خوانده‌شده علامت‌گذاری شدند");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) return <DashboardSkeleton count={3} />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="اعلان جدیدی ندارید"
        description="اعلان‌های رزرو، تخفیف و اخبار پلتفرم در اینجا نمایش داده می‌شوند."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pluralFa(data.length, "اعلان", "اعلان")}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onMarkAll}
        >
          <CheckCheck className="h-4 w-4" />
          علامت‌گذاری همه به‌عنوان خوانده شده
        </Button>
      </div>

      {data.map((n, i) => {
        const Icon = notifIconMap[n.type] ?? Info;
        return (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
            className={`relative flex gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:bg-accent/30 ${
              !n.read ? "ring-1 ring-primary/20" : ""
            }`}
          >
            {!n.read && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            )}
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                notifColorMap[n.type]
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{n.title}</p>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {relativeTime(n.createdAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{n.message}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================ REVIEWS ============================ */
function ReviewsTab() {
  const user = useAppStore((s) => s.user)!;
  const { data: bookings, isLoading } = useBookings(user.id);
  const goProperty = useAppStore((s) => s.goProperty);

  if (isLoading) return <DashboardSkeleton count={2} />;

  // Mock: reviews the user has written = completed bookings
  const reviewed = (bookings ?? []).filter((b) => b.status === "completed");

  if (reviewed.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="نظری ثبت نکرده‌اید"
        description="پس از تکمیل اقامت در اقامتگاه‌ها، می‌توانید تجربه خود را ثبت کنید."
      />
    );
  }

  return (
    <div className="space-y-3">
      {reviewed.map((b, i) => {
        const property = b.property;
        const meta = property ? propertyTypeMeta[property.type] : null;
        const rating = 4 + ((i * 7) % 10) / 10;
        const comments = [
          "اقامتگاه فوق‌العاده‌ای بود، تمیزی عالی و میزبان خوش‌اخلاق.",
          "تجربه‌ای متفاوت و راحت داشتیم. حتماً دوباره برمی‌گردیم.",
          "دسترسی خوب، امکانات کامل و قیمت مناسب. پیشنهاد می‌کنم.",
          "محیط آرام و دنج، مناسب استراحت خانوادگی.",
        ];
        return (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
          >
            <Card className="gap-3">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  {property && (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        sizes="56px"
                        className="cursor-pointer object-cover"
                        onClick={() => goProperty(property.id)}
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3
                          className="cursor-pointer truncate font-semibold hover:text-primary"
                          onClick={() => property && goProperty(property.id)}
                        >
                          {property?.title}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          {meta && <meta.icon className="h-3 w-3" />}
                          {property?.city}
                        </p>
                      </div>
                      <RatingStars rating={rating} size={14} showValue />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {comments[i % comments.length]}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        {formatJalali(b.checkOut)}
                      </span>
                      <Badge variant="outline" className="gap-1 text-[10px]">
                        {ratingLabel(rating)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================ SECURITY ============================ */
function SecurityTab() {
  const [twoFA, setTwoFA] = React.useState(false);

  const form = useForm<SecurityForm>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (_data: SecurityForm) => {
    toast.success("رمز عبور با موفقیت تغییر کرد");
    form.reset();
  };

  const [sessions, setSessions] = React.useState([
    { id: 1, device: "Chrome — ویندوز", ip: "۵.۱۲۳.۴۵.۶۷", location: "تهران", current: true, icon: Monitor },
    { id: 2, device: "Safari — آیفون", ip: "۵.۱۲۳.۴۵.۸۹", location: "تهران", current: false, icon: Smartphone },
    { id: 3, device: "Chrome — اندروید", ip: "۲.۱۹۸.۱۰.۵", location: "اصفهان", current: false, icon: Smartphone },
  ]);

  const onCloseSession = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success("نشست بسته شد");
  };

  return (
    <div className="space-y-6">
      <PageCard
        title="تغییر رمز عبور"
        description="برای امنیت بیشتر، رمز عبور خود را به‌طور منظم تغییر دهید"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز فعلی</FormLabel>
                    <FormControl>
                      <Input type="password" dir="ltr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز جدید</FormLabel>
                    <FormControl>
                      <Input type="password" dir="ltr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تکرار رمز جدید</FormLabel>
                    <FormControl>
                      <Input type="password" dir="ltr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="gap-1.5">
                <Lock className="h-4 w-4" />
                به‌روزرسانی رمز
              </Button>
            </div>
          </form>
        </Form>
      </PageCard>

      <PageCard
        title="احراز هویت دو مرحله‌ای"
        description="لایه امنیتی اضافه برای محافظت از حساب شما"
      >
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium">تأیید دو مرحله‌ای پیامکی</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                هنگام ورود، کدی به شماره موبایل شما ارسال می‌شود.
              </p>
            </div>
          </div>
          <Switch checked={twoFA} onCheckedChange={(v) => {
            setTwoFA(v);
            toast.success(v ? "احراز هویت دو مرحله‌ای فعال شد" : "احراز هویت دو مرحله‌ای غیرفعال شد");
          }} />
        </div>
      </PageCard>

      <PageCard
        title="نشست‌های فعال"
        description="دستگاه‌هایی که در حال حاضر وارد حساب شما هستند"
      >
        <div className="space-y-2">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{s.device}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {s.ip} • {s.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {s.current ? (
                    <Badge variant="outline" className="border-transparent bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 text-[10px]">
                      این دستگاه
                    </Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onCloseSession(s.id)}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      خروج
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PageCard>

      <PageCard
        title="منطقه خطر"
        description="اقدامات حساس و غیرقابل بازگشت"
        className="border-destructive/40 bg-destructive/5"
      >
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium text-destructive">حذف حساب کاربری</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              تمام اطلاعات شما including رزروها، نظرات و علاقه‌مندی‌ها حذف خواهد شد.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-1.5">
                <Trash2 className="h-4 w-4" />
                حذف حساب
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>حذف دائمی حساب</AlertDialogTitle>
                <AlertDialogDescription>
                  این عملیات غیرقابل بازگشت است. آیا از حذف حساب خود مطمئن هستید؟
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => {
                    toast.success("درخواست حذف حساب ثبت شد", {
                      description: "ظرف ۷۲ ساعت حساب شما حذف خواهد شد.",
                    });
                    useAppStore.getState().logout();
                  }}
                >
                  حذف نهایی
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageCard>
    </div>
  );
}
