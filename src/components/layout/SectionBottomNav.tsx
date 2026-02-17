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
          className="mx-auto mb-2 w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-surface-border bg-white p-2 shadow-card dark:border-surface-dark-border dark:bg-surface-dark-card"
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
                    ? "bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-300"
                    : "text-navy-700 hover:bg-surface-light dark:text-navy-200 dark:hover:bg-surface-dark"
                )}
              >
                <span className="h-5 w-5 shrink-0">{item.icon}</span>
                <span>{item.label}</span>
                {item.notification && (
                  <span className="ms-auto h-2 w-2 shrink-0 rounded-full bg-red-500" />
                )}
              </Link>
            ))}
          </div>

          {switchItems && switchItems.length > 0 && (
            <>
              <div className="my-1.5 border-t border-surface-border dark:border-surface-dark-border" />
              <p className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-navy-400 dark:text-navy-500">
                {switchLabel}
              </p>
              <div className="space-y-0.5">
                {switchItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    onClick={closePanel}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-md font-medium text-navy-600 transition-colors duration-[var(--duration-ui)] hover:bg-surface-light dark:text-navy-300 dark:hover:bg-surface-dark"
                  >
                    <span className="h-5 w-5 shrink-0 text-gold-500">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div className="relative mx-auto flex h-[66px] w-full max-w-xl items-center justify-around rounded-[22px] border border-surface-border bg-white px-2 shadow-card dark:border-surface-dark-border dark:bg-surface-dark-card">
        {primaryItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={closePanel}
              className={cn(
                "group relative flex min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.98]",
                active
                  ? "scale-[1.02] border border-gold-200 bg-gold-50 text-gold-700 shadow-none dark:border-gold-700 dark:bg-gold-900/20 dark:text-gold-300"
                  : "border border-transparent text-navy-500 hover:text-navy-700 dark:text-navy-400 dark:hover:text-navy-200"
              )}
            >
              {active && (
                <span className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full bg-gold-500" />
              )}
              <span className="h-6 w-6">
                {active && item.activeIcon ? item.activeIcon : item.icon}
              </span>
              {item.notification && (
                <span className="absolute end-3 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-surface-dark-card" />
              )}
              <span className={cn("text-[11px]", active && "font-semibold")}>
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
              "group relative flex min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.98]",
              moreOpen || isOverflowActive
                ? "scale-[1.02] border border-gold-200 bg-gold-50 text-gold-700 shadow-none dark:border-gold-700 dark:bg-gold-900/20 dark:text-gold-300"
                : "border border-transparent text-navy-500 hover:text-navy-700 dark:text-navy-400 dark:hover:text-navy-200"
            )}
          >
            {(moreOpen || isOverflowActive) && (
              <span className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full bg-gold-500" />
            )}
            <span className="h-6 w-6 flex items-center justify-center">
              {moreOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
            </span>
            <span className={cn("text-[11px]", (moreOpen || isOverflowActive) && "font-semibold")}>
              {moreLabel}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}

export { SectionBottomNav, type SectionBottomNavProps, type SectionBottomNavItem };
