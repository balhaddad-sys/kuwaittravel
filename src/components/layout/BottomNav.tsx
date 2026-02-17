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
    <nav className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] px-3 pb-[max(0.7rem,env(safe-area-inset-bottom,0.7rem))]">
      <div className="relative mx-auto flex h-[66px] w-full max-w-xl items-center justify-around rounded-[22px] border border-white/15 bg-[#2563EB]/95 px-2 shadow-card backdrop-blur-md">
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
                  ? "scale-[1.02] border border-white/20 bg-white/15 text-white shadow-none"
                  : "border border-transparent text-white/50 hover:text-white/80"
              )}
            >
              {isActive && (
                <span className="pointer-events-none absolute inset-x-4 top-0 h-0.5 rounded-full bg-amber-400" />
              )}
              <span className={cn("h-6 w-6", isActive && "text-amber-300")}>
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
              </span>
              {item.notification && (
                <span className="absolute end-4 top-2 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[#2563EB]" />
              )}
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
