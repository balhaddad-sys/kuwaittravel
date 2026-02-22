"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

function scheduleOnIdle(task: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  if ("requestIdleCallback" in window) {
    const requestIdle = window.requestIdleCallback.bind(window);
    const cancelIdle = window.cancelIdleCallback.bind(window);
    const idleHandle = requestIdle(() => {
      task();
    }, { timeout: 1200 });

    return () => cancelIdle(idleHandle);
  }

  const timeoutHandle = globalThis.setTimeout(task, 150);
  return () => globalThis.clearTimeout(timeoutHandle);
}

/**
 * Prefetches a set of routes once the browser is idle.
 * This makes bottom-nav and sidebar navigation feel instant on subsequent taps.
 */
export function useRoutePrefetch(routes: string[]) {
  const router = useRouter();
  const stableRoutes = useMemo(
    () => Array.from(new Set(routes)).filter(Boolean),
    [routes]
  );

  useEffect(() => {
    if (stableRoutes.length === 0) return;

    let cancelled = false;
    const cleanup = scheduleOnIdle(() => {
      if (cancelled) return;
      stableRoutes.forEach((route) => {
        router.prefetch(route);
      });
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [router, stableRoutes]);
}
