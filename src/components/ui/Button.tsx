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
      "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold transform-gpu border transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none";

    const variants = {
      primary:
        "border-teal-700 bg-teal-700 text-white shadow-[0_4px_12px_rgba(15,118,110,0.2)] hover:bg-teal-800 active:bg-teal-900",
      secondary:
        "border-surface-border bg-white text-stone-800 shadow-none hover:border-stone-300 hover:bg-stone-50 dark:border-surface-dark-border dark:bg-surface-dark-card dark:text-white dark:hover:border-stone-500 dark:hover:bg-stone-900/45",
      accent:
        "border-amber-600 bg-amber-600 text-white shadow-[0_4px_12px_rgba(217,119,6,0.25)] hover:bg-amber-700 active:bg-amber-800",
      outline:
        "border-stone-300/80 bg-transparent text-stone-700 shadow-none hover:border-teal-400 hover:bg-teal-50/55 hover:text-teal-700 dark:border-stone-600 dark:text-stone-100 dark:hover:border-teal-500 dark:hover:bg-teal-900/20 dark:hover:text-teal-200",
      ghost:
        "border-transparent text-stone-700 dark:text-stone-200 hover:border-stone-200/70 hover:bg-stone-50 dark:hover:border-stone-700 dark:hover:bg-surface-dark-card/65",
      danger:
        "border-red-600 bg-error text-white shadow-[0_4px_12px_rgba(220,38,38,0.24)] hover:bg-red-700",
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
