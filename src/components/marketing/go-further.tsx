"use client";

import Link from "next/link";
import { ArrowRight, Calendar, MessageSquare, Rocket } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/scroll-reveal";
import { cn } from "@/lib/utils";

const paths = [
  {
    icon: Rocket,
    title: "Start a free trial",
    description: "Explore OAuth, OIDC, MFA, and tenant management in your own sandbox.",
    cta: "Start free trial",
    href: "/docs/getting-started",
  },
  {
    icon: Calendar,
    title: "Expert webinars",
    description: "Stay current on identity security, PKCE, passkeys, and multi-tenant architecture.",
    cta: "View schedule",
    href: "/contact",
  },
  {
    icon: MessageSquare,
    title: "Talk to an expert",
    description: "Connect with our team for architecture reviews, security packs, and enterprise pricing.",
    cta: "Contact sales",
    href: "/contact",
  },
];

export function GoFurther() {
  return (
    <section className="section-muted border-t border-border py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Go further</h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.12}>
          {paths.map((path) => (
            <StaggerItem key={path.title}>
              <div className="group flex h-full flex-col rounded-xl border border-border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <path.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{path.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {path.description}
                </p>
                <Link
                  href={path.href}
                  className={cn(
                    "mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  )}
                >
                  {path.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function AnalystRecognition() {
  return (
    <section className="border-y border-border py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">A leader. Proven.</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="h-full rounded-xl border border-border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Industry recognition
              </p>
              <p className="mt-3 text-lg font-semibold leading-snug">
                Recognized as a Leader in Access Management by industry analysts.
              </p>
              <Link
                href="/security"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Read more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="h-full rounded-xl border border-border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                ROI study
              </p>
              <p className="mt-3 text-lg font-semibold leading-snug">
                Teams report up to 60% faster auth integration vs building in-house identity systems.
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Read more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
