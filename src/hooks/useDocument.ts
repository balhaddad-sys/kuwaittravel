"use client";

import { useState, useEffect } from "react";
import { onDocumentChange } from "@/lib/firebase/firestore";

export function useDocument<T>(collectionName: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onDocumentChange<T>(collectionName, docId, (doc) => {
      setData(doc);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}
