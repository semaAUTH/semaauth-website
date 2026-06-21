/** Restrict post-login redirects to same-origin relative paths. */
export function safeReturnTo(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw) {
    return fallback;
  }
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }
  try {
    const parsed = new URL(trimmed, "http://local.invalid");
    if (parsed.origin !== "http://local.invalid") {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
