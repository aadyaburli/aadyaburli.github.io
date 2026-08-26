(function () {
  var api = window.AadyaWallpaper;
  if (!api) return;

  var buttons = document.querySelectorAll("[data-wallpaper]");
  var label = document.querySelector("[data-wallpaper-name]");

  function names(id) {
    return {
      sparkle: "sparkle",
      still: "still",
      dusk: "dusk",
      mist: "mist",
      paper: "paper",
      glass: "tinted glass"
    }[id] || id;
  }

  function sync() {
    var id = api.current();
    if (label) label.textContent = names(id);
    buttons.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-wallpaper") === id);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      api.apply(btn.getAttribute("data-wallpaper"));
      sync();
    });
  });

  var shuffle = document.querySelector("[data-wallpaper-shuffle]");
  if (shuffle) {
    shuffle.addEventListener("click", function () {
      var ids = api.ids;
      var next = ids[Math.floor(Math.random() * ids.length)];
      if (ids.length > 1) {
        while (next === api.current()) {
          next = ids[Math.floor(Math.random() * ids.length)];
        }
      }
      api.apply(next);
      sync();
    });
  }

  sync();
})();
