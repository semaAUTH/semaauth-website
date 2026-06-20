"use client";

import { DashboardMobileNav, DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  DashboardNavProvider,
  useDashboardNav,
} from "@/components/dashboard/nav-context";
import { DashboardAuthGate } from "@/components/auth/dashboard-auth-gate";
import { useBodyScrollLock } from "@/components/dashboard/dashboard-content";

function DashboardShellInner({ children }: { children: React.ReactNode }) {
  const { mobileOpen } = useDashboardNav();
  useBodyScrollLock(mobileOpen);

  return (
    <div className="relative flex h-screen overflow-hidden bg-muted/30">
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
      <div className="relative hidden lg:flex">
        <DashboardSidebar />
      </div>
      <DashboardMobileNav />
      <main className="relative flex flex-1 flex-col overflow-hidden">
        <DashboardAuthGate>{children}</DashboardAuthGate>
      </main>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardNavProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </DashboardNavProvider>
  );
}
