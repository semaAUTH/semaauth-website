"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  KeyRound,
  LayoutGrid,
  ShieldCheck,
  Users,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: KeyRound, label: "Applications" },
  { icon: Users, label: "Users & groups" },
  { icon: BadgeCheck, label: "Security policies" },
];

const metrics = [
  { label: "Active users", value: "12,480" },
  { label: "Applications", value: "18" },
  { label: "MFA adoption", value: "74%" },
  { label: "Auth success", value: "99.2%" },
];

const activity = [
  { event: "OAuth client created", user: "Avery Chen", time: "2m" },
  { event: "Passkey enrolled", user: "Jordan Lee", time: "18m" },
  { event: "Token revoked", user: "Priya Shah", time: "1h" },
];

export function HeroProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        x: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
      }}
      className="relative"
    >
      <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
      <div className="relative overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/10">
        {/* Browser chrome */}
        <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[11px] text-muted-foreground">
            console.semaauth.com · Acme Corporation
          </span>
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        </div>

        <div className="flex min-h-[340px]">
          {/* Sidebar */}
          <div className="hidden w-44 shrink-0 border-r border-border bg-sidebar sm:block">
            <div className="border-b border-white/10 px-3 py-3">
              <p className="text-xs font-semibold text-white">Acme Corp</p>
              <p className="text-[10px] text-sidebar-foreground/50">Production</p>
            </div>
            <nav className="space-y-0.5 p-2">
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] font-medium ${
                    item.active
                      ? "border-l-2 border-primary bg-white/10 pl-2 text-white"
                      : "text-sidebar-foreground/60"
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-wider text-primary uppercase">
                  Overview
                </p>
                <p className="text-sm font-semibold">Organization dashboard</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <Activity className="h-2.5 w-2.5" />
                Healthy
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="rounded-lg border border-border bg-muted/30 p-2.5"
                >
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  <p className="text-base font-semibold">{m.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-3 rounded-lg border border-border">
              <div className="border-b border-border px-3 py-2">
                <p className="text-[11px] font-semibold">Recent activity</p>
              </div>
              {activity.map((row) => (
                <div
                  key={row.event}
                  className="flex items-center justify-between border-b border-border px-3 py-2 last:border-0"
                >
                  <div>
                    <p className="text-[11px] font-medium">{row.event}</p>
                    <p className="text-[10px] text-muted-foreground">{row.user}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{row.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="absolute -bottom-4 -left-4 hidden rounded-lg border border-border bg-background px-3 py-2 shadow-lg sm:block"
      >
        <p className="text-[10px] text-muted-foreground">Tenant isolation</p>
        <p className="text-xs font-semibold text-primary">RLS enforced</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="absolute -top-3 -right-3 hidden rounded-lg border border-border bg-background px-3 py-2 shadow-lg md:block"
      >
        <p className="text-[10px] text-muted-foreground">PKCE compliance</p>
        <p className="text-xs font-semibold text-emerald-600">100%</p>
      </motion.div>
    </motion.div>
  );
}
