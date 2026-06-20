import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  gradient?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  children,
  gradient = false,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl",
            gradient && "bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent"
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-3">{children}</div>}
    </div>
  );
}
