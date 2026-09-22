# Self-study

Started 17 September 2026. Milestone 1 runs 21 September to 25 October.

Open `index.html` in a browser, served rather than double-clicked so progress saves
reliably: `python -m http.server 8000` in this folder, then `http://localhost:8000`.

## The files

| | |
|---|---|
| `index.html` | The tracker. Planner, weeks, sessions, wildcard, quizzes, answers, resources. Everything renders from data inside the file. |
| `CHARTER.md` | Fixed. Never rewritten. What every re-plan gets checked against. |
| `MILESTONE-1.md` | The five weeks in long form. |
| `ROADMAP-AHEAD.md` | Milestone 2 planned, milestone 3 sketched, the rest parked. |
| `PROTOCOL.md` | Week states, re-entry ramp, the three working rules, the wildcard rule, the re-plan ritual. |
| `WILDCARD.md` | The sixth slot for interview-driven sessions, the four-fold cap, the session shape, what is in it now. |
| `STUDY-LIST.md` | The current wildcard study lists as a flat checklist, generated from the tracker. |
| `REQUEUE.md` | Open items. Answered, never deleted. |
| `CHANGELOG.md` | Append only. Every re-plan and deviation, with reasons. |
| `diagnostics/` | The baseline result, and `baseline-diagnostic.html`, the timed quiz used to take it. Gate results go here. |
| `progress/` | Exported progress snapshots. Export from the Data page and commit them. |
| `handoffs/` | Research handoffs unrelated to the plan itself, such as local dictation. |

## Navigating the tracker

The contents rail on the left always shows the five weeks and the wildcard. The week
you are in expands to show its sessions. On a session page, the bar at the top moves
to the previous or next session, and crosses week boundaries. Left and right arrows
do the same; Escape goes up a level. Every page has its own address, so the browser's
back button works and a refresh keeps your place.

## Drill, and the printable sheet

A checkbox records that you did something. It cannot record that you ticked it and
still could not say it out loud, which is the thing the charter is actually hunting.
Drill closes that gap and costs no new content: every study item is already a term
and a said-out-loud definition, and every practice step is already a prompt and a
model answer, so the plan *is* the card deck.

- **Drill** turns one card at a time. Say the answer out loud, turn the card, then
  rate yourself: said it clean, roughly with gaps, or could not say it. Cold cards
  come first on the next pass. Space turns, `1` `2` `3` rate, arrows move.
- **The state bar** on every session page and on the wildcard page shows owned,
  shaky, cold and untested at a glance, with a link straight into the drill.
- **The cold band** appears under it when anything is shaky or cold, and names it.
- **Sheet** renders a session, a week or the whole wildcard as a dense two-column
  page with the chrome stripped for printing. This is what you read on the morning
  of an interview, on paper, with the laptop shut.

Both views work for any session, planned or wildcard, with no per-session setup.
Addresses are `#/drill/<scope>` and `#/sheet/<scope>`, where scope is a session id
such as `wc2`, a week such as `week1`, or `wc` for the whole wildcard slot.

Ratings live in `state.recall`, keyed the same way as steps, and export with
everything else.

## Progress

Progress lives in the browser under the storage key `selfstudy.m1.planner`. Export it
from the Data page into `progress/`, dated, and commit it. That is the only durable
copy. Changing the storage key in the code starts from empty, so export first. The
storage is also scoped to the origin, port included, so serving this on 8000 one day
and 8777 the next reads as two separate stores with no warning either.

## Working on this in Claude Code

Start by reading `CHARTER.md`, then `CHANGELOG.md`, then the newest file in
`diagnostics/`, then `REQUEUE.md` and `WILDCARD.md`. That is enough context to re-plan
without re-explaining anything.

`index.html` is one file on purpose. Its script is laid out in this order:

1. **Config** — start date, storage key, tracks and their colours, short planner labels.
2. **Resources** — `L` for the planned weeks and `R` for wildcard study lists. Add a
   link once there and reference it by key.
3. **Diagram toolkit** — `S`, a handful of SVG primitives. Every figure is built from
   these so they share one look.
4. **Diagrams** — `DIA`, each with a title, a caption and an `svg()` builder. Sessions
   reference them by key.
5. **Plan** — `PLAN`, five weeks of three sessions. Each session has steps, optional
   detail and links per step, optional diagrams and a closing quiz.
6. **Wildcard** — `WILDCARD.sessions`, same shape, plus `forWhat`. Study lists live in
   `STUDY`, keyed by session id and merged in at load.
7. **Requeue** — `REQUEUE`.
8. **Recall** — `cardsOf` builds the drill deck from `study` and `steps`; `coldSort`,
   `tally`, `recallBar` and `coldBand` are shared by the session, wildcard, drill and
   sheet views.
9. **State, routing and views** — everything below is generic and should rarely need
   touching when content changes.

To add wildcard sessions for a new loop: append to `WILDCARD.sessions`, add a `STUDY`
entry and a `SHORT` label, set `WILDCARD.note`, then open the wildcard sheet and copy it
as markdown into `STUDY-LIST.md` — that control generates it now, rather than typing it
by hand — and add a `CHANGELOG.md` entry. `WILDCARD.md` has the session shape.

Conventions for any change: no emojis anywhere; every browser API call wrapped in
try and catch with a logged error and a graceful fallback; content stays in data
arrays rather than hardcoded into views; helpers stay reusable; no test code committed.
To check the file still parses after an edit, extract the script and run it through
`node --check`, or open it and watch the console.

## The one-line version

Four to six hours a week, one track at a time, mathematics every week forever,
interruptions expected and planned for, artifacts over credentials.
