import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  variant?: "elevated" | "outlined" | "filled" | "glass";
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
  elevated: "sacred-panel",
  outlined:
    "border border-surface-border bg-gradient-to-b from-white to-stone-50/70 dark:border-surface-dark-border dark:bg-gradient-to-b dark:from-surface-dark-card dark:to-surface-dark",
  filled:
    "border border-surface-border bg-gradient-to-b from-surface-muted to-white dark:border-surface-dark-border dark:bg-gradient-to-b dark:from-surface-dark-card dark:to-surface-dark",
  glass: "sacred-glass",
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
          "cursor-pointer will-change-transform hover:-translate-y-1 hover:border-teal-300 hover:shadow-card-hover dark:hover:border-teal-500",
        isInteractive &&
          "cursor-pointer will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
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
      {children}
    </div>
  );
}

export { Card, type CardProps };
