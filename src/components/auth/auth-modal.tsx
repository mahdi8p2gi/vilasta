"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/logo";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";

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
  { label: "مدیر سیستم", email: "admin@villa.ir", role: "admin" },
  { label: "میزبان", email: "host@villa.ir", role: "host" },
  { label: "کاربر", email: "user@villa.ir", role: "customer" },
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
      toast.success(authMode === "register" ? "ثبت‌نام موفقیت‌آمیز بود" : "خوش آمدید 👋");
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
      toast.success("ورود موفقیت‌آمیز بود");
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

  return (
    <Dialog open={authModalOpen} onOpenChange={(o) => !o && closeAuth()}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-primary/15 via-transparent to-gold/15 px-6 pb-2 pt-6">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <DialogHeader className="relative">
            <div className="flex items-center justify-between">
              <Logo showText={false} />
              <DialogTitle className="text-right text-xl">
                {authMode === "login" && "ورود به حساب"}
                {authMode === "register" && "ساخت حساب جدید"}
                {authMode === "forgot" && "بازیابی رمز عبور"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-right">
              {authMode === "login" && "به ویلاستا خوش آمدید. لطفاً وارد شوید."}
              {authMode === "register" && "در چند ثانیه حساب خود را بسازید."}
              {authMode === "forgot" && "ایمیل خود را وارد کنید تا لینک بازیابی ارسال شود."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 pb-6 pt-2">
          {forgotSent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-brand" />
              <p className="text-sm text-muted-foreground">
                لینک بازیابی رمز به ایمیل شما ارسال شد. لطفاً صندوق ورودی را بررسی کنید.
              </p>
              <Button variant="outline" onClick={() => switchMode("login")} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                بازگشت به ورود
              </Button>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {authMode === "register" && (
                <Field label="نام و نام خانوادگی" icon={UserIcon} error={form.formState.errors.name?.message as string}>
                  <Input
                    placeholder="مثلاً: سپهر کاظمی"
                    className="border-0 bg-transparent focus-visible:ring-0"
                    {...form.register("name")}
                  />
                </Field>
              )}

              <Field label="ایمیل" icon={Mail} error={form.formState.errors.email?.message as string}>
                <Input
                  type="email"
                  dir="ltr"
                  placeholder="you@example.com"
                  className="border-0 bg-transparent text-left focus-visible:ring-0"
                  {...form.register("email")}
                />
              </Field>

              {authMode !== "forgot" && (
                <Field label="رمز عبور" icon={Lock} error={form.formState.errors.password?.message as string}>
                  <Input
                    type={showPass ? "text" : "password"}
                    dir="ltr"
                    placeholder="••••••••"
                    className="border-0 bg-transparent text-left focus-visible:ring-0"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </Field>
              )}

              {authMode === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-xs text-primary hover:underline"
                  >
                    رمز عبور را فراموش کرده‌اید؟
                  </button>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full gap-2 rounded-xl">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {authMode === "login" && "ورود"}
                {authMode === "register" && "ثبت‌نام"}
                {authMode === "forgot" && "ارسال لینک بازیابی"}
              </Button>
            </form>
          )}

          {authMode === "login" && (
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs text-muted-foreground">ورود سریع</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map((a) => (
                  <button
                    key={a.email}
                    onClick={() => quickLogin(a.email)}
                    disabled={loading}
                    className="rounded-lg border border-border bg-background px-2 py-2 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {authMode !== "forgot" && (
            <p className="text-center text-sm text-muted-foreground">
              {authMode === "login" ? "حساب کاربری ندارید؟ " : "قبلاً ثبت‌نام کرده‌اید؟ "}
              <button
                onClick={() => switchMode(authMode === "login" ? "register" : "login")}
                className="font-medium text-primary hover:underline"
              >
                {authMode === "login" ? "ثبت‌نام کنید" : "وارد شوید"}
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label, icon: Icon, error, children,
}: {
  label: string;
  icon: any;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        {children}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
