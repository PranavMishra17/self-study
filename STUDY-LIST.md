# Study list: ZenML round 3

Generated from the tracker on 26 Sep 10:09. Tick an item only when you can say it out loud without notes. Under each item: what to do,
then what to read (with minutes) and where it sits in the system design guide.

ZenML round 3: Mon 28 Sep, 9 AM Eastern, ninety minutes of in-depth technical questions with Hamza and Alex. Oxus happened on 23 Sep; its design sessions moved into weeks 2 to 4 and the rest are parked.

---

## ZenML round 3

### Round three is a different room  (1h)

- [ ] **Kitaru's core objects**  (7m)
  Sessions, recorded by an adapter or imported from Langfuse, LangSmith, Braintrust, Logfire or Arize Phoenix. Replays. Cohorts, which are immutable versions of a chosen set of sessions. Evaluators, deterministic and LLM-based.
  - [Introducing the new Kitaru](https://www.zenml.io/blog/introducing-the-new-kitaru)
  - [Kitaru README and guided tour](https://github.com/zenml-io/kitaru)
  - [ ] Read the four sections that introduce each object  _(5m)_
    [ZenML blog, 'Introducing the new Kitaru' — the sections 'Start with the traces you already have', 'Find the failure modes worth testing', 'Turn those judgments into evaluators', 'Replay what really happened'](https://www.zenml.io/blog/introducing-the-new-kitaru)
    Skip: The opening 'why this gets messy' framing and the closing comparison to Langfuse and Braintrust — neither defines an object.
  - [ ] Say the four objects out loud, one sentence each, without notes  _(2m)_
    Done when: sessions, cohorts, evaluators and replays defined correctly, unprompted
- [ ] **Faithful baseline, then fork with one override**  (5m)
  Validate an unchanged replay first. Then fork with exactly one change — model, prompt, parameters — so any difference is attributable.
  - [Braintrust vs Langfuse vs Kitaru](https://www.zenml.io/blog/braintrust-vs-langfuse)
  - [ ] Read the baseline-then-fork paragraph  _(3m)_
    [ZenML blog, 'Braintrust vs Langfuse vs Kitaru', Feature 2 'Agent Replay and Tool-Call Overrides', the opening two sentences](https://www.zenml.io/blog/braintrust-vs-langfuse)
  - [ ] Say out loud why exactly one override and not several  _(2m)_
    Done when: the attribution argument, in one sentence
- [ ] **on_miss, static and passthrough**  (6m)
  Two different knobs, often conflated. on_miss governs what happens to a call the recording never saw, and takes three values: fail, error_result, passthrough. Separately, a single tool can be overridden — pinned to a static result, or routed live — while everything else still answers from history.
  - [Braintrust vs Langfuse vs Kitaru](https://www.zenml.io/blog/braintrust-vs-langfuse)
  - [ ] Read the on_miss paragraph in the same section  _(3m)_
    [same post, same 'Agent Replay and Tool-Call Overrides' section, the paragraph naming fail, error_result and passthrough](https://www.zenml.io/blog/braintrust-vs-langfuse)
  - [ ] Write the three on_miss values and the two override types from memory, then check them against the page  _(3m)_
    Done when: fail, error_result, passthrough, plus static and passthrough-for-one-tool — five terms correct
- [ ] **Deterministic evaluators**  (6m)
  They read stored session evidence only. They never run the agent, call a provider, replay, or touch a live tool, and evaluation is started explicitly rather than on import.
  - [Kitaru deterministic evaluations](https://docs.zenml.io/kitaru/guides/deterministic-evaluations)
  - [ ] Read the guide up to the SDK section  _(4m)_
    [ZenML docs, 'Deterministic evaluations' guide, everything before 'Start with the descriptive bundles'](https://docs.zenml.io/kitaru/guides/deterministic-evaluations)
    Skip: 'Run through the Python SDK', 'Respect the batch limit', 'Current evidence limits' and 'Versioning' — implementation detail, not needed for the room.
  - [ ] Say the constraint list out loud  _(2m)_
    Done when: no agent run, no provider call, no replay, no live tool, no external read, evaluation started explicitly
- [ ] **The guided tour, run by a coding agent**  (7m)
  The tour is driven by skills inside Claude Code, Codex or Cursor. Run it yourself and keep notes on friction.
  - [Kitaru README and guided tour](https://github.com/zenml-io/kitaru)
  - [Kitaru skills for coding agents](https://github.com/zenml-io/kitaru-skills)
  - [ ] Read the 'Get started' section  _(2m)_
    [Kitaru README, the paragraph on opening the example directory in Claude Code, Codex or Cursor and taking the guided tour](https://github.com/zenml-io/kitaru)
  - [ ] Read the guided-tour skill's own description  _(3m)_
    [kitaru-skills README, the kitaru-guided-tour entry](https://github.com/zenml-io/kitaru-skills)
  - [ ] Say out loud what the tour is supposed to produce before you run it  _(2m)_
    Done when: one accepted finding turned into a deterministic evaluator, and one approved bounded replay
Practice:
- [ ] Re-drill the two-minute bench story until the headline comes first every time
- [ ] Fix the two weakest items from the mock: the critique and your questions
- [ ] Install Kitaru and run the guided tour on the example agent
- [ ] Read the launch post and the deterministic evaluators page
  - Read: [Kitaru docs: what a replay is](https://docs.zenml.io/kitaru/core-concepts/replay)  (6m)
- [ ] What is the headline of your bench story?
- [ ] What is your strongest single critique of Kitaru?
- [ ] How should questions to the interviewers be asked?
- [ ] State the two-minute bench story headline first, then explain why leading with mechanism rather than the numbers matters in this room.

### Your story: the alfred_ eval bench  (1h 30m)

Practice:
- [ ] Say the headline in one breath  _(10m)_
  - Read: [Hamel Husain: your AI product needs evals](https://hamel.dev/blog/posts/evals/index.html)  (22m)
  - Read: [AI Engineering from Scratch, phase 14, lesson 30: eval-driven agent development](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/14-agent-engineering/30-eval-driven-agent-development)  (5m)
  - Guide: [Technique: Environment snapshots](SYSTEM%20DESIGN.html#/patterns/agent-durability/env-snapshots). The bench's frozen world is this technique: the agent runs against a copy, never the real inbox.
  - Guide: [Technique: Eval suites as release gates](SYSTEM%20DESIGN.html#/patterns/grounding/eval-gate). What the bench became: the thing that signed off the orchestration rewrite.
- [ ] Learn the fact sheet cold  _(20m)_
  - Read: [Anthropic: demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)  (40m)
  - Guide: [alfred_, deep dives](SYSTEM%20DESIGN.html#/designs/alfred/deepdives). The system the bench tests, drawn from your own code.
- [ ] Deliver the two-minute version, three times, out loud  _(20m)_
- [ ] Walk the five-minute version in nine beats  _(20m)_
- [ ] Answer the follow-ups, number first  _(20m)_
  - Read: [Eugene Yan: evaluating LLM evaluators, agreement with human labels](https://eugeneyan.com/writing/llm-evaluators/)  (38m)
  - Read: [AI Engineering from Scratch, phase 14, lesson 52: designing success metrics](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/14-agent-engineering/52-design-success-metrics)  (3m)
  - Guide: [Technique: Shadow mode and online signals](SYSTEM%20DESIGN.html#/patterns/grounding/shadow-online). Where the scanner's production signals come from, and why they over-fire.
- [ ] Draw the bench as a system, on paper  _(10m)_
  - Read: [AI Engineering from Scratch, phase 14, lesson 31: the agent workbench, why models fail](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/14-agent-engineering/31-agent-workbench-why-models-fail)  (15m)
  - Read: [AI Engineering from Scratch, phase 11, lesson 10: evaluating LLM applications](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/11-llm-engineering/10-evaluation)  (20m)
  - Guide: [alfred_, high-level design](SYSTEM%20DESIGN.html#/designs/alfred/hld). Draw the bench as a box beside this: scanner, judge, reconciler, snapshot, replay.
- [ ] What is the one-sentence headline of the bench?
- [ ] How is authoring cost best stated?
- [ ] What does a snapshot built from about twenty-five real instances buy you?

### The round-two critique, fixed  (1h)

Practice:
- [ ] Name three things in Kitaru that are wrong or oversold, without a compliment  _(15m)_
  - Read: [Replay baselines that silently drift when a tool's identity changes](https://dev.to/gabrielanhaia/stop-keying-agent-replay-on-tool-names-use-fingerprints-1m63)  (10m)
  - Guide: [Technique: Enforced citations and verification](SYSTEM%20DESIGN.html#/patterns/grounding/citations). Provenance is the same idea: every result says where it came from.
- [ ] Make the cache miss productive  _(12m)_
  - Read: [VCR.py: record modes, what happens on a miss](https://vcrpy.readthedocs.io/en/latest/usage.html)  (1m)
  - Read: [VCR.py: how a request is matched to a recording](https://vcrpy.readthedocs.io/en/latest/configuration.html)  (1m)
  - Guide: [Technique: Cache-aside (Redis)](SYSTEM%20DESIGN.html#/patterns/scaling-reads/cache-aside). What a miss means in an ordinary cache, and why a replay miss is different: it is information.
- [ ] Tell the false-signal story: two missing refunds  _(12m)_
  - Read: [Snapshot tests against behaviour-checking tests, the trade-offs](https://www.sitepen.com/blog/snapshot-testing-benefits-and-drawbacks)  (9m)
  - Guide: [Technique: Monitoring and completeness checks](SYSTEM%20DESIGN.html#/patterns/reliability/monitoring). Asserting every refund appears is a completeness check against ground truth you hold.
- [ ] Re-say the intro and the ownership probe  _(10m)_
- [ ] Prepare your questions, one at a time  _(11m)_
- [ ] Asked what is wrong with Kitaru, what is the worst possible answer?
- [ ] What was round two's biggest intro miss?
- [ ] How should questions to the interviewer be asked?

### Kitaru at mechanism depth  (2h)

Practice:
- [ ] Control plane and data plane  _(15m)_
  - Read: [Control plane and data plane, explained](https://konghq.com/blog/learning-center/control-plane-vs-data-plane)  (9m)
- [ ] The execution model: there is no sandbox  _(15m)_
  - Read: [What running a subprocess without a sandbox gives away](https://www.pandastack.ai/blog/how-to-sandbox-untrusted-code/)  (19m)
  - Guide: [Technique: Least privilege and sandboxing](SYSTEM%20DESIGN.html#/patterns/agent-safety/least-privilege). What Kitaru deliberately does not do: your agent runs with your process's rights.
- [ ] One recursive table, and the objects around it  _(15m)_
  - Read: [Postgres docs: WITH RECURSIVE, for a tree in one table](https://www.postgresql.org/docs/current/queries-with.html)  (15m)
  - Read: DDIA, 2e: Data models and query languages, the part on trees and graphs  (12m)
- [ ] Tool policy and on_miss, exactly  _(15m)_
  - Read: [Kitaru docs: replay and overrides, the tool policies](https://docs.zenml.io/kitaru/guides/replay-and-overrides)  (4m)
  - Guide: [Technique: Tool effect classes](SYSTEM%20DESIGN.html#/patterns/agent-safety/effect-classes). Tool policies are a replay-time version of sorting tools by what they do to the world.
- [ ] The cache key, and what matches  _(15m)_
  - Read: [Kitaru docs: replay and overrides, the cache key and on_miss](https://docs.zenml.io/kitaru/guides/replay-and-overrides)  (4m)
- [ ] Occurrence flips with scope  _(15m)_
- [ ] Multi-turn, and what always runs live  _(20m)_
  - Read: [Regression-testing multi-turn conversations as whole trajectories](https://dev.to/jackm-singularity/conversation-regression-testing-for-ai-agents-catch-multi-turn-failures-before-production-emg)  (10m)
  - Guide: [Technique: Transcript checkpoint every turn](SYSTEM%20DESIGN.html#/patterns/agent-durability/transcript-checkpoint). Why last-turn replay is possible at all: every turn is recorded as it happens.
- [ ] Where does Kitaru intercept a tool call?
- [ ] What does on_miss passthrough leave on the node?
- [ ] What does baseline scope do with repeated identical calls?

### Design: replay-based evals, from scratch, timed  (1h 30m)

Practice:
- [ ] Requirements in five minutes  _(10m)_
  - Read: [Temporal: what durable execution is](https://docs.temporal.io/evaluate/understanding-temporal)  (9m)
  - Read: [AI Engineering from Scratch, phase 15, lesson 12: durable execution](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/15-autonomous-systems/12-durable-execution)  (6m)
- [ ] Entities, API and the high-level design  _(15m)_
  - Read: [Temporal: workflow execution, event history and replay](https://docs.temporal.io/workflow-execution)  (3m)
  - Read: [AI Engineering from Scratch, phase 15, lesson 16: checkpoints and rollback](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/15-autonomous-systems/16-checkpoints-rollback)  (6m)
- [ ] Deep dive: divergence, the better the change the worse the replay  _(15m)_
  - Read: [TigerBeetle: deterministic simulation testing, and why determinism is the whole game](https://tigerbeetle.com/blog/2026-08-20-protocol-aware-dst/)  (11m)
- [ ] Deep dive: trust and provenance  _(10m)_
  - Read: [AI Engineering from Scratch, phase 14, lesson 24: agent observability platforms](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/14-agent-engineering/24-agent-observability-platforms)  (4m)
  - Guide: [Technique: Enforced citations and verification](SYSTEM%20DESIGN.html#/patterns/grounding/citations). Trust in a replay is provenance on every node, the same move as citing every claim.
- [ ] Deep dive: the worker queue and concurrency  _(10m)_
  - Read: [Temporal: worker slots and concurrency on a task queue](https://docs.temporal.io/develop/worker-performance)  (2m)
  - Read: [Crunchy Data: a queue in plain Postgres with SKIP LOCKED](https://www.crunchydata.com/blog/message-queuing-using-native-postgresql)  (10m)
  - Guide: [Technique: Queue claiming with SKIP LOCKED](SYSTEM%20DESIGN.html#/patterns/contention/claim-skip-locked). Two workers, one table, no double claims.
  - Guide: [Technique: Leases, heartbeats, visibility timeouts](SYSTEM%20DESIGN.html#/patterns/long-running/leases). What happens when a worker dies holding a replay.
  - Guide: [Technique: Queue plus worker pool](SYSTEM%20DESIGN.html#/patterns/long-running/worker-pool). The shape of the replay runner.
- [ ] Say it in thirty-five minutes, then write its three weakest points  _(30m)_
- [ ] What is the hard part of replay, in one phrase?
- [ ] What should ship first?
- [ ] How do workers claim tasks without serialising the table?

### Side effects inside replay, in depth  (2h)

- [ ] **Idempotency keys**  (10m)
  A client-supplied key per logical operation, stored with its result, so a retry returns the stored result instead of acting twice. Walk through Stripe's version.
  - [Stripe, idempotency](https://stripe.com/blog/idempotency)
  - [Stripe API, idempotent requests](https://docs.stripe.com/api/idempotent_requests)
  - [ ] Read the key-mechanics passage  _(4m)_
    [Stripe API docs, 'Idempotent requests' — the paragraphs on how the key is generated, the 24-hour retention window, and parameter comparison on retry](https://docs.stripe.com/api/idempotent_requests)
    Skip: The Stripe CLI and agent-skills promo at the top of the page.
  - [ ] Read the design rationale  _(3m)_
    [Stripe blog, 'Designing robust and predictable APIs with idempotency' — the section on guaranteeing exactly-once semantics](https://stripe.com/blog/idempotency)
  - [ ] Say Kitaru's key and Stripe's key side by side, out loud  _(3m)_
    Done when: session, step and argument-hash versus a client-supplied UUID — both compared to a stored result on repeat
- [ ] **Idempotence in stream processing**  (9m)
  Exactly-once processing is really at-least-once delivery plus idempotent effects. DDIA's section on idempotence in chapter 11 is the canonical explanation.
  - DDIA 2e - index: idempotence. The stream-processing chapter
  - [ ] Read the section  _(5m)_
    DDIA 2e - index: idempotence; exactly-once semantics. The stream-processing chapter's fault-tolerance section, the idempotence subsection
  - [ ] Write one sentence connecting it to your bench  _(4m)_
    Done when: one written sentence: exactly-once evaluation is at-least-once replay plus idempotent tool responses
- [ ] **Durable execution: event history and replay**  (11m)
  Temporal re-runs workflow code from the start, and previously executed activities return their results from the event history instead of running again. That is Kitaru's answer-from-recording idea in its original form.
  - [Temporal, workflows and replay](https://docs.temporal.io/workflows)
  - [Temporal, how a worker replays history](https://docs.temporal.io/tasks)
  - [ ] Read how replay works  _(4m)_
    [Temporal docs, 'Workflows' page, the 'How Workflow replay works' section](https://docs.temporal.io/workflows)
    Skip: 'Intro to Workflows' above it — background you already have.
  - [ ] Read how a worker executes it  _(4m)_
    [Temporal docs, 'Tasks' page, 'How does a Worker process a Workflow Task?'](https://docs.temporal.io/tasks)
  - [ ] Say the one-sentence mapping out loud  _(3m)_
    Done when: Temporal's event history is to a crashed workflow what your recording is to a replayed session
- [ ] **Determinism, and replay-safe time**  (7m)
  Workflow code must make the same decisions given the same history, so time is read from the workflow context rather than the real clock. That is the fix for the frozen-data, live-clock critique of Kitaru.
  - [Temporal, workflows and replay](https://docs.temporal.io/workflows)
  - [ ] Read the determinism constraints  _(4m)_
    [Temporal docs, 'Workflows' page, 'Resuming a Workflow' subsection — the Date.now, random and unrecorded-network-call examples, and the note that time is read from the workflow context](https://docs.temporal.io/workflows)
  - [ ] Say the mapping to Kitaru's clock critique out loud  _(3m)_
    Done when: one sentence: a replay-safe evaluator reads time from the recorded session, never the wall clock
- [ ] **Activities are where side effects live**  (6m)
  Side effects belong in activities, which are retried and therefore must be idempotent. The workflow itself stays deterministic. Map this onto tools in an agent.
  - [Temporal, workflows and replay](https://docs.temporal.io/workflows)
  - [ ] Read the page  _(3m)_
    [Temporal docs, 'What is a Temporal Activity?' — the whole page, it has no subheadings](https://docs.temporal.io/activities)
  - [ ] Say the two-line mapping out loud  _(3m)_
    Done when: activities are to workflows what tools are to an agent; both are retried, so both must be idempotent
- [ ] **Retries with backoff and jitter**  (8m)
  Why naive retries cause storms, and why jitter matters more than backoff alone.
  - [AWS, backoff and jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
  - [ ] Read the three jitter strategies  _(5m)_
    [AWS Architecture Blog, 'Exponential Backoff And Jitter' — the comparison of Full Jitter, Equal Jitter and Decorrelated Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
    Skip: The opening incident narrative — go straight to the algorithm comparison and its chart.
  - [ ] Say why jitter beats backoff alone  _(3m)_
    Done when: one sentence: jitter decorrelates clients that failed together, backoff alone does not
- [ ] **Fakes, stubs and mocks**  (8m)
  A stub returns canned answers, a mock checks it was called correctly, a fake is a working lightweight implementation. Your SQLite snapshot is a fake; Kitaru's recorded results behave like stubs. That distinction explains why your bench survives going off-path.
  - [Martin Fowler, mocks aren't stubs](https://martinfowler.com/articles/mocksArentStubs.html)
  - [ ] Read the definitions and the mock-stub distinction  _(5m)_
    [Martin Fowler, 'Mocks Aren't Stubs' — the Fake, Stub and Mock definitions, and 'The Difference Between Mocks and Stubs'](https://martinfowler.com/articles/mocksArentStubs.html)
    Skip: 'Classical and Mockist Testing' and 'Choosing Between the Differences' — the testing-philosophy debate, not the definitions.
  - [ ] Say where your bench and Kitaru sit, out loud, in Fowler's terms  _(3m)_
    Done when: your SQLite snapshot named as a fake, Kitaru's recorded results named as stubs
Practice:
- [ ] Classify tool calls by what they do to the world
- [ ] State Kitaru's current answer precisely
- [ ] State your bench's answer, and its cost
- [ ] Design an effect ledger
- [ ] Work the send-succeeded-but-response-timed-out case
- [ ] Connect it to durable execution
  - Read: [Temporal docs: activities, where side effects live](https://docs.temporal.io/activities)  (3m)
  - Read: [AI Engineering from Scratch, phase 15, lesson 12: durable execution](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/15-autonomous-systems/12-durable-execution)  (6m)
- [ ] Say the whole design out loud, then write what it does not solve
- [ ] A forked replay issues a refund the recording never saw. What should happen by default?
- [ ] What is an idempotency key for a side-effecting tool call typically built from?
- [ ] Why does deterministic replay of a workflow require recording effects?
- [ ] Explain why a forked replay that issues a refund the recording never saw should not simply pass through to the live payment provider by default.

### Design: multi-turn replay when the conversation changes  (2h)

- [ ] **tau-bench's design**  (13m)
  An agent converses with an LLM-simulated user who has a goal and reveals information gradually, while the agent calls tools that write to a shared database. Success is judged by comparing the final database state with an annotated goal state.
  - [tau-bench, ICLR 2025](https://mlanthology.org/iclr/2025/yao2025iclr-bench/)
  - [tau-bench explained, irreversible actions](https://medium.com/@duttasaswata7/structuring-multi-agent-systems-around-irreversible-actions-lessons-from-tau-bench-defe0f139eda)
  - [ ] Read the abstract and the opening of Section 3  _(5m)_
    [arXiv 2406.12045, abstract and the opening of Section 3, "tau-bench: A Benchmark for Tool-Agent-User Interaction"](https://arxiv.org/abs/2406.12045)
    Done when: one sentence: a simulated user with a goal talks to an agent that calls tools against a shared database — authors Yao, Shinn, Razavi and Narasimhan, ICLR 2025
  - [ ] Read the repo's top description and its two domains  _(5m)_
    [sierra-research/tau-bench README, the top description and the airline and retail domains](https://github.com/sierra-research/tau-bench/blob/main/README.md)
    Done when: can name both domains and say the agent's tool calls write to a real database, not a mock
    Skip: the installation and CLI-flag sections — that is setup, not design
  - [ ] Say the one-sentence setup out loud, cold  _(3m)_
    Done when: the sentence spoken correctly without checking the page
- [ ] **Goal-state evaluation**  (18m)
  Checking the world at the end, rather than the transcript, is exactly what your frozen-world bench does, and it is what makes multi-turn evaluation robust to a different path. This is your strongest link between your work and theirs.
  - [tau-bench, ICLR 2025](https://mlanthology.org/iclr/2025/yao2025iclr-bench/)
  - [ ] Read the reward definition in Section 3  _(5m)_
    [arXiv 2406.12045, Section 3, the paragraph defining the episode reward from the final database state](https://arxiv.org/abs/2406.12045)
    Done when: the reward is checked against the final database matching a unique ground-truth outcome database, not by grading the conversation
  - [ ] Write two sentences naming what plays the role of "final database" and "annotated goal state" in your own frozen-world bench  _(8m)_
    Done when: two sentences in the Answer field naming your bench's equivalent objects
  - [ ] Say out loud why checking the end state survives the agent taking a different path to the same goal  _(5m)_
    Done when: one spoken sentence: path independence — the same argument behind your own goal-state check
- [ ] **pass^k against pass@k**  (18m)
  pass@k asks whether at least one of k attempts succeeds. pass^k asks whether all k succeed, which is the right measure for an agent that gets one chance per customer, and which falls off sharply as k grows.
  - [tau-bench explained, irreversible actions](https://medium.com/@duttasaswata7/structuring-multi-agent-systems-around-irreversible-actions-lessons-from-tau-bench-defe0f139eda)
  - [ ] Read the pass^k paragraph twice and copy the formula out by hand  _(6m)_
    [arXiv 2406.12045, Section 3, the paragraph defining pass^k with the expectation-and-binomial-coefficient formula](https://arxiv.org/abs/2406.12045)
    Done when: written correctly from memory: pass^k = E_task[ C(c,k) / C(n,k) ], the chance that all k of n independent trials succeed, averaged over tasks
    Skip: the pass@k line — that is the next action
  - [ ] Read the pass@k line immediately after it and hold the two side by side  _(4m)_
    [arXiv 2406.12045, Section 3, the pass@k definition directly below pass^k](https://arxiv.org/abs/2406.12045)
    Done when: the contrast stated correctly: pass@k is the chance at least one of k succeeds, pass^k is the chance all k succeed
  - [ ] Read the retail headline number in the results section  _(4m)_
    [arXiv 2406.12045, Section 5.1, the gpt-4o result on tau-retail](https://arxiv.org/abs/2406.12045)
    Done when: the paper states it as bounds, so state it that way: under 50 percent at pass^1 on tau-retail, under 25 percent at pass^8. Repetition finds the unreliability a single run hides
  - [ ] Say the formula and the one-sentence reliability argument out loud, no notes  _(4m)_
    Done when: formula spoken correctly, then: pass@k asks if you can solve it once, pass^k asks if you can solve it every time
- [ ] **Simulated user failure modes**  (17m)
  Too cooperative, leaking the goal, drifting from the persona, and costing money every turn. Know how tau-bench structures its simulator, including the stop signal when the goal is met.
  - [tau-bench explained, irreversible actions](https://medium.com/@duttasaswata7/structuring-multi-agent-systems-around-irreversible-actions-lessons-from-tau-bench-defe0f139eda)
  - [ ] Read the User simulation subsection in Section 3  _(6m)_
    [arXiv 2406.12045, Section 3, the "User simulation" subsection](https://arxiv.org/abs/2406.12045)
    Done when: the user is gpt-4-0613 driven only by a system prompt plus the running conversation history, and it ends the episode by emitting the literal string ###STOP###
  - [ ] Open tau_bench/envs/user.py and skim the four strategy names, then read the README's plain-language description of each  _(6m)_
    [sierra-research/tau-bench, tau_bench/envs/user.py, and the README's user-strategy section](https://github.com/sierra-research/tau-bench/blob/main/tau_bench/envs/user.py)
    Done when: four strategies named: llm (plain), react (reasons before replying), verify (checks its own reply), reflection (redoes an unsatisfactory reply)
    Skip: the airline and retail environment files in the same directory — different concern
  - [ ] Say the two failure modes that matter most for a support agent, and which strategy each argues for guarding against  _(5m)_
    Done when: two sentences spoken: react and verify exist because a plain llm-strategy user can be too compliant or over-reveal the goal early
Practice:
- [ ] State the problem in one sentence
- [ ] Lay out the three options and the trade in each
  - Read: [tau-bench paper: tool, agent and a simulated user, and pass^k](https://arxiv.org/abs/2406.12045)  (10m)
- [ ] Design the simulated user properly
- [ ] Name the risks and the calibration that answers them
  - Read: [AI Engineering from Scratch, phase 14, lesson 19: agent benchmarks](https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/14-agent-engineering/19-benchmarks-swebench-gaia)  (5m)
- [ ] Connect it to promoting a session into a world
- [ ] Say it out loud in six minutes, then write the open questions
- [ ] Why hold the simulated user fixed across baseline and fork?
- [ ] How do you calibrate a simulated user?
- [ ] What is the main failure mode of simulated users?
- [ ] Explain why the simulated user must be calibrated against the unchanged baseline before it is trusted on a changed agent.

### Backend depth: where a technical round goes down  (1h 30m)

Practice:
- [ ] Why SQLite when production is Postgres  _(12m)_
  - Read: [Postgres docs: template databases](https://www.postgresql.org/docs/current/manage-ag-templatedbs.html)  (4m)
  - Read: [SQLite docs: datatypes and type affinity](https://www.sqlite.org/datatype3.html)  (18m)
  - Guide: [Technique: Environment snapshots](SYSTEM%20DESIGN.html#/patterns/agent-durability/env-snapshots). SQLite file or Postgres template: two ways to build the same snapshot.
- [ ] A side-effecting call fails halfway  _(15m)_
  - Read: [Stripe: designing APIs with idempotency](https://stripe.com/blog/idempotency)  (6m)
  - Read: [Brandur Leach: Stripe-like idempotency keys in Postgres](https://brandur.org/idempotency-keys)  (22m)
  - Read: DDIA, 2e: The trouble with distributed systems, timeouts and unknown outcomes  (18m)
  - Read: DDIA, 2e: Stream processing, exactly-once and idempotence  (15m)
  - Guide: [Technique: Idempotency keys](SYSTEM%20DESIGN.html#/patterns/multi-step/idempotency). Where the key lives decides whether a retry is safe.
  - Guide: [Technique: Transactional outbox](SYSTEM%20DESIGN.html#/patterns/multi-step/outbox). Write the intent before the call, the ledger's shape.
  - Guide: [Technique: Idempotent tools and unknown results](SYSTEM%20DESIGN.html#/patterns/agent-durability/unknown-results). The send succeeded but the response timed out.
- [ ] The queue, and polling to events  _(12m)_
  - Read: [Postgres docs: the locking clause, FOR UPDATE SKIP LOCKED](https://www.postgresql.org/docs/current/sql-select.html)  (9m)
  - Read: [Crunchy Data: a queue in plain Postgres with SKIP LOCKED](https://www.crunchydata.com/blog/message-queuing-using-native-postgresql)  (10m)
  - Read: [Postgres docs: LISTEN, triggering on the event](https://www.postgresql.org/docs/current/sql-listen.html)  (2m)
  - Read: DDIA, 2e: Transactions, locks and isolation  (25m)
  - Guide: [Technique: Queue claiming with SKIP LOCKED](SYSTEM%20DESIGN.html#/patterns/contention/claim-skip-locked). The idiom to name when they ask how the queue is claimed.
  - Guide: [Technique: Polling and long polling](SYSTEM%20DESIGN.html#/patterns/real-time/polling). Why a cron drain's worst case is its interval, and what triggering on the event buys.
  - Guide: [Technique: Retries with backoff and a dead-letter queue](SYSTEM%20DESIGN.html#/patterns/long-running/retries-dlq). The backstop you keep after moving to events.
- [ ] The SECURITY DEFINER story  _(12m)_
  - Read: [Postgres docs: CREATE FUNCTION, writing SECURITY DEFINER functions safely](https://www.postgresql.org/docs/current/sql-createfunction.html)  (3m)
  - Read: [Postgres docs: ALTER DEFAULT PRIVILEGES, and EXECUTE granted to PUBLIC](https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html)  (6m)
  - Read: [Supabase docs: row-level security and security definer functions](https://supabase.com/docs/guides/database/postgres/row-level-security)  (24m)
  - Guide: [Technique: Least privilege and sandboxing](SYSTEM%20DESIGN.html#/patterns/agent-safety/least-privilege). SECURITY DEFINER plus a PUBLIC grant is least privilege failing by default.
- [ ] Schema drift and provider normalisation  _(12m)_
  - Read: [Gmail API: synchronising a client with history.list](https://developers.google.com/workspace/gmail/api/guides/sync)  (3m)
  - Read: [Microsoft Graph: delta query for messages](https://learn.microsoft.com/en-us/graph/delta-query-messages)  (8m)
  - Guide: [Email and calendar agent, high-level design](SYSTEM%20DESIGN.html#/designs/email-agent/hld). An agent over Gmail and a calendar, with the providers behind one model.
- [ ] Say 'I don't know' well, then run one cold question  _(27m)_
- [ ] What is the honest answer on exactly-once side effects?
- [ ] Why did the SECURITY DEFINER functions leak across users?
- [ ] When pushed on a claim, which way do you go?

### DevEx: explaining Kitaru to a developer  (1h 15m)

- [ ] **How Alex writes and what he writes about**  (23m)
  Read two or three of his recent posts, including the analysis of production LLM deployments and the one on rebuilding the site with Claude Code. Notice how he explains things; that is the bar he will hold you to.
  - [Alex's posts on the ZenML blog](https://www.zenml.io/author/alex-strick-van-linschoten)
  - [Alex's site](https://alexstrick.com/)
  - [ ] Read "How I Rebuilt zenml.io in a Week with Claude Code" end to end  _(10m)_
    [ZenML blog, "How I Rebuilt zenml.io in a Week with Claude Code", all six sections](https://www.zenml.io/blog/how-i-rebuilt-zenml-io-in-a-week-with-claude-code)
    Done when: one specific claim you can cite: he tried git worktrees for parallel Claude Code sessions and dropped them because merge conflicts across many changed files made it slower than working sequentially
  - [ ] Read "The Experimentation Phase Is Over", skimming past the intro to the six numbered findings  _(8m)_
    [ZenML blog, "The Experimentation Phase Is Over: Key Findings from 1,200 Production Deployments", the six findings](https://www.zenml.io/blog/the-experimentation-phase-is-over-key-findings-from-1-200-production-deployments)
    Done when: can name two of the six without looking: engineering fundamentals over frontier models, and infrastructure-based guardrails over prompt-based ones
    Skip: the LLMOps Database methodology — the findings matter, not the corpus size
  - [ ] Say, in one sentence each, what these two pieces show about how Alex explains things  _(5m)_
    Done when: two spoken sentences naming the worktree reversal and one of the six findings — concrete numbers and a named decision, not general praise
- [ ] **Kitaru's onboarding path**  (23m)
  Clone, open the example in a coding agent, run the guided tour skill. Know every step because you did it.
  - [Kitaru README and guided tour](https://github.com/zenml-io/kitaru)
  - [Kitaru skills for coding agents](https://github.com/zenml-io/kitaru-skills)
  - [ ] Read the Installation section, then the PydanticAI example path  _(8m)_
    [github.com/zenml-io/kitaru README, Installation, then examples/python/pydantic_ai_ticket_resolver](https://github.com/zenml-io/kitaru)
    Done when: the install command memorised: curl -fsSL https://kitaru.ai/install | bash, which also registers the MCP server and coding-agent skills
    Skip: the TypeScript adapter docs and the other example projects
  - [ ] In a coding agent, paste the README's guided-tour prompt and run kitaru-guided-tour against the PydanticAI ticket-resolver example  _(10m)_
    [the README's guided-tour paragraph, and the kitaru-guided-tour skill](https://github.com/zenml-io/kitaru-skills)
    Done when: the four stages named from having watched them run: a prepared session review, a human verdict on one finding, that finding turned into a deterministic evaluator, one approved bounded experiment
    Skip: letting the tour touch anything paid or live — it should ask first, and the answer is no
  - [ ] Say the four stages in order, out loud, and name the point where the tour paused to ask before continuing  _(5m)_
    Done when: four stages spoken in order, and the pause point named
Practice:
- [ ] Describe the first ten minutes as you actually experienced them
  - Read: [Alex Strick van Linschoten's blog](https://alexstrick.com/)  (2m)
- [ ] Write a hundred-and-fifty-word explanation of replay-based evals for a developer who already uses Langfuse
  - Read: [Alex Strick: how to think about evals for LLM applications](https://alexstrick.com/posts/2025-05-20-how-to-think-about-evals.html)  (11m)
- [ ] Prepare your view on agent-driven onboarding
  - Read: [Kitaru docs: setup, the MCP server and agent skills](https://docs.zenml.io/kitaru/getting-started/setup)  (10m)
- [ ] Rehearse your first-post pitch
  - Read: [Kitaru docs: welcome](https://docs.zenml.io/kitaru)  (6m)
- [ ] What is the best evidence of DevEx judgement you can bring?
- [ ] What distinguishes a well-designed onboarding skill?
- [ ] The key idea to get across to a Langfuse user is:
- [ ] Explain, in one sentence, the difference between Kitaru and reading traces in Langfuse, for a developer who already trusts their trace store.

### ZenML context for the CTO  (45m)

- [ ] **ZenML's core abstractions**  (10m)
  Pipelines and steps, stacks that bind them to infrastructure, orchestrators, artifact stores and lineage. Enough to hold a conversation, not to pass an exam.
  - [ZenML docs](https://docs.zenml.io)
  - [ ] Read the Core Concepts page's five main entries  _(6m)_
    [docs.zenml.io, Getting Started, Core Concepts — Steps, Pipelines, Stacks, Orchestrator, Artifact Store](https://docs.zenml.io/getting-started/core-concepts)
    Done when: five one-line definitions in your own words: a step is a decorated function, a pipeline is steps in order, a stack is a bound set of infrastructure components, the orchestrator decides what runs and when, the artifact store holds and versions every input and output
    Skip: Materializers, Models, Parameters and Settings — good to know exist, not needed for this call
  - [ ] Say the five terms out loud in one sentence each, no notes  _(4m)_
    Done when: five sentences spoken correctly, in order: steps, pipelines, stacks, orchestrator, artifact store
- [ ] **Kitaru's positioning**  (17m)
  It sits beside trace stores rather than competing with them: they keep the traces, Kitaru makes them runnable. It also frames itself as adding a durable runtime around agent harnesses.
  - [Braintrust vs Langfuse vs Kitaru](https://www.zenml.io/blog/braintrust-vs-langfuse)
  - [ZenML blog, Kitaru category](https://www.zenml.io/category/kitaru)
  - [ ] Read the Kitaru docs home page's opening description  _(5m)_
    [docs.zenml.io/kitaru, the introduction paragraph](https://docs.zenml.io/kitaru)
    Done when: the line close to verbatim: beside your observability, not instead of it — they remain where you watch production, Kitaru is where you re-run it
  - [ ] Read the comparison page for the one sentence on where Kitaru sits relative to the other two tools  _(5m)_
    [ZenML blog, "Braintrust vs Langfuse vs Kitaru", the section on where Kitaru sits](https://www.zenml.io/blog/braintrust-vs-langfuse)
    Done when: one sentence: Kitaru treats Langfuse and Braintrust as import sources, not replacements, and tests a candidate change against the same recorded tool history
  - [ ] Form your own one-line answer to whether replay is the wedge or the whole product, and say it out loud  _(7m)_
    Done when: one spoken sentence that takes a position, not a summary of the docs
Practice:
- [ ] Know ZenML's core vocabulary at a working level
  - Read: [ZenML docs: core concepts](https://docs.zenml.io/getting-started/core-concepts)  (10m)
  - Read: [ZenML docs: steps and pipelines](https://docs.zenml.io/concepts/steps_and_pipelines)  (10m)
  - Read: [ZenML docs: artifacts and lineage](https://docs.zenml.io/concepts/artifacts)  (15m)
- [ ] Form your own view of the strategic bet
  - Read: [ZenML blog: the Kitaru launch](https://www.zenml.io/blog/kitaru-launch)  (10m)
  - Read: [ZenML docs: stacks and stack components](https://docs.zenml.io/concepts/stack_components)  (5m)
- [ ] Answer: if you ran Kitaru for a quarter, what would you ship first
- [ ] What connects ZenML's pipeline heritage to Kitaru?
- [ ] Why ship provenance first?
- [ ] What is the bet behind replay-based evals?
- [ ] Explain the throughline from ZenML's pipeline heritage to Kitaru's replay-based evals, the way its co-founder would recognise as his own thesis.

### The full ninety-minute mock  (1h 30m)

Practice:
- [ ] Run the live mock in chat: say run the ZenML round-three mock
- [ ] Monday morning: re-read the bench headline and your three questions, nothing else
