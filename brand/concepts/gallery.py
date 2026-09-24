"""Build a gallery page: every concept at every size it will actually be seen
at, self-contained so it opens anywhere. SVGs are embedded as data URIs, so the
browser draws each size itself, which is what a tab or a desktop will do too.

    python gallery.py          round one  -> gallery.html
    python gallery.py 2        round two  -> gallery-2.html
"""
import base64
import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
LADDER = [64, 48, 32, 24, 16]


def uri(name):
    raw = io.open(os.path.join(HERE, name), "rb").read()
    return "data:image/svg+xml;base64," + base64.b64encode(raw).decode("ascii")


def img(src, px, cls=""):
    return '<img src="%s" width="%d" height="%d" class="%s" alt="">' % (src, px, px, cls)


def pick(c, px):
    big, small = uri(c["svg"]), (uri(c["small"]) if c.get("small") else None)
    return small if (small and px <= 32) else big


ROUND1 = [
    dict(n="1", name="Ascent", svg="1-ascent.svg", small="1-ascent-small.svg",
         pitch="Polished steel ship climbing out of deep space, trailing a hot plume past a planet's edge. The one an app store would feature.",
         strong="Richest of the six at large sizes, and the most premium.",
         watch="The busiest. Below 32 px it swaps to a simpler second drawing so the ship stays a ship."),
    dict(n="2", name="Warp", svg="2-warp.svg",
         pitch="The ship seen from behind at the instant of the jump, every star stretched into a streak converging on one point.",
         strong="The most cinematic by a distance, at 64 px and up.",
         watch="Weakest at 16 px: the streaks turn into texture and the ship disappears."),
    dict(n="3", name="Slingshot", svg="3-slingshot.svg",
         pitch="A gravity assist. The ship swings round a planet and leaves faster than it arrived: the dashed curve is the approach, the straight line is the acceleration.",
         strong="The only one that tells acceleration as a story. Flat colour holds at every size.",
         watch="The ship is small. At a glance it reads planet first, ship second."),
    dict(n="4", name="Monogram", svg="4-monogram.svg",
         pitch="The ship is the letter. Nose for the apex of the A, fins for its legs, engine ring for its crossbar, burn in the counter.",
         strong="The sharpest of all six at 16 px, and the A ties the icon to the name.",
         watch="The least literal about space. It is a brand mark rather than a picture."),
    dict(n="5", name="Mission Patch", svg="5-patch.svg",
         pitch="A mid-century crew patch: ACCELERATE stitched round the rim, a finned rocket climbing out of its launch arc, a ringed planet.",
         strong="The most character, and the only one with the name inside the design.",
         watch="The name is unreadable below about 96 px. Small, it is a round badge."),
    dict(n="6", name="Afterburn", svg="6-afterburn.svg",
         pitch="A delta-wing ship reduced to an arrowhead, with two afterimages of where it was a moment ago. The gap between them is the speed.",
         strong="Minimal, instantly readable at any size, and the one least likely to date.",
         watch="The most abstract. It is a starship mostly because you are told it is."),
]

ROUND2 = [
    dict(n="2", name="Warp, as it was", svg="2-warp.svg", group="The two you picked", ref=True,
         pitch="The original, for comparison. Cinematic at size, noise at 16 px.",
         strong="The drama everything in the first group is trying to keep.",
         watch="The 16 px problem everything in the first group is trying to fix."),
    dict(n="6", name="Afterburn, as it was", svg="6-afterburn.svg", group="The two you picked", ref=True,
         pitch="The original, for comparison. Crisp at every size, but an arrow first and a ship second.",
         strong="The clarity everything in the second group is trying to keep.",
         watch="The abstraction everything in the second group is trying to fix."),

    dict(n="7", name="Warp, bold", svg="7-warp-bold.svg", group="Warp, rebuilt for small sizes",
         pitch="Forty heavy rays instead of a hundred and twenty hairlines, and the ship a third larger.",
         strong="Keeps almost all of the drama and loses most of the noise.",
         watch="Still the busiest of the Warp family at 16 px."),
    dict(n="8", name="Hyperspace", svg="8-hyperspace.svg", group="Warp, rebuilt for small sizes",
         pitch="The tunnel instead of the streaks. The ship flies down a corridor of receding rings towards a point of light.",
         strong="Rings are bold shapes, so it reads as a tunnel even at 16 px.",
         watch="At a glance, small, it can read as a target rather than a jump."),
    dict(n="9", name="Cold Jump", svg="9-cold-jump.svg", group="Warp, rebuilt for small sizes",
         pitch="Monochrome: ice and white on black, the ship a silhouette with a white edge.",
         strong="The most elegant of the set. Colourless things date slowest.",
         watch="Loses the cyan and magenta that made the original feel electric."),

    dict(n="10", name="Craft", svg="10-craft.svg", group="Afterburn, more ship",
         pitch="The arrowhead given a canopy, a spine, a notched tail and twin engines. Same ghosts behind.",
         strong="Now unmistakably a ship, and still crisp small.",
         watch="The notched tail makes the ghosts behind it look stepped."),
    dict(n="11", name="Contrails", svg="11-contrails.svg", group="Afterburn, more ship",
         pitch="No ghosts. Speed carried by two long wingtip contrails and a real engine plume.",
         strong="The cleanest composition in either round. One shape, two lines.",
         watch="Calmer than the others. Speed rather than acceleration."),
    dict(n="12", name="Neon", svg="12-neon.svg", group="Afterburn, more ship",
         pitch="The original mark on a loud electric-blue to magenta gradient. The app-store version.",
         strong="The most visible on a crowded desktop, and flawless at 16 px.",
         watch="Loses the sense of space entirely. It is a brand, not a scene."),

    dict(n="13", name="Jump", svg="13-jump.svg", group="The two crossed",
         pitch="Afterburn's crisp ship flying straight into Warp's vanishing point, the stars streaming past it.",
         strong="The best of both: Warp's drama with a ship you can still see at 16 px.",
         watch="The busiest background in the second round."),
    dict(n="14", name="Lightspeed", svg="14-lightspeed.svg", group="The two crossed",
         pitch="The afterimages stretched until they become streaks. Everything smeared in one direction, like a long exposure.",
         strong="The strongest single sense of speed in either round.",
         watch="The parallel streaks need space to read, so it is best at 48 px and up."),
    dict(n="15", name="Portal", svg="15-portal.svg", group="The two crossed",
         pitch="The ship bursting out of a portal, the warp tunnel still visible receding inside it.",
         strong="The most narrative of the hybrids: you see where it has come from.",
         watch="Two focal points, the ship and the ring, compete at small sizes."),
]

CSS = """
  :root {
    --bg: #0B0C10; --panel: #13151C; --line: #242834; --ink: #ECEEF5;
    --mid: #A8AEC0; --dim: #6E7488; --hot: #FF7A3D;
    --sans: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--sans);
    -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 44px 24px 80px; }
  .over { font-size: 12px; letter-spacing: 0.32em; color: var(--hot); font-weight: 700; }
  h1 { font-size: 44px; line-height: 1.05; margin: 10px 0 10px; letter-spacing: -0.02em; font-weight: 800; }
  .sub { color: var(--mid); font-size: 16px; max-width: 66ch; line-height: 1.55; margin: 0; }
  h3.group { font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--mid);
    margin: 40px 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }

  .desk { margin: 34px 0 10px; border-radius: 18px; padding: 34px 26px 34px; position: relative; overflow: hidden;
    background:
      radial-gradient(120% 90% at 18% 20%, #3A4BD8 0%, transparent 55%),
      radial-gradient(90% 80% at 85% 80%, #B8367A 0%, transparent 55%),
      linear-gradient(135deg, #1B1F4A, #0B0C1C); }
  .desk::after { content: "On your desktop, at the size Windows actually draws it"; position: absolute;
    right: 18px; bottom: 12px; font-size: 11px; color: rgba(255,255,255,0.55); letter-spacing: 0.04em; }
  .deskrow { display: flex; gap: 10px; flex-wrap: wrap; }
  .dicon { width: 92px; display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 8px 4px 6px; border-radius: 6px; position: relative; }
  .dicon:hover { background: rgba(255,255,255,0.12); }
  .dicon.ref { opacity: 0.55; }
  .dicon img { filter: drop-shadow(0 3px 6px rgba(0,0,0,0.45)); }
  .dicon .lbl { font-size: 12px; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.9); }
  .dicon .num { position: absolute; top: 0; left: 6px; font-size: 11px; font-weight: 800; min-width: 20px;
    text-align: center; background: var(--hot); color: #1A0A00; border-radius: 10px; padding: 1px 6px; }
  .dicon.ref .num { background: #6E7488; color: #fff; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(540px, 1fr)); gap: 18px; }
  .card { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 18px 20px 16px; }
  .card.ref { border-style: dashed; opacity: 0.85; }
  .card header { display: flex; align-items: baseline; gap: 12px; }
  .card .n { font-size: 13px; font-weight: 800; color: var(--hot); letter-spacing: 0.08em; }
  .card.ref .n { color: var(--dim); }
  .card h2 { margin: 0; font-size: 22px; font-weight: 750; letter-spacing: -0.01em; }
  .body { display: grid; grid-template-columns: 220px 1fr; gap: 20px; margin-top: 14px; align-items: start; }
  .stage { width: 220px; height: 220px; border-radius: 14px; display: grid; place-items: center;
    background: radial-gradient(circle at 50% 42%, #242838, #11131A 70%); }
  .hero { filter: drop-shadow(0 10px 22px rgba(0,0,0,0.5)); }
  .pitch { margin: 0 0 14px; color: var(--mid); font-size: 13.5px; line-height: 1.55; }
  .ladder { display: flex; align-items: flex-end; gap: 14px; padding: 10px 12px; border-radius: 10px; margin-bottom: 8px; }
  .ladder.dark { background: #0A0B0F; }
  .ladder.light { background: #EDEFF4; }
  .rung { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .rung i { font-style: normal; font-size: 10px; color: var(--dim); }
  .ladder.light .rung i { color: #8A90A2; }
  .mocks { display: flex; gap: 10px; align-items: center; margin-top: 4px; }
  .tab { display: flex; align-items: center; gap: 8px; background: #2A2D38; border-radius: 8px 8px 0 0;
    padding: 7px 12px; font-size: 12px; color: #E3E6EE; min-width: 170px; }
  .tab b { margin-left: auto; font-weight: 400; color: #8A90A2; }
  .bar { display: flex; align-items: center; justify-content: center; width: 44px; height: 40px;
    background: #1C1E26; border-radius: 6px; position: relative; }
  .bar::after { content: ""; position: absolute; bottom: 3px; width: 14px; height: 3px; border-radius: 2px; background: #6FA8FF; }
  dl { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 16px 0 0; padding-top: 14px; border-top: 1px solid var(--line); }
  dt { font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim); margin-bottom: 4px; }
  dd { margin: 0; font-size: 13px; line-height: 1.5; color: var(--ink); }
  .foot { margin-top: 36px; color: var(--mid); font-size: 15px; }
  .foot b { color: var(--ink); }
  @media (max-width: 640px) {
    .grid { grid-template-columns: 1fr; }
    .body { grid-template-columns: 1fr; }
    .stage { width: 100%; }
    h1 { font-size: 32px; }
  }
"""


def card(c):
    ladder = "".join('<div class="rung">%s<i>%d</i></div>' % (img(pick(c, p), p), p) for p in LADDER)
    return """
<article class="card%s">
  <header><span class="n">%s</span><h2>%s</h2></header>
  <div class="body">
    <div class="stage">%s</div>
    <div class="info">
      <p class="pitch">%s</p>
      <div class="ladder dark">%s</div>
      <div class="ladder light">%s</div>
      <div class="mocks">
        <div class="tab">%s<span>Accelerate</span><b>&#215;</b></div>
        <div class="bar">%s</div>
      </div>
    </div>
  </div>
  <dl>
    <div><dt>Strong</dt><dd>%s</dd></div>
    <div><dt>Watch</dt><dd>%s</dd></div>
  </dl>
</article>""" % (" ref" if c.get("ref") else "", c["n"], c["name"], img(uri(c["svg"]), 200, "hero"),
                 c["pitch"], ladder, ladder, img(pick(c, 16), 16), img(pick(c, 24), 24),
                 c["strong"], c["watch"])


def build(concepts, out_name, over, h1, sub, foot):
    desk = "".join(
        '<div class="dicon%s"><span class="num">%s</span>%s<span class="lbl">Accelerate</span></div>'
        % (" ref" if c.get("ref") else "", c["n"], img(pick(c, 64), 64)) for c in concepts
    )
    parts, last = [], None
    for c in concepts:
        g = c.get("group")
        if g and g != last:
            if last is not None:
                parts.append("</div>")
            parts.append('<h3 class="group">%s</h3><div class="grid">' % g)
            last = g
        elif last is None and not g and not parts:
            parts.append('<div class="grid">')
            last = ""
        parts.append(card(c))
    parts.append("</div>")

    page = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Accelerate icon</title>
<style>%s</style>
</head>
<body>
<div class="wrap">
  <div class="over">%s</div>
  <h1>%s</h1>
  <p class="sub">%s</p>
  <div class="desk"><div class="deskrow">%s</div></div>
  %s
  <p class="foot">%s</p>
</div>
</body>
</html>
""" % (CSS, over, h1, sub, desk, "".join(parts), foot)
    out = os.path.join(HERE, out_name)
    io.open(out, "w", encoding="utf-8", newline="").write(page)
    print("wrote", out, "%d KB" % (len(page) // 1024))


if __name__ == "__main__":
    if sys.argv[1:] == ["2"]:
        build(ROUND2, "gallery-2.html", "ACCELERATE &middot; ICON &middot; ROUND TWO",
              "Nine more, around Warp and Afterburn.",
              "Warp's one weakness was 16 px. Afterburn's was that it read as an arrow before a ship. "
              "The first group fixes Warp, the second fixes Afterburn, and the third crosses them. "
              "The two originals sit first, dashed and greyed on the desktop, so every new one can be judged against what it came from.",
              "<b>Tell me the number.</b> Or two numbers and a sentence, if the answer is half of one and half of another.")
    else:
        build(ROUND1, "gallery.html", "ACCELERATE &middot; ICON", "Six directions. Pick one.",
              "Every icon below is the real SVG, drawn by the browser at each size it will actually live at: "
              "a 64&nbsp;px desktop tile down to a 16&nbsp;px browser tab. Judge them small, not just big. An icon is mostly seen small.",
              "<b>Tell me the number.</b> I will build the multi-size .ico from it, put it on the Accelerate shortcut, and use it as the tab icon.")
