import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Settings",
  description: "Configure organization profile, domains, and console preferences.",
  noIndex: true,
});

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
