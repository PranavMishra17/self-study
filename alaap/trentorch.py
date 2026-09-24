"""Read TrenTorch's twenty modules and six milestones, in place, into plain data.

Each module file opens with a markdown cell naming what you have built, what you
will build and what it enables, a connection map, and learning objectives; it
closes with reflection questions and a summary. This pulls those out so the study
plan can quote them rather than paraphrase them. Nothing in TrenTorch is edited.

    python alaap/trentorch.py        prints a summary, for checking
"""
import io, json, os, re, sys

ROOT = r"E:\TrenTorch"
SRC = os.path.join(ROOT, "data", "src")
EMOJI = re.compile("[\U0001F300-\U0001FAFF\u2600-\u27BF\u2B50\u2B06\u2194-\u21AA\uFE0F\u200D]")


def clean(text):
    return EMOJI.sub("", text).strip()


def cells(src):
    """The markdown cells, in order, as plain text."""
    return re.findall(r'# %% \[markdown\]\s*\n"""\n(.*?)\n"""', src, re.S)


def field(text, name):
    m = re.search(r"\*\*%s\*\*:\s*(.+)" % re.escape(name), text)
    return clean(m.group(1)) if m else ""


def section(text, heading):
    """Body of the '## <heading>' section in one cell, up to the next ## heading."""
    m = re.search(r"^## [^\n]*%s[^\n]*\n(.*?)(?=^## |\Z)" % re.escape(heading), text, re.S | re.M)
    return m.group(1).strip() if m else ""


def module(folder):
    name = folder.split("_", 1)[1]
    path = os.path.join(SRC, folder, folder + ".py")
    src = io.open(path, encoding="utf-8").read()
    meta = io.open(os.path.join(SRC, folder, "module.yaml"), encoding="utf-8").read()
    md = cells(src)
    head = md[0] if md else ""
    title = re.search(r"^# Module \d+: (.+)$", head, re.M)
    objectives = [clean(re.sub(r"\*\*", "", o)) for o in re.findall(r"^\d+\. (.+)$", section(head, "Learning Objectives"), re.M)]
    cmap = re.search(r"\*\*Connection Map\*\*:?\s*```\n(.*?)```", head, re.S)
    export = re.search(r"#\| default_exp (\S+)", src)
    headings = [clean(h) for h in re.findall(r"^### (.+)$", src, re.M)]
    topics = [h for h in headings if not re.match(r"(Unit Test|Question \d|Reflection|Key Accomplishments|Systems Insights|Ready for|Test:|Mathematical Foundation|Critical Rule)", h)]
    questions = []
    reflect = src[src.find("Reflection Questions"):] if "Reflection Questions" in src else ""
    for q in re.finditer(r"^### (?:Question )?\d+[.:] (.+?)\n(.*?)(?=^### |^## |^---\s*$|\Z)", reflect, re.S | re.M):
        body = q.group(2).strip()
        scen = re.search(r"\*\*Scenario\*\*:\s*(.+)", body)
        ask = re.search(r"\*\*Question\*\*:\s*(.+)", body) or re.search(r"\*\*(When is .+?)\*\*", body)
        first = body.split("\n")[0] if body and not body.startswith("**") else ""
        questions.append({"title": clean(q.group(1)), "scenario": clean(scen.group(1)) if scen else "",
                          "question": clean(ask.group(1)) if ask else clean(first)})
    summary = section("\n\n".join(md[-3:]), "MODULE SUMMARY")
    wins = [clean(re.sub(r"\*\*", "", w)) for w in re.findall(r"^- (.+)$", summary, re.M)][:6]
    diagrams = [d for d in re.findall(r"```\n(.*?)```", "\n".join(md), re.S) if re.search(r"[\u2500-\u257F\u2190-\u21FF]", d)]
    return {
        "n": int(folder[:2]), "id": folder, "slug": name,
        "title": clean(title.group(1)) if title else name,
        "subtitle": re.search(r"subtitle: (.+)", meta).group(1).strip(),
        "description": re.search(r"description: (.+)", meta).group(1).strip(),
        "built": field(head, "You've Built"), "build": field(head, "You'll Build"), "enable": field(head, "You'll Enable"),
        "map": cmap.group(1).rstrip() if cmap else "",
        "objectives": objectives, "export": export.group(1) if export else "",
        "topics": topics[:14], "questions": questions, "wins": wins,
        "lines": src.count("\n"), "diagram_count": len(diagrams),
        "path": "data/src/%s/%s.py" % (folder, folder),
    }


def milestones():
    text = io.open(os.path.join(ROOT, "data", "milestones", "README.md"), encoding="utf-8").read()
    rows = re.findall(r"<td>(\d\d)</td>\s*<td><b>(.+?)</b></td>\s*<td>(\d{4})</td>\s*<td>(.+?)</td>\s*<td>(.+?)</td>", text)
    return [{"id": r[0], "name": r[1], "year": r[2], "needs": r[3], "what": r[4]} for r in rows]


def load():
    folders = sorted(f for f in os.listdir(SRC) if re.match(r"\d\d_", f))
    return {"modules": [module(f) for f in folders], "milestones": milestones()}


if __name__ == "__main__":
    data = load()
    for m in data["modules"]:
        print("%02d %-22s obj=%d topics=%d q=%d wins=%d dia=%d lines=%d export=%s" % (
            m["n"], m["title"][:22], len(m["objectives"]), len(m["topics"]), len(m["questions"]),
            len(m["wins"]), m["diagram_count"], m["lines"], m["export"]))
    print(len(data["milestones"]), "milestones")
    if len(sys.argv) > 1:
        print(json.dumps(data["modules"][int(sys.argv[1]) - 1], indent=1, ensure_ascii=False)[:6000])
