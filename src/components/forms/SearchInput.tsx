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
  const [isFocused, setIsFocused] = useState(false);
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div
      className={cn(
        "relative transform-gpu transition-transform duration-[var(--duration-ui)] ease-[var(--ease-spring)] sm:focus-within:scale-[1.01]",
        className
      )}
    >
      <Search
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-[var(--duration-ui)] ease-[var(--ease-spring)]",
          isFocused ? "text-sky-600 dark:text-sky-300" : "text-slate-400"
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-pill)] border border-surface-border bg-white py-2.5 ps-10 pe-10 text-body-md text-slate-800 transform-gpu shadow-[0_2px_8px_rgba(15,17,22,0.05)] transition-[border-color,box-shadow,background-color,width] duration-[var(--duration-ui)] ease-[var(--ease-spring)] hover:border-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-300/25 focus:outline-none dark:border-surface-dark-border dark:bg-surface-dark-card/88 dark:text-slate-100 dark:hover:border-sky-600/40 dark:focus:border-sky-500 dark:focus:ring-sky-500/25"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-[color,transform] duration-[var(--duration-ui)] ease-[var(--ease-spring)] hover:text-sky-600 active:scale-[0.92]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { SearchInput, type SearchInputProps };
