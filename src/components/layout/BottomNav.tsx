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
      <div className="mx-auto max-w-xl flex items-center justify-around h-16 rounded-2xl border border-surface-border/80 dark:border-surface-dark-border/80 bg-white/80 dark:bg-surface-dark/78 backdrop-blur-md shadow-[0_14px_28px_rgba(18,31,27,0.18)] px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-w-[64px] rounded-xl transition-all duration-300",
                isActive
                  ? "bg-navy-100/75 dark:bg-navy-900/45 text-navy-700 dark:text-gold-300"
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
