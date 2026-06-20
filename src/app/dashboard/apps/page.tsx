"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Plus } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { StatusBadge } from "@/components/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const apps = [
  {
    name: "Customer Portal",
    clientId: "app_7k2m9x...",
    type: "Single-page app",
    grantType: "Authorization Code + PKCE",
    status: "active" as const,
    lastUsed: "2 min ago",
  },
  {
    name: "Admin Console",
    clientId: "app_3p8n1w...",
    type: "Confidential",
    grantType: "Authorization Code",
    status: "active" as const,
    lastUsed: "15 min ago",
  },
  {
    name: "Mobile SDK",
    clientId: "app_5j4r6t...",
    type: "Native",
    grantType: "Authorization Code + PKCE",
    status: "pending" as const,
    lastUsed: "Never",
  },
  {
    name: "API Gateway",
    clientId: "app_9h2k8m...",
    type: "Machine-to-machine",
    grantType: "Client credentials",
    status: "active" as const,
    lastUsed: "1 hour ago",
  },
];

export default function AppsPage() {
  return (
    <>
      <DashboardTopbar
        title="Applications"
        description="Manage OAuth clients, redirect URIs, and grant types for your applications."
        actions={
          <button className={cn(buttonVariants({ size: "sm" }), "gap-1.5 shadow-sm")}>
            <Plus className="h-3.5 w-3.5" />
            Create application
          </button>
        }
      />

      <DashboardContent>
        <DataCard>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Grant type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Last used</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.map((app, i) => (
                  <TableRow key={app.clientId} className="group">
                    <TableCell className="font-medium">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        {app.name}
                      </motion.span>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{app.clientId}</code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{app.type}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {app.grantType}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={app.status === "active" ? "active" : "pending"}
                        label={app.status === "active" ? "Active" : "Pending review"}
                      />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {app.lastUsed}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="More actions"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DataCard>
      </DashboardContent>
    </>
  );
}
