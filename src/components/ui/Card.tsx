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
  elevated: "bg-white dark:bg-surface-dark-card shadow-card",
  outlined: "bg-white dark:bg-surface-dark-card border border-surface-border dark:border-surface-dark-border",
  filled: "bg-surface-muted dark:bg-surface-dark-card",
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
        "rounded-[var(--radius-card)] transition-all duration-200",
        variantMap[variant],
        paddingMap[padding],
        hoverable && "cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5",
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
