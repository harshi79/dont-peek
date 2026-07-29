interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class MemoryRateLimiter {
  private cache = new Map<string, RateLimitRecord>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 30, windowMs: number = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  public check(key: string): { allowed: boolean; remaining: number; reset: number } {
    const now = Date.now();
    const record = this.cache.get(key);

    if (!record || now > record.resetTime) {
      const resetTime = now + this.windowMs;
      this.cache.set(key, { count: 1, resetTime });
      this.cleanup(now);
      return { allowed: true, remaining: this.maxRequests - 1, reset: resetTime };
    }

    if (record.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, reset: record.resetTime };
    }

    record.count += 1;
    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime,
    };
  }

  private cleanup(now: number) {
    if (this.cache.size > 2000) {
      for (const [k, v] of this.cache.entries()) {
        if (now > v.resetTime) {
          this.cache.delete(k);
        }
      }
    }
  }
}

export const shortenRateLimiter = new MemoryRateLimiter(40, 60 * 1000); // 40 requests per minute per IP

export function getClientIp(headersList: Headers): string {
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = headersList.get("x-real-ip");
  if (realIp) return realIp;
  return "anonymous";
}
