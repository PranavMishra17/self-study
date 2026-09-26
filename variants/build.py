"""Build variants/sessions.html: five layouts for one tracker session, on real content.

    python variants/build.py

The session (week 2, How work splits) and its two figures come from variants/w2a.json,
dumped from index.html by running the tracker's own figure builders. The quiz uses the
same rule as the interview pages: open questions with a model answer, at most eight.
"""
import io, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "interviews"))
from build import quiz_for  # noqa: E402

data = json.load(io.open(os.path.join(HERE, "w2a.json"), encoding="utf-8"))
data["quiz"] = quiz_for(data["session"])
tpl = io.open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
out = os.path.join(HERE, "sessions.html")
io.open(out, "w", encoding="utf-8", newline="\n").write(tpl.replace("{{DATA}}", blob))
print("wrote", out, len(data["session"]["steps"]), "steps,", len(data["quiz"]), "quiz questions,", len(data["figures"]), "figures")
