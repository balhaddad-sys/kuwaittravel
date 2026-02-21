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
      /* Primary — Electric Sky */
      primary:
        "border-sky-700 bg-sky-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.14),0_4px_12px_rgba(14,165,233,0.32)] hover:bg-sky-700 hover:border-sky-800 hover:shadow-[0_2px_4px_rgba(0,0,0,0.14),0_8px_20px_rgba(14,165,233,0.38)] active:bg-sky-800 dark:bg-sky-500 dark:border-sky-600 dark:hover:bg-sky-600",
      /* Secondary — cool white */
      secondary:
        "border-slate-200 bg-white text-slate-800 shadow-[0_1px_2px_rgba(2,6,23,0.06),0_2px_8px_rgba(2,6,23,0.06)] hover:border-slate-300 hover:bg-slate-50 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:text-slate-200 dark:hover:border-sky-600/50 dark:hover:bg-slate-700",
      /* Accent — Violet */
      accent:
        "border-orange-600 bg-orange-500 text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_rgba(139,92,246,0.38)] hover:bg-orange-600 hover:border-orange-700 hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_20px_rgba(139,92,246,0.48)] active:bg-orange-700",
      /* Outline — cool border */
      outline:
        "border-slate-300 bg-transparent text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:border-[#2D3B4F] dark:text-slate-200 dark:hover:border-sky-500/60 dark:hover:bg-slate-800/50",
      /* Ghost — minimal */
      ghost:
        "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-slate-100",
      /* Danger */
      danger:
        "border-red-600 bg-red-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_rgba(220,38,38,0.28)] hover:bg-red-700 hover:border-red-800",
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
