import {
  DEFAULT_REFRESH_COOKIE,
  readCookie,
  refreshAccessToken,
} from "@semaauth/adapter-core";
import { NextResponse } from "next/server";
import { getAdapterConfig } from "@/lib/semaauth/config";
import { refreshCookieName, refreshCookieOptions } from "@/lib/semaauth/cookies";

export async function POST(request: Request) {
  const config = getAdapterConfig();
  const cookieName = config.cookieName ?? DEFAULT_REFRESH_COOKIE;
  const refreshToken = readCookie(request.headers.get("cookie") ?? undefined, cookieName);

  if (!refreshToken) {
    return NextResponse.json({ error: "missing_refresh_token" }, { status: 401 });
  }

  const result = await refreshAccessToken({ config, refreshToken });
  if (!result.ok) {
    return NextResponse.json(result.body, { status: result.status });
  }

  const response = NextResponse.json(result.session);
  if (result.rotatedRefreshToken) {
    response.cookies.set(
      refreshCookieName(),
      result.rotatedRefreshToken,
      refreshCookieOptions()
    );
  }
  return response;
}
