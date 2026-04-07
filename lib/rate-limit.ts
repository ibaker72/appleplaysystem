// Rate limiter with optional Upstash Redis backend
// Falls back to in-memory implementation for local dev

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// --- In-memory fallback ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function inMemoryRateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(options.key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(options.key, { count: 1, resetTime: now + options.windowMs });
    return { success: true, remaining: options.limit - 1 };
  }

  if (record.count >= options.limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: options.limit - record.count };
}

// --- Upstash Redis backend ---
let redis: Redis | null = null;
const rateLimiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  redis = new Redis({ url, token });
  return redis;
}

function getUpstashLimiter(limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  let limiter = rateLimiters.get(cacheKey);
  if (!limiter) {
    const r = getRedis()!;
    limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: "rl",
    });
    rateLimiters.set(cacheKey, limiter);
  }
  return limiter;
}

// --- Public API ---
export async function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<{ success: boolean; remaining: number }> {
  const r = getRedis();
  if (!r) {
    return inMemoryRateLimit(options);
  }

  const limiter = getUpstashLimiter(options.limit, options.windowMs);
  const result = await limiter.limit(options.key);
  return { success: result.success, remaining: result.remaining };
}
