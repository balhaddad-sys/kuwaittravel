"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface SidebarProps {
  items: SidebarItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

function Sidebar({ items, header, footer }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const dividerIndices =
    items.length >= 9
      ? new Set([4, 7])
      : items.length >= 7
        ? new Set([4])
        : new Set<number>();

  return (
    <aside
      className={cn(
        "fixed top-0 start-0 z-[var(--z-sidebar)] hidden h-screen flex-col border-e border-surface-border bg-white shadow-sidebar transition-[width,background-color,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] dark:border-surface-dark-border dark:bg-surface-dark-card lg:flex",
        collapsed ? "w-[84px]" : "w-[286px]"
      )}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-surface-border p-4 dark:border-surface-dark-border">
        {!collapsed && (
          <div className="max-w-[190px] truncate">{header}</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 rounded-[var(--radius-md)] border border-transparent p-2 text-stone-500 transition-[background-color,color,border-color,transform] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:border-stone-200 hover:bg-white/70 dark:hover:border-stone-700 dark:hover:bg-surface-dark-card active:scale-[0.97]"
        >
          {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="relative flex-1 space-y-1.5 overflow-y-auto p-3">
        {items.map((item, index) => {
          const isActive = pathname === item.href || (pathname ?? "").startsWith(item.href + "/");
          return (
            <div key={item.href}>
              {dividerIndices.has(index) && (
                <div className="mx-2 my-2 h-px bg-gradient-to-r from-transparent via-stone-200/70 to-transparent dark:via-stone-700/60" />
              )}
              <Link
                href={item.href}
                prefetch
                className={cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-[var(--radius-lg)] px-3 py-2.5 text-body-md transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.985]",
                  isActive
                    ? "border border-teal-200 bg-teal-50 font-semibold text-teal-700 dark:border-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                    : "border border-transparent text-stone-700 hover:border-surface-border hover:bg-surface-light hover:text-stone-900 dark:text-stone-200 dark:hover:border-surface-dark-border dark:hover:bg-surface-dark dark:hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <span className="pointer-events-none absolute inset-y-2 start-0 w-0.5 rounded-full bg-teal-500" />
                )}
                <span className={cn("relative shrink-0 transition-transform duration-[var(--duration-ui)] ease-[var(--ease-smooth)] group-hover:scale-105", isActive && "text-teal-600 dark:text-teal-300")}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                          isActive
                            ? "bg-white/18 text-white"
                            : "travel-chip"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {footer && !collapsed && (
        <div className="relative border-t border-surface-border p-4 dark:border-surface-dark-border">
          {footer}
        </div>
      )}
    </aside>
  );
}

export { Sidebar, type SidebarProps, type SidebarItem };
