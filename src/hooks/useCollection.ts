"use client";

import { useState, useEffect } from "react";
import { type QueryConstraint } from "firebase/firestore";
import { onCollectionChange } from "@/lib/firebase/firestore";

export function useCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onCollectionChange<T>(collectionName, constraints, (items) => {
      setData(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}
