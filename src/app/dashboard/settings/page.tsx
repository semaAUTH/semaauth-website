"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { DashboardDataState } from "@/components/dashboard/data-state";
import { useTenantSettings } from "@/hooks/use-admin-api";

function formatSettingValue(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value, null, 2);
}

export default function SettingsPage() {
  const { data, isLoading, isError, error, refetch } = useTenantSettings();

  const settings = data?.settings ?? {};
  const entries = Object.entries(settings);

  return (
    <>
      <DashboardTopbar
        title="Settings"
        description="Configure organization preferences, session behavior, and branding."
      />

      <DashboardContent>
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Organization
            </h2>
            <DashboardDataState
              isLoading={isLoading}
              isError={isError}
              errorMessage={error instanceof Error ? error.message : undefined}
              onRetry={() => void refetch()}
            >
              <DataCard className="mt-3">
                <div className="divide-y divide-border">
                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">Tenant ID</p>
                      <p className="mt-0.5 font-mono text-sm text-muted-foreground">
                        {data?.tenant_id ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </DataCard>
            </DashboardDataState>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Tenant settings
            </h2>
            <DashboardDataState
              isLoading={isLoading}
              isError={isError}
              isEmpty={!isLoading && !isError && entries.length === 0}
              emptyTitle="No settings configured"
              emptyDescription="Settings are stored as JSON on the tenant record."
              onRetry={() => void refetch()}
            >
              <DataCard delay={0.08} className="mt-3">
                <div className="divide-y divide-border">
                  {entries.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col gap-1 px-6 py-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <p className="text-sm font-medium">{key.replace(/_/g, " ")}</p>
                      <pre className="max-w-full overflow-x-auto text-sm whitespace-pre-wrap text-muted-foreground sm:max-w-md sm:text-right">
                        {formatSettingValue(value)}
                      </pre>
                    </div>
                  ))}
                </div>
              </DataCard>
            </DashboardDataState>
          </div>
        </div>
      </DashboardContent>
    </>
  );
}
