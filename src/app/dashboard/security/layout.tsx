import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Security policies",
  description: "Configure MFA, passkey, session, and authentication policies.",
  noIndex: true,
});

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
