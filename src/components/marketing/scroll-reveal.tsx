"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const offset = {
    up: { y: 32, x: 0 },
    left: { y: 0, x: -32 },
    right: { y: 0, x: 32 },
    none: { y: 0, x: 0 },
  }[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.65, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function Stagger({ children, className, stagger = 0.08 }: StaggerProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type SectionShellProps = {
  children: ReactNode;
  variant?: "default" | "muted" | "teal" | "dark" | "mesh";
  className?: string;
  index?: number;
  id?: string;
};

export function SectionShell({
  children,
  variant = "default",
  className,
  index,
  id,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        variant === "default" && "bg-background",
        variant === "muted" && "section-muted border-y border-border",
        variant === "teal" && "section-teal border-y border-primary/10",
        variant === "dark" && "section-dark text-white",
        variant === "mesh" && "section-mesh border-y border-border",
        className
      )}
    >
      {index !== undefined && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-8 right-6 select-none font-mono text-[8rem] leading-none font-bold text-foreground/[0.03] lg:right-12 lg:text-[12rem]"
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
      {variant === "teal" && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
      )}
      {variant === "mesh" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-60" />
      )}
      <div className="relative">{children}</div>
    </section>
  );
}
