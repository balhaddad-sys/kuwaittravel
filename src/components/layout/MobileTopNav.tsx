"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { SidebarItem } from "@/components/layout/Sidebar";

interface MobileTopNavProps {
  items: SidebarItem[];
  className?: string;
}

export function MobileTopNav({ items, className }: MobileTopNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] border-b border-surface-border/80 bg-white/88 px-3 py-2 backdrop-blur-sm dark:border-surface-dark-border/80 dark:bg-surface-dark/82 lg:hidden",
        className
      )}
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive =
            pathname === item.href || (pathname ?? "").startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 text-body-sm font-medium transform-gpu transition-[transform,background-color,color,border-color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.97]",
                isActive
                  ? "border-navy-600 bg-navy-600 text-white shadow-[0_6px_16px_rgba(23,57,108,0.24)]"
                  : "border-surface-border bg-white text-navy-700 dark:border-surface-dark-border dark:bg-surface-dark-card dark:text-navy-100"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
