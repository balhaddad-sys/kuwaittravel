"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={cn("animate-page-enter motion-reduce:animate-none", className)}
    >
      {children}
    </div>
  );
}
