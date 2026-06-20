import { HomePageContent } from "@/components/marketing/home-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Identity for modern teams",
  description:
    "Enterprise-grade authentication and identity management. OAuth 2.1, OIDC, MFA, passkeys, and multi-tenant access controls.",
  path: "/",
});

export default function HomePage() {
  return <HomePageContent />;
}
