import { cors } from "hono/cors";
import type { Hono } from "hono";
import { MAX_URL_LENGTH } from "./config";
import { errorPayload } from "./security";
import type { AppEnv } from "./types";

export function registerMiddleware(app: Hono<AppEnv>) {
  app.use("/api/*", cors());

  app.use("*", async (c, next) => {
    const requestId = c.req.header("X-Request-Id") || crypto.randomUUID();
    c.set("requestId", requestId);

    if (c.req.url.length > MAX_URL_LENGTH) {
      return errorPayload(c, 414, "URL_TOO_LONG", "Request URL is too long");
    }

    const startedAt = Date.now();
    await next();

    c.header("X-Request-Id", requestId);
    c.header("X-Content-Type-Options", "nosniff");
    c.header("Referrer-Policy", "no-referrer");
    c.header("X-Frame-Options", "DENY");
    c.header("X-Response-Time", `${Date.now() - startedAt}ms`);
  });
}
