"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 99.99, suffix: "%", label: "Uptime SLA", decimals: 2 },
  { value: 15, suffix: "m", label: "Avg. setup time", prefix: "< " },
  { value: 50, suffix: "+", label: "OAuth endpoints" },
  { value: 100, suffix: "%", label: "PKCE enforced" },
];

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  active,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function PlatformStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-primary/15 bg-gradient-to-r from-primary/8 via-teal-500/5 to-primary/8 py-14">
      <div aria-hidden className="absolute inset-0 shimmer opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.decimals}
                  active={inView}
                />
              </p>
              <p className="mt-1.5 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
