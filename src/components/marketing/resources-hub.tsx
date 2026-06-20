"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/marketing/scroll-reveal";
import { cn } from "@/lib/utils";

const tabs = [
  "Product releases",
  "Identity security",
  "Developer guides",
  "Industry insights",
  "Company news",
] as const;

type Tab = (typeof tabs)[number];

const resources: Record<Tab, { tag: string; title: string; href: string }[]> = {
  "Product releases": [
    { tag: "Release", title: "Passkeys & WebAuthn now generally available", href: "/docs/getting-started" },
    { tag: "Release", title: "OAuth 2.1 PKCE enforcement by default", href: "/docs" },
    { tag: "Release", title: "NestJS adapter v1.0 — BFF refresh rotation", href: "/docs" },
  ],
  "Identity security": [
    { tag: "Whitepaper", title: "Multi-tenant isolation with PostgreSQL RLS", href: "/security" },
    { tag: "Guide", title: "JWT verification with JWKS — zero DB round-trips", href: "/security" },
    { tag: "Report", title: "Architectural red lines for production auth", href: "/security" },
  ],
  "Developer guides": [
    { tag: "Quickstart", title: "Launch your first OAuth flow in 15 minutes", href: "/docs/getting-started" },
    { tag: "Guide", title: "React SDK — Authorization Code + PKCE", href: "/docs" },
    { tag: "Guide", title: "Express & NestJS adapter integration", href: "/docs" },
  ],
  "Industry insights": [
    { tag: "Article", title: "Why PKCE is non-negotiable for public clients", href: "/security" },
    { tag: "Article", title: "Passkeys vs TOTP — choosing the right MFA strategy", href: "/security" },
    { tag: "Webinar", title: "Building tenant-aware auth at scale", href: "/contact" },
  ],
  "Company news": [
    { tag: "News", title: "semaAUTH open sources JWT verification library", href: "/docs" },
    { tag: "News", title: "SOC 2 Type II audit initiated", href: "/security" },
    { tag: "News", title: "Enterprise private deployment now available", href: "/pricing" },
  ],
};

export function ResourcesHub() {
  const [activeTab, setActiveTab] = useState<Tab>("Product releases");
  const items = resources[activeTab];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Read. Watch. Learn. More.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border pb-px">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.span
                    layoutId="resource-tab"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid gap-4 md:grid-cols-3"
          >
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
                >
                  <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                    {item.tag}
                  </span>
                  <p className="mt-3 flex-1 text-base font-semibold leading-snug group-hover:text-primary">
                    {item.title}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-primary">
                    Read more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
