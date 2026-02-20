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
        "fixed top-0 start-0 z-[var(--z-sidebar)] hidden h-screen flex-col border-e border-gray-200 bg-white shadow-sidebar transition-[width,background-color,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] dark:border-[#1A2D48] dark:bg-indigo-900 lg:flex",
        collapsed ? "w-[84px]" : "w-[286px]"
      )}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-gray-200 p-4 dark:border-[#1A2D48]">
        {!collapsed && (
          <div className="max-w-[190px] truncate">{header}</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 rounded-[var(--radius-md)] border border-transparent p-2 text-gray-400 transition-[background-color,color,border-color,transform] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:border-gray-200 hover:bg-gray-50 hover:text-gray-600 active:scale-[0.97] dark:text-indigo-300/50 dark:hover:border-indigo-700/40 dark:hover:bg-indigo-800/50 dark:hover:text-indigo-100"
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
                <div className="mx-2 my-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-[#1A2D48]" />
              )}
              <Link
                href={item.href}
                prefetch
                className={cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-[var(--radius-lg)] px-3 py-2.5 text-body-md transform-gpu transition-[transform,background-color,color,box-shadow,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] active:scale-[0.985]",
                  isActive
                    ? "border border-indigo-100 bg-indigo-50 font-semibold text-indigo-700 dark:border-indigo-700/30 dark:bg-indigo-800/60 dark:text-indigo-300"
                    : "border border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-indigo-300/55 dark:hover:border-[#1A2D48] dark:hover:bg-indigo-800/50 dark:hover:text-indigo-100"
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <span className="pointer-events-none absolute inset-y-2 start-0 w-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
                <span className={cn("relative shrink-0 transition-transform duration-[var(--duration-ui)] ease-[var(--ease-smooth)] group-hover:scale-105", isActive && "text-indigo-600 dark:text-indigo-400")}>
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
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-700/30 dark:text-indigo-300"
                            : "bg-gray-100 text-gray-500 dark:bg-indigo-800/60 dark:text-indigo-300/60"
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
        <div className="relative border-t border-gray-200 p-4 dark:border-[#1A2D48]">
          {footer}
        </div>
      )}
    </aside>
  );
}

export { Sidebar, type SidebarProps, type SidebarItem };
