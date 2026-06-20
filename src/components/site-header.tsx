"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const productLinks = [
  { title: "Auth runtime", description: "OAuth 2.1, OIDC, MFA, and passkeys", href: "/docs" },
  { title: "Admin console", description: "Tenant, app, and user management", href: "/login?returnTo=/dashboard" },
  { title: "Developer SDKs", description: "React, Express, and NestJS integrations", href: "/docs/getting-started" },
  { title: "Security & compliance", description: "Trust center, audit logs, and policies", href: "/security" },
];

const navItems = [
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Developers" },
  { href: "/security", label: "Security" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setProductOpen(true)}
            onMouseLeave={() => setProductOpen(false)}
          >
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/" || productOpen
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Product
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", productOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {productOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 pt-2"
                >
                  <div className="w-80 rounded-xl border border-border bg-background p-2 shadow-xl">
                    {productLinks.map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        className="block rounded-lg px-3 py-3 transition-colors hover:bg-muted"
                      >
                        <p className="text-sm font-semibold">{link.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{link.description}</p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/contact" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-medium")}>
            Contact sales
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-medium")}>
            Sign in
          </Link>
          <Link
            href="/login?returnTo=/dashboard"
            className={cn(buttonVariants({ size: "sm" }), "font-medium shadow-sm")}
          >
            Start free trial
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-background px-6 py-4 shadow-xl md:hidden"
            >
              <nav className="flex flex-col gap-1">
                <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Product
                </p>
                {productLinks.map((link, i) => (
                  <motion.div
                    key={link.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-3 hover:bg-muted"
                    >
                      <p className="text-sm font-semibold">{link.title}</p>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </Link>
                  </motion.div>
                ))}
                <div className="my-2 border-t border-border" />
                {[...navItems, { href: "/contact", label: "Contact" }].map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.16 + i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/login?returnTo=/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={cn(buttonVariants({ size: "sm" }), "w-full shadow-sm")}
                  >
                    Start free trial
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
