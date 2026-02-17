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
      "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold transform-gpu border transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/80 focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none";

    const variants = {
      primary:
        "border-teal-700 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white shadow-[0_18px_34px_-20px_rgba(30,58,95,0.7)] hover:border-teal-500 hover:from-teal-500 hover:via-teal-600 hover:to-teal-700 hover:shadow-[0_22px_38px_-18px_rgba(30,58,95,0.65)] active:from-teal-700 active:to-teal-900",
      secondary:
        "border-surface-border bg-gradient-to-b from-white to-stone-50/70 text-stone-800 shadow-[0_12px_24px_-20px_rgba(26,24,21,0.2)] hover:border-teal-300 hover:from-white hover:to-teal-50/50 dark:border-surface-dark-border dark:bg-gradient-to-b dark:from-surface-dark-card dark:to-surface-dark dark:text-white dark:hover:border-teal-500 dark:hover:from-surface-dark-card dark:hover:to-teal-950/25",
      accent:
        "border-amber-600 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-[0_18px_34px_-20px_rgba(197,165,114,0.65)] hover:border-amber-500 hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 hover:shadow-[0_22px_38px_-18px_rgba(197,165,114,0.6)] active:from-amber-600 active:to-amber-800",
      outline:
        "border-stone-300/85 bg-white/30 text-stone-700 shadow-none hover:border-teal-400 hover:bg-teal-50/70 hover:text-teal-700 dark:border-stone-600 dark:bg-transparent dark:text-stone-100 dark:hover:border-teal-500 dark:hover:bg-teal-900/24 dark:hover:text-teal-200",
      ghost:
        "border-transparent text-stone-700 dark:text-stone-200 hover:border-stone-200/70 hover:bg-white/80 dark:hover:border-stone-700 dark:hover:bg-surface-dark-card/65",
      danger:
        "border-red-600 bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_18px_34px_-20px_rgba(220,38,38,0.7)] hover:from-red-400 hover:to-red-600",
    };

    const sizes = {
      sm: "h-9 px-3 text-body-sm",
      md: "h-11 px-5 text-body-md",
      lg: "h-12 px-7 text-body-lg",
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
