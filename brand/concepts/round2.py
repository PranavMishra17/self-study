"""Round two: nine variants around 2 (Warp) and 6 (Afterburn).

Warp's weakness was 16 px, where a hundred hairline streaks become noise.
Afterburn's was that it reads as an arrow first and a ship second. The three
groups below each attack one of those, and the last group crosses the two.

Every streak field is seeded, so a rerun reproduces the same picture.
"""
import math
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
TILE = '<clipPath id="tile"><rect width="256" height="256" rx="56"/></clipPath>'


def svg(title, defs, body):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">\n'
        f"  <title>Accelerate, {title}</title>\n"
        f"  <defs>{defs}{TILE}</defs>\n"
        f'  <g clip-path="url(#tile)">{body}</g>\n'
        "</svg>\n"
    )


def streak(cx, cy, th, r0, r1, w0, w1, col, op):
    """A tapered wedge along angle th. Polygons, not lines: a bounding-box
    gradient or a round cap on a zero-width line misbehaves, a polygon never does."""
    c, s = math.cos(th), math.sin(th)
    px, py = -s, c
    pts = [
        (cx + r0 * c + w0 * px, cy + r0 * s + w0 * py),
        (cx + r1 * c + w1 * px, cy + r1 * s + w1 * py),
        (cx + r1 * c - w1 * px, cy + r1 * s - w1 * py),
        (cx + r0 * c - w0 * px, cy + r0 * s - w0 * py),
    ]
    d = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    return f'<polygon points="{d}" fill="{col}" opacity="{op:.2f}"/>'


def rays(seed, cx, cy, n, r0, ln, w1, palette, op, w0=0.4, bias=1.0):
    rnd = random.Random(seed)
    out = []
    for _ in range(n):
        th = rnd.uniform(0, 2 * math.pi)
        a = rnd.uniform(*r0)
        b = a + ln[0] + (rnd.random() ** bias) * (ln[1] - ln[0])
        roll, acc, col = rnd.random(), 0.0, palette[-1][0]
        for c, w in palette:
            acc += w
            if roll < acc:
                col = c
                break
        out.append(streak(cx, cy, th, a, b, w0, rnd.uniform(*w1), col, rnd.uniform(*op)))
    return "".join(out)


# ------------------------------------------------------------ shared parts

WARP_DEFS = """
<radialGradient id="engine" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.45" stop-color="#8CFBFF"/><stop offset="1" stop-color="#1E7BFF"/>
</radialGradient>
<linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#2A2D4A"/><stop offset="1" stop-color="#07070F"/>
</linearGradient>
<filter id="soft" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="9"/></filter>
"""


def rear_ship(rim="#8FF3FF", hull="url(#hull)", engine="url(#engine)", glow="#39E6FF", rimw=1.6):
    """The Warp ship from behind, in its original coordinates around (128, 140)."""
    return f"""
<circle cx="128" cy="150" r="30" fill="{glow}" opacity="0.55" filter="url(#soft)"/>
<path d="M 60 154 L 128 118 L 196 154 L 186 162 L 128 150 L 70 162 Z" fill="{hull}" stroke="{rim}" stroke-width="{rimw}" stroke-linejoin="round"/>
<path d="M 128 98 L 138 136 L 118 136 Z" fill="{hull}" stroke="{rim}" stroke-width="{rimw * 0.9:.2f}" stroke-linejoin="round"/>
<ellipse cx="128" cy="148" rx="22" ry="13" fill="#0B0B18" stroke="{rim}" stroke-width="{rimw * 0.9:.2f}"/>
<circle cx="113" cy="151" r="6" fill="{engine}"/>
<circle cx="128" cy="153" r="6.8" fill="{engine}"/>
<circle cx="143" cy="151" r="6" fill="{engine}"/>
"""


ARROW = "M 0 -60 L 42 52 L 0 28 L -42 52 Z"
ARROW_LEFT = "M 0 -60 L 0 28 L -42 52 Z"
AFTER_DEFS = """
<linearGradient id="lead" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#9DB8FF"/>
</linearGradient>
<radialGradient id="spark" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.35" stop-color="#FFC04D"/><stop offset="1" stop-color="#FF5A1F" stop-opacity="0"/>
</radialGradient>
"""

VARIANTS = {}

# ================================================= Warp, rebuilt for 16 px

# 7. Fewer, bolder rays and a bigger ship: the drama kept, the noise removed.
VARIANTS["7-warp-bold"] = svg("warp bold", WARP_DEFS + """
<radialGradient id="deep" cx="0.5" cy="0.52" r="0.72">
  <stop offset="0" stop-color="#34106B"/><stop offset="0.45" stop-color="#0E0426"/><stop offset="1" stop-color="#020106"/>
</radialGradient>
<radialGradient id="core" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.95"/><stop offset="0.3" stop-color="#9FF8FF" stop-opacity="0.55"/><stop offset="1" stop-color="#3A7BFF" stop-opacity="0"/>
</radialGradient>
""", '<rect width="256" height="256" fill="url(#deep)"/>'
    + rays(11, 128, 132, 40, (30, 52), (110, 210), (3.2, 7.0),
           [("#6CF3FF", 0.62), ("#FF5AD9", 0.26), ("#FFFFFF", 0.12)], (0.55, 1.0), w0=0.8, bias=0.7)
    + '<circle cx="128" cy="132" r="84" fill="url(#core)"/>'
    + '<g transform="translate(128 140) scale(1.3) translate(-128 -140)">' + rear_ship(rimw=1.8) + "</g>")

# 8. The tunnel instead of the streaks: rings are bold at every size.
tunnel = []
for k in range(10):
    r = 10 * 1.42 ** k
    t = k / 9
    col = "#%02X%02X%02X" % (int(0x5E + t * (0xFF - 0x5E)), int(0xF0 - t * (0xF0 - 0x4F)), int(0xFF - t * (0xFF - 0xD8)))
    tunnel.append(f'<ellipse cx="128" cy="104" rx="{r:.1f}" ry="{r * 0.9:.1f}" fill="none" stroke="{col}" '
                  f'stroke-width="{0.8 + k * 0.75:.2f}" opacity="{0.32 + k * 0.065:.2f}"/>')
spokes = "".join(streak(128, 104, i * math.pi / 8 + 0.2, 6, 240, 0.3, 2.2, "#9FF8FF", 0.22) for i in range(16))
VARIANTS["8-hyperspace"] = svg("hyperspace", WARP_DEFS + """
<radialGradient id="deep" cx="0.5" cy="0.4" r="0.7">
  <stop offset="0" stop-color="#3B0E63"/><stop offset="0.5" stop-color="#0C0420"/><stop offset="1" stop-color="#030108"/>
</radialGradient>
<radialGradient id="dest" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.4" stop-color="#FFB8F2" stop-opacity="0.7"/><stop offset="1" stop-color="#FF4FD8" stop-opacity="0"/>
</radialGradient>
""", '<rect width="256" height="256" fill="url(#deep)"/>' + spokes + "".join(tunnel)
    + '<circle cx="128" cy="104" r="26" fill="url(#dest)"/>'
    + '<g transform="translate(0 36) translate(128 140) scale(1.05) translate(-128 -140)">' + rear_ship() + "</g>")

# 9. Monochrome: ice and white on black. The calmest version of the jump.
VARIANTS["9-cold-jump"] = svg("cold jump", """
<radialGradient id="engine" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.6" stop-color="#DDF4FF"/><stop offset="1" stop-color="#7FC8FF"/>
</radialGradient>
<filter id="soft" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="9"/></filter>
<radialGradient id="deep" cx="0.5" cy="0.52" r="0.75">
  <stop offset="0" stop-color="#15223F"/><stop offset="0.55" stop-color="#060A14"/><stop offset="1" stop-color="#000000"/>
</radialGradient>
<radialGradient id="core" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="0.35" stop-color="#CFEFFF" stop-opacity="0.35"/><stop offset="1" stop-color="#CFEFFF" stop-opacity="0"/>
</radialGradient>
""", '<rect width="256" height="256" fill="url(#deep)"/>'
    + rays(23, 128, 132, 70, (34, 56), (60, 200), (1.2, 3.8),
           [("#FFFFFF", 0.6), ("#BFE9FF", 0.4)], (0.35, 0.95), bias=0.9)
    + '<circle cx="128" cy="132" r="76" fill="url(#core)"/>'
    + '<g transform="translate(128 140) scale(1.2) translate(-128 -140)">'
    + rear_ship(rim="#FFFFFF", hull="#000000", glow="#BFE9FF", rimw=2.0) + "</g>")

# ================================================= Afterburn, more ship

CRAFT = "M 0 -66 L 11 -24 L 46 42 L 30 50 L 11 36 L 0 42 L -11 36 L -30 50 L -46 42 L -11 -24 Z"
CRAFT_SHADE = "M 0 -66 L 11 -24 L 46 42 L 30 50 L 11 36 L 0 42 Z"
VOID = """
<radialGradient id="void" cx="0.62" cy="0.36" r="0.8">
  <stop offset="0" stop-color="#172042"/><stop offset="0.6" stop-color="#090B16"/><stop offset="1" stop-color="#040509"/>
</radialGradient>
"""

# 10. The arrowhead given a canopy, a spine, a notched tail and twin engines.
VARIANTS["10-craft"] = svg("craft", AFTER_DEFS + VOID, """
<rect width="256" height="256" fill="url(#void)"/>
<g fill="#FFFFFF" opacity="0.55"><circle cx="46" cy="52" r="1.3"/><circle cx="196" cy="206" r="1.1"/><circle cx="220" cy="120" r="1"/><circle cx="120" cy="30" r="0.9"/></g>
<g transform="translate(150 104) rotate(45)">
  <path d="%s" transform="translate(0 94) scale(0.84)" fill="#2F5BFF" opacity="0.22"/>
  <path d="%s" transform="translate(0 47) scale(0.92)" fill="#3D72FF" opacity="0.5"/>
  <circle cx="-11" cy="40" r="14" fill="url(#spark)"/>
  <circle cx="11" cy="40" r="14" fill="url(#spark)"/>
  <path d="%s" fill="url(#lead)"/>
  <path d="%s" fill="#1B2B66" opacity="0.2"/>
  <rect x="-1" y="-44" width="2" height="80" fill="#7F9BFF" opacity="0.55"/>
  <ellipse cx="0" cy="-24" rx="5.6" ry="11.5" fill="#16204A"/>
  <ellipse cx="-1.6" cy="-28" rx="1.8" ry="4.2" fill="#FFFFFF" opacity="0.75"/>
</g>
""" % (CRAFT, CRAFT, CRAFT, CRAFT_SHADE))

# 11. No ghosts: wingtip contrails and a real plume carry the speed instead.
VARIANTS["11-contrails"] = svg("contrails", AFTER_DEFS + """
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#101845"/><stop offset="1" stop-color="#03040B"/>
</linearGradient>
<linearGradient id="trail" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#CFDCFF" stop-opacity="0.95"/><stop offset="1" stop-color="#CFDCFF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="plume" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#FFF3C4"/><stop offset="0.3" stop-color="#FFAA33"/><stop offset="1" stop-color="#FF4A1F" stop-opacity="0"/>
</linearGradient>
""", """
<rect width="256" height="256" fill="url(#bg)"/>
<g fill="#FFFFFF" opacity="0.6"><circle cx="40" cy="44" r="1.4"/><circle cx="92" cy="26" r="1"/><circle cx="214" cy="178" r="1.2"/><circle cx="230" cy="108" r="0.9"/></g>
<g transform="translate(160 96) rotate(45) scale(0.95)">
  <rect x="39.5" y="50" width="3" height="170" rx="1.5" fill="url(#trail)"/>
  <rect x="-42.5" y="50" width="3" height="170" rx="1.5" fill="url(#trail)"/>
  <path d="M -12 28 C -14 70 -4 104 0 140 C 4 104 14 70 12 28 Z" fill="url(#plume)"/>
  <path d="%s" fill="url(#lead)"/>
  <path d="%s" fill="#FFFFFF" opacity="0.35"/>
</g>
""" % (ARROW, ARROW_LEFT))

# 12. The same mark on a loud gradient: the app-store version.
VARIANTS["12-neon"] = svg("neon", """
<linearGradient id="pop" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#1F3DFF"/><stop offset="0.55" stop-color="#7A2BFF"/><stop offset="1" stop-color="#FF3D8B"/>
</linearGradient>
<radialGradient id="flare" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.4" stop-color="#FFE08A"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/>
</radialGradient>
""", """
<rect width="256" height="256" fill="url(#pop)"/>
<circle cx="214" cy="40" r="120" fill="#FFFFFF" opacity="0.09"/>
<g transform="translate(150 104) rotate(45)">
  <path d="%s" transform="translate(0 92) scale(0.84)" fill="#FFFFFF" opacity="0.16"/>
  <path d="%s" transform="translate(0 46) scale(0.92)" fill="#FFFFFF" opacity="0.34"/>
  <circle cx="0" cy="34" r="20" fill="url(#flare)"/>
  <path d="%s" fill="#FFFFFF"/>
  <path d="M 0 -60 L 42 52 L 0 28 Z" fill="#DCE3FF"/>
</g>
""" % (ARROW, ARROW, ARROW))

# ================================================= the two crossed

# 13. Afterburn's crisp ship flying into Warp's vanishing point.
V = (206, 50)
VARIANTS["13-jump"] = svg("jump", AFTER_DEFS + """
<radialGradient id="deep" cx="0.8" cy="0.2" r="0.95">
  <stop offset="0" stop-color="#4A1A8C"/><stop offset="0.4" stop-color="#140630"/><stop offset="1" stop-color="#030108"/>
</radialGradient>
<radialGradient id="core" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.3" stop-color="#9FF8FF" stop-opacity="0.7"/><stop offset="1" stop-color="#3A7BFF" stop-opacity="0"/>
</radialGradient>
""", '<rect width="256" height="256" fill="url(#deep)"/>'
    + rays(31, V[0], V[1], 90, (6, 30), (60, 280), (0.8, 3.0),
           [("#6CF3FF", 0.58), ("#FF5AD9", 0.28), ("#FFFFFF", 0.14)], (0.35, 0.95), bias=0.8)
    + f'<circle cx="{V[0]}" cy="{V[1]}" r="48" fill="url(#core)"/>'
    + """<g transform="translate(116 140) rotate(45) scale(1.08)">
  <path d="%s" transform="translate(0 46) scale(0.92)" fill="#3D72FF" opacity="0.35"/>
  <circle cx="0" cy="34" r="22" fill="url(#spark)"/>
  <path d="%s" fill="url(#lead)"/>
  <path d="%s" fill="#FFFFFF" opacity="0.35"/>
</g>""" % (ARROW, ARROW, ARROW_LEFT))

# 14. The ghosts stretched until they become streaks: motion blur, all parallel.
rnd = random.Random(41)
par = []
d = (math.cos(-math.pi / 4), math.sin(-math.pi / 4))
for _ in range(46):
    x, y = rnd.uniform(-20, 276), rnd.uniform(-20, 276)
    ln = rnd.uniform(18, 90)
    th = math.atan2(-d[1], -d[0])
    par.append(streak(x, y, th, 0, ln, rnd.uniform(0.9, 1.9), 0.15,
                      rnd.choice(["#FFFFFF", "#CFE3FF", "#6CF3FF"]), rnd.uniform(0.2, 0.75)))
smear = []
for i, (ox, w, ln, col, op) in enumerate([(-38, 3.2, 150, "#6CF3FF", 0.85), (38, 3.2, 140, "#6CF3FF", 0.85),
                                           (-20, 2.2, 120, "#FF5AD9", 0.7), (20, 2.2, 116, "#FF5AD9", 0.7),
                                           (0, 4.2, 176, "#FFFFFF", 0.9)]):
    y0 = 44 if ox else 30
    smear.append(f'<polygon points="{ox - w},{y0} {ox + w},{y0} {ox + 0.4},{y0 + ln} {ox - 0.4},{y0 + ln}" fill="{col}" opacity="{op}"/>')
VARIANTS["14-lightspeed"] = svg("lightspeed", AFTER_DEFS + """
<radialGradient id="deep" cx="0.75" cy="0.25" r="0.9">
  <stop offset="0" stop-color="#20245A"/><stop offset="0.55" stop-color="#07081A"/><stop offset="1" stop-color="#020206"/>
</radialGradient>
""", '<rect width="256" height="256" fill="url(#deep)"/>' + "".join(par)
    + '<g transform="translate(152 104) rotate(45)">' + "".join(smear)
    + """<circle cx="0" cy="34" r="20" fill="url(#spark)"/>
  <path d="%s" fill="url(#lead)"/>
  <path d="%s" fill="#FFFFFF" opacity="0.35"/>
</g>""" % (ARROW, ARROW_LEFT))

# 15. The ship bursting out of a portal, with the warp still visible inside it.
PC = (88, 172)
# Rings receding into the mouth, not rays: rays converging on a point read as
# the spokes of a wheel, rings read as depth.
inner = "".join(
    f'<ellipse cx="{PC[0]}" cy="{PC[1]}" rx="{72 * 0.72 ** k:.1f}" ry="{30 * 0.72 ** k:.1f}" '
    f'transform="rotate(-38 {PC[0]} {PC[1]})" fill="none" '
    f'stroke="{"#6CF3FF" if k % 2 else "#FF5AD9"}" stroke-width="{2.4 - k * 0.2:.2f}" opacity="{0.85 - k * 0.07:.2f}"/>'
    for k in range(1, 9)
)
VARIANTS["15-portal"] = svg("portal", AFTER_DEFS + f"""
<radialGradient id="deep" cx="0.35" cy="0.7" r="0.9">
  <stop offset="0" stop-color="#2A0C52"/><stop offset="0.5" stop-color="#0B0420"/><stop offset="1" stop-color="#020106"/>
</radialGradient>
<linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#6CF3FF"/><stop offset="1" stop-color="#FF4FD8"/>
</linearGradient>
<radialGradient id="mouth" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.35" stop-color="#9FF8FF" stop-opacity="0.6"/><stop offset="1" stop-color="#1A0A3A" stop-opacity="0.95"/>
</radialGradient>
<clipPath id="gate"><ellipse cx="{PC[0]}" cy="{PC[1]}" rx="72" ry="30" transform="rotate(-38 {PC[0]} {PC[1]})"/></clipPath>
<filter id="glow" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>
""", f"""
<rect width="256" height="256" fill="url(#deep)"/>
<g fill="#FFFFFF" opacity="0.55"><circle cx="186" cy="36" r="1.3"/><circle cx="226" cy="96" r="1"/><circle cx="150" cy="22" r="0.9"/><circle cx="214" cy="196" r="1.2"/></g>
<ellipse cx="{PC[0]}" cy="{PC[1]}" rx="72" ry="30" transform="rotate(-38 {PC[0]} {PC[1]})" fill="url(#mouth)"/>
<g clip-path="url(#gate)">{inner}</g>
<ellipse cx="{PC[0]}" cy="{PC[1]}" rx="72" ry="30" transform="rotate(-38 {PC[0]} {PC[1]})" fill="none" stroke="url(#ring)" stroke-width="9" filter="url(#glow)" opacity="0.8"/>
<ellipse cx="{PC[0]}" cy="{PC[1]}" rx="72" ry="30" transform="rotate(-38 {PC[0]} {PC[1]})" fill="none" stroke="url(#ring)" stroke-width="4.5"/>
<g transform="translate(150 106) rotate(45) scale(0.98)">
  <circle cx="0" cy="34" r="22" fill="url(#spark)"/>
  <path d="{ARROW}" fill="url(#lead)"/>
  <path d="{ARROW_LEFT}" fill="#FFFFFF" opacity="0.35"/>
</g>
""")

if __name__ == "__main__":
    for name, text in VARIANTS.items():
        with open(os.path.join(HERE, name + ".svg"), "w", encoding="utf-8") as f:
            f.write(text)
    print("wrote", len(VARIANTS), "variants:", ", ".join(VARIANTS))
