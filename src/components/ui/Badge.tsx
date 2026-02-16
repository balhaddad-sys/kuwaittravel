import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "gold";
  size?: "sm" | "md";
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantMap = {
  default: "bg-navy-100/75 text-navy-700 border border-navy-200/80 dark:bg-navy-900/45 dark:text-navy-200 dark:border-navy-700/70",
  success: "bg-success-light text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/60",
  warning: "bg-warning-light text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/60",
  error: "bg-error-light text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/60",
  info: "bg-info-light text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/60",
  gold: "travel-chip travel-gold-shimmer bg-[linear-gradient(110deg,rgba(255,234,205,0.8),rgba(255,248,237,0.96),rgba(255,213,157,0.78),rgba(255,248,237,0.96))] dark:bg-[linear-gradient(110deg,rgba(126,63,20,0.34),rgba(95,49,18,0.22),rgba(161,82,20,0.28),rgba(95,49,18,0.22))]",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-body-sm",
};

const dotMap = {
  default: "bg-navy-500 dark:bg-navy-300",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  gold: "bg-gold-500 dark:bg-gold-400",
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
