"""Render accelerate.svg to PNG with headless Edge and build accelerate.ico.

Edge rather than a Python SVG library, because it renders gradients and
filters exactly as a browser does and it is on every Windows 11 machine. The
SVG is rendered once at 512 px and downsampled to each icon size, since a
headless window is not reliable at 16 px.

    python brand/render.py

Writes accelerate.ico (sixteen to two hundred and fifty six pixels, each a
32-bit PNG entry), accelerate-32.png for the favicon fallback, and
accelerate-256.png.
"""
import io
import os
import struct
import subprocess
import sys
import tempfile

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
BASE = 512


def render(svg_name, out_name, px=BASE):
    svg = os.path.join(HERE, svg_name)
    out = os.path.join(HERE, out_name)
    with tempfile.TemporaryDirectory() as tmp:
        page = os.path.join(tmp, "wrap.html")
        with io.open(page, "w", encoding="utf-8") as f:
            f.write(
                '<!doctype html><html><body style="margin:0;background:transparent">'
                '<img src="file:///%s" width="%d" height="%d" style="display:block">'
                "</body></html>" % (svg.replace("\\", "/"), px, px)
            )
        cmd = [
            EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--default-background-color=00000000",
            "--allow-file-access-from-files",
            "--user-data-dir=" + os.path.join(tmp, "profile"),
            "--window-size=%d,%d" % (px, px),
            "--screenshot=" + out,
            "file:///" + page.replace("\\", "/"),
        ]
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if not os.path.exists(out):
            sys.exit("render failed for %s\n%s" % (svg_name, r.stderr[-2000:]))
    return out


def size(src, px):
    return Image.open(src).convert("RGBA").resize((px, px), Image.LANCZOS)


def write_ico(path, images):
    """images: list of (px, PIL.Image). PNG-compressed entries, which every
    Windows since Vista reads at every size."""
    blobs = []
    for px, im in images:
        b = io.BytesIO()
        im.save(b, format="PNG")
        blobs.append((px, b.getvalue()))
    header = struct.pack("<HHH", 0, 1, len(blobs))
    offset = 6 + 16 * len(blobs)
    entries, data = b"", b""
    for px, blob in blobs:
        dim = 0 if px >= 256 else px
        entries += struct.pack("<BBBBHHII", dim, dim, 0, 0, 1, 32, len(blob), offset)
        offset += len(blob)
        data += blob
    with open(path, "wb") as f:
        f.write(header + entries + data)


def final():
    src = render("accelerate.svg", "craft-512.png")
    plan = [16, 20, 24, 32, 40, 48, 64, 96, 128, 256]
    write_ico(os.path.join(HERE, "accelerate.ico"), [(px, size(src, px)) for px in plan])
    size(src, 32).save(os.path.join(HERE, "accelerate-32.png"))
    size(src, 256).save(os.path.join(HERE, "accelerate-256.png"))
    print("wrote accelerate.ico with", ", ".join(str(p) for p in plan))


if __name__ == "__main__":
    final()
