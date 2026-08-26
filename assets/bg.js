(function () {
  var KEY = "aadya-wallpaper";
  var DEFAULT_ID = "sparkle";
  var video = document.querySelector(".site-bg video");

  function currentId() {
    return localStorage.getItem(KEY) || DEFAULT_ID;
  }

  function playVideo() {
    if (!video) return;
    video.controls = false;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.disablePictureInPicture = true;
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.removeAttribute("controls");
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  function apply(id) {
    if (!id) id = DEFAULT_ID;
    document.body.setAttribute("data-wallpaper", id);
    localStorage.setItem(KEY, id);
    if (!video) return;
    if (id === "still") {
      video.pause();
    } else {
      playVideo();
    }
  }

  apply(currentId());

  if (video) {
    video.addEventListener("loadedmetadata", playVideo);
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);
    video.addEventListener("canplaythrough", playVideo);
    var tries = 0;
    var timer = setInterval(function () {
      if (document.body.getAttribute("data-wallpaper") === "still" || !video.paused || tries++ > 24) {
        clearInterval(timer);
        return;
      }
      playVideo();
    }, 250);
    document.addEventListener("click", playVideo, { once: true });
    document.addEventListener("touchstart", playVideo, { once: true });
    document.addEventListener("keydown", playVideo, { once: true });
  }

  window.AadyaWallpaper = {
    apply: apply,
    current: currentId,
    ids: ["sparkle", "still", "dusk", "mist", "paper", "glass"]
  };
})();
