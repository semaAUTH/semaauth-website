"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { startPkceLogin } from "@semaauth/sdk-web";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  discoverOrganizations,
  type DiscoveredOrganization,
} from "@/lib/semaauth/org-discovery";
import { getAuthClientConfig, getTenantId } from "@/lib/semaauth/config";
import { safeReturnTo } from "@/lib/semaauth/safe-return-to";
import { cn } from "@/lib/utils";

const RETURN_TO_KEY = "semaauth_return_to";

export function LoginPageContent() {
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const isDev = process.env.NODE_ENV === "development";
  const defaultTenantId = getTenantId();

  const [email, setEmail] = useState("");
  const [orgs, setOrgs] = useState<DiscoveredOrganization[] | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDiscover(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setOrgs(null);
    setSelectedTenantId(null);

    try {
      const config = getAuthClientConfig();
      const discovered = await discoverOrganizations(config.issuerUrl, email, defaultTenantId);
      if (discovered.length === 0) {
        setError("No organizations found for this email domain. Check the address or contact your admin.");
        return;
      }
      setOrgs(discovered);
      if (discovered.length === 1) {
        setSelectedTenantId(discovered[0].tenant_id);
      }
    } catch {
      setError("Could not look up organizations. Ensure the auth server is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleSignIn() {
    const tenantId = selectedTenantId ?? defaultTenantId;
    sessionStorage.setItem(RETURN_TO_KEY, returnTo);
    void startPkceLogin(getAuthClientConfig(), { tenantId });
  }

  return (
    <div className="hero-gradient relative flex min-h-screen flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-30" />

      <header className="relative border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6 lg:px-8">
          <Logo />
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">Sign in to semaAUTH</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Enter your work email to find your organization, then continue to sign in.
            </p>

            <form onSubmit={handleDiscover} className="mt-6 space-y-3">
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
              >
                {loading ? "Looking up…" : "Find organization"}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            {orgs && orgs.length > 1 && (
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium">Select your organization</p>
                {orgs.map((org) => (
                  <button
                    key={org.tenant_id}
                    type="button"
                    onClick={() => setSelectedTenantId(org.tenant_id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                      selectedTenantId === org.tenant_id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      <span className="font-medium">{org.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{org.issuer_domain}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {orgs && orgs.length === 1 && (
              <p className="mt-4 text-sm text-muted-foreground">
                Signing in to <span className="font-medium text-foreground">{orgs[0].name}</span>
              </p>
            )}

            <button
              type="button"
              onClick={handleSignIn}
              disabled={orgs !== null && !selectedTenantId}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 w-full shadow-md shadow-primary/20",
                orgs !== null && !selectedTenantId && "pointer-events-none opacity-50",
              )}
            >
              Continue with semaAUTH
              <ArrowRight className="h-4 w-4" />
            </button>

            {isDev && orgs === null && (
              <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm">
                <p className="font-medium">Dev credentials</p>
                <p className="mt-1 text-muted-foreground">
                  <code className="text-foreground">dev@example.com</code> /{" "}
                  <code className="text-foreground">password123</code>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Requires backend-core on{" "}
                  <code>{process.env.NEXT_PUBLIC_SEMAAUTH_ISSUER_URL ?? "http://localhost:8080"}</code>
                </p>
              </div>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to semaAUTH?{" "}
              <Link href="/docs/getting-started" className="font-medium text-primary hover:underline">
                Get started
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
