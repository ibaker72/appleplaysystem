// Simple in-memory rate limiter for API routes
// For production, replace with Redis-based solution

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: {
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
