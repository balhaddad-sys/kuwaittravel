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
        className="w-full rounded-[var(--radius-input)] border border-surface-border/90 bg-white/86 py-2.5 ps-10 pe-10 text-body-md transform-gpu transition-[border-color,box-shadow,background-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] backdrop-blur-sm hover:border-navy-300 focus:border-navy-400 focus:ring-4 focus:ring-navy-400/15 focus:outline-none dark:border-surface-dark-border/90 dark:bg-surface-dark-card/82 dark:hover:border-navy-600"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-navy-400 transition-[color,transform] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:text-navy-600 active:scale-[0.92]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { SearchInput, type SearchInputProps };
