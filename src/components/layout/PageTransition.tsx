"use client";

import { cn } from "@/lib/utils/cn";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "app" | "portal" | "admin" | "auth";
}

export function PageTransition({
  children,
  className,
}: PageTransitionProps) {
  return (
    <div className={cn("page-transition-shell", className)}>
      <div className="page-transition-content">
        {children}
      </div>
    </div>
  );
}
