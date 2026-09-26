/* Check the shared figures before committing a figure change.

     node figures/check.js                 every figure in figures.js
     node figures/check.js cand.js         a candidate file of DIA.<key> = {...}; entries,
                                           applied on top of figures.js (figures.js untouched)

   For each figure: that it renders, its node and edge ids, arrows that matched no box
   (S.arrow ends more than 28px from any box; give them { id: "a>b" }), and ids with no note
   in notes.js, or notes for ids that no longer exist. Writes figures/check.html, a gallery
   to open in a browser and look at. Exits 1 if any figure throws. */
const fs = require("fs"), path = require("path");
const DIR = __dirname;
const read = f => fs.readFileSync(path.join(DIR, f), "utf8");
let figs = read("figures.js");
let keys = null;
if (process.argv[2]) {
  const cand = fs.readFileSync(process.argv[2], "utf8");
  keys = [...cand.matchAll(/DIA\.(\w+)\s*=\s*\{/g)].map(m => m[1]);
  figs = figs.replace("  return { S: S, DIA: DIA", cand + "\n  return { S: S, DIA: DIA");
}
const F = new Function(read("icons.js") + "\n" + figs + "\nreturn FIGURES;")();
const window = {};
new Function("window", read("notes.js"))(window);
const NOTES = window.FIG_NOTES || {};

let bad = 0;
let html = '<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="figures.css">' +
  '<style>body{background:#e8e5dd;font-family:Arial;margin:20px}.f{background:#f4f2ec;padding:14px;margin:0 0 18px;max-width:820px}' +
  'svg{width:100%;height:auto}.cap{font-size:13px;color:#444;margin-top:8px}</style>';
for (const k of keys || Object.keys(F.DIA)) {
  const d = F.DIA[k];
  if (!d) { console.log(k + ": MISSING"); bad++; continue; }
  let svg;
  try { svg = d.svg(); } catch (e) { console.log(k + ": THROWS " + e.message); bad++; continue; }
  const nodes = [...new Set([...svg.matchAll(/data-n="([^"]+)"/g)].map(m => m[1]))];
  const edges = [...svg.matchAll(/data-e="([^"]+)"/g)].map(m => m[1]);
  const free = (svg.match(/data-e-free/g) || []).length;
  const n = NOTES[k] || { nodes: {}, edges: {} };
  const ids = nodes.concat(edges);
  const unnoted = ids.filter(i => !(n.nodes || {})[i] && !(n.edges || {})[i]);
  const stale = Object.keys(n.nodes || {}).concat(Object.keys(n.edges || {})).filter(i => ids.indexOf(i) < 0);
  const out = [k + ": " + d.title];
  if (keys) { out.push("  nodes: " + nodes.join(" "), "  edges: " + edges.join(" ")); }
  if (free) { out.push("  unmatched arrows: " + free); }
  if (!NOTES[k]) { out.push("  no notes"); } else if (unnoted.length) { out.push("  no note: " + unnoted.join(" ")); }
  if (stale.length) { out.push("  notes for missing ids: " + stale.join(" ")); }
  if (keys || out.length > 1) { console.log(out.join("\n")); }
  html += '<div class="f"><b>' + k + ": " + d.title + "</b>" + svg + '<div class="cap">' + d.cap + "</div></div>";
}
fs.writeFileSync(path.join(DIR, "check.html"), html);
console.log("\n" + (keys || Object.keys(F.DIA)).length + " figures checked. Gallery: figures/check.html");
process.exit(bad ? 1 : 0);
