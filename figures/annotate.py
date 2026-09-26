"""Make a flat, hand-drawn svg explorable by figures/viewer.js.

Every <rect> becomes a node: it is wrapped in <g data-n="..."> together with the <text>
elements that sit inside it, and named after its first line of text. Every <line> or
<path> whose two ends land near two different nodes becomes an edge, data-e="a>b". Used
by alaap/build.py for the architecture figures, and once for the Kitaru teardown figures.

    python figures/annotate.py < in.svg > out.svg     # also importable: annotate(svg)
"""
import re
import sys

NUM = r"(-?[\d.]+)"


def _attr(tag, name, default=None):
    m = re.search(r'\s%s="%s"' % (name, NUM), tag)
    return float(m.group(1)) if m else default


def _slug(t):
    t = re.sub(r"<[^>]+>", "", t).lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:40] or "node"


def annotate(svg):
    # rects, with their geometry; skip full-size backgrounds and tiny marks
    vb = re.search(r'viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"', svg)
    W, H = (float(vb.group(1)), float(vb.group(2))) if vb else (1e9, 1e9)
    rects = []
    for m in re.finditer(r"<rect\b[^>]*/?>", svg):
        tag = m.group(0)
        x, y, w, h = _attr(tag, "x", 0), _attr(tag, "y", 0), _attr(tag, "width", 0), _attr(tag, "height", 0)
        if w < 24 or h < 14 or (w > W * 0.9 and h > H * 0.6):
            continue
        rects.append({"start": m.start(), "end": m.end(), "x": x, "y": y, "w": w, "h": h, "texts": []})
    texts = []
    for m in re.finditer(r"<text\b([^>]*)>(.*?)</text>", svg, re.S):
        x, y = _attr(m.group(1), "x"), _attr(m.group(1), "y")
        if x is None or y is None:
            continue
        texts.append({"start": m.start(), "end": m.end(), "x": x, "y": y, "t": re.sub(r"<[^>]+>", "", m.group(2)).strip()})
    for t in texts:
        inside = [r for r in rects if r["x"] - 2 <= t["x"] <= r["x"] + r["w"] + 2 and r["y"] - 2 <= t["y"] <= r["y"] + r["h"] + 4]
        if inside:
            min(inside, key=lambda r: r["w"] * r["h"])["texts"].append(t)
    used, ids = set(), {}
    for r in rects:
        base = _slug(r["texts"][0]["t"]) if r["texts"] else "box"
        n, rid = 2, base
        while rid in used:
            rid = "%s-%d" % (base, n); n += 1
        used.add(rid)
        r["id"] = rid

    def near(x, y):
        best, bd = None, 26.0
        for r in rects:
            dx = max(r["x"] - x, 0, x - (r["x"] + r["w"]))
            dy = max(r["y"] - y, 0, y - (r["y"] + r["h"]))
            d = (dx * dx + dy * dy) ** 0.5
            if d < bd:
                best, bd = r, d
        return best

    edits = []   # (start, end, replacement)
    seen = {}
    for m in re.finditer(r"<(line|path)\b[^>]*/?>", svg):
        tag = m.group(0)
        if m.group(1) == "line":
            pts = [(_attr(tag, "x1"), _attr(tag, "y1")), (_attr(tag, "x2"), _attr(tag, "y2"))]
        else:
            d = re.search(r'\sd="([^"]+)"', tag)
            nums = re.findall(r"-?[\d.]+", d.group(1)) if d else []
            if len(nums) < 4:
                continue
            pts = [(float(nums[0]), float(nums[1])), (float(nums[-2]), float(nums[-1]))]
        if None in pts[0] or None in pts[1]:
            continue
        a, b = near(*pts[0]), near(*pts[1])
        if not a or not b or a is b:
            continue
        e = "%s>%s" % (a["id"], b["id"])
        seen[e] = seen.get(e, 0) + 1
        if seen[e] > 1:
            e += "#%d" % seen[e]
        hit = re.sub(r'\s(class|style|marker-end|marker-start|stroke-dasharray)="[^"]*"', "", tag)
        hit = hit.replace("<%s" % m.group(1), '<%s class="fv-hit"' % m.group(1), 1)
        edits.append((m.start(), m.end(), '<g data-e="%s">%s%s</g>' % (e, hit, tag)))
    # nodes: pull each rect's texts next to it inside one group
    moved = set()
    for r in rects:
        inner = svg[r["start"]:r["end"]] + "".join(svg[t["start"]:t["end"]] for t in r["texts"])
        edits.append((r["start"], r["end"], '<g data-n="%s">%s</g>' % (r["id"], inner)))
        for t in r["texts"]:
            moved.add((t["start"], t["end"]))
    for s, e in moved:
        edits.append((s, e, ""))
    out, pos = [], 0
    for s, e, rep in sorted(edits, key=lambda x: x[0]):
        if s < pos:
            continue
        out.append(svg[pos:s]); out.append(rep); pos = e
    out.append(svg[pos:])
    return "".join(out)


if __name__ == "__main__":
    sys.stdout.write(annotate(sys.stdin.read()))
