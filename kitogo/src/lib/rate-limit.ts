// Simple in-memory sliding-window-ish rate limiter keyed by an identifier
// (e.g. client IP). Exposed as a factory so each consumer — and each test —
// gets isolated state instead of sharing one module-level Map.

export interface RateLimiterOptions {
  /** Max requests allowed per window. */
  limit?: number;
  /** Window length in milliseconds. */
  windowMs?: number;
  /** Injectable clock for deterministic tests. */
  now?: () => number;
}

export function createRateLimiter(options: RateLimiterOptions = {}) {
  const limit = options.limit ?? 20;
  const windowMs = options.windowMs ?? 60_000;
  const now = options.now ?? Date.now;
  const map = new Map<string, { count: number; resetAt: number }>();

  /** Returns true if the request is allowed, false if the limit is exceeded. */
  function check(key: string): boolean {
    const ts = now();
    const entry = map.get(key);
    if (!entry || entry.resetAt < ts) {
      map.set(key, { count: 1, resetAt: ts + windowMs });
      return true;
    }
    if (entry.count >= limit) return false;
    entry.count++;
    return true;
  }

  return { check };
}
