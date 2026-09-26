<p align="center">
  <img src="brand/accelerate.svg" width="96" height="96" alt="Accelerate">
</p>

<h1 align="center">Accelerate</h1>

<p align="center">
  A self-study system for an engineer who ships, built to survive interview sprints and busy weeks.<br>
  Four static pages, no build step, no account. Progress stays in your browser.
</p>

<p align="center">
  <a href="https://pranavmishra17.github.io/self-study/">Tracker</a> ·
  <a href="https://pranavmishra17.github.io/self-study/SYSTEM%20DESIGN.html">System design guide</a> ·
  <a href="https://pranavmishra17.github.io/self-study/ALAAP.html">ML and audio study plan</a> ·
  <a href="https://pranavmishra17.github.io/self-study/interviews/zenml-round3.html">An interview loop page</a>
</p>

---

## What it is

Pranav Mishra's plan for 2026 to 2027: systems vocabulary, the mathematics under machine
learning, PyTorch from first principles, and preparation for the interviews that interrupt
all three. It is public so the method and the material can be reused. Every page works
straight from GitHub Pages, and the study content (the system design guide, the figures,
the reading lists) is useful on its own without following the plan.

The problem it is built around: a year of production work teaches you what works and never
makes you explain why. Plans to fix that usually die at the first interview sprint, when
the plan is dropped and never picked up again. This one treats interruptions as a planned
state, so they don't end the plan.

## The pages

| | Page | What you get |
|:---:|---|---|
| <img src="brand/accelerate.svg" width="40" alt=""> | **[Tracker](https://pranavmishra17.github.io/self-study/)**<br>`index.html` | Five weeks of sessions (systems, mathematics, audio ML), each a list of steps. A step opens to what the idea is, a figure you can take apart, what to read with minutes, the system design technique it uses, and the answer, hidden until you have tried. Open-question quizzes, a drill deck, printable sheets, a map of the year. |
| <img src="brand/system-design.svg" width="40" alt=""> | **[System design guide](https://pranavmishra17.github.io/self-study/SYSTEM%20DESIGN.html)**<br>`SYSTEM DESIGN.html` | A six-step framework, fifteen deep-dive patterns with nearly a hundred techniques, each with its own mechanism diagram, and seven designs worked end to end (NotebookLM, prior authorisation, an email agent, a coding agent, Ticketmaster, alfred_, Kitaru). |
| <img src="brand/alaap.svg" width="40" alt=""> | **[Alaap and TrenTorch](https://pranavmishra17.github.io/self-study/ALAAP.html)**<br>`ALAAP.html` | A linear plan of twenty-two stages from tensors and autograd to a speech model: for each stage, the goal, a diagram, the module to build, and an exit check with its answer. Generated. |
| <img src="brand/accelerate.svg" width="40" alt=""> | **[Interview loops](https://pranavmishra17.github.io/self-study/interviews/zenml-round3.html)**<br>`interviews/` | One page per interview loop: the brief, what to say and how to say it, timed spoken drills, a technical question bank with figures and reading, questions to ask, traps. |

**Every diagram can be explored.** Click one and it opens full screen. Hover a box or an
arrow for a one-line note; click it for a plain explanation in the context of that figure,
with links to where it is taught. **Walk through** steps the flow one part at a time; arrow
keys move, Escape closes. More than two hundred diagrams have notes on every part.

## The method

The ideas are separate from the content, so they can be used with any subject:

- **A charter that never changes, and a plan that always does.** `CHARTER.md` says what the
  whole thing is for. Every re-plan is checked against it, and any deviation goes into
  `CHANGELOG.md` with its reason. A change that is written down with its reason is
  adaptation; one that isn't is drift.
- **Week states instead of guilt.** Green is the full week, Amber drops the third session,
  Red keeps only the mathematics. An interview sprint is a run of Red weeks, with a defined
  way back in. Missed hours are never owed. See `PROTOCOL.md`.
- **A wildcard slot for interviews.** Interview prep goes into its own slot and its own
  page. It can count for at most four planned sessions, so it can never quietly become the
  plan. See `WILDCARD.md`.
- **Understand first, then say it.** Each step teaches before it asks. The answer stays
  shut until you have tried, and you rate yourself honestly: Had it, Partly or Missed it.
  What you missed comes back as the three open questions on the home page each morning.
- **Reading with a stopping point.** Every link says how many minutes the part that matters
  takes, and every URL was opened and checked.

`PROTOCOL.md` ends with **How you study best**: what was tried, kept and thrown out while
building this, and the shape all new material takes.

## Make it yours

1. **Fork it and turn on GitHub Pages** (Settings, Pages, deploy from `main`). There is
   nothing to install. A `.nojekyll` file makes Pages serve the files as they are.
2. **Rewrite the plan.**
   - The charter and the milestone are prose: `CHARTER.md`, `MILESTONE-1.md`,
     `ROADMAP-AHEAD.md`.
   - The tracker's sessions are data near the top of `index.html`: `PLAN` for the weeks,
     `WILDCARD` for interview sessions. Each session is a list of steps with a
     description, an answer, reading and closing questions.
   - Reading per step lives in `data/reading.js`, keyed by session and step (`w2a:0`).
3. **Reuse or add figures.** `figures/figures.js` holds every shared figure, drawn once and
   used by key on every page. `figures/notes.js` explains each part of each figure. Run
   `node figures/check.js` after a change.
4. **Run it locally** with `python -m http.server 8000` and open `http://localhost:8000`. On
   Windows, `study.cmd` does both.

**Progress** lives in the browser's localStorage under `selfstudy.m1.planner`, separately
for each address: `localhost:8000`, `127.0.0.1:8000`, a `file://` page and the GitHub Pages
copy are four separate stores. Export from the Data page and commit the file into
`progress/`; that is the only durable copy.

## Using the tracker

- **Moving around.** The rail on the left lists the weeks and the wildcard. Arrow keys move
  between sessions, and Escape goes up a level. Every view has its own address
  (`#/s/2/1`, `#/w/3`, `#/book`), so back and refresh keep your place.
- **A session.** Steps start shut, so the session reads as its outline. The tick box marks a
  step done without opening it. At the end, a quiz of five to eight open questions, one at a
  time.
- **Drill** (`#/drill/<scope>`) turns one card at a time: say it, turn it, rate it. The cards
  you couldn't answer come first next time. **Sheet** (`#/sheet/<scope>`) prints a
  session, a week or the wildcard as a dense page, and can copy itself as markdown.
- **Every morning.** The home page shows three open questions from sessions you've
  started, weighted towards what you missed, and one figure to explain aloud in a minute.
- **The book and the sky.** When a week closes, it binds into the book (`#/book`): one page
  per week, printable. The sky (`#/sky`) draws every session as a star, lit when it
  closes.
- **The craft.** Closing a session launches the icon across the page. Closing a week
  unlocks a new colour scheme for it.

## The documents

| File | What it holds |
|---|---|
| `CHARTER.md` | Why the plan exists. Never rewritten. |
| `MILESTONE-1.md` | The current five weeks in long form. |
| `ROADMAP-AHEAD.md` | Milestone 2 planned, milestone 3 sketched, the rest parked. |
| `PROTOCOL.md` | Week states, the re-entry ramp, the working rules, the re-plan ritual, and how you study best. |
| `WILDCARD.md` | The interview slot: how sessions and loop pages are added, the fold rule, what is in it now. |
| `STUDY-LIST.md` | The current wildcard sessions as a flat checklist with reading, generated from the tracker's sheet. |
| `REQUEUE.md` | Things set aside. Answered, never deleted. |
| `IMPROVEMENTS.md` | Tracker improvements built, reversed, and deliberately not done. |
| `CHANGELOG.md` | Append only. Every re-plan and deviation, with its reason. |
| `diagnostics/` | The baseline quiz the plan was calibrated from, and its result. Gate results go here too. |
| `interviews/MOCKS.md` | How mock interviews run in the Claude Code chat. |
| `figures/REVIEW.md` | Open review points for the next pass over the figures. |

## Generated pages

| Command | What it rebuilds |
|---|---|
| `python interviews/build.py <module>` | One loop's page, `interviews/<loop>.html`, from `interviews/<module>.py`. |
| `python alaap/build.py` | `ALAAP.html` from `alaap/plan.py`, the Alaap repo's `learning/` folder and a local TrenTorch checkout. Never edit the page by hand. |
| `node figures/check.js` | Checks every figure renders and every part has a note. Writes `figures/check.html`, a gallery. |
| `python fonts/fetch.py` | The typefaces in `fonts/`, so the pages look the same offline. |
| `python brand/render.py` | The icon and favicons from `brand/accelerate.svg`, through headless Edge. |

## Working on it

`CLAUDE.md` holds the working notes for an agent (or a person): commands, where each piece
of data lives, the figure contract, conventions and gotchas.

`index.html` is one file on purpose, and its script runs in this order:

1. **Config**: the start date, the storage key, tracks and their colours.
2. **Resources**: `L` for the planned weeks and `R` for wildcard study lists. Each link is
   added once and referenced by key.
3. **Plan**: `PLAN`, five weeks of three sessions plus optional practice.
4. **Wildcard**: `WILDCARD.sessions` and `LOOPS`, one card per interview loop. Study lists
   are in `STUDY`, keyed by session id.
5. **Pointers**: `SD` into the system design guide and `AL` into the Alaap plan (`AL` is
   generated between `AL:BEGIN` and `AL:END`).
6. **State, routing and views.** These rarely need touching when content changes.

Figures are not in this file: they live in `figures/` and are shared by every page.

The conventions:
- no emojis;
- every browser API call is wrapped in try and catch, with a fallback;
- content lives in data, not in views;
- every outside link is checked before it is added.

To check the file still parses, extract its script and run `node --check`.

## Where this copy stands

| | |
|---|---|
| **Now** | ZenML round 3, Monday 28 September 2026: eleven wildcard sessions and the loop page. |
| **Milestone 1** | 21 September to 25 October: systems primitives and the mathematics TrenTorch needs. |
| **Next** | Milestone 2: TrenTorch as the spine, sequenced in the Alaap plan, stages 3 to 15. |

## Credits

- Icons: [Lucide](https://lucide.dev) (ISC), bundled in `figures/icons.js`.
- Typefaces: Atkinson Hyperlegible, JetBrains Mono and Kalam (SIL Open Font License).
- Reading draws on *Designing Data-Intensive Applications* (2nd edition) and
  [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch).

The one-line version: four to six hours a week, one track at a time, mathematics every
week, interruptions expected and planned for, artifacts over credentials.
