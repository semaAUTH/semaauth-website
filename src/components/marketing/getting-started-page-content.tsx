"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/page-hero";
import { Reveal, SectionShell, Stagger, StaggerItem } from "@/components/marketing/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Create a tenant and issuer",
    description: "Set up your organization workspace and configure your auth issuer domain.",
    code: "semaauth tenants create --name acme-corp",
  },
  {
    title: "Register your OAuth client",
    description: "Add redirect URIs, configure allowed origins, and enable PKCE for your application.",
    code: "semaauth apps create --name customer-portal --type spa",
  },
  {
    title: "Install the SDK",
    description: "Add @semaauth/sdk-web to your React app and configure the authorization flow.",
    code: "pnpm add @semaauth/sdk-web",
  },
  {
    title: "Enable MFA and social login",
    description: "Configure TOTP, passkeys, and social providers from the admin console.",
    code: null,
  },
];

export function GettingStartedPageContent() {
  return (
    <main>
      <MarketingPageHero
        eyebrow="Quickstart"
        title="Launch your auth setup"
        description="Follow these steps to integrate semaAUTH into your application. Most teams ship their first login flow in under 15 minutes."
        gradient
      />

      <SectionShell variant="default" className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="relative">
            <div
              aria-hidden
              className="absolute top-4 bottom-4 left-4 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent"
            />
            <Stagger className="space-y-2" stagger={0.12}>
              {steps.map((step, index) => (
                <StaggerItem key={step.title}>
                  <div className="relative flex gap-5 pl-0">
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30">
                      {index + 1}
                    </div>
                    <div className="flex-1 rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/20 hover:shadow-md">
                      <h2 className="font-semibold">{step.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      {step.code && (
                        <pre className="mt-3 overflow-x-auto rounded-lg bg-sidebar px-4 py-3 text-sm text-sidebar-foreground">
                          <code>{step.code}</code>
                        </pre>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.3} className="mt-10">
            <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/8 to-teal-500/5 p-6">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold">Need help getting started?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Our docs cover React, Express, NestJS, and mobile SDKs.
                  </p>
                </div>
                <Link
                  href="/docs"
                  className={cn(buttonVariants({ variant: "outline" }), "gap-2 shrink-0")}
                >
                  Full documentation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </main>
  );
}
