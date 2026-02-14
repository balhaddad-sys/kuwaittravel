import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "gold";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

const variantMap = {
  default: "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200",
  success: "bg-success-light text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-warning-light text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  error: "bg-error-light text-red-800 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-info-light text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  gold: "bg-gold-100 text-gold-800 dark:bg-gold-900/30 dark:text-gold-400",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-body-sm",
};

function Badge({ variant = "default", size = "md", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-[var(--radius-chip)]",
        variantMap[variant],
        sizeMap[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps };
