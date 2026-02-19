"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { onDocumentChange } from "@/lib/firebase/firestore";

export function useDocument<T>(collectionName: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initialLoad = useRef(true);

  const handleDoc = useCallback((doc: T | null) => {
    setData(doc);
    setError(null);
    if (initialLoad.current) {
      setLoading(false);
      initialLoad.current = false;
    }
  }, []);

  useEffect(() => {
    initialLoad.current = true;
    if (!docId) return;

    const unsubscribe = onDocumentChange<T>(
      collectionName,
      docId,
      handleDoc,
      (listenerError) => {
        setError(listenerError);
        if (initialLoad.current) {
          setLoading(false);
          initialLoad.current = false;
        }
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId, handleDoc]);

  return {
    data: docId ? data : null,
    loading: docId ? loading : false,
    error: docId ? error : null,
  };
}
