import type { Context } from "hono";
import type { PluginManifest } from "@cpc/shared/plugin";

export type ContentType = "anime" | "comic";

export type Variables = {
  requestId: string;
};

export type Bindings = {
  DB: D1Database;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};

export type AppContext = Context<AppEnv>;

export type Item = {
  id: string;
  title: string;
  type: ContentType;
  latestEpisodeOrChapter: string;
  cover: string;
  source: string;
  updatedAt: string;
  synopsis: string;
};

export type PluginSnapshot = {
  list: string;
  search: string;
  detailById: Record<string, string>;
  watchReadById: Record<string, string>;
};

export type PluginRow = {
  id: string;
  name: string;
  version: string;
  enabled: number;
  base_url: string;
  content_types: string;
  language: string;
  requests_per_minute: number;
  parser_rules: string;
};

export type PluginLoadResult = {
  data: PluginManifest[];
  source: "d1" | "mock";
  error?: string;
};

export type ApiResult = {
  ok: boolean;
  [key: string]: unknown;
};

export type CacheEntry = {
  expiresAt: number;
  status: number;
  payload: ApiResult;
};
