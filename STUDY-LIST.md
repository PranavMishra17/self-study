# Study list: Oxus and ZenML

Generated from the tracker on 22 September 2026. Tick an item only when you can say it out loud without notes.

Oxus technical: 23 September, 60 minutes, past work plus one system design exercise.
ZenML round 3: Monday 28 September, 9 AM Eastern, 90 minutes with Hamza Tahir and Alex Strick van Linschoten.


---

## Oxus

### The system design frame for this room  (45m)

- [ ] **The system design delivery flow**
  Requirements, then core entities and the API, then a high-level design, then deep dives. And why requirements come first: they decide which deep dive matters.
  - [Hello Interview, system design](https://www.hellointerview.com/learn/system-design)
  - [System design primer](https://github.com/donnemartin/system-design-primer)
- [ ] **Functional against non-functional requirements**
  Functional is what the system does. Non-functional is how well, and under which guarantees. In audit, the non-functional ones — traceability, reproducibility, isolation — are the product.
  - [Hello Interview, system design](https://www.hellointerview.com/learn/system-design)
- [ ] **Back-of-envelope estimation**
  Pages per engagement, bytes per page, OCR cost per page, to one significant figure, out loud. And which constraint does not matter here: batch latency.
  - [Latency numbers, interactive](https://colin-scott.github.io/personal_website/research/interactive_latency.html)
- [ ] **ICFR, and SOX sections 302, 404(a) and 404(b)**
  ICFR is the set of controls that give reasonable assurance the financial statements are reliable. 404(a) is management's own assessment of those controls, 404(b) is the external auditor's attestation, and 302 is the quarterly certification by the CEO and CFO. Oxus mostly serves the internal audit team doing the 404(a) work.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [PCAOB AS 2201, the ICFR audit standard](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2201)

Practice:
- [ ] Learn the thirty-five-minute shape and say it once out loud
- [ ] Write the five non-functional requirements for audit software in your own words
- [ ] Memorise the spine, and three places it applies
- [ ] Prepare the one clarifying question that changes the design

### Design: an agent that tests a SOX control  (2h)

- [ ] **Key control, control objective, owner, frequency**
  A key control is one the company relies on to address a significant risk. Every control has an objective, a named owner, and a frequency — annual, quarterly, monthly, daily, or per transaction — and frequency drives the sample size.
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
- [ ] **Test of design against test of operating effectiveness**
  Design asks whether the control, if it works, would address the risk; it is tested with a walkthrough of one transaction end to end. Operating effectiveness asks whether it actually worked across the whole period; it is tested on a sample.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
- [ ] **The four testing methods**
  Inquiry, observation, inspection, re-performance. Inquiry alone is never enough evidence. Oxus's agents mostly do inspection — reading the evidence — and some re-performance, recomputing what the control should have produced.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
- [ ] **Population, and IPE: information produced by the entity**
  The sample is drawn from a population report the company produces. That report must itself be checked for completeness and accuracy, or the whole test rests on data nobody verified. This is a great place for a design question: how does the system know the population is complete?
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
- [ ] **Sample sizes by control frequency**
  Firms use a table mapping frequency to sample size: small for annual controls, large for controls that run many times a day. Know that the table exists and where it comes from, rather than quoting numbers.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
- [ ] **Attributes, tickmarks, redboxing, exceptions, PBC**
  Attributes are the specific things checked per sample, like approved before posting, and by someone other than the preparer. Tickmarks and red boxes annotate the evidence. An exception is a sample where an attribute failed. PBC is the list of evidence requested from the client.
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
- [ ] **Deficiency, significant deficiency, material weakness**
  A deficiency means a control does not prevent or detect misstatements in a timely way. A material weakness is one where there is a reasonable possibility a material misstatement will not be caught. A significant deficiency sits between them. One material weakness means ICFR cannot be called effective.
  - [PCAOB AS 2201, the ICFR audit standard](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2201)
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
- [ ] **Automated controls and ITGCs**
  IT general controls — access, change management, operations — underpin automated controls. If the ITGCs are effective, an automated control can often be tested with very few samples, because it behaves the same way every time.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
- [ ] **Constrained citation, off the shelf**
  The Claude citations feature parses citations so every pointer is guaranteed valid, and custom content documents let you define the citable blocks yourself — which is your opaque-handle pattern as an API. The limit to name: a valid pointer does not prove the cited text supports the claim, so a verifier is still needed.
  - [Claude API, citations](https://docs.claude.com/en/docs/build-with-claude/citations)

Practice:
- [ ] Walk the pipeline end to end, naming which stages are code and which are the model
- [ ] Design sample selection as seeded code
- [ ] Design citation as constrained selection, not generation
- [ ] Make attribute results three-valued, with insufficient as a first-class answer
- [ ] Compute exceptions and constrain the conclusion
- [ ] Design the reviewer loop and the audit log
- [ ] Answer the evaluation question before she asks it
- [ ] Say the whole design out loud in eight minutes, then write its three weakest points

### Design: evidence ingestion from messy documents  (1h 30m)

- [ ] **Layout analysis and reading order**
  Before OCR text is useful you need to know what is a heading, a paragraph, a table, a footer, and in what order a human would read them. Docling does this with a layout model and then assembles reading order.
  - [Docling paper, arXiv 2501.17887](https://arxiv.org/html/2501.17887v1)
- [ ] **Table structure recognition**
  Tables are recovered as structured grids of cells, not flattened text, so a value can be cited to an exact cell. Docling uses TableFormer for this.
  - [Docling paper, arXiv 2501.17887](https://arxiv.org/html/2501.17887v1)
  - [Docling, the document data model](https://docling-project.github.io/docling/concepts/docling_document/)
- [ ] **The provenance data model**
  Every item carries its source page, bounding box and character span. Walk through Docling's document model and map it onto what Oxus needs for red boxes.
  - [Docling, the document data model](https://docling-project.github.io/docling/concepts/docling_document/)
- [ ] **OCR confidence and human review**
  Low-confidence regions are flagged, carried forward, and can force an insufficient result or a human check. Know the honest line about your own gap here.
  - [Docling paper, arXiv 2501.17887](https://arxiv.org/html/2501.17887v1)
- [ ] **Hybrid retrieval: lexical plus dense, and rank fusion**
  BM25 for exact identifiers, amounts and dates; dense embeddings for meaning; combine the rankings, commonly with reciprocal rank fusion. Your MetaRAG finding on metadata prefixes applies on the dense side.
  - [Sentence-Transformers docs](https://www.sbert.net)
- [ ] **Multi-tenant isolation**
  Silo — separate storage and index per tenant — against pool with row-level isolation. Per-tenant encryption keys. No shared cache. Your Postgres row-level-security story from alfred_ is real evidence here.
  - DDIA chapter 6, partitioning
- [ ] **Zero data retention with model providers**
  What it means for a provider not to retain inputs, why VPC customers demand it, and how it limits which models and features you can use.

Practice:
- [ ] Lay out the ingestion path by source type
- [ ] Make coordinates the core of the data model, and say why
- [ ] Handle tables and screenshots as structure, not text
- [ ] Carry parser confidence forward
- [ ] Design retrieval per tenant, and hybrid
- [ ] Cover isolation under VPC deployment
- [ ] Do one back-of-envelope out loud

### Design: walkthrough to flowchart, and the year-over-year base  (1h)

- [ ] **Process narratives, flowcharts and the RCM**
  Auditors document each process as a narrative and a flowchart, and map risks to controls in a risk and control matrix. Oxus generates the first two from walkthroughs and builds the matrix.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
- [ ] **Financial statement assertions**
  Existence or occurrence, completeness, valuation or accuracy, rights and obligations, presentation and disclosure. Each control addresses one or more. Knowing the list lets you talk about risk mapping in their language.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
- [ ] **Roll-forward of prior-year work**
  Each year, prior documentation is carried forward and updated rather than rebuilt. That is exactly what Oxus's knowledge base automates, and the diff between years is where the value is.
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)

Practice:
- [ ] Turn a walkthrough transcript into a process graph
- [ ] Map controls to risks with the model proposing and a human confirming
- [ ] Version the graph and diff it year over year
- [ ] Connect reviewer feedback to your memory system

### Your past work, at grilling depth  (1h 15m)

- [ ] **NDCG at ten, derived**
  Discounted cumulative gain sums relevance with a logarithmic discount by rank, then normalises by the ideal ordering. Be able to write it and explain why rank position is discounted.
  - [Wikipedia, discounted cumulative gain](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
- [ ] **Bi-encoders against cross-encoders**
  A bi-encoder embeds query and document separately, which is fast and indexable. A cross-encoder reads them together, which is slower and more accurate. That is why a cross-encoder made a stronger judge for your silver standard.
  - [Sentence-Transformers docs](https://www.sbert.net)
- [ ] **Calibrating an LLM judge against humans**
  Label a sample by hand, measure agreement, iterate the rubric, and re-check as the product changes. This is how your scanner's judge reached roughly three in four flags being genuine.
  - [Hamel Husain, LLM-as-a-judge](https://hamel.dev/blog/posts/llm-judge/)
  - [Eugene Yan, evaluating LLM evaluators](https://eugeneyan.com/writing/llm-evaluators/)
- [ ] **Evals when there is no ground truth**
  Error analysis on real outputs first, then targeted checks. Your two versions of this — silver standard in MetaRAG, replay bench in production — are the answer.
  - [Hamel Husain, your AI product needs evals](https://hamel.dev/blog/posts/evals/)
- [ ] **Your own MetaRAG paper, methods and limitations**
  Re-read the method and limitations sections tonight. An AI-degree interviewer will ask about the parts you wrote least recently.
  - MetaRAG, IEEE CAI 2026 — your own paper

Practice:
- [ ] Memory system: two minutes, then the follow-ups
- [ ] Decision layer: why deterministic risk scoring
- [ ] Eval harness, reframed for audit
- [ ] MetaRAG, at the depth an AI degree will ask
- [ ] Prepare the technical weakness question

### The last hour: mock, fixes, questions, sleep  (1h)

- [ ] **What Oxus actually shows publicly**
  The product's two halves, the traceability claims, and how they describe their customers. Watch before the call so your design uses their words.
  - [Oxus launch video](https://youtu.be/gmgO_Pa-vZk)
  - [Oxus site](https://www.oxus-ai.com)
- [ ] **Your prep file, sections F to H**
  Anticipated questions, your questions, and the weak points table. Skim, do not re-study.
  - prep_oxus_founding_engineer — your file

Practice:
- [ ] Run the live mock in chat: say run the Oxus mock
- [ ] Fix the relocation line in your prep file
- [ ] Pick three questions, and lead with the citation one
- [ ] Watch the two-minute launch video and re-skim the platform page
- [ ] Stop and sleep


---

## ZenML round 3

### Round three is a different room  (1h)

- [ ] **Kitaru's core objects**
  Sessions, recorded by an adapter or imported from Langfuse, LangSmith, Braintrust, Logfire or Arize Phoenix. Replays. Cohorts, which are immutable versions of a chosen set of sessions. Evaluators, deterministic and LLM-based.
  - [Introducing the new Kitaru](https://www.zenml.io/blog/introducing-the-new-kitaru)
  - [Kitaru README and guided tour](https://github.com/zenml-io/kitaru)
- [ ] **Faithful baseline, then fork with one override**
  Validate an unchanged replay first. Then fork with exactly one change — model, prompt, parameters — so any difference is attributable.
  - [Braintrust vs Langfuse vs Kitaru](https://www.zenml.io/blog/braintrust-vs-langfuse)
- [ ] **on_miss, static and passthrough**
  A call the recording never saw is handled by an explicit on_miss choice. One tool can be pinned to a static result or routed to pass through while everything else answers from history.
  - [Braintrust vs Langfuse vs Kitaru](https://www.zenml.io/blog/braintrust-vs-langfuse)
- [ ] **Deterministic evaluators**
  They read stored session evidence only. They never run the agent, call a provider, replay, or touch a live tool, and evaluation is started explicitly rather than on import.
  - [Kitaru deterministic evaluations](https://docs.zenml.io/kitaru/guides/deterministic-evaluations)
- [ ] **The guided tour, run by a coding agent**
  The tour is driven by skills inside Claude Code, Codex or Cursor. Run it yourself and keep notes on friction.
  - [Kitaru README and guided tour](https://github.com/zenml-io/kitaru)
  - [Kitaru skills for coding agents](https://github.com/zenml-io/kitaru-skills)

Practice:
- [ ] Re-drill the two-minute bench story until the headline comes first every time
- [ ] Fix the two weakest items from the mock: the critique and your questions
- [ ] Install Kitaru and run the guided tour on the example agent
- [ ] Read the launch post and the deterministic evaluators page

### Side effects inside replay, in depth  (2h)

- [ ] **Idempotency keys**
  A client-supplied key per logical operation, stored with its result, so a retry returns the stored result instead of acting twice. Walk through Stripe's version.
  - [Stripe, idempotency](https://stripe.com/blog/idempotency)
- [ ] **Idempotence in stream processing**
  Exactly-once processing is really at-least-once delivery plus idempotent effects. DDIA's section on idempotence in chapter 11 is the canonical explanation.
  - DDIA chapter 11, the idempotence section
- [ ] **Durable execution: event history and replay**
  Temporal re-runs workflow code from the start, and previously executed activities return their results from the event history instead of running again. That is Kitaru's answer-from-recording idea in its original form.
  - [Temporal, workflows and replay](https://docs.temporal.io/workflows)
  - [Temporal, how a worker replays history](https://docs.temporal.io/tasks)
- [ ] **Determinism, and replay-safe time**
  Workflow code must make the same decisions given the same history, so time is read from the workflow context rather than the real clock. That is the fix for the frozen-data, live-clock critique of Kitaru.
  - [Temporal, workflows and replay](https://docs.temporal.io/workflows)
- [ ] **Activities are where side effects live**
  Side effects belong in activities, which are retried and therefore must be idempotent. The workflow itself stays deterministic. Map this onto tools in an agent.
  - [Temporal, workflows and replay](https://docs.temporal.io/workflows)
- [ ] **Retries with backoff and jitter**
  Why naive retries cause storms, and why jitter matters more than backoff alone.
  - [AWS, backoff and jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [ ] **Fakes, stubs and mocks**
  A stub returns canned answers, a mock checks it was called correctly, a fake is a working lightweight implementation. Your SQLite snapshot is a fake; Kitaru's recorded results behave like stubs. That distinction explains why your bench survives going off-path.
  - [Martin Fowler, mocks aren't stubs](https://martinfowler.com/articles/mocksArentStubs.html)

Practice:
- [ ] Classify tool calls by what they do to the world
- [ ] State Kitaru's current answer precisely
- [ ] State your bench's answer, and its cost
- [ ] Design an effect ledger
- [ ] Work the send-succeeded-but-response-timed-out case
- [ ] Connect it to durable execution
- [ ] Say the whole design out loud, then write what it does not solve

### Design: multi-turn replay when the conversation changes  (2h)

- [ ] **tau-bench's design**
  An agent converses with an LLM-simulated user who has a goal and reveals information gradually, while the agent calls tools that write to a shared database. Success is judged by comparing the final database state with an annotated goal state.
  - [tau-bench, ICLR 2025](https://mlanthology.org/iclr/2025/yao2025iclr-bench/)
  - [tau-bench explained, irreversible actions](https://medium.com/@duttasaswata7/structuring-multi-agent-systems-around-irreversible-actions-lessons-from-tau-bench-defe0f139eda)
- [ ] **Goal-state evaluation**
  Checking the world at the end, rather than the transcript, is exactly what your frozen-world bench does, and it is what makes multi-turn evaluation robust to a different path. This is your strongest link between your work and theirs.
  - [tau-bench, ICLR 2025](https://mlanthology.org/iclr/2025/yao2025iclr-bench/)
- [ ] **pass^k against pass@k**
  pass@k asks whether at least one of k attempts succeeds. pass^k asks whether all k succeed, which is the right measure for an agent that gets one chance per customer, and which falls off sharply as k grows.
  - [tau-bench explained, irreversible actions](https://medium.com/@duttasaswata7/structuring-multi-agent-systems-around-irreversible-actions-lessons-from-tau-bench-defe0f139eda)
- [ ] **Simulated user failure modes**
  Too cooperative, leaking the goal, drifting from the persona, and costing money every turn. Know how tau-bench structures its simulator, including the stop signal when the goal is met.
  - [tau-bench explained, irreversible actions](https://medium.com/@duttasaswata7/structuring-multi-agent-systems-around-irreversible-actions-lessons-from-tau-bench-defe0f139eda)

Practice:
- [ ] State the problem in one sentence
- [ ] Lay out the three options and the trade in each
- [ ] Design the simulated user properly
- [ ] Name the risks and the calibration that answers them
- [ ] Connect it to promoting a session into a world
- [ ] Say it out loud in six minutes, then write the open questions

### DevEx: explaining Kitaru to a developer  (1h 15m)

- [ ] **How Alex writes and what he writes about**
  Read two or three of his recent posts, including the analysis of production LLM deployments and the one on rebuilding the site with Claude Code. Notice how he explains things; that is the bar he will hold you to.
  - [Alex's posts on the ZenML blog](https://www.zenml.io/author/alex-strick-van-linschoten)
  - [Alex's site](https://alexstrick.com/)
- [ ] **Kitaru's onboarding path**
  Clone, open the example in a coding agent, run the guided tour skill. Know every step because you did it.
  - [Kitaru README and guided tour](https://github.com/zenml-io/kitaru)
  - [Kitaru skills for coding agents](https://github.com/zenml-io/kitaru-skills)

Practice:
- [ ] Describe the first ten minutes as you actually experienced them
- [ ] Write a hundred-and-fifty-word explanation of replay-based evals for a developer who already uses Langfuse
- [ ] Prepare your view on agent-driven onboarding
- [ ] Rehearse your first-post pitch

### ZenML context for the CTO  (45m)

- [ ] **ZenML's core abstractions**
  Pipelines and steps, stacks that bind them to infrastructure, orchestrators, artifact stores and lineage. Enough to hold a conversation, not to pass an exam.
  - [ZenML docs](https://docs.zenml.io)
- [ ] **Kitaru's positioning**
  It sits beside trace stores rather than competing with them: they keep the traces, Kitaru makes them runnable. It also frames itself as adding a durable runtime around agent harnesses.
  - [Braintrust vs Langfuse vs Kitaru](https://www.zenml.io/blog/braintrust-vs-langfuse)
  - [ZenML blog, Kitaru category](https://www.zenml.io/category/kitaru)

Practice:
- [ ] Know ZenML's core vocabulary at a working level
- [ ] Form your own view of the strategic bet
- [ ] Answer: if you ran Kitaru for a quarter, what would you ship first

### The full ninety-minute mock  (1h 30m)

Practice:
- [ ] Run the live mock in chat: say run the ZenML round-three mock
- [ ] Retake the single weakest block the next day
- [ ] Monday morning: re-read the bench headline and your three questions, nothing else
