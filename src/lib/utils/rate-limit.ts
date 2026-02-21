/**
 * Simple in-memory sliding-window rate limiter for API routes.
 * Each instance tracks request timestamps per key (e.g. IP or UID).
 */

interface RateLimitOptions {
  /** Maximum number of requests allowed within the window. */
  maxRequests: number;
  /** Time window in milliseconds. */
  windowMs: number;
}

interface RateLimitEntry {
  timestamps: number[];
}

export function createRateLimiter({ maxRequests, windowMs }: RateLimitOptions) {
  const store = new Map<string, RateLimitEntry>();

  // Periodically prune stale entries to avoid unbounded memory growth.
  const PRUNE_INTERVAL = 60_000;
  let lastPrune = Date.now();

  function prune(now: number) {
    if (now - lastPrune < PRUNE_INTERVAL) return;
    lastPrune = now;
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  }

  return {
    /** Returns `true` if the request should be **blocked** (rate-limited). */
    isLimited(key: string): boolean {
      const now = Date.now();
      prune(now);

      let entry = store.get(key);
      if (!entry) {
        entry = { timestamps: [] };
        store.set(key, entry);
      }

      // Remove timestamps outside the window
      entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

      if (entry.timestamps.length >= maxRequests) {
        return true;
      }

      entry.timestamps.push(now);
      return false;
    },
  };
}
