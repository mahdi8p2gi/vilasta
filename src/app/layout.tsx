import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppPreloader } from "@/components/layout/app-preloader";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ویلاستا — اقامتگاه‌های لوکس ایران | رزرو آنلاین ویلا و هتل",
  description:
    "ویلاستا، پلتفرم رزرو آنلاین ویلا، هتل و اقامتگاه‌های لوکس در سراسر ایران. کیش، تهران، اصفهان، شیراز و یزد. بهترین قیمت، رزرو فوری، پرداخت امن.",
  keywords: [
    "رزرو ویلا", "رزرو هتل", "اقامتگاه لوکس", "ویلا کیش", "هتل تهران",
    "اقامتگاه بوم‌گردی", "ویلاستا", "رزرو آنلاین", "گردشگری ایران",
  ],
  authors: [{ name: "Vilasta Team" }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "ویلاستا — اقامتگاه‌های لوکس ایران",
    description: "رزرو آنلاین ویلا و هتل‌های لوکس در سراسر ایران",
    siteName: "ویلاستا",
    locale: "fa_IR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1d2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AppPreloader />
            {children}
            <Toaster />
            <SonnerToaster position="top-center" dir="rtl" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
