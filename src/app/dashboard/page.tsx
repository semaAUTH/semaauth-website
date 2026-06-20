"use client";

import Link from "next/link";
import { ArrowUpRight, Plus, TrendingUp } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  AnimatedBar,
  DashboardContent,
  DataCard,
  MetricCard,
} from "@/components/dashboard/dashboard-content";
import { DashboardDataState } from "@/components/dashboard/data-state";
import { buttonVariants } from "@/components/ui/button";
import { useAdminAuditEvents, useAdminUsers } from "@/hooks/use-admin-api";
import { formatEventType, formatRelativeTime, userDisplayName } from "@/lib/semaauth/admin-format";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function DashboardPage() {
  const usersQuery = useAdminUsers();
  const auditQuery = useAdminAuditEvents({ limit: 10 });

  const isLoading = usersQuery.isLoading || auditQuery.isLoading;
  const isError = usersQuery.isError || auditQuery.isError;
  const errorMessage =
    (usersQuery.error instanceof Error && usersQuery.error.message) ||
    (auditQuery.error instanceof Error && auditQuery.error.message) ||
    undefined;

  const userCount = usersQuery.data?.users.length ?? 0;
  const verifiedCount = usersQuery.data?.users.filter((u) => u.is_email_verified).length ?? 0;
  const mfaPct = userCount > 0 ? Math.round((verifiedCount / userCount) * 100) : 0;
  const auditCount = auditQuery.data?.events.length ?? 0;

  const metrics = useMemo(
    () => [
      { label: "Users", value: String(userCount), accent: "teal" as const },
      { label: "Verified email", value: String(verifiedCount), accent: "blue" as const },
      { label: "Recent events", value: String(auditCount), accent: "emerald" as const },
      {
        label: "Verification rate",
        value: userCount > 0 ? `${mfaPct}%` : "—",
        accent: "amber" as const,
      },
    ],
    [userCount, verifiedCount, auditCount, mfaPct]
  );

  const activity = auditQuery.data?.events ?? [];
  const userById = useMemo(() => {
    const map = new Map<string, string>();
    for (const u of usersQuery.data?.users ?? []) {
      map.set(u.id, userDisplayName(u));
    }
    return map;
  }, [usersQuery.data?.users]);

  return (
    <>
      <DashboardTopbar
        title="Overview"
        description="Monitor authentication health and recent activity across your organization."
        actions={
          <Link href="/dashboard/apps" className={cn(buttonVariants({ size: "sm" }), "gap-1.5 shadow-sm")}>
            <Plus className="h-3.5 w-3.5" />
            Add application
          </Link>
        }
      />

      <DashboardContent>
        <DashboardDataState
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          onRetry={() => {
            void usersQuery.refetch();
            void auditQuery.refetch();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, i) => (
              <MetricCard key={metric.label} {...metric} delay={i * 0.06} />
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <DataCard delay={0.2} className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Organization health</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <TrendingUp className="h-3 w-3" />
                  Live data
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {[
                  {
                    label: "Email verified",
                    pct: userCount > 0 ? Math.round((verifiedCount / userCount) * 100) : 0,
                  },
                  {
                    label: "Users with activity (sample)",
                    pct: userCount > 0 ? Math.min(100, Math.round((auditCount / userCount) * 100)) : 0,
                  },
                  { label: "Admin API reachable", pct: isError ? 0 : 100 },
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
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-primary/5"
                  >
                    <span className="text-muted-foreground group-hover:text-foreground">
                      {action.label}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </DataCard>
          </div>

          <DataCard delay={0.35} className="mt-6">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-xl font-semibold">Recent activity</h2>
            </div>
            {activity.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground">No recent audit events.</p>
            ) : (
              <div className="divide-y divide-border">
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-muted/30"
                  >
                    <div>
                      <p className="text-sm font-medium">{formatEventType(item.event_type)}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.actor_user_id
                          ? userById.get(item.actor_user_id) ?? item.actor_user_id.slice(0, 8)
                          : "System"}
                        {item.ip_address ? ` · ${item.ip_address}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </DataCard>
        </DashboardDataState>
      </DashboardContent>
    </>
  );
}
