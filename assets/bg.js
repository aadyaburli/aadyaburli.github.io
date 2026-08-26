(function () {
  var video = document.querySelector(".site-bg video");
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

  function play() {
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  play();
  video.addEventListener("loadedmetadata", play);
  video.addEventListener("loadeddata", play);
  video.addEventListener("canplay", play);
  video.addEventListener("canplaythrough", play);

  var tries = 0;
  var timer = setInterval(function () {
    if (!video.paused || tries++ > 24) {
      clearInterval(timer);
      return;
    }
    play();
  }, 250);

  document.addEventListener("click", play, { once: true });
  document.addEventListener("touchstart", play, { once: true });
  document.addEventListener("keydown", play, { once: true });
})();
