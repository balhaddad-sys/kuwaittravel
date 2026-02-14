"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  delay?: number;
  className?: string;
}

function SearchInput({ placeholder = "بحث...", onSearch, delay = 300, className }: SearchInputProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-input)] border border-surface-border bg-white py-2.5 ps-10 pe-10 text-body-md transition-all duration-200 hover:border-navy-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 focus:outline-none dark:border-surface-dark-border dark:bg-surface-dark-card"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-navy-400 hover:text-navy-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { SearchInput, type SearchInputProps };
