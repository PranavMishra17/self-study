"""Concept 2, Warp: the ship seen from behind at the moment of the jump, stars
stretched into streaks converging on a vanishing point. Generated, because a
hundred tapered streaks are not something to place by hand. Seeded, so the
output is identical every run."""
import math
import os
import random

random.seed(7)
C = 128.0
streaks = []
for i in range(120):
    th = random.uniform(0, 2 * math.pi)
    r0 = 26 + random.random() * 42
    ln = 28 + (random.random() ** 1.6) * 170
    r1 = r0 + ln
    w0, w1 = 0.35, 0.9 + random.random() * 2.4
    roll = random.random()
    col = "#6CF3FF" if roll < 0.58 else ("#FF5AD9" if roll < 0.84 else "#FFFFFF")
    op = 0.3 + random.random() * 0.65
    c, s = math.cos(th), math.sin(th)
    px, py = -s, c
    pts = [
        (C + r0 * c + w0 * px, C + r0 * s + w0 * py),
        (C + r1 * c + w1 * px, C + r1 * s + w1 * py),
        (C + r1 * c - w1 * px, C + r1 * s - w1 * py),
        (C + r0 * c - w0 * px, C + r0 * s - w0 * py),
    ]
    d = " ".join("%.1f,%.1f" % p for p in pts)
    streaks.append('<polygon points="%s" fill="%s" opacity="%.2f"/>' % (d, col, op))

svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <title>Accelerate, warp</title>
  <defs>
    <radialGradient id="deep" cx="0.5" cy="0.5" r="0.72">
      <stop offset="0" stop-color="#2A0F55"/>
      <stop offset="0.45" stop-color="#0C0420"/>
      <stop offset="1" stop-color="#020106"/>
    </radialGradient>
    <radialGradient id="core" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="0.25" stop-color="#9FF8FF" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#3A7BFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="engine" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="0.45" stop-color="#8CFBFF"/>
      <stop offset="1" stop-color="#1E7BFF"/>
    </radialGradient>
    <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2A2D4A"/>
      <stop offset="1" stop-color="#07070F"/>
    </linearGradient>
    <filter id="soft" x="-80%%" y="-80%%" width="260%%" height="260%%">
      <feGaussianBlur stdDeviation="9"/>
    </filter>
    <clipPath id="tile"><rect width="256" height="256" rx="56"/></clipPath>
  </defs>
  <g clip-path="url(#tile)">
    <rect width="256" height="256" fill="url(#deep)"/>
    <g>%s</g>
    <circle cx="128" cy="128" r="74" fill="url(#core)"/>

    <!-- the ship from behind: swept wings, a spine, a dorsal fin, three engines -->
    <g>
      <circle cx="128" cy="150" r="30" fill="#39E6FF" opacity="0.55" filter="url(#soft)"/>
      <path d="M 60 154 L 128 118 L 196 154 L 186 162 L 128 150 L 70 162 Z"
            fill="url(#hull)" stroke="#8FF3FF" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M 128 98 L 138 136 L 118 136 Z"
            fill="url(#hull)" stroke="#8FF3FF" stroke-width="1.4" stroke-linejoin="round"/>
      <ellipse cx="128" cy="148" rx="22" ry="13" fill="#0B0B18" stroke="#8FF3FF" stroke-width="1.4"/>
      <circle cx="113" cy="151" r="6" fill="url(#engine)"/>
      <circle cx="128" cy="153" r="6.8" fill="url(#engine)"/>
      <circle cx="143" cy="151" r="6" fill="url(#engine)"/>
      <circle cx="63" cy="155" r="2.2" fill="#FF5AD9"/>
      <circle cx="193" cy="155" r="2.2" fill="#FF5AD9"/>
    </g>
  </g>
</svg>
""" % "".join(streaks)

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "2-warp.svg")
open(out, "w", encoding="utf-8").write(svg)
print("wrote", out, "with", len(streaks), "streaks")
