# Wildcard

A sixth slot on the planner, kept permanently open and normally empty. It is not
week six, it does not extend the milestone, and it does not move the gate.

## What it is for

Interviews arrive with two days' notice and demand something specific — a DSA round,
a system design loop, a domain the company cares about. Previously that meant
dropping the plan and never returning to it. The wildcard is the defined place for
that work to go, so it is *inside* the plan rather than a reason to abandon it.

## How sessions get added

When a loop is scheduled, say what it is and what they interview on. Sessions are
then written into `index.html`'s `WILDCARD.sessions` array — same shape as any
planned session, with steps, expandable detail, resource links, answer fields and a
closing quiz. Three sessions or eight, depending on what the interview actually
demands.

They **append**. Existing wildcard sessions are not cleared when new ones arrive
unless the old loop is over and the entries are stale.

Session shape, for whoever is adding them:

    {
      id: "wc1",                       // unique, wc-prefixed
      track: "Systems",                // Systems | Mathematics | Alaap | Requeue
      forWhat: "Sarvam screen, 24 Sep", // which loop this is for
      len: "2h", est: 120,
      name: "...",
      blurb: "one line, shown in the table",
      intro: "why this session exists",
      diagrams: ["skew"],              // optional, keys from DIA
      steps: [{ t: "...", d: "...", links: [...] }],
      quiz: [{ q: "...", o: [...], a: 1, why: "..." }]
    }

Also add a `SHORT` entry so the planner column has a legible marker, and set
`WILDCARD.note` to name the current loop.

## The fold rule

Closing a wildcard session earns **one credit**. A credit lets you fold one planned
session in — marking it covered, counting it toward the week's state, without doing
it separately. This is honest: interview prep genuinely does cover some of this
material, and pretending otherwise would make the tracker lie.

**The cap is four folds across the whole milestone, out of fifteen sessions.**

That number is the point. Interview work can cover part of the plan. It can never
quietly become the plan, which is the exact failure this whole thing was built to
prevent. If the wildcard is running and the planned weeks stay untouched for a
month, the tracker will show it rather than hide it behind a wall of green.

Folds are reversible. A folded session keeps all its material, so it can still be
done properly later if the interview prep turned out to be shallower than it felt.

## Currently in the slot

Opened 22 September 2026 for two loops.

- **Oxus, technical, 23 September.** Six sessions, about seven and a half hours:
  the design frame, testing a SOX control end to end, evidence ingestion from messy
  documents, walkthrough-to-flowchart and the year-over-year base, past work at
  grilling depth, and a final hour of mock, fixes and sleep.
- **ZenML round 3, Monday 28 September, 9 AM Eastern.** Six sessions, about eight
  and a half hours: the shift from round 2's room to this one, side effects inside
  replay, multi-turn replay with a simulated user, DevEx and onboarding, ZenML
  context for the CTO, and a full ninety-minute mock.

Fold candidate once the ZenML side-effects session closes: week 4's systems session
on failure, retries and idempotency, which it covers in more depth.

## At the re-plan

Wildcard entries are cleared at the milestone boundary, and what was learned there
gets folded into the next milestone's plan if it turned out to matter. Anything
folded and never genuinely covered goes into `REQUEUE.md` rather than disappearing.
