/* Dump one session and its figures from index.html for variants/build.py: node variants/dump.js */
const fs=require("fs");const src=fs.readFileSync("index.html","utf8");
function grab(decl){const i=src.indexOf(decl);let j=src.indexOf(decl.endsWith("[")?"[":"{",i),d=0,q=null,k=j;for(;k<src.length;k++){const c=src[k];if(q){if(c==="\\"){k++;continue;}if(c===q)q=null;continue;}if(c==='"'||c==="'"||c==="`"){q=c;continue;}if(c==="{"||c==="[")d++;else if(c==="}"||c==="]"){d--;if(d===0)break;}}return src.slice(j,k+1);}
function bk(t){return {book:t}} function ddia(t){return {book:"DDIA, "+t}}
const L=eval("("+grab("var L = {")+")");
// the diagram toolkit and figures, run as-is
const a=src.indexOf("  var S = {};"), b=src.indexOf("  var PLAN = [");
const DIA = {};
eval(src.slice(a, b).replace("var DIA = {};",""));
const PLAN=eval("("+grab("var PLAN = [")+")");
const s=PLAN[1].sessions[0];
const figs=(s.diagrams||[]).map(k=>({key:k,title:DIA[k].title,cap:DIA[k].cap,svg:DIA[k].svg()}));
fs.writeFileSync("variants/w2a.json",JSON.stringify({session:s,figures:figs},null,1));
console.log(s.id, figs.map(f=>f.key+":"+f.svg.length), Object.keys(s.steps[1]));
