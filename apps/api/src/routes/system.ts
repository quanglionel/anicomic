import type { Hono } from "hono";
import { API_VERSION } from "../config";
import { errorPayload, getRequestId, withJsonCache } from "../security";
import type { AppEnv } from "../types";

export function registerSystemRoutes(app: Hono<AppEnv>) {
  app.get("/", (c) =>
    c.json({
      service: "anicomic-api",
      message: "API worker is running",
      docs: ["/health", "/api/v1/status"],
    }),
  );

  app.get("/health", (c) =>
    c.json({
      ok: true,
      requestId: getRequestId(c),
      service: "anicomic-api",
      timestamp: new Date().toISOString(),
    }),
  );

  app.get("/api/v1/status", (c) =>
    withJsonCache(c, "status", 20, () => ({
      status: 200,
      payload: {
        ok: true,
        requestId: getRequestId(c),
        phase: "step-9-cache-rate-limit-hardening",
        version: "0.1.0",
        endpoints: {
          health: "/health",
          status: "/api/v1/status",
          dbHealth: "/api/v1/db/health",
          list: "/api/v1/list?page=1&limit=12&type=anime|comic",
          detail: "/api/v1/detail/:id",
          search: "/api/v1/search?q=keyword&page=1&limit=12&type=anime|comic",
          plugins: "/api/v1/plugins",
          pluginValidate: "POST /api/v1/plugins/validate",
          parserList: "/api/v1/parser/list?pluginId=animehub-alpha",
          parserSearch: "/api/v1/parser/search?pluginId=animehub-alpha&q=solo",
          parserDetail:
            "/api/v1/parser/detail?pluginId=animehub-alpha&id=animehub-alpha-solo-leveling",
          parserWatchRead:
            "/api/v1/parser/watch-read?pluginId=animehub-alpha&id=animehub-alpha-solo-leveling",
        },
        hardening: {
          requestId: true,
          inMemoryRateLimit: true,
          inMemoryCache: true,
        },
      },
    })),
  );

  app.get("/api/v1/db/health", async (c) => {
    try {
      const migrationCheck = await c.env.DB.prepare(
        "SELECT COUNT(*) AS total FROM sqlite_master WHERE type = 'table' AND name = 'plugins'",
      ).first<{ total: number }>();
      const pluginCount = await c.env.DB.prepare(
        "SELECT COUNT(*) AS total FROM plugins",
      ).first<{ total: number }>();

      return c.json({
        ok: true,
        apiVersion: API_VERSION,
        requestId: getRequestId(c),
        database: {
          binding: "DB",
          pluginsTableExists: Number(migrationCheck?.total ?? 0) > 0,
          pluginsCount: Number(pluginCount?.total ?? 0),
        },
      });
    } catch (error) {
      return errorPayload(c, 500, "D1_HEALTHCHECK_FAILED", "D1 health check failed", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
