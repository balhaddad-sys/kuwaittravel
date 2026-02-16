"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorage<string[]>("rahal-wishlist", []);

  const isWishlisted = useCallback(
    (tripId: string) => wishlist.includes(tripId),
    [wishlist]
  );

  const toggle = useCallback(
    (tripId: string) => {
      setWishlist((prev) =>
        prev.includes(tripId)
          ? prev.filter((id) => id !== tripId)
          : [...prev, tripId]
      );
    },
    [setWishlist]
  );

  return { wishlist, isWishlisted, toggle, count: wishlist.length };
}
