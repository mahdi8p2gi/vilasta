"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, Heart, Bell, LayoutDashboard, LogOut, User as UserIcon,
  ChevronDown, Globe, Plus, Phone,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useAppStore } from "@/store/app-store";
import { siteConfig, navItems } from "@/config/site";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/persian";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { view, setView, user, logout, openAuth, goDashboard, setMobileMenu, mobileMenuOpen, setSearchModal } = useAppStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")
    : "؟";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,box-shadow,padding] duration-500 ease-out",
        scrolled
          ? "border-b border-border/60 bg-background/95 shadow-md shadow-black/5 backdrop-blur-md py-1"
          : "border-b border-transparent bg-transparent py-2"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Right: logo + nav */}
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  view === item.view && "bg-accent text-accent-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Left: actions */}
        <div className="flex items-center gap-1.5">
          {/* Search trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchModal(true)}
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-border/60 px-3"
          >
            <Search className="h-4 w-4" />
            <span className="text-xs text-muted-foreground">جستجوی مقصد...</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchModal(true)}
            className="md:hidden rounded-full"
            aria-label="جستجو"
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle compact />

          {user ? (
            <>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goDashboard("notifications")}
                className="relative rounded-full"
                aria-label="اعلان‌ها"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              </Button>

              {/* Favorites quick */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goDashboard("favorites")}
                className="hidden sm:inline-flex rounded-full"
                aria-label="علاقه‌مندی‌ها"
              >
                <Heart className="h-5 w-5" />
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border/60 p-1 pl-3 transition-colors hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name || "کاربر"} />
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => goDashboard("profile")}>
                    <UserIcon className="h-4 w-4" />
                    پروفایل من
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => goDashboard("bookings")}>
                    <LayoutDashboard className="h-4 w-4" />
                    داشبورد {user.role === "host" ? "میزبان" : user.role === "admin" ? "مدیر" : "کاربر"}
                  </DropdownMenuItem>
                  {user.role === "host" && (
                    <DropdownMenuItem onClick={() => goDashboard("add-property")}>
                      <Plus className="h-4 w-4" />
                      افزودن اقامتگاه
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    خروج از حساب
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Button variant="ghost" size="sm" onClick={() => openAuth("login")} className="rounded-full">
                ورود
              </Button>
              <Button size="sm" onClick={() => openAuth("register")} className="rounded-full">
                ثبت‌نام
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full relative" aria-label="منو">
                <motion.span
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" showCloseButton={false} className="w-[320px] sm:w-[360px] p-0">
              {/* Custom header: logo + close in same row */}
              <SheetHeader className="flex flex-row items-center justify-between p-4 border-b border-border/60">
                <SheetTitle className="text-right p-0">
                  <Logo />
                </SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent" aria-label="بستن منو">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </SheetHeader>

              {/* Animated nav items */}
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.view}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, type: "spring", stiffness: 300, damping: 24 }}
                    onClick={() => {
                      setView(item.view);
                      setMobileMenu(false);
                    }}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-right text-sm font-medium transition-all hover:bg-accent hover:pr-5",
                      view === item.view
                        ? "bg-gradient-to-l from-primary/10 to-transparent text-primary border-r-2 border-primary"
                        : "text-foreground/80 hover:text-foreground"
                    )}
                  >
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all group-hover:scale-150",
                      view === item.view ? "bg-primary scale-150" : "bg-muted-foreground/30"
                    )} />
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              <div className="mt-auto p-4 space-y-3">
                {!user ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => { openAuth("login"); setMobileMenu(false); }} className="rounded-xl">
                      ورود
                    </Button>
                    <Button variant="outline" onClick={() => { openAuth("register"); setMobileMenu(false); }} className="rounded-xl">
                      ثبت‌نام
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => { goDashboard(); setMobileMenu(false); }} className="w-full rounded-xl gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    داشبورد
                  </Button>
                )}
                <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {siteConfig.phone}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
