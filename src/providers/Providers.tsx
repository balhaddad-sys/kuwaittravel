"use client";

import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { DirectionProvider } from "./DirectionProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DirectionProvider>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </DirectionProvider>
    </ThemeProvider>
  );
}
