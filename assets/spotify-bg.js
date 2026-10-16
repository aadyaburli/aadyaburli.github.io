(function () {
  var TRACK_URI = "spotify:track:1NG8X5dUOwVTuMbgZyEl3A"; // La Petite Fille De La Mer — Vangelis
  var PREF_KEY = "aadya-spotify-sound";

  var controller = null;
  var ready = false;
  var playing = false;
  var wantPlay = false;
  var button = null;

  function preferOn() {
    try {
      return localStorage.getItem(PREF_KEY) === "on";
    } catch (err) {
      return false;
    }
  }

  function setPrefer(on) {
    try {
      localStorage.setItem(PREF_KEY, on ? "on" : "off");
    } catch (err) {}
  }

  function setUi(on) {
    if (!button) return;
    button.classList.toggle("is-on", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
    button.setAttribute(
      "aria-label",
      on
        ? "Sound on — pause La Petite Fille de la Mer"
        : "Sound off — play La Petite Fille de la Mer"
    );
    button.title = on ? "sound on" : "sound off";
  }

  function play() {
    wantPlay = true;
    setPrefer(true);
    setUi(true);
    if (ready && controller) {
      try {
        controller.play();
        playing = true;
      } catch (err) {}
    }
  }

  function pause() {
    wantPlay = false;
    setPrefer(false);
    setUi(false);
    playing = false;
    if (ready && controller) {
      try {
        controller.pause();
      } catch (err) {}
    }
  }

  function toggle() {
    if (playing || (wantPlay && ready)) pause();
    else play();
  }

  function ensureDom() {
    if (document.getElementById("spotify-sound-toggle")) return;

    button = document.createElement("button");
    button.type = "button";
    button.id = "spotify-sound-toggle";
    button.className = "spotify-sound-toggle";
    button.innerHTML =
      '<svg class="spotify-sound-icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>' +
      "</svg>" +
      '<span class="spotify-sound-slash" aria-hidden="true"></span>';
    button.addEventListener("click", toggle);
    document.body.appendChild(button);
    setUi(false);

    var host = document.createElement("div");
    host.id = "spotify-embed-host";
    host.className = "spotify-embed-host";
    host.setAttribute("aria-hidden", "true");
    var mount = document.createElement("div");
    mount.id = "spotify-embed";
    host.appendChild(mount);
    document.body.appendChild(host);
  }

  function loadApi() {
    if (document.querySelector('script[data-spotify-iframe-api]')) return;
    var s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1";
    s.async = true;
    s.setAttribute("data-spotify-iframe-api", "1");
    document.head.appendChild(s);
  }

  function onReady(IFrameAPI) {
    var element = document.getElementById("spotify-embed");
    if (!element) return;
    IFrameAPI.createController(
      element,
      { uri: TRACK_URI, width: 300, height: 80 },
      function (EmbedController) {
        controller = EmbedController;
        EmbedController.addListener("ready", function () {
          ready = true;
          if (wantPlay) {
            try {
              EmbedController.play();
              playing = true;
              setUi(true);
            } catch (err) {}
          }
        });
        EmbedController.addListener("playback_update", function (e) {
          if (!e || !e.data) return;
          playing = !e.data.isPaused;
          setUi(playing);
          // soft loop: restart near the end
          if (
            !e.data.isPaused &&
            e.data.duration > 0 &&
            e.data.position >= e.data.duration - 800
          ) {
            try {
              EmbedController.seek(0);
              EmbedController.play();
            } catch (err) {}
          }
        });
      }
    );
  }

  ensureDom();
  loadApi();

  var prev = window.onSpotifyIframeApiReady;
  window.onSpotifyIframeApiReady = function (IFrameAPI) {
    if (typeof prev === "function") prev(IFrameAPI);
    onReady(IFrameAPI);
  };

  // Remember preference visually; browsers still require a click to start audio.
  if (preferOn()) {
    button.classList.add("is-wants-sound");
    button.title = "sound off — click to play";
  }
})();
