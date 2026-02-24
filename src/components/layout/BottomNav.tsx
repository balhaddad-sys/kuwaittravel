"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  notification?: boolean;
}

interface BottomNavProps {
  items: BottomNavItem[];
}

function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] safe-area-bottom">
      <div className="eo-bottom-nav flex h-16 w-full items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href || (pathname ?? "").startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex min-w-[64px] flex-col items-center justify-center gap-1 py-2 transition-colors duration-[var(--duration-ui)]",
                isActive
                  ? "text-sky-500 dark:text-sky-400"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              )}
            >
              {/* Active indicator — solid line */}
              {isActive && (
                <span className="pointer-events-none absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-sky-500" />
              )}
              <span className={cn(
                "relative flex h-6 w-6 items-center justify-center",
                isActive && "scale-105"
              )}>
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
              </span>
              {/* Notification dot */}
              {item.notification && !isActive && (
                <span className="absolute end-3 top-1 h-1.5 w-1.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-[#111827]" aria-label="New notification" role="status" />
              )}
              <span className={cn(
                "text-[10px] font-medium leading-none",
                isActive ? "font-semibold" : ""
              )}>
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
