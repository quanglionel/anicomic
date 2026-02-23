import ThemeToggle from "./theme-toggle";
import LiveDashboard from "./live-dashboard";

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
            <strong>Pipeline health: connected</strong>
            <span>Step 8: Frontend connected to Worker API</span>
          </div>
        </div>
      </section>

      <LiveDashboard />

      <footer className="footer-note">
        <p>Step 8 complete scope: web connected with Worker API end-to-end.</p>
      </footer>
    </main>
  );
}
