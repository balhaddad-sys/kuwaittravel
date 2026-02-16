"use client";

import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { DirectionProvider } from "./DirectionProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { NavigationProgress } from "@/components/layout/NavigationProgress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DirectionProvider>
        <AuthProvider>
          <ToastProvider>
            <NavigationProgress />
            {children}
          </ToastProvider>
        </AuthProvider>
      </DirectionProvider>
    </ThemeProvider>
  );
}
