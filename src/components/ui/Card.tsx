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
  md: "p-3 sm:p-4",
  lg: "p-4 sm:p-6",
};

const variantMap = {
  elevated:
    "travel-panel",
  outlined:
    "border border-surface-border/85 bg-white/74 backdrop-blur-sm dark:border-surface-dark-border/85 dark:bg-surface-dark-card/72",
  filled:
    "border border-surface-border/70 bg-surface-muted/90 dark:border-surface-dark-border/75 dark:bg-surface-dark-card/84",
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
        "rounded-[var(--radius-card)] transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)]",
        variantMap[variant],
        paddingMap[padding],
        hoverable &&
          "cursor-pointer will-change-transform hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-card-hover dark:hover:border-navy-600",
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
