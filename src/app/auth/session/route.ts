import { NextResponse } from "next/server";
import { refreshCookieName, refreshCookieOptions } from "@/lib/semaauth/cookies";

export async function POST(request: Request) {
  const body = (await request.json()) as { refresh_token?: string };
  const refreshToken = body.refresh_token;

  if (!refreshToken || typeof refreshToken !== "string") {
    return NextResponse.json({ error: "missing_refresh_token" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(refreshCookieName(), refreshToken, refreshCookieOptions());
  return response;
}
