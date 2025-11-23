// Simple YouTube iframe embed without the YouTube IFrame API.

const SVT_Player = (function () {
  function playVideo(videoId) {
    const container = document.getElementById("player-container");
    if (!container || !videoId) return;

    const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

    container.innerHTML = `
      <iframe
        src="${src}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        style="width:100%;height:100%;display:block;"
      ></iframe>
    `;
  }

  function stop() {
    const container = document.getElementById("player-container");
    if (!container) return;
    // Remove the iframe to stop playback
    container.innerHTML = "";
  }

  return {
    playVideo,
    stop,
  };
})();
