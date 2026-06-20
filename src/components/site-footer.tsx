import Link from "next/link";
import { Logo } from "@/components/logo";

const footerLinks = {
  Product: [
    { label: "Overview", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
    { label: "Contact", href: "/contact" },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "Getting started", href: "/docs/getting-started" },
    { label: "API reference", href: "/docs" },
  ],
  Admin: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Applications", href: "/dashboard/apps" },
    { label: "Users", href: "/dashboard/users" },
    { label: "Settings", href: "/dashboard/settings" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Identity infrastructure for teams building secure, multi-tenant applications at scale.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h3 className="text-sm font-semibold text-foreground">{section}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} semaAUTH. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/security" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/security" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/security" className="hover:text-foreground">
              Trust center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
