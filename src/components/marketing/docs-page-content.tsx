"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FileText,
  Rocket,
  Shield,
} from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/page-hero";
import { Reveal, SectionShell, Stagger, StaggerItem } from "@/components/marketing/scroll-reveal";

const docsSections = [
  {
    icon: Rocket,
    title: "Getting started",
    description: "Install SDKs, configure redirect URIs, and issue your first secure auth flow.",
    href: "/docs/getting-started",
    tag: "Quickstart",
  },
  {
    icon: BookOpen,
    title: "Architecture guide",
    description: "Understand the tenant model, RLS boundaries, and auth server topology.",
    href: "/docs",
    tag: "Concepts",
  },
  {
    icon: Shield,
    title: "Security model",
    description: "PKCE requirements, token handling, MFA enrollment, and audit expectations.",
    href: "/security",
    tag: "Security",
  },
  {
    icon: Code2,
    title: "API reference",
    description: "Discovery, token exchange, introspection, revocation, and userinfo endpoints.",
    href: "/docs",
    tag: "Reference",
  },
  {
    icon: FileText,
    title: "Integration guides",
    description: "Step-by-step setup for React, Express, NestJS, React Native, and Flutter.",
    href: "/docs/getting-started",
    tag: "Guides",
  },
];

const quickLinks = [
  { label: "OAuth 2.1 overview", href: "/docs" },
  { label: "PKCE configuration", href: "/docs/getting-started" },
  { label: "JWT verification", href: "/security" },
  { label: "Multi-tenant setup", href: "/docs" },
  { label: "MFA enrollment", href: "/security" },
  { label: "Social login", href: "/docs/getting-started" },
];

export function DocsPageContent() {
  return (
    <main>
      <MarketingPageHero
        eyebrow="Developers"
        title="Documentation"
        description="Everything you need to integrate semaAUTH — from quickstart guides to full API reference."
        gradient
      />

      <SectionShell variant="default" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {docsSections.map((section) => (
              <StaggerItem key={section.title}>
                <Link
                  href={section.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {section.tag}
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold group-hover:text-primary">
                    {section.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {section.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read guide
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </SectionShell>

      <SectionShell variant="muted" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="text-xl font-semibold">Popular topics</h2>
          </Reveal>
          <Stagger className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {quickLinks.map((link) => (
              <StaggerItem key={link.label}>
                <Link
                  href={link.href}
                  className="group flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-md"
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </SectionShell>
    </main>
  );
}
