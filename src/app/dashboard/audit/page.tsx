"use client";

import { Download, Filter } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const events = [
  { event: "user.session.create", actor: "Jordan Lee", ip: "192.168.1.42", outcome: "Success", time: "2 minutes ago" },
  { event: "user.mfa.verify", actor: "Jordan Lee", ip: "192.168.1.42", outcome: "Success", time: "2 minutes ago" },
  { event: "app.token.revoke", actor: "Avery Chen", ip: "10.0.0.15", outcome: "Success", time: "1 hour ago" },
  { event: "policy.update", actor: "Avery Chen", ip: "10.0.0.15", outcome: "Success", time: "3 hours ago" },
  { event: "user.login", actor: "Sam Rivera", ip: "203.0.113.88", outcome: "Failure", time: "5 hours ago" },
];

export default function AuditPage() {
  return (
    <>
      <DashboardTopbar
        title="System log"
        description="Review authentication events, policy changes, and administrative actions."
        actions={
          <div className="flex gap-2">
            <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            <button className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        }
      />

      <DashboardContent>
        <DataCard>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead className="hidden sm:table-cell">IP address</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead className="hidden md:table-cell">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((item) => (
                  <TableRow key={`${item.event}-${item.time}`} className="group">
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.event}</code>
                    </TableCell>
                    <TableCell className="font-medium">{item.actor}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">{item.ip}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          item.outcome === "Success"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        )}
                      >
                        {item.outcome}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{item.time}</TableCell>
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
