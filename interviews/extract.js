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
const want = (process.argv[2] || "").split(",").filter(Boolean);
const out = want.map(id => {
  const s = WILDCARD.sessions.find(x => x.id === id);
  if (!s) throw new Error("No wildcard session " + id);
  return Object.assign({}, s, { study: STUDY[id] || [] });
});
process.stdout.write(JSON.stringify(out));
