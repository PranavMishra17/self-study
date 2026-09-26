# Changelog

Every re-plan, every deviation, every change of mind. Append only.

The purpose is narrow: to be able to tell, six months from now, whether the plan
adapted or whether it drifted. A deviation recorded with a reason is adaptation. The
same deviation unrecorded is how a year disappears.

Format: date, what changed, why, and whether it contradicts `CHARTER.md`.

---

**2026-09-14 — Baseline diagnostic taken.**
Twenty questions, taken on a busy day. Used as a calibration reading for where to
start, nothing more. Mathematics needs ground-up work; machine learning needs the
mechanisms rather than the descriptions; systems is the strongest area and mostly
needs vocabulary; DSA needs a foundation before maintenance. Full result in
`diagnostics/2026-09-14-baseline.json`.

**2026-09-17 — Plan created. Milestone 1 detailed.**
Systems leads because the pipeline is live and because it is the only track with
existing raw material to hang vocabulary on. Mathematics runs underneath every week
rather than as a block, aimed at TrenTorch-readiness rather than at general
improvement. DSA deliberately at zero through milestone 1. Alaap capped at four
hours — Part 0 and the physics half of Part 2 only — because its own study guide
assumes ML theory the diagnostic showed is not there, and because at 65 hours over
13 weeks it would otherwise consume the entire budget.

**2026-09-17 — Tracker rebuilt as a wall planner; wildcard slot added.**
Five week columns visible at once, a day board carrying session closures and the
life toggles, timestamps on every step and session, an answer field on every step,
and automatic logging of resources opened. A sixth planner slot holds
interview-driven sessions, capped at four folds against planned sessions. See
`WILDCARD.md`.

**2026-09-21 — Week 1 begins.**

**2026-09-22 — Wildcard opened for two loops.**
Oxus technical on 23 September (60 minutes, past work plus one design exercise) and
ZenML round 3 on Monday 28 September at 9 AM Eastern (90 minutes with Hamza Tahir and
Alex Strick van Linschoten). Twelve wildcard sessions written: six for Oxus, weighted
to system design because the intro call was behavioural and no technical ground had
been covered yet; six for ZenML, weighted to side effects in replay and multi-turn
replay, since round 2 probed the bench and idempotency. Week 1 continues in parallel
at whatever state the loops allow; that is a Red or Amber week by design, not a
deviation. The ZenML side-effects session genuinely covers week 4's retries and
idempotency material and is the natural first fold.

**2026-09-22 — Tracker navigation reworked; repo prepared for Claude Code.**
A contents rail replaces the top navigation, session pages get a previous and next
stepper that crosses week boundaries, arrow keys and Escape navigate, and every page
has its own address. Wildcard sessions now open with a study list of terms and
resources before practice. README documents the file structure for further work in
Claude Code. Progress snapshots now belong in `progress/` and are committed.

**2026-09-22 — Recall added to the tracker: drill, self-rating, printable sheet.**
The tracker could record that a step was ticked and never that it could not be said
out loud, which is the exact state the charter is hunting. Every study item is
already a term and a said-out-loud definition, and every practice step is already a
prompt and a model answer, so those became a card deck with no new content written.
A drill view turns one card at a time, hides the back until you have said it, and
takes a three-way self-rating — said it clean, roughly with gaps, could not say it.
Cold cards come first on the next pass. Session and wildcard pages now carry a state
bar and, when anything is shaky or cold, a band naming it. A sheet view renders any
session, week or the whole wildcard as a dense two-column page that prints, so the
morning before an interview does not need a laptop. Ratings live in
`state.recall` under the same storage key and export with everything else.
No contradiction with `CHARTER.md`; this measures the honest floor rather than
changing it.

**2026-09-22 — Figure added for wildcard session one.**
The Oxus design-frame session was pure sequencing with no figure. `DIA.oxusFrame`
draws the thirty-five minutes to scale, which makes the point the prose only states:
twelve of the thirty-five go on one deep dive, and requirements come first because
they decide which one.

**2026-09-22 — Repo initialised. Twenty-one improvements, built in parallel.**
The README had assumed a git repository since the seventeenth and there was not
one, so `progress/` snapshots had nowhere to be committed to and no change had an
undo. Initialised, and pushed private.

`IMPROVEMENTS.md` records the twenty-one items and why each exists. Five of them
were rules in `PROTOCOL.md` with no mechanism in the code, which is the failure this
repo was built to detect and had quietly accumulated in itself: week state was
derived rather than declared, and derived wrongly — Red meant any one session rather
than the mathematics, so a week that touched only Alaap reported that the one track
Red exists to protect had been protected. The re-entry ramp could not fire because
nothing counted consecutive Reds. The requeue could not be answered or added to. The
streak did not exist. The ten-minute floor had no prompt.

Also: every answer ever written now has a page rather than being write-only; quiz
attempts are kept rather than overwritten, so decay between week one and week five
is recordable; the quiz explanations join the drill deck rather than vanishing on a
pass; time is measured rather than assumed from the plan; search covers everything
including your own writing.

Nine agents worked in parallel and none of them wrote to `index.html`. Each returned
a patch script against verified anchors, applied one at a time with a syntax check
and a browser pass between each. Seven anchors broke during integration and were
repaired by hand; two patches were dropped as superseded. The file went from 3,201
lines to roughly 5,000.

**2026-09-22 — The landing page gains a map of all the work ahead.**
`DIA.arc` drew milestone 1 as five boxes over five boxes and stopped there. It is
replaced by eighty-five topic nodes across four milestones with a hundred and
nineteen prerequisite edges, thirty-three of which cross a milestone boundary.
Hovering a node lights everything it needs and everything that needs it. Detail
decays with distance, so the further-out columns render faint and milestone 3 has
five nodes because `ROADMAP-AHEAD.md` names five things. This is a presentation of
the existing plan and not a change to it; nothing in `CHARTER.md` is contradicted.

**2026-09-24 — The tracker is called Accelerate, and opens on a flight plan.**
The icon was chosen from fifteen directions over two rounds, judged at the sizes an
icon actually lives at rather than only large. The winner is Craft: a delta-wing ship
climbing through deep space with two afterimages behind it. It is on the desktop
shortcut, now called Accelerate, and on the browser tab.

The landing page opens on the milestone drawn as an ascent, launch at week one and
orbit at the gate, with the ship at today's position. The obvious version of this
chart, a planned-hours line with the real line beneath it, was rejected because a
gap under a plan line is debt drawn on a screen, and `CHARTER.md` says missed hours
are never owed. So each week's segment is drawn by its declared state instead: heavy
for Green, lighter for Amber, thin but unbroken for Red. Only a week that ended empty
breaks the line. What the chart draws is the streak, which `PROTOCOL.md` names as the
thing being protected.

Two bugs fixed on the way, both of which the new page would have put front and
centre. The streak read zero every Monday, because the week in progress counted as a
break before it had had a chance to be anything. And the next session stayed pinned
to Oxus the day after the Oxus interview, because an unfinished session in a loop
that is already over still counted as next. Neither is a deviation from the charter;
both were the code disagreeing with it.

**2026-09-24 — The system design guide, woven in both directions.**
`SYSTEM DESIGN.html` is committed as written first, then changed only additively. In
the tracker, forty five study items and steps now point at the exact place in the
guide that deepens them, fifty eight pointers across twenty eight distinct targets,
each with one line on why, and each opening in a new tab so the session stays put.
The strongest pairings are the prior authorization design against the SOX control
agent, NotebookLM against evidence ingestion, and alfred_ against the past-work
session, since the guide already contains the system being asked about.

In the guide, each pattern now lists the sessions that practise it, written from the
same table as the tracker's pointers so the two directions cannot disagree. Four
patterns list nothing: real-time updates, contention, geo search and LLM cost are not
taught by any session yet. That is a finding rather than a gap in the linking, and
worth a thought at the milestone 2 re-plan. No actions were added and no session
minutes changed.

**2026-09-24 — The guide in three tabs, the map on its side, the rail grouped.**
The system design guide was too wordy to skim. It now has three tabs. Framework is
the landing page: the six-step diagram, one card per step, the classic-versus-agentic
table, and the signals and transition lines folded away. Patterns opens on a gallery
of fifteen diagrams; each pattern page shows its diagram, then every technique with a
small diagram of its own mechanism (ninety eight new), what it is, an example and its
trade-off, the designs that use it, and where Accelerate practises it. Designs lists
the six worked designs; a design page keeps a side list of its steps, and "Patterns
this design uses" is a grid of cards. The guide's text is unchanged. Old links still
work: `#/overview/...` and `#/<design>/...` redirect to the new routes, and the
tracker's pointers use the new routes directly.

In Accelerate, the map of the work ahead was two and a half screens wide and needed
sideways scrolling. Time now runs downward, one band per milestone, with the five
tracks as columns; it fits the page and sits just above the Day board. The side rail's
loose list of nine links is grouped into Practise, Look ahead, Reference, and Rules
and data. No plan content changed.

**2026-09-24 — The Alaap study guide gets its own page, folded into the weeks.**
`ALAAP.html` is new: the Alaap repo's study guide, sanity check, accent and rights
research, and architecture diagrams on one page, in the Alaap repo's own style rather
than Accelerate's. It is generated by `alaap/build.py` from the Alaap repo's
`learning/` folder, so when those documents change the page is rebuilt rather than
edited. The text is Alaap's; the page adds the tabs, a thirteen-week timeline, how the
guide maps onto Accelerate's milestones, and, on each part, the Accelerate session
that practises it.

In Accelerate, fifteen steps now carry an "In your Alaap study guide" pointer: the
three Alaap sessions (Part 0, Nyquist, source and filter), and the mathematics steps
that feed the guide directly, such as cosine similarity into speaker verification,
eigenvectors into the Vendi score, and negative log-likelihood and softmax into the
mixture density network. The Alaap nodes on the map link to their part, and the rail
and the landing page link to the guide. No session minutes or actions changed; the
charter's four-hour Alaap cap in milestone 1 stands.

The system design guide now loads its typefaces from `fonts/` rather than Google, and
has its own icon: the Accelerate craft with the colours inverted.

**2026-09-24 — One study plan for Alaap and TrenTorch.**
The Alaap page was the Alaap documents side by side, which meant choosing where to go
next each time. It is now one linear plan of twenty-two stages across the three
milestones. Each stage says what you can do afterwards and why it matters for Alaap,
then brings everything it needs into place: a diagram drawn for it, the TrenTorch
module to build (objectives, what it exports, the `tren` commands, its reflection
questions), the Alaap guide's own sections, the architecture diagrams that apply, the
TrenTorch historical milestone it unlocks, and one exit check with a short answer.
All twenty TrenTorch modules and every section of the Alaap guide are placed; the
build refuses to run if one is left out. The fourteen architecture diagrams now carry
what each involves, its topics, and the stages that teach it.

TrenTorch is read in place from `E:/TrenTorch` rather than copied here, so there is one
copy of it. The sequence is `alaap/plan.py`; `alaap/build.py` regenerates the page and
the plan's stage list and labels inside the tracker from it.

In Accelerate, milestone 2's map nodes (tensors, modules, autograd, the loop, batch
normalisation, embeddings, attention) and milestone 3's now open the stage that teaches
them, "What comes after" lists each milestone's stages, and six more mathematics steps
point at the stage that uses them. As sequenced, milestone 2 is about 40 hours of this
work against the roadmap's twenty for TrenTorch alone; the milestone 2 re-plan decides
what moves. Milestone 1 is unchanged, with Alaap still capped at four hours.

**2026-09-25 — Public, and on GitHub Pages.**
The repo is public and the three pages are published at
https://pranavmishra17.github.io/self-study/, republished on every push to `main`.
This was a deliberate choice, made knowing it exposes the alfred_ design, the interview
preparation and the personal plan along with the full history; the history was scanned
for secrets first and none were found. Progress stays in each browser, so the online copy
starts empty and carries progress across only through Export and Import. The tracker's
address banner says so when opened online.

**2026-09-25 — Interview loops get their own pages.**
Working through the ZenML sessions in the tracker was the wrong shape: small grey text,
content hidden behind Detail and Answer toggles, twenty-five controls on a page, and
about twenty-five memorisation questions per session, some of them fill-in-the-blank.
Every interview loop now gets its own page in `interviews/`. The ZenML round 3 page has
the brief, spoken scripts, timed speak-aloud drills, a technical question bank
(including LangChain, LangGraph and LangSmith, trace stores, and Supabase), Kitaru's
mechanisms with the teardown's diagrams, questions to ask, traps, and all eleven sessions
readable in place. Each session has one quiz, five to eight open questions shown one at
a time in a pop-up, answered by typing or with Win+H, then compared with a model answer
and self-rated. Ticks on the page are the tracker's own progress, shared because both
are served from the same address. Oxus has a minimal archive page. The tracker's wildcard
page leads with a card per loop, and the home page's button opens the loop's page. Full
mock interviews run in the Claude Code chat, by the protocol in `interviews/MOCKS.md`.
The whole-tracker overhaul waits on a choice between layout variants.

**2026-09-25 — Sessions become a workbench, one card at a time.**
Picked from the five layouts in `variants/sessions.html`: a mix of B (one step at a
time) and E (read, write, check). Every session in every week now shows one card at
a time: the figures, then each thing to know, then each step. Each card has Read
(the source and actions), Write (your answer, typed or dictated), and Check (the
model answer, then Had it, Partly or Missed it). A finish card runs the end quiz
as a popup, one open question at a time, five to eight per session. Arrows move
between cards; Shift and an arrow moves between sessions. Progress keys are
unchanged, so earlier ticks, answers and quiz results carry over. No change to the
plan or to `CHARTER.md`.

**2026-09-26 — Sessions as collapsible step lists, with reading and figures on every step.**
The one-card-at-a-time layout from the day before is replaced by what worked on the ZenML
page: every step collapses and opens to what it is, its figure, what to read with minutes,
the system design technique it uses and why, and the answer behind a toggle. Reading for
all 135 steps and study items in weeks 1 to 5 and the wildcard now lives in
`data/reading.js`: 147 outside links, 58 AI Engineering from Scratch lessons, 82 system
design techniques, every URL checked. Figures moved into `figures/figures.js`, one registry
shared with the interview pages, with nine new ones for the ZenML sessions; 29 figure
ideas are recorded for the figure pass. Reading time shows as optional on top of each
session's planned hours, not inside them, so the plan's totals are unchanged. No change to
`CHARTER.md`.

**2026-09-26 — Small pleasures, picked from a list.**
Chosen by Pranav from proposals: three open questions a day on the home page (replacing
the single spaced card), a figure to explain in a minute, the book (a compact page per
closed week, printable, `#/book`), the sky (sessions as stars, `#/sky`), a livery for the
craft per closed week, and a lift-off when a session closes. None adds planned work.

**2026-09-26 — One type system for a step; Prep questions teach before they script; dead code out.**
A step in the tracker now uses one face, three sizes and three greys: a quiet grid for
where, done-when and skip; one list style for reading, guide links and Alaap links; one
toggle for the answer. DDIA references follow the 2nd edition the plan uses (the research
agents had cited 1st-edition chapter numbers). On the ZenML page every technical question
opens to its point, its figure, what to read and the guide technique, with the spoken
answer behind the same toggle. About 620 lines of unused tracker code went: the old quiz
panel, closers, spaced card, answer boxes and their styles.

**2026-09-26 — Every diagram explorable.**
Asked for by Pranav: diagrams that open full screen, explain each part on hover and click,
and walk through the flow. One viewer (`figures/viewer.js`) now serves the tracker, the
interview pages, the system design guide and the Alaap page. Every node and edge of 205
diagrams has a note written for its context, with links to guide techniques, tracker
sessions, Alaap stages, TrenTorch source and AI Engineering from Scratch lessons. The 39
shared figures were redrawn with named parts and Lucide icons (fixing an unwired value
matrix in attention, an invisible validation curve, colliding ids), the five Kitaru teardown
figures were redrawn so they can be explored, and ten new figures were drawn from the ideas
recorded in the reading pass. Two errors in other pages were fixed (the Alaap autograd
formulas, an async flag in the guide); 113 smaller review points are in `figures/REVIEW.md`.

**2026-09-26 — What was learned about studying, written down; the ten-minute floor dropped.**
`PROTOCOL.md` gains **How you study best**: understand first and say it last, diagrams you
can take apart, reading with a stopping point, steps shut by default, one look, open
questions one at a time, honest ratings that bring misses back, a page and a real mock per
interview, small rewards without debt, and big changes chosen from options. Each is there
because something else was tried first and dropped. The ten-minute floor is removed from
the protocol and the tracker's protocol page: its timer went with the old session layout,
and a step's answer staying shut until you have tried now does the same job. Not in
`CHARTER.md`, so not a deviation. The README is rewritten for anyone who lands on the
repo: what it is, the method, and how to make it your own. `WILDCARD.md` describes loop
pages and the current session shape, `MILESTONE-1.md` records the three Oxus design
sessions now in weeks 2 to 4, `STUDY-LIST.md` is regenerated with each step's reading and
guide links, and of eight 1st-edition DDIA chapter references in the reading, five that
duplicated a 2nd-edition entry were removed and three were rewritten as 2nd-edition topics.
