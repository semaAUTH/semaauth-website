"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DashboardContent, DataCard } from "@/components/dashboard/dashboard-content";
import { DashboardDataState } from "@/components/dashboard/data-state";
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
import { useAdminClients, useCreateClient } from "@/hooks/use-admin-api";
import { formatRelativeTime } from "@/lib/semaauth/admin-format";
import { cn } from "@/lib/utils";

function clientTypeLabel(type: string): string {
  return type === "confidential" ? "Confidential" : "Single-page app";
}

export default function AppsPage() {
  const { data, isLoading, isError, error, refetch } = useAdminClients();
  const createClient = useCreateClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [redirectUri, setRedirectUri] = useState("http://localhost:5174/callback");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    try {
      await createClient.mutateAsync({
        name: name.trim(),
        redirect_uris: [redirectUri.trim()],
      });
      setShowForm(false);
      setName("");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to create application");
    }
  }

  const clients = data?.clients ?? [];

  return (
    <>
      <DashboardTopbar
        title="Applications"
        description="Manage OAuth clients, redirect URIs, and scopes for your applications."
        actions={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5 shadow-sm")}
          >
            <Plus className="h-3.5 w-3.5" />
            Create application
          </button>
        }
      />

      <DashboardContent>
        {showForm && (
          <DataCard className="mb-6">
            <form onSubmit={handleCreate} className="space-y-4 p-6">
              <div>
                <label className="text-sm font-medium" htmlFor="app-name">
                  Application name
                </label>
                <Input
                  id="app-name"
                  className="mt-1.5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My web app"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="redirect-uri">
                  Redirect URI
                </label>
                <Input
                  id="redirect-uri"
                  className="mt-1.5 font-mono text-sm"
                  value={redirectUri}
                  onChange={(e) => setRedirectUri(e.target.value)}
                  required
                />
              </div>
              {formError && (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createClient.isPending}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  {createClient.isPending ? "Creating…" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                >
                  Cancel
                </button>
              </div>
            </form>
          </DataCard>
        )}

        <DashboardDataState
          isLoading={isLoading}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          onRetry={() => void refetch()}
          isEmpty={clients.length === 0}
          emptyTitle="No applications yet"
          emptyDescription="Create an OAuth client to integrate your first app with semaAUTH."
        >
          <DataCard>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Redirect URIs</TableHead>
                    <TableHead className="hidden sm:table-cell">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((app) => (
                    <TableRow key={app.client_id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{app.client_id}</code>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{clientTypeLabel(app.client_type)}</TableCell>
                      <TableCell className="hidden max-w-xs truncate text-muted-foreground md:table-cell">
                        {app.redirect_uris.join(", ")}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {formatRelativeTime(app.created_at)}
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
