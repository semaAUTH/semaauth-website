"use client";

const logos = [
  "Vercel",
  "Stripe",
  "Notion",
  "Linear",
  "Figma",
  "Supabase",
  "Cloudflare",
  "Datadog",
];

export function LogoMarquee() {
  const track = [...logos, ...logos];

  return (
    <section className="overflow-hidden border-b border-border bg-background py-12">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Trusted by teams building the next generation of applications
      </p>
      <div className="relative mt-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-14 px-8">
          {track.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-3 opacity-40 transition-opacity hover:opacity-70"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/60 text-sm font-bold">
                {name[0]}
              </span>
              <span className="text-lg font-semibold tracking-tight whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
