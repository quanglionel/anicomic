-- Initial schema for Step 7 (D1 integration)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS plugins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  base_url TEXT NOT NULL,
  content_types TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'vi',
  requests_per_minute INTEGER NOT NULL DEFAULT 60,
  parser_rules TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  plugin_id TEXT NOT NULL,
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  latest TEXT,
  cover_url TEXT,
  detail_url TEXT,
  synopsis TEXT,
  source_updated_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS parser_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plugin_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  target_id TEXT,
  status TEXT NOT NULL,
  duration_ms INTEGER,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_content_items_plugin_id
  ON content_items(plugin_id);

CREATE INDEX IF NOT EXISTS idx_content_items_plugin_external
  ON content_items(plugin_id, external_id);

CREATE INDEX IF NOT EXISTS idx_parser_runs_plugin_id_created
  ON parser_runs(plugin_id, created_at DESC);

INSERT OR IGNORE INTO plugins (
  id,
  name,
  version,
  enabled,
  base_url,
  content_types,
  language,
  requests_per_minute,
  parser_rules
) VALUES (
  'animehub-alpha',
  'AnimeHub Alpha',
  '1.0.0',
  1,
  'https://animehub.example',
  '["anime"]',
  'vi',
  60,
  '{"list":{"container":".updates","item":".card","title":".title","url":"a@href","cover":"img@src","latest":".episode"},"detail":{"title":".title","synopsis":".summary","cover":"img@src","genres":".genres","status":".status","chapterContainer":".episode-list","chapterItem":".episode-item","chapterTitle":".episode-title","chapterUrl":"a@href"},"search":{"endpoint":"/search","method":"GET","queryParam":"q","selectors":{"container":".search-result","item":".card","title":".title","url":"a@href","cover":"img@src","latest":".episode"}},"watchRead":{"container":".watch-list","item":".watch-item","label":".watch-label","url":"a@href"}}'
);

INSERT OR IGNORE INTO plugins (
  id,
  name,
  version,
  enabled,
  base_url,
  content_types,
  language,
  requests_per_minute,
  parser_rules
) VALUES (
  'comicnest-beta',
  'ComicNest Beta',
  '1.0.0',
  1,
  'https://comicnest.example',
  '["comic"]',
  'vi',
  45,
  '{"list":{"container":".latest-list","item":".entry","title":".entry-title","url":"a@href","cover":"img@src","latest":".chapter-latest"},"detail":{"title":".manga-title","synopsis":".description","cover":"img@src","genres":".genre-list","status":".manga-status","chapterContainer":".chapter-list","chapterItem":".chapter-item","chapterTitle":".chapter-name","chapterUrl":"a@href"},"search":{"endpoint":"/tim-kiem","method":"GET","queryParam":"keyword","selectors":{"container":".result-wrap","item":".result-item","title":".result-title","url":"a@href","cover":"img@src","latest":".chapter"}},"watchRead":{"container":".chapter-read-list","item":".chapter-read-item","label":".chapter-read-label","url":"a@href"}}'
);
