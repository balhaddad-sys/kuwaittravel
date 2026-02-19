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
        "fixed top-0 start-0 z-[var(--z-sidebar)] hidden h-screen flex-col border-e border-stone-200 bg-white shadow-sidebar transition-[width,background-color,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] dark:border-stone-700 dark:bg-stone-900 lg:flex",
        collapsed ? "w-[84px]" : "w-[286px]"
      )}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-stone-200 p-4 dark:border-stone-700">
        {!collapsed && (
          <div className="max-w-[190px] truncate">{header}</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 rounded-[var(--radius-md)] border border-transparent p-2 text-stone-400 transition-[background-color,color,border-color,transform] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:border-stone-200 hover:bg-stone-50 hover:text-stone-600 active:scale-[0.97] dark:text-stone-500 dark:hover:border-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300"
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
                <div className="mx-2 my-2 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent dark:via-stone-700" />
              )}
              <Link
                href={item.href}
                prefetch
                className={cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-[var(--radius-lg)] px-3 py-2.5 text-body-md transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.985]",
                  isActive
                    ? "border border-teal-100 bg-teal-50 font-semibold text-teal-700 dark:border-teal-900 dark:bg-teal-950/50 dark:text-teal-300"
                    : "border border-transparent text-stone-500 hover:border-stone-100 hover:bg-stone-50 hover:text-stone-700 dark:text-stone-400 dark:hover:border-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <span className="pointer-events-none absolute inset-y-2 start-0 w-0.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                )}
                <span className={cn("relative shrink-0 transition-transform duration-[var(--duration-ui)] ease-[var(--ease-smooth)] group-hover:scale-105", isActive && "text-teal-600 dark:text-teal-400")}>
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
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
                            : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
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
        <div className="relative border-t border-stone-200 p-4 dark:border-stone-700">
          {footer}
        </div>
      )}
    </aside>
  );
}

export { Sidebar, type SidebarProps, type SidebarItem };
