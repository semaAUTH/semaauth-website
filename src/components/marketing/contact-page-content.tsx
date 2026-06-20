"use client";

import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/page-hero";
import { Reveal, SectionShell, Stagger, StaggerItem } from "@/components/marketing/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const contactOptions = [
  {
    icon: Mail,
    title: "Email us",
    body: (
      <>
        <Link href="mailto:hello@semaauth.com" className="text-sm text-primary hover:underline">
          hello@semaauth.com
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">We respond within one business day.</p>
      </>
    ),
  },
  {
    icon: MessageSquare,
    title: "Sales inquiries",
    body: (
      <p className="text-sm text-muted-foreground">
        Enterprise deployment, custom SLAs, and volume pricing for teams over 10,000 MAU.
      </p>
    ),
  },
];

const expectations = [
  "Architecture review for your use case",
  "Security documentation pack",
  "Custom pricing for enterprise plans",
  "Pilot program for qualified teams",
];

export function ContactPageContent() {
  return (
    <main>
      <MarketingPageHero
        eyebrow="Contact"
        title="Talk to our team"
        description="Whether you're evaluating the platform or planning a production rollout, we're here to help you map your architecture."
        gradient
      />

      <SectionShell variant="mesh" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6">
              <Stagger stagger={0.1}>
                {contactOptions.map((opt) => (
                  <StaggerItem key={opt.title}>
                    <div className="flex gap-4 rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/20 hover:shadow-md">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <opt.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{opt.title}</h3>
                        <div className="mt-1">{opt.body}</div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.2}>
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-6">
                  <h3 className="font-semibold">What to expect</h3>
                  <ul className="mt-3 space-y-2">
                    {expectations.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal direction="right" delay={0.1}>
              <form className="rounded-xl border border-border bg-background p-8 shadow-sm transition-all hover:shadow-lg">
                <h2 className="text-lg font-semibold">Send us a message</h2>
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First name
                      </label>
                      <Input id="first-name" placeholder="Jane" className="mt-1.5" />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="text-sm font-medium">
                        Last name
                      </label>
                      <Input id="last-name" placeholder="Smith" className="mt-1.5" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium">
                      Work email
                    </label>
                    <Input id="email" type="email" placeholder="jane@company.com" className="mt-1.5" />
                  </div>
                  <div>
                    <label htmlFor="company" className="text-sm font-medium">
                      Company
                    </label>
                    <Input id="company" placeholder="Acme Corp" className="mt-1.5" />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium">
                      How can we help?
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tell us about your project..."
                      className="mt-1.5 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={cn(buttonVariants(), "mt-6 w-full shadow-md shadow-primary/20 sm:w-auto")}
                >
                  Send message
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
