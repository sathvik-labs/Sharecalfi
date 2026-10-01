(function () {
  "use strict";

  // Mobile menu toggle
  var hamburger = document.getElementById("hamburger-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Live waybar-style clock
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tickClock() {
    var el = document.getElementById("ws-clock-time");
    if (!el) return;
    var d = new Date();
    el.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  tickClock();
  setInterval(tickClock, 1000);

  // Duplicate ticker content once so the CSS loop (-50%) is seamless
  var tickerInner = document.querySelector(".ticker-inner");
  if (tickerInner && !tickerInner.dataset.doubled) {
    tickerInner.innerHTML += tickerInner.innerHTML;
    tickerInner.dataset.doubled = "true";
  }

  // Highlight the current page in desktop + mobile nav based on path
  var path = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
  document.querySelectorAll(".desktop-nav a, .mobile-menu a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href) return;
    var normalized = href.replace(/\/$/, "") || "/";
    if (normalized === path || (normalized === "" && path === "/")) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });
})();
