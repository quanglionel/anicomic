import type { CacheEntry } from "./types";

export const responseCache = new Map<string, CacheEntry>();
export const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
