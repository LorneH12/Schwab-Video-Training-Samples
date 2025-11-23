// Theme toggle: light <-> dark with localStorage persistence

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("theme-toggle-btn");
  if (!btn) return;

  const THEME_KEY = "svt-theme";

  function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-theme", isDark);
    btn.textContent = isDark ? "Dark" : "Light";

    // Optional: aria for accessibility
    btn.setAttribute("aria-pressed", String(isDark));

    localStorage.setItem(THEME_KEY, theme);
  }

  // Initial theme
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") {
    applyTheme(stored);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  // Toggle on click
  btn.addEventListener("click", () => {
    const isCurrentlyDark = document.body.classList.contains("dark-theme");
    applyTheme(isCurrentlyDark ? "light" : "dark");
  });
});
