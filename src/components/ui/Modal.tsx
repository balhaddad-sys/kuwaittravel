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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[var(--radius-xl)] bg-white dark:bg-surface-dark-card shadow-modal animate-scale-in",
          sizeMap[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/80 to-transparent" />
        {(title || description) && (
          <div className="flex items-start justify-between p-6 pb-0">
            <div>
              {title && (
                <h2 id="modal-title" className="text-heading-md font-bold text-navy-900 dark:text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-body-md text-navy-500 dark:text-navy-400">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100 dark:hover:bg-surface-dark-border transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {children !== undefined && children !== null && <div className="p-6">{children}</div>}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-surface-border/85 px-6 py-4 dark:border-surface-dark-border/85">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export { Modal, type ModalProps };
