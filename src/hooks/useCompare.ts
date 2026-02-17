"use client";
import { useLocalStorage } from "./useLocalStorage";

const MAX_COMPARE = 3;

export function useCompare() {
  const [compareIds, setCompareIds] = useLocalStorage<string[]>("rahal-compare", []);

  const addToCompare = (tripId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(tripId)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, tripId];
    });
  };

  const removeFromCompare = (tripId: string) => {
    setCompareIds((prev) => prev.filter((id) => id !== tripId));
  };

  const clearCompare = () => setCompareIds([]);

  const isInCompare = (tripId: string) => compareIds.includes(tripId);

  return {
    compareIds,
    compareCount: compareIds.length,
    isFull: compareIds.length >= MAX_COMPARE,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
  };
}
