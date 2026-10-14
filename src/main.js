/* ── UlinKiwari Games — site behavior ─────────────────────────
   - Theme: light default, toggle persisted (ulinkiwari-theme)
   - Language: English default, switcher persisted (ulinkiwari-lang)
   - Mobile menu: Escape / aria-expanded / close-on-navigate
   - Scroll reveal (reduced-motion aware), footer year
---------------------------------------------------------------- */
(function () {
  "use strict";

  var root = document.documentElement;
  var I18N = window.ULIN_I18N || { en: {}, id: {} };

  function dictFor(lang) {
    return I18N[lang] || I18N.en;
  }
  function t(key, lang) {
    var d = dictFor(lang || currentLang());
    if (d[key] != null) return d[key];
    if (I18N.en[key] != null) return I18N.en[key];
    return null;
  }
  function currentLang() {
    return root.getAttribute("lang") === "id" ? "id" : "en";
  }

  /* ── i18n application ─────────────────────────────────────── */
  function applyLang(lang) {
    if (lang !== "id" && lang !== "en") lang = "en";
    root.setAttribute("lang", lang);

    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"), lang);
      if (v != null) el.textContent = v;
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-html"), lang);
      if (v != null) el.innerHTML = v;
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr")
        .split(";")
        .forEach(function (pair) {
          var parts = pair.split(":");
          var attr = (parts[0] || "").trim();
          var key = (parts[1] || "").trim();
          if (!attr || !key) return;
          var v = t(key, lang);
          if (v != null) el.setAttribute(attr, v);
        });
    });

    root.querySelectorAll("[data-lang]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.classList.toggle("lang-active", active);
    });

    try {
      localStorage.setItem("ulinkiwari-lang", lang);
    } catch (e) {}
    updateThemeLabel();
  }

  /* ── theme ────────────────────────────────────────────────── */
  function currentTheme() {
    return root.classList.contains("dark") ? "dark" : "light";
  }
  function updateThemeLabel() {
    var lang = currentLang();
    var label = currentTheme() === "dark" ? t("theme.light", lang) : t("theme.dark", lang);
    var aria = t("theme.toggle", lang);
    root.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      if (label) {
        var span = btn.querySelector("[data-theme-label]");
        if (span) span.textContent = label;
      }
      if (aria) btn.setAttribute("aria-label", aria);
      var sun = btn.querySelector("[data-icon-sun]");
      var moon = btn.querySelector("[data-icon-moon]");
      var isDark = currentTheme() === "dark";
      if (sun) sun.classList.toggle("hidden", !isDark);
      if (moon) moon.classList.toggle("hidden", isDark);
    });
  }
  function setTheme(next) {
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("ulinkiwari-theme", next);
    } catch (e) {}
    updateThemeLabel();
  }

  /* ── mobile menu ──────────────────────────────────────────── */
  var menuBtn = document.getElementById("menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  function setMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute(
      "aria-label",
      open ? t("nav.menu.close") : t("nav.menu.open")
    );
    mobileMenu.hidden = !open;
    if (open) {
      var first = mobileMenu.querySelector("a");
      if (first) first.focus();
    }
  }
  function isMenuOpen() {
    return !!mobileMenu && !mobileMenu.hidden;
  }

  /* ── wire up on DOM ready ─────────────────────────────────── */
  function init() {
    // Language: persisted choice wins, English default
    var savedLang = "en";
    try {
      var s = localStorage.getItem("ulinkiwari-lang");
      if (s === "id" || s === "en") savedLang = s;
    } catch (e) {}
    applyLang(savedLang);

    // Theme toggle(s)
    root.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    });
    updateThemeLabel();

    // Language switcher(s)
    root.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });

    // Mobile menu
    if (menuBtn && mobileMenu) {
      setMenu(false);
      menuBtn.addEventListener("click", function () {
        setMenu(!isMenuOpen());
      });
      mobileMenu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          setMenu(false);
        });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isMenuOpen()) {
          setMenu(false);
          menuBtn.focus();
        }
      });
    }

    // Footer year
    root.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    // Scroll reveal
    var revealEls = root.querySelectorAll(".reveal");
    if (
      "IntersectionObserver" in window &&
      revealEls.length &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add("is-visible");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
