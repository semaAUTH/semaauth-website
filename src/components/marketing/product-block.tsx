"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductBlockProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  cta: { label: string; href: string };
  icon: LucideIcon;
  reversed?: boolean;
  visual: React.ReactNode;
  accent?: "teal" | "slate" | "emerald";
};

const accentRing = {
  teal: "from-primary/20 via-teal-400/10 to-transparent",
  slate: "from-slate-400/15 via-slate-300/5 to-transparent",
  emerald: "from-emerald-400/20 via-teal-400/10 to-transparent",
};

export function ProductBlock({
  eyebrow,
  title,
  description,
  bullets,
  cta,
  icon: Icon,
  reversed,
  visual,
  accent = "teal",
}: ProductBlockProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-12 lg:grid-cols-2 lg:gap-20",
        reversed && "lg:[&>*:first-child]:order-2"
      )}
    >
      <div>
        <Reveal direction={reversed ? "right" : "left"}>
          <div className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight lg:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
        </Reveal>

        <Stagger className="mt-6 space-y-3">
          {bullets.map((bullet) => (
            <StaggerItem key={bullet}>
              <div className="flex items-start gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-primary/15 hover:bg-primary/5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-sm leading-relaxed text-muted-foreground">{bullet}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2}>
          <Link
            href={cta.href}
            className={cn(buttonVariants({ variant: "outline" }), "mt-8 gap-2")}
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>

      <Reveal direction={reversed ? "left" : "right"} delay={0.1}>
        <div className="relative">
          <div
            aria-hidden
            className={cn(
              "absolute -inset-4 rounded-2xl bg-gradient-to-br blur-2xl opacity-70",
              accentRing[accent]
            )}
          />
          <motion.div
            className="visual-float relative"
            whileInView={{ y: [16, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {visual}
          </motion.div>
        </div>
      </Reveal>
    </div>
  );
}
