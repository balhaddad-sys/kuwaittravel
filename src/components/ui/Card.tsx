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
  elevated: "border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.06)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
  outlined:
    "border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800",
  filled:
    "border border-gray-100 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/60",
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
          "cursor-pointer will-change-transform hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.1)] dark:hover:border-slate-600",
        isInteractive &&
          "cursor-pointer will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
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
