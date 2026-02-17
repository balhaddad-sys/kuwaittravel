"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChecklistItemStatus } from "@/types/checklist";

interface ChecklistState {
  [itemId: string]: ChecklistItemStatus;
}

export function useChecklist(tripId: string) {
  const storageKey = `checklist-${tripId}`;

  const [state, setState] = useState<ChecklistState>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // storage full or unavailable
    }
  }, [state, storageKey]);

  const getStatus = useCallback(
    (itemId: string): ChecklistItemStatus => state[itemId] || "pending",
    [state]
  );

  const setStatus = useCallback(
    (itemId: string, status: ChecklistItemStatus) => {
      setState((prev) => ({ ...prev, [itemId]: status }));
    },
    []
  );

  const resetAll = useCallback(() => {
    setState({});
  }, []);

  const completedCount = Object.values(state).filter((s) => s === "completed").length;

  return { getStatus, setStatus, resetAll, completedCount, state };
}
