"use client";

import { MoreHorizontal, Plus, Search } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { DashboardDataState } from "@/components/dashboard/data-state";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminUsers, useRevokeUserSessions } from "@/hooks/use-admin-api";
import { formatRelativeTime, userDisplayName } from "@/lib/semaauth/admin-format";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-teal-500/10 text-xs font-semibold text-primary">
      {initials}
    </div>
  );
}

export default function UsersPage() {
  const { data, isLoading, isError, error, refetch } = useAdminUsers();
  const revokeSessions = useRevokeUserSessions();
  const [query, setQuery] = useState("");

  const users = useMemo(() => {
    const list = data?.users ?? [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        userDisplayName(u).toLowerCase().includes(q)
    );
  }, [data?.users, query]);

  return (
    <>
      <DashboardTopbar
        title="Users & groups"
        description="Manage organization members, roles, and group assignments."
        actions={
          <button className={cn(buttonVariants({ size: "sm" }), "gap-1.5 shadow-sm")} disabled>
            <Plus className="h-3.5 w-3.5" />
            Invite user
          </button>
        }
      />

      <DashboardContent>
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="h-9 bg-background pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <DashboardDataState
          isLoading={isLoading}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          isEmpty={!isLoading && !isError && users.length === 0}
          emptyTitle="No users found"
          emptyDescription={query ? "Try a different search term." : "Users will appear once they sign up."}
          onRetry={() => void refetch()}
        >
          <DataCard delay={0.1}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Verified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Joined</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const name = userDisplayName(user);
                    return (
                      <TableRow key={user.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <UserAvatar name={name} />
                            <div>
                              <p className="font-medium">{name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {user.is_email_verified ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={user.is_email_verified ? "active" : "pending"}
                            label={user.is_email_verified ? "Active" : "Unverified"}
                          />
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {formatRelativeTime(user.created_at)}
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            aria-label="Revoke sessions"
                            disabled={revokeSessions.isPending}
                            onClick={() => revokeSessions.mutate(user.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
                            title="Revoke all sessions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </DataCard>
        </DashboardDataState>
      </DashboardContent>
    </>
  );
}
