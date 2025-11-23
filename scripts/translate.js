// Language toggle using data/languages.json

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("language-select");
  if (!select) return;

  const LANG_KEY = "svt-language";
  let translations = null;

  async function loadTranslations() {
    const res = await fetch("data/languages.json");
    if (!res.ok) throw new Error("Failed to load languages.json");
    translations = await res.json();
  }

  function applyLanguage(lang) {
    if (!translations || !translations[lang]) return;
    const t = translations[lang];

    const headerTitle = document.querySelector(".header__title");
    const heroTitle = document.querySelector(".hero__title");
    const heroSubtitle = document.querySelector(".hero__subtitle");
    const ctaExplore = document.getElementById("cta-start");
    const sectionTitle = document.querySelector(".section-title");
    const noVideos = document.getElementById("no-videos-message");

    if (headerTitle) headerTitle.textContent = t.headerTitle;
    if (heroTitle) heroTitle.textContent = t.heroTitle;
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
    if (ctaExplore) ctaExplore.textContent = t.ctaExplore;
    if (sectionTitle) sectionTitle.textContent = t.sectionTrainingTitle;
    if (noVideos) noVideos.textContent = t.noVideos;

    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
  }

  try {
    await loadTranslations();

    const stored = localStorage.getItem(LANG_KEY);
    const initial = stored && translations[stored] ? stored : "en";
    select.value = initial;
    applyLanguage(initial);

    select.addEventListener("change", () => {
      const lang = select.value;
      if (!translations[lang]) return;
      applyLanguage(lang);
    });
  } catch (err) {
    console.error("Language init failed:", err);
  }
});
