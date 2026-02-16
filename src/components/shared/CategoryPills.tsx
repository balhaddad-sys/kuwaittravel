"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface CategoryPillItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CategoryPillsProps {
  items: CategoryPillItem[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
}

function CategoryPills({ items, selected, onSelect, className }: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={cn("flex gap-2 overflow-x-auto scrollbar-hide py-1", className)}
    >
      {items.map((item) => {
        const isActive = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(isActive ? null : item.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] px-4 py-2 text-body-sm font-medium transition-all duration-200",
              isActive
                ? "travel-filter-chip-active"
                : "travel-filter-chip hover:travel-filter-chip"
            )}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export { CategoryPills, type CategoryPillsProps, type CategoryPillItem };
