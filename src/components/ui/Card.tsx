import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  interactive?: boolean;
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
  elevated: "travel-panel",
  outlined:
    "border border-gold-100/70 bg-white/76 backdrop-blur-sm dark:border-gold-900/35 dark:bg-surface-dark-card/72",
  filled:
    "border border-surface-border/70 bg-surface-muted/90 dark:border-surface-dark-border/75 dark:bg-surface-dark-card/84",
};

function Card({
  children,
  variant = "elevated",
  padding = "md",
  hoverable = false,
  interactive = false,
  className,
  onClick,
}: CardProps) {
  const isInteractive = interactive || Boolean(onClick);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)] transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)]",
        variantMap[variant],
        paddingMap[padding],
        hoverable &&
          "cursor-pointer will-change-transform hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-card-hover dark:hover:border-navy-600",
        variant === "outlined" &&
          "hover:border-gold-200/80 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_rgba(16,39,73,0.12)] dark:hover:border-gold-700/45",
        isInteractive &&
          "cursor-pointer will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className
      )}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {variant === "elevated" && (
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent" />
      )}
      {children}
    </div>
  );
}

export { Card, type CardProps };
