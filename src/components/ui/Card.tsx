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
  elevated: "bg-white dark:border dark:border-[#383838] dark:bg-[#262626] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
  outlined:
    "border border-[#EBEBEB] bg-white dark:border-[#383838] dark:bg-[#262626]",
  filled:
    "bg-[#F7F7F7] dark:border dark:border-[#383838] dark:bg-slate-800/60",
  glass: "eo-glass",
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
        "relative overflow-hidden rounded-[var(--radius-card)] transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-[var(--duration-ui)] ease-[var(--ease-spring)]",
        variantMap[variant],
        paddingMap[padding],
        hoverable &&
          "cursor-pointer will-change-transform hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:hover:border-sky-600/50",
        isInteractive &&
          "cursor-pointer will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
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
