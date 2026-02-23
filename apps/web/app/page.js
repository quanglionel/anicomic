import ThemeToggle from "./theme-toggle";

const highlights = [
  { label: "Plugin-ready", value: "Manifest + parser rules" },
  { label: "Runtime", value: "Cloudflare Pages + Worker" },
  { label: "Phase", value: "Step 2 - Frontend shell" },
  { label: "Theme", value: "Mac dinh + Dem sau (Nord)" },
];

const cards = [
  {
    title: "Anime feed",
    description: "Slot nay se noi API /list o buoc parser engine.",
    tag: "list",
  },
  {
    title: "Comic tracking",
    description: "Slot nay se noi API /detail va lich su doc cua user.",
    tag: "detail",
  },
  {
    title: "Source registry",
    description: "Slot nay se hien plugin kha dung sau khi co registry.",
    tag: "plugin",
  },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="badge">AniComic</p>
          <h1>CPC Monitor</h1>
          <p className="brand-note">Anime + Comic monitor hub</p>
        </div>
        <div className="topbar-actions">
          <nav className="main-nav" aria-label="Primary navigation">
            <a href="#overview">Tong quan</a>
            <a href="#sources">Nguon</a>
            <a href="#updates">Cap nhat</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <section className="hero-panel" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">Frontend shell</p>
          <h2>Khung giao dien san sang cho API va plugin pipeline.</h2>
          <p>
            Buoc 2 tap trung vao responsive UI co nhan dien ro rang, co vung hien
            thi du lieu va co hook de noi API o cac buoc tiep theo.
          </p>
          <div className="hero-actions">
            <a href="#updates">Xem khu vuc feed</a>
            <a href="#sources">Xem source panel</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="pulse pulse-a" />
          <div className="pulse pulse-b" />
          <div className="monitor-card">
            <p>Live preview</p>
            <strong>Pipeline health: ready</strong>
            <span>Next target: Worker API scaffold</span>
          </div>
        </div>
      </section>

      <section className="highlight-grid" aria-label="Project highlights">
        {highlights.map((item) => (
          <article key={item.label} className="highlight-card">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <aside className="source-panel" id="sources">
          <p className="eyebrow">Data sources</p>
          <h3>Nguon du lieu (mock)</h3>
          <article>
            <strong>AnimeHub Alpha</strong>
            <p>Pending validator + parser mapping.</p>
          </article>
          <article>
            <strong>ComicNest Beta</strong>
            <p>Pending parser rules + quality score.</p>
          </article>
          <article>
            <strong>ReaderMirror</strong>
            <p>Pending allowlist va chinh sach rate-limit.</p>
          </article>
        </aside>

        <div className="cards-panel" id="updates">
          {cards.map((card) => (
            <article key={card.title} className="content-card">
              <p className="tag">{card.tag}</p>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer-note">
        <p>Step 2 complete: UI shell + responsive layout + theme system.</p>
      </footer>
    </main>
  );
}
