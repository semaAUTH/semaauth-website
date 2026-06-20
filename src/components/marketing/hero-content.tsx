"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease },
});

export function HeroContent() {
  return (
    <div>
      <motion.p {...fade(0)} className="text-sm font-semibold text-primary">
        Identity platform
      </motion.p>
      <motion.h1
        {...fade(0.12)}
        className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
      >
        semaAUTH secures every identity
      </motion.h1>
      <motion.p
        {...fade(0.24)}
        className="mt-2 text-2xl font-medium tracking-tight text-muted-foreground sm:text-3xl"
      >
        From workforce SSO to customer login and API access.
      </motion.p>
      <motion.p
        {...fade(0.36)}
        className="mt-6 text-lg leading-8 text-muted-foreground"
      >
        One neutral, extensible platform to authenticate users, isolate tenants, enforce
        policies, and ship developer-ready OAuth — without building identity from scratch.
      </motion.p>
      <motion.div {...fade(0.48)} className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/docs/getting-started"
          className={cn(buttonVariants({ size: "lg" }), "gap-2 shadow-md shadow-primary/20")}
        >
          Get started
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Contact sales
        </Link>
      </motion.div>
    </div>
  );
}
