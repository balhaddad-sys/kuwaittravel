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
    <nav className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] px-3 pb-[max(0.7rem,env(safe-area-inset-bottom,0.7rem))]">
      <div className="travel-panel relative mx-auto flex h-[66px] w-full max-w-xl items-center justify-around rounded-[22px] px-2">
        <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent" />
        {items.map((item) => {
          const isActive = pathname === item.href || (pathname ?? "").startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "group relative flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.98]",
                isActive
                  ? "border border-navy-200/90 bg-gradient-to-b from-white/95 to-navy-50/84 text-navy-700 shadow-[0_8px_20px_rgba(16,39,73,0.14)] dark:border-navy-700 dark:from-surface-dark-card/95 dark:to-navy-900/34 dark:text-gold-300"
                  : "border border-transparent text-navy-500 hover:text-navy-700 dark:text-navy-400 dark:hover:text-navy-200"
              )}
            >
              {isActive && (
                <span className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-gold-300 to-transparent" />
              )}
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
