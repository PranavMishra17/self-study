/* What each part of each figure in figures.js means: FIG_NOTES[key] = { nodes: { id: { t, d,
   links } }, edges: { "a>b": { t, d } }, walk: [ids in the order to explain them] }.
   Read by figures/viewer.js on every page. */
window.FIG_NOTES = Object.assign(window.FIG_NOTES || {}, {
 "benchLoop": {
  "nodes": {
   "production": {
    "d": "Real conversations between users and the agent, with every tool call and its result recorded. The bench only ever starts from something that actually happened, never from an imagined test case.\n\nAt alfred_ this is 5,000-plus active users' email and calendar sessions, kept in your own tables in Supabase Postgres."
   },
   "scanner": {
    "d": "A daily job that runs cheap, deterministic checks over the day's conversations and flags anything that looks like one of twelve failure types: the agent claims an action no tool performed, the user repeats themselves, a tool errors and the agent carries on.\n\nDeterministic signals are fast and free but over-fire, which is why a judge sits after them.",
    "links": [
     {
      "label": "Technique: shadow mode and online signals",
      "url": "SYSTEM%20DESIGN.html#/patterns/grounding/shadow-online"
     }
    ]
   },
   "llm-judge": {
    "d": "An LLM that reads each flag with its context (the user turn, the agent turn, the tool traces and two turns either side) and decides whether it is a genuine bug. Its rubric was built from about a week of flags labelled by hand.\n\nIt agrees with a human on roughly three in four, and is reconciled weekly against fresh labels, because what counts as correct changes as features change.",
    "links": [
     {
      "label": "Eugene Yan: evaluating LLM evaluators",
      "url": "https://eugeneyan.com/writing/llm-evaluators/"
     }
    ]
   },
   "fix-then-promote": {
    "d": "A genuine bug is fixed by hand, then promoted into the bench. A reconciler decides whether to add a new case, update an existing one, or merge the failure into a case that already covers it, so the bench does not fill with near-duplicates."
   },
   "bench": {
    "d": "The regression suite: a little over a hundred cases, each a real failure with its own snapshot of the user's world. About ten percent are flaky and run three times, reporting a pass rate.",
    "links": [
     {
      "label": "Technique: eval suites as release gates",
      "url": "SYSTEM%20DESIGN.html#/patterns/grounding/eval-gate"
     }
    ]
   },
   "replay": {
    "d": "The real agent runs each case from the CLI with a harness flag. Tool code runs for real; only the call to Gmail, the calendar or an MCP server is routed to the case's SQLite snapshot, which answers in the provider's shape. Writes land in the snapshot, so a task created at turn two is visible at turn three.",
    "links": [
     {
      "label": "Technique: environment snapshots",
      "url": "SYSTEM%20DESIGN.html#/patterns/agent-durability/env-snapshots"
     }
    ]
   },
   "score": {
    "d": "Deterministic assertions against the snapshot (the right tools, the right records, every event in the window present), then an LLM judge for what cannot be enumerated, such as a summary's quality. The headline number is tool calls per completed task: 2.5 falling to 2.2 means the same outcome, found faster."
   },
   "sign-off": {
    "d": "What the bench is for: comparing the old and new agent on the same cases before shipping. It signed off the rewrite of multi-turn orchestration, pointing at exactly which cases got better, which got worse, and why."
   }
  },
  "edges": {
   "production>scanner": {
    "d": "Runs daily over the previous day's conversations."
   },
   "scanner>llm-judge": {
    "d": "Each flag travels with its evidence: the turns, the tool traces and the agent's reasoning."
   },
   "llm-judge>fix-then-promote": {
    "d": "Only flags the judge calls genuine move on; roughly three in four."
   },
   "fix-then-promote>bench": {
    "d": "Added, updated or merged, never duplicated."
   },
   "bench>replay": {
    "d": "The full bench nightly, about half an hour; a change to one tool runs only the fifteen to thirty cases whose snapshots touch it."
   },
   "replay>score": {
    "d": "Every run is scored the same way, so versions are comparable."
   },
   "score>sign-off": {
    "d": "A release decision backed by named cases, not opinions."
   }
  },
  "walk": [
   "production",
   "production>scanner",
   "scanner",
   "llm-judge",
   "fix-then-promote",
   "bench",
   "replay",
   "score",
   "sign-off"
  ]
 }
});
