// ==========================================================
// SVT_Player.js - Handles opening, closing, and embedding videos
// ==========================================================

const SVT_Player = (function () {
  let modalEl = null;
  let containerEl = null;
  let closeBtn = null;

  // ----------------------------------------------------------
  // Initialize the modal player
  // ----------------------------------------------------------
  function init() {
    modalEl = document.getElementById("video-modal");
    containerEl = document.getElementById("player-container");
    closeBtn = document.getElementById("modal-close");

    if (!modalEl || !containerEl || !closeBtn) {
      console.error("SVT_Player: Missing modal elements.");
      return;
    }

    closeBtn.addEventListener("click", close);
  }

  // ----------------------------------------------------------
  // Play YouTube video
  // ----------------------------------------------------------
  function playVideo(videoId) {
    if (!modalEl || !containerEl) return;

    if (!videoId) {
      console.error("SVT_Player: No videoId provided.");
      return;
    }

    // Clean YouTube embed (limited recommendations)
    const src =
      `https://www.youtube.com/embed/${videoId}` +
      `?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`;

    containerEl.innerHTML = `
      <iframe
        src="${src}"
        title="Training Video Player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        style="width: 100%; height: 100%; display: block;"
      ></iframe>
    `;

    // Show modal
    modalEl.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  // ----------------------------------------------------------
  // Close modal and stop video
  // ----------------------------------------------------------
  function close() {
    if (!modalEl || !containerEl) return;

    modalEl.classList.remove("open");
    document.body.classList.remove("no-scroll");

    // Remove iframe to stop audio
    containerEl.innerHTML = "";
  }

  // Public API
  return {
    init,
    playVideo,
    close
  };
})();

// ----------------------------------------------------------
// Auto-init on DOM ready
// ----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  try {
    SVT_Player.init();
  } catch (err) {
    console.error("SVT_Player init error:", err);
  }
});
