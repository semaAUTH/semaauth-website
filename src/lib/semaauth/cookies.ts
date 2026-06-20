import { DEFAULT_REFRESH_COOKIE } from "@semaauth/adapter-core";

const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

export function refreshCookieName(): string {
  return process.env.SEMAAUTH_REFRESH_COOKIE ?? DEFAULT_REFRESH_COOKIE;
}

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: REFRESH_COOKIE_MAX_AGE,
    path: "/",
  };
}
