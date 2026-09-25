<p align="center">
  <img src="brand/accelerate.svg" width="96" height="96" alt="Accelerate">
</p>

<h1 align="center">Accelerate</h1>

<p align="center">
  One place to study, prepare for interviews, and track the plan for the next year.<br>
  Started 17 September 2026. Milestone 1 runs 21 September to 25 October.
</p>

---

## Open it

**Double-click the Accelerate shortcut on the desktop**, or `study.cmd` in this folder.
Not `index.html`.

`study.cmd` starts a small local server if one is not already running and always opens
`http://localhost:8000`. That matters because the browser stores progress against the
exact address a page was opened from. A double-clicked `index.html` (`file://`), or
`http://127.0.0.1:8000`, is a separate, empty store. Nothing is lost when that happens:
it is at the other address, and a banner at the top of every page says which one.

If the shortcut is ever lost, it points at `study.cmd` and takes its picture from
`brand/accelerate.ico`.

**Online**, from any machine, through GitHub Pages:
[the tracker](https://pranavmishra17.github.io/self-study/),
[the system design guide](https://pranavmishra17.github.io/self-study/SYSTEM%20DESIGN.html),
[the Alaap and TrenTorch plan](https://pranavmishra17.github.io/self-study/ALAAP.html).
Every push to `main` republishes them. Progress ticked online is kept separately from
`localhost:8000`; carry it across with Export and Import on the Data page.

## The four pages

| | Page | What it is |
|:---:|---|---|
| <img src="brand/accelerate.svg" width="40" alt=""> | **[Accelerate](index.html)**<br>`index.html` | The tracker. A flight-plan landing page, the five weeks of milestone 1, the wildcard slot for interview loops, every session with steps, answers, model answers and hidden quizzes, the day board, and the map of all the work ahead. Everything renders from data inside the one file. |
| <img src="brand/system-design.svg" width="40" alt=""> | **[System design](SYSTEM%20DESIGN.html)**<br>`SYSTEM DESIGN.html` | Your system design guide in three tabs. **Framework**: the six steps. **Patterns**: fifteen deep-dive patterns, each technique with its own mechanism diagram. **Designs**: seven worked end to end, NotebookLM, prior auth, an email agent, a coding agent, Ticketmaster, alfred_ and Kitaru. Sessions point into it, and its patterns point back. |
| <img src="brand/alaap.svg" width="40" alt=""> | **[Alaap and TrenTorch](ALAAP.html)**<br>`ALAAP.html` | One linear study plan, twenty-two stages across three milestones. Each stage has its goal, why it matters for Alaap, a diagram, the TrenTorch module to build, the Alaap guide's own sections, the relevant architecture, and an exit check with its answer. Also the fourteen architecture diagrams with metadata. Generated; see below. |
| <img src="brand/accelerate.svg" width="40" alt=""> | **[Baseline diagnostic](diagnostics/baseline-diagnostic.html)**<br>`diagnostics/` | The timed quiz the plan was calibrated from, and its result. Gate results go here too. |

## Where things stand

| | |
|---|---|
| **Now** | ZenML round 3, Monday 28 September, 9 AM Eastern: a ninety-minute technical round. The wildcard holds eleven sessions for Friday to Sunday. |
| **Milestone 1** | Week 1 is left as it is, to catch up on when there is time. Oxus's design sessions sit in weeks 2 to 4 as extra systems practice. |
| **Next** | Milestone 2 is TrenTorch as the spine, sequenced in the Alaap and TrenTorch plan, stages 3 to 15. |

## The documents

| File | What it holds |
|---|---|
| `CHARTER.md` | Fixed. Never rewritten. What every re-plan is checked against. |
| `MILESTONE-1.md` | The five weeks in long form. |
| `ROADMAP-AHEAD.md` | Milestone 2 planned, milestone 3 sketched, the rest parked. |
| `PROTOCOL.md` | Week states, the re-entry ramp, the three working rules, the wildcard rule, the re-plan ritual. |
| `WILDCARD.md` | The slot for interview-driven sessions, the four-fold cap, the session shape, and what is in it now. |
| `STUDY-LIST.md` | The current wildcard study lists as a flat checklist, generated from the tracker. |
| `REQUEUE.md` | Open items. Answered, never deleted. |
| `CHANGELOG.md` | Append only. Every re-plan and deviation, with its reason. |
| `progress/` | Exported progress snapshots. Export from the Data page and commit them. |
| `handoffs/` | Research handoffs unrelated to the plan itself. |

## Using the tracker

**Navigating.** The rail on the left shows the five weeks and the wildcard; the week you
are in expands to its sessions. Below them, everything else is grouped: Practise, Look
ahead, Reference, and Rules and data. On a session page the bar at the top moves to the
previous or next session across weeks. Left and right arrows do the same, Escape goes up
a level, and every page has its own address, so back and refresh keep your place.

**Drill.** A checkbox records that you did something, not that you can say it. Drill turns
one card at a time from content the plan already has: study items are terms with
said-out-loud definitions, practice steps are prompts with model answers. Say it, turn it,
rate it: clean, with gaps, or could not. Cold cards come first next time. Space turns,
`1` `2` `3` rate, arrows move.

**Sheet.** A session, a week or the whole wildcard as a dense two-column page for
printing. It is what to read on the morning of an interview, with the laptop shut.

Both live at `#/drill/<scope>` and `#/sheet/<scope>`, where scope is a session id such as
`wc13`, a week such as `week1`, or `wc` for the whole wildcard.

**Parked sessions.** When an interview has happened, its unfinished sessions are parked:
still counted toward wildcard credit and hours, still openable from the wildcard page, no
longer listed as work.

## Progress

Progress lives in the browser under the key `selfstudy.m1.planner`, scoped to the exact
address, port included. Export it from the Data page into `progress/`, dated, and commit
it. That is the only durable copy. Changing the storage key starts from empty, so export
first.

## Generated pages and assets

| Command | What it rebuilds |
|---|---|
| `python alaap/build.py` | `ALAAP.html`, from the Alaap repo's `learning/` folder and `E:/TrenTorch`, both read in place. It also refreshes the plan's stage list and link names inside `index.html`. The sequence itself is `alaap/plan.py`. Never edit the page by hand. |
| `python fonts/fetch.py` | The system design guide's three typefaces in `fonts/`, so it looks the same offline. |
| `python brand/render.py` | `accelerate.ico` and the favicon PNGs from `brand/accelerate.svg`, through headless Edge. |

`brand/` holds the three icons: `accelerate.svg` for the tracker and the desktop
shortcut, `system-design.svg` (the same craft, colours inverted) for the guide, and
`alaap.svg` (the craft in Alaap's palette) for the study plan. The fifteen directions the
first was chosen from are in `brand/concepts/`.

## Working on this in Claude Code

Read `CHARTER.md`, then `CHANGELOG.md`, then the newest file in `diagnostics/`, then
`REQUEUE.md` and `WILDCARD.md`. That is enough context to re-plan without re-explaining
anything.

`index.html` is one file on purpose. Its script runs in this order:

1. **Config**: start date, storage key, tracks and their colours, short planner labels.
2. **Resources**: `L` for the planned weeks and `R` for wildcard study lists. Add a link
   once and reference it by key.
3. **Diagrams**: `S`, a handful of SVG primitives, and `DIA`, each figure with a title, a
   caption and a builder. Sessions reference figures by key.
4. **Plan**: `PLAN`, five weeks of three sessions, plus any extra practice sessions. A
   week's colour is read from its first three.
5. **Wildcard**: `WILDCARD.sessions`, the same shape plus `forWhat` and, once an
   interview has happened, `parked`. Study lists live in `STUDY`, keyed by session id and
   merged into planned and wildcard sessions at load.
6. **Pointers**: `SD` and `AL`, the links into the system design guide and the Alaap
   plan. `AL` is generated between `AL:BEGIN` and `AL:END`.
7. **Requeue**, **recall**, then **state, routing and views**, which should rarely need
   touching when content changes.

To add sessions for a new interview loop: append to `WILDCARD.sessions`, add a `STUDY`
entry and a `SHORT` label, set `WILDCARD.note`, generate `STUDY-LIST.md` from the
wildcard sheet's copy-as-markdown control, and add a `CHANGELOG.md` entry.

Conventions: no emojis anywhere; every browser API call wrapped in try and catch with a
logged error and a fallback; content in data arrays, not in views; no test code
committed. To check the file still parses, extract its script and run `node --check`.

## The one-line version

Four to six hours a week, one track at a time, mathematics every week forever,
interruptions expected and planned for, artifacts over credentials.
