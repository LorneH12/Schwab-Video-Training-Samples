// Main app logic: load config + videos, render grid, wire modal player

document.addEventListener("DOMContentLoaded", async () => {
  const ctaStart = document.getElementById("cta-start");
  const gridEl = document.getElementById("video-grid");
  const noVideosEl = document.getElementById("no-videos-message");

  const modalEl = document.getElementById("video-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseTop = document.getElementById("modal-close");
  const modalCloseFooter = document.getElementById("modal-close-footer");
  const modalReplay = document.getElementById("modal-replay");
  const modalTitleEl = document.getElementById("modal-title");
  const modalDescEl = document.getElementById("modal-description");

  // 🔹 Force modal to start hidden
  if (modalEl) {
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
  }

  let settings = {};
  let videos = [];
  let currentVideo = null;

  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(path + " failed to load");
    return res.json();
  }

  async function loadData() {
    settings = await loadJSON("data/settings.json");
    const videoData = await loadJSON("data/videos.json");
    videos = videoData.videos || videoData || [];

    if (window.SVT_Analytics) {
      SVT_Analytics.init(settings);
    }
  }

  function buildVideoCard(video) {
    const card = document.createElement("article");
    card.className = "video-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${video.title} – open video player`);

    card.dataset.videoId = video.id;

    const thumbWrapper = document.createElement("div");
    thumbWrapper.className = "video-card__thumb-wrapper";

    const thumb = document.createElement("img");
    thumb.className = "video-card__thumb";
    thumb.src =
      video.thumbnail ||
      `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
    thumb.alt = video.title;
    thumbWrapper.appendChild(thumb);

    const pill = document.createElement("div");
    pill.className = "video-card__pill";
    const dot = document.createElement("span");
    dot.className = "video-card__pill-dot";
    const pillText = document.createElement("span");
    pillText.textContent = video.length || "Sample";
    pill.appendChild(dot);
    pill.appendChild(pillText);
    thumbWrapper.appendChild(pill);

    const body = document.createElement("div");
    body.className = "video-card__body";

    const titleEl = document.createElement("h3");
    titleEl.className = "video-card__title";
    titleEl.textContent = video.title;

    const meta = document.createElement("p");
    meta.className = "video-card__meta";
    meta.textContent = video.series || "Schwab Training";

    const desc = document.createElement("p");
    desc.className = "video-card__description";
    desc.textContent = video.description || "";

    body.appendChild(titleEl);
    body.appendChild(meta);
    body.appendChild(desc);

    card.appendChild(thumbWrapper);
    card.appendChild(body);

    function open() {
      openModal(video);
    }

    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    return card;
  }

  function renderGrid() {
    if (!gridEl) return;
    gridEl.innerHTML = "";

    if (!videos.length) {
      if (noVideosEl) noVideosEl.hidden = false;
      return;
    }
    if (noVideosEl) noVideosEl.hidden = true;

    videos.forEach((video) => {
      const card = buildVideoCard(video);
      gridEl.appendChild(card);
    });
  }

  function openModal(video) {
    currentVideo = video;

    if (modalTitleEl) modalTitleEl.textContent = video.title;
    if (modalDescEl) modalDescEl.textContent = video.description || "";

    if (modalEl) {
      modalEl.hidden = false;
      modalEl.setAttribute("aria-hidden", "false");
    }

    SVT_Player.playVideo(video.id);

    if (window.SVT_Analytics) {
      SVT_Analytics.sendEvent({
        videoId: video.id,
        videoTitle: video.title,
        eventType: "play",
      });
    }
  }

  function closeModal() {
    if (modalEl) {
      modalEl.hidden = true;
      modalEl.setAttribute("aria-hidden", "true");
    }
    SVT_Player.stop();
    currentVideo = null;
  }

  function replay() {
    if (!currentVideo) return;
    SVT_Player.playVideo(currentVideo.id);

    if (window.SVT_Analytics) {
      SVT_Analytics.sendEvent({
        videoId: currentVideo.id,
        videoTitle: currentVideo.title,
        eventType: "replay",
      });
    }
  }

  // Wire modal controls
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  if (modalCloseTop) modalCloseTop.addEventListener("click", closeModal);
  if (modalCloseFooter) modalCloseFooter.addEventListener("click", closeModal);
  if (modalReplay) modalReplay.addEventListener("click", replay);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl && !modalEl.hidden) {
      closeModal();
    }
  });

  // CTA scroll-to-grid
  if (ctaStart) {
    ctaStart.addEventListener("click", () => {
      const gridSection = document.querySelector(".grid-section");
      if (gridSection) {
        gridSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  try {
    await loadData();
    renderGrid();
  } catch (err) {
    console.error("Failed to init app:", err);
    if (noVideosEl) {
      noVideosEl.hidden = false;
      noVideosEl.textContent = "Unable to load videos at this time.";
    }
  }
});
