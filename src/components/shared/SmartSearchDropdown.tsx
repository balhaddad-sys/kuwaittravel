"use client";

import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { Clock, TrendingUp, Search } from "lucide-react";

interface SmartSearchDropdownProps {
  recentSearches: string[];
  popularDestinations?: string[];
  onSelect: (query: string) => void;
  onClearRecent?: () => void;
  className?: string;
}

function SmartSearchDropdown({
  recentSearches,
  popularDestinations = [],
  onSelect,
  onClearRecent,
  className,
}: SmartSearchDropdownProps) {
  const { t } = useDirection();

  return (
    <div className={cn(
      "sacred-panel absolute start-0 top-full z-20 mt-1 w-full overflow-hidden rounded-[var(--radius-lg)] shadow-xl",
      className
    )}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-body-sm font-medium text-gray-500 dark:text-indigo-300/60">
              <Clock className="h-3.5 w-3.5" />
              {t("بحث سابق", "Recent")}
            </span>
            {onClearRecent && (
              <button
                onClick={onClearRecent}
                className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {t("مسح", "Clear")}
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {recentSearches.slice(0, 5).map((query) => (
              <button
                key={query}
                onClick={() => onSelect(query)}
                className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-2 py-2 text-start text-body-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-indigo-100 dark:hover:bg-indigo-800/50"
              >
                <Search className="h-3.5 w-3.5 text-gray-400" />
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Destinations */}
      {popularDestinations.length > 0 && (
        <div className="border-t border-surface-border p-3 dark:border-surface-dark-border">
          <span className="mb-2 flex items-center gap-1.5 text-body-sm font-medium text-gray-500 dark:text-indigo-300/60">
            <TrendingUp className="h-3.5 w-3.5" />
            {t("وجهات رائجة", "Popular")}
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {popularDestinations.map((dest) => (
              <button
                key={dest}
                onClick={() => onSelect(dest)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-body-sm text-gray-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-[#1A2D48] dark:bg-indigo-800 dark:text-indigo-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { SmartSearchDropdown, type SmartSearchDropdownProps };
