import { validatePluginManifest, type PluginManifest } from "@cpc/shared/plugin";
import { mockPluginManifests } from "./mock-data";
import type { PluginLoadResult, PluginRow } from "./types";

function mapPluginRow(row: PluginRow): PluginManifest | null {
  try {
    const candidate = {
      id: row.id,
      name: row.name,
      version: row.version,
      enabled: row.enabled === 1,
      baseUrl: row.base_url,
      contentTypes: JSON.parse(row.content_types),
      language: row.language,
      rateLimit: {
        requestsPerMinute: row.requests_per_minute,
      },
      parserRules: JSON.parse(row.parser_rules),
    };
    const parsed = validatePluginManifest(candidate);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function listPluginManifests(db: D1Database): Promise<PluginLoadResult> {
  try {
    const result = await db
      .prepare(
        `SELECT id, name, version, enabled, base_url, content_types, language, requests_per_minute, parser_rules
         FROM plugins
         ORDER BY id ASC`,
      )
      .all<PluginRow>();
    const rows = (result.results ?? []) as PluginRow[];
    const parsed = rows
      .map(mapPluginRow)
      .filter((item): item is PluginManifest => item !== null);

    if (parsed.length > 0) {
      return { data: parsed, source: "d1" };
    }

    return {
      data: mockPluginManifests,
      source: "mock",
      error: "No valid plugin rows found in D1. Falling back to mock data.",
    };
  } catch (error) {
    return {
      data: mockPluginManifests,
      source: "mock",
      error: `D1 query failed: ${error instanceof Error ? error.message : "unknown error"}`,
    };
  }
}

export async function getPluginManifest(
  db: D1Database,
  pluginId: string | undefined,
): Promise<PluginManifest | null> {
  if (!pluginId) {
    return null;
  }
  const loaded = await listPluginManifests(db);
  return loaded.data.find((plugin) => plugin.id === pluginId) ?? null;
}
