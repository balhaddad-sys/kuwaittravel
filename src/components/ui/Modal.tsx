"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

function Modal({ open, onClose, title, description, children, footer, size = "md", className }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/45 animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          "relative flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-surface-border bg-white shadow-modal animate-scale-in dark:border-surface-dark-border dark:bg-surface-dark-card",
          sizeMap[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {(title || description) && (
          <div className="shrink-0 flex items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
            <div className="min-w-0">
              {title && (
                <h2 id="modal-title" className="text-heading-sm sm:text-heading-md font-bold text-stone-900 dark:text-white truncate">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-body-sm sm:text-body-md text-stone-500 dark:text-stone-400 truncate">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-surface-dark-border transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {children !== undefined && children !== null && <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">{children}</div>}
        {footer && (
          <div className="shrink-0 flex items-center justify-end gap-2 border-t border-surface-border/85 px-4 py-3 sm:px-6 sm:py-4 dark:border-surface-dark-border/85">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export { Modal, type ModalProps };
