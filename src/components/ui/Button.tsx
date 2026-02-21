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
      "inline-flex items-center justify-center gap-2 font-semibold border transform-gpu transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none rounded-[var(--radius-btn)]";

    const variants = {
      /* Primary — Deep Ocean Blue */
      primary:
        "border-indigo-700 bg-indigo-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.14),0_4px_12px_rgba(30,58,95,0.32)] hover:bg-indigo-700 hover:border-indigo-800 hover:shadow-[0_2px_4px_rgba(0,0,0,0.14),0_8px_20px_rgba(30,58,95,0.38)] active:bg-indigo-800 dark:bg-indigo-500 dark:border-indigo-600 dark:hover:bg-indigo-600",
      /* Secondary — warm white */
      secondary:
        "border-gray-200 bg-white text-gray-800 shadow-[0_1px_2px_rgba(26,18,9,0.06),0_2px_8px_rgba(26,18,9,0.06)] hover:border-gray-300 hover:bg-gray-50 dark:border-[#1A2D48] dark:bg-indigo-800 dark:text-indigo-100 dark:hover:border-indigo-600/50 dark:hover:bg-indigo-700",
      /* Accent — Rich Gold */
      accent:
        "border-orange-600 bg-orange-500 text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_4px_12px_rgba(197,165,114,0.38)] hover:bg-orange-600 hover:border-orange-700 hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_20px_rgba(197,165,114,0.48)] active:bg-orange-700",
      /* Outline — warm border */
      outline:
        "border-gray-300 bg-transparent text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:border-[#1A2D48] dark:text-indigo-100 dark:hover:border-indigo-500/60 dark:hover:bg-indigo-800/50",
      /* Ghost — minimal */
      ghost:
        "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-indigo-200/80 dark:hover:bg-indigo-800/50 dark:hover:text-indigo-50",
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
