// Theme toggle and persistence

(function () {
  const html = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("svt-theme", theme);
    if (toggle) {
      const isDark = theme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      const labelSpan = toggle.querySelector(".icon-button__label");
      const iconSpan = toggle.querySelector(".icon-button__icon");
      if (labelSpan) {
        labelSpan.textContent = isDark ? "Dark" : "Light";
      }
      if (iconSpan) {
        iconSpan.textContent = isDark ? "🌙" : "☀️";
      }
    }
  }

  const stored = localStorage.getItem("svt-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored || (prefersDark ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
