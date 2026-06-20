"use client";

import { Download, Filter } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { DashboardDataState } from "@/components/dashboard/data-state";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminAuditEvents } from "@/hooks/use-admin-api";
import { formatEventType, formatRelativeTime } from "@/lib/semaauth/admin-format";
import { cn } from "@/lib/utils";

export default function AuditPage() {
  const { data, isLoading, isError, error, refetch } = useAdminAuditEvents({ limit: 50 });

  const events = data?.events ?? [];

  return (
    <>
      <DashboardTopbar
        title="System log"
        description="Review authentication events, policy changes, and administrative actions."
        actions={
          <div className="flex gap-2">
            <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")} disabled>
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")} disabled>
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        }
      />

      <DashboardContent>
        <DashboardDataState
          isLoading={isLoading}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          isEmpty={!isLoading && !isError && events.length === 0}
          emptyTitle="No audit events"
          emptyDescription="Events appear when users sign in or admins change settings."
          onRetry={() => void refetch()}
        >
          <DataCard>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead className="hidden sm:table-cell">IP address</TableHead>
                    <TableHead className="hidden md:table-cell">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                          {formatEventType(item.event_type)}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium font-mono text-xs">
                        {item.actor_user_id?.slice(0, 8) ?? "—"}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {item.ip_address ?? "—"}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {formatRelativeTime(item.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DataCard>
        </DashboardDataState>
      </DashboardContent>
    </>
  );
}
