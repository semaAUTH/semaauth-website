"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { AnimatedBar, DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const billingInfo = [
  { label: "Current plan", value: "Growth" },
  { label: "Billing cycle", value: "Monthly" },
  { label: "Next renewal", value: "July 24, 2026" },
  { label: "Payment method", value: "Visa ending in 4242" },
];

const usage = [
  { label: "Monthly active users", used: 8420, limit: 10000 },
  { label: "Tenants", used: 3, limit: 5 },
  { label: "Applications", used: 18, limit: 50 },
];

export default function BillingPage() {
  return (
    <>
      <DashboardTopbar
        title="Billing"
        description="Manage your subscription, view usage, and update payment details."
        actions={
          <button className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Upgrade plan
          </button>
        }
      />

      <DashboardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          <DataCard delay={0.05} className="p-6">
            <h2 className="font-semibold">Subscription</h2>
            <dl className="mt-4 space-y-4">
              {billingInfo.map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted-foreground">{item.label}</dt>
                  <dd className="text-sm font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
            <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-6")}>
              Manage payment
            </button>
          </DataCard>

          <DataCard delay={0.12} className="p-6">
            <h2 className="font-semibold">Usage this period</h2>
            <div className="mt-4 space-y-5">
              {usage.map((item) => {
                const pct = Math.round((item.used / item.limit) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">
                        {item.used.toLocaleString()} / {item.limit.toLocaleString()}
                      </span>
                    </div>
                    <AnimatedBar pct={pct} className="mt-2" />
                  </div>
                );
              })}
            </div>
          </DataCard>
        </div>
      </DashboardContent>
    </>
  );
}
