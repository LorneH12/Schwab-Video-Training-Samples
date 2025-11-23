// Basic i18n loader and language switcher

const SVT_I18N = (function () {
  let messages = {};
  let currentLang = "en";

  async function loadLanguages() {
    try {
      const res = await fetch("data/languages.json");
      messages = await res.json();
    } catch (err) {
      console.error("Failed to load languages.json", err);
    }
  }

  function t(key) {
    const langPack = messages[currentLang] || messages.en || {};
    return langPack[key] || messages.en?.[key] || key;
  }

  function applyDir() {
    const html = document.documentElement;
    if (currentLang === "ar") {
      html.setAttribute("dir", "rtl");
    } else {
      html.setAttribute("dir", "ltr");
    }
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
  }

  async function init() {
    await loadLanguages();

    const select = document.getElementById("language-select");
    const storedLang = localStorage.getItem("svt-lang");
    currentLang = storedLang || "en";

    if (select) {
      select.value = currentLang;
      select.addEventListener("change", () => {
        currentLang = select.value;
        localStorage.setItem("svt-lang", currentLang);
        applyDir();
        applyTranslations();
      });
    }

    applyDir();
    applyTranslations();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    t: (key) => t(key),
    get lang() {
      return currentLang;
    },
  };
})();
