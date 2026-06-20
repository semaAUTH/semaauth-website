"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useSemaAuth } from "@semaauth/sdk-web";
import {
  BadgeCheck,
  ChevronDown,
  CreditCard,
  FileSearch,
  KeyRound,
  LayoutGrid,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useDashboardNav } from "@/components/dashboard/nav-context";
import { cn } from "@/lib/utils";

export const dashboardMenu = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/dashboard/apps", label: "Applications", icon: KeyRound },
  { href: "/dashboard/users", label: "Users & groups", icon: Users },
  { href: "/dashboard/security", label: "Security policies", icon: BadgeCheck },
  { href: "/dashboard/audit", label: "System log", icon: FileSearch },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
      {dashboardMenu.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "border-l-2 border-sidebar-accent bg-white/10 pl-[10px] text-white shadow-sm"
                : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function userInitials(email?: string, name?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (!email) return "?";
  const local = email.split("@")[0] ?? "";
  return local.slice(0, 2).toUpperCase() || "?";
}

function SidebarFooter() {
  const user = useUser();
  const { signOut } = useSemaAuth();
  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "User";

  return (
    <div className="border-t border-white/10 px-4 py-4">
      <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-600 text-xs font-bold text-sidebar">
          {userInitials(user?.email, user?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{displayName}</p>
          <p className="truncate text-xs text-sidebar-foreground/60">{user?.email ?? "Org admin"}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function OrgSwitcher() {
  return (
    <div className="border-b border-white/10 px-4 py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-white/8 bg-white/5 px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/30 hover:bg-white/8"
      >
        <div>
          <p className="font-semibold text-sidebar-foreground">Acme Corporation</p>
          <p className="text-xs text-sidebar-foreground/60">Production tenant</p>
        </div>
        <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
      </button>
    </div>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="relative flex h-full w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground shadow-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Logo variant="light" />
      </div>
      <OrgSwitcher />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}

export function DashboardMobileNav() {
  const { mobileOpen, closeMobile } = useDashboardNav();

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar text-sidebar-foreground shadow-2xl lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <Logo variant="light" />
              <button
                type="button"
                onClick={closeMobile}
                className="flex h-9 w-9 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-white/10"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <OrgSwitcher />
            <SidebarNav onNavigate={closeMobile} />
            <SidebarFooter />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
