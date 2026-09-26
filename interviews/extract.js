/* Print the tracker's wildcard sessions and their study lists as JSON, for
   interviews/build.py. Reads index.html's own data; changes nothing.
   node interviews/extract.js wc7,wc13,... */
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

function grab(decl) {
  const i = src.indexOf(decl);
  let j = src.indexOf(decl.endsWith("[") ? "[" : "{", i), d = 0, q = null, k = j;
  for (; k < src.length; k++) {
    const c = src[k];
    if (q) { if (c === "\\") { k++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === "{" || c === "[") d++;
    else if (c === "}" || c === "]") { d--; if (d === 0) break; }
  }
  return src.slice(j, k + 1);
}
function bk(t) { return { book: t }; }
function ddia(t) { return { book: "DDIA, " + t }; }
const R = eval("(" + grab("var R = {") + ")");
const L = {};
const WILDCARD = eval("(" + grab("var WILDCARD = {") + ")");
const STUDY = eval("(" + grab("var STUDY = {") + ")");
/* The tracker's figures (DIA, drawn with its S helpers) and its system design map (SD),
   so the loop page can show the same figures and the same guide links. */
const dStart = src.indexOf("  var S = {};");
const dLast = src.indexOf("  DIA.multiturn = {");
const dEnd = src.indexOf("{", dLast) + grab("  DIA.multiturn = {").length;
const DIA = new Function(src.slice(dStart, dEnd) + ";\nreturn DIA;")();
const SD = eval("(" + grab("var SD = {") + ")");
function sdHref(p) {
  const parts = p.v === "overview"
    ? (!p.a ? ["framework"] : p.a.indexOf("pattern-") === 0 ? ["patterns", p.a.slice(8)] : ["framework", p.a])
    : (p.a ? ["designs", p.v, p.a] : ["designs", p.v]);
  return "../" + SD.file + "#/" + parts.map(encodeURIComponent).join("/");
}
function sdLabel(p) {
  if (p.a && p.a.indexOf("pattern-") === 0) { return "Pattern: " + (SD.patterns[p.a.slice(8)] || p.a.slice(8)); }
  if (p.v === "overview") { return p.a ? "The framework, " + (SD.anchors[p.a] || p.a) : "The six-step framework"; }
  return (SD.views[p.v] || p.v) + (p.a ? ", " + (SD.anchors[p.a] || p.a) : "");
}
function withSd(x) { if (x.sd) { x.sdLinks = x.sd.map(p => ({ href: sdHref(p), label: sdLabel(p), why: p.why || "" })); } return x; }
const want = (process.argv[2] || "").split(",").filter(Boolean);
const out = want.map(id => {
  const s = WILDCARD.sessions.find(x => x.id === id);
  if (!s) throw new Error("No wildcard session " + id);
  const figs = (s.diagrams || []).map(k => DIA[k] && { title: DIA[k].title, cap: DIA[k].cap, svg: DIA[k].svg() }).filter(Boolean);
  return Object.assign({}, s, { steps: s.steps.map(withSd), study: (STUDY[id] || []).map(withSd), figs: figs });
});
process.stdout.write(JSON.stringify(out));
