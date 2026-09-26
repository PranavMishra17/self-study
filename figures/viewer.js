/* Figures you can open and explore, on every page that loads this file.

   A figure is any element with data-fig="<key>" that contains an svg. Inside the svg,
   nodes carry data-n="<id>" and edges data-e="<from>><to>". What they mean lives in
   FIG_NOTES[key] (figures/notes*.js):

     { title, cap, nodes: { id: { t, d, links: [{ label, url }] } },
       edges: { "a>b": { t, d } }, walk: ["a", "a>b", "b", ...] }

   Hover a node or an edge for its note. Click the figure to open it full screen: zoom
   and pan, click any node or edge for the full explanation and its links, or walk
   through the flow one step at a time. Pages re-render freely; every handler here is
   delegated from the document, so nothing needs attaching. */
(function () {
  "use strict";
  /* links in the notes are written from the site root; resolve them from this file's place */
  var ROOT = (document.currentScript && document.currentScript.src) ? new URL("..", document.currentScript.src).href : "";
  function hrefOf(u) { return /^(https?:|#|mailto:)/.test(u) || !ROOT ? u : new URL(u, ROOT).href; }
  var notesOf = function (key) { return (window.FIG_NOTES && window.FIG_NOTES[key]) || {}; };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) { n.className = cls; } if (html != null) { n.innerHTML = html; } return n; }
  function idOf(t) { return t.getAttribute("data-n") || t.getAttribute("data-e"); }
  function kindOf(t) { return t.hasAttribute("data-n") ? "nodes" : "edges"; }
  function labelOf(host, t) {
    var key = host.getAttribute("data-fig"), n = notesOf(key)[kindOf(t)] || {}, x = n[idOf(t)] || {};
    if (x.t) { return x.t; }
    if (kindOf(t) === "edges") {
      var ends = idOf(t).split(">"), a = host.querySelector('[data-n="' + ends[0] + '"]'), b = host.querySelector('[data-n="' + ends[1] + '"]');
      return (a ? nameIn(a) : ends[0]) + " to " + (b ? nameIn(b) : ends[1]);
    }
    return nameIn(t);
  }
  function nameIn(t) { var tx = t.querySelector("text"); return tx ? tx.textContent : idOf(t); }
  function noteOf(host, t) { var n = notesOf(host.getAttribute("data-fig"))[kindOf(t)] || {}; return n[idOf(t)] || null; }
  function firstSentence(s) { var m = String(s || "").match(/^.*?[.?!](\s|$)/); return (m ? m[0] : String(s || "")).trim(); }

  /* ---------------------------------------------------------------- hover */
  var tip = null;
  function showTip(host, t, ev) {
    var n = noteOf(host, t);
    if (!tip) { tip = el("div", "fv-tip"); tip.setAttribute("role", "tooltip"); document.body.appendChild(tip); }
    tip.innerHTML = "<b>" + esc(labelOf(host, t)) + "</b>" + (n && n.d ? "<span>" + esc(firstSentence(n.d)) + "</span>" : "");
    tip.style.display = "block";
    moveTip(ev);
  }
  function moveTip(ev) {
    if (!tip || tip.style.display !== "block") { return; }
    var x = ev.clientX + 16, y = ev.clientY + 18, w = tip.offsetWidth, h = tip.offsetHeight;
    if (x + w > window.innerWidth - 8) { x = ev.clientX - w - 12; }
    if (y + h > window.innerHeight - 8) { y = ev.clientY - h - 12; }
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  function hideTip() { if (tip) { tip.style.display = "none"; } }
  function target(ev) { return ev.target.closest && ev.target.closest("[data-n],[data-e]"); }
  document.addEventListener("mouseover", function (ev) {
    var t = target(ev), host = t && t.closest("[data-fig]");
    if (t && host) { showTip(host, t, ev); t.classList.add("fv-hover"); }
  });
  document.addEventListener("mouseout", function (ev) {
    var t = target(ev);
    if (t) { t.classList.remove("fv-hover"); if (!t.contains(ev.relatedTarget)) { hideTip(); } }
  });
  document.addEventListener("mousemove", moveTip);

  /* ---------------------------------------------------------------- full screen */
  var dlg = null, cur = null;
  document.addEventListener("click", function (ev) {
    if (dlg && dlg.contains(ev.target)) { return; }
    if (ev.target.closest("a, button, input, textarea, summary")) { return; }
    var host = ev.target.closest && ev.target.closest("[data-fig]");
    if (!host || !host.querySelector("svg")) { return; }
    ev.preventDefault();
    open(host, target(ev));
  });
  document.addEventListener("keydown", function (ev) {
    if (!cur) {
      var host = document.activeElement && document.activeElement.closest && document.activeElement.closest("[data-fig]");
      if (host && (ev.key === "Enter" || ev.key === " ") && document.activeElement === host) { ev.preventDefault(); open(host, null); }
      return;
    }
    if (ev.key === "Escape") { close(); }
    else if (ev.key === "ArrowRight") { ev.preventDefault(); ev.stopPropagation(); walk(1); }
    else if (ev.key === "ArrowLeft") { ev.preventDefault(); ev.stopPropagation(); walk(-1); }
    else if (ev.key === "+" || ev.key === "=") { zoom(1.25); }
    else if (ev.key === "-") { zoom(0.8); }
    else if (ev.key === "0") { reset(); }
  }, true);
  /* hosts can be reached by keyboard */
  new MutationObserver(function () {
    document.querySelectorAll("[data-fig]:not([tabindex])").forEach(function (h) {
      h.setAttribute("tabindex", "0");
      h.setAttribute("aria-label", "Open this figure full screen");
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  function open(host, first) {
    var key = host.getAttribute("data-fig"), N = notesOf(key);
    var reg = window.FIGURES && window.FIGURES.DIA && window.FIGURES.DIA[key];
    var aria = (host.querySelector("svg").getAttribute("aria-label") || "").trim();
    var title = N.title || (reg && reg.title) || (aria && !/^(architecture )?diagram$/i.test(aria) ? aria : "") ||
      (host.querySelector("figcaption, .pn, .fh") || {}).textContent || "Figure";
    var cap = N.cap || (reg && reg.cap) || (host.querySelector("figcaption, .cap") || {}).innerHTML || "";
    hideTip();
    if (!dlg) {
      dlg = el("div", "fv");
      dlg.setAttribute("role", "dialog");
      dlg.setAttribute("aria-modal", "true");
      document.body.appendChild(dlg);
    }
    dlg.innerHTML = "";
    var bar = el("div", "fv-bar");
    bar.appendChild(el("div", "fv-title", esc(title.replace(/^Figure \d+\.\s*/, ""))));
    var tools = el("div", "fv-tools");
    var steps = (N.walk || []).filter(function (id) { return host.querySelector('[data-n="' + id + '"],[data-e="' + id + '"]'); });
    if (steps.length) {
      tools.appendChild(btn("Walk through", function () { walk(cur.i < 0 ? 1 : 0, true); }, "fv-walk"));
      tools.appendChild(btn("←", function () { walk(-1); }, "", "Previous step"));
      tools.appendChild(el("span", "fv-count"));
      tools.appendChild(btn("→", function () { walk(1); }, "", "Next step"));
    }
    tools.appendChild(btn("−", function () { zoom(0.8); }, "", "Zoom out"));
    tools.appendChild(btn("+", function () { zoom(1.25); }, "", "Zoom in"));
    tools.appendChild(btn("Fit", reset, "", "Fit to the window"));
    tools.appendChild(btn("×", close, "fv-x", "Close"));
    bar.appendChild(tools);
    dlg.appendChild(bar);

    var main = el("div", "fv-main");
    var stage = el("div", "fv-stage");
    var pan = el("div", "fv-pan");
    var svg = host.querySelector("svg").cloneNode(true);
    svg.removeAttribute("width"); svg.removeAttribute("height"); svg.style.cssText = "";
    /* the figure keeps its own wrapper, so the page's styles for it still apply */
    var wrap = host.cloneNode(false);
    ["data-fig", "tabindex", "aria-label", "id"].forEach(function (a) { wrap.removeAttribute(a); });
    wrap.classList.add("fv-wrap");
    wrap.appendChild(svg);
    pan.appendChild(wrap);
    stage.appendChild(pan);
    stage.style.background = backgroundOf(host);
    main.appendChild(stage);
    var side = el("aside", "fv-side");
    main.appendChild(side);
    dlg.appendChild(main);

    cur = { host: host, key: key, N: N, svg: svg, stage: stage, pan: pan, side: side, cap: cap, steps: steps, i: -1, k: 1, x: 0, y: 0 };
    document.documentElement.classList.add("fv-open");
    dlg.style.display = "flex";
    stageEvents(stage);
    reset();
    if (first) { select(first.getAttribute("data-n") ? "n" : "e", idOf(first)); } else { overview(); }
    dlg.querySelector(".fv-x").focus();
  }
  function backgroundOf(n) {
    for (; n && n.nodeType === 1; n = n.parentElement) {
      var c = getComputedStyle(n).backgroundColor;
      if (c && c !== "transparent" && !/rgba\(\d+,\s*\d+,\s*\d+,\s*0\)/.test(c)) { return c; }
    }
    return "#fff";
  }
  function btn(text, fn, cls, label) {
    var b = el("button", "fv-b " + (cls || ""), esc(text));
    b.type = "button";
    if (label) { b.setAttribute("aria-label", label); b.title = label; }
    b.addEventListener("click", function (e) { e.stopPropagation(); fn(); });
    return b;
  }
  function close() {
    if (!dlg) { return; }
    dlg.style.display = "none";
    document.documentElement.classList.remove("fv-open");
    var h = cur && cur.host; cur = null;
    if (h) { h.focus({ preventScroll: true }); }
  }

  /* the panel: the caption, or the selected node or edge */
  function overview() {
    cur.side.innerHTML = "";
    var n = Object.keys(cur.N.nodes || {}).length;
    cur.side.appendChild(el("div", "fv-cap", cur.cap));
    cur.side.appendChild(el("p", "fv-hint", n ? "Hover a box or an arrow for a note; select it for the whole explanation." + (cur.steps.length ? " Or walk through the flow, one step at a time." : "") : "Scroll to zoom, drag to move."));
    mark(null);
  }
  function select(kind, id) {
    var t = cur.svg.querySelector("[data-" + kind + '="' + id + '"]');
    if (!t) { return; }
    var n = noteOf(cur.host, t) || {};
    cur.side.innerHTML = "";
    var h = el("div", "fv-sel");
    h.appendChild(el("div", "fv-kind", kind === "n" ? "In this figure" : "The connection"));
    h.appendChild(el("h3", "", esc(labelOf(cur.host, t))));
    if (n.d) { String(n.d).split(/\n\n+/).forEach(function (p) { h.appendChild(el("p", "", esc(p))); }); }
    else { h.appendChild(el("p", "fv-hint", "No note for this one yet.")); }
    if (n.links && n.links.length) {
      var ul = el("ul", "fv-links");
      n.links.forEach(function (l) {
        var li = el("li");
        var a = el("a", "", esc(l.label));
        a.href = hrefOf(l.url);
        if (/^https?:/.test(l.url)) { a.target = "_blank"; a.rel = "noopener"; }
        li.appendChild(a);
        ul.appendChild(li);
      });
      h.appendChild(el("div", "fv-kind", "To go further"));
      h.appendChild(ul);
    }
    var back = btn("Back to the caption", overview, "fv-link");
    h.appendChild(back);
    cur.side.appendChild(h);
    mark(t);
  }
  function mark(t) {
    cur.svg.querySelectorAll(".fv-on").forEach(function (x) { x.classList.remove("fv-on"); });
    cur.svg.classList.toggle("fv-dim", !!t);
    if (t) { t.classList.add("fv-on"); }
    var c = dlg.querySelector(".fv-count");
    if (c) { c.textContent = cur.i >= 0 ? (cur.i + 1) + " of " + cur.steps.length : cur.steps.length + " steps"; }
  }
  function walk(d, restart) {
    if (!cur || !cur.steps.length) { return; }
    cur.i = restart ? 0 : Math.max(0, Math.min(cur.steps.length - 1, cur.i + d));
    var id = cur.steps[cur.i];
    select(cur.svg.querySelector('[data-n="' + id + '"]') ? "n" : "e", id);
  }

  /* zoom and pan: a transform on the wrapper, around the pointer */
  function apply() { cur.pan.style.transform = "translate(" + cur.x + "px," + cur.y + "px) scale(" + cur.k + ")"; }
  function reset() { cur.k = 1; cur.x = 0; cur.y = 0; apply(); }
  function zoom(f, cx, cy) {
    var r = cur.stage.getBoundingClientRect();
    cx = cx === undefined ? r.width / 2 : cx; cy = cy === undefined ? r.height / 2 : cy;
    var k = Math.max(0.5, Math.min(6, cur.k * f));
    cur.x = cx - (cx - cur.x) * (k / cur.k);
    cur.y = cy - (cy - cur.y) * (k / cur.k);
    cur.k = k; apply();
  }
  function stageEvents(stage) {
    var drag = null, moved = false;
    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.12 : 0.89, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    stage.addEventListener("pointerdown", function (e) { drag = { x: e.clientX - cur.x, y: e.clientY - cur.y }; moved = false; });
    window.addEventListener("pointermove", function (e) {
      if (!drag || !cur) { return; }
      if (Math.abs(e.clientX - drag.x - cur.x) + Math.abs(e.clientY - drag.y - cur.y) > 3) { moved = true; }
      cur.x = e.clientX - drag.x; cur.y = e.clientY - drag.y; apply();
    });
    window.addEventListener("pointerup", function () { drag = null; });
    stage.addEventListener("click", function (e) {
      if (moved) { return; }
      var t = target(e);
      if (t) { cur.i = cur.steps.indexOf(idOf(t)); select(t.getAttribute("data-n") ? "n" : "e", idOf(t)); }
      else { cur.i = -1; overview(); }
    });
    stage.addEventListener("mouseover", function (e) { var t = target(e); if (t) { showTip(cur.host, t, e); } });
  }
})();
