"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
    ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-semibold border transform-gpu transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-[var(--duration-ui)] ease-[var(--ease-spring)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none rounded-[var(--radius-btn)]";

    const variants = {
      /* Primary — Dark charcoal (Airbnb style) */
      primary:
        "border-[#222222] bg-[#222222] text-white hover:bg-[#000000] hover:border-[#000000] active:bg-[#333333] dark:border-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600 dark:hover:border-sky-700",
      /* Secondary — clean white */
      secondary:
        "border-[#EBEBEB] bg-white text-[#222222] hover:border-[#DDDDDD] hover:bg-[#F7F7F7] dark:border-[#383838] dark:bg-[#262626] dark:text-slate-200 dark:hover:border-sky-600/50 dark:hover:bg-slate-700",
      /* Accent — CTA orange */
      accent:
        "border-orange-600 bg-orange-500 text-white hover:bg-orange-600 hover:border-orange-700 active:bg-orange-700",
      /* Outline — clean border */
      outline:
        "border-[#DDDDDD] bg-transparent text-[#222222] hover:border-[#222222] hover:bg-[#F7F7F7] dark:border-[#383838] dark:text-slate-200 dark:hover:border-sky-500/60 dark:hover:bg-slate-800/50",
      /* Ghost — minimal */
      ghost:
        "border-transparent text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222] dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-slate-100",
      /* Danger */
      danger:
        "border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-800",
    };

    const sizes = {
      sm: "h-9 px-4 text-[0.8125rem]",
      md: "h-11 px-5 text-[0.9375rem]",
      lg: "h-12 px-7 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button, type ButtonProps };
