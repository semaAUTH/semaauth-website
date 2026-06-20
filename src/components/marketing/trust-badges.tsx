"use client";

import { Award, FileCheck, Globe, Shield } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/scroll-reveal";

const badges = [
  {
    icon: Award,
    title: "Gartner Peer Insights",
    subtitle: "4.8 / 5 customer rating",
    status: "Leader in Access Management",
  },
  {
    icon: Shield,
    title: "SOC 2 Type II",
    subtitle: "Audit in progress",
    status: "Security controls verified",
  },
  {
    icon: Globe,
    title: "GDPR & ISO 27001",
    subtitle: "Compliance aligned",
    status: "Data protection ready",
  },
  {
    icon: FileCheck,
    title: "OWASP ASVS Level 2",
    subtitle: "Auth security standard",
    status: "Production-grade controls",
  },
];

export function TrustBadges() {
  return (
    <section className="border-b border-border py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            A platform you can trust
          </p>
        </Reveal>
        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {badges.map((badge) => (
            <StaggerItem key={badge.title}>
              <div className="group h-full rounded-xl border border-border bg-background p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <badge.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-4 text-sm font-semibold">{badge.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{badge.subtitle}</p>
                <p className="mt-3 text-xs font-medium text-primary">{badge.status}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
