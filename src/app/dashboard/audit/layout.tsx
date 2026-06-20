import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "System log",
  description: "Review audit events, token activity, and administrative actions.",
  noIndex: true,
});

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
