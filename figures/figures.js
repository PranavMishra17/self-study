/* The figures, drawn once and used everywhere: the tracker (index.html) and the interview
   loop pages (interviews/*.html) both read FIGURES.DIA by key. To improve a figure, edit it
   here; every page that shows it picks it up.

   Each entry: { title, cap (html), svg() -> svg markup }. Figures drawn with S use the
   d-* classes in figures.css; "fixed" ones carry their own colours and sit on white. */
var FIGURES = (function () {
  "use strict";

  var S = {};
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  /* Every box is a node (data-n, from its id or its label) and every arrow an edge
     (data-e, "from>to"), so figures/viewer.js can explain them. Arrows are drawn before
     all their boxes exist, so each one is matched to the nearest boxes when the figure
     is framed. */
  var drawn = [];
  function slug(t) { return String(t).toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40); }
  function distTo(b, x, y) {
    var dx = Math.max(b.x - x, 0, x - (b.x + b.w)), dy = Math.max(b.y - y, 0, y - (b.y + b.h));
    return Math.sqrt(dx * dx + dy * dy);
  }
  function nearest(x, y) {
    var best = null, bd = 28;
    drawn.forEach(function (b) { var d = distTo(b, x, y); if (d < bd) { bd = d; best = b; } });
    return best;
  }
  S.frame = function (w, h, body) {
    var seen = {};
    body = body.replace(/data-e="@([\d.\-]+),([\d.\-]+),([\d.\-]+),([\d.\-]+)(?:\|([^"]*))?"/g, function (m, x1, y1, x2, y2, id) {
      if (id) { return 'data-e="' + id + '"'; }
      var a = nearest(+x1, +y1), c = nearest(+x2, +y2);
      if (!a || !c || a === c) { return 'data-e-free=""'; }
      var e = a.id + ">" + c.id;
      seen[e] = (seen[e] || 0) + 1;
      return 'data-e="' + e + (seen[e] > 1 ? "#" + seen[e] : "") + '"';
    });
    drawn = [];
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img">' +
      '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
      '<path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>' +
      '<g color="var(--faint)">' + body + '</g></svg>';
  };
  /* a Lucide icon (figures/icons.js), size in px, coloured by tone */
  S.icon = function (name, x, y, size, tone) {
    var inner = (typeof ICONS !== "undefined" && ICONS[name]) || "";
    if (!inner) { return ""; }
    var k = (size || 18) / 24;
    return '<g class="d-ic d-ic-' + (tone || "flat") + '" transform="translate(' + x + ' ' + y + ') scale(' + k + ')" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</g>';
  };
  /* wrap any markup as a node, for figures that are plots rather than boxes */
  S.node = function (id, markup) { return '<g data-n="' + id + '">' + markup + '</g>'; };
  S.box = function (o) {
    var tone = o.tone || "flat";
    var r = o.r === undefined ? 0 : o.r;
    var id = o.id || (o.label ? slug(o.label) : "");
    if (id) { drawn.push({ id: id, x: o.x, y: o.y, w: o.w, h: o.h }); }
    var s = '<rect x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" rx="' + r +
      '" class="d-fill-' + tone + ' d-str-' + tone + '" stroke-width="1.25"' +
      (o.dash ? ' stroke-dasharray="4 3"' : '') + '/>';
    var tx = o.x + o.w / 2;
    if (o.icon) {
      var isz = Math.min(20, o.h - 14);
      s += S.icon(o.icon, o.x + 10, o.y + (o.h - isz) / 2, isz, tone);
      tx = o.x + 14 + isz + (o.w - 14 - isz) / 2;
    }
    if (o.label) {
      var cy = o.y + o.h / 2 + (o.sub ? -3 : 4);
      s += '<text x="' + tx + '" y="' + cy + '" text-anchor="middle" class="d-t-b">' + esc(o.label) + '</text>';
      if (o.sub) {
        s += '<text x="' + tx + '" y="' + (cy + 15) + '" text-anchor="middle" class="d-t-s">' + esc(o.sub) + '</text>';
      }
    }
    return id ? '<g data-n="' + id + '">' + s + '</g>' : s;
  };
  S.arrow = function (x1, y1, x2, y2, o) {
    o = o || {};
    var d = o.curve
      ? "M" + x1 + "," + y1 + " Q" + ((x1 + x2) / 2) + "," + (Math.min(y1, y2) - o.curve) + " " + x2 + "," + y2
      : "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
    var s = '<path d="' + d + '" class="fv-hit"/><path d="' + d + '" class="d-line" stroke-width="1.25" marker-end="url(#ah)"' +
      (o.dash ? ' stroke-dasharray="4 3"' : '') + '/>';
    if (o.label) {
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - (o.curve ? o.curve * 0.55 : 0) - 6;
      s += '<text x="' + mx + '" y="' + my + '" text-anchor="middle" class="d-t-s">' + esc(o.label) + '</text>';
    }
    return '<g data-e="@' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + (o.id ? "|" + o.id : "") + '">' + s + '</g>';
  };
  S.text = function (x, y, t, cls, anchor) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "start") + '" class="' +
      (cls || "d-t") + '">' + esc(t) + '</text>';
  };
  S.tag = function (x, y, t) {
    return S.text(x, y, String(t).toUpperCase(), "d-t-x");
  };
  S.bar = function (o) {
    var tone = o.tone || "flat";
    return '<rect x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h +
      '" rx="3" class="d-fill-' + tone + ' d-str-' + tone + '" stroke-width="1"/>';
  };
  S.dots = function (x, y, n, gap, tone) {
    var s = "", i;
    for (i = 0; i < n; i++) {
      s += '<circle cx="' + (x + i * gap) + '" cy="' + y + '" r="3.5" class="d-fill-' + tone +
        ' d-str-' + tone + '" stroke-width="1"/>';
    }
    return s;
  };
  S.path = function (d, tone, dash) {
    return '<path d="' + d + '" fill="none" class="d-str-' + (tone || "flat") + '" stroke-width="1.75"' +
      (dash ? ' stroke-dasharray="4 3"' : '') + '/>';
  };
  S.axes = function (x, y, w, h, xl, yl) {
    return '<path d="M' + x + ',' + y + ' L' + x + ',' + (y + h) + ' L' + (x + w) + ',' + (y + h) +
      '" class="d-line" stroke-width="1"/>' +
      S.text(x + w, y + h + 15, xl, "d-t-x", "end") +
      S.text(x - 4, y - 5, yl, "d-t-x", "start");
  };

  /* -------------------------------------------------------------- diagrams */

  var DIA = {};

  DIA.queue = {
    title: "A queue with no backpressure does not slow down. It dies.",
    cap: "<b>Above:</b> the unbounded queue absorbs the overload silently. Throughput on your dashboard looks unchanged, latency climbs without bound, memory climbs with it, and the process dies all at once. <b>Below:</b> a bounded queue fills, refuses work, and pushes that refusal back to the producer. Rejecting work is information. A silent five-minute queue is not.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "No backpressure");
      b += S.box({ x: 0, y: 24, w: 86, h: 40, label: "Producer", tone: "flat" });
      b += S.arrow(90, 44, 128, 44, { label: "fast" });
      b += S.box({ x: 132, y: 24, w: 196, h: 40, tone: "alaap", dash: true });
      b += S.dots(148, 44, 11, 17, "alaap");
      b += S.text(230, 80, "unbounded, growing", "d-t-s", "middle");
      b += S.arrow(332, 44, 370, 44, { label: "slow" });
      b += S.box({ x: 374, y: 24, w: 86, h: 40, label: "Worker", tone: "flat" });
      b += S.text(480, 36, "Latency climbs,", "d-t-s");
      b += S.text(480, 52, "memory climbs,", "d-t-s");
      b += S.text(480, 68, "then it is gone.", "d-t-b");

      b += S.tag(0, 128, "With backpressure");
      b += S.box({ x: 0, y: 138, w: 86, h: 40, label: "Producer", tone: "flat" });
      b += S.arrow(90, 158, 128, 158, {});
      b += S.box({ x: 132, y: 138, w: 196, h: 40, tone: "sys" });
      b += S.dots(148, 158, 6, 17, "sys");
      b += S.text(230, 194, "bounded, capped", "d-t-s", "middle");
      b += S.arrow(332, 158, 370, 158, {});
      b += S.box({ x: 374, y: 138, w: 86, h: 40, label: "Worker", tone: "flat" });
      b += S.arrow(230, 134, 60, 134, { curve: 34, label: "full — stop sending", dash: true });
      b += S.text(480, 150, "Producer slows.", "d-t-s");
      b += S.text(480, 166, "The system stays up.", "d-t-b");
      return S.frame(600, 210, b);
    }
  };

  DIA.tail = {
    title: "One slow shard in a hundred makes almost every request slow",
    cap: "<b>Fan-out amplifies tails.</b> If a request waits on 100 shards and each is slow 1% of the time, the chance that none is slow is 0.99 to the power 100 — about 37%. So roughly 63% of requests are slow. The p99 of a component becomes the typical case for the system, which is why tail latency is a system property rather than a component detail.",
    svg: function () {
      var b = "", i, x;
      b += S.box({ x: 0, y: 58, w: 84, h: 38, label: "Request", tone: "now" });
      for (i = 0; i < 12; i++) {
        x = 150 + i * 36;
        var slow = (i === 4 || i === 9);
        b += S.arrow(86, 77, x + 12, slow ? 30 : 48, { curve: 0 });
        b += S.bar({ x: x, y: slow ? 30 : 48, w: 24, h: slow ? 74 : 38, tone: slow ? "alaap" : "sys" });
      }
      b += S.text(150, 126, "100 shards, each slow 1% of the time", "d-t-s");
      b += S.text(150, 148, "P(no shard is slow) = 0.99", "d-t");
      b += S.text(288, 143, "100", "d-t-s");
      b += S.text(312, 148, "\u2248 37%", "d-t");
      b += S.text(150, 168, "So ~63% of requests wait on a slow shard.", "d-t-b");
      return S.frame(600, 180, b);
    }
  };

  DIA.skew = {
    title: "Hashing spreads keys evenly. It does not spread traffic evenly.",
    cap: "<b>Skew is a key-choice problem, not bad luck.</b> Real usage is power-law: one customer, one scenario family, one hour of the day carries a disproportionate share. All of that key's events hash to one partition however good the hash is, and that partition becomes the ceiling for the whole system.",
    svg: function () {
      var b = "", i;
      var heights = [26, 22, 30, 24, 96, 20, 28, 25];
      b += S.tag(0, 14, "Partition by hash of user id");
      for (i = 0; i < 8; i++) {
        var h = heights[i];
        var hot = h > 60;
        b += S.bar({ x: i * 60, y: 130 - h, w: 44, h: h, tone: hot ? "alaap" : "sys" });
        b += S.text(i * 60 + 22, 146, "p" + i, "d-t-s", "middle");
      }
      b += S.path("M0,34 L480,34", "flat", true);
      b += S.text(486, 38, "capacity", "d-t-x");
      b += S.text(240, 24, "one user, 4% of all events", "d-t-b", "middle");
      b += S.arrow(258, 30, 262, 60, {});
      b += S.text(0, 172, "Every other partition is idle. The system's throughput is now one partition's throughput.", "d-t-s");
      return S.frame(600, 182, b);
    }
  };

  DIA.storage = {
    title: "Two ways to write, and what each one costs you",
    cap: "<b>An LSM-tree appends.</b> Writes go to memory, then flush as sorted files, and merging is deferred to background compaction — so writes are cheap and a read may have to check several layers. <b>A B-tree updates in place.</b> Reads go straight to the right page; writes pay for random IO. Eval traces are written once, never updated, read in bulk — which is why they belong in object storage rather than in either.",
    svg: function () {
      var b = "", i;
      b += S.tag(0, 14, "LSM-tree — append");
      b += S.box({ x: 0, y: 24, w: 74, h: 34, label: "write", tone: "now" });
      b += S.arrow(78, 41, 108, 41, {});
      b += S.box({ x: 112, y: 24, w: 84, h: 34, label: "memtable", tone: "sys" });
      b += S.arrow(200, 41, 230, 41, { label: "flush" });
      for (i = 0; i < 3; i++) {
        b += S.bar({ x: 234 + i * 58, y: 24 + i * 5, w: 50, h: 34 - i * 4, tone: "sys" });
      }
      b += S.text(234, 76, "sorted files, merged later", "d-t-s");
      b += S.text(430, 34, "cheap writes", "d-t-b");
      b += S.text(430, 50, "reads check layers", "d-t-s");

      b += S.tag(0, 116, "B-tree — update in place");
      b += S.box({ x: 112, y: 126, w: 84, h: 30, label: "root", tone: "math" });
      b += S.arrow(140, 158, 118, 178, {});
      b += S.arrow(168, 158, 190, 178, {});
      b += S.box({ x: 76, y: 180, w: 76, h: 30, label: "page", tone: "math" });
      b += S.box({ x: 162, y: 180, w: 76, h: 30, label: "page", tone: "math" });
      b += S.text(430, 152, "direct reads", "d-t-b");
      b += S.text(430, 168, "random-IO writes", "d-t-s");
      return S.frame(600, 222, b);
    }
  };

  DIA.retry = {
    title: "Retries arrive exactly when there is least capacity to serve them",
    cap: "<b>The retry storm.</b> A service slows, clients time out and retry, and the retries land on the thing that was already failing — so it never gets a recovery window. Backoff reduces the pressure; <b>jitter</b> is what stops every client returning in the same synchronised wave and recreating the spike.",
    svg: function () {
      var b = "", i;
      b += S.tag(0, 14, "Naive retry");
      b += S.box({ x: 250, y: 30, w: 96, h: 44, label: "Service", sub: "at capacity", tone: "alaap" });
      for (i = 0; i < 5; i++) {
        b += S.arrow(60, 24 + i * 12, 246, 46, {});
      }
      b += S.text(0, 90, "load", "d-t-x");
      b += S.text(360, 46, "load rises as it degrades", "d-t-s");
      b += S.text(360, 64, "no recovery window", "d-t-b");

      b += S.tag(0, 132, "Backoff with jitter");
      b += S.box({ x: 250, y: 148, w: 96, h: 44, label: "Service", sub: "recovering", tone: "math" });
      var offs = [0, 26, 9, 41, 17];
      for (i = 0; i < 5; i++) {
        b += S.arrow(60 + offs[i], 142 + i * 12, 246, 164, { dash: true });
      }
      b += S.text(360, 164, "returns are spread out", "d-t-s");
      b += S.text(360, 182, "the spike never re-forms", "d-t-b");
      return S.frame(600, 206, b);
    }
  };

  DIA.cache = {
    title: "Population happens in one place. Invalidation has to happen everywhere.",
    cap: "<b>The write path is the hard part.</b> A cached vector search is fine until the user adds a memory — at which point that user's cached results are wrong, and the product's one promise quietly breaks. Every write path in the system has to know what it invalidates, including code written later by someone who does not know the cache exists.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 30, w: 92, h: 40, label: "user turn", tone: "now" });
      b += S.arrow(96, 50, 132, 50, {});
      b += S.box({ x: 136, y: 30, w: 104, h: 40, label: "cache", sub: "key: user + query", tone: "sys" });
      b += S.arrow(244, 50, 286, 50, { label: "miss" });
      b += S.box({ x: 290, y: 30, w: 116, h: 40, label: "vector search", tone: "flat" });
      b += S.arrow(348, 74, 190, 74, { curve: -26, label: "fill", dash: true });

      b += S.box({ x: 0, y: 136, w: 92, h: 40, label: "new memory", tone: "req" });
      b += S.arrow(96, 156, 132, 156, { label: "write" });
      b += S.box({ x: 136, y: 136, w: 104, h: 40, label: "store", tone: "flat" });
      b += S.arrow(188, 132, 188, 76, { label: "must invalidate" });
      b += S.text(430, 142, "Miss this edge and the", "d-t-s");
      b += S.text(430, 158, "assistant keeps answering", "d-t-s");
      b += S.text(430, 174, "from a world without it.", "d-t-b");
      return S.frame(600, 190, b);
    }
  };

  DIA.logs = {
    title: "The log turns multiplication into addition",
    cap: "<b>This is why likelihoods get logged.</b> Multiplying thousands of small probabilities underflows to zero in floating point; the same quantities summed do not. It is also why an exponential plotted on a log axis becomes a straight line — the log undoes the exponential, so constant multiplicative growth reads as constant slope.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 26, w: 230, h: 42, label: "p\u2081 \u00d7 p\u2082 \u00d7 \u2026 \u00d7 p\u2099", sub: "underflows toward zero", tone: "alaap" });
      b += S.arrow(236, 47, 288, 47, { label: "log" });
      b += S.box({ x: 294, y: 26, w: 246, h: 42, label: "log p\u2081 + log p\u2082 + \u2026", sub: "stable, and easy to differentiate", tone: "math" });

      b += S.axes(20, 108, 200, 76, "time", "linear");
      b += S.path("M20,184 C90,182 140,168 180,120 L200,108", "sys");
      b += S.axes(300, 108, 200, 76, "time", "log scale");
      b += S.path("M300,184 L500,112", "math");
      b += S.text(300, 202, "the same data, straightened", "d-t-s");
      return S.frame(600, 212, b);
    }
  };

  DIA.chain = {
    title: "A network is a composition. The chain rule is how you differentiate one.",
    cap: "<b>Forward, then backward.</b> Each layer is a function; the network is their composition. Going forward you record what each layer saw — that recording is the tape. Going backward you multiply the local derivatives along the chain. Autograd is not magic added to PyTorch; it is this bookkeeping, done automatically.",
    svg: function () {
      var b = "", i;
      var names = ["x", "f\u2081", "f\u2082", "f\u2083", "loss"];
      for (i = 0; i < 5; i++) {
        b += S.box({ x: i * 116, y: 30, w: 88, h: 40, label: names[i], tone: i === 4 ? "now" : "math" });
        if (i < 4) { b += S.arrow(i * 116 + 92, 50, i * 116 + 112, 50, {}); }
      }
      b += S.text(0, 94, "forward — and each box remembers what it saw", "d-t-s");
      for (i = 4; i > 0; i--) {
        b += S.arrow(i * 116, 128, (i - 1) * 116 + 92, 128, { dash: true });
      }
      b += S.text(0, 152, "backward — multiply the local derivatives along the chain", "d-t-s");
      b += S.text(0, 180, "\u2202loss/\u2202x = \u2202loss/\u2202f\u2083 \u00b7 \u2202f\u2083/\u2202f\u2082 \u00b7 \u2202f\u2082/\u2202f\u2081 \u00b7 \u2202f\u2081/\u2202x", "d-t-b");
      return S.frame(600, 192, b);
    }
  };

  DIA.descent = {
    title: "The learning rate is a step size on the direction the gradient gives you",
    cap: "<b>\u03b8 \u2190 \u03b8 \u2212 \u03b7 \u2207L(\u03b8).</b> The gradient points uphill, so descent subtracts it. The learning rate multiplies the gradient and nothing else. Too small and you crawl; too large and you step past the minimum and oscillate — which is the whole intuition behind every scheduler you will ever read about.",
    svg: function () {
      var b = "", i;
      b += S.path("M20,150 C90,150 120,40 200,40 C280,40 300,150 380,150", "flat");
      b += S.path("M20,150 C90,150 120,40 200,40 C280,40 300,150 380,150", "flat");
      var pts = [[60, 132], [104, 92], [150, 58], [200, 42]];
      for (i = 0; i < pts.length; i++) {
        b += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="5" class="d-fill-now d-str-now" stroke-width="1.25"/>';
        if (i < pts.length - 1) { b += S.arrow(pts[i][0] + 6, pts[i][1] - 2, pts[i + 1][0] - 6, pts[i + 1][1] + 2, {}); }
      }
      b += S.text(200, 30, "minimum", "d-t-s", "middle");
      b += S.text(410, 60, "small \u03b7 \u2014 many small steps", "d-t-s");
      b += S.text(410, 82, "large \u03b7 \u2014 steps past it, oscillates", "d-t-s");
      b += S.text(410, 112, "\u03b8 \u2190 \u03b8 \u2212 \u03b7 \u00b7 \u2207L", "d-t-b");
      b += S.text(410, 132, "\u03b7 multiplies the gradient,", "d-t-s");
      b += S.text(410, 148, "never the loss or the parameters.", "d-t-s");
      return S.frame(600, 176, b);
    }
  };

  DIA.vectors = {
    title: "Cosine similarity is the dot product with the lengths divided out",
    cap: "<b>Direction carries the meaning; length often carries frequency.</b> The dot product is |a||b|cos\u03b8. Normalise both and what is left is the cosine alone. That is why two embeddings can point the same way with very different magnitudes and still mean the same thing — and why you use this measure every day in the memory system.",
    svg: function () {
      var b = "";
      b += S.axes(30, 24, 200, 140, "", "");
      b += S.path("M30,164 L190,54", "sys");
      b += S.path("M30,164 L140,44", "math");
      b += S.text(196, 50, "a", "d-t-b");
      b += S.text(146, 40, "b", "d-t-b");
      b += S.path("M66,150 A38,38 0 0,1 82,138", "flat");
      b += S.text(78, 156, "\u03b8", "d-t");
      b += S.text(280, 54, "a \u00b7 b = |a| |b| cos\u03b8", "d-t-b");
      b += S.text(280, 82, "divide the magnitudes out", "d-t-s");
      b += S.text(280, 106, "cos\u03b8 = (a \u00b7 b) / (|a| |b|)", "d-t-b");
      b += S.text(280, 134, "Length dropped. Direction kept.", "d-t-s");
      b += S.text(280, 152, "For meaning, direction is the signal.", "d-t-s");
      return S.frame(600, 180, b);
    }
  };

  DIA.bayes = {
    title: "A very accurate test for a very rare thing is mostly wrong",
    cap: "<b>Base rates decide this, not sensitivity.</b> Out of 100,000 people: 100 are ill and about 99 test positive; 99,900 are healthy and about 4,995 also test positive. A positive result is therefore roughly 99 out of 5,094 — about 2%. The false positives come from a pool five hundred times larger, so they swamp the true ones.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 26, w: 150, h: 46, label: "100,000 people", tone: "flat" });
      b += S.arrow(154, 40, 190, 34, {});
      b += S.arrow(154, 58, 190, 72, {});
      b += S.box({ x: 194, y: 16, w: 118, h: 38, label: "100 ill", tone: "req" });
      b += S.box({ x: 194, y: 60, w: 118, h: 38, label: "99,900 healthy", tone: "flat" });
      b += S.arrow(316, 35, 352, 35, { label: "99%" });
      b += S.arrow(316, 79, 352, 79, { label: "5%" });
      b += S.bar({ x: 356, y: 22, w: 14, h: 26, tone: "req" });
      b += S.text(376, 40, "99 true positives", "d-t");
      b += S.bar({ x: 356, y: 62, w: 176, h: 26, tone: "alaap" });
      b += S.text(356, 108, "4,995 false positives", "d-t");
      b += S.text(0, 142, "A positive result means roughly 99 in 5,094. About two percent.", "d-t-b");
      return S.frame(600, 152, b);
    }
  };

  DIA.attention = {
    title: "Why the scores are divided by the square root of d\u2096",
    cap: "<b>A variance argument.</b> A dot product sums over d\u2096 dimensions, so its variance grows with d\u2096. Large raw scores push softmax into saturation, where one weight is almost 1 and the rest almost 0 — and the gradient there is almost nothing. Dividing by \u221ad\u2096 holds the variance roughly constant, which keeps softmax in the range where it still learns.",
    svg: function () {
      var b = "", i;
      b += S.box({ x: 0, y: 26, w: 76, h: 36, label: "Q", sub: "what I want", tone: "math" });
      b += S.box({ x: 0, y: 74, w: 76, h: 36, label: "K", sub: "what I offer", tone: "math" });
      b += S.box({ x: 0, y: 122, w: 76, h: 36, label: "V", sub: "what is carried", tone: "math" });
      b += S.arrow(80, 44, 118, 60, {});
      b += S.arrow(80, 92, 118, 76, {});
      b += S.box({ x: 122, y: 50, w: 84, h: 36, label: "Q \u00b7 K", tone: "flat" });
      b += S.arrow(210, 68, 248, 68, { label: "\u00f7 \u221ad\u2096" });
      b += S.box({ x: 252, y: 50, w: 84, h: 36, label: "softmax", tone: "now" });

      b += S.tag(360, 26, "Without scaling");
      for (i = 0; i < 6; i++) {
        b += S.bar({ x: 360 + i * 22, y: 76 - (i === 2 ? 40 : 4), w: 15, h: (i === 2 ? 40 : 4), tone: "alaap" });
      }
      b += S.text(360, 94, "saturated, gradient \u2248 0", "d-t-s");
      b += S.tag(360, 122, "With scaling");
      var hs = [10, 18, 26, 20, 13, 9];
      for (i = 0; i < 6; i++) {
        b += S.bar({ x: 360 + i * 22, y: 168 - hs[i], w: 15, h: hs[i], tone: "sys" });
      }
      b += S.text(360, 186, "spread, still learning", "d-t-s");
      return S.frame(600, 196, b);
    }
  };

  DIA.embed = {
    title: "Nobody puts the meaning in. It falls out of the objective.",
    cap: "<b>Where the numbers come from.</b> An embedding table starts as random numbers, one row per token, and those rows are parameters like any other. Gradient descent on the task drags rows that behave alike in the task toward each other. Structure appears because the objective rewards it, not because anyone encoded it.",
    svg: function () {
      var b = "", i;
      b += S.tag(0, 14, "At initialisation");
      b += S.box({ x: 0, y: 24, w: 210, h: 130, tone: "flat" });
      var r1 = [[40, 60], [150, 48], [90, 120], [170, 110], [60, 96], [120, 74]];
      for (i = 0; i < r1.length; i++) {
        b += '<circle cx="' + r1[i][0] + '" cy="' + r1[i][1] + '" r="5" class="d-fill-req d-str-req" stroke-width="1"/>';
      }
      b += S.arrow(222, 90, 286, 90, { label: "training" });
      b += S.tag(300, 14, "After training");
      b += S.box({ x: 300, y: 24, w: 210, h: 130, tone: "flat" });
      var r2 = [[356, 60], [372, 52], [364, 72], [456, 112], [470, 104], [444, 122]];
      for (i = 0; i < r2.length; i++) {
        b += '<circle cx="' + r2[i][0] + '" cy="' + r2[i][1] + '" r="5" class="d-fill-sys d-str-sys" stroke-width="1"/>';
      }
      b += S.text(348, 100, "tokens used alike", "d-t-s");
      b += S.text(408, 146, "sit near each other", "d-t-s");
      return S.frame(600, 166, b);
    }
  };

  DIA.nyquist = {
    title: "A waveform is a list of pressure readings, taken at some rate",
    cap: "<b>Nyquist.</b> A sample rate of N represents frequencies up to N/2 and nothing above. Analysing audio at the wrong assumed rate shifts every frequency you measure by that ratio — which is exactly how a project juggling 16k, 22.05k, 24k and 44.1k ends up with a result that reverses once the rate is fixed.",
    svg: function () {
      var b = "", i, x, y;
      b += S.path("M0,80 C40,20 80,140 120,80 C160,20 200,140 240,80 C280,20 320,140 360,80", "sys");
      for (i = 0; i <= 18; i++) {
        x = i * 20;
        y = 80 - 52 * Math.sin(i * 20 / 120 * Math.PI);
        b += '<circle cx="' + x + '" cy="' + y.toFixed(1) + '" r="2.6" class="d-fill-now d-str-now" stroke-width="1"/>';
      }
      b += S.text(0, 132, "samples, taken at a fixed rate", "d-t-s");
      b += S.text(400, 46, "rate N \u2192 frequencies up to N/2", "d-t-b");
      b += S.text(400, 70, "sample too slowly and the", "d-t-s");
      b += S.text(400, 86, "high end is not merely lost,", "d-t-s");
      b += S.text(400, 102, "it comes back as something else.", "d-t-s");
      return S.frame(600, 142, b);
    }
  };

  DIA.source = {
    title: "Change the buzz and it is the same person. Change the tube and it is not.",
    cap: "<b>The source-filter split.</b> The vocal folds produce a buzz at F0 — that is the source, and it carries pitch. The vocal tract is a tube that resonates at certain frequencies — those are the formants, and they carry identity. Every measurement in Alaap sits on one side of this split, which is why a measure that leaks across it fails to separate anything.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 40, w: 104, h: 48, label: "vocal folds", sub: "buzz at F0", tone: "req" });
      b += S.arrow(108, 64, 148, 64, { label: "source" });
      b += S.box({ x: 152, y: 40, w: 118, h: 48, label: "vocal tract", sub: "resonant tube", tone: "sys" });
      b += S.arrow(274, 64, 314, 64, { label: "filter" });
      b += S.box({ x: 318, y: 40, w: 104, h: 48, label: "voice", tone: "now" });
      b += S.text(0, 120, "pitch lives here", "d-t-s");
      b += S.text(152, 120, "identity lives here", "d-t-b");
      b += S.text(0, 150, "f0_mean measures the source. Formants and vocal-tract length measure the filter.", "d-t-s");
      b += S.text(0, 168, "A measure that mixes the two cannot separate speakers.", "d-t-s");
      return S.frame(600, 178, b);
    }
  };

  DIA.arc = {
    title: "Milestone 1, in one picture",
    cap: "<b>Systems leads, mathematics runs underneath, Alaap stays warm.</b> The systems track moves outward from vocabulary to scale to failure. The mathematics track climbs deliberately toward one target: being ready for TrenTorch. They meet at the gate.",
    svg: function () {
      var b = "", i;
      var weeks = ["Words", "Partitioning", "Storage", "Failure", "Caching"];
      var math = ["Logs", "Derivatives", "Vectors", "Gradients", "Probability"];
      for (i = 0; i < 5; i++) {
        var x = i * 112;
        b += S.box({ x: x, y: 26, w: 96, h: 40, label: weeks[i], tone: "sys" });
        b += S.box({ x: x, y: 96, w: 96, h: 40, label: math[i], tone: "math" });
        b += S.text(x + 48, 16, "wk " + (i + 1), "d-t-x", "middle");
        if (i < 4) {
          b += S.arrow(x + 100, 46, x + 108, 46, {});
          b += S.arrow(x + 100, 116, x + 108, 116, {});
        }
      }
      b += S.arrow(564, 46, 580, 76, {});
      b += S.arrow(564, 116, 580, 90, {});
      b += S.box({ x: 520, y: 156, w: 120, h: 38, label: "the gate", tone: "now" });
      b += S.arrow(580, 96, 580, 152, {});
      b += S.text(0, 178, "Alaap: orientation, sampling, source-filter \u2014 four hours in total, spread across the five weeks.", "d-t-s");
      b += S.text(0, 196, "DSA: deliberately zero until milestone 2.", "d-t-s");
      return S.frame(660, 206, b);
    }
  };

  DIA.eigen = {
    title: "Most vectors get turned. An eigenvector only gets stretched.",
    cap: "<b>The definition is geometric before it is algebraic.</b> Apply the transformation to any vector and it generally lands somewhere off its original line. An eigenvector is one of the rare vectors that stays on its own line: direction kept, length multiplied by the eigenvalue. That is the whole content of <i>Av = &#955;v</i>, and it is why the null-space answer, although it is a true fact about <i>A - &#955;I</i>, is the answer to a different question.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "An ordinary vector");
      b += S.axes(30, 24, 170, 130, "", "");
      b += '<path d="M30,154 L140,64" class="d-str-flat" stroke-width="1.75"/>';
      b += S.arrow(30, 154, 140, 64, {});
      b += S.arrow(30, 154, 176, 116, { dash: true });
      b += S.text(146, 60, "v", "d-t-b");
      b += S.text(180, 114, "Av", "d-t-b");
      b += S.text(30, 182, "Off its line. Turned.", "d-t-s");

      b += S.tag(268, 14, "An eigenvector");
      b += S.axes(298, 24, 170, 130, "", "");
      b += S.arrow(298, 154, 368, 94, {});
      b += S.arrow(298, 154, 438, 34, { dash: true });
      b += S.text(360, 104, "v", "d-t-b");
      b += S.text(444, 32, "Av = λv", "d-t-b");
      b += S.text(298, 182, "Same line. Scaled by λ.", "d-t-s");
      return S.frame(560, 196, b);
    }
  };

  DIA.overfit = {
    title: "The moment the two curves part is the whole diagnosis.",
    cap: "<b>Training loss falling is not evidence of anything.</b> It falls for a model that is learning and for one that is memorising, and the two look identical until validation loss turns. Every intervention is a different way of delaying or detecting that turn: early stopping reads it off the chart, regularisation flattens the climb, more data moves it right, and a smaller model never gets there. Naming the intervention is easy. Saying which part of this picture it acts on is the answer.",
    svg: function () {
      var b = "", i, x, y;
      b += S.axes(46, 20, 330, 150, "epochs", "loss");
      var tr = "M46,44";
      for (i = 1; i <= 33; i++) {
        x = 46 + i * 10;
        y = 44 + 110 * (1 - Math.exp(-i / 7));
        tr += " L" + x.toFixed(0) + "," + y.toFixed(1);
      }
      b += S.path(tr, "sys");
      var va = "M46,40";
      for (i = 1; i <= 33; i++) {
        x = 46 + i * 10;
        y = 40 + 78 * (1 - Math.exp(-i / 6)) - Math.max(0, (i - 13)) * 2.6;
        va += " L" + x.toFixed(0) + "," + y.toFixed(1);
      }
      b += S.path(va, "mark", true);
      var bx = 46 + 13 * 10;
      b += '<line x1="' + bx + '" y1="24" x2="' + bx + '" y2="170" class="d-str-flat" stroke-width="1" stroke-dasharray="3 4"/>';
      b += S.text(bx + 6, 36, "stop here", "d-t-b");
      b += S.text(390, 130, "training", "d-t-s");
      b += S.text(390, 62, "validation", "d-t-s");
      b += S.text(390, 78, "turns upward", "d-t-s");
      return S.frame(500, 186, b);
    }
  };

  DIA.passk = {
    title: "One good run is not evidence. Eight are.",
    cap: "<b>pass@k asks whether the agent ever succeeds. pass^k asks whether it always does.</b> On tau-retail the paper reports its own result as bounds, and those bounds are the argument: under half the tasks pass a single trial, and under a quarter pass all eight. Nothing about the agent changed between the two bars. The only thing that changed is how many times it was asked, and that is the difference between a demo and a product. This is also the case for a replay bench: a recorded trajectory that passes once has told you almost nothing.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "gpt-4o on tau-retail, as the paper states it");
      b += S.axes(52, 30, 300, 150, "", "tasks passed");

      /* the bounds the paper gives, drawn as bounds */
      var y50 = 30 + 150 * 0.5, y25 = 30 + 150 * 0.75;
      b += '<line x1="52" y1="' + y50 + '" x2="352" y2="' + y50 +
        '" class="d-str-flat" stroke-width="1" stroke-dasharray="3 4"/>';
      b += '<line x1="52" y1="' + y25 + '" x2="352" y2="' + y25 +
        '" class="d-str-flat" stroke-width="1" stroke-dasharray="3 4"/>';
      b += S.text(48, y50 + 4, "50%", "d-t-x", "end");
      b += S.text(48, y25 + 4, "25%", "d-t-x", "end");

      b += S.bar({ x: 96, y: y50 + 4, w: 74, h: 180 - y50 - 4, tone: "iv" });
      b += S.text(133, y50 - 6, "under 50%", "d-t-b", "middle");
      b += S.text(133, 196, "pass^1", "d-t-s", "middle");

      b += S.bar({ x: 234, y: y25 + 4, w: 74, h: 180 - y25 - 4, tone: "mark" });
      b += S.text(271, y25 - 6, "under 25%", "d-t-b", "middle");
      b += S.text(271, 196, "pass^8", "d-t-s", "middle");

      b += S.arrow(180, y50 + 12, 226, y25 - 2, { curve: 16 });

      b += S.text(380, 46, "Same agent.", "d-t-b");
      b += S.text(380, 62, "Same tasks.", "d-t-s");
      b += S.text(380, 78, "Asked eight times", "d-t-s");
      b += S.text(380, 94, "instead of once.", "d-t-s");
      b += S.text(380, 122, "The gap is the", "d-t-s");
      b += S.text(380, 138, "reliability nobody", "d-t-s");
      b += S.text(380, 154, "measures.", "d-t-b");
      return S.frame(560, 210, b);
    }
  };

  DIA.oxusFrame = {
    title: "Thirty-five minutes, and where the twelve that matter go",
    cap: "<b>The hard part takes a third of the clock, and you choose it.</b> Requirements come before boxes precisely because they decide which deep dive earns those twelve minutes; for Oxus it is grounding, which is how the system knows a cited value really sits on that page. The last two minutes are not a summary. They are what you would build first, which is the thing a founding-engineer interview is actually measuring. <b>If she cuts in, follow her.</b> The shape is for when she does not.",
    svg: function () {
      var rows = [
        ["Clarify", "who the user is, the unit of work, what done means", 4, "flat"],
        ["Requirements", "the non-functional ones first", 4, "sys"],
        ["Happy path", "end to end, no depth yet", 8, "sys"],
        ["The hard part", "grounding: citation, verification, insufficient", 12, "iv"],
        ["Failure and evaluation", "answered before she asks", 5, "sys"],
        ["What you would build first", "the founding-engineer answer", 2, "now"]
      ];
      var b = S.tag(0, 12, "The thirty-five minutes");
      var y = 26, i, r;
      for (i = 0; i < rows.length; i++) {
        r = rows[i];
        b += S.text(0, y + 14, r[0], "d-t-b");
        b += S.text(0, y + 28, r[1], "d-t-s");
        b += S.bar({ x: 250, y: y + 3, w: r[2] * 23, h: 18, tone: r[3] });
        b += S.text(250 + r[2] * 23 + 8, y + 17, r[2] + " min", "d-t-s");
        y += 40;
      }
      return S.frame(600, y + 6, b);
    }
  };

  DIA.oxusControl = {
    title: "Testing one control: code owns the facts, the model owns the prose",
    cap: "<b>Blue is deterministic code, ochre is the model.</b> Sample selection is seeded code so the workpaper can be reproduced. The model reads evidence only through opaque handles and must cite one for every claim. A verifier then checks that the cited span actually contains the value, and fails closed. Exceptions are computed from attribute results by code, so the model cannot write \"effective\" over an exception. The model's job is the narrative a reviewer reads.",
    svg: function () {
      var b = "", i;
      var r1 = [["Control", "definition", "flat"], ["Population", "pulled by query", "sys"],
        ["Sample", "seeded, stored", "sys"], ["Evidence", "chunks as E1..En", "sys"]];
      for (i = 0; i < r1.length; i++) {
        b += S.box({ x: i * 150, y: 22, w: 126, h: 44, label: r1[i][0], sub: r1[i][1], tone: r1[i][2] });
        if (i < r1.length - 1) { b += S.arrow(i * 150 + 128, 44, i * 150 + 148, 44, {}); }
      }
      b += S.arrow(513, 68, 60, 108, { curve: -10 });
      var r2 = [["Attribute test", "cites handles", "req"], ["Verify", "span holds value", "sys"],
        ["Exceptions", "computed", "sys"], ["Draft", "narrative only", "req"], ["Reviewer", "signs off", "now"]];
      for (i = 0; i < r2.length; i++) {
        b += S.box({ x: i * 128, y: 112, w: 112, h: 44, label: r2[i][0], sub: r2[i][1], tone: r2[i][2] });
        if (i < r2.length - 1) { b += S.arrow(i * 128 + 114, 134, i * 128 + 126, 134, {}); }
      }
      b += S.arrow(184, 110, 52, 110, { curve: 22, label: "fail closed", dash: true });
      b += S.bar({ x: 0, y: 186, w: 12, h: 12, tone: "sys" });
      b += S.text(18, 196, "deterministic code", "d-t-s");
      b += S.bar({ x: 140, y: 186, w: 12, h: 12, tone: "req" });
      b += S.text(158, 196, "model", "d-t-s");
      b += S.text(230, 196, "Every model call and reviewer decision lands in the audit log.", "d-t-s");
      return S.frame(640, 206, b);
    }
  };

  DIA.oxusIngest = {
    title: "If coordinates are lost at parse time, citations are impossible later",
    cap: "<b>The normalised document model is the design.</b> Every source type is parsed into spans that carry where they came from: document, page, bounding box, and for recordings a timestamp, plus a confidence from the parser. Tables stay tables. Retrieval is per tenant and hybrid, because invoice numbers, amounts and dates have to match exactly, which dense embeddings are bad at. Everything downstream cites these coordinates.",
    svg: function () {
      var b = "", i;
      var src = ["Native PDF", "Scanned PDF", "Spreadsheet", "ERP screenshot", "Walkthrough call"];
      var how = ["text layer", "OCR + layout", "cells", "OCR + layout", "transcript"];
      for (i = 0; i < src.length; i++) {
        b += S.box({ x: 0, y: 8 + i * 38, w: 120, h: 30, label: src[i], tone: "flat" });
        b += S.arrow(122, 23 + i * 38, 160, 23 + i * 38, {});
        b += S.box({ x: 164, y: 8 + i * 38, w: 100, h: 30, label: how[i], tone: "sys" });
        b += S.arrow(266, 23 + i * 38, 300, 100, {});
      }
      b += S.box({ x: 304, y: 64, w: 150, h: 72, label: "Normalised spans", sub: "doc, page, bbox, time, conf", tone: "req" });
      b += S.arrow(456, 100, 492, 100, {});
      b += S.box({ x: 496, y: 64, w: 132, h: 72, label: "Per-tenant index", sub: "lexical + dense", tone: "now" });
      b += S.text(304, 160, "low OCR confidence travels forward", "d-t-s");
      b += S.text(304, 176, "and can force an insufficient result", "d-t-s");
      return S.frame(640, 200, b);
    }
  };

  DIA.oxusKB = {
    title: "Year over year, the risk lives in what changed",
    cap: "<b>Version the process graph and diff it.</b> Last year's walkthrough produced a graph of steps, actors, systems and controls, each node cited to a timestamp in the recording. This year's is built the same way. The diff is the valuable output: a new approver, a system swapped, a manual step appearing where there used to be an automated one. Those are exactly the places an auditor should look first.",
    svg: function () {
      var b = "";
      b += S.tag(0, 14, "Prior year");
      b += S.box({ x: 0, y: 26, w: 92, h: 30, label: "Request", tone: "sys" });
      b += S.arrow(94, 41, 116, 41, {});
      b += S.box({ x: 118, y: 26, w: 92, h: 30, label: "Approve", sub: "", tone: "sys" });
      b += S.arrow(212, 41, 234, 41, {});
      b += S.box({ x: 236, y: 26, w: 92, h: 30, label: "Post", tone: "sys" });
      b += S.tag(0, 96, "This year");
      b += S.box({ x: 0, y: 108, w: 92, h: 30, label: "Request", tone: "sys" });
      b += S.arrow(94, 123, 116, 123, {});
      b += S.box({ x: 118, y: 108, w: 92, h: 30, label: "Approve", tone: "sys" });
      b += S.arrow(212, 123, 234, 123, {});
      b += S.box({ x: 236, y: 108, w: 92, h: 30, label: "Manual edit", tone: "alaap" });
      b += S.arrow(330, 123, 352, 123, {});
      b += S.box({ x: 354, y: 108, w: 92, h: 30, label: "Post", tone: "sys" });
      b += S.arrow(282, 142, 470, 170, { dash: true });
      b += S.box({ x: 472, y: 150, w: 156, h: 40, label: "Flag for the auditor", sub: "new manual step", tone: "now" });
      return S.frame(640, 200, b);
    }
  };

  DIA.zenEffects = {
    title: "Replay policy follows what a tool call does to the world",
    cap: "<b>Classify the call, then pick the policy.</b> Reads can be answered from the recording. Idempotent writes can go through a ledger keyed on session, step and canonical arguments, so a repeat is harmless. Calls with an external effect — an email, a refund — must never pass through by default on a forked replay. A new one the recording never saw either goes to a dry-run adapter or fails loudly. A silent live call is both a real side effect and a hidden false pass.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 86, w: 104, h: 40, label: "Tool call", tone: "flat" });
      b += S.arrow(106, 100, 176, 36, {});
      b += S.arrow(106, 106, 176, 106, {});
      b += S.arrow(106, 112, 176, 176, {});
      b += S.box({ x: 180, y: 16, w: 150, h: 40, label: "Read", sub: "no effect", tone: "sys" });
      b += S.box({ x: 180, y: 86, w: 150, h: 40, label: "Idempotent write", sub: "safe to repeat", tone: "math" });
      b += S.box({ x: 180, y: 156, w: 150, h: 40, label: "External effect", sub: "email, refund", tone: "alaap" });
      b += S.arrow(332, 36, 372, 36, {});
      b += S.arrow(332, 106, 372, 106, {});
      b += S.arrow(332, 176, 372, 176, {});
      b += S.text(378, 32, "answer from the recording", "d-t-b");
      b += S.text(378, 48, "on a miss: explicit on_miss policy", "d-t-s");
      b += S.text(378, 102, "ledger, keyed on session + step + args", "d-t-b");
      b += S.text(378, 118, "a repeat returns the stored result", "d-t-s");
      b += S.text(378, 172, "never passthrough on a fork", "d-t-b");
      b += S.text(378, 188, "dry-run adapter, or fail loudly", "d-t-s");
      return S.frame(640, 206, b);
    }
  };

  DIA.multiturn = {
    title: "When the agent's reply changes, the recorded user stops making sense",
    cap: "<b>The hybrid.</b> Replay recorded user turns while the agent's replies stay equivalent to the recording. At the first real divergence, hand the user side to a simulator conditioned on the goal extracted from the original session, and hold that simulator fixed across baseline and fork so it is a controlled variable rather than a second thing that changed. Calibrate it first: run it against the unchanged baseline and check it reproduces the recorded user turns.",
    svg: function () {
      var b = "", i;
      b += S.tag(0, 14, "Recorded session");
      var rec = ["U1", "A1", "U2", "A2", "U3", "A3"];
      for (i = 0; i < rec.length; i++) {
        b += S.box({ x: i * 72, y: 24, w: 56, h: 30, label: rec[i], tone: i % 2 ? "sys" : "flat" });
      }
      b += S.tag(0, 90, "Forked replay");
      b += S.box({ x: 0, y: 100, w: 56, h: 30, label: "U1", tone: "flat" });
      b += S.box({ x: 72, y: 100, w: 56, h: 30, label: "A1\u2032", tone: "alaap" });
      b += S.text(72, 146, "diverges", "d-t-s");
      b += S.box({ x: 144, y: 100, w: 56, h: 30, label: "U2", tone: "flat", dash: true });
      b += S.text(144, 146, "no longer fits", "d-t-s");
      b += S.arrow(172, 132, 250, 170, {});
      b += S.box({ x: 254, y: 152, w: 150, h: 40, label: "Simulated user", sub: "goal from session", tone: "now" });
      b += S.arrow(406, 172, 446, 172, {});
      b += S.box({ x: 450, y: 152, w: 56, h: 40, label: "U2\u2032", tone: "req" });
      b += S.arrow(508, 172, 530, 172, {});
      b += S.box({ x: 532, y: 152, w: 56, h: 40, label: "A2\u2032", tone: "sys" });
      return S.frame(640, 202, b);
    }
  };

  /* ZenML round 3: your bench, the backend questions, and Kitaru's replay. */
  DIA.benchLoop = {
    title: "The bench: production failures become regression cases",
    cap: "<b>Every case starts as a real failure.</b> The scanner's cheap signals over-fire, so a judge calibrated on hand labels keeps the real ones; a fix is promoted into the bench without duplicates; the real agent replays each case against its snapshot and is scored on tool calls per completed task and assertions against the snapshot.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 20, w: 120, h: 44, label: "Production", sub: "real conversations", tone: "flat" });
      b += S.arrow(122, 42, 156, 42, {});
      b += S.box({ x: 160, y: 20, w: 130, h: 44, label: "Scanner", sub: "12 failure signals", tone: "req" });
      b += S.arrow(292, 42, 326, 42, {});
      b += S.box({ x: 330, y: 20, w: 130, h: 44, label: "LLM judge", sub: "about 3 in 4 real", tone: "req" });
      b += S.arrow(462, 42, 496, 42, {});
      b += S.box({ x: 500, y: 20, w: 140, h: 44, label: "Fix, then promote", sub: "reconciler dedupes", tone: "sys" });
      b += S.arrow(570, 66, 570, 124, {});
      b += S.box({ x: 500, y: 128, w: 140, h: 44, label: "Bench", sub: "100+ cases", tone: "math" });
      b += S.arrow(498, 150, 464, 150, {});
      b += S.box({ x: 330, y: 128, w: 130, h: 44, label: "Replay", sub: "real agent, snapshot", tone: "sys" });
      b += S.arrow(328, 150, 294, 150, {});
      b += S.box({ x: 160, y: 128, w: 130, h: 44, label: "Score", sub: "tool calls per task", tone: "math" });
      b += S.arrow(158, 150, 124, 150, {});
      b += S.box({ x: 0, y: 128, w: 120, h: 44, label: "Sign-off", sub: "the rewrite shipped", tone: "now" });
      return S.frame(640, 182, b);
    }
  };

  DIA.harnessSeam = {
    title: "Swap the provider, not the tool",
    cap: "<b>The tool body runs for real.</b> Ranking, filtering and shaping are production code in every replay. Only the call across the provider boundary is routed, by a harness flag, to the case's SQLite snapshot, which answers in the provider's shape. Most bugs lived in the seam between tool output and the model, so that seam stays real.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 78, w: 100, h: 44, label: "Agent", tone: "flat" });
      b += S.arrow(102, 100, 136, 100, {});
      b += S.box({ x: 140, y: 78, w: 180, h: 44, label: "Tool body, runs for real", sub: "ranking, filtering, shaping", tone: "sys" });
      b += S.arrow(322, 100, 356, 100, {});
      b += S.box({ x: 360, y: 78, w: 130, h: 44, label: "Provider boundary", tone: "req" });
      b += S.arrow(492, 92, 526, 42, { dash: true });
      b += S.arrow(492, 108, 526, 158, {});
      b += S.box({ x: 530, y: 20, w: 110, h: 44, label: "Gmail, calendar", sub: "production only", tone: "flat", dash: true });
      b += S.box({ x: 530, y: 136, w: 110, h: 44, label: "SQLite snapshot", sub: "harness flag on", tone: "math" });
      return S.frame(640, 190, b);
    }
  };

  DIA.missFlow = {
    title: "A replay miss, made productive",
    cap: "<b>A miss is information: the agent's behaviour changed.</b> Instead of killing the run, show the recorded call beside what the new agent tried, and let one command accept the variant as equivalent. That writes a static alias, so the next replay hits, and every accepted pair is a labelled example for anything automatic later.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 78, w: 120, h: 44, label: "Replayed call", tone: "flat" });
      b += S.arrow(122, 100, 156, 100, {});
      b += S.box({ x: 160, y: 78, w: 120, h: 44, label: "Look up by key", tone: "sys" });
      b += S.arrow(282, 92, 326, 42, { label: "hit" });
      b += S.arrow(282, 108, 326, 158, { label: "miss" });
      b += S.box({ x: 330, y: 20, w: 150, h: 44, label: "Recorded result", tone: "math" });
      b += S.box({ x: 330, y: 136, w: 150, h: 44, label: "Diff", sub: "recorded against tried", tone: "req" });
      b += S.arrow(482, 158, 506, 158, {});
      b += S.box({ x: 510, y: 136, w: 130, h: 44, label: "Accept as equal", sub: "writes a static alias", tone: "sys" });
      b += S.arrow(575, 134, 484, 50, { dash: true, label: "next run hits" });
      return S.frame(640, 190, b);
    }
  };

  DIA.completeness = {
    title: "Assert against ground truth you hold",
    cap: "<b>The snapshot knows the answer's size.</b> Because you own the fixture, you know how many financial events fall in the window, so the case can assert that every one appears. A pinned expected answer only checks shape; this caught the ledger that looked right and left out two refunds. It works only when the answer is enumerable from the fixture.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 20, w: 200, h: 44, label: "Snapshot", sub: "N financial events in the window", tone: "math" });
      b += S.box({ x: 0, y: 116, w: 200, h: 44, label: "Agent's ledger", sub: "clean, well formed, N − 2 events", tone: "sys" });
      b += S.arrow(202, 42, 256, 82, {});
      b += S.arrow(202, 138, 256, 98, {});
      b += S.box({ x: 260, y: 68, w: 180, h: 44, label: "Assert every event appears", tone: "req" });
      b += S.arrow(442, 90, 476, 90, {});
      b += S.box({ x: 480, y: 68, w: 160, h: 44, label: "Fails", sub: "two refunds missing", tone: "alaap" });
      return S.frame(640, 170, b);
    }
  };

  DIA.sqliteTemplate = {
    title: "One snapshot per case: a SQLite file or a template database",
    cap: "<b>Both give each case its own copy; only one is the production engine.</b> A SQLite file is trivial to copy and inspect, but it tests agent behaviour, not database behaviour: no row-level security, different type affinity. CREATE DATABASE ... TEMPLATE clones a Postgres database per case on the real engine, at the cost of a server in the test path.",
    svg: function () {
      var b = "";
      b += S.text(0, 14, "What you built", "d-t-x");
      b += S.box({ x: 0, y: 22, w: 120, h: 44, label: "Base snapshot", tone: "flat" });
      b += S.arrow(122, 44, 296, 44, { label: "copy the file" });
      b += S.box({ x: 300, y: 22, w: 140, h: 44, label: "case.sqlite", sub: "fast, no server", tone: "math" });
      b += S.arrow(442, 44, 466, 44, {});
      b += S.box({ x: 470, y: 22, w: 170, h: 44, label: "Not the real engine", sub: "no RLS, other type rules", tone: "alaap" });
      b += S.text(0, 116, "What you would build today", "d-t-x");
      b += S.box({ x: 0, y: 124, w: 120, h: 44, label: "Template database", tone: "flat" });
      b += S.arrow(122, 146, 296, 146, { label: "CREATE DATABASE ... TEMPLATE" });
      b += S.box({ x: 300, y: 124, w: 140, h: 44, label: "case database", sub: "real Postgres", tone: "sys" });
      b += S.arrow(442, 146, 466, 146, {});
      b += S.box({ x: 470, y: 124, w: 170, h: 44, label: "Costs a server", sub: "in the test path", tone: "req" });
      return S.frame(640, 178, b);
    }
  };

  DIA.skipLocked = {
    title: "Claiming a Postgres queue without two workers colliding",
    cap: "<b>FOR UPDATE SKIP LOCKED lets each worker take rows nobody holds.</b> Worker 1 locks its rows; worker 2 skips them instead of waiting. A cron drain's worst case is its interval, so the drain is triggered on the event (about ninety seconds down to about three) and cron stays as the backstop.",
    svg: function () {
      var b = "", i;
      for (i = 0; i < 5; i++) {
        b += S.box({ x: 250, y: 18 + i * 32, w: 120, h: 26, label: "job " + (i + 1), tone: i < 2 ? "sys" : i < 4 ? "math" : "flat" });
      }
      b += S.box({ x: 0, y: 24, w: 150, h: 44, label: "Worker 1", sub: "locks jobs 1 and 2", tone: "sys" });
      b += S.arrow(152, 40, 246, 31, {});
      b += S.arrow(152, 52, 246, 63, {});
      b += S.box({ x: 0, y: 108, w: 150, h: 44, label: "Worker 2", sub: "skips to 3 and 4", tone: "math" });
      b += S.arrow(152, 124, 246, 95, {});
      b += S.arrow(152, 136, 246, 127, {});
      b += S.box({ x: 470, y: 24, w: 170, h: 44, label: "Event trigger", sub: "drain now, about 3 s", tone: "req" });
      b += S.arrow(468, 46, 374, 46, {});
      b += S.box({ x: 470, y: 108, w: 170, h: 44, label: "Cron", sub: "the backstop, kept", tone: "flat", dash: true });
      b += S.arrow(468, 130, 374, 130, { dash: true });
      return S.frame(640, 184, b);
    }
  };

  DIA.definerGrant = {
    title: "SECURITY DEFINER plus the default grant",
    cap: "<b>A function that deliberately bypasses row-level security was callable by everyone.</b> SECURITY DEFINER runs as the function's owner, which is how it sees past RLS to do its job; Postgres grants EXECUTE to PUBLIC on a new function by default. The fix is the class, not the instance: revoke from PUBLIC, grant to the one role that needs it, and test that no definer function keeps a PUBLIC grant.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 30, w: 130, h: 44, label: "Any signed-in user", tone: "flat" });
      b += S.arrow(132, 52, 246, 52, { label: "EXECUTE via PUBLIC" });
      b += S.text(189, 84, "the default on a new function", "d-t-x", "middle");
      b += S.box({ x: 250, y: 30, w: 180, h: 44, label: "SECURITY DEFINER function", sub: "runs as its owner", tone: "req" });
      b += S.arrow(432, 52, 466, 52, {});
      b += S.box({ x: 470, y: 30, w: 170, h: 44, label: "Every user's rows", sub: "RLS bypassed", tone: "alaap" });
      b += S.box({ x: 250, y: 118, w: 390, h: 44, label: "REVOKE EXECUTE ... FROM PUBLIC; GRANT to one role", sub: "and a test that no definer function keeps a PUBLIC grant", tone: "math" });
      return S.frame(640, 172, b);
    }
  };

  DIA.zenmlStack = {
    title: "ZenML's working vocabulary: steps, artifacts, pipelines, stacks",
    cap: "<b>A pipeline is steps; steps pass artifacts; a stack decides where it all runs.</b> Each step's outputs are stored as versioned artifacts with lineage, so a run can be traced and reused. The same pipeline code runs on a different stack by swapping components such as the orchestrator and the artifact store.",
    svg: function () {
      var b = "";
      b += S.text(0, 12, "Pipeline", "d-t-x");
      b += S.box({ x: 0, y: 20, w: 130, h: 40, label: "step: load", tone: "sys" });
      b += S.arrow(132, 40, 166, 40, {});
      b += S.box({ x: 170, y: 20, w: 130, h: 40, label: "step: train", tone: "sys" });
      b += S.arrow(302, 40, 336, 40, {});
      b += S.box({ x: 340, y: 20, w: 130, h: 40, label: "step: evaluate", tone: "sys" });
      b += S.arrow(65, 62, 65, 96, {});
      b += S.arrow(235, 62, 235, 96, {});
      b += S.arrow(405, 62, 405, 96, {});
      b += S.box({ x: 0, y: 100, w: 130, h: 40, label: "dataset v3", sub: "artifact", tone: "math" });
      b += S.box({ x: 170, y: 100, w: 130, h: 40, label: "model v7", sub: "artifact", tone: "math" });
      b += S.box({ x: 340, y: 100, w: 130, h: 40, label: "metrics", sub: "artifact", tone: "math" });
      b += S.box({ x: 510, y: 20, w: 130, h: 120, label: "Stack", sub: "orchestrator, artifact store", tone: "req" });
      b += S.arrow(508, 80, 474, 80, { label: "runs on" });
      return S.frame(640, 150, b);
    }
  };

  DIA.forkReplay = {
    title: "Faithful baseline, then fork with one override",
    cap: "<b>Change one thing and compare against a baseline that reproduces the recording.</b> The baseline answers every tool from history, so it should reproduce the session; the fork changes one input, such as the prompt or the model, and the same evaluators score both runs. A difference is then attributable to the one change.",
    svg: function () {
      var b = "";
      b += S.box({ x: 0, y: 78, w: 130, h: 44, label: "Recorded session", tone: "flat" });
      b += S.arrow(132, 92, 176, 42, {});
      b += S.arrow(132, 108, 176, 158, {});
      b += S.box({ x: 180, y: 20, w: 180, h: 44, label: "Baseline replay", sub: "every tool from history", tone: "math" });
      b += S.box({ x: 180, y: 136, w: 180, h: 44, label: "Fork", sub: "one override: prompt or model", tone: "req" });
      b += S.arrow(362, 42, 406, 92, {});
      b += S.arrow(362, 158, 406, 108, {});
      b += S.box({ x: 410, y: 78, w: 120, h: 44, label: "Evaluators", sub: "score both runs", tone: "sys" });
      b += S.arrow(532, 100, 556, 100, {});
      b += S.box({ x: 560, y: 78, w: 80, h: 44, label: "Verdict", tone: "now" });
      return S.frame(640, 190, b);
    }
  };

  /* Kitaru, from the teardown (E:/kitaru/kitaru-teardown.html), drawn as static svg. */
  DIA.kitaruPlanes = {
    title: "The server never runs your code",
    cap: "The server never executes user code — a claim the source backs. Everything inside the right-hand boundary is an ordinary process on your machine. Note the two arrows leaving the agent subprocess: teal goes back to Kitaru for recorded tool results, orange goes to the model provider and is never replayed.",
    fixed: true,
    svg: function () { return "<svg viewBox=\"0 0 960 470\" role=\"img\" aria-label=\"Kitaru topology: a coordinating server with Postgres on one side, and on the other a worker in your environment that spawns agent, evaluator and importer subprocesses; the agent subprocess calls the model provider live.\">\n          <defs>\n            <marker id=\"f0-a1\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\">\n              <path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"/>\n            </marker>\n            <marker id=\"f0-a2\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\">\n              <path d=\"M0,0 L10,5 L0,10 z\" fill=\"#B8400A\"/>\n            </marker>\n            <marker id=\"f0-a3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\">\n              <path d=\"M0,0 L10,5 L0,10 z\" fill=\"#0B6B6B\"/>\n            </marker>\n          </defs>\n\n          <!-- control plane -->\n          <rect x=\"16\" y=\"52\" width=\"286\" height=\"330\" rx=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-opacity=\".28\" stroke-dasharray=\"5 4\"/>\n          <text x=\"30\" y=\"40\" font-family=\"IBM Plex Mono, monospace\" font-size=\"12\" fill=\"currentColor\" fill-opacity=\".62\">CONTROL PLANE</text>\n\n          <rect x=\"42\" y=\"82\" width=\"234\" height=\"96\" rx=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/>\n          <text x=\"60\" y=\"110\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"14\" font-weight=\"600\" fill=\"currentColor\">Kitaru server</text>\n          <text x=\"60\" y=\"131\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".7\">REST API &middot; FastAPI</text>\n          <text x=\"60\" y=\"149\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".7\">jobs, tasks, leases</text>\n          <text x=\"60\" y=\"167\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#B8400A\">runs no user code</text>\n\n          <rect x=\"42\" y=\"206\" width=\"234\" height=\"72\" rx=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/>\n          <text x=\"60\" y=\"233\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"14\" font-weight=\"600\" fill=\"currentColor\">Postgres</text>\n          <text x=\"60\" y=\"254\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".7\">sessions &middot; session_nodes</text>\n          <text x=\"60\" y=\"270\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".7\">cache_key is indexed here</text>\n\n          <rect x=\"42\" y=\"300\" width=\"234\" height=\"58\" rx=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/>\n          <text x=\"60\" y=\"325\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"14\" font-weight=\"600\" fill=\"currentColor\">Blob store</text>\n          <text x=\"60\" y=\"345\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".7\">plugins, trace payloads</text>\n\n          <!-- data plane -->\n          <rect x=\"370\" y=\"52\" width=\"574\" height=\"330\" rx=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-opacity=\".28\" stroke-dasharray=\"5 4\"/>\n          <text x=\"384\" y=\"40\" font-family=\"IBM Plex Mono, monospace\" font-size=\"12\" fill=\"currentColor\" fill-opacity=\".62\">YOUR ENVIRONMENT &mdash; your venv, your creds, your network</text>\n\n          <rect x=\"396\" y=\"82\" width=\"200\" height=\"80\" rx=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/>\n          <text x=\"414\" y=\"110\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"14\" font-weight=\"600\" fill=\"currentColor\">Worker</text>\n          <text x=\"414\" y=\"130\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".7\">claim loop, polls</text>\n          <text x=\"414\" y=\"147\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".7\">heartbeat, kill_tree</text>\n\n          <line x1=\"302\" y1=\"118\" x2=\"392\" y2=\"118\" stroke=\"currentColor\" stroke-width=\"1.4\" marker-end=\"url(#f0-a1)\"/>\n          <text x=\"306\" y=\"110\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".72\">claims tasks</text>\n\n          <!-- subprocesses -->\n          <rect x=\"652\" y=\"76\" width=\"266\" height=\"92\" rx=\"7\" fill=\"none\" stroke=\"#B8400A\" stroke-width=\"1.6\"/>\n          <text x=\"670\" y=\"101\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"13.5\" font-weight=\"600\" fill=\"#B8400A\">Agent subprocess</text>\n          <text x=\"670\" y=\"120\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".78\">your registered command</text>\n          <text x=\"670\" y=\"137\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".78\">your cwd, inherited os.environ</text>\n          <text x=\"670\" y=\"156\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".78\">+ adapter hooks in-process</text>\n\n          <rect x=\"652\" y=\"186\" width=\"266\" height=\"52\" rx=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\"/>\n          <text x=\"670\" y=\"210\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"13\" font-weight=\"600\" fill=\"currentColor\">Evaluator subprocess</text>\n          <text x=\"670\" y=\"228\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".7\">uv run, isolated per-plugin env</text>\n\n          <rect x=\"652\" y=\"256\" width=\"266\" height=\"52\" rx=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\"/>\n          <text x=\"670\" y=\"280\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"13\" font-weight=\"600\" fill=\"currentColor\">Importer subprocess</text>\n          <text x=\"670\" y=\"298\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".7\">uv run, isolated per-plugin env</text>\n\n          <line x1=\"598\" y1=\"122\" x2=\"648\" y2=\"122\" stroke=\"currentColor\" stroke-width=\"1.4\" marker-end=\"url(#f0-a1)\"/>\n          <line x1=\"598\" y1=\"130\" x2=\"648\" y2=\"210\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-opacity=\".6\" marker-end=\"url(#f0-a1)\"/>\n          <line x1=\"598\" y1=\"138\" x2=\"648\" y2=\"280\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-opacity=\".6\" marker-end=\"url(#f0-a1)\"/>\n          <text x=\"500\" y=\"182\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".72\">spawns</text>\n\n          <!-- callback -->\n          <path d=\"M 700 168 L 700 402 L 159 402 L 159 282\" fill=\"none\" stroke=\"#0B6B6B\" stroke-width=\"1.6\" marker-end=\"url(#f0-a3)\"/>\n          <text x=\"330\" y=\"418\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">HTTP tool-lookup + node writes, per tool call</text>\n\n          <!-- model provider -->\n          <rect x=\"652\" y=\"330\" width=\"266\" height=\"52\" rx=\"7\" fill=\"none\" stroke=\"#B8400A\" stroke-width=\"1.6\" stroke-dasharray=\"5 3\"/>\n          <text x=\"670\" y=\"354\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"13\" font-weight=\"600\" fill=\"#B8400A\">Model provider</text>\n          <text x=\"670\" y=\"372\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".7\">OpenAI / Anthropic / &hellip;</text>\n          <path d=\"M 785 168 L 785 326\" fill=\"none\" stroke=\"#B8400A\" stroke-width=\"1.6\" marker-end=\"url(#f0-a2)\"/>\n          <text x=\"795\" y=\"250\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#B8400A\">always live</text>\n          <text x=\"795\" y=\"266\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#B8400A\">every replay</text>\n        </svg>"; }
  };
  DIA.kitaruReplay = {
    title: "Replay is one environment variable",
    cap: "The replay trigger is a single environment variable. Isolation is whatever your own process already had — Kitaru adds a timeout and a kill-tree, nothing more.",
    fixed: true,
    svg: function () { return "<svg viewBox=\"0 0 960 560\" role=\"img\" aria-label=\"Step sequence: the worker builds an environment by copying os.environ and injecting Kitaru variables, spawns the agent command, and the in-process adapter intercepts tool execution and calls back to the server.\">\n          <defs>\n            <marker id=\"f1-b1\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\">\n              <path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"/>\n            </marker>\n            <marker id=\"f1-b2\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\">\n              <path d=\"M0,0 L10,5 L0,10 z\" fill=\"#0B6B6B\"/>\n            </marker>\n          </defs>\n\n          <!-- step 1 -->\n          <text x=\"20\" y=\"30\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11.5\" font-weight=\"600\" fill=\"#B8400A\">STEP 1</text>\n          <rect x=\"20\" y=\"42\" width=\"410\" height=\"150\" rx=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\"/>\n          <text x=\"38\" y=\"68\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"14\" font-weight=\"600\" fill=\"currentColor\">build_process_env()</text>\n          <text x=\"38\" y=\"92\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".75\">env = dict(os.environ)      &#8592; inherits everything</text>\n          <text x=\"38\" y=\"110\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".75\">env.update(run_env)</text>\n          <text x=\"38\" y=\"128\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".75\">env.update(extra_env)</text>\n          <text x=\"38\" y=\"146\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".75\">env.update(secret_env)      &#8592; Kitaru secret store</text>\n          <text x=\"38\" y=\"166\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#B8400A\">clear then reset the 4 contract vars</text>\n          <text x=\"38\" y=\"183\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".6\">inherited KITARU_API_KEY is dropped, never restored</text>\n\n          <!-- step 2 -->\n          <text x=\"530\" y=\"30\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11.5\" font-weight=\"600\" fill=\"#B8400A\">STEP 2</text>\n          <rect x=\"530\" y=\"42\" width=\"410\" height=\"150\" rx=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\"/>\n          <text x=\"548\" y=\"68\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"14\" font-weight=\"600\" fill=\"currentColor\">injected into the child</text>\n          <text x=\"548\" y=\"92\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">KITARU_API_URL</text>\n          <text x=\"548\" y=\"110\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">KITARU_API_TOKEN     scoped to one task + attempt</text>\n          <text x=\"548\" y=\"128\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">KITARU_TASK_ID</text>\n          <text x=\"548\" y=\"146\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">KITARU_TASK_INPUTS   only if &#8804; 32 KB</text>\n          <text x=\"548\" y=\"164\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">KITARU_REPLAY_ID     the entire replay trigger</text>\n          <text x=\"548\" y=\"183\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".6\">absent = a normal recording run</text>\n\n          <line x1=\"434\" y1=\"117\" x2=\"526\" y2=\"117\" stroke=\"currentColor\" stroke-width=\"1.4\" marker-end=\"url(#f1-b1)\"/>\n\n          <!-- step 3 -->\n          <text x=\"20\" y=\"232\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11.5\" font-weight=\"600\" fill=\"#B8400A\">STEP 3</text>\n          <rect x=\"20\" y=\"244\" width=\"920\" height=\"96\" rx=\"7\" fill=\"none\" stroke=\"#B8400A\" stroke-width=\"1.6\"/>\n          <text x=\"38\" y=\"270\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"14\" font-weight=\"600\" fill=\"#B8400A\">platform.spawn(command, working_dir, env)</text>\n          <text x=\"38\" y=\"293\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11.5\" fill=\"currentColor\" fill-opacity=\".8\">python -m returns_agent.agent          &#8212; the command you registered, verbatim</text>\n          <text x=\"38\" y=\"313\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11.5\" fill=\"currentColor\" fill-opacity=\".8\">same filesystem &middot; same network &middot; same credentials &middot; same everything</text>\n          <text x=\"38\" y=\"332\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#9E1739\">isolation = process tree + timeout_seconds + kill_tree on teardown. That is the whole list.</text>\n\n          <!-- step 4 -->\n          <text x=\"20\" y=\"382\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11.5\" font-weight=\"600\" fill=\"#B8400A\">STEP 4</text>\n          <rect x=\"20\" y=\"394\" width=\"450\" height=\"140\" rx=\"7\" fill=\"none\" stroke=\"#0B6B6B\" stroke-width=\"1.5\"/>\n          <text x=\"38\" y=\"420\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"14\" font-weight=\"600\" fill=\"#0B6B6B\">the adapter, inside your process</text>\n          <text x=\"38\" y=\"443\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".78\">reads KITARU_REPLAY_ID</text>\n          <text x=\"38\" y=\"461\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".78\">fetches override + tool policy over HTTP</text>\n          <text x=\"38\" y=\"479\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".78\">installs PydanticAI capability hooks:</text>\n          <text x=\"52\" y=\"497\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">wrap_model_request   &#8594; applies overrides</text>\n          <text x=\"52\" y=\"515\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">wrap_tool_execute    &#8594; applies tool policy</text>\n\n          <rect x=\"510\" y=\"394\" width=\"430\" height=\"140\" rx=\"7\" fill=\"none\" stroke=\"#9E1739\" stroke-width=\"1.5\"/>\n          <text x=\"528\" y=\"420\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"14\" font-weight=\"600\" fill=\"#9E1739\">the hole this leaves</text>\n          <text x=\"528\" y=\"444\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".8\">Interception is at the framework&#8217;s tool hook.</text>\n          <text x=\"528\" y=\"462\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".8\">Anything not routed through a registered</text>\n          <text x=\"528\" y=\"480\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".8\">PydanticAI tool is invisible to Kitaru:</text>\n          <text x=\"542\" y=\"500\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#9E1739\">a bare requests.post() hits production</text>\n          <text x=\"542\" y=\"518\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#9E1739\">a direct DB write commits for real</text>\n\n          <line x1=\"245\" y1=\"344\" x2=\"245\" y2=\"390\" stroke=\"currentColor\" stroke-width=\"1.4\" marker-end=\"url(#f1-b1)\"/>\n        </svg>"; }
  };
  DIA.kitaruOrder = {
    title: "Ordered consumption, and when it holds",
    cap: "Ordered consumption exists only under baseline scope, and only for calls that are not concurrent. The Claude Agent SDK adapter documents the concurrency limitation openly; the PydanticAI path has the same shape without the caveat.",
    fixed: true,
    svg: function () { return "<svg viewBox=\"0 0 960 330\" role=\"img\" aria-label=\"Under baseline scope three identical calls consume three recorded results in order; under agent or cohort scope all three calls receive the same newest recorded result.\">\n          <defs>\n            <marker id=\"f2-c1\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#0B6B6B\"/></marker>\n            <marker id=\"f2-c2\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#B8400A\"/></marker>\n          </defs>\n\n          <text x=\"20\" y=\"26\" font-family=\"IBM Plex Mono, monospace\" font-size=\"12\" font-weight=\"600\" fill=\"#0B6B6B\">scope: baseline &mdash; ordered consumption</text>\n          <text x=\"20\" y=\"46\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".62\">find_nth_by_cache_key_in_session &middot; ORDER BY started_at ASC NULLS LAST, id ASC &middot; OFFSET n</text>\n          <rect x=\"20\" y=\"58\" width=\"130\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><text x=\"36\" y=\"80\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\">call #1</text>\n          <rect x=\"20\" y=\"100\" width=\"130\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><text x=\"36\" y=\"122\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\">call #2</text>\n          <rect x=\"20\" y=\"142\" width=\"130\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><text x=\"36\" y=\"164\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\">call #3</text>\n          <line x1=\"154\" y1=\"75\" x2=\"300\" y2=\"75\" stroke=\"#0B6B6B\" stroke-width=\"1.5\" marker-end=\"url(#f2-c1)\"/>\n          <line x1=\"154\" y1=\"117\" x2=\"300\" y2=\"117\" stroke=\"#0B6B6B\" stroke-width=\"1.5\" marker-end=\"url(#f2-c1)\"/>\n          <line x1=\"154\" y1=\"159\" x2=\"300\" y2=\"159\" stroke=\"#0B6B6B\" stroke-width=\"1.5\" marker-end=\"url(#f2-c1)\"/>\n          <text x=\"176\" y=\"68\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"#0B6B6B\">occurrence=0</text>\n          <text x=\"176\" y=\"110\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"#0B6B6B\">occurrence=1</text>\n          <text x=\"176\" y=\"152\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"#0B6B6B\">occurrence=2</text>\n          <rect x=\"304\" y=\"58\" width=\"150\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"#0B6B6B\" stroke-width=\"1.4\"/><text x=\"320\" y=\"80\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">result A</text>\n          <rect x=\"304\" y=\"100\" width=\"150\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"#0B6B6B\" stroke-width=\"1.4\"/><text x=\"320\" y=\"122\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">result B</text>\n          <rect x=\"304\" y=\"142\" width=\"150\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"#0B6B6B\" stroke-width=\"1.4\"/><text x=\"320\" y=\"164\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">result C</text>\n          <text x=\"20\" y=\"206\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#9E1739\">candidate set = completed AND failed &#8212; an ordinal can land on a recorded failure</text>\n\n          <line x1=\"490\" y1=\"20\" x2=\"490\" y2=\"310\" stroke=\"currentColor\" stroke-opacity=\".2\" stroke-width=\"1\"/>\n\n          <text x=\"520\" y=\"26\" font-family=\"IBM Plex Mono, monospace\" font-size=\"12\" font-weight=\"600\" fill=\"#B8400A\">scope: agent | cohort_version &mdash; no consumption</text>\n          <text x=\"520\" y=\"46\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".62\">find_latest_by_cache_key_* &middot; occurrence forced to None &middot; counter never incremented</text>\n          <rect x=\"520\" y=\"58\" width=\"130\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><text x=\"536\" y=\"80\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\">call #1</text>\n          <rect x=\"520\" y=\"100\" width=\"130\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><text x=\"536\" y=\"122\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\">call #2</text>\n          <rect x=\"520\" y=\"142\" width=\"130\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/><text x=\"536\" y=\"164\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\">call #3</text>\n          <line x1=\"654\" y1=\"75\" x2=\"800\" y2=\"112\" stroke=\"#B8400A\" stroke-width=\"1.5\" marker-end=\"url(#f2-c2)\"/>\n          <line x1=\"654\" y1=\"117\" x2=\"800\" y2=\"117\" stroke=\"#B8400A\" stroke-width=\"1.5\" marker-end=\"url(#f2-c2)\"/>\n          <line x1=\"654\" y1=\"159\" x2=\"800\" y2=\"123\" stroke=\"#B8400A\" stroke-width=\"1.5\" marker-end=\"url(#f2-c2)\"/>\n          <rect x=\"804\" y=\"100\" width=\"136\" height=\"34\" rx=\"5\" fill=\"none\" stroke=\"#B8400A\" stroke-width=\"1.6\"/><text x=\"820\" y=\"122\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#B8400A\">newest result</text>\n          <text x=\"520\" y=\"206\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#B8400A\">the same row, forever &#8212; a retry loop replays one answer indefinitely</text>\n          <text x=\"520\" y=\"224\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#9E1739\">candidate set = completed only &#8212; inconsistent with the ordinal path above</text>\n\n          <rect x=\"20\" y=\"246\" width=\"920\" height=\"66\" rx=\"6\" fill=\"none\" stroke=\"#9E1739\" stroke-width=\"1.4\" stroke-dasharray=\"4 3\"/>\n          <text x=\"38\" y=\"270\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"13\" font-weight=\"600\" fill=\"#9E1739\">The concurrency race</text>\n          <text x=\"38\" y=\"290\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".82\">read counter &#8594; await tool_lookup(&hellip;) &#8594; write counter.  The increment is on the far side of the await,</text>\n          <text x=\"38\" y=\"306\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".82\">on an unguarded dict. Two in-flight identical calls both read 0, both get result A, and result B is never consumed.</text>\n        </svg>"; }
  };
  DIA.kitaruFreeze = {
    title: "Freezing the transcript against freezing the world",
    cap: "Kitaru freezes the transcript; your harness froze the world. Freezing the transcript scales to thousands of imported sessions with zero authoring. Freezing the world supports counterfactual exploration, which a transcript fundamentally cannot.",
    fixed: true,
    svg: function () { return "<svg viewBox=\"0 0 960 400\" role=\"img\" aria-label=\"Kitaru backs a mocked tool with a recorded call log keyed by argument hash, so a novel call misses; the Alfred harness backs it with a snapshot database, so a novel call still returns a coherent answer.\">\n          <defs>\n            <marker id=\"f3-d1\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"/></marker>\n            <marker id=\"f3-d2\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#9E1739\"/></marker>\n            <marker id=\"f3-d3\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#0B6B6B\"/></marker>\n          </defs>\n\n          <text x=\"20\" y=\"26\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"15\" font-weight=\"600\" fill=\"currentColor\">Kitaru &mdash; call-log replay</text>\n          <rect x=\"20\" y=\"42\" width=\"160\" height=\"42\" rx=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\"/>\n          <text x=\"38\" y=\"68\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\">agent calls tool</text>\n          <line x1=\"184\" y1=\"63\" x2=\"240\" y2=\"63\" stroke=\"currentColor\" stroke-width=\"1.3\" marker-end=\"url(#f3-d1)\"/>\n          <rect x=\"244\" y=\"42\" width=\"180\" height=\"42\" rx=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\"/>\n          <text x=\"258\" y=\"60\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\">tool body never runs</text>\n          <text x=\"258\" y=\"76\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#0B6B6B\">hash(name + args)</text>\n          <line x1=\"428\" y1=\"63\" x2=\"486\" y2=\"63\" stroke=\"currentColor\" stroke-width=\"1.3\" marker-end=\"url(#f3-d1)\"/>\n          <rect x=\"490\" y=\"30\" width=\"200\" height=\"66\" rx=\"6\" fill=\"none\" stroke=\"#0B6B6B\" stroke-width=\"1.5\"/>\n          <text x=\"506\" y=\"52\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">recorded call log</text>\n          <text x=\"506\" y=\"70\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".7\">one row per observed call</text>\n          <text x=\"506\" y=\"86\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".7\">keyed by exact arguments</text>\n\n          <line x1=\"694\" y1=\"63\" x2=\"750\" y2=\"63\" stroke=\"#0B6B6B\" stroke-width=\"1.4\" marker-end=\"url(#f3-d3)\"/>\n          <text x=\"756\" y=\"58\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#0B6B6B\">exact replay of the</text>\n          <text x=\"756\" y=\"73\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#0B6B6B\">recorded path: perfect</text>\n\n          <line x1=\"334\" y1=\"88\" x2=\"334\" y2=\"130\" stroke=\"#9E1739\" stroke-width=\"1.4\" marker-end=\"url(#f3-d2)\"/>\n          <text x=\"344\" y=\"114\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#9E1739\">agent asks something new</text>\n          <rect x=\"244\" y=\"134\" width=\"446\" height=\"46\" rx=\"6\" fill=\"none\" stroke=\"#9E1739\" stroke-width=\"1.5\"/>\n          <text x=\"262\" y=\"154\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#9E1739\">MISS &#8212; no row with that hash exists</text>\n          <text x=\"262\" y=\"172\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".78\">on_miss: kill the run | hand the model an error dict | call production</text>\n\n          <line x1=\"20\" y1=\"208\" x2=\"940\" y2=\"208\" stroke=\"currentColor\" stroke-opacity=\".2\"/>\n\n          <text x=\"20\" y=\"242\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"15\" font-weight=\"600\" fill=\"currentColor\">Your harness &mdash; world-snapshot replay</text>\n          <rect x=\"20\" y=\"258\" width=\"160\" height=\"42\" rx=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\"/>\n          <text x=\"38\" y=\"284\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\">agent calls tool</text>\n          <line x1=\"184\" y1=\"279\" x2=\"240\" y2=\"279\" stroke=\"currentColor\" stroke-width=\"1.3\" marker-end=\"url(#f3-d1)\"/>\n          <rect x=\"244\" y=\"258\" width=\"180\" height=\"42\" rx=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\"/>\n          <text x=\"258\" y=\"276\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\">tool logic runs for real</text>\n          <text x=\"258\" y=\"292\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#0B6B6B\">query, not lookup</text>\n          <line x1=\"428\" y1=\"279\" x2=\"486\" y2=\"279\" stroke=\"currentColor\" stroke-width=\"1.3\" marker-end=\"url(#f3-d1)\"/>\n          <rect x=\"490\" y=\"246\" width=\"200\" height=\"66\" rx=\"6\" fill=\"none\" stroke=\"#0B6B6B\" stroke-width=\"1.5\"/>\n          <text x=\"506\" y=\"268\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">snapshot SQLite</text>\n          <text x=\"506\" y=\"286\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".7\">the scenario AND its neighbors</text>\n          <text x=\"506\" y=\"302\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".7\">3 Mikes, redacted, coherent</text>\n\n          <line x1=\"694\" y1=\"279\" x2=\"750\" y2=\"279\" stroke=\"#0B6B6B\" stroke-width=\"1.4\" marker-end=\"url(#f3-d3)\"/>\n          <text x=\"756\" y=\"274\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#0B6B6B\">novel query still gets a</text>\n          <text x=\"756\" y=\"289\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"#0B6B6B\">true, consistent answer</text>\n\n          <rect x=\"244\" y=\"326\" width=\"446\" height=\"46\" rx=\"6\" fill=\"none\" stroke=\"#0B6B6B\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/>\n          <text x=\"262\" y=\"346\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"#0B6B6B\">NO MISS CONCEPT &#8212; the world is frozen, not the call sequence</text>\n          <text x=\"262\" y=\"364\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".78\">the agent may take a path it never took and still be evaluated fairly</text>\n        </svg>"; }
  };
  DIA.kitaruPosition = {
    title: "How Kitaru's positioning moved",
    cap: "The tell is the comparison content: through mid-August they wrote against durable-execution competitors, and from late August against eval and observability vendors. Independent corroboration of the repositioning.",
    fixed: true,
    svg: function () { return "<svg viewBox=\"0 0 960 220\" role=\"img\" aria-label=\"Timeline: March 2026 ZenML launches Kitaru as a durable execution runtime; August 2026 Kitaru repositions to replay-based evals; September 2026 shipping continues with a coding-agent sandbox blog post.\">\n          <line x1=\"40\" y1=\"110\" x2=\"920\" y2=\"110\" stroke=\"currentColor\" stroke-opacity=\".3\" stroke-width=\"1.5\"/>\n\n          <circle cx=\"120\" cy=\"110\" r=\"6\" fill=\"#B8400A\"/>\n          <text x=\"120\" y=\"88\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" font-weight=\"600\" fill=\"#B8400A\">Mar 2026</text>\n          <text x=\"120\" y=\"140\" text-anchor=\"middle\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"12\" fill=\"currentColor\">Pivot 1</text>\n          <text x=\"120\" y=\"158\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"currentColor\" fill-opacity=\".68\">ZenML &#8594; Kitaru</text>\n          <text x=\"120\" y=\"173\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"currentColor\" fill-opacity=\".68\">durable runtime</text>\n          <text x=\"120\" y=\"188\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"currentColor\" fill-opacity=\".68\">@flow / @checkpoint</text>\n\n          <circle cx=\"400\" cy=\"110\" r=\"5\" fill=\"currentColor\" fill-opacity=\".5\"/>\n          <text x=\"400\" y=\"88\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" fill=\"currentColor\" fill-opacity=\".62\">Apr&#8211;Jul</text>\n          <text x=\"400\" y=\"140\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"currentColor\" fill-opacity=\".62\">competitor content vs</text>\n          <text x=\"400\" y=\"155\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"currentColor\" fill-opacity=\".62\">Temporal, Inngest, Trigger.dev</text>\n\n          <circle cx=\"660\" cy=\"110\" r=\"8\" fill=\"#0B6B6B\"/>\n          <text x=\"660\" y=\"88\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" font-weight=\"600\" fill=\"#0B6B6B\">Aug 18 2026</text>\n          <text x=\"660\" y=\"140\" text-anchor=\"middle\" font-family=\"IBM Plex Sans, sans-serif\" font-size=\"12\" font-weight=\"600\" fill=\"#0B6B6B\">Pivot 2</text>\n          <text x=\"660\" y=\"158\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"currentColor\" fill-opacity=\".72\">replay-based evals</text>\n          <text x=\"660\" y=\"173\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"currentColor\" fill-opacity=\".72\">Workers replace Stacks</text>\n          <text x=\"660\" y=\"188\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"#9E1739\">never posted to HN</text>\n\n          <circle cx=\"880\" cy=\"110\" r=\"6\" fill=\"#B8400A\"/>\n          <text x=\"880\" y=\"88\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"11\" font-weight=\"600\" fill=\"#B8400A\">Sep 2026</text>\n          <text x=\"880\" y=\"140\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"currentColor\" fill-opacity=\".72\">coding-agent</text>\n          <text x=\"880\" y=\"155\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10\" fill=\"currentColor\" fill-opacity=\".72\">sandbox research</text>\n\n          <rect x=\"600\" y=\"28\" width=\"330\" height=\"26\" rx=\"4\" fill=\"none\" stroke=\"currentColor\" stroke-opacity=\".3\"/>\n          <text x=\"614\" y=\"46\" font-family=\"IBM Plex Mono, monospace\" font-size=\"10.5\" fill=\"currentColor\" fill-opacity=\".7\">comparison content switches to Braintrust / Arize</text>\n        </svg>"; }
  };

  return { S: S, DIA: DIA, slug: slug };
})();
