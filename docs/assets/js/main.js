/* Jai Bhattal — site behaviour (no libraries, no tracking) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Settings: change the WhatsApp number here (country code, no + or spaces)
     ------------------------------------------------------------------ */
  var WHATSAPP_NUMBER = "919034280004";

  document.documentElement.classList.add("js");

  function waLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  /* ---------- WhatsApp links ---------- */
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.setAttribute("href", waLink(el.getAttribute("data-wa")));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---------- Header: background on scroll + floating button ---------- */
  var header = document.querySelector(".site-header");
  var waFloat = document.querySelector(".wa-float");
  var contact = document.getElementById("contact");
  var contactVisible = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 12);
    if (waFloat) waFloat.classList.toggle("is-visible", y > 600 && !contactVisible);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window && contact && waFloat) {
    new IntersectionObserver(function (entries) {
      contactVisible = entries[0].isIntersecting;
      onScroll();
    }, { threshold: 0.15 }).observe(contact);
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) setMenu(false);
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Certificates: filter ---------- */
  var filters = document.querySelectorAll(".filter");
  var certs = Array.prototype.slice.call(document.querySelectorAll(".cert"));

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      certs.forEach(function (c) {
        c.hidden = !(cat === "all" || c.getAttribute("data-cat") === cat);
      });
    });
  });

  /* ---------- Certificates: lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector("figcaption");
  var current = 0;

  function visibleCerts() {
    return certs.filter(function (c) { return !c.hidden; });
  }

  function show(index) {
    var list = visibleCerts();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    var c = list[current];
    var img = c.querySelector("img");
    lbImg.src = c.getAttribute("data-src");
    lbImg.alt = img.alt;
    lbCap.innerHTML = "";
    var strong = document.createElement("strong");
    strong.textContent = c.querySelector(".cert-title").textContent;
    lbCap.appendChild(strong);
    lbCap.appendChild(document.createTextNode(" · " + c.querySelector(".cert-meta").textContent));
  }

  certs.forEach(function (c) {
    c.addEventListener("click", function () {
      show(visibleCerts().indexOf(c));
      if (typeof lb.showModal === "function") {
        lb.showModal();
      } else {
        window.open(c.getAttribute("data-src"), "_blank");
      }
    });
  });

  lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* ---------- Enquiry form → WhatsApp ---------- */
  var form = document.getElementById("enquiry-form");
  var nameInput = document.getElementById("f-name");
  var nameError = document.getElementById("f-name-error");

  function val(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el instanceof RadioNodeList) return el.value || "";
    return (el.value || "").trim();
  }

  nameInput.addEventListener("input", function () {
    if (nameInput.value.trim()) {
      nameInput.removeAttribute("aria-invalid");
      nameInput.removeAttribute("aria-describedby");
      nameError.textContent = "";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!val("name")) {
      nameInput.setAttribute("aria-invalid", "true");
      nameInput.setAttribute("aria-describedby", "f-name-error");
      nameError.textContent = "Please enter your name so Jai knows who's messaging.";
      nameInput.focus();
      return;
    }

    var lines = [
      "Hi Jai! I'd like to start my transformation.",
      "",
      "Name: " + val("name")
    ];
    var optional = [
      ["Age", val("age")],
      ["City", val("city")],
      ["Goal", val("goal")],
      ["Height", val("height")],
      ["Weight", val("weight")],
      ["Food", val("food")],
      ["Health / injuries", val("health")],
      ["Plan", val("plan")]
    ];
    optional.forEach(function (pair) {
      if (pair[1]) lines.push(pair[0] + ": " + pair[1]);
    });

    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  });

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
