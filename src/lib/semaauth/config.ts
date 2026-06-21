import type { AdapterConfig, SemaAuthClientConfig } from "@semaauth/shared-types";

const DEFAULT_ISSUER = "http://localhost:8080";
const DEFAULT_TENANT = "00000000-0000-0000-0000-000000000001";
const DEFAULT_CLIENT = "semaauth_website";
const DEFAULT_REDIRECT = "http://localhost:3000/callback";

const PRODUCTION_ENV_KEYS = [
  "SEMAAUTH_ISSUER_URL",
  "SEMAAUTH_CLIENT_ID",
  "SEMAAUTH_TENANT_ID",
  "NEXT_PUBLIC_SEMAAUTH_ISSUER_URL",
  "NEXT_PUBLIC_SEMAAUTH_CLIENT_ID",
  "NEXT_PUBLIC_SEMAAUTH_REDIRECT_URI",
  "NEXT_PUBLIC_SEMAAUTH_TENANT_ID",
] as const;

function assertProductionEnv(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }
  const missing = PRODUCTION_ENV_KEYS.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }
}

assertProductionEnv();

/** Server-side adapter config for BFF routes. */
export function getAdapterConfig(): AdapterConfig {
  return {
    issuerUrl: process.env.SEMAAUTH_ISSUER_URL ?? DEFAULT_ISSUER,
    tenantResolver: "header",
    audience: process.env.SEMAAUTH_CLIENT_ID ?? DEFAULT_CLIENT,
    clientId: process.env.SEMAAUTH_CLIENT_ID ?? DEFAULT_CLIENT,
    tenantId: process.env.SEMAAUTH_TENANT_ID ?? DEFAULT_TENANT,
    cookieName: process.env.SEMAAUTH_REFRESH_COOKIE,
  };
}

/** Public PKCE client config for browser SDK (NEXT_PUBLIC_* only). */
export function getAuthClientConfig(): SemaAuthClientConfig {
  return {
    issuerUrl: process.env.NEXT_PUBLIC_SEMAAUTH_ISSUER_URL ?? DEFAULT_ISSUER,
    clientId: process.env.NEXT_PUBLIC_SEMAAUTH_CLIENT_ID ?? DEFAULT_CLIENT,
    redirectUri: process.env.NEXT_PUBLIC_SEMAAUTH_REDIRECT_URI ?? DEFAULT_REDIRECT,
    scope: "openid profile email",
  };
}

export function getTenantId(): string {
  return process.env.NEXT_PUBLIC_SEMAAUTH_TENANT_ID ?? DEFAULT_TENANT;
}

export const BFF_PATHS = {
  session: "/auth/session",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
} as const;
