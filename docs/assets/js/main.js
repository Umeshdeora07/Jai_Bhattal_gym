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
  var nav = document.getElementById("mobile-nav");

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
    if (window.innerWidth > 1140) setMenu(false);
  });

  /* ---------- Highlight the current section in the menu ---------- */
  var navLinks = document.querySelectorAll(".site-header .nav a[href^='#']");
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      navLinks.forEach(function (a) {
        a.classList.toggle("is-current", !!visible[a.getAttribute("href").slice(1)]);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

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

  /* ---------- Calorie, protein & BMI calculator ----------
     Calories: Mifflin-St Jeor equation x activity factor.
     BMI categories: Indian consensus cut-offs (Misra et al., 2009).
     Protein: International Society of Sports Nutrition, 1.4-2.0 g/kg/day. */
  var calcForm = document.getElementById("calc-form");
  if (calcForm) {
    var calcBox = document.querySelector(".calc-result");
    var calcEmpty = calcBox.querySelector(".calc-empty");
    var calcOut = calcBox.querySelector(".calc-out");
    var calcMessage = document.getElementById("calc-message");
    var calcWa = document.getElementById("calc-wa");
    var defaultMessage = calcMessage.textContent;

    var GOALS = {
      lose: { text: "lose fat", label: "Lose fat", factor: 0.8, protein: [1.6, 2.0] },
      maintain: { text: "maintain", label: "Maintain", factor: 1.0, protein: [1.4, 1.8] },
      gain: { text: "build muscle", label: "Build muscle", factor: 1.1, protein: [1.6, 2.0] }
    };
    var ACTIVITY = {
      "1.2": "Mostly sitting", "1.375": "Lightly active", "1.55": "Moderately active",
      "1.725": "Very active", "1.9": "Extra active"
    };
    // Approximate protein per common serving (Indian food composition tables / USDA).
    var FOODS = {
      veg: [["Paneer, 100 g", 18], ["Soya chunks, 30 g dry", 15], ["Besan chilla (40 g besan)", 9],
            ["Milk, 1 glass (250 ml)", 8], ["Dal, 1 katori cooked", 7], ["Dahi, 1 bowl (200 g)", 6],
            ["Roasted chana, 30 g", 6], ["Peanuts, 30 g", 7]],
      egg: [["Eggs, 2 whole", 12], ["Paneer, 100 g", 18], ["Soya chunks, 30 g dry", 15],
            ["Milk, 1 glass (250 ml)", 8], ["Dal, 1 katori cooked", 7], ["Dahi, 1 bowl (200 g)", 6]],
      nonveg: [["Chicken breast, 100 g cooked", 31], ["Eggs, 2 whole", 12], ["Paneer, 100 g", 18],
            ["Soya chunks, 30 g dry", 15], ["Dal, 1 katori cooked", 7], ["Dahi, 1 bowl (200 g)", 6]]
    };

    var out = {};
    calcBox.querySelectorAll("[data-out]").forEach(function (el) { out[el.getAttribute("data-out")] = el; });
    var marker = calcBox.querySelector(".bmi-marker");

    function num(name) {
      var el = calcForm.elements[name];
      var v = el ? parseFloat(String(el.value).replace(",", ".")) : NaN;
      return isFinite(v) ? v : NaN;
    }
    function radio(name) { return calcForm.elements[name].value; }
    function fmt(n) { return Math.round(n).toLocaleString("en-IN"); }
    function round50(n) { return Math.round(n / 50) * 50; }

    function syncUnits() {
      var ft = radio("hunit") === "ft";
      calcForm.querySelector(".unit-cm").hidden = ft;
      calcForm.querySelector(".unit-ft").hidden = !ft;
      var hl = document.getElementById("c-height-label");
      if (ft) hl.removeAttribute("for"); else hl.setAttribute("for", "c-cm");
    }

    function bmiCategory(bmi) {
      if (bmi < 18.5) return "Underweight";
      if (bmi < 23) return "Healthy range";
      if (bmi < 25) return "Overweight";
      return "Obese";
    }
    function bmiPosition(bmi) {
      // Four equal segments: <18.5 | 18.5-23 | 23-25 | 25+ (shown up to 35)
      var stops = [[15, 18.5], [18.5, 23], [23, 25], [25, 35]];
      for (var i = 0; i < stops.length; i++) {
        var lo = stops[i][0], hi = stops[i][1];
        if (bmi < hi || i === stops.length - 1) {
          var t = Math.min(1, Math.max(0, (bmi - lo) / (hi - lo)));
          return (i + t) * 25;
        }
      }
      return 0;
    }

    function showEmpty(message) {
      calcMessage.textContent = message || defaultMessage;
      calcEmpty.hidden = false;
      calcOut.hidden = true;
    }

    function calculate() {
      syncUnits();
      var sex = radio("sex");
      var age = num("age");
      var heightCm = radio("hunit") === "ft"
        ? ((num("ft") || 0) * 12 + (num("in") || 0)) * 2.54
        : num("cm");
      var wUnit = radio("wunit");
      var weightKg = wUnit === "lb" ? num("weight") * 0.45359237 : num("weight");

      if (!isFinite(age) || !heightCm || !isFinite(weightKg)) return showEmpty();
      if (age < 18) return showEmpty("This calculator is for adults (18+). Message Jai for guidance for teenagers.");
      if (age > 90 || heightCm < 120 || heightCm > 230 || weightKg < 30 || weightKg > 300) {
        return showEmpty("Please check your age, height and weight. One of them looks out of range.");
      }

      var activity = parseFloat(calcForm.elements.activity.value);
      var goal = GOALS[radio("goal")];
      var h = heightCm / 100;

      // Mifflin-St Jeor resting energy
      var bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
      var tdee = bmr * activity;
      var maintenance = round50(tdee);
      var target = round50(tdee * goal.factor);
      var floor = sex === "male" ? 1500 : 1200;
      var floored = false, lowMaintenance = false;
      if (radio("goal") === "lose" && target < floor) {
        // Never suggest less than a safe minimum, and never more than maintenance.
        target = Math.min(floor, maintenance);
        floored = true;
        lowMaintenance = target >= maintenance;
      }

      // BMI and healthy range (Indian cut-offs)
      var bmi = weightKg / (h * h);
      var lowKg = 18.5 * h * h, highKg = 22.9 * h * h;

      // Protein: based on a healthy reference weight if BMI is 25+
      var refKg = Math.min(weightKg, 25 * h * h);
      var pLow = Math.round(refKg * goal.protein[0] / 5) * 5;
      var pHigh = Math.round(refKg * goal.protein[1] / 5) * 5;
      var perMeal = Math.round((pLow + pHigh) / 2 / 4);

      out.goalText.textContent = goal.text;
      out.target.textContent = fmt(target);
      out.tdee.textContent = fmt(maintenance);
      out.bmr.textContent = fmt(round50(bmr));
      out.protein.textContent = pLow + "–" + pHigh;
      out.perMeal.textContent = perMeal;
      out.healthy.textContent = wUnit === "lb"
        ? Math.round(lowKg / 0.45359237) + "–" + Math.round(highKg / 0.45359237) + " lb"
        : Math.round(lowKg) + "–" + Math.round(highKg) + " kg";
      out.bmi.textContent = bmi.toFixed(1);
      out.bmiCat.textContent = bmiCategory(bmi);
      marker.style.left = bmiPosition(bmi) + "%";

      out.foods.innerHTML = "";
      FOODS[radio("cfood")].forEach(function (f) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(f[0]));
        var b = document.createElement("b");
        b.textContent = "~" + f[1] + " g";
        li.appendChild(b);
        out.foods.appendChild(li);
      });

      var notes = [];
      if (radio("goal") === "lose" && bmi < 18.5) {
        notes.push("Your BMI is below the healthy range, so losing weight isn't recommended. Talk to Jai about building strength instead.");
      } else if (lowMaintenance) {
        notes.push("Your maintenance calories are already low, so eating less isn't advised. Moving more each day is the better route; ask Jai how.");
      } else if (floored) {
        notes.push("We've kept your calories at a safe minimum of " + fmt(target) + " kcal. Going lower should only be done with a coach.");
      }
      if (weightKg > refKg) notes.push("Protein is based on a healthy reference weight for your height, so it isn't overestimated.");
      out.note.textContent = notes.join(" ");
      out.note.hidden = !notes.length;

      var heightText = radio("hunit") === "ft"
        ? (num("ft") || 0) + " ft " + (num("in") || 0) + " in"
        : Math.round(heightCm) + " cm";
      var weightText = num("weight") + " " + wUnit;
      var msg = [
        "Hi Jai! I used the calculator on your website.",
        "",
        "Goal: " + goal.label,
        "Me: " + (sex === "male" ? "Male" : "Female") + ", " + age + " years, " + heightText + ", " + weightText,
        "Activity: " + ACTIVITY[calcForm.elements.activity.value],
        "Daily calories: about " + fmt(target) + " kcal",
        "Protein: " + pLow + "–" + pHigh + " g a day",
        "BMI: " + bmi.toFixed(1) + " (" + bmiCategory(bmi) + ")",
        "",
        "Can you make me a personalised plan?"
      ].join("\n");
      calcWa.setAttribute("href", waLink(msg));
      calcWa.setAttribute("target", "_blank");
      calcWa.setAttribute("rel", "noopener");

      calcEmpty.hidden = true;
      calcOut.hidden = false;
    }

    calcForm.addEventListener("input", calculate);
    calcForm.addEventListener("change", calculate);
    calcForm.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
    syncUnits();
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
