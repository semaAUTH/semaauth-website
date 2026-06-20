import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Applications",
  description: "Manage OAuth clients, redirect URIs, and application settings.",
  noIndex: true,
});

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
