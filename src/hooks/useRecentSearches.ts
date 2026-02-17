"use client";
import { useLocalStorage } from "./useLocalStorage";

const MAX_RECENT = 8;

export function useRecentSearches() {
  const [searches, setSearches] = useLocalStorage<string[]>("rahal-recent-searches", []);

  const addSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      return [trimmed, ...filtered].slice(0, MAX_RECENT);
    });
  };

  const removeSearch = (query: string) => {
    setSearches((prev) => prev.filter((s) => s !== query));
  };

  const clearSearches = () => setSearches([]);

  return { searches, addSearch, removeSearch, clearSearches };
}
