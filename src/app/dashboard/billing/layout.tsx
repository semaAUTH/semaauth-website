import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Billing",
  description: "View usage, invoices, and subscription details.",
  noIndex: true,
});

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
