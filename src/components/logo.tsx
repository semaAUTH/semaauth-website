import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "default" | "light";
  className?: string;
  showText?: boolean;
};

export function Logo({ variant = "default", className, showText = true }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <path
            d="M12 2L4 6.5V17.5L12 22L20 17.5V6.5L12 2Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M12 8V16M8.5 10.5L15.5 13.5M15.5 10.5L8.5 13.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <span
          className={cn(
            "text-base font-semibold tracking-tight",
            isLight ? "text-sidebar-foreground" : "text-foreground"
          )}
        >
          sema<span className="text-primary">AUTH</span>
        </span>
      )}
    </Link>
  );
}
