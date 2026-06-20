"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  action,
  align = "right",
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: "right" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center text-center",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="space-y-1.5"
      >
        {subtitle && (
          <p className="text-sm font-medium text-emerald-brand">{subtitle}</p>
        )}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      </motion.div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
