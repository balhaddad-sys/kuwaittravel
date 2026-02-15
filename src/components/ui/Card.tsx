import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const variantMap = {
  elevated:
    "bg-white/88 dark:bg-surface-dark-card/88 border border-surface-border/80 dark:border-surface-dark-border/80 shadow-card backdrop-blur-sm",
  outlined:
    "bg-white/82 dark:bg-surface-dark-card/82 border border-surface-border dark:border-surface-dark-border backdrop-blur-sm",
  filled: "bg-surface-muted/90 dark:bg-surface-dark-card/80 border border-surface-border/60 dark:border-surface-dark-border/70",
};

function Card({
  children,
  variant = "elevated",
  padding = "md",
  hoverable = false,
  className,
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] transition-all duration-300",
        variantMap[variant],
        paddingMap[padding],
        hoverable && "cursor-pointer hover:shadow-card-hover hover:-translate-y-1 hover:border-navy-200 dark:hover:border-navy-600",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export { Card, type CardProps };
