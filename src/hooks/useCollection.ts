"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { type QueryConstraint } from "firebase/firestore";
import { onCollectionChange } from "@/lib/firebase/firestore";

export function useCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initialLoad = useRef(true);
  const constraintsKey = useMemo(() => JSON.stringify(constraints), [constraints]);

  const handleItems = useCallback((items: T[]) => {
    setData(items);
    setError(null);
    if (initialLoad.current) {
      setLoading(false);
      initialLoad.current = false;
    }
  }, []);

  useEffect(() => {
    initialLoad.current = true;
    setLoading(true);
    setError(null);

    const unsubscribe = onCollectionChange<T>(
      collectionName,
      constraints,
      handleItems,
      (listenerError) => {
        setError(listenerError);
        if (initialLoad.current) {
          setLoading(false);
          initialLoad.current = false;
        }
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, constraintsKey, handleItems]);

  return { data, loading, error };
}
