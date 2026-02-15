"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface BottomNavProps {
  items: BottomNavItem[];
}

function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 start-3 end-3 z-[var(--z-sticky)] safe-area-bottom">
      <div className="relative mx-auto flex h-16 max-w-xl items-center justify-around rounded-2xl border border-surface-border/80 bg-white/84 px-2 backdrop-blur-sm shadow-[0_14px_28px_rgba(16,39,73,0.18)] dark:border-surface-dark-border/80 dark:bg-surface-dark/78">
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/65 to-transparent" />
        {items.map((item) => {
          const isActive = pathname === item.href || (pathname ?? "").startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transform-gpu transition-[transform,background-color,color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.98]",
                isActive
                  ? "bg-navy-100/75 dark:bg-navy-900/45 text-navy-700 dark:text-gold-300 shadow-[0_6px_16px_rgba(23,57,108,0.14)]"
                  : "text-navy-500 dark:text-navy-400 hover:text-navy-700 dark:hover:text-navy-200"
              )}
            >
              <span className="h-6 w-6">
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
              </span>
              <span className={cn("text-[11px]", isActive && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { BottomNav, type BottomNavProps, type BottomNavItem };
