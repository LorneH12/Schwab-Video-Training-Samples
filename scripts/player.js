// YouTube IFrame API wrapper for the modal player

const SVT_Player = (function () {
  let apiReady = false;
  let player = null;
  let pendingVideoId = null;

  function loadAPI() {
    return new Promise((resolve) => {
      if (apiReady) return resolve();
      const existing = document.getElementById("youtube-iframe-api");
      if (existing) return resolve();

      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = function () {
        apiReady = true;
        resolve();
      };
      document.head.appendChild(tag);
    });
  }

  function createOrLoad(videoId, onStateChange) {
    pendingVideoId = videoId;

    loadAPI().then(() => {
      const container = document.getElementById("player-container");
      if (!container) return;

      if (!player) {
        player = new YT.Player("player-container", {
          videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
          },
          events: {
            onStateChange: (event) => {
              if (typeof onStateChange === "function") {
                onStateChange(event);
              }
            },
          },
        });
      } else {
        player.loadVideoById(videoId);
      }
    });
  }

  function stop() {
    if (player) {
      player.stopVideo();
    }
  }

  return {
    playVideo: createOrLoad,
    stop,
  };
})();
