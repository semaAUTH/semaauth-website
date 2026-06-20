"use client";

import { useSemaAuth } from "@semaauth/sdk-web";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";

type DashboardAuthGateProps = {
  children: ReactNode;
};

export function DashboardAuthGate({ children }: DashboardAuthGateProps) {
  const { session, refreshSession, isRefreshing } = useSemaAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      if (session?.isAuthenticated) {
        setChecking(false);
        return;
      }

      const next = await refreshSession();
      if (cancelled) return;

      if (!next?.isAuthenticated) {
        const returnTo = encodeURIComponent(window.location.pathname);
        router.replace(`/login?returnTo=${returnTo}`);
        return;
      }

      setChecking(false);
    }

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [session?.isAuthenticated, refreshSession, router]);

  if (checking || isRefreshing) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-muted/30">
        <Logo />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Verifying session…
        </div>
      </div>
    );
  }

  if (!session?.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
