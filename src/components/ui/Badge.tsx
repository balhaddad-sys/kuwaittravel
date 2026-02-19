import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "teal" | "amber" | "gold";
  size?: "sm" | "md";
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantMap = {
  default: "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-700/60 dark:text-slate-200 dark:border-slate-600",
  success: "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/60",
  warning: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/60",
  error: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/60",
  info: "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800/60",
  teal: "bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800/60",
  amber: "bg-coral-50 text-coral-800 border border-coral-200 dark:bg-coral-900/30 dark:text-coral-300 dark:border-coral-800/60",
  gold: "bg-coral-50 text-coral-800 border border-coral-200 dark:bg-coral-900/30 dark:text-coral-300 dark:border-coral-800/60",
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
  amber: "bg-coral-500 dark:bg-coral-400",
  gold: "bg-coral-500 dark:bg-coral-400",
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
