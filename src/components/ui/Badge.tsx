import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "teal" | "amber" | "gold";
  size?: "sm" | "md";
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantMap = {
  default: "bg-stone-100/75 text-stone-700 border border-stone-200/80 dark:bg-stone-900/45 dark:text-stone-200 dark:border-stone-700/70",
  success: "bg-success-light text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/60",
  warning: "bg-warning-light text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/60",
  error: "bg-error-light text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/60",
  info: "bg-info-light text-sky-800 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/60",
  teal: "bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800/60",
  amber: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/60 travel-gold-shimmer bg-[linear-gradient(110deg,rgba(235,218,184,0.7),rgba(251,247,240,0.95),rgba(212,184,124,0.6),rgba(251,247,240,0.95))] dark:bg-[linear-gradient(110deg,rgba(92,70,38,0.34),rgba(118,91,50,0.22),rgba(147,116,66,0.28),rgba(118,91,50,0.22))]",
  gold: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/60 travel-gold-shimmer bg-[linear-gradient(110deg,rgba(235,218,184,0.7),rgba(251,247,240,0.95),rgba(212,184,124,0.6),rgba(251,247,240,0.95))] dark:bg-[linear-gradient(110deg,rgba(92,70,38,0.34),rgba(118,91,50,0.22),rgba(147,116,66,0.28),rgba(118,91,50,0.22))]",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-body-sm",
};

const dotMap: Record<string, string> = {
  default: "bg-stone-500 dark:bg-stone-300",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  teal: "bg-teal-600 dark:bg-teal-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  gold: "bg-amber-500 dark:bg-amber-400",
};

function Badge({ variant = "default", size = "md", children, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-[var(--radius-chip)] backdrop-blur-sm",
        variantMap[variant],
        sizeMap[size],
        className
      )}
    >
      {dot && <span className={cn("me-1.5 inline-flex h-1.5 w-1.5 shrink-0 rounded-full", dotMap[variant])} />}
      {children}
    </span>
  );
}

export { Badge, type BadgeProps };
