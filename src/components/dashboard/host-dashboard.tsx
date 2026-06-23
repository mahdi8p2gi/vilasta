"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import {
  LayoutGrid,
  PlusCircle,
  TrendingUp,
  CalendarRange,
  BookMarked,
  Building2,
  Pencil,
  Trash2,
  Eye,
  Star,
  Users,
  BedDouble,
  MapPin,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Home as HomeIcon,
  type LucideIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppStore, type DashboardTab } from "@/store/app-store";
import {
  useHostProperties,
  useHostAnalytics,
  useDeleteProperty,
} from "@/hooks/use-api";
import {
  formatToman,
  formatTomanCompact,
  formatJalaliShort,
  toPersianDigits,
  ratingLabel,
  pluralFa,
} from "@/lib/persian";
import { propertyTypeMeta, amenityMeta } from "@/config/site";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  { tab: "properties", label: "اقامتگاه‌های من", icon: LayoutGrid },
  { tab: "add-property", label: "افزودن اقامتگاه", icon: PlusCircle },
  { tab: "revenue", label: "درآمد و تحلیل", icon: TrendingUp },
  { tab: "calendar", label: "تقویم", icon: CalendarRange },
  { tab: "bookings", label: "رزروهای مسافران", icon: BookMarked },
];

const propertySchema = z.object({
  title: z.string().min(5, "عنوان باید حداقل ۵ نویسه باشد"),
  type: z.string().min(1, "نوع اقامتگاه را انتخاب کنید"),
  city: z.string().min(2, "شهر را وارد کنید"),
  province: z.string().min(2, "استان را وارد کنید"),
  address: z.string().min(5, "آدرس را وارد کنید"),
  pricePerNight: z.coerce.number().min(100000, "حداقل ۱۰۰٬۰۰۰ تومان"),
  maxGuests: z.coerce.number().min(1, "حداقل ۱ نفر"),
  bedrooms: z.coerce.number().min(0),
  beds: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  size: z.coerce.number().min(0).optional(),
  description: z.string().min(20, "حداقل ۲۰ نویسه توضیح بنویسید"),
});
type PropertyForm = z.infer<typeof propertySchema>;

export function HostDashboard() {
  const user = useAppStore((s) => s.user);
  const dashboardTab = useAppStore((s) => s.dashboardTab);
  const goDashboard = useAppStore((s) => s.goDashboard);

  // Ensure the active tab is valid for this dashboard; otherwise default to first.
  const validTabs: DashboardTab[] = ["properties", "add-property", "revenue", "calendar", "bookings"];
  const activeTab: DashboardTab = validTabs.includes(dashboardTab)
    ? dashboardTab
    : "properties";

  if (!user) return <LoginPrompt />;
  if (user.role !== "host" && user.role !== "admin") {
    return (
      <LoginPrompt
        title="دسترسی مخصوص میزبانان"
        description="برای مشاهده این بخش باید حساب میزبان داشته باشید."
      />
    );
  }

  const setTab = (t: DashboardTab) => goDashboard(t);

  const tabMeta: Record<DashboardTab, { title: string; subtitle?: string }> = {
    properties: { title: "اقامتگاه‌های من", subtitle: "مدیریت اقامتگاه‌های شما" },
    "add-property": { title: "افزودن اقامتگاه جدید", subtitle: "اقامتگاه خود را ثبت کنید" },
    revenue: { title: "درآمد و تحلیل", subtitle: "گزارش مالی و آمار عملکرد" },
    calendar: { title: "تقویم رزروها", subtitle: "نمای ماهانه از رزروهای شما" },
    bookings: { title: "رزروهای مسافران", subtitle: "مدیریت رزروهای دریافتی" },
    profile: { title: "پروفایل" },
    favorites: { title: "علاقه‌مندی‌ها" },
    notifications: { title: "اعلان‌ها" },
    reviews: { title: "نظرات" },
    security: { title: "امنیت" },
    users: { title: "کاربران" },
    analytics: { title: "تحلیل" },
    reports: { title: "گزارش‌ها" },
  };

  return (
    <DashboardShell
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setTab}
      role="host"
      title={tabMeta[activeTab].title}
      subtitle={tabMeta[activeTab].subtitle}
      headerActions={
        activeTab === "properties" ? (
          <Button
            onClick={() => goDashboard("add-property")}
            className="hidden gap-1.5 sm:inline-flex"
          >
            <PlusCircle className="h-4 w-4" />
            افزودن اقامتگاه
          </Button>
        ) : null
      }
    >
      {activeTab === "properties" && <PropertiesTab />}
      {activeTab === "add-property" && <AddPropertyTab />}
      {activeTab === "revenue" && <RevenueTab />}
      {activeTab === "calendar" && <CalendarTab />}
      {activeTab === "bookings" && <HostBookingsTab />}
    </DashboardShell>
  );
}

/* ============================ PROPERTIES ============================ */
function PropertiesTab() {
  const user = useAppStore((s) => s.user)!;
  const goProperty = useAppStore((s) => s.goProperty);
  const goDashboard = useAppStore((s) => s.goDashboard);
  const { data, isLoading } = useHostProperties(user.id);
  const deleteProperty = useDeleteProperty();

  const onDelete = (id: string) => {
    try {
      deleteProperty.mutateAsync(id).then(() => {
        toast.success("اقامتگاه حذف شد");
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) return <DashboardSkeleton count={3} />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="هنوز اقامتگاهی ثبت نکرده‌اید"
        description="اولین اقامتگاه خود را ثبت کنید و درآمد کسب کنید."
        action={
          <Button onClick={() => goDashboard("add-property")} className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            افزودن اقامتگاه
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pluralFa(data.length, "اقامتگاه", "اقامتگاه")}
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.map((p, i) => {
          const meta = propertyTypeMeta[p.type];
          const TypeIcon = meta?.icon;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
            >
              <Card className="overflow-hidden py-0">
                <div className="grid gap-0 sm:grid-cols-[160px_1fr]">
                  <div
                    className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-muted sm:aspect-auto"
                    onClick={() => goProperty(p.id)}
                  >
                    <Image
                      src={p.images[0]}
                      alt={p.title}
                      fill
                      sizes="160px"
                      className="object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
                      <StatusBadge status={p.status} />
                      {TypeIcon && (
                        <span className="flex items-center gap-1 rounded-full glass px-2 py-0.5 text-[10px]">
                          <TypeIcon className="h-3 w-3 text-emerald-brand" />
                          {meta.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1">
                        <h3
                          className="cursor-pointer truncate font-semibold hover:text-primary"
                          onClick={() => goProperty(p.id)}
                        >
                          {p.title}
                        </h3>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {p.city}، {p.province}
                        </p>
                      </div>
                      <RatingStars rating={p.rating} size={12} showValue />
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-xs">
                      <MiniStat
                        icon={BookMarked}
                        label="رزرو"
                        value={toPersianDigits(p.reviewCount)}
                      />
                      <MiniStat
                        icon={BedDouble}
                        label="خواب"
                        value={toPersianDigits(p.bedrooms)}
                      />
                      <MiniStat
                        icon={Users}
                        label="مسافر"
                        value={toPersianDigits(p.maxGuests)}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground">قیمت هر شب</p>
                        <p className="text-sm font-bold ltr-nums">
                          {formatTomanCompact(p.pricePerNight)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => goProperty(p.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          مشاهده
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            toast.info("برای ویرایش، فرم افزودن اقامتگاه را تکمیل کنید");
                            goDashboard("add-property");
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
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
                              <AlertDialogTitle>حذف اقامتگاه</AlertDialogTitle>
                              <AlertDialogDescription>
                                آیا از حذف «{p.title}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>انصراف</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={() => onDelete(p.id)}
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-medium ltr-nums">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

/* ============================ ADD PROPERTY ============================ */
function AddPropertyTab() {
  const user = useAppStore((s) => s.user)!;
  const goDashboard = useAppStore((s) => s.goDashboard);
  const utils = useQueryUtils();

  const [amenities, setAmenities] = React.useState<string[]>([]);
  const [imageUrls, setImageUrls] = React.useState<string[]>([""]);
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      type: "",
      city: "",
      province: "",
      address: "",
      pricePerNight: undefined,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      size: undefined,
      description: "",
    },
  });

  const toggleAmenity = (key: string) => {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  };

  const onSubmit = async (values: PropertyForm) => {
    if (amenities.length === 0) {
      toast.error("حداقل یک امکانت انتخاب کنید");
      return;
    }
    const finalImages = imageUrls.filter((u) => u.trim().length > 0);
    if (finalImages.length === 0) {
      toast.error("حداقل یک تصویر وارد کنید");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/properties/host", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostId: user.id,
          ...values,
          amenities,
          images: finalImages,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "خطا در ثبت اقامتگاه");
      }
      await utils.invalidateQueries({ queryKey: ["properties", "host", user.id] });
      toast.success("اقامتگاه با موفقیت ثبت شد", {
        description: "پس از تأیید مدیر فعال خواهد شد.",
      });
      goDashboard("properties");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطای ناشناخته");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <PageCard
          title="اطلاعات اصلی"
          description="جزئیات اولیه اقامتگاه خود را وارد کنید"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان اقامتگاه</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="مثلاً ویلا لوکس دنج با استخر در کیش"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع اقامتگاه</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(propertyTypeMeta).map(([key, m]) => (
                          <SelectItem key={key} value={key}>
                            <span className="flex items-center gap-2">
                              <m.icon className="h-4 w-4 text-emerald-brand" />
                              {m.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePerNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت هر شب (تومان)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        dir="ltr"
                        placeholder="2000000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شهر</FormLabel>
                    <FormControl>
                      <Input placeholder="کیش" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>استان</FormLabel>
                    <FormControl>
                      <Input placeholder="هرمزگان" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>متراژ (م²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        dir="ltr"
                        placeholder="۱۲۰"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>اختیاری</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>آدرس کامل</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="خیابان، کوچه، پلاک و…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </PageCard>

        {/* Capacity */}
        <PageCard
          title="ظرفیت و اتاق‌ها"
          description="تعداد مسافران و فضاهای اقامتگاه"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="maxGuests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>حداکثر مسافر</FormLabel>
                  <FormControl>
                    <Input type="number" dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعداد اتاق خواب</FormLabel>
                  <FormControl>
                    <Input type="number" dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعداد تخت</FormLabel>
                  <FormControl>
                    <Input type="number" dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تعداد سرویس بهداشتی</FormLabel>
                  <FormControl>
                    <Input type="number" dir="ltr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </PageCard>

        {/* Description */}
        <PageCard
          title="توضیحات"
          description="معرفی کامل اقامتگاه برای مسافران"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="ویژگی‌ها، نزدیکی به جاذبه‌ها، فضای داخلی و… را شرح دهید."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {toPersianDigits((field.value ?? "").length)} نویسه
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </PageCard>

        {/* Amenities */}
        <PageCard
          title="امکانات و تسهیلات"
          description="امکاناتی که اقامتگاه شما ارائه می‌دهد"
          action={
            <Badge variant="outline" className="gap-1">
              {toPersianDigits(amenities.length)} انتخاب شده
            </Badge>
          }
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Object.entries(amenityMeta).map(([key, m]) => {
              const checked = amenities.includes(key);
              return (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-sm transition-all ${
                    checked
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/60 hover:border-primary/40 hover:bg-accent/30"
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleAmenity(key)}
                  />
                  <span className="font-medium">{m.label}</span>
                </label>
              );
            })}
          </div>
        </PageCard>

        {/* Images */}
        <PageCard
          title="تصاویر اقامتگاه"
          description="آدرس URL تصاویر را وارد کنید"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setImageUrls((p) => [...p, ""])}
            >
              <PlusCircle className="h-4 w-4" />
              افزودن تصویر
            </Button>
          }
        >
          <div className="space-y-3">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {url ? (
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Input
                  dir="ltr"
                  placeholder="https://images.unsplash.com/..."
                  value={url}
                  onChange={(e) =>
                    setImageUrls((p) =>
                      p.map((u, i) => (i === idx ? e.target.value : u))
                    )
                  }
                />
                {imageUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() =>
                      setImageUrls((p) => p.filter((_, i) => i !== idx))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              برای بهترین نمایش، حداقل ۳ تصویر با کیفیت بالا اضافه کنید.
            </p>
          </div>
        </PageCard>

        {/* Submit */}
        <div className="sticky bottom-4 flex items-center justify-end gap-2 rounded-2xl border border-border/60 bg-card/95 p-3 shadow-luxury backdrop-blur">
          <Button
            type="button"
            variant="ghost"
            onClick={() => goDashboard("properties")}
          >
            انصراف
          </Button>
          <Button type="submit" disabled={submitting} className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            {submitting ? "در حال ثبت…" : "ثبت اقامتگاه"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

/* ============================ REVENUE ============================ */
function RevenueTab() {
  const user = useAppStore((s) => s.user)!;
  const { data, isLoading } = useHostAnalytics(user.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-shimmer rounded-2xl" />
          ))}
        </div>
        <div className="h-72 animate-shimmer rounded-2xl" />
      </div>
    );
  }
  if (!data || !data.stats) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="داده تحلیلی در دسترس نیست"
        description="پس از ثبت اقامتگاه و دریافت اولین رزرو، تحلیل‌ها نمایش داده می‌شوند."
      />
    );
  }

  const stats = data.stats;
  const revenueSeries = (data.revenue ?? []).map((d: any) => ({
    ...d,
    label: toPersianDigits(d.label),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="درآمد کل"
          value={formatTomanCompact(stats.totalRevenue)}
          trend="up"
          trendLabel="در کل دوره"
          tone="emerald"
        />
        <StatCard
          icon={BookMarked}
          label="کل رزروها"
          value={toPersianDigits(stats.totalBookings)}
          trend={stats.pending > 0 ? "neutral" : "up"}
          trendLabel={`${toPersianDigits(stats.pending)} در انتظار`}
          tone="gold"
        />
        <StatCard
          icon={HomeIcon}
          label="اقامتگاه‌های فعال"
          value={toPersianDigits(stats.totalProperties)}
          trend="neutral"
          trendLabel="همه فعال"
          tone="amber"
        />
        <StatCard
          icon={Star}
          label="میانگین امتیاز"
          value={toPersianDigits(stats.avgRating.toFixed(1))}
          trend="up"
          trendLabel={ratingLabel(stats.avgRating)}
          tone="rose"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PageCard
          title="روند درآمد"
          description="درآمد ماهانه ۸ ماه اخیر"
        >
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueSeries}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
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
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                  tickFormatter={(v) => toPersianDigits(formatTomanCompact(Number(v)).replace(/ تومان$/, ""))}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    direction: "rtl",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                  formatter={(value: any) => [formatToman(Number(value)), "درآمد"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#revGradient)"
                  dot={{ fill: "var(--primary)", r: 3 }}
                  activeDot={{ r: 5, fill: "var(--gold)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PageCard>

        <PageCard
          title="تعداد رزروها"
          description="رزروهای ماهانه ۸ ماه اخیر"
        >
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueSeries}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
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
                  formatter={(value: any) => [toPersianDigits(value), "رزرو"]}
                />
                <Bar
                  dataKey="bookings"
                  fill="var(--gold)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PageCard>
      </div>

      {/* Top properties table */}
      <PageCard
        title="عملکرد اقامتگاه‌ها"
        description="برترین اقامتگاه‌های شما بر اساس درآمد"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border/60">
              <TableHead className="text-right">اقامتگاه</TableHead>
              <TableHead className="text-right">رزروها</TableHead>
              <TableHead className="text-right">درآمد</TableHead>
              <TableHead className="text-right">امتیاز</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data.propertyStats ?? []).map((p: any) => (
              <TableRow key={p.id} className="border-border/60">
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="ltr-nums">
                    {toPersianDigits(p.bookings)}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold ltr-nums">
                  {formatTomanCompact(p.revenue)}
                </TableCell>
                <TableCell>
                  <RatingStars rating={p.rating} size={12} showValue />
                </TableCell>
              </TableRow>
            ))}
            {(data.propertyStats ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                  هنوز داده‌ای موجود نیست
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PageCard>
    </div>
  );
}

/* ============================ CALENDAR ============================ */
function CalendarTab() {
  const user = useAppStore((s) => s.user)!;
  const { data: properties } = useHostProperties(user.id);
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Gather bookings from all properties (use first 4 properties for display)
  const visibleProps = (properties ?? []).slice(0, 4);

  // Build a set of "booked" days for current month — deterministic mock from property data
  const bookedDays = React.useMemo(() => {
    const days = new Set<number>();
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    visibleProps.forEach((p, pIdx) => {
      // Deterministic seed from property id
      let seed = 0;
      for (let i = 0; i < p.id.length; i++) seed = (seed * 31 + p.id.charCodeAt(i)) >>> 0;
      const rangeStart = 1 + ((seed + pIdx * 3) % Math.max(1, daysInMonth - 6));
      const rangeLen = 2 + (seed % 5);
      for (let i = 0; i < rangeLen && rangeStart + i <= daysInMonth; i++) {
        days.add(rangeStart + i);
      }
    });
    return days;
  }, [visibleProps, currentMonth]);

  const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
  const jalaliMonthLabel = new Intl.DateTimeFormat("fa-IR", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  // JS getDay: 0=Sun, 6=Sat. Persian week starts Saturday.
  const startOffset = (firstDay.getDay() + 1) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const goPrev = () =>
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNext = () =>
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToday = () => {
    const t = new Date();
    setCurrentMonth(new Date(t.getFullYear(), t.getMonth(), 1));
  };

  return (
    <div className="space-y-4">
      <PageCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{jalaliMonthLabel}</h3>
            <p className="text-xs text-muted-foreground">
              نمایش رزروهای {toPersianDigits(visibleProps.length)} اقامتگاه
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={goToday}>
              امروز
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={goPrev}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={goNext}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-3 flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-primary/80" />
            روزهای رزروشده
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-border bg-muted" />
            روزهای آزاد
          </span>
        </div>

        {/* Calendar grid */}
        <div className="overflow-x-auto">
          <div
            className="grid min-w-[600px] grid-cols-7 gap-1"
            dir="rtl"
          >
            {weekDays.map((d) => (
              <div
                key={d}
                className="rounded-md bg-muted/60 py-2 text-center text-xs font-semibold text-muted-foreground"
              >
                {d}
              </div>
            ))}
            {cells.map((day, idx) => {
              const booked = day !== null && bookedDays.has(day);
              const today =
                day !== null &&
                new Date().toDateString() ===
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  ).toDateString();
              return (
                <div
                  key={idx}
                  className={`relative flex aspect-square min-h-[60px] flex-col items-center justify-center rounded-lg border p-1 text-sm transition-colors ${
                    day === null
                      ? "border-transparent bg-transparent"
                      : booked
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border/60 bg-card hover:bg-accent/30"
                  } ${today ? "ring-2 ring-gold" : ""}`}
                >
                  {day !== null && (
                    <>
                      <span className="font-semibold ltr-nums">
                        {toPersianDigits(day)}
                      </span>
                      {booked && (
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PageCard>

      <PageCard
        title="خلاصه رزروهای این ماه"
        description="تعداد روزهای رزروشده در ماه جاری"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary ltr-nums">
              {toPersianDigits(bookedDays.size)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">روز رزروشده</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <p className="text-2xl font-bold ltr-nums">
              {toPersianDigits(Math.max(0, daysInMonth - bookedDays.size))}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">روز آزاد</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <p className="text-2xl font-bold text-gold ltr-nums">
              {toPersianDigits(Math.round((bookedDays.size / daysInMonth) * 100))}
              <span className="text-base">٪</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">نرخ اشغال</p>
          </div>
        </div>
      </PageCard>
    </div>
  );
}

/* ============================ HOST BOOKINGS ============================ */
const MOCK_GUESTS = [
  "علی رضایی", "مریم حسینی", "سعید کریمی", "فاطمه نوری", "حسین موسوی",
  "زهرا اکبری", "رضا قاسمی", "نگار صادقی", "امیر تهرانی", "سمیرا رحیمی",
];
const MOCK_STATUSES: ("pending" | "confirmed" | "completed" | "cancelled")[] = [
  "confirmed", "completed", "pending", "confirmed", "cancelled", "completed", "confirmed",
];

function makeHostBookings(properties: { id: string; title: string; pricePerNight: number; city: string }[]) {
  if (properties.length === 0) return [];
  const out: Array<{
    id: string;
    propertyId: string;
    propertyTitle: string;
    city: string;
    guestName: string;
    guests: number;
    checkIn: string;
    checkOut: string;
    nights: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
  }> = [];
  const now = new Date();
  let idx = 0;
  properties.forEach((p) => {
    let seed = 0;
    for (let i = 0; i < p.id.length; i++) seed = (seed * 31 + p.id.charCodeAt(i)) >>> 0;
    const count = 2 + (seed % 4);
    for (let i = 0; i < count; i++) {
      const offset = ((seed + i * 7) % 60) - 30;
      const ci = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
      const nights = 2 + ((seed + i) % 5);
      const co = new Date(ci.getTime() + nights * 86_400_000);
      const status = MOCK_STATUSES[(seed + i) % MOCK_STATUSES.length];
      out.push({
        id: `${p.id}-${i}`,
        propertyId: p.id,
        propertyTitle: p.title,
        city: p.city,
        guestName: MOCK_GUESTS[(seed + i) % MOCK_GUESTS.length],
        guests: 1 + ((seed + i) % 5),
        checkIn: ci.toISOString(),
        checkOut: co.toISOString(),
        nights,
        totalPrice: p.pricePerNight * nights + Math.round(p.pricePerNight * 0.15),
        status,
      });
      idx++;
    }
  });
  void idx;
  // Sort by check-in desc
  return out.sort((a, b) => b.checkIn.localeCompare(a.checkIn));
}

function HostBookingsTab() {
  const user = useAppStore((s) => s.user)!;
  const { data: properties, isLoading } = useHostProperties(user.id);
  const goProperty = useAppStore((s) => s.goProperty);

  const hostBookings = React.useMemo(
    () => makeHostBookings((properties ?? []).map((p) => ({
      id: p.id, title: p.title, pricePerNight: p.pricePerNight, city: p.city,
    }))),
    [properties]
  );

  if (isLoading) return <DashboardSkeleton count={3} />;

  if (hostBookings.length === 0) {
    return (
      <EmptyState
        icon={BookMarked}
        title="هنوز رزروی دریافت نکرده‌اید"
        description="با انتشار اقامتگاه‌هایتان، رزروهای مسافران اینجا نمایش داده می‌شوند."
      />
    );
  }

  return (
    <PageCard
      title={`رزروهای مسافران (${toPersianDigits(hostBookings.length)})`}
      description="همه رزروهای دریافت‌شده برای اقامتگاه‌های شما"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border/60">
            <TableHead className="text-right">مسافر</TableHead>
            <TableHead className="text-right">اقامتگاه</TableHead>
            <TableHead className="text-right">ورود</TableHead>
            <TableHead className="text-right">خروج</TableHead>
            <TableHead className="text-right">مبلغ</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hostBookings.map((b) => (
            <TableRow key={b.id} className="border-border/60">
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {b.guestName[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{b.guestName}</p>
                    <p className="text-[10px] text-muted-foreground">
                      <Users className="inline h-2.5 w-2.5" /> {toPersianDigits(b.guests)} نفر
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <button
                  className="truncate text-right font-medium hover:text-primary"
                  onClick={() => goProperty(b.propertyId)}
                >
                  {b.propertyTitle}
                </button>
              </TableCell>
              <TableCell className="text-xs">{formatJalaliShort(b.checkIn)}</TableCell>
              <TableCell className="text-xs">{formatJalaliShort(b.checkOut)}</TableCell>
              <TableCell className="font-semibold ltr-nums">
                {formatTomanCompact(b.totalPrice)}
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

/* ============================ HELPERS ============================ */
// Wrapper around useQueryClient to avoid importing directly in some paths.
import { useQueryClient } from "@tanstack/react-query";
function useQueryUtils() {
  return useQueryClient();
}
