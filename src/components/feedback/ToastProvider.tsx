"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-success" />,
  error: <XCircle className="h-5 w-5 text-error" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning" />,
  info: <Info className="h-5 w-5 text-info" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const newToast = { ...t, id };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(id), t.duration || 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 start-6 z-[var(--z-toast)] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "travel-panel animate-slide-up relative flex items-start gap-3 overflow-hidden rounded-[var(--radius-lg)] p-4"
            )}
          >
            <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <p className="text-body-md font-medium text-gray-900 dark:text-white">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-body-sm text-gray-500">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 rounded p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
