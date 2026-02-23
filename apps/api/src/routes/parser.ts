import type { Hono } from "hono";
import { parseDetail, parseList, parseSearch, parseWatchRead } from "@cpc/shared/parser";
import { API_VERSION } from "../config";
import { getPluginManifest } from "../db";
import { getSnapshot } from "../mock-data";
import {
  enforceRateLimit,
  errorPayload,
  getClientIp,
  getRequestId,
  isSafeIdentifier,
  validateQuery,
  withJsonCache,
} from "../security";
import type { AppEnv } from "../types";

export function registerParserRoutes(app: Hono<AppEnv>) {
  app.get("/api/v1/parser/list", async (c) => {
    const pluginId = c.req.query("pluginId");
    if (!isSafeIdentifier(pluginId)) {
      return errorPayload(c, 400, "INVALID_PLUGIN_ID", "Invalid pluginId format");
    }

    const plugin = await getPluginManifest(c.env.DB, pluginId);
    if (!plugin) {
      return errorPayload(c, 404, "PLUGIN_NOT_FOUND", "Plugin not found");
    }

    const snapshot = getSnapshot(plugin.id);
    if (!snapshot) {
      return errorPayload(c, 404, "SNAPSHOT_NOT_FOUND", "Snapshot not found for plugin");
    }

    const ip = getClientIp(c);
    const limiter = enforceRateLimit(c, `parser:list:${plugin.id}:${ip}`, plugin.rateLimit.requestsPerMinute);
    if (!limiter.allowed) {
      return errorPayload(c, 429, "RATE_LIMITED", "Too many parser requests for this plugin");
    }

    return withJsonCache(c, `parser:list:${plugin.id}`, 20, () => ({
      status: 200,
      payload: {
        ok: true,
        apiVersion: API_VERSION,
        requestId: getRequestId(c),
        pluginId: plugin.id,
        data: parseList(snapshot.list, plugin.parserRules.list),
      },
    }));
  });

  app.get("/api/v1/parser/search", async (c) => {
    const pluginId = c.req.query("pluginId");
    const q = (c.req.query("q") ?? "").trim().toLowerCase();

    if (!isSafeIdentifier(pluginId)) {
      return errorPayload(c, 400, "INVALID_PLUGIN_ID", "Invalid pluginId format");
    }

    const queryValidation = validateQuery(q);
    if (queryValidation === "QUERY_REQUIRED") {
      return errorPayload(c, 400, "QUERY_REQUIRED", "Missing required query parameter: q");
    }
    if (queryValidation === "QUERY_TOO_LONG") {
      return errorPayload(c, 400, "QUERY_TOO_LONG", "Query max length is 120");
    }

    const plugin = await getPluginManifest(c.env.DB, pluginId);
    if (!plugin) {
      return errorPayload(c, 404, "PLUGIN_NOT_FOUND", "Plugin not found");
    }

    const snapshot = getSnapshot(plugin.id);
    if (!snapshot) {
      return errorPayload(c, 404, "SNAPSHOT_NOT_FOUND", "Snapshot not found for plugin");
    }

    const ip = getClientIp(c);
    const limiter = enforceRateLimit(c, `parser:search:${plugin.id}:${ip}`, plugin.rateLimit.requestsPerMinute);
    if (!limiter.allowed) {
      return errorPayload(c, 429, "RATE_LIMITED", "Too many parser requests for this plugin");
    }

    const parsed = parseSearch(snapshot.search, plugin.parserRules.search).filter((item) =>
      item.title.toLowerCase().includes(q),
    );

    return withJsonCache(c, `parser:search:${plugin.id}:${q}`, 12, () => ({
      status: 200,
      payload: {
        ok: true,
        apiVersion: API_VERSION,
        requestId: getRequestId(c),
        pluginId: plugin.id,
        query: q,
        data: parsed,
      },
    }));
  });

  app.get("/api/v1/parser/detail", async (c) => {
    const pluginId = c.req.query("pluginId");
    const id = c.req.query("id");

    if (!isSafeIdentifier(pluginId)) {
      return errorPayload(c, 400, "INVALID_PLUGIN_ID", "Invalid pluginId format");
    }
    if (!isSafeIdentifier(id)) {
      return errorPayload(c, 400, "INVALID_ID", "Invalid id format");
    }

    const plugin = await getPluginManifest(c.env.DB, pluginId);
    if (!plugin) {
      return errorPayload(c, 404, "PLUGIN_NOT_FOUND", "Plugin not found");
    }

    const ip = getClientIp(c);
    const limiter = enforceRateLimit(c, `parser:detail:${plugin.id}:${ip}`, plugin.rateLimit.requestsPerMinute);
    if (!limiter.allowed) {
      return errorPayload(c, 429, "RATE_LIMITED", "Too many parser requests for this plugin");
    }

    const snapshot = getSnapshot(plugin.id);
    const detailHtml = snapshot?.detailById[id];
    if (!detailHtml) {
      return errorPayload(c, 404, "DETAIL_NOT_FOUND", "Detail snapshot not found");
    }

    return withJsonCache(c, `parser:detail:${plugin.id}:${id}`, 30, () => ({
      status: 200,
      payload: {
        ok: true,
        apiVersion: API_VERSION,
        requestId: getRequestId(c),
        pluginId: plugin.id,
        id,
        data: parseDetail(detailHtml, plugin.parserRules.detail),
      },
    }));
  });

  app.get("/api/v1/parser/watch-read", async (c) => {
    const pluginId = c.req.query("pluginId");
    const id = c.req.query("id");

    if (!isSafeIdentifier(pluginId)) {
      return errorPayload(c, 400, "INVALID_PLUGIN_ID", "Invalid pluginId format");
    }
    if (!isSafeIdentifier(id)) {
      return errorPayload(c, 400, "INVALID_ID", "Invalid id format");
    }

    const plugin = await getPluginManifest(c.env.DB, pluginId);
    if (!plugin) {
      return errorPayload(c, 404, "PLUGIN_NOT_FOUND", "Plugin not found");
    }

    const ip = getClientIp(c);
    const limiter = enforceRateLimit(
      c,
      `parser:watch-read:${plugin.id}:${ip}`,
      plugin.rateLimit.requestsPerMinute,
    );
    if (!limiter.allowed) {
      return errorPayload(c, 429, "RATE_LIMITED", "Too many parser requests for this plugin");
    }

    const snapshot = getSnapshot(plugin.id);
    const watchReadHtml = snapshot?.watchReadById[id];
    if (!watchReadHtml) {
      return errorPayload(c, 404, "WATCH_READ_NOT_FOUND", "Watch/Read snapshot not found");
    }

    return withJsonCache(c, `parser:watch-read:${plugin.id}:${id}`, 30, () => ({
      status: 200,
      payload: {
        ok: true,
        apiVersion: API_VERSION,
        requestId: getRequestId(c),
        pluginId: plugin.id,
        id,
        data: parseWatchRead(watchReadHtml, plugin.parserRules.watchRead),
      },
    }));
  });
}
