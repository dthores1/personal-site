(function () {
  var article = document.querySelector(".ux-article");
  if (!article) {
    return;
  }

  var figures = article.querySelectorAll("figure img");
  if (!figures.length) {
    return;
  }

  var previousActive = null;
  var onKeyDownBound = null;

  var root = document.createElement("div");
  root.className = "ux-post-lightbox";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Enlarged image");
  root.setAttribute("aria-hidden", "true");
  root.tabIndex = -1;

  var enlarged = document.createElement("img");
  enlarged.className = "ux-post-lightbox__img";
  enlarged.alt = "";
  root.appendChild(enlarged);

  function close() {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (onKeyDownBound) {
      document.removeEventListener("keydown", onKeyDownBound);
      onKeyDownBound = null;
    }
    if (previousActive && typeof previousActive.focus === "function") {
      previousActive.focus();
    }
    previousActive = null;
  }

  function openFromThumb(thumb) {
    previousActive = document.activeElement;
    enlarged.src = thumb.currentSrc || thumb.src;
    enlarged.alt = thumb.alt || "";
    document.body.style.overflow = "hidden";
    root.setAttribute("aria-hidden", "false");
    if (!root.parentNode) {
      document.body.appendChild(root);
    }
    requestAnimationFrame(function () {
      root.classList.add("is-open");
      root.focus();
    });
    onKeyDownBound = function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKeyDownBound);
  }

  root.addEventListener("click", function () {
    close();
  });

  figures.forEach(function (img) {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    if (!img.getAttribute("aria-label")) {
      img.setAttribute("aria-label", "View larger image");
    }
    img.addEventListener("click", function (e) {
      e.preventDefault();
      openFromThumb(img);
    });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFromThumb(img);
      }
    });
  });
})();
