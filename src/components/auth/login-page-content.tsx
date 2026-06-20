"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startPkceLogin } from "@semaauth/sdk-web";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { getAuthClientConfig, getTenantId } from "@/lib/semaauth/config";
import { cn } from "@/lib/utils";

const RETURN_TO_KEY = "semaauth_return_to";

export function LoginPageContent() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/dashboard";
  const isDev = process.env.NODE_ENV === "development";

  function handleSignIn() {
    sessionStorage.setItem(RETURN_TO_KEY, returnTo);
    void startPkceLogin(getAuthClientConfig(), { tenantId: getTenantId() });
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
              Access your organization console to manage applications, users, and security policies.
            </p>

            <button
              type="button"
              onClick={handleSignIn}
              className={cn(buttonVariants({ size: "lg" }), "mt-8 w-full shadow-md shadow-primary/20")}
            >
              Continue with semaAUTH
              <ArrowRight className="h-4 w-4" />
            </button>

            {isDev && (
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
