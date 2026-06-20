"use client";

import { Bell, HelpCircle, Menu, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardNav } from "@/components/dashboard/nav-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DashboardTopbarProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function DashboardTopbar({ title, description, actions }: DashboardTopbarProps) {
  const { toggleMobile } = useDashboardNav();

  return (
    <div className="border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={toggleMobile}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden max-w-sm flex-1 sm:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="h-9 border-border/60 bg-muted/40 pl-9 focus-visible:ring-primary/30"
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Help">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </Button>
        </div>
      </div>

      {(title || actions) && (
        <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-5">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </motion.div>
          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.35 }}
              className="flex shrink-0 items-center gap-2"
            >
              {actions}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
