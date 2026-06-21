const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function segmentIsSafe(segment: string): boolean {
  if (!segment) return false;
  if (segment.includes(".") || segment.includes("%") || segment.includes("\\")) {
    return false;
  }
  return true;
}

/** Build a safe backend-core admin path or return null when traversal/unknown routes are requested. */
export function buildSafeAdminBackendPath(
  segments: string[],
  search: string,
): string | null {
  if (segments.length === 0 || segments.some((segment) => !segmentIsSafe(segment))) {
    return null;
  }

  switch (segments[0]) {
    case "users":
      if (segments.length === 1) {
        return `/admin/users${search}`;
      }
      if (segments.length === 2 && UUID_RE.test(segments[1]!)) {
        return `/admin/users/${segments[1]}${search}`;
      }
      if (
        segments.length === 4 &&
        UUID_RE.test(segments[1]!) &&
        segments[2] === "sessions" &&
        segments[3] === "revoke"
      ) {
        return `/admin/users/${segments[1]}/sessions/revoke${search}`;
      }
      return null;
    case "tenant":
      if (segments.length === 2 && segments[1] === "settings") {
        return `/admin/tenant/settings${search}`;
      }
      return null;
    case "audit-events":
      if (segments.length === 1) {
        return `/admin/audit-events${search}`;
      }
      return null;
    default:
      return null;
  }
}
