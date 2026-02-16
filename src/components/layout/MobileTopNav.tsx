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
        "sticky top-0 z-[var(--z-sticky)] border-b border-surface-border/80 bg-white/78 px-3 py-2 backdrop-blur-md dark:border-surface-dark-border/80 dark:bg-surface-dark/72 lg:hidden",
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
                  ? "border-navy-500/70 bg-gradient-to-br from-navy-700 to-navy-800 text-white shadow-[0_8px_18px_rgba(16,39,73,0.3)]"
                  : "border-surface-border/90 bg-white/85 text-navy-700 dark:border-surface-dark-border/90 dark:bg-surface-dark-card/85 dark:text-navy-100"
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
