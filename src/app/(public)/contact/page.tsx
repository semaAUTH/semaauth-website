import { ContactPageContent } from "@/components/marketing/contact-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Talk to the semaAUTH team about architecture reviews, enterprise deployment, security documentation, and custom pricing.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
