"use client";

import { AlertCircle, Loader2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardDataStateProps = {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  errorMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export function DashboardDataState({
  isLoading,
  isError,
  isEmpty,
  errorMessage,
  emptyTitle = "No data yet",
  emptyDescription,
  onRetry,
  className,
  children,
}: DashboardDataStateProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-background px-6 py-16 text-center",
          className
        )}
      >
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center",
          className
        )}
      >
        <AlertCircle className="h-6 w-6 text-destructive" />
        <div>
          <p className="font-medium">Could not load data</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {errorMessage ?? "Check that backend-core is running and you have admin access."}
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-background px-6 py-16 text-center",
          className
        )}
      >
        <Inbox className="h-6 w-6 text-muted-foreground" />
        <div>
          <p className="font-medium">{emptyTitle}</p>
          {emptyDescription && (
            <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
