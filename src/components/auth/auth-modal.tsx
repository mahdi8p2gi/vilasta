"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, CheckCircle2,
  ArrowLeft, Sparkles, ShieldCheck, UserCircle, Building, Crown,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر"),
});

const registerSchema = z.object({
  name: z.string().min(2, "نام را وارد کنید"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر"),
});

type FormData = z.infer<typeof registerSchema>;

const demoAccounts = [
  { label: "مدیر", email: "admin@villa.ir", icon: Crown, color: "text-gold" },
  { label: "میزبان", email: "host@villa.ir", icon: Building, color: "text-emerald-brand" },
  { label: "کاربر", email: "user@villa.ir", icon: UserCircle, color: "text-primary" },
];

export function AuthModal() {
  const { authModalOpen, authMode, closeAuth, openAuth, login } = useAppStore();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(authMode === "register" ? registerSchema : loginSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (authMode === "forgot") {
        await new Promise((r) => setTimeout(r, 800));
        setForgotSent(true);
        toast.success("لینک بازیابی رمز ارسال شد");
        return;
      }

      const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const body = authMode === "register"
        ? { name: data.name, email: data.email, password: data.password, role: "customer" }
        : { email: data.email, password: data.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در احراز هویت");

      login(result);
      toast.success(authMode === "register" ? "ثبت‌نام موفقیت‌آمیز بود 🎉" : "خوش آمدید 👋");
      closeAuth();
      form.reset();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "demo" }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      login(result);
      toast.success("ورود موفقیت‌آمیز بود 👋");
      closeAuth();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode: typeof authMode) => {
    form.reset();
    setForgotSent(false);
    openAuth(mode);
  };

  const titles = {
    login: "ورود به حساب",
    register: "ساخت حساب جدید",
    forgot: "بازیابی رمز عبور",
  };

  const subtitles = {
    login: "به ویلاستا خوش آمدید. وارد شوید تا اقامتگاه‌های لوکس را کاوش کنید.",
    register: "در کمتر از یک دقیقه حساب خود را بسازید و شروع به سفر کنید.",
    forgot: "ایمیل خود را وارد کنید تا لینک بازیابی رمز برایتان ارسال شود.",
  };

  return (
    <Dialog open={authModalOpen} onOpenChange={(o) => !o && closeAuth()}>
      <DialogContent showCloseButton={false} className="max-w-[440px] overflow-hidden p-0 gap-0">
        <DialogTitle className="sr-only">{titles[authMode]}</DialogTitle>
        <DialogDescription className="sr-only">{subtitles[authMode]}</DialogDescription>

        {/* Header — logo + close in same row */}
        <div className="relative flex items-center justify-between border-b border-border/60 bg-gradient-to-br from-primary/8 via-transparent to-gold/8 px-5 py-4">
          <div className="absolute inset-0 bg-dots opacity-15" />
          <div className="relative">
            <Logo showText={false} />
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-accent" aria-label="بستن">
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6">
          {/* Title block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-1.5"
            >
              <h2 className="text-2xl font-bold tracking-tight">{titles[authMode]}</h2>
              <p className="text-sm text-muted-foreground">{subtitles[authMode]}</p>
            </motion.div>
          </AnimatePresence>

          {forgotSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-brand/10">
                <CheckCircle2 className="h-9 w-9 text-emerald-brand" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold">ایمیل ارسال شد</p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  لینک بازیابی رمز به ایمیل شما ارسال شد. لطفاً صندوق ورودی را بررسی کنید.
                </p>
              </div>
              <Button variant="outline" onClick={() => switchMode("login")} className="gap-1.5 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                بازگشت به ورود
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.form
                key={authMode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {authMode === "register" && (
                  <Field
                    label="نام و نام خانوادگی"
                    icon={UserIcon}
                    error={form.formState.errors.name?.message as string}
                  >
                    <Input
                      placeholder="مثلاً: سپهر کاظمی"
                      className="border-0 bg-transparent focus-visible:ring-0"
                      {...form.register("name")}
                    />
                  </Field>
                )}

                <Field
                  label="ایمیل"
                  icon={Mail}
                  error={form.formState.errors.email?.message as string}
                >
                  <Input
                    type="email"
                    dir="ltr"
                    placeholder="you@example.com"
                    className="border-0 bg-transparent text-left focus-visible:ring-0"
                    {...form.register("email")}
                  />
                </Field>

                {authMode !== "forgot" && (
                  <Field
                    label="رمز عبور"
                    icon={Lock}
                    error={form.formState.errors.password?.message as string}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPass ? "پنهان کردن رمز" : "نمایش رمز"}
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  >
                    <Input
                      type={showPass ? "text" : "password"}
                      dir="ltr"
                      placeholder="••••••••"
                      className="border-0 bg-transparent text-left focus-visible:ring-0"
                      {...form.register("password")}
                    />
                  </Field>
                )}

                {authMode === "login" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-xs font-medium text-primary transition-colors hover:underline"
                    >
                      رمز عبور را فراموش کرده‌اید؟
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full gap-2 overflow-hidden rounded-xl bg-gradient-to-l from-primary to-emerald-brand py-3 text-base font-bold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {authMode === "login" && "ورود به حساب"}
                      {authMode === "register" && "ساخت حساب"}
                      {authMode === "forgot" && "ارسال لینک بازیابی"}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </>
                  )}
                </Button>

                {authMode === "register" && (
                  <p className="text-center text-xs text-muted-foreground">
                    با ثبت‌نام، شما{" "}
                    <span className="font-medium text-foreground">قوانین و مقررات</span> ویلاستا را می‌پذیرید.
                  </p>
                )}
              </motion.form>
            </AnimatePresence>
          )}

          {/* Quick login (only on login mode) */}
          {authMode === "login" && !forgotSent && (
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs font-medium text-muted-foreground">
                    ورود سریع دمو
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map((a) => (
                  <button
                    key={a.email}
                    onClick={() => quickLogin(a.email)}
                    disabled={loading}
                    className="group flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-background/50 py-3 transition-all hover:border-primary/40 hover:bg-accent disabled:opacity-50"
                  >
                    <a.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", a.color)} />
                    <span className="text-xs font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode switch */}
          {authMode !== "forgot" && !forgotSent && (
            <div className="rounded-xl bg-muted/50 px-4 py-3 text-center text-sm">
              <span className="text-muted-foreground">
                {authMode === "login" ? "حساب کاربری ندارید؟ " : "قبلاً ثبت‌نام کرده‌اید؟ "}
              </span>
              <button
                onClick={() => switchMode(authMode === "login" ? "register" : "login")}
                className="font-bold text-primary transition-colors hover:underline"
              >
                {authMode === "login" ? "ثبت‌نام کنید" : "وارد شوید"}
              </button>
            </div>
          )}

          {/* Trust badges */}
          {authMode === "register" && !forgotSent && (
            <div className="flex items-center justify-center gap-4 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-brand" />
                پرداخت امن
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                تجربه لوکس
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  icon: Icon,
  error,
  trailing,
  children,
}: {
  label: string;
  icon: any;
  error?: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-xl border bg-background px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-ring/50",
          error ? "border-destructive/50" : "border-border hover:border-primary/40"
        )}
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        {children}
        {trailing}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
