import { describe, it, expect } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows requests up to the limit then blocks', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => 0 });
    expect(limiter.check('ip')).toBe(true);
    expect(limiter.check('ip')).toBe(true);
    expect(limiter.check('ip')).toBe(true);
    expect(limiter.check('ip')).toBe(false); // 4th in the window is blocked
  });

  it('tracks each key independently', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    expect(limiter.check('a')).toBe(true);
    expect(limiter.check('b')).toBe(true); // different key, fresh budget
    expect(limiter.check('a')).toBe(false);
  });

  it('resets the budget after the window elapses', () => {
    let clock = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => clock });
    expect(limiter.check('ip')).toBe(true);
    expect(limiter.check('ip')).toBe(false);
    clock = 1001; // window expired
    expect(limiter.check('ip')).toBe(true);
  });

  it('defaults to 20 requests per 60s window', () => {
    const limiter = createRateLimiter({ now: () => 0 });
    for (let i = 0; i < 20; i++) expect(limiter.check('ip')).toBe(true);
    expect(limiter.check('ip')).toBe(false);
  });
});
