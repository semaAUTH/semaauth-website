"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export function PromoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="relative overflow-hidden border-b border-primary/15 bg-gradient-to-r from-primary/8 via-teal-50 to-primary/8"
    >
      <div aria-hidden className="absolute inset-0 shimmer opacity-40" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center lg:px-8">
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Product release
          </p>
          <p className="mt-0.5 text-sm font-medium">
            Passkeys & WebAuthn now generally available — ship passwordless login in minutes.
          </p>
        </div>
        <a
          href="/docs/getting-started"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform hover:translate-x-0.5 hover:underline"
        >
          Read the release notes
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}
