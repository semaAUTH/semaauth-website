import { NextResponse } from "next/server";
import { getAdapterConfig } from "@/lib/semaauth/config";

/** Proxy an authenticated request to backend-core admin APIs. */
export async function proxyAdminRequest(
  request: Request,
  backendPath: string,
  init: RequestInit = {}
): Promise<NextResponse> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "unauthorized", error_description: "Bearer access token required" },
      { status: 401 }
    );
  }

  const config = getAdapterConfig();
  const issuer = config.issuerUrl.replace(/\/$/, "");
  const url = `${issuer}${backendPath.startsWith("/") ? backendPath : `/${backendPath}`}`;

  const headers = new Headers(init.headers);
  headers.set("Authorization", authorization);
  if (config.tenantId) {
    headers.set("X-Tenant-ID", config.tenantId);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, { ...init, headers, cache: "no-store" });
  } catch {
    return NextResponse.json(
      { error: "upstream_error", error_description: "Could not reach semaAUTH backend" },
      { status: 502 }
    );
  }

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}
