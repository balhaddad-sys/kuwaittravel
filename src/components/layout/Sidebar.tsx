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

  return (
    <aside
      className={cn(
        "fixed top-0 start-0 z-[var(--z-sidebar)] flex h-screen flex-col border-e border-surface-border/75 dark:border-surface-dark-border/80 bg-gradient-to-b from-white/92 via-surface-muted/78 to-white/92 dark:from-surface-dark/92 dark:via-surface-dark-card/88 dark:to-surface-dark/92 backdrop-blur-sm shadow-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent" />
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-border dark:border-surface-dark-border">
        {!collapsed && header}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 text-navy-400 hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors"
        >
          {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-body-md transition-all duration-300",
                isActive
                  ? "bg-gradient-to-br from-navy-600 to-navy-700 text-white font-medium shadow-[0_10px_24px_rgba(23,57,108,0.32)]"
                  : "text-navy-700 dark:text-navy-200 hover:bg-white/55 dark:hover:bg-surface-dark-card/70 hover:text-navy-800 dark:hover:text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                      isActive ? "bg-white/20 text-white" : "bg-gold-500 text-navy-900"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {footer && !collapsed && (
        <div className="border-t border-surface-border dark:border-surface-dark-border p-4">
          {footer}
        </div>
      )}
    </aside>
  );
}

export { Sidebar, type SidebarProps, type SidebarItem };
