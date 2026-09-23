# Study list: Oxus and ZenML round 3

Generated from the tracker on 22 Sep 2026 by the sheet view's copy-as-markdown control.
Tick an item only when you can say it out loud without notes. The indented actions
under an item are what to actually do, with honest minutes and where to stop.

Oxus technical on 23 Sep, then ZenML round 3 on Mon 28 Sep at 9 AM Eastern.

---

## Oxus

### The system design frame for this room  (45m, 32m of actions)

- [ ] **The system design delivery flow**  (9m)
  Requirements, then core entities and the API, then a high-level design, then deep dives. And why requirements come first: they decide which deep dive matters.
  - [Hello Interview, system design](https://www.hellointerview.com/learn/system-design)
  - [System design primer](https://github.com/donnemartin/system-design-primer)
  - [ ] Read the delivery framework page end to end  _(4m)_
    [Hello Interview, System design in a hurry, Delivery Framework](https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery)
    Done when: the five phases named in order: requirements, core entities, API, high-level design, deep dives
  - [ ] Skim only 'Step 1: Outline use cases, constraints, and assumptions' under the primer's interview-approach heading  _(3m)_
    [System design primer README, 'How to approach a system design interview question'](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question)
    Skip: Steps 2 to 4 and the rest of the repo — it is a reference, not a reading list
  - [ ] Say the five-phase order out loud once, then say why requirements come first  _(2m)_
    Done when: the causal link stated aloud: requirements decide which deep dive matters, not the reverse
- [ ] **Functional against non-functional requirements**  (6m)
  Functional is what the system does. Non-functional is how well, and under which guarantees. In audit, the non-functional ones — traceability, reproducibility, isolation — are the product.
  - [Hello Interview, system design](https://www.hellointerview.com/learn/system-design)
  - [ ] Read '1) Functional Requirements' and '2) Non-functional Requirements' on the delivery page  _(3m)_
    [Hello Interview, Delivery Framework, sections 1 and 2 under Requirements](https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery#1-functional-requirements)
    Done when: the one-line distinction: functional is what the system does, non-functional is how well and under what guarantee
  - [ ] Say out loud which two items on the page's non-functional checklist bite hardest for audit software, and why  _(3m)_
    same page, the non-functional requirements checklist below the definition
    Done when: compliance and durability named first, one reason each — this feeds the written list in the next step, it does not replace it
- [ ] **Back-of-envelope estimation**  (11m)
  Pages per engagement, bytes per page, OCR cost per page, to one significant figure, out loud. And which constraint does not matter here: batch latency.
  - [Latency numbers, interactive](https://colin-scott.github.io/personal_website/research/interactive_latency.html)
  - [ ] Read the percentiles pages, then say which constraint you are dismissing and why  _(5m)_
    DDIA (Kleppmann), Chapter 1, the 'Describing Performance' section, through to Tail Latency Amplification
    Done when: one sentence: this is a batch pipeline, so p99 response time is not the constraint, throughput per engagement and cost per page are
    Skip: the rest of chapter 1. Reliability and maintainability are not being asked about here.
  - [ ] Read off four numbers: disk sequential read, disk seek, same-datacenter round trip, cross-region round trip  _(3m)_
    [Latency numbers, interactive, the current year column](https://colin-scott.github.io/personal_website/research/interactive_latency.html)
    Done when: roughly 359 microseconds, 2 milliseconds, 500 microseconds, 150 milliseconds
  - [ ] Say out loud what each implies for a batch pipeline rather than a live one  _(3m)_
    Done when: sequential disk read is cheap, so stream large PDFs rather than seek around them; an in-region hop is negligible next to OCR compute; a cross-region hop costs roughly 300 times more, the case for keeping compute inside the tenant's region
- [ ] **ICFR, and SOX sections 302, 404(a) and 404(b)**  (6m)
  ICFR is the set of controls that give reasonable assurance the financial statements are reliable. 404(a) is management's own assessment of those controls, 404(b) is the external auditor's attestation, and 302 is the quarterly certification by the CEO and CFO. Oxus mostly serves the internal audit team doing the 404(a) work.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [PCAOB AS 2201, the ICFR audit standard](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2201)
  - [ ] Read the SKILL.md overview's six-step ICFR process  _(2m)_
    [Anthropic audit-support skill, 'SOX 404 Control Testing Methodology', Overview](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
    Done when: the six steps named: scoping, risk assessment, control identification, testing, evaluation, reporting
  - [ ] Read AS 2201's footnote 2 and paragraph .C2  _(2m)_
    [PCAOB AS 2201, footnote 2 on the standard's title, and paragraph .C2 in Appendix C](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2201)
    Done when: footnote 2 names this standard as the 404(b) attestation standard; .C2 names Section 302, management's certification
  - [ ] Say the three sections in one sentence each, out loud, no notes  _(2m)_
    Done when: 302 is the CEO/CFO's quarterly certification, 404(a) is management's own annual assessment, 404(b) is the external auditor's attestation on it — Oxus mostly serves the 404(a) work

Practice:
- [ ] Learn the thirty-five-minute shape and say it once out loud
- [ ] Write the five non-functional requirements for audit software in your own words
- [ ] Memorise the spine, and three places it applies
- [ ] Prepare the one clarifying question that changes the design

### Design: an agent that tests a SOX control  (2h, 1h 12m of actions)

- [ ] **Key control, control objective, owner, frequency**  (7m)
  A key control is one the company relies on to address a significant risk. Every control has an objective, a named owner, and a frequency — annual, quarterly, monthly, daily, or per transaction — and frequency drives the sample size.
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [ ] Read 'Workpaper Requirements, Control identification' for what a control record must state  _(3m)_
    [Anthropic audit-support skill, Testing Documentation Standards, Workpaper Requirements, Control identification](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
    Done when: the four fields: description (what, who, how often), type, frequency, risk and assertion addressed
  - [ ] Read AuditBoard page 2 for why frequency has to be settled before testing starts  _(2m)_
    [AuditBoard PDF, page 2, 'Test of Design/Walkthroughs', point 1](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
    Done when: one sentence: frequency sets the sample size, so it has to be right before anything downstream is trustworthy
  - [ ] Say the four terms in one sentence each, out loud: key control, control objective, owner, frequency  _(2m)_
    Done when: four short sentences, no notes
- [ ] **Test of design against test of operating effectiveness**  (8m)
  Design asks whether the control, if it works, would address the risk; it is tested with a walkthrough of one transaction end to end. Operating effectiveness asks whether it actually worked across the whole period; it is tested on a sample.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
  - [ ] Read 'Design Effectiveness vs Operating Effectiveness'  _(3m)_
    [Anthropic audit-support skill, Design Effectiveness vs Operating Effectiveness](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
    Done when: the two questions: would it work if it operated as designed, versus did it actually operate
  - [ ] Read AuditBoard page 2's two headings for the practitioner version of the same split  _(2m)_
    [AuditBoard PDF, page 2, headings 'Test of Design/Walkthroughs' and 'Test of Operating Effectiveness'](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
    Skip: Pages 3 to 5 — engagement management, not the definitions you need here
  - [ ] Say the distinction out loud in one sentence, naming which one uses a sample  _(3m)_
    Done when: design is checked with one walkthrough transaction; operating effectiveness is checked on a sample across the period
- [ ] **The four testing methods**  (6m)
  Inquiry, observation, inspection, re-performance. Inquiry alone is never enough evidence. Oxus's agents mostly do inspection — reading the evidence — and some re-performance, recomputing what the control should have produced.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [ ] Read the operating-effectiveness line that lists the four methods  _(2m)_
    [Anthropic audit-support skill, Design Effectiveness vs Operating Effectiveness, the operating-effectiveness bullet](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
    Done when: the four words in the order given: inspection, observation, re-performance, inquiry
  - [ ] Say which two Oxus's agents mostly do, and why inquiry alone is never enough  _(2m)_
    Done when: inspection, reading the evidence, and re-performance, recomputing it; inquiry alone is a claim with no independent check behind it
  - [ ] Use each of the four words in one sentence about Oxus, out loud, no notes  _(2m)_
    Done when: four sentences, each naming a concrete Oxus action for that method
- [ ] **Population, and IPE: information produced by the entity**  (8m)
  The sample is drawn from a population report the company produces. That report must itself be checked for completeness and accuracy, or the whole test rests on data nobody verified. This is a great place for a design question: how does the system know the population is complete?
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [ ] Read 'IT-Dependent Manual Controls, Testing approach' for the IPE definition  _(3m)_
    [Anthropic audit-support skill, IT-Dependent Manual Controls, Testing approach](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
    Done when: the two-part test: the manual control itself, and the completeness and accuracy of the system-generated report it relies on
  - [ ] Read 'Random Selection, Method' for where population completeness first matters  _(2m)_
    same page, Sample Selection Approaches, Random Selection, Method
    Done when: the population must be a complete, sequentially numbered listing before any sample from it is defensible
  - [ ] Say your one-sentence answer to 'how does the system know the population is complete' out loud  _(3m)_
    Done when: an answer naming a concrete check, such as a row-count reconciliation against the source system, run in code before sampling
- [ ] **Sample sizes by control frequency**  (7m)
  Firms use a table mapping frequency to sample size: small for annual controls, large for controls that run many times a day. Know that the table exists and where it comes from, rather than quoting numbers.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [ ] Read the Sample Size Guidance table  _(3m)_
    [Anthropic audit-support skill, Sample Size Guidance table](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
    Done when: the shape: annual needs 1, weekly needs 5 to 15, daily and per-transaction need 20 to 60, rising with risk
  - [ ] Read the four 'factors increasing sample size' bullets underneath the table  _(2m)_
    same page, directly under the Sample Size Guidance table
    Done when: one you would raise unprompted: no compensating control, or a prior-period deficiency
  - [ ] Say out loud where the table comes from, and why you would never quote a number from memory  _(2m)_
    Done when: one sentence naming the firm's methodology table as the source, not a memorised rule
- [ ] **Attributes, tickmarks, redboxing, exceptions, PBC**  (8m)
  Attributes are the specific things checked per sample, like approved before posting, and by someone other than the preparer. Tickmarks and red boxes annotate the evidence. An exception is a sample where an attribute failed. PBC is the list of evidence requested from the client.
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
  - [ ] Read AuditBoard page 2, point 2, on what a PBC request has to ask for  _(2m)_
    [AuditBoard PDF, page 2, Test of Operating Effectiveness, point 2](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
    Done when: PBC is provided-by-client evidence, and a vague PBC request is the most common cause of a second round trip
  - [ ] Read 'Manual Controls, Key attributes to test'  _(2m)_
    [Anthropic audit-support skill, Manual Controls, Key attributes to test](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
    Done when: the four questions: right person, timely, evidenced, sufficient information
  - [ ] Write your own one-line definitions of tickmark and redbox, since neither source spells them out  _(3m)_
    no verified source for these two terms specifically — see NOTES.md
    Done when: tickmark: a mark on a workpaper showing a procedure was performed against that figure. Redbox: the highlighted region on a document image a citation resolves to
  - [ ] Say all five terms — attribute, tickmark, redbox, exception, PBC — in one sentence each, out loud  _(1m)_
    Done when: five sentences, no notes
- [ ] **Deficiency, significant deficiency, material weakness**  (10m)
  A deficiency means a control does not prevent or detect misstatements in a timely way. A material weakness is one where there is a reasonable possibility a material misstatement will not be caught. A significant deficiency sits between them. One material weakness means ICFR cannot be called effective.
  - [PCAOB AS 2201, the ICFR audit standard](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2201)
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [ ] Read AS 2201 Appendix A, paragraphs .A3, .A7 and .A11 in order  _(4m)_
    [PCAOB AS 2201, Appendix A, Definitions, paragraphs .A3 (deficiency), .A7 (material weakness), .A11 (significant deficiency)](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2201)
    Done when: the nesting: a material weakness and a significant deficiency are both deficiencies first; severity is what's added
  - [ ] Read the skill page's material-weakness indicators  _(3m)_
    [Anthropic audit-support skill, Control Deficiency Classification, Material Weakness, Indicators](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
    Done when: one indicator that needs no judgment call: fraud by senior management, of any size
  - [ ] Say the three terms in order of severity, each in one sentence, out loud, no notes  _(3m)_
    Done when: deficiency, then significant deficiency, then material weakness, each placed on the same reasonable-possibility-of-misstatement scale
- [ ] **Automated controls and ITGCs**  (8m)
  IT general controls — access, change management, operations — underpin automated controls. If the ITGCs are effective, an automated control can often be tested with very few samples, because it behaves the same way every time.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [ ] Read 'Automated Controls, Testing approach'  _(3m)_
    [Anthropic audit-support skill, Automated Controls, Testing approach](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
    Done when: the rule: one test suffices per period if configuration has not changed, backed by change-management ITGC testing
  - [ ] Read the three ITGC categories: access, change management, operations  _(3m)_
    same page, IT General Controls (ITGCs), the three subheadings
    Done when: one example control per category, said from memory
  - [ ] Say out loud why an effective ITGC lets you test an automated control with almost no samples  _(2m)_
    Done when: because the system does the same thing every time; the ITGC is what guarantees it has not quietly changed
- [ ] **Constrained citation, off the shelf**  (10m)
  The Claude citations feature parses citations so every pointer is guaranteed valid, and custom content documents let you define the citable blocks yourself — which is your opaque-handle pattern as an API. The limit to name: a valid pointer does not prove the cited text supports the claim, so a verifier is still needed.
  - [Claude API, citations](https://docs.claude.com/en/docs/build-with-claude/citations)
  - [ ] Read 'How citations work', steps 1 to 3  _(3m)_
    [Claude docs, Citations, How citations work](https://docs.claude.com/en/docs/build-with-claude/citations#how-citations-work)
    Done when: the three-step shape: provide documents, documents get chunked, Claude cites by location, not by writing text
  - [ ] Read 'Custom content documents'  _(3m)_
    [same page, Custom content documents](https://docs.claude.com/en/docs/build-with-claude/citations#custom-content-documents)
    Done when: citations reference content-block index ranges you defined — the opaque-handle pattern, shipped as an API
  - [ ] Say the one limit out loud: what a valid pointer does not prove  _(2m)_
    Done when: a valid pointer proves the span exists; it does not prove the span supports the claim, so a verifier is still needed
  - [ ] Write one sentence naming which Oxus stage plays the verifier role citations alone do not cover  _(2m)_
    Done when: written into the Answer field: the exact-match check between cited span and extracted value, run in code after the model cites

Practice:
- [ ] Walk the pipeline end to end, naming which stages are code and which are the model
- [ ] Design sample selection as seeded code
- [ ] Design citation as constrained selection, not generation
- [ ] Make attribute results three-valued, with insufficient as a first-class answer
- [ ] Compute exceptions and constrain the conclusion
- [ ] Design the reviewer loop and the audit log
- [ ] Answer the evaluation question before she asks it
- [ ] Say the whole design out loud in eight minutes, then write its three weakest points

### Design: evidence ingestion from messy documents  (1h 30m, 59m of actions)

- [ ] **Layout analysis and reading order**  (7m)
  Before OCR text is useful you need to know what is a heading, a paragraph, a table, a footer, and in what order a human would read them. Docling does this with a layout model and then assembles reading order.
  - [Docling paper, arXiv 2501.17887](https://arxiv.org/html/2501.17887v1)
  - [ ] Read the Layout Analysis Model paragraph  _(3m)_
    [Docling paper, Section 4.1, 'Layout Analysis Model'](https://arxiv.org/html/2501.17887v1#S4.SS1.SSSx1)
    Done when: one sentence: it predicts bounding boxes and classes for page elements, then intersects them with the PDF text tokens to form paragraphs, headings and tables
  - [ ] Read the Assembly paragraph, skipping what sits between  _(2m)_
    [same page, Section 4.1, 'Assembly'](https://arxiv.org/html/2501.17887v1#S4.SS1.SSSx4)
    Done when: one sentence: reading order is corrected once all pages are assembled, not decided page by page
    Skip: Table Structure Recognition and OCR in between — separate items own those
  - [ ] Say the page-to-ordered-text path out loud, four steps, no notes  _(2m)_
    Done when: layout model finds and classes elements, elements merge with PDF text tokens, per-page results aggregate, assembly fixes reading order — spoken clean
- [ ] **Table structure recognition**  (8m)
  Tables are recovered as structured grids of cells, not flattened text, so a value can be cited to an exact cell. Docling uses TableFormer for this.
  - [Docling paper, arXiv 2501.17887](https://arxiv.org/html/2501.17887v1)
  - [Docling, the document data model](https://docling-project.github.io/docling/concepts/docling_document/)
  - [ ] Read the Table Structure Recognition paragraph  _(3m)_
    [Docling paper, Section 4.1, 'Table Structure Recognition'](https://arxiv.org/html/2501.17887v1#S4.SS1.SSSx2)
    Done when: one sentence naming what TableFormer predicts: row and column structure, and which cells are header versus body
    Skip: the OCR and Assembly paragraphs either side of it
  - [ ] Check the cell fields in Docling's own type reference  _(2m)_
    [Docling document reference, the TableCell class — bbox, row and column span, header flags](https://docling-project.github.io/docling/reference/docling_document/#docling_core.types.doc.TableCell)
    Done when: confirm a cell carries its own bounding box, not just its text
  - [ ] Say why flattening a table to text breaks citation, out loud  _(3m)_
    Done when: one sentence: flattening drops the column header a value was read against, so keeping the grid is what lets an amount cite to one exact cell
- [ ] **The provenance data model**  (8m)
  Every item carries its source page, bounding box and character span. Walk through Docling's document model and map it onto what Oxus needs for red boxes.
  - [Docling, the document data model](https://docling-project.github.io/docling/concepts/docling_document/)
  - [ ] Read the ProvenanceItem class in Docling's reference  _(3m)_
    [Docling document reference, ProvenanceItem — page_no, bbox and charspan fields](https://docling-project.github.io/docling/reference/docling_document/#docling_core.types.doc.ProvenanceItem)
    Done when: the three fields named correctly: page number, bounding box, character span
    Skip: the surrounding TextItem and DocItem classes — provenance is the one that matters tonight
  - [ ] Map each field to what a red box needs, out loud  _(3m)_
    Done when: one clause per field: page_no picks the image, bbox draws the rectangle, charspan ties it back to the exact characters extracted
  - [ ] Write the one-line consequence into the Answer field  _(2m)_
    Done when: one sentence: drop any of the three at parse time and that span can never be cited again, no matter what runs downstream
- [ ] **OCR confidence and human review**  (7m)
  Low-confidence regions are flagged, carried forward, and can force an insufficient result or a human check. Know the honest line about your own gap here.
  - [Docling paper, arXiv 2501.17887](https://arxiv.org/html/2501.17887v1)
  - [ ] Read the OCR paragraph  _(3m)_
    [Docling paper, Section 4.1, 'OCR'](https://arxiv.org/html/2501.17887v1#S4.SS1.SSSx3)
    Done when: which two engines Docling integrates, and which one the paper flags as the biggest compute cost
    Skip: the benchmark numbers in Section 5 — cost, not confidence, is the point of this read
  - [ ] Write the honest gap down  _(2m)_
    Done when: one written line: the paper documents engine choice and speed, not a published per-region confidence score — the confidence-gating idea is a design layered on top, not something the paper hands you
  - [ ] Say the honest line about your own gap out loud, once  _(2m)_
    Done when: spoken clean: you have not run OCR in production, you have designed the layers on both sides of it, and you would expect to be slow on OCR specifics and fast on everything around them
- [ ] **Hybrid retrieval: lexical plus dense, and rank fusion**  (9m)
  BM25 for exact identifiers, amounts and dates; dense embeddings for meaning; combine the rankings, commonly with reciprocal rank fusion. Your MetaRAG finding on metadata prefixes applies on the dense side.
  - [Sentence-Transformers docs](https://www.sbert.net)
  - [ ] Skim the Cross-Encoder vs Bi-Encoder section  _(2m)_
    [Sentence-Transformers docs, 'Cross-Encoder vs. Bi-Encoder'](https://www.sbert.net/examples/cross_encoder/applications/README.html#cross-encoder-vs-bi-encoder)
    Done when: one line: bi-encoders embed separately for fast indexed search, cross-encoders score a pair jointly and only run over a short list
    Skip: the pretrained-model tables and code below it
  - [ ] Skim the reciprocal rank fusion paragraph  _(2m)_
    [Sentence-Transformers docs, hybrid search page, 'Hybrid Search using Reciprocal Rank Fusion' under Comprehensive Evaluation](https://www.sbert.net/examples/sparse_encoder/applications/retrieve_rerank/README.html#comprehensive-evaluation-hybrid-search-pipeline)
    Skip: the evaluator code and the results table
  - [ ] Reread why prefix-fusion beats TF-IDF weighting, in your own paper  _(2m)_
    E:/_Resume-Curator/job_search/profile/METARAG.md, section 2.2, the paragraph on why prefix-fusion beats TF-IDF weighting
  - [ ] Say where that finding sits in Oxus's design, out loud  _(3m)_
    Done when: one sentence: BM25 stays untouched for exact identifiers, and the MetaRAG finding says the dense side should get metadata prefixed into the text before encoding, not blended in afterward as a separately weighted vector
- [ ] **Multi-tenant isolation**  (12m)
  Silo — separate storage and index per tenant — against pool with row-level isolation. Per-tenant encryption keys. No shared cache. Your Postgres row-level-security story from alfred_ is real evidence here.
  - DDIA chapter 6, partitioning
  - [ ] Read 'Partitioning by Hash of Key'  _(5m)_
    DDIA (Kleppmann), Chapter 6 'Partitioning', the section 'Partitioning by Hash of Key' — a few pages
    Skip: 'Partitioning by Key Range', earlier in the same chapter — hashing is the relevant scheme for a tenant key
  - [ ] Read 'Skewed Workloads and Relieving Hot Spots'  _(4m)_
    same chapter, the section immediately after — a couple of pages
  - [ ] Say silo against pool out loud, anchored to your own RLS experience  _(3m)_
    Done when: one sentence: which of the two Oxus should use for a VPC-deployed audit tool, and why isolation and blast radius decide it rather than raw scale
- [ ] **Zero data retention with model providers**  (8m)
  What it means for a provider not to retain inputs, why VPC customers demand it, and how it limits which models and features you can use.
  - [ ] Read what ZDR covers and does not cover  _(4m)_
    [Claude Platform docs, 'API and data retention', the 'What ZDR covers' and 'What ZDR does not cover' sections](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention#zero-data-retention-zdr-scope)
    Done when: one sentence: which API features ride on ZDR, and which stateful features sit outside it regardless
    Skip: the HIPAA-readiness section further down — not tonight's question
  - [ ] Write down one stateful feature that stays outside ZDR  _(2m)_
    Done when: one line naming a feature such as the Files API or code execution, and why its own storage need is what excludes it
  - [ ] Say the VPC consequence out loud  _(2m)_
    Done when: one sentence: a VPC customer demanding ZDR rules out any feature that necessarily stores prompts or responses, which is a real constraint on model and feature choice, not a formality

Practice:
- [ ] Lay out the ingestion path by source type
- [ ] Make coordinates the core of the data model, and say why
- [ ] Handle tables and screenshots as structure, not text
- [ ] Carry parser confidence forward
- [ ] Design retrieval per tenant, and hybrid
- [ ] Cover isolation under VPC deployment
- [ ] Do one back-of-envelope out loud

### Design: walkthrough to flowchart, and the year-over-year base  (1h, 34m of actions)

- [ ] **Process narratives, flowcharts and the RCM**  (12m)
  Auditors document each process as a narrative and a flowchart, and map risks to controls in a risk and control matrix. Oxus generates the first two from walkthroughs and builds the matrix.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
  - [ ] Read 'What Is a Flowchart?' and 'What Is a Process Narrative?'  _(5m)_
    [AuditBoard blog, 'SOX Process Narrative vs. Flowcharts: Which Is Better?', both named sections](https://auditboard.com/blog/sox-process-narrative-vs-flowcharts)
    Done when: one line per format: a flowchart makes risks and controls easy to spot end to end, a narrative removes ambiguity but costs more to maintain — which is why Oxus generates both from one walkthrough
    Skip: the author bio and the calls to action top and bottom
  - [ ] Read the risk and control matrix section  _(3m)_
    [Fieldguide, 'SOX Risk Assessment: What Auditors Need to Know', the section 'How to Use a Risk Control Matrix for SOX Compliance'](https://www.fieldguide.io/resource-articles/sox-risk-assessment-guide)
    Done when: one sentence: the RCM is the row-per-control table linking each control back to the risk and assertion it addresses and forward to how it is tested
    Skip: everything on the page before that section — inspection findings and the risk-based approach belong to wc2
  - [ ] Say the three-artifact pipeline out loud  _(4m)_
    Done when: walkthrough recording in, narrative and flowchart out as two views of the same steps, RCM out as the row-per-control table — spoken clean, no notes
- [ ] **Financial statement assertions**  (10m)
  Existence or occurrence, completeness, valuation or accuracy, rights and obligations, presentation and disclosure. Each control addresses one or more. Knowing the list lets you talk about risk mapping in their language.
  - [Anthropic audit-support skill, SOX 404 primer](https://skillselion.com/skills/anthropics/knowledge-work-plugins/audit-support)
  - [ ] Read the Financial Statement Assertions paragraph  _(4m)_
    [PCAOB AS 1105, Audit Evidence, '.11 Financial Statement Assertions'](https://pcaobus.org/oversight/standards/auditing-standards/details/AS1105#assertations)
    Done when: all five named correctly: existence or occurrence, completeness, valuation or allocation, rights and obligations, presentation and disclosure
    Skip: everything else on the page — evidence sufficiency and specialists are not tonight's question
  - [ ] Write which assertion a red-boxed invoice amount tests, in the Answer field  _(2m)_
    Done when: one line naming both: existence or occurrence for the transaction, valuation or allocation for the amount
  - [ ] Say all five from memory, cold, twice  _(4m)_
    Done when: five assertions, no notes, said twice without dropping one
- [ ] **Roll-forward of prior-year work**  (12m)
  Each year, prior documentation is carried forward and updated rather than rebuilt. That is exactly what Oxus's knowledge base automates, and the diff between years is where the value is.
  - [AuditBoard, SOX testing best practices (PDF)](https://go.auditboard.com/rs/961-ZQV-184/images/AB-AR-Best-Practices-Effective-SOX-Testing.pdf)
  - [ ] Reread your own step on versioning and diffing the graph  _(3m)_
    this session, the step 'Version the graph and diff it year over year'
    Done when: one line: the diff, not the graph itself, is the sellable output
  - [ ] Invent one concrete diff and say it out loud  _(5m)_
    Done when: one worked example, spoken: a named control whose owner changed between two years, and what that change should surface to the auditor first
  - [ ] Write the update-not-rebuild line into the Answer field, in your own words  _(4m)_
    Done when: one sentence distinguishing 'carried forward and updated' from 'rebuilt from scratch', in language you would use in the room

Practice:
- [ ] Turn a walkthrough transcript into a process graph
- [ ] Map controls to risks with the model proposing and a human confirming
- [ ] Version the graph and diff it year over year
- [ ] Connect reviewer feedback to your memory system

### Your past work, at grilling depth  (1h 15m, 30m of actions)

- [ ] **NDCG at ten, derived**  (6m)
  Discounted cumulative gain sums relevance with a logarithmic discount by rank, then normalises by the ideal ordering. Be able to write it and explain why rank position is discounted.
  - [Wikipedia, discounted cumulative gain](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
  - [ ] Write DCG_p and NDCG_p from memory, on paper  _(3m)_
    Done when: both formulas on paper, unaided
  - [ ] Check against Wikipedia, then say aloud why the discount is logarithmic  _(3m)_
    [Wikipedia, 'Discounted cumulative gain', the Discounted Cumulative Gain and Normalized DCG sections](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
    Done when: one sentence: a relevant result ranked lower is penalised, and the penalty shrinks logarithmically rather than linearly
    Skip: the history subsection and everything below Normalized DCG
- [ ] **Bi-encoders against cross-encoders**  (5m)
  A bi-encoder embeds query and document separately, which is fast and indexable. A cross-encoder reads them together, which is slower and more accurate. That is why a cross-encoder made a stronger judge for your silver standard.
  - [Sentence-Transformers docs](https://www.sbert.net)
  - [ ] Reread the cross-encoder paragraph in your own MetaRAG notes  _(2m)_
    E:/_Resume-Curator/job_search/profile/METARAG.md, section 3.1, the paragraph starting 'Why a cross-encoder rather than the bi-encoder used for retrieval'
  - [ ] Skim the sbert.net tradeoff paragraph, then say in one breath why a cross-encoder made the stronger judge  _(3m)_
    [Sentence-Transformers docs, 'Cross-Encoder vs. Bi-Encoder', the opening paragraph](https://www.sbert.net/examples/cross_encoder/applications/README.html)
    Done when: one breath: joint attention over query and chunk catches interaction a dot product misses, too slow for the whole corpus, fine for fifty candidates
    Skip: the clustering and reranking code examples further down the page
- [ ] **Calibrating an LLM judge against humans**  (6m)
  Label a sample by hand, measure agreement, iterate the rubric, and re-check as the product changes. This is how your scanner's judge reached roughly three in four flags being genuine.
  - [Hamel Husain, LLM-as-a-judge](https://hamel.dev/blog/posts/llm-judge/)
  - [Eugene Yan, evaluating LLM evaluators](https://eugeneyan.com/writing/llm-evaluators/)
  - [ ] Read Hamel Husain's FAQ answer on validating a judge against human labels, nothing else on the page  _(2m)_
    [hamel.dev, LLM-as-a-judge post, FAQ: 'How do you validate an LLM judge against human labels?'](https://hamel.dev/blog/posts/llm-judge/)
    Skip: Steps 1 through 7 — those build a judge from scratch, not calibrate one you already have
  - [ ] Read Eugene Yan's metrics passage, nothing else on the page  _(2m)_
    [eugeneyan.com, evaluating LLM evaluators, section 'Key considerations before adopting an LLM-evaluator', the passage on Cohen's kappa, Kendall's tau and Spearman's rho](https://eugeneyan.com/writing/llm-evaluators/)
    Skip: the rest of the post — it runs to about fifty minutes; the use-case, prompting and fine-tuning sections are not tonight's question
  - [ ] Say your own calibration loop out loud, ending on the number  _(2m)_
    Done when: label by hand, measure agreement, iterate the rubric, re-check as the product changes — ending on roughly three in four flags genuine
- [ ] **Evals when there is no ground truth**  (5m)
  Error analysis on real outputs first, then targeted checks. Your two versions of this — silver standard in MetaRAG, replay bench in production — are the answer.
  - [Hamel Husain, your AI product needs evals](https://hamel.dev/blog/posts/evals/)
  - [ ] Read only the 'Looking At Your Traces' section  _(2m)_
    [hamel.dev, 'Your AI Product Needs Evals', section 'Looking At Your Traces'](https://hamel.dev/blog/posts/evals/)
    Skip: the rest of the post — the levels framework, RAG and fine-tuning sections are not tonight's question
  - [ ] Say your own two versions of this out loud  _(3m)_
    Done when: both named in one breath: the silver standard in MetaRAG, the replay bench in production, and what ground truth each one is missing
- [ ] **Your own MetaRAG paper, methods and limitations**  (8m)
  Re-read the method and limitations sections tonight. An AI-degree interviewer will ask about the parts you wrote least recently.
  - MetaRAG, IEEE CAI 2026 — your own paper
  - [ ] Reread the system and its three pipelines  _(2m)_
    E:/_Resume-Curator/job_search/profile/METARAG.md, sections 1.5 and 1.6 — the part of your own paper you describe least often
  - [ ] Reread what the paper does not claim  _(3m)_
    E:/_Resume-Curator/job_search/profile/METARAG.md, section 2.4, all five bullets
  - [ ] Say the three stated contributions and the retrieval-pool-bias limitation out loud, cold  _(3m)_
    Done when: three contributions plus one limitation, spoken without the file open

Practice:
- [ ] Memory system: two minutes, then the follow-ups
- [ ] Decision layer: why deterministic risk scoring
- [ ] Eval harness, reframed for audit
- [ ] MetaRAG, at the depth an AI degree will ask
- [ ] Prepare the technical weakness question

### The last hour: mock, fixes, questions, sleep  (1h, 12m of actions)

- [ ] **What Oxus actually shows publicly**  (5m)
  The product's two halves, the traceability claims, and how they describe their customers. Watch before the call so your design uses their words.
  - [Oxus launch video](https://youtu.be/gmgO_Pa-vZk)
  - [Oxus site](https://www.oxus-ai.com)
  - [ ] Watch the launch video once, in full  _(2m)_
    [Oxus launch video — about two minutes](https://youtu.be/gmgO_Pa-vZk)
  - [ ] Skim the site's two product pages, no notes  _(3m)_
    [oxus-ai.com — the control-testing and flowchart-generation pages](https://www.oxus-ai.com)
    Skip: pricing, about, and anything past the two product pages
- [ ] **Your prep file, sections F to H**  (7m)
  Anticipated questions, your questions, and the weak points table. Skim, do not re-study.
  - prep_oxus_founding_engineer — your file
  - [ ] Skim sections F and G, no rewriting  _(4m)_
    your own copy of prep_oxus_founding_engineer — section F, anticipated questions; section G, your own questions
    Skip: everything before section F
  - [ ] Skim section H, the weak points table, once  _(3m)_
    your own copy of prep_oxus_founding_engineer — section H
    Done when: nothing new to fix tonight — this is a last look, not a revision pass

Practice:
- [ ] Run the live mock in chat: say run the Oxus mock
- [ ] Fix the relocation line in your prep file
- [ ] Pick three questions, and lead with the citation one
- [ ] Watch the two-minute launch video and re-skim the platform page
- [ ] Stop and sleep

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
  - DDIA chapter 11, the idempotence section
  - [ ] Read the section  _(5m)_
    DDIA chapter 11, Stream Processing, Fault Tolerance — the Idempotence subsection
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
