"use client";

import { useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (!containerRef.current || !activeItemRef.current) return;
      const container = containerRef.current;
      const activeItem = activeItemRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeItem.getBoundingClientRect();

      if (
        activeRect.left < containerRect.left + 16 ||
        activeRect.right > containerRect.right - 16
      ) {
        activeItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] border-b border-surface-border bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(15,17,22,0.06)] dark:border-surface-dark-border dark:bg-surface-dark-card lg:hidden",
        className
      )}
    >
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive =
            pathname === item.href || (pathname ?? "").startsWith(item.href + "/");

          return (
            <Link
              ref={isActive ? activeItemRef : null}
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "relative shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2.5 text-body-md font-semibold transform-gpu transition-[transform,background-color,color,border-color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.97]",
                isActive
                  ? "border-gold-200 bg-gold-50 text-gold-700 shadow-none dark:border-gold-700 dark:bg-gold-900/20 dark:text-gold-300"
                  : "border-surface-border bg-white text-navy-700 dark:border-surface-dark-border dark:bg-surface-dark dark:text-navy-100"
              )}
            >
              {item.label}
              {isActive && (
                <span className="pointer-events-none absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-gold-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
