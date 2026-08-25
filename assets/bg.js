(function () {
  var video = document.querySelector(".site-bg video");
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  function play() {
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  play();
  video.addEventListener("loadeddata", play);
  video.addEventListener("canplay", play);
  document.addEventListener("click", play, { once: true });
  document.addEventListener("touchstart", play, { once: true });
})();
