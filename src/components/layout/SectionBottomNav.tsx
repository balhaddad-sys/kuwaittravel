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
          className="mx-auto mb-2 w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-card backdrop-blur-md dark:border-[#2D3B4F] dark:bg-[#111827]/95"
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
                    ? "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300/60 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                )}
              >
                <span className={cn("h-5 w-5 shrink-0", isActive(item.href) && "text-sky-600 dark:text-sky-400")}>{item.icon}</span>
                <span>{item.label}</span>
                {item.notification && (
                  <span className="ms-auto h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                )}
              </Link>
            ))}
          </div>

          {switchItems && switchItems.length > 0 && (
            <>
              <div className="my-1.5 border-t border-slate-200 dark:border-[#2D3B4F]" />
              <p className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-400/45">
                {switchLabel}
              </p>
              <div className="space-y-0.5">
                {switchItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    onClick={closePanel}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-md font-medium text-slate-500 transition-colors duration-[var(--duration-ui)] hover:bg-slate-50 hover:text-slate-700 dark:text-slate-300/60 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                  >
                    <span className="h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div className="relative mx-auto flex h-[66px] w-full max-w-xl items-center justify-around rounded-[22px] border border-slate-200 bg-white/95 px-2 shadow-card backdrop-blur-md dark:border-[#2D3B4F] dark:bg-[#111827]/95">
        {primaryItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={closePanel}
              className={cn(
                "group relative flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-spring)] active:scale-[0.98]",
                active
                  ? "scale-[1.02] border border-sky-100 bg-sky-50 text-sky-700 shadow-none dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300"
                  : "border border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-300/45 dark:hover:text-slate-300"
              )}
            >
              {active && (
                <span className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 dark:from-sky-400 dark:to-violet-500" />
              )}
              <span className={cn("h-6 w-6", active && "text-sky-600 dark:text-sky-400")}>
                {active && item.activeIcon ? item.activeIcon : item.icon}
              </span>
              {item.notification && (
                <span className="absolute end-3 top-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-900" />
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
              "group relative flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-spring)] active:scale-[0.98]",
              moreOpen || isOverflowActive
                ? "scale-[1.02] border border-sky-100 bg-sky-50 text-sky-700 shadow-none dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300"
                : "border border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-300/45 dark:hover:text-slate-300"
            )}
          >
            {(moreOpen || isOverflowActive) && (
              <span className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 dark:from-sky-400 dark:to-violet-500" />
            )}
            <span className={cn("h-6 w-6 flex items-center justify-center", (moreOpen || isOverflowActive) && "text-sky-600 dark:text-sky-400")}>
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
