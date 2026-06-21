import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidBffSessionRequest } from "@/lib/semaauth/bff-session";
import { refreshCookieName, refreshCookieOptions } from "@/lib/semaauth/cookies";

export async function POST(request: Request) {
  if (!isValidBffSessionRequest(request)) {
    return NextResponse.json({ error: "invalid_session_request" }, { status: 403 });
  }

  const body = (await request.json()) as { refresh_token?: string };
  const refreshToken = body.refresh_token;

  if (!refreshToken || typeof refreshToken !== "string") {
    return NextResponse.json({ error: "missing_refresh_token" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(refreshCookieName(), refreshToken, refreshCookieOptions());
  return response;
}
