"use client";

import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const setView = useAppStore((s) => s.setView);

  const dims = {
    sm: { box: "h-8 w-8", svg: "h-5 w-5", text: "text-lg" },
    md: { box: "h-10 w-10", svg: "h-6 w-6", text: "text-xl" },
    lg: { box: "h-14 w-14", svg: "h-8 w-8", text: "text-2xl" },
  }[size];

  return (
    <button
      onClick={() => setView("home")}
      className={cn("flex items-center gap-2.5 group", className)}
      aria-label="ویلاستا — خانه"
    >
      <span className={cn("relative flex items-center justify-center", dims.box)}>
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-gold opacity-90 blur-[6px] transition-opacity group-hover:opacity-100" />
        <span className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-gold shadow-lg">
          <svg viewBox="0 0 64 64" className={dims.svg} fill="none">
            <path
              d="M14 16 L32 48 L50 16"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="32" cy="48" r="2.5" fill="white" />
          </svg>
        </span>
      </span>
      {showText && (
        <span className={cn("font-bold tracking-tight", dims.text)}>
          <span className="text-gradient-emerald">ویلا</span>
          <span className="text-gradient-gold">ستا</span>
        </span>
      )}
    </button>
  );
}
