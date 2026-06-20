"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Server, Users } from "lucide-react";
import { CustomerStories } from "@/components/marketing/customer-stories";
import { AnalystRecognition, GoFurther } from "@/components/marketing/go-further";
import { HeroContent } from "@/components/marketing/hero-content";
import { HeroProductPreview } from "@/components/marketing/hero-product-preview";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { PlatformStats } from "@/components/marketing/platform-stats";
import { ProductBlock } from "@/components/marketing/product-block";
import { PromoBanner } from "@/components/marketing/promo-banner";
import {
  AdminConsoleVisual,
  AuthRuntimeVisual,
  CiamVisual,
  DeveloperSdkVisual,
  IdentityFabricVisual,
} from "@/components/marketing/product-visuals";
import { ResourcesHub } from "@/components/marketing/resources-hub";
import { Reveal, SectionShell } from "@/components/marketing/scroll-reveal";
import { TrustBadges } from "@/components/marketing/trust-badges";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomePageContent() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <HeroContent />
          <HeroProductPreview />
        </div>
      </section>

      <PromoBanner />
      <PlatformStats />

      <SectionShell variant="default" index={1} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ProductBlock
            eyebrow="Auth runtime"
            title="Secure all identities within one auth engine"
            description="Our Go-based OAuth 2.1 / OIDC engine handles authorization, token issuance, MFA, social login, and passkeys — with Ed25519 signing and PostgreSQL RLS tenant isolation."
            bullets={[
              "Authorization Code + PKCE enforced for all public clients",
              "JWKS-based JWT verification — zero DB hits per request",
              "Refresh token rotation with automatic reuse detection",
              "TOTP, passkeys, and social IdP normalization built in",
            ]}
            cta={{ label: "Explore auth runtime", href: "/docs" }}
            icon={Server}
            accent="teal"
            visual={<AuthRuntimeVisual />}
          />
        </div>
      </SectionShell>

      <SectionShell variant="teal" index={2} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ProductBlock
            eyebrow="Admin console"
            title="Govern every tenant from a single control plane"
            description="Register OAuth clients, manage users and roles, configure MFA policies, and export audit logs — all scoped to your organization with enterprise-grade visibility."
            bullets={[
              "Application registry with redirect URI and grant type controls",
              "User management, role assignment, and MFA enrollment tracking",
              "Security policy configuration per tenant",
              "System log with export for compliance and forensics",
            ]}
            cta={{ label: "Open admin console", href: "/dashboard" }}
            icon={Lock}
            reversed
            accent="slate"
            visual={<AdminConsoleVisual />}
          />
        </div>
      </SectionShell>

      <SectionShell variant="mesh" index={3} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ProductBlock
            eyebrow="Developer SDKs"
            title="Ship amazing experiences with enterprise-grade identity"
            description="React, Express, and NestJS integrations get your team from zero to production login fast — with PKCE, secure session handling, and BFF refresh patterns baked in."
            bullets={[
              "React SDK with Authorization Code + PKCE — no tokens in localStorage",
              "Express & NestJS adapters with JWKS verification middleware",
              "Mobile SDK patterns for iOS ASWebAuthenticationSession and Android Custom Tabs",
              "Clear API docs, quickstart guides, and integration examples",
            ]}
            cta={{ label: "View developer docs", href: "/docs/getting-started" }}
            icon={Users}
            accent="emerald"
            visual={<DeveloperSdkVisual />}
          />
        </div>
      </SectionShell>

      <SectionShell variant="muted" index={4} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ProductBlock
            eyebrow="Identity security"
            title="Secure all of your identities within an identity security fabric"
            description="Gain end-to-end visibility across auth flows, simplify governance and compliance, and proactively remediate risk — without stitching together point solutions."
            bullets={[
              "Real-time auth health monitoring and anomaly detection",
              "Audit trail for every token issuance, revocation, and policy change",
              "Tenant-scoped policy enforcement at the data layer with RLS",
              "Compliance-ready exports for SOC 2, GDPR, and internal reviews",
            ]}
            cta={{ label: "Visit trust center", href: "/security" }}
            icon={Lock}
            reversed
            accent="teal"
            visual={<IdentityFabricVisual />}
          />
        </div>
      </SectionShell>

      <SectionShell variant="default" index={5} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ProductBlock
            eyebrow="Customer identity"
            title="Ship amazing experiences with enterprise-grade customer identity"
            description="Customize login flows, prevent fraud, support social and passwordless sign-in, and scale to millions of users — all on the same platform as your workforce identity."
            bullets={[
              "Branded login pages with custom domains and theming",
              "Social login with explicit account linking — no auto-merge by email",
              "Passkey and TOTP enrollment for customer-facing apps",
              "Bot-resistant flows with PKCE and session lifecycle controls",
            ]}
            cta={{ label: "Build customer login", href: "/docs/getting-started" }}
            icon={Users}
            accent="emerald"
            visual={<CiamVisual />}
          />
        </div>
      </SectionShell>

      <LogoMarquee />
      <CustomerStories />
      <TrustBadges />
      <AnalystRecognition />
      <ResourcesHub />
      <GoFurther />

      {/* Final CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="cta-glow relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-16">
              <div aria-hidden className="absolute inset-0 dot-grid opacity-10" />
              <div className="relative">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Ready to secure your application?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
                  Start with a free trial or talk to our team about enterprise deployment, private
                  hosting, and custom SLAs.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/docs/getting-started"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "min-w-[168px] shadow-lg shadow-primary/30"
                    )}
                  >
                    Get started free
                  </Link>
                  <Link
                    href="/pricing"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "min-w-[168px] border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                    )}
                  >
                    View pricing
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
