(function () {
  var KEY = "aadya-wallpaper";
  var DEFAULT = "sparkle";
  var IDS = ["sparkle", "still", "dusk", "mist", "paper", "glass"];

  function apply(id) {
    if (IDS.indexOf(id) === -1) id = DEFAULT;
    document.body.setAttribute("data-wallpaper", id);
    try {
      localStorage.setItem(KEY, id);
    } catch (err) {}
    return id;
  }

  function current() {
    try {
      return localStorage.getItem(KEY) || DEFAULT;
    } catch (err) {
      return DEFAULT;
    }
  }

  apply(current());
  window.AadyaWallpaper = { apply: apply, current: current, ids: IDS };
})();
