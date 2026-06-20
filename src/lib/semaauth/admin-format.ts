import type { AdminUser } from "@/lib/semaauth/admin-types";

export function userDisplayName(user: AdminUser): string {
  if (user.display_name?.trim()) return user.display_name.trim();
  const local = user.email.split("@")[0];
  return local ? local.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : user.email;
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

export function formatEventType(eventType: string): string {
  return eventType.replace(/\./g, " · ").replace(/_/g, " ");
}
