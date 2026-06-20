import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/marketing/scroll-reveal";

type MarketingPageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  gradient?: boolean;
};

export function MarketingPageHero({
  eyebrow,
  title,
  description,
  gradient = false,
}: MarketingPageHeroProps) {
  return (
    <section className="hero-gradient relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <Reveal>
          <PageHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            gradient={gradient}
          />
        </Reveal>
      </div>
    </section>
  );
}
