import { API_VERSION, MAX_PATH_LENGTH, MAX_QUERY_LENGTH, RATE_LIMIT_WINDOW_MS } from "./config";
import { rateLimitStore, responseCache } from "./state";
import type { ApiResult, AppContext } from "./types";

export function parsePage(value: string | undefined): number {
  if (!value) return 1;
  const num = Number(value);
  return Number.isFinite(num) && num >= 1 ? Math.floor(num) : 1;
}

export function parseLimit(value: string | undefined): number {
  if (!value) return 12;
  const num = Number(value);
  if (!Number.isFinite(num) || num < 1) return 12;
  return Math.min(Math.floor(num), 50);
}

export function getRequestId(c: AppContext): string {
  return c.get("requestId");
}

export function isSafeIdentifier(value: string | undefined): value is string {
  return Boolean(value && /^[a-z0-9-]+$/.test(value) && value.length <= MAX_PATH_LENGTH);
}

export function validateQuery(q: string): string | null {
  if (!q) return "QUERY_REQUIRED";
  if (q.length > MAX_QUERY_LENGTH) return "QUERY_TOO_LONG";
  return null;
}

export function getClientIp(c: AppContext): string {
  const cfIp = c.req.header("CF-Connecting-IP");
  if (cfIp) return cfIp;
  const forwarded = c.req.header("X-Forwarded-For");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

export function errorPayload(
  c: AppContext,
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>,
) {
  return c.json(
    {
      ok: false,
      apiVersion: API_VERSION,
      requestId: getRequestId(c),
      error: message,
      code,
      ...(extra ?? {}),
    },
    status,
  );
}

export async function withJsonCache(
  c: AppContext,
  key: string,
  ttlSeconds: number,
  build: () => Promise<{ status: number; payload: ApiResult }> | { status: number; payload: ApiResult },
) {
  const now = Date.now();
  const cached = responseCache.get(key);
  if (cached && cached.expiresAt > now) {
    c.header("X-Cache", "HIT");
    return c.json(cached.payload, cached.status);
  }

  c.header("X-Cache", "MISS");
  const built = await build();
  if (built.status < 500) {
    responseCache.set(key, {
      expiresAt: now + ttlSeconds * 1000,
      status: built.status,
      payload: built.payload,
    });
  }

  return c.json(built.payload, built.status);
}

export function enforceRateLimit(c: AppContext, bucket: string, limitPerMinute: number) {
  const now = Date.now();
  const record = rateLimitStore.get(bucket);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(bucket, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    c.header("X-RateLimit-Limit", String(limitPerMinute));
    c.header("X-RateLimit-Remaining", String(Math.max(0, limitPerMinute - 1)));
    return { allowed: true };
  }

  if (record.count >= limitPerMinute) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    c.header("Retry-After", String(Math.max(1, retryAfter)));
    c.header("X-RateLimit-Limit", String(limitPerMinute));
    c.header("X-RateLimit-Remaining", "0");
    return { allowed: false };
  }

  record.count += 1;
  rateLimitStore.set(bucket, record);
  c.header("X-RateLimit-Limit", String(limitPerMinute));
  c.header("X-RateLimit-Remaining", String(Math.max(0, limitPerMinute - record.count)));
  return { allowed: true };
}
