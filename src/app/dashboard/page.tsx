"use client";

import { ArrowUpRight, Plus, TrendingUp } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  AnimatedBar,
  DashboardContent,
  DataCard,
  MetricCard,
} from "@/components/dashboard/dashboard-content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Active users", value: "1,248", change: "+12%", accent: "teal" as const },
  { label: "Applications", value: "18", change: "+2", accent: "blue" as const },
  { label: "Sign-ins (7d)", value: "8,432", change: "+8%", accent: "emerald" as const },
  { label: "MFA adoption", value: "74%", change: "+5%", accent: "amber" as const },
];

const activity = [
  { action: "OAuth client created", actor: "Avery Chen", resource: "Mobile SDK", time: "2 min ago" },
  { action: "Passkey enrolled", actor: "Jordan Lee", resource: "User profile", time: "18 min ago" },
  { action: "Token revoked", actor: "Priya Shah", resource: "Session #4821", time: "1 hour ago" },
  { action: "Policy updated", actor: "Avery Chen", resource: "MFA enforcement", time: "3 hours ago" },
  { action: "User invited", actor: "Avery Chen", resource: "sam@acme.io", time: "5 hours ago" },
];

export default function DashboardPage() {
  return (
    <>
      <DashboardTopbar
        title="Overview"
        description="Monitor authentication health and recent activity across your organization."
        actions={
          <a href="/dashboard/apps" className={cn(buttonVariants({ size: "sm" }), "gap-1.5 shadow-sm")}>
            <Plus className="h-3.5 w-3.5" />
            Add application
          </a>
        }
      />

      <DashboardContent>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, i) => (
            <MetricCard key={metric.label} {...metric} delay={i * 0.06} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <DataCard delay={0.2} className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Authentication health</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                Healthy
              </span>
            </div>
            <div className="mt-6 space-y-5">
              {[
                { label: "Successful logins", pct: 96 },
                { label: "MFA completion rate", pct: 88 },
                { label: "Token refresh success", pct: 99 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">{item.pct}%</span>
                  </div>
                  <AnimatedBar pct={item.pct} className="mt-2" />
                </div>
              ))}
            </div>
          </DataCard>

          <DataCard delay={0.28} className="p-6">
            <h2 className="text-xl font-semibold">Quick actions</h2>
            <div className="mt-4 space-y-1">
              {[
                { label: "Invite a team member", href: "/dashboard/users" },
                { label: "Create OAuth application", href: "/dashboard/apps" },
                { label: "Review security policies", href: "/dashboard/security" },
                { label: "Export audit log", href: "/dashboard/audit" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-primary/5"
                >
                  <span className="text-muted-foreground group-hover:text-foreground">
                    {action.label}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </a>
              ))}
            </div>
          </DataCard>
        </div>

        <DataCard delay={0.35} className="mt-6">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-xl font-semibold">Recent activity</h2>
          </div>
          <div className="divide-y divide-border">
            {activity.map((item) => (
              <div
                key={`${item.action}-${item.time}`}
                className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-muted/30"
              >
                <div>
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.actor} · {item.resource}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </DataCard>
      </DashboardContent>
    </>
  );
}
