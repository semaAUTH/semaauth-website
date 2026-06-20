"use client";

import { MoreHorizontal, Plus, Search } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { StatusBadge } from "@/components/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const users = [
  { name: "Avery Chen", email: "avery@acme.io", role: "Owner", mfa: "Passkey", status: "active" as const, lastLogin: "2 min ago" },
  { name: "Jordan Lee", email: "jordan@acme.io", role: "Admin", mfa: "TOTP", status: "active" as const, lastLogin: "1 hour ago" },
  { name: "Priya Shah", email: "priya@acme.io", role: "Member", mfa: "TOTP", status: "active" as const, lastLogin: "3 hours ago" },
  { name: "Sam Rivera", email: "sam@acme.io", role: "Member", mfa: "None", status: "pending" as const, lastLogin: "Never" },
];

function UserAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-teal-500/10 text-xs font-semibold text-primary">
      {initials}
    </div>
  );
}

export default function UsersPage() {
  return (
    <>
      <DashboardTopbar
        title="Users & groups"
        description="Manage organization members, roles, and group assignments."
        actions={
          <button className={cn(buttonVariants({ size: "sm" }), "gap-1.5 shadow-sm")}>
            <Plus className="h-3.5 w-3.5" />
            Invite user
          </button>
        }
      />

      <DashboardContent>
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." className="h-9 bg-background pl-9" />
          </div>
        </div>

        <DataCard delay={0.1}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">MFA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Last login</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">{user.mfa}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={user.status === "active" ? "active" : "pending"}
                        label={user.status === "active" ? "Active" : "Pending MFA"}
                      />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{user.lastLogin}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon-sm" aria-label="More actions" className="opacity-0 group-hover:opacity-100">
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
