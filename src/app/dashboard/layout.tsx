import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Admin console",
  description: "Manage tenants, applications, users, security policies, and billing in the semaAUTH admin console.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell>{children}</DashboardShell>;
}
