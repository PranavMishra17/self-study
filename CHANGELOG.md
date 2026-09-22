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
