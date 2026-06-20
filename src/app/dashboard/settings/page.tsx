"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const settings = [
  {
    section: "General",
    items: [
      { label: "Organization name", value: "Acme Corporation", editable: true },
      { label: "Issuer domain", value: "auth.acme.io", editable: true },
      { label: "Tenant ID", value: "ten_8k2m9x4p", editable: false },
    ],
  },
  {
    section: "Session",
    items: [
      { label: "Session timeout", value: "30 minutes", editable: true },
      { label: "Refresh token rotation", value: "Enabled", editable: true },
      { label: "Max concurrent sessions", value: "5 per user", editable: true },
    ],
  },
  {
    section: "Branding",
    items: [
      { label: "Custom login page", value: "Enabled", editable: true },
      { label: "Logo URL", value: "https://cdn.acme.io/logo.svg", editable: true },
      { label: "Primary color", value: "#0d9488", editable: true },
    ],
  },
];

export default function SettingsPage() {
  return (
    <>
      <DashboardTopbar
        title="Settings"
        description="Configure organization preferences, session behavior, and branding."
      />

      <DashboardContent>
        <div className="mx-auto max-w-3xl space-y-8">
          {settings.map((group, i) => (
            <div key={group.section}>
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                {group.section}
              </h2>
              <DataCard delay={i * 0.08} className="mt-3">
                <div className="divide-y divide-border">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/20"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{item.value}</p>
                      </div>
                      {item.editable && (
                        <button className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                          Edit
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </DataCard>
            </div>
          ))}
        </div>
      </DashboardContent>
    </>
  );
}
