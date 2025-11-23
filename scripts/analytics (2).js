// Send lightweight analytics events to Google Apps Script backend

const SVT_Analytics = (function () {
  let settings = null;
  let sessionId = null;

  function init(config) {
    settings = config;
    sessionId = localStorage.getItem("svt-session-id");
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).slice(2);
      localStorage.setItem("svt-session-id", sessionId);
    }
  }

  async function sendEvent(event) {
    if (!settings || !settings.eventsEndpoint) return;

    const payload = {
      sessionId,
      language: SVT_I18N.lang,
      theme: document.documentElement.getAttribute("data-theme"),
      ...event,
    };

    try {
      await fetch(settings.eventsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Analytics send failed", err);
    }
  }

  return {
    init,
    sendEvent,
  };
})();
