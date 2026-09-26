# Wildcard

A sixth slot on the planner, kept permanently open and normally empty. It is not
week six, it does not extend the milestone, and it does not move the gate.

## What it is for

Interviews arrive with two days' notice and demand something specific — a DSA round,
a system design loop, a domain the company cares about. Previously that meant
dropping the plan and never returning to it. The wildcard is the defined place for
that work to go, so it is *inside* the plan rather than a reason to abandon it.

## How sessions get added

When a loop is scheduled, say what it is and what they interview on. It then gets two
things:

1. **Sessions** in `index.html`'s `WILDCARD.sessions` array, the same shape as any
   planned session. Three sessions or eleven, depending on what the interview actually
   demands.
2. **Its own page**, `interviews/<loop>.html`, built by `python interviews/build.py
   <module>` from a content module (`interviews/<module>.py`): the brief, what to say
   in the words to say it, timed spoken drills, a technical question bank, figures,
   questions to ask, traps, and every session readable in place. Add a `LOOPS` entry in
   `index.html` so the wildcard page shows it as a card. Full mocks run in the Claude
   Code chat, by `interviews/MOCKS.md`.

Sessions **append**. Existing wildcard sessions are not cleared when new ones arrive.
When a loop is over, its unfinished sessions are marked `parked: true`: still counted,
still openable, no longer listed as work.

Session shape, for whoever is adding them:

    {
      id: "wc18",                        // unique, wc-prefixed
      track: "Systems",                  // Systems | Mathematics | Alaap | Interview | Requeue
      forWhat: "ZenML round 3, 28 Sep",  // which loop; LOOPS matches on its prefix
      len: "1h 30m", est: 90,
      name: "...",
      blurb: "one line, shown in lists",
      intro: "why this session exists",
      study: [{ t: "term", say: "said-out-loud definition", res: [...],
                do: [{ a: "action", m: 5, where: "...", url: "...", out: "done when", skip: "..." }] }],
      steps: [{ t: "...", d: "what it is", m: 10, ans: ["the words to say", "..."],
                sd: [{ p: "pattern", t: "technique", why: "..." }], links: [...],
                close: [{ k: "short", q: "open question", a: "model answer" }] }]
    }

Reading, figures and guide links per step can also live in `data/reading.js`, keyed
`<session id>:<step>` (`wc18:0`) or `:s<n>` for a study item; the tracker and the loop
page both read it. The end quiz is drawn from the steps' `close` questions, five to
eight, open questions only. Also add a `SHORT` label and set `WILDCARD.note` to name the
current loop.

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

- **Oxus, technical, 23 September.** Happened. Its three design sessions (evidence
  ingestion, walkthrough-to-flowchart and the year-over-year base, a control-testing
  agent) moved into weeks 2, 3 and 4 as extra systems practice. The other three are
  parked. Its page, `interviews/oxus.html`, is a minimal archive.
- **ZenML round 3, Monday 28 September, 9 AM Eastern.** Eleven sessions: the shift from
  round 2, the eval bench story and the critique fixed, side effects inside replay,
  multi-turn replay, Kitaru internals, designing replay evals, backend depth, DevEx,
  ZenML context for the CTO, and a full mock. Its page is `interviews/zenml-round3.html`;
  the flat checklist is `STUDY-LIST.md`.

Fold candidate once the ZenML side-effects session closes: week 4's systems session
on failure, retries and idempotency, which it covers in more depth.

## At the re-plan

Wildcard entries are cleared at the milestone boundary, and what was learned there
gets folded into the next milestone's plan if it turned out to matter. Anything
folded and never genuinely covered goes into `REQUEUE.md` rather than disappearing.
