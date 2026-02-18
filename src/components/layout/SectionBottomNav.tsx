"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { MoreHorizontal, X } from "lucide-react";

interface SectionBottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  notification?: boolean;
}

interface SectionBottomNavProps {
  primaryItems: SectionBottomNavItem[];
  overflowItems?: SectionBottomNavItem[];
  switchItems?: SectionBottomNavItem[];
  moreLabel?: string;
  switchLabel?: string;
}

function SectionBottomNav({
  primaryItems,
  overflowItems,
  switchItems,
  moreLabel = "More",
  switchLabel = "Switch to",
}: SectionBottomNavProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasOverflow = overflowItems && overflowItems.length > 0;
  const isOverflowActive = [...(overflowItems ?? []), ...(switchItems ?? [])].some(
    (item) => pathname === item.href || (pathname ?? "").startsWith(item.href + "/")
  );

  const closePanel = () => setMoreOpen(false);

  // Close panel on outside tap
  useEffect(() => {
    if (!moreOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  function isActive(href: string) {
    return pathname === href || (pathname ?? "").startsWith(href + "/");
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] px-3 pb-[max(0.7rem,env(safe-area-inset-bottom,0.7rem))] lg:hidden">
      {/* Overflow panel */}
      {hasOverflow && moreOpen && (
        <div
          ref={panelRef}
          className="mx-auto mb-2 w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-stone-200 bg-white/95 p-2 shadow-card backdrop-blur-md dark:border-stone-700 dark:bg-stone-900/95"
        >
          <div className="space-y-0.5">
            {overflowItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={closePanel}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-md font-medium transition-colors duration-[var(--duration-ui)]",
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                )}
              >
                <span className={cn("h-5 w-5 shrink-0", isActive(item.href) && "text-blue-600 dark:text-blue-400")}>{item.icon}</span>
                <span>{item.label}</span>
                {item.notification && (
                  <span className="ms-auto h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                )}
              </Link>
            ))}
          </div>

          {switchItems && switchItems.length > 0 && (
            <>
              <div className="my-1.5 border-t border-stone-200 dark:border-stone-700" />
              <p className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-stone-400 dark:text-stone-500">
                {switchLabel}
              </p>
              <div className="space-y-0.5">
                {switchItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    onClick={closePanel}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-md font-medium text-stone-500 transition-colors duration-[var(--duration-ui)] hover:bg-stone-50 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                  >
                    <span className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div className="relative mx-auto flex h-[66px] w-full max-w-xl items-center justify-around rounded-[22px] border border-stone-200 bg-white/95 px-2 shadow-card backdrop-blur-md dark:border-stone-700 dark:bg-stone-900/95">
        {primaryItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={closePanel}
              className={cn(
                "group relative flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.98]",
                active
                  ? "scale-[1.02] border border-blue-100 bg-blue-50 text-blue-700 shadow-none dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
                  : "border border-transparent text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
              )}
            >
              {active && (
                <span className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
              <span className={cn("h-6 w-6", active && "text-blue-600 dark:text-blue-400")}>
                {active && item.activeIcon ? item.activeIcon : item.icon}
              </span>
              {item.notification && (
                <span className="absolute end-3 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-stone-900" />
              )}
              <span className={cn("text-[10px] truncate max-w-full", active && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={cn(
              "group relative flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.98]",
              moreOpen || isOverflowActive
                ? "scale-[1.02] border border-blue-100 bg-blue-50 text-blue-700 shadow-none dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
                : "border border-transparent text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
            )}
          >
            {(moreOpen || isOverflowActive) && (
              <span className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
            <span className={cn("h-6 w-6 flex items-center justify-center", (moreOpen || isOverflowActive) && "text-blue-600 dark:text-blue-400")}>
              {moreOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
            </span>
            <span className={cn("text-[10px] truncate max-w-full", (moreOpen || isOverflowActive) && "font-semibold")}>
              {moreLabel}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}

export { SectionBottomNav, type SectionBottomNavProps, type SectionBottomNavItem };
