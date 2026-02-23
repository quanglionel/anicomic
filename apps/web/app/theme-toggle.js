"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "anicomic-theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function normalizeTheme(theme) {
  if (theme === "deep-midnight" || theme === "oled") {
    return "deep-midnight";
  }
  return "default";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const nextTheme = normalizeTheme(saved);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  function selectTheme(nextTheme) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  return (
    <div className="theme-switcher" role="group" aria-label="Theme mode">
      <button
        type="button"
        className={theme === "default" ? "active" : ""}
        onClick={() => selectTheme("default")}
      >
        Mac dinh
      </button>
      <button
        type="button"
        className={theme === "deep-midnight" ? "active" : ""}
        onClick={() => selectTheme("deep-midnight")}
      >
        Đêm sâu
      </button>
    </div>
  );
}
