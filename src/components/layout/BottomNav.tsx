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
    <nav className="fixed bottom-0 start-0 end-0 z-[var(--z-sticky)] border-t border-surface-border dark:border-surface-dark-border bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-w-[64px] transition-colors",
                isActive ? "text-navy-700 dark:text-gold-500" : "text-navy-400 dark:text-navy-500"
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
