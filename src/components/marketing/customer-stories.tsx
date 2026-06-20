"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/marketing/scroll-reveal";
import { cn } from "@/lib/utils";

const stories = [
  {
    company: "Northwind Health",
    industry: "Healthcare",
    headline: "Northwind Health unifies patient and provider identity across 40+ applications.",
    metrics: [
      { value: "2.4M", label: "identities on one platform" },
      { value: "68%", label: "reduction in auth-related tickets" },
    ],
    color: "bg-teal-600",
  },
  {
    company: "Meridian Finance",
    industry: "Financial services",
    headline: "Meridian Finance ships SOC 2–ready authentication for fintech products in weeks, not quarters.",
    metrics: [
      { value: "< 15m", label: "average integration time" },
      { value: "99.99%", label: "auth uptime SLA" },
    ],
    color: "bg-slate-700",
  },
  {
    company: "Atlas Commerce",
    industry: "E-commerce",
    headline: "Atlas Commerce delivers seamless customer login across web, iOS, and Android with one SDK.",
    metrics: [
      { value: "850K", label: "monthly active users" },
      { value: "41%", label: "increase in MFA adoption" },
    ],
    color: "bg-emerald-700",
  },
  {
    company: "Vertex Labs",
    industry: "SaaS",
    headline: "Vertex Labs onboards enterprise tenants with isolated auth policies and audit-ready logging.",
    metrics: [
      { value: "120+", label: "enterprise tenants" },
      { value: "100%", label: "PKCE enforcement" },
    ],
    color: "bg-cyan-700",
  },
  {
    company: "Horizon Media",
    industry: "Media",
    headline: "Horizon Media protects internal tools and partner portals with workforce SSO and passkeys.",
    metrics: [
      { value: "12K", label: "employees onboarded" },
      { value: "85%", label: "reduction in password resets" },
    ],
    color: "bg-indigo-700",
  },
];

export function CustomerStories() {
  const [active, setActive] = useState(0);
  const story = stories[active];

  function prev() {
    setActive((i) => (i === 0 ? stories.length - 1 : i - 1));
  }

  function next() {
    setActive((i) => (i === stories.length - 1 ? 0 : i + 1));
  }

  return (
    <section className="relative overflow-hidden border-y border-border bg-surface-muted py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Securing startups, scale-ups, and enterprises worldwide
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              See how teams use semaAUTH to ship secure identity faster — with measurable results.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all stories
            <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="grid lg:grid-cols-[1fr_1.1fr]"
            >
              <div className="flex flex-col justify-between p-8 lg:p-10">
                <div>
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {story.industry}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold leading-snug lg:text-2xl">
                    {story.headline}
                  </h3>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  {story.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-3xl font-semibold text-primary">{m.value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  See full story
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div
                className={cn(
                  "flex min-h-[280px] items-end p-8 lg:min-h-0 lg:p-10",
                  story.color
                )}
              >
                <div>
                  <p className="text-sm font-medium text-white/70">Customer story</p>
                  <p className="mt-1 text-2xl font-bold text-white">{story.company}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <div className="flex gap-2">
              {stories.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to story ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous story"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next story"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
