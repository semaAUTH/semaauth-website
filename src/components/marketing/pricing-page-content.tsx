"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/page-hero";
import { Reveal, SectionShell, Stagger, StaggerItem } from "@/components/marketing/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For early teams shipping their first production auth flow.",
    features: ["1 tenant", "Up to 1,000 MAU", "OAuth 2.1 + OIDC", "TOTP MFA", "Email support"],
    highlighted: false,
    cta: "Start free trial",
  },
  {
    name: "Growth",
    price: "$99",
    period: "/month",
    description: "For product teams scaling across multiple apps and organizations.",
    features: [
      "5 tenants",
      "Up to 10,000 MAU",
      "Social login",
      "Audit log exports",
      "SSO policies",
      "Priority support",
    ],
    highlighted: true,
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For regulated teams needing deployment and governance controls.",
    features: [
      "Unlimited tenants",
      "Custom MAU limits",
      "Dedicated support",
      "Custom SLA",
      "Private deployment",
      "SAML / SCIM",
    ],
    highlighted: false,
    cta: "Contact sales",
  },
];

const comparisonFeatures = [
  { name: "OAuth 2.1 + OIDC", starter: true, growth: true, enterprise: true },
  { name: "PKCE enforcement", starter: true, growth: true, enterprise: true },
  { name: "Passkeys / WebAuthn", starter: true, growth: true, enterprise: true },
  { name: "Social login", starter: false, growth: true, enterprise: true },
  { name: "Audit exports", starter: false, growth: true, enterprise: true },
  { name: "Custom SLA", starter: false, growth: false, enterprise: true },
  { name: "Private deployment", starter: false, growth: false, enterprise: true },
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — every plan starts with a 30-day free trial. No credit card required.",
  },
  {
    q: "What counts as a MAU?",
    a: "A monthly active user is any unique identity that completes at least one authentication in a calendar month.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. Upgrade or downgrade at any time — changes take effect on your next billing cycle.",
  },
];

export function PricingPageContent() {
  return (
    <main>
      <MarketingPageHero
        eyebrow="Pricing"
        title="Simple, transparent pricing"
        description="Choose the plan that fits your stage. Upgrade as you grow — no hidden fees, no per-login charges."
        gradient
      />

      <SectionShell variant="default" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Stagger className="grid gap-6 lg:grid-cols-3" stagger={0.12}>
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-xl border p-8 transition-all hover:-translate-y-1 hover:shadow-lg",
                    plan.highlighted
                      ? "border-primary bg-gradient-to-b from-primary/5 to-background shadow-md ring-1 ring-primary/20"
                      : "border-border bg-background hover:border-primary/25"
                  )}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                      Most popular
                    </span>
                  )}
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === "Enterprise" ? "/contact" : "/docs/getting-started"}
                    className={cn(
                      buttonVariants({ variant: plan.highlighted ? "default" : "outline" }),
                      "mt-8 w-full",
                      plan.highlighted && "shadow-md shadow-primary/20"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </SectionShell>

      <SectionShell variant="muted" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold">Compare plans</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Feature</th>
                    <th className="px-6 py-3 text-center font-medium">Starter</th>
                    <th className="px-6 py-3 text-center font-medium text-primary">Growth</th>
                    <th className="px-6 py-3 text-center font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row) => (
                    <tr
                      key={row.name}
                      className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-6 py-3.5 font-medium">{row.name}</td>
                      {[row.starter, row.growth, row.enterprise].map((included, i) => (
                        <td key={i} className="px-6 py-3.5 text-center">
                          {included ? (
                            <Check className="mx-auto h-4 w-4 text-primary" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell variant="teal" className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
          </Reveal>
          <Stagger className="mt-10 space-y-4" stagger={0.08}>
            {faqs.map((faq) => (
              <StaggerItem key={faq.q}>
                <div className="rounded-xl border border-border bg-background/80 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </SectionShell>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="cta-glow relative overflow-hidden rounded-2xl px-8 py-12 text-center">
              <div aria-hidden className="absolute inset-0 dot-grid opacity-10" />
              <div className="relative">
                <h2 className="text-2xl font-semibold text-white">Not sure which plan fits?</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
                  Talk to our team — we&apos;ll help you size MAU, tenants, and compliance needs.
                </p>
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ size: "lg" }), "mt-6 shadow-lg shadow-primary/30")}
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
