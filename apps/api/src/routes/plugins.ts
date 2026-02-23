import type { Hono } from "hono";
import { validatePluginManifest } from "@cpc/shared/plugin";
import { API_VERSION, MAX_VALIDATE_PAYLOAD_BYTES } from "../config";
import { listPluginManifests } from "../db";
import { errorPayload, getRequestId, withJsonCache } from "../security";
import type { AppEnv } from "../types";

export function registerPluginRoutes(app: Hono<AppEnv>) {
  app.get("/api/v1/plugins", async (c) =>
    withJsonCache(c, "plugins", 20, async () => {
      const loaded = await listPluginManifests(c.env.DB);
      return {
        status: 200,
        payload: {
          ok: true,
          apiVersion: API_VERSION,
          requestId: getRequestId(c),
          source: loaded.source,
          warning: loaded.error ?? null,
          data: loaded.data,
          total: loaded.data.length,
        },
      };
    }),
  );

  app.post("/api/v1/plugins/validate", async (c) => {
    const contentLength = Number(c.req.header("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_VALIDATE_PAYLOAD_BYTES) {
      return errorPayload(
        c,
        413,
        "PAYLOAD_TOO_LARGE",
        "Payload exceeds 64KB limit for validation endpoint",
      );
    }

    const body = await c.req.json().catch(() => null);
    if (!body) {
      return errorPayload(c, 400, "INVALID_JSON_BODY", "Invalid JSON body");
    }

    const result = validatePluginManifest(body);
    if (!result.success) {
      return errorPayload(c, 400, "PLUGIN_VALIDATION_FAILED", "Plugin manifest validation failed", {
        issues: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      });
    }

    return c.json({
      ok: true,
      apiVersion: API_VERSION,
      requestId: getRequestId(c),
      data: result.data,
    });
  });
}
