import type { PluginSnapshot } from "./types";

const mockSnapshots: Record<string, PluginSnapshot> = {
  "animehub-alpha": {
    list: `
      <section class="updates">
        <article class="card"><a href="/anime/solo-leveling"><h3 class="title">Solo Leveling</h3><img src="https://img.example/solo.jpg"/><span class="episode">Episode 9</span></a></article>
        <article class="card"><a href="/anime/sakamoto-days"><h3 class="title">Sakamoto Days</h3><img src="https://img.example/sakamoto.jpg"/><span class="episode">Episode 7</span></a></article>
      </section>
    `,
    search: `
      <section class="search-result">
        <article class="card"><a href="/anime/solo-leveling"><h3 class="title">Solo Leveling</h3><img src="https://img.example/solo.jpg"/><span class="episode">Episode 9</span></a></article>
        <article class="card"><a href="/anime/kaiju-no-8"><h3 class="title">Kaiju No. 8</h3><img src="https://img.example/kaiju.jpg"/><span class="episode">Episode 6</span></a></article>
      </section>
    `,
    detailById: {
      "animehub-alpha-solo-leveling": `
        <article class="detail">
          <h1 class="title">Solo Leveling</h1>
          <p class="summary">After near death, Jin-Woo becomes a player.</p>
          <img src="https://img.example/solo.jpg"/>
          <p class="genres">Action, Fantasy</p>
          <p class="status">Ongoing</p>
          <div class="episode-list">
            <div class="episode-item"><a href="/watch/solo-leveling-ep-9"><span class="episode-title">Episode 9</span></a></div>
            <div class="episode-item"><a href="/watch/solo-leveling-ep-8"><span class="episode-title">Episode 8</span></a></div>
          </div>
        </article>
      `,
    },
    watchReadById: {
      "animehub-alpha-solo-leveling": `
        <section class="watch-list">
          <div class="watch-item"><a href="https://stream.example/solo-9"><span class="watch-label">Server 1</span></a></div>
          <div class="watch-item"><a href="https://stream2.example/solo-9"><span class="watch-label">Server 2</span></a></div>
        </section>
      `,
    },
  },
  "comicnest-beta": {
    list: `
      <section class="latest-list">
        <article class="entry"><a href="/comic/omniscient-reader"><h3 class="entry-title">Omniscient Reader</h3><img src="https://img.example/orv.jpg"/><span class="chapter-latest">Chapter 247</span></a></article>
        <article class="entry"><a href="/comic/dandadan"><h3 class="entry-title">Dandadan</h3><img src="https://img.example/dandadan.jpg"/><span class="chapter-latest">Chapter 188</span></a></article>
      </section>
    `,
    search: `
      <section class="result-wrap">
        <article class="result-item"><a href="/comic/omniscient-reader"><h3 class="result-title">Omniscient Reader</h3><img src="https://img.example/orv.jpg"/><span class="chapter">Chapter 247</span></a></article>
        <article class="result-item"><a href="/comic/sakamoto-days"><h3 class="result-title">Sakamoto Days</h3><img src="https://img.example/sakamoto.jpg"/><span class="chapter">Chapter 205</span></a></article>
      </section>
    `,
    detailById: {
      "comicnest-beta-omniscient-reader": `
        <article class="detail">
          <h1 class="manga-title">Omniscient Reader</h1>
          <p class="description">A reader enters the world he used to read.</p>
          <img src="https://img.example/orv.jpg"/>
          <p class="genre-list">Action, Drama</p>
          <p class="manga-status">Ongoing</p>
          <div class="chapter-list">
            <div class="chapter-item"><a href="/read/orv-247"><span class="chapter-name">Chapter 247</span></a></div>
            <div class="chapter-item"><a href="/read/orv-246"><span class="chapter-name">Chapter 246</span></a></div>
          </div>
        </article>
      `,
    },
    watchReadById: {
      "comicnest-beta-omniscient-reader": `
        <section class="chapter-read-list">
          <div class="chapter-read-item"><a href="https://reader.example/orv-247"><span class="chapter-read-label">Read Chapter</span></a></div>
          <div class="chapter-read-item"><a href="https://mirror.example/orv-247"><span class="chapter-read-label">Mirror</span></a></div>
        </section>
      `,
    },
  },
};

export function getSnapshot(pluginId: string): PluginSnapshot | null {
  return mockSnapshots[pluginId] ?? null;
}
