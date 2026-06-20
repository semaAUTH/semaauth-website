import { DocsPageContent } from "@/components/marketing/docs-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Documentation",
  description:
    "Developer documentation for semaAUTH — quickstart guides, architecture overview, API reference, and integration guides for React, Express, and NestJS.",
  path: "/docs",
});

export default function DocsPage() {
  return <DocsPageContent />;
}
