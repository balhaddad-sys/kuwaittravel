"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { onDocumentChange } from "@/lib/firebase/firestore";

export function useDocument<T>(collectionName: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  const initialLoad = useRef(true);

  const handleDoc = useCallback((doc: T | null) => {
    setData(doc);
    if (initialLoad.current) {
      setLoading(false);
      initialLoad.current = false;
    }
  }, []);

  useEffect(() => {
    if (!docId) return;

    const unsubscribe = onDocumentChange<T>(collectionName, docId, handleDoc);

    return () => unsubscribe();
  }, [collectionName, docId, handleDoc]);

  return { data, loading, error };
}
