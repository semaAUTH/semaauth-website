import type {
  AdminApiErrorBody,
  AdminAuditEventsResponse,
  AdminTenantSettingsResponse,
  AdminUsersResponse,
} from "@/lib/semaauth/admin-types";

export class AdminApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
  }
}

async function parseAdminResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let body: T | AdminApiErrorBody = {} as T;

  if (text) {
    try {
      body = JSON.parse(text) as T | AdminApiErrorBody;
    } catch {
      if (!response.ok) {
        throw new AdminApiError(response.status, "parse_error", text || response.statusText);
      }
    }
  }

  if (!response.ok) {
    const err = body as AdminApiErrorBody;
    throw new AdminApiError(
      response.status,
      err.error ?? "request_failed",
      err.error_description ?? response.statusText
    );
  }

  return body as T;
}

async function adminFetch<T>(
  accessToken: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`/api/admin${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  return parseAdminResponse<T>(response);
}

export function listUsers(accessToken: string, params?: { limit?: number; offset?: number }) {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const qs = search.toString();
  return adminFetch<AdminUsersResponse>(accessToken, `/users${qs ? `?${qs}` : ""}`);
}

export function listAuditEvents(
  accessToken: string,
  params?: { limit?: number; offset?: number; event_type?: string }
) {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  if (params?.event_type) search.set("event_type", params.event_type);
  const qs = search.toString();
  return adminFetch<AdminAuditEventsResponse>(
    accessToken,
    `/audit-events${qs ? `?${qs}` : ""}`
  );
}

export function getTenantSettings(accessToken: string) {
  return adminFetch<AdminTenantSettingsResponse>(accessToken, "/tenant/settings");
}

export function patchTenantSettings(accessToken: string, patch: Record<string, unknown>) {
  return adminFetch<AdminTenantSettingsResponse>(accessToken, "/tenant/settings", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function revokeUserSessions(accessToken: string, userId: string) {
  return adminFetch<{ revoked_count: number }>(
    accessToken,
    `/users/${encodeURIComponent(userId)}/sessions/revoke`,
    { method: "POST" }
  );
}
