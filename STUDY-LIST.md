# Study list: ZenML round 3

Generated from the tracker on 25 Sep 2026 by the sheet view's copy-as-markdown control.
Tick an item only when you can say it out loud without notes. The indented actions
under an item are what to actually do, with honest minutes and where to stop.

ZenML round 3: Mon 28 Sep, 9 AM Eastern, ninety minutes of in-depth technical questions with Hamza and Alex. Oxus happened on 23 Sep; its design sessions moved into weeks 2 to 4 and the rest are parked.

---

## ZenML round 3

### Round three is a different room  (1h, 31m of actions)

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

### Side effects inside replay, in depth  (2h, 59m of actions)

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
- [ ] Say the whole design out loud, then write what it does not solve

### Design: multi-turn replay when the conversation changes  (2h, 1h 6m of actions)

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
- [ ] Design the simulated user properly
- [ ] Name the risks and the calibration that answers them
- [ ] Connect it to promoting a session into a world
- [ ] Say it out loud in six minutes, then write the open questions

### DevEx: explaining Kitaru to a developer  (1h 15m, 46m of actions)

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
- [ ] Write a hundred-and-fifty-word explanation of replay-based evals for a developer who already uses Langfuse
- [ ] Prepare your view on agent-driven onboarding
- [ ] Rehearse your first-post pitch

### ZenML context for the CTO  (45m, 27m of actions)

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
- [ ] Form your own view of the strategic bet
- [ ] Answer: if you ran Kitaru for a quarter, what would you ship first
