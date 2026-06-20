"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type AnimatedBarProps = {
  pct: number;
  className?: string;
};

export function AnimatedBar({ pct, className }: AnimatedBarProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <div ref={ref} className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

type DashboardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardContent({ children, className }: DashboardContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex-1 overflow-y-auto p-4 sm:p-6", className)}
    >
      {children}
    </motion.div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  change?: string;
  accent?: "teal" | "blue" | "emerald" | "amber";
  delay?: number;
};

const accents = {
  teal: "from-primary/15 to-transparent",
  blue: "from-blue-500/10 to-transparent",
  emerald: "from-emerald-500/10 to-transparent",
  amber: "from-amber-500/10 to-transparent",
};

export function MetricCard({ label, value, change, accent = "teal", delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
          accents[accent]
        )}
      />
      <div className="relative p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {change && (
            <span className="text-xs font-semibold text-emerald-600">{change}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

type DataCardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function DataCard({ children, className, delay = 0 }: DataCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/** Lock body scroll when mobile nav is open */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
