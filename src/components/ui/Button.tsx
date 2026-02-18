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
      "inline-flex items-center justify-center gap-2 font-semibold border transform-gpu transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none rounded-[var(--radius-btn)]";

    const variants = {
      /* Primary — solid Royal Blue, Booking.com style */
      primary:
        "border-blue-700 bg-blue-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_rgba(37,99,235,0.28)] hover:bg-blue-700 hover:border-blue-800 hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_20px_rgba(37,99,235,0.34)] active:bg-blue-800 dark:bg-blue-500 dark:border-blue-600 dark:hover:bg-blue-600",
      /* Secondary — clean white */
      secondary:
        "border-gray-200 bg-white text-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.06)] hover:border-gray-300 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-slate-500 dark:hover:bg-slate-700",
      /* Accent — warm gold */
      accent:
        "border-amber-600 bg-amber-500 text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_rgba(245,158,11,0.28)] hover:bg-amber-600 hover:border-amber-700 hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_20px_rgba(245,158,11,0.34)] active:bg-amber-700",
      /* Outline — transparent with border */
      outline:
        "border-gray-300 bg-transparent text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:bg-slate-800",
      /* Ghost — minimal */
      ghost:
        "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
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
