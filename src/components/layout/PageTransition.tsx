"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "app" | "portal" | "admin" | "auth";
}

const variantClassMap: Record<NonNullable<PageTransitionProps["variant"]>, string> = {
  app: "page-transition-content--app",
  portal: "page-transition-content--portal",
  admin: "page-transition-content--admin",
  auth: "page-transition-content--auth",
};

export function PageTransition({
  children,
  className,
  variant = "app",
}: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div className={cn("page-transition-shell", className)}>
      <div
        key={pathname}
        className={cn(
          "page-transition-content motion-reduce:!animate-none",
          variantClassMap[variant]
        )}
      >
        {children}
      </div>
    </div>
  );
}
