import { PricingPageContent } from "@/components/marketing/pricing-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Simple, transparent pricing for semaAUTH. Starter, Growth, and Enterprise plans with OAuth 2.1, OIDC, MFA, and multi-tenant support.",
  path: "/pricing",
});

export default function PricingPage() {
  return <PricingPageContent />;
}
