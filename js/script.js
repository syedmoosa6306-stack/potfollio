/* Portfolio interactions: theme toggle, typed role line, scroll effects, copy buttons and the message composer. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("#yr").textContent = new Date().getFullYear();

  /* Theme toggle */
  var root = document.documentElement;
  $("#theme").addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    root.setAttribute("data-theme", dark ? "light" : "dark");
  });

  /* Mobile menu: Bootstrap's collapse opens and closes it; close it after a link is tapped */
  var nav = $("#nav");
  $$("#nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.bootstrap && nav.classList.contains("show")) {
        window.bootstrap.Collapse.getOrCreateInstance(nav, { toggle: false }).hide();
      }
    });
  });

  /* Typed role line */
  var words = ["Web Developer", "HTML + CSS builder", "JavaScript learner", "Based in Karachi"];
  var el = $("#typed");
  if (reduce) { el.textContent = words[0]; }
  else {
    var w = 0, c = 0, del = false;
    (function tick() {
      var word = words[w];
      el.textContent = word.slice(0, c);
      if (!del && c < word.length) { c++; setTimeout(tick, 70); }
      else if (!del) { del = true; setTimeout(tick, 1400); }
      else if (c > 0) { c--; setTimeout(tick, 35); }
      else { del = false; w = (w + 1) % words.length; setTimeout(tick, 250); }
    })();
  }

  /* Scroll progress, spotlight, scroll spy */
  var prog = $("#progress");
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")";
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var spot = $("#spot");
  addEventListener("pointermove", function (e) {
    spot.style.setProperty("--x", e.clientX + "px"); spot.style.setProperty("--y", e.clientY + "px");
  }, { passive: true });

  var links = {};
  $$("#nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && links[e.target.id]) {
          $$("#nav a").forEach(function (a) { a.classList.remove("on"); });
          links[e.target.id].classList.add("on");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main, section").forEach(function (s) { if (s.id) spy.observe(s); });

    /* Reveal on scroll: only items below the fold start shifted; all settle after a short timeout */
    var rvs = $$(".rv, #skillGrid");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("pre"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    if (!reduce) {
      rvs.forEach(function (n) {
        if (n.getBoundingClientRect().top > innerHeight) { n.classList.add("pre"); }
        io.observe(n);
      });
      setTimeout(function () { $$(".pre").forEach(function (n) { n.classList.remove("pre"); }); }, 6000);
    }
  }

  /* Card glow follows pointer */
  $$(".tile").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* Hero window tilt */
  var win = $("#win");
  if (win && !reduce && matchMedia("(hover: hover)").matches) {
    win.parentNode.addEventListener("pointermove", function (e) {
      var r = win.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      win.style.transform = "perspective(900px) rotateY(" + (x * 7) + "deg) rotateX(" + (-y * 7) + "deg)";
    });
    win.parentNode.addEventListener("pointerleave", function () { win.style.transform = ""; });
  }

  /* Toast + copy */
  var toast = $("#toast"), tt;
  function say(t) { toast.textContent = t; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("on"); }, 2200); }
  function copyText(text, ok) {
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var done = false; try { done = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); say(done ? ok : "Select the text and copy it manually");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { say(ok); }, fallback);
    } else { fallback(); }
  }
  $$(".copy").forEach(function (b) { b.addEventListener("click", function () { copyText(b.getAttribute("data-copy"), "Copied"); }); });

  /* Message composer */
  var fn = $("#fn"), fm = $("#fm"), wa = $("#wa");
  function build() {
    var n = fn.value.trim(), m = fm.value.trim();
    return "Hello Moosa, " + (n ? "my name is " + n + ". " : "") + (m || "I saw your portfolio and would like to talk.");
  }
  function sync() { wa.href = "https://wa.me/923238285813?text=" + encodeURIComponent(build()); }
  fn.addEventListener("input", sync); fm.addEventListener("input", sync); sync();
  $("#form").addEventListener("submit", function (e) { e.preventDefault(); });
  $("#cpm").addEventListener("click", function () { copyText(build(), "Message copied"); });
})();
