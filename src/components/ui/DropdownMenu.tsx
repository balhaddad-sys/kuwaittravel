"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
}

function DropdownMenu({ trigger, items, align = "end", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute top-full mt-1 z-[var(--z-dropdown)] min-w-[180px] rounded-[var(--radius-lg)] bg-white dark:bg-surface-dark-card shadow-modal border border-surface-border dark:border-surface-dark-border animate-scale-in py-1",
            align === "end" ? "end-0" : "start-0"
          )}
        >
          {items.map((item, i) => (
            <button
              key={i}
              className={cn(
                "flex w-full items-center gap-2 px-4 py-2.5 text-body-md transition-colors text-start",
                item.danger
                  ? "text-error hover:bg-error-light"
                  : "text-navy-700 dark:text-navy-200 hover:bg-surface-muted dark:hover:bg-surface-dark-border"
              )}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { DropdownMenu, type DropdownMenuProps, type DropdownItem };
