import { proxyAdminRequest } from "@/lib/semaauth/admin-proxy";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function forward(request: Request, context: RouteContext, method: string) {
  const { path } = await context.params;
  const backendPath = `/admin/${path.join("/")}${new URL(request.url).search}`;

  const init: RequestInit = { method };
  if (method !== "GET" && method !== "HEAD") {
    init.body = await request.text();
  }

  return proxyAdminRequest(request, backendPath, init);
}

export async function GET(request: Request, context: RouteContext) {
  return forward(request, context, "GET");
}

export async function POST(request: Request, context: RouteContext) {
  return forward(request, context, "POST");
}

export async function PATCH(request: Request, context: RouteContext) {
  return forward(request, context, "PATCH");
}
