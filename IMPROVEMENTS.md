# Improvements

Written 22 September 2026, from a read of `index.html` at 3,201 lines against
`CHARTER.md` and `PROTOCOL.md`.

This is a working list, not a plan. Items move to done with a date, or to
`REQUEUE.md` if they turn out not to matter. Nothing here is a deviation from the
charter; most of it is the charter's own rules acquiring a mechanism.

The tiers are ordered by what they repair, not by effort.

---

## Tier 1 — rules with no mechanism

The thesis of this repo is that a rule without a mechanism is drift waiting to
happen. Five rules in `PROTOCOL.md` currently have no mechanism at all.

**1. Week state is derived, and the derivation contradicts the protocol.**
`weekState()` returns `red` when *any one* of A, B or C has closed. Red is defined
as session B only — the mathematics, because it decays fastest and is cheapest to
keep alive. So a week in which only Alaap happened reads Red, and the tracker
reports that you protected the one thing you did not do. The protocol also says the
state is **declared at the start of the week** and corrected at the end; nothing
records the declaration, so the correction has nothing to correct.

Fix: store a declared state per week, show declared against actual, and make Red
mean session B specifically.

**2. The re-entry ramp cannot fire.**
Two or more consecutive Red weeks means the next non-Red week repeats the last
session A actually completed. Four or more means re-taking the last gate quiz before
advancing. Nothing counts consecutive Red weeks, so neither rule can trigger.
Depends on item 1.

**3. The requeue is read-only.**
Two protocol rules rest on it — anything set aside goes into the requeue, and the
requeue gets read once a week. Neither is in the interface. There is no way to add
an item from inside a session, and no way to mark one answered with a date, which is
the one thing `REQUEUE.md` says must happen. `reqClear` infers that an item cleared
because its due week went Green. That is a guess presented as a number.

**4. There is no streak.**
"The streak is what you are protecting, not the hours." The word does not appear in
the file.

**5. The ten-minute floor has no prompt and no timer.**
It is the rule most likely to be skipped, precisely because skipping it feels like
nothing happened.

## Tier 2 — the work is invisible

**6. Answers are write-only.**
Roughly a hundred answer fields across twenty-seven sessions, and nothing ever shows
them again. The charter says artifacts over credentials. These *are* the artifacts,
and they are three clicks deep in a session nobody will reopen. A written-work page,
per week and per milestone, exportable as markdown.

**7. Your answer and the model answer never sit together.**
They are separate toggles on the same row, so comparing means opening one, closing
it, and opening the other. Comparison is the entire point of writing first.

**8. Quiz explanations vanish once you pass.**
There are roughly forty-five `why` strings, compact and well written, and they become
unreachable the moment the score is recorded. They belong in the drill deck.

**9. Quizzes have no history.**
`state.quiz[id]` holds one record and re-taking overwrites it. So the question the
re-plan ritual actually asks — did week one survive to week five — cannot be
answered.

**10. Time posted is planned minutes, not elapsed minutes.**
The headline figure sums `est` for closed sessions, so it cannot tell a rushed forty
minutes from a real two and a half hours, which is the exact failure the honest floor
exists to catch. It also excludes the wildcard, so sixteen hours of interview prep
will report as zero.

## Tier 3 — finding things

**11. There is no search.** Twenty-seven sessions, a hundred-odd study items, and
your own written answers. "Where did I write about backpressure" is unanswerable.

**12. Nothing cross-links.** Backpressure appears in week 1, again in week 4's
retries and idempotency, again in the ZenML side-effects session. The repetition is
deliberate and currently invisible, so it does not compound.

**13. There is no resource index.** `L` and `R` hold every link in the milestone and
no page lists them.

## Tier 4 — the learning itself

**14. Dictation into the answer field.**
Nearly every Check in the plan is literally "say it out loud". The browser's
`SpeechRecognition` makes that real and leaves a transcript to set beside the model
answer. Prior research is in `handoffs/dictation-and-shell.md`.

**15. One free-recall question per quiz.**
Multiple choice can be passed by elimination, which is a close cousin of knowing
*what* works without knowing *why* — the failure this whole plan was built against.
One open question per quiz, self-rated the way the drill is.

**16. Spaced return on the landing page.**
One card from two or more weeks ago, surfaced without being asked for. It is the
only thing on this list that would catch decay between milestones.

**17. Diagram-first mode.**
Show the figure, ask what it shows, then reveal the caption. The figures are strong
enough to carry it.

## Tier 5 — housekeeping

| | |
|---|---|
| **18** | Export staleness on the landing page. The README calls export the only durable copy and nothing ever nags. "Last export: never" would. |
| **19** | Import replaces rather than merges, so two devices means silent data loss. |
| **20** | `STUDY-LIST.md` is regenerated by hand and will rot. A copy-as-markdown button on the sheet view *is* the generator. |
| **21** | One README line: browser storage is scoped per origin including the port, so serving on 8000 one day and 8777 the next splits your progress in two. Same failure as changing the storage key. |

## Deliberately not doing

Named so they stop coming back as ideas.

- Animated or steppable diagrams.
- Dark mode.
- Correlating the life strip against week states.
- Merge-by-timestamp synchronisation between devices.
- A bibliography page.

None of these changes whether you sit down on Thursday.

---

## Done

_Date each one as it lands, and say which item number it was._

**2026-09-22 — Drill, self-rating, cold band and the printable sheet.**
Not on this list because it predates it; recorded in `CHANGELOG.md`. It is the
mechanism for "ticked but could not say it", which is the same shape of gap as
Tier 1.

**2026-09-22 — Items 1 to 21.** Built in parallel the same day; see `CHANGELOG.md`
("Repo initialised. Twenty-one improvements").

**2026-09-26 — Superseded or reversed.** The ten-minute floor timer (item 5) and the
per-session answer boxes went when sessions became collapsible step lists; each step now
hides its answer until tried and takes a Had it / Partly / Missed it rating instead. The
single spaced card (16) became three open questions a day. "Animated or steppable
diagrams" left the not-doing list at Pranav's request: every figure now has a walk-through.
