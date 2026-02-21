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
    <nav className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))]">
      <div className="relative mx-auto flex h-[68px] w-full max-w-lg items-center justify-around rounded-2xl border border-gray-200/80 bg-white/98 px-2 shadow-[0_-1px_0_rgba(26,18,9,0.04),0_8px_32px_rgba(26,18,9,0.1)] backdrop-blur-xl dark:border-[#1A2D48] dark:bg-indigo-900/98">
        {items.map((item) => {
          const isActive = pathname === item.href || (pathname ?? "").startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex min-w-[60px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transform-gpu transition-all duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.96]",
                isActive
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-gray-400 hover:text-gray-600 dark:text-indigo-300/50 dark:hover:text-indigo-200"
              )}
            >
              {/* Active indicator pill */}
              {isActive && (
                <span className="pointer-events-none absolute top-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-orange-500 dark:bg-orange-400" />
              )}
              <span className={cn(
                "relative flex h-6 w-6 items-center justify-center transition-transform duration-[var(--duration-ui)]",
                isActive && "scale-110"
              )}>
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
              </span>
              {/* Notification dot */}
              {item.notification && !isActive && (
                <span className="absolute end-3 top-2 h-1.5 w-1.5 rounded-full bg-orange-500 ring-2 ring-white dark:ring-indigo-900" aria-label="New notification" role="status" />
              )}
              <span className={cn(
                "text-[10.5px] font-medium leading-none transition-all duration-[var(--duration-ui)]",
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
