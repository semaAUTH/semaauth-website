import { DEFAULT_REFRESH_COOKIE, readCookie, revokeRefreshToken } from "@semaauth/adapter-core";
import { NextResponse } from "next/server";
import { getAdapterConfig } from "@/lib/semaauth/config";
import { refreshCookieName, refreshCookieOptions } from "@/lib/semaauth/cookies";

export async function POST(request: Request) {
  const config = getAdapterConfig();
  const cookieName = config.cookieName ?? DEFAULT_REFRESH_COOKIE;
  const refreshToken = readCookie(request.headers.get("cookie") ?? undefined, cookieName);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(refreshCookieName(), "", { ...refreshCookieOptions(), maxAge: 0 });

  if (refreshToken) {
    await revokeRefreshToken({ config, refreshToken });
  }

  return response;
}
