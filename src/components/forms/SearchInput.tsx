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
        "relative",
        className
      )}
    >
      <Search
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200",
          isFocused ? "text-[#222222] dark:text-sky-300" : "text-[#717171]"
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[#EBEBEB] bg-white py-2.5 ps-10 pe-10 text-sm text-[#222222] shadow-[0_2px_8px_rgba(34,34,34,0.08),0_0_0_1px_rgba(34,34,34,0.04)] transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-[#717171] hover:shadow-[0_2px_12px_rgba(34,34,34,0.14),0_0_0_1px_rgba(34,34,34,0.06)] focus:border-[#222222] focus:shadow-[0_2px_12px_rgba(34,34,34,0.14),0_0_0_1px_rgba(34,34,34,0.06)] focus:outline-none dark:border-[#2D3B4F] dark:bg-[#1E293B]/90 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-sky-600/40 dark:focus:border-sky-500 dark:focus:ring-2 dark:focus:ring-sky-500/25"
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
