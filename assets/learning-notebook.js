(function () {
  var root = document.querySelector("[data-notebook]");
  if (!root) return;

  var cover = root.querySelector("[data-notebook-open]");
  var inside = document.getElementById("learning-entries");
  var closeBtn = root.querySelector("[data-notebook-close]");
  if (!cover || !inside) return;

  function openNotebook(pushHash) {
    root.classList.add("is-open");
    cover.setAttribute("aria-expanded", "true");
    inside.hidden = false;
    if (pushHash && location.hash !== "#open") {
      history.pushState({ notebook: "open" }, "", "#open");
    }
  }

  function closeNotebook(pushHash) {
    root.classList.remove("is-open");
    cover.setAttribute("aria-expanded", "false");
    inside.hidden = true;
    if (pushHash && location.hash === "#open") {
      history.pushState({ notebook: "closed" }, "", location.pathname + location.search);
    }
  }

  function syncFromHash() {
    if (location.hash === "#open") openNotebook(false);
    else closeNotebook(false);
  }

  cover.addEventListener("click", function () {
    openNotebook(true);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closeNotebook(true);
    });
  }

  window.addEventListener("popstate", syncFromHash);
  syncFromHash();
})();
