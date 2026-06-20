import { SecurityPageContent } from "@/components/marketing/security-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Security",
  description:
    "Security built in, not bolted on. PKCE enforcement, JWKS verification, tenant-scoped RLS, MFA, passkeys, and comprehensive audit logging.",
  path: "/security",
});

export default function SecurityPage() {
  return <SecurityPageContent />;
}
