"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  completePkceCallback,
  useSemaAuth,
  verifyMfaChallenge,
  type MfaChallenge,
} from "@semaauth/sdk-web";
import type { WebSession } from "@semaauth/shared-types";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { getAuthClientConfig, getTenantId } from "@/lib/semaauth/config";
import { cn } from "@/lib/utils";

const RETURN_TO_KEY = "semaauth_return_to";

export function CallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession, sessionUrl } = useSemaAuth();
  const [error, setError] = useState<string | null>(null);
  const [mfaChallenge, setMfaChallenge] = useState<MfaChallenge | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const started = useRef(false);

  const returnTo =
    (typeof window !== "undefined" ? sessionStorage.getItem(RETURN_TO_KEY) : null) ??
    searchParams.get("returnTo") ??
    "/dashboard";

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    completePkceCallback({
      config: getAuthClientConfig(),
      tenantId: getTenantId(),
      bffSessionUrl: sessionUrl,
    })
      .then((result) => {
        if ("status" in result && result.status === "MFA_REQUIRED") {
          setMfaChallenge(result.challenge);
          return;
        }
        sessionStorage.removeItem(RETURN_TO_KEY);
        setSession(result as WebSession);
        router.replace(returnTo);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Token exchange failed");
      });
  }, [returnTo, router, sessionUrl, setSession]);

  async function submitMfa(event: React.FormEvent) {
    event.preventDefault();
    if (!mfaChallenge) return;

    setVerifying(true);
    setError(null);

    try {
      const session = await verifyMfaChallenge({
        config: getAuthClientConfig(),
        tenantId: getTenantId(),
        mfaToken: mfaChallenge.mfaToken,
        method: "totp",
        code: mfaCode.trim(),
        bffSessionUrl: sessionUrl,
      });
      setSession(session);
      sessionStorage.removeItem(RETURN_TO_KEY);
      router.replace(returnTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "MFA verification failed");
    } finally {
      setVerifying(false);
    }
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
        <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-lg">
          {mfaChallenge ? (
            <form className="text-left" onSubmit={submitMfa}>
              <h1 className="text-xl font-semibold">Two-factor authentication</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter the 6-digit code from your authenticator app.
              </p>
              <label htmlFor="mfa-code" className="mt-6 block text-sm font-medium">
                Authenticator code
              </label>
              <input
                id="mfa-code"
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="000000"
                required
              />
              {error && (
                <p className="mt-3 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className={cn(buttonVariants(), "mt-4 w-full")}
                disabled={verifying || mfaCode.length < 6}
              >
                {verifying ? "Verifying…" : "Verify and continue"}
              </button>
            </form>
          ) : error ? (
            <>
              <h1 className="text-xl font-semibold">Sign-in failed</h1>
              <p className="mt-3 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "mt-6 inline-flex")}>
                Try again
              </Link>
            </>
          ) : (
            <>
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <h1 className="mt-4 text-xl font-semibold">Completing sign-in</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Exchanging your authorization code securely…
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
