import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "teal" | "amber" | "gold";
  size?: "sm" | "md";
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantMap = {
  default: "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-indigo-700/50 dark:text-indigo-100 dark:border-indigo-700/60",
  success: "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/60",
  warning: "bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/60",
  error: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/60",
  info: "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/60",
  teal: "bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/60",
  amber: "bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/60",
  gold: "bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/60",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-body-sm",
};

const dotMap: Record<string, string> = {
  default: "bg-gray-500 dark:bg-indigo-300",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
  teal: "bg-indigo-600 dark:bg-indigo-400",
  amber: "bg-orange-500 dark:bg-orange-400",
  gold: "bg-orange-500 dark:bg-orange-400",
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
