"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
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
      "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold transform-gpu border transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none";

    const variants = {
      primary:
        "border-gold-600/90 bg-gold-500 text-white shadow-[0_12px_26px_rgba(0,108,228,0.28)] hover:-translate-y-0.5 hover:bg-gold-600 hover:shadow-[0_16px_32px_rgba(0,108,228,0.34)] active:translate-y-0 active:bg-gold-700",
      secondary:
        "border-navy-200 bg-white text-navy-800 shadow-[0_6px_18px_rgba(15,17,22,0.07)] hover:-translate-y-0.5 hover:border-navy-300 hover:bg-navy-50 hover:shadow-[0_10px_24px_rgba(15,17,22,0.11)] active:translate-y-0 dark:border-navy-600 dark:bg-surface-dark-card/90 dark:text-white dark:hover:border-navy-500 dark:hover:bg-navy-900/45",
      outline:
        "border-navy-300/80 bg-transparent text-navy-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] hover:border-gold-400 hover:bg-gold-50/55 hover:text-gold-700 dark:border-navy-600 dark:text-navy-100 dark:hover:border-gold-500 dark:hover:bg-gold-900/20 dark:hover:text-gold-200",
      ghost:
        "border-transparent text-navy-700 dark:text-navy-200 hover:border-navy-200/70 hover:bg-navy-50/70 dark:hover:border-navy-700 dark:hover:bg-surface-dark-card/65",
      danger:
        "border-red-500/80 bg-gradient-to-br from-error to-red-700 text-white shadow-[0_10px_24px_rgba(207,78,78,0.3)] hover:-translate-y-0.5 hover:from-red-500 hover:to-red-700 active:translate-y-0",
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
