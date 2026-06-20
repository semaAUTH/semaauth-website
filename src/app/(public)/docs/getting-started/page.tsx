import { GettingStartedPageContent } from "@/components/marketing/getting-started-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Getting started",
  description:
    "Launch your semaAUTH setup in minutes. Create a tenant, register an OAuth client, install the SDK, and enable MFA.",
  path: "/docs/getting-started",
});

export default function GettingStartedPage() {
  return <GettingStartedPageContent />;
}
