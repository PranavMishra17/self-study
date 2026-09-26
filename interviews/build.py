"""Build one interview loop's page from its content module and the template.

    python interviews/build.py zenml_round3      -> interviews/zenml-round3.html

A content module (see zenml_round3.py) holds the loop's brief, spoken scripts,
technical questions, drills, questions to ask, traps and tables. Sessions still
held in the tracker are read from index.html (SESSION_IDS), and each session's
quiz is built from its own questions: open questions with a model answer only,
no blanks and no one-word answers, at most eight. Past mocks live in
<module>.mocks.json, the latest two shown.
"""
import html, importlib, io, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)


def sessions_from_tracker(ids):
    out = subprocess.run(["node", os.path.join(HERE, "extract.js"), ",".join(i for i, _ in ids)],
                         capture_output=True, text=True, encoding="utf-8", check=True).stdout
    data = json.loads(out)
    days = dict(ids)
    for s in data:
        s["day"] = days[s["id"]]
    return data


def ans_text(ans):
    if isinstance(ans, list):
        return " ".join(a.rstrip(".") + "." for a in ans)
    return ans or ""


def quiz_for(s, cap=8):
    """Open questions only: short, why and figure closers, pick closers as open
    questions answered by their correct option, then 'say it' prompts from steps."""
    qs = []

    def take(closers):
        for c in closers or []:
            k = c.get("k")
            if k in ("short", "why", "figure"):
                qs.append({"q": c["q"], "a": c["a"]})
            elif k == "pick" and isinstance(c.get("a"), int):
                a = c["o"][c["a"]] + (". " + c["why"] if c.get("why") else "")
                qs.append({"q": c["q"], "a": a})

    for st in s["steps"]:
        take(st.get("close"))
    for it in s.get("study", []):
        take(it.get("close"))
    seen, uniq = set(), []
    for q in qs:
        if q["q"] not in seen:
            seen.add(q["q"])
            uniq.append(q)
    # spread across the session rather than front-loading the first step
    if len(uniq) > cap:
        step = len(uniq) / cap
        uniq = [uniq[int(i * step)] for i in range(cap)]
    for st in s["steps"]:
        if len(uniq) >= 5:
            break
        if st.get("ans"):
            uniq.append({"q": "In your own words: " + st["t"].rstrip(".") + ".", "a": ans_text(st["ans"])})
    for it in s.get("study", []):
        if len(uniq) >= 5:
            break
        if it.get("say"):
            uniq.append({"q": "Explain, as you would out loud: " + it["t"] + ".", "a": it["say"]})
    return uniq[:cap]


def build(module_name):
    m = importlib.import_module(module_name)
    L = m.LOOP
    sessions = sessions_from_tracker(m.SESSION_IDS)
    for s in sessions:
        s["quiz_src"] = s.get("quiz")
        s["hasTrackerQuiz"] = bool(s.get("quiz"))
        s["quiz"] = quiz_for(s)
    # Prep: what each technical question rests on (figures, checked reading, guide links).
    qx = getattr(m, "QA_EXTRA", {})
    if qx:
        rj = io.open(os.path.join(HERE, "..", "data", "reading.js"), encoding="utf-8").read()
        known = {}
        for v in json.loads(rj[rj.index("var READING = ") + 14: rj.index(";\n/*SD_TECH*/")]).values():
            for r in v.get("read", []) + v.get("aieng", []):
                if r.get("url"):
                    known.setdefault(r["url"], r)
        sd = json.loads(subprocess.run(["node", os.path.join(HERE, "extract.js"), "--sd"], input=json.dumps({k: v.get("sd", []) for k, v in qx.items()}),
                                       capture_output=True, text=True, encoding="utf-8", check=True).stdout)
        for g in m.QA:
            for it in g["items"]:
                k = next((k for k in qx if it["q"].startswith(k)), None)
                if not k:
                    continue
                missing = [u for u in qx[k].get("read", []) if u not in known]
                if missing:
                    sys.exit("QA_EXTRA reading not in data/reading.js: %s" % missing)
                it["learn"] = {"figs": qx[k].get("figs", []), "read": [known[u] for u in qx[k].get("read", [])], "sdLinks": sd[k]}
    mocks_path = os.path.join(HERE, module_name + ".mocks.json")
    mocks = json.load(io.open(mocks_path, encoding="utf-8")) if os.path.exists(mocks_path) else []
    data = {
        "id": L["id"], "title": L["title"], "subtitle": L["subtitle"], "when": L["when"], "when_iso": L["when_iso"],
        "who": L["who"], "format": L["format"], "bar": L["bar"],
        "sessions": [{k: s.get(k) for k in ("id", "name", "blurb", "intro", "len", "day", "steps", "study", "quiz", "hasTrackerQuiz", "figs")}
                     for s in sessions],
        "scripts": getattr(m, "SCRIPTS", []), "drills": getattr(m, "DRILLS", []), "qa": getattr(m, "QA", []), "ask": getattr(m, "ASK", []), "traps": getattr(m, "TRAPS", []),
        "tables": getattr(m, "KITARU_TABLES", []), "admire": getattr(m, "ADMIRE", ""), "kitaruLead": getattr(m, "KITARU_LEAD", ""),
        "figures": L.get("figures", []), "mockHow": getattr(m, "MOCK_HOW", ""), "mocks": mocks[-2:],
        "planKicker": L.get("plan_kicker", ""), "mechTitle": L.get("mech_title", ""),
        "designLink": L.get("design_link"), "extra": L.get("extra", ""),
        "emphasis": getattr(m, "EMPHASIS", []),
    }
    tpl = io.open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    page = tpl.replace("{{DATA}}", blob).replace("{{TITLE}}", L["title"]).replace("{{MODULE}}", module_name)
    out = os.path.join(HERE, module_name.replace("_", "-") + ".html")
    io.open(out, "w", encoding="utf-8", newline="\n").write(page)
    print("wrote %s: %d bytes, %d sessions, %d quiz questions, %d figures, %d mocks"
          % (out, len(page), len(sessions), sum(len(s["quiz"]) for s in sessions), len(data["figures"]), len(data["mocks"])))


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "zenml_round3")
