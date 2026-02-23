import type { Hono } from "hono";
import { API_VERSION } from "../config";
import { mockItems } from "../mock-data";
import {
  errorPayload,
  getRequestId,
  isSafeIdentifier,
  parseLimit,
  parsePage,
  validateQuery,
  withJsonCache,
} from "../security";
import type { AppEnv, ContentType } from "../types";

export function registerContentRoutes(app: Hono<AppEnv>) {
  app.get("/api/v1/list", (c) =>
    withJsonCache(
      c,
      `list:${c.req.query("page") ?? "1"}:${c.req.query("limit") ?? "12"}:${c.req.query("type") ?? "all"}`,
      12,
      () => {
        const page = parsePage(c.req.query("page"));
        const limit = parseLimit(c.req.query("limit"));
        const type = c.req.query("type");
        const normalizedType =
          type === "anime" || type === "comic" ? (type as ContentType) : null;

        const filtered = normalizedType
          ? mockItems.filter((item) => item.type === normalizedType)
          : mockItems;
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = filtered.slice(start, end);
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return {
          status: 200,
          payload: {
            ok: true,
            apiVersion: API_VERSION,
            requestId: getRequestId(c),
            data,
            pagination: { page, limit, total, totalPages },
            filters: { type: normalizedType },
          },
        };
      },
    ),
  );

  app.get("/api/v1/detail/:id", (c) => {
    const id = c.req.param("id");
    if (!isSafeIdentifier(id)) {
      return errorPayload(c, 400, "INVALID_ID", "Invalid id format");
    }

    const found = mockItems.find((item) => item.id === id);
    if (!found) {
      return errorPayload(c, 404, "ITEM_NOT_FOUND", "Item not found");
    }

    return c.json({
      ok: true,
      apiVersion: API_VERSION,
      requestId: getRequestId(c),
      data: found,
    });
  });

  app.get("/api/v1/search", (c) => {
    const q = (c.req.query("q") ?? "").trim().toLowerCase();
    const queryValidation = validateQuery(q);
    if (queryValidation === "QUERY_REQUIRED") {
      return errorPayload(c, 400, "QUERY_REQUIRED", "Missing required query parameter: q");
    }
    if (queryValidation === "QUERY_TOO_LONG") {
      return errorPayload(c, 400, "QUERY_TOO_LONG", "Query max length is 120");
    }

    const page = parsePage(c.req.query("page"));
    const limit = parseLimit(c.req.query("limit"));
    const type = c.req.query("type");
    const normalizedType =
      type === "anime" || type === "comic" ? (type as ContentType) : null;

    const filteredByType = normalizedType
      ? mockItems.filter((item) => item.type === normalizedType)
      : mockItems;
    const searched = filteredByType.filter((item) => {
      const haystack =
        `${item.title} ${item.synopsis} ${item.latestEpisodeOrChapter}`.toLowerCase();
      return haystack.includes(q);
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    const data = searched.slice(start, end);
    const total = searched.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return withJsonCache(c, `search:${q}:${page}:${limit}:${normalizedType ?? "all"}`, 8, () => ({
      status: 200,
      payload: {
        ok: true,
        apiVersion: API_VERSION,
        requestId: getRequestId(c),
        query: q,
        data,
        pagination: { page, limit, total, totalPages },
        filters: { type: normalizedType },
      },
    }));
  });
}
