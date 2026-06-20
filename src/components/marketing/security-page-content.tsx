"use client";

import Link from "next/link";
import {
  CheckCircle2,
  FileCheck,
  KeyRound,
  Lock,
  Server,
  ShieldCheck,
} from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/page-hero";
import { Reveal, SectionShell, Stagger, StaggerItem } from "@/components/marketing/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const controls = [
  {
    icon: KeyRound,
    title: "PKCE required for all public clients",
    description:
      "Authorization Code + PKCE is enforced — no implicit flows, no client secrets in browsers.",
  },
  {
    icon: ShieldCheck,
    title: "JWKS-based JWT verification",
    description:
      "Validate access tokens in memory using cached public keys. No database round-trips per request.",
  },
  {
    icon: Server,
    title: "Tenant-scoped authorization",
    description:
      "PostgreSQL Row-Level Security enforces tenant boundaries at the data layer, not just in application code.",
  },
  {
    icon: Lock,
    title: "MFA and passkey support",
    description:
      "TOTP and WebAuthn for phishing-resistant authentication. MFA policies configurable per tenant.",
  },
  {
    icon: FileCheck,
    title: "Comprehensive audit logging",
    description:
      "Every sensitive action — token issuance, revocation, policy change — is recorded and exportable.",
  },
  {
    icon: CheckCircle2,
    title: "Ed25519 token signing",
    description:
      "Access and ID tokens signed with Ed25519 (EdDSA). RS256 is not used for semaAUTH-issued tokens.",
  },
];

const certifications = [
  "SOC 2 Type II (in progress)",
  "GDPR compliant",
  "ISO 27001 aligned",
  "OWASP ASVS Level 2",
];

const redLines = [
  "No client secrets in browser apps",
  "No tokens in localStorage",
  "No mobile WebViews for auth",
  "No DB hits for JWT verification",
  "No app-only tenant isolation",
  "No automatic social account linking by email",
];

export function SecurityPageContent() {
  return (
    <main>
      <MarketingPageHero
        eyebrow="Trust center"
        title="Security built in, not bolted on"
        description="semaAUTH is designed for teams that need strong identity protection without sacrificing developer speed. Every architectural decision prioritizes security by default."
        gradient
      />

      <SectionShell variant="mesh" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {controls.map((item) => (
              <StaggerItem key={item.title}>
                <div className="group h-full rounded-xl border border-border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </SectionShell>

      <SectionShell variant="muted" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold">Architectural red lines</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Non-negotiable security rules enforced by the platform — not optional configuration.
            </p>
          </Reveal>
          <Stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {redLines.map((line) => (
              <StaggerItem key={line}>
                <div className="flex items-center gap-3 rounded-lg border border-destructive/15 bg-destructive/5 px-4 py-3 text-sm font-medium">
                  <span className="text-destructive">✕</span>
                  {line}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </SectionShell>

      <SectionShell variant="teal" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal direction="left">
              <h2 className="text-2xl font-semibold">Compliance & certifications</h2>
              <p className="mt-4 text-muted-foreground">
                We maintain rigorous security standards and are actively pursuing industry
                certifications to meet enterprise procurement requirements.
              </p>
              <ul className="mt-6 space-y-3">
                {certifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {cert}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className="h-full rounded-xl border border-border bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <h3 className="font-semibold">Need a security review?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our team can provide architecture documentation, penetration test summaries, and
                  compliance questionnaires for your procurement process.
                </p>
                <Link href="/contact" className={cn(buttonVariants(), "mt-6 shadow-md shadow-primary/20")}>
                  Request security pack
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
