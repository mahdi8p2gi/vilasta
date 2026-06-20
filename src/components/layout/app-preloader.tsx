"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Modern brand preloader — shows on first load, then fades out.
 * Uses localStorage to avoid showing on every client-side navigation.
 */
export function AppPreloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute left-1/3 top-1/3 h-[280px] w-[280px] rounded-full bg-gold/15 blur-[100px] animate-float" />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo monogram */}
            <motion.div
              className="relative flex h-24 w-24 items-center justify-center"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-gold opacity-90 blur-md" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-gold shadow-2xl">
                <svg viewBox="0 0 64 64" className="h-12 w-12">
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
              </div>
              {/* pulse ring */}
              <span className="absolute inset-0 rounded-3xl border-2 border-primary/40 animate-pulse-ring" />
            </motion.div>

            {/* Brand name */}
            <motion.div
              className="text-center"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-gradient-emerald">ویلا</span>
                <span className="text-gradient-gold">ستا</span>
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                اقامتگاه‌های لوکس ایران
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="h-1 w-40 overflow-hidden rounded-full bg-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-l from-primary to-gold"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
