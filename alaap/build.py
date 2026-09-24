"""Build ALAAP.html from the Alaap repo's own learning documents.

Reads, from the Alaap repo (never edits it):
    learning/README.md                the four questions, for the landing cards
    learning/01-STUDY-GUIDE.md        the study guide, Parts 0 to 7
    learning/00-SANITY-CHECK.md       where the project actually is
    learning/02-ACCENT-AND-RIGHTS.md  the accent and rights research
    learning/architecture.html        the fourteen diagrams, copied as they are

and writes ALAAP.html at the root of this repo, in the Alaap repo's own visual
style. The text is the Alaap documents' text; what this adds is the layout, the
tabs, the timeline, and where each part is practised in Accelerate (ACCEL below).

Re-run whenever the Alaap documents change:

    python alaap/build.py
"""
import html, io, os, re, sys
import markdown

SRC = r"E:\VoiceForge TTV Pipeine\v3\learning"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "ALAAP.html")

# Where each part of the guide is practised in Accelerate. Keys are anchors on
# the study guide tab; hrefs are Accelerate routes (#/s/<week>/<session>).
ACCEL = {
    "part-0": [("Week 1, Part 0: orientation", "index.html#/s/1/3")],
    "s1-2": [("Week 4, Gradients and descent: backprop by hand", "index.html#/s/4/2")],
    "s2-1": [("Week 3, Sampling and Nyquist", "index.html#/s/3/3")],
    "s2-3": [("Week 5, The source-filter model", "index.html#/s/5/3")],
    "s3-1": [("Week 4, Embeddings and attention: where embedding numbers come from", "index.html#/s/4/3")],
    "s3-2": [("Week 3, Vectors and matrices: cosine similarity", "index.html#/s/3/2")],
    "s5-1": [("Week 1, Functions, exponentials, logarithms: negative log-likelihood", "index.html#/s/1/2"),
             ("Week 5, Probability: softmax as a distribution", "index.html#/s/5/2")],
    "s6-2": [("Week 3, Vectors and matrices: eigenvectors", "index.html#/s/3/2")],
}

# Where each part sits in Accelerate's milestones, for the timeline.
MILESTONE = [
    ("Milestone 1, 21 Sep to 25 Oct", "Part 0, then 2.1 and 2.3. Capped at four hours: the physics half of Part 2 only."),
    ("Milestone 2, late Oct to mid Dec", "Part 1's exit checklist once TrenTorch covers it, Part 3, and the navigability papers."),
    ("Milestone 3, early 2027", "Parts 4 to 6, and Alaap trained from scratch rather than assembled."),
]

SYMBOLS = [("\u2705", '<span class="ok">\u2713</span>'), ("\u274c", '<span class="bad">\u2717</span>'),
           ("\u26d4", '<span class="bad">\u2717</span>'), ("\U0001f7e1", '<span class="warn">\u25d0</span>'),
           ("\u26a0\ufe0f", '<span class="warn">!</span>'), ("\u26a0", '<span class="warn">!</span>')]

DOCS = {"01-STUDY-GUIDE.md": "#/guide", "00-SANITY-CHECK.md": "#/status",
        "02-ACCENT-AND-RIGHTS.md": "#/accent", "architecture.html": "#/architecture", "README.md": "#/guide"}


def read(name):
    return io.open(os.path.join(SRC, name), encoding="utf-8").read()


def slug(text):
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"[^a-z0-9]+", "-", html.unescape(text).lower()).strip("-")[:48]


def loosen(text):
    """The Alaap documents start lists and code straight under a line of prose,
    which GitHub renders as a list and Python-Markdown folds into the paragraph.
    Put a blank line in front of each, outside code fences."""
    out, fenced, prev = [], False, ""
    for line in text.split("\n"):
        starts = re.match(r"(\d+\.|[-*]) |```", line)
        if starts and not fenced and prev.strip() and not re.match(r"\s*(\d+\.|[-*]) |>|\|", prev):
            out.append("")
        if line.startswith("```"):
            fenced = not fenced
        out.append(line)
        prev = line
    return "\n".join(out)


def md(text):
    for a, b in SYMBOLS:
        text = text.replace(a, b)
    out = markdown.markdown(loosen(text), extensions=["tables", "fenced_code", "sane_lists"])
    return relink(out)


def relink(out):
    """Links between the four documents become tabs; links into the rest of the
    Alaap repo become paths, since this page does not live there."""
    def fix(m):
        href, label = m.group(1), m.group(2)
        base = href.split("#")[0].split("/")[-1]
        if href.startswith("http"):
            return '<a href="%s" target="_blank" rel="noopener">%s</a>' % (href, label)
        if base in DOCS and not href.startswith("../"):
            return '<a href="%s">%s</a>' % (DOCS[base], label)
        path = href[3:] if href.startswith("../") else "learning/" + href
        return '<span class="repo" title="In the Alaap repo: %s">%s</span>' % (html.escape(path), label)
    return re.sub(r'<a href="([^"]+)">(.*?)</a>', fix, out)


def labels(out):
    """The guide's four recurring parts become labelled blocks."""
    rules = [
        (r"<p><strong>\u27f6 After this you can</strong>", '<p class="k after"><b class="lab">After this you can</b>'),
        (r"<p><strong>Read</strong>(\s*\u2014\s*)?", '<p class="k read"><b class="lab">Read</b> '),
        (r"<p><strong>Do</strong>(\s*\u2014\s*)?", '<p class="k do"><b class="lab">Do</b> '),
        (r"<p><strong>Check</strong>(\s*\u2014\s*)?", '<p class="k check"><b class="lab">Check</b> '),
        (r"<p><strong>Intuition:?</strong>:?", '<p class="k intu"><b class="lab">Intuition</b>'),
        (r"<p><strong>(Why it matters[^<]*?):?</strong>:?", r'<p class="k why"><b class="lab">\1</b>'),
    ]
    for pat, rep in rules:
        out = re.sub(pat, rep, out)
    # a Do or Read label keeps the code block or list that follows it
    out = re.sub(r'<p class="k (do|read)">(.*?)</p>\s*(<pre>.*?</pre>|<ol>.*?</ol>|<ul>.*?</ul>)',
                 r'<div class="k \1">\2\3</div>', out, flags=re.S)
    return out


def section_heads(out):
    def h3(m):
        inner = m.group(1)
        mm = (re.match(r"(\d+)\.(\d+) (.+?) \u2014 ([\d.]+ h)(.*)$", inner)
              or re.match(r"(\d+)\.(\d+) (.+?)()()$", inner))
        if not mm:
            return "<h3>%s</h3>" % inner
        sid = "s%s-%s" % (mm.group(1), mm.group(2))
        extra = mm.group(5).strip(" \u00b7")
        return ('<h3 id="%s"><span class="num">%s.%s</span> %s%s%s</h3>'
                % (sid, mm.group(1), mm.group(2), mm.group(3),
                   ' <span class="hrs">%s</span>' % mm.group(4) if mm.group(4) else "",
                   ' <span class="flag">%s</span>' % extra if extra else "")) + accel_row(sid)
    return re.sub(r"<h3>(.*?)</h3>", h3, out)


def accel_row(key):
    links = ACCEL.get(key)
    if not links:
        return ""
    parts = ['<a href="%s" target="_blank" rel="noopener">%s</a>' % (h, html.escape(t)) for t, h in links]
    return '<p class="acc"><b>Practised in Accelerate</b> %s</p>' % " \u00b7 ".join(parts)


def timeline():
    """The guide's week plan, drawn in the architecture page's own primitives."""
    rows = [("Part 1", "PyTorch and tensors", 1, 4, "b1"),
            ("Part 2", "Sound as data", 3, 5, "b3"),
            ("Part 3", "Speaker identity", 6, 7, "b1"),
            ("Part 4", "How TTS works", 8, 9, "b2"),
            ("Part 5", "Description to voice", 10, 10, "b2"),
            ("Part 6", "Evaluation", 11, 11, "b4"),
            ("Part 7", "Roads not taken", 12, 13, "b4")]
    left, colw, top, rowh = 250, 56, 40, 34
    w = left + 13 * colw + 20
    h = top + len(rows) * rowh + 16
    s = ['<svg viewBox="0 0 %d %d" role="img" aria-label="Thirteen-week plan, part by part">' % (w, h)]
    for wk in range(1, 14):
        x = left + (wk - 1) * colw
        s.append('<text class="hd" x="%d" y="22">wk %d</text>' % (x + colw / 2, wk))
        s.append('<line class="plain" x1="%d" y1="30" x2="%d" y2="%d" style="stroke:var(--line)"/>' % (x, x, h - 10))
    for i, (p, name, a, b, cls) in enumerate(rows):
        y = top + i * rowh
        s.append('<text class="t tl" x="8" y="%d"><tspan style="font-weight:600">%s</tspan>  %s</text>' % (y + 13, p, name))
        s.append('<rect class="%s" x="%d" y="%d" width="%d" height="24" rx="6"/>' % (cls, left + (a - 1) * colw + 3, y + 1, (b - a + 1) * colw - 6))
    s.append("</svg>")
    return "\n".join(s)


def study_guide():
    src = read("01-STUDY-GUIDE.md")
    title = src.splitlines()[0].lstrip("# ").strip()
    body = src.split("\n", 1)[1]
    pre, rest = body.split("\n# Part 0", 1)
    rest = "# Part 0" + rest
    rest, epilogue = rest.split("\n## The five ideas", 1)
    epilogue = "## The five ideas" + epilogue

    # prelude: the target block, the citation note, the four-part card set, tinytorch
    target = re.search(r"((?:^>.*\n)+)", pre, re.M).group(1)
    cite = re.search(r"(\*\*Paper citations:\*\*.*?)\n\n", pre, re.S).group(1)
    cards = re.findall(r"^\| \*\*(.+?)\*\* \| (.+?) \|$", pre, re.M)
    after_table = re.search(r"(\*\*The `Do` steps matter.*?)\n\n", pre, re.S).group(1)
    tiny = re.search(r"### Where tinytorch fits\n(.*?)```", pre, re.S).group(1)
    card_html = "".join('<div class="kc k%d"><b class="lab">%s</b><p>%s</p></div>'
                        % (i, html.escape(re.sub(r"^\u27f6 ", "", c[0])), md(c[1])[3:-4]) for i, c in enumerate(cards))

    parts, nav = [], []
    for chunk in re.split(r"\n(?=# Part )", rest):
        head, text = chunk.split("\n", 1)
        m = re.match(r"# Part (\d+) \u00b7 (.+?) \u2014 (.+)$", head.strip())
        n, name, meta = m.group(1), m.group(2), m.group(3)
        pid = "part-" + n
        nav.append((pid, "Part %s" % n, name))
        inner = section_heads(labels(md(text.strip().rstrip("-").strip())))
        parts.append('<section class="part" id="%s"><header class="ph"><span class="pn">Part %s</span>'
                     '<h2>%s</h2><span class="pm">%s</span></header>%s%s</section>'
                     % (pid, n, name, meta, accel_row(pid), inner))

    epi = []
    for chunk in re.split(r"\n(?=## )", epilogue.strip()):
        head, text = chunk.split("\n", 1)
        name = head.lstrip("# ").strip()
        eid = "five-ideas" if name.startswith("The five") else "ten-hours"
        nav.append((eid, "", name))
        epi.append('<section class="part epi" id="%s"><h2>%s</h2>%s</section>'
                   % (eid, name, labels(md(text.strip().rstrip("-").strip()))))

    miles = "".join("<tr><td>%s</td><td>%s</td></tr>" % (a, b) for a, b in MILESTONE)
    side = "".join('<li><a href="#/guide/%s">%s%s</a></li>'
                   % (i, '<span class="sn">%s</span>' % a if a else "", html.escape(b)) for i, a, b in nav)
    return title, """
<div class="split">
<nav class="side" aria-label="Parts of the study guide"><ol>%s</ol></nav>
<div class="main">
<div class="target">%s</div>
<p class="sm">%s</p>
<h2 class="first" id="how">How to use this</h2>
<div class="kcards">%s</div>
<p>%s</p>
<h2 id="plan">Thirteen weeks, and where Accelerate takes them</h2>
%s
<figure>%s
<figcaption><b>The ordering is what matters, not the calendar.</b> Part 2 runs alongside Part 1 from
week 3 because audio has no PyTorch dependency. Part 0 comes first, before week 1, in two hours.</figcaption></figure>
<table class="miles"><tr><th>in Accelerate</th><th>what it takes from this guide</th></tr>%s</table>
%s
%s
</div></div>""" % (side, md(target), md(cite)[3:-4], card_html, md(after_table)[3:-4],
                    md(tiny), timeline(), miles, "\n".join(parts), "\n".join(epi))


def document(name, prefix):
    src = read(name)
    title = src.splitlines()[0].lstrip("# ").strip()
    out = md(src.split("\n", 1)[1])
    out = re.sub(r"<h2>(.*?)</h2>", lambda m: '<h2 id="%s-%s">%s</h2>' % (prefix, slug(m.group(1)), m.group(1)), out)
    return title, out


def architecture():
    src = read("architecture.html")
    css = re.search(r"/\* --- svg primitives --- \*/(.*?)</style>", src, re.S).group(1)
    defs = re.search(r'(<svg width="0" height="0".*?</svg>)', src, re.S).group(1)
    body = src[src.index("<nav>"):src.rindex("</div>")]
    body = body.replace("<nav>", '<nav class="contents">', 1)
    body = re.sub(r'href="#(\w+)"', r'href="#/architecture/\1"', body)
    for doc, route in DOCS.items():
        body = body.replace('<span class="mono">learning/%s</span>' % doc, '<a href="%s">%s</a>' % (route, doc))
    body = re.sub(r'<a href="(https?://[^"]+)">', r'<a href="\1" target="_blank" rel="noopener">', body)
    head = re.search(r"<h1>(.*?)</h1>", src).group(1)
    return head, css, defs, body


def main():
    readme = read("README.md")
    questions = re.findall(r"^\| \*\*(.+?)\*\* \| \[`(.+?)`\]\(.+?\) \| (.+?) \|$", readme, re.M)
    q_html = "".join('<a class="q" href="%s"><b>%s</b><span>%s</span></a>'
                     % (DOCS[f], html.escape(q), md(d)[3:-4]) for q, f, d in questions)
    g_title, guide = study_guide()
    s_title, status = document("00-SANITY-CHECK.md", "st")
    a_title, accent = document("02-ACCENT-AND-RIGHTS.md", "ac")
    arch_title, arch_css, arch_defs, arch = architecture()
    page = io.open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
    for k, v in {"QUESTIONS": q_html, "GUIDE_TITLE": g_title, "GUIDE": guide,
                 "STATUS_TITLE": s_title, "STATUS": status, "ACCENT_TITLE": a_title, "ACCENT": accent,
                 "ARCH_TITLE": arch_title, "ARCH_CSS": arch_css, "ARCH_DEFS": arch_defs, "ARCH": arch}.items():
        page = page.replace("{{%s}}" % k, v)
    left = re.findall(r"\{\{\w+\}\}", page)
    if left:
        sys.exit("unfilled: %s" % left)
    io.open(OUT, "w", encoding="utf-8", newline="\n").write(page)
    print("wrote", OUT, len(page), "bytes;", len(questions), "questions")


if __name__ == "__main__":
    main()
