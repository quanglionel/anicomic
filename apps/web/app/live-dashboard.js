"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_API_BASE = "http://localhost:8788";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || DEFAULT_API_BASE;

function HighlightGrid({ status, plugins }) {
  const endpointCount = Object.keys(status?.endpoints ?? {}).length;
  const phase = status?.phase ?? "unavailable";

  const rows = [
    { label: "API Base", value: API_BASE },
    { label: "Phase", value: phase },
    { label: "Plugins", value: String(plugins.length) },
    { label: "Endpoints", value: String(endpointCount) },
  ];

  return (
    <section className="highlight-grid" aria-label="Project highlights">
      {rows.map((row) => (
        <article key={row.label} className="highlight-card">
          <p>{row.label}</p>
          <strong>{row.value}</strong>
        </article>
      ))}
    </section>
  );
}

function SourcePanel({ plugins, pluginSource }) {
  return (
    <aside className="source-panel" id="sources">
      <p className="eyebrow">Data sources</p>
      <h3>Plugin registry ({pluginSource})</h3>
      {plugins.length === 0 ? (
        <article>
          <strong>No plugin</strong>
          <p>Worker khong tra ve plugin nao.</p>
        </article>
      ) : (
        plugins.map((plugin) => (
          <article key={plugin.id}>
            <strong>{plugin.name}</strong>
            <p>
              {plugin.id} | {plugin.contentTypes.join(", ")} | rpm{" "}
              {plugin.rateLimit.requestsPerMinute}
            </p>
          </article>
        ))
      )}
    </aside>
  );
}

function FeedPanel({ listItems, parserItems }) {
  return (
    <div className="cards-panel" id="updates">
      <article className="content-card">
        <p className="tag">list</p>
        <h3>API /list</h3>
        {listItems.length === 0 ? (
          <p>Khong co du lieu tu /api/v1/list.</p>
        ) : (
          <ul className="item-list">
            {listItems.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span>
                  {item.type} | {item.latestEpisodeOrChapter}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="content-card">
        <p className="tag">parser</p>
        <h3>API /parser/list</h3>
        {parserItems.length === 0 ? (
          <p>Khong co du lieu parser.</p>
        ) : (
          <ul className="item-list">
            {parserItems.map((item, index) => (
              <li key={`${item.url}-${index}`}>
                <strong>{item.title}</strong>
                <span>{item.latest || "n/a"}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}

export default function LiveDashboard() {
  const [status, setStatus] = useState(null);
  const [plugins, setPlugins] = useState([]);
  const [pluginSource, setPluginSource] = useState("unknown");
  const [listItems, setListItems] = useState([]);
  const [parserItems, setParserItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const [statusRes, pluginRes, listRes, parserRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/status`),
          fetch(`${API_BASE}/api/v1/plugins`),
          fetch(`${API_BASE}/api/v1/list?page=1&limit=6`),
          fetch(`${API_BASE}/api/v1/parser/list?pluginId=animehub-alpha`),
        ]);

        if (!statusRes.ok || !pluginRes.ok || !listRes.ok || !parserRes.ok) {
          throw new Error("Worker API response is not ok");
        }

        const [statusJson, pluginJson, listJson, parserJson] = await Promise.all([
          statusRes.json(),
          pluginRes.json(),
          listRes.json(),
          parserRes.json(),
        ]);

        if (cancelled) {
          return;
        }

        setStatus(statusJson);
        setPlugins(pluginJson.data ?? []);
        setPluginSource(pluginJson.source ?? "unknown");
        setListItems(listJson.data ?? []);
        setParserItems(parserJson.data ?? []);
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Cannot connect Worker API",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const statusLabel = useMemo(() => {
    if (loading) return "loading";
    if (error) return "offline";
    return "online";
  }, [loading, error]);

  return (
    <>
      <div className={`connection-state ${statusLabel}`}>
        <span className="dot" />
        <p>
          Worker API: <strong>{statusLabel}</strong>
          {error ? ` | ${error}` : ""}
        </p>
      </div>

      <HighlightGrid status={status} plugins={plugins} />

      <section className="content-grid">
        <SourcePanel plugins={plugins} pluginSource={pluginSource} />
        <FeedPanel listItems={listItems} parserItems={parserItems} />
      </section>
    </>
  );
}
