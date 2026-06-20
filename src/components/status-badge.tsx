import { cn } from "@/lib/utils";

const variants = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400",
  inactive: "bg-muted text-muted-foreground ring-border",
  warning: "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-950/40 dark:text-orange-400",
};

type StatusBadgeProps = {
  status: keyof typeof variants;
  label: string;
  className?: string;
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variants[status],
        className
      )}
    >
      {label}
    </span>
  );
}
