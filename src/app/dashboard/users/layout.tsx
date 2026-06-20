import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Users & groups",
  description: "Manage users, groups, and access assignments across your organization.",
  noIndex: true,
});

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
