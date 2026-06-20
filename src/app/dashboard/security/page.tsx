"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const policies = [
  { name: "MFA enforcement", description: "Require multi-factor authentication for all admin users.", value: "Required for admins", status: "active" as const },
  { name: "Password policy", description: "Minimum length, complexity, and rotation requirements.", value: "12 characters minimum", status: "active" as const },
  { name: "Session rotation", description: "Rotate refresh tokens on each use to detect token theft.", value: "Enabled", status: "active" as const },
  { name: "Social account linking", description: "Require password confirmation before linking social IdPs.", value: "Confirmation required", status: "active" as const },
  { name: "IP allowlist", description: "Restrict admin console access to specific IP ranges.", value: "Not configured", status: "inactive" as const },
];

export default function SecurityPage() {
  return (
    <>
      <DashboardTopbar
        title="Security policies"
        description="Configure authentication requirements, session behavior, and access controls."
      />

      <DashboardContent>
        <div className="space-y-4">
          {policies.map((policy, i) => (
            <DataCard key={policy.name} delay={i * 0.06}>
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold">{policy.name}</h3>
                    <StatusBadge
                      status={policy.status === "active" ? "active" : "inactive"}
                      label={policy.status === "active" ? "Active" : "Not configured"}
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{policy.description}</p>
                  <p className="mt-2 text-sm font-medium">{policy.value}</p>
                </div>
                <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}>
                  Configure
                </button>
              </div>
            </DataCard>
          ))}
        </div>
      </DashboardContent>
    </>
  );
}
