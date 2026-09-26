"""ZenML round 3: the content of interviews/zenml-round3.html.

Sources: the round-two critique (the bench story is Pranav's own account, used as
he tells it), E:/kitaru/INTERVIEW-PREP.md, E:/kitaru/KITARU.md and the teardown's
diagrams. The practice sessions themselves are read from the tracker (SESSION_IDS),
so a tick in either place shows in both.
"""

LOOP = {
    "id": "zenml-r3",
    "title": "ZenML round 3",
    "subtitle": "Kitaru, product engineer",
    "when_iso": "2026-09-28T09:00:00-04:00",
    "when": "Monday 28 September, 9 AM Eastern",
    "who": "Hamza Tahir, co-founder of ZenML, and Alex Strick van Linschoten, who ships the Claude Code skills behind Kitaru's guided tour.",
    "format": "Ninety minutes, technical, in depth. Expect them to go down, not sideways: mechanism, storage, failure, and whether each claim survives one 'how exactly?' and one 'how big?'.",
    "bar": "Every claim survives one 'how exactly?' and one 'how big?'. When pushed, go down, not sideways. Volunteer the limit before they find it. Reach for a number unprompted.",
    "teardown": r"E:\kitaru\kitaru-teardown.html",
    "plan_kicker": "Friday to Sunday",
    "mech_title": "Kitaru, mechanism by mechanism",
    "design_link": {"text": "The worked design, six steps and five deep dives:", "label": "Kitaru in your system design guide",
                    "href": "../SYSTEM%20DESIGN.html#/designs/kitaru"},
}

# Tracker sessions for this loop, in the order to do them, with the day each belongs to.
SESSION_IDS = [
    ("wc7", "Fri"), ("wc13", "Fri"), ("wc14", "Fri"), ("wc15", "Fri"),
    ("wc16", "Sat"), ("wc8", "Sat"), ("wc9", "Sat"),
    ("wc17", "Sun"), ("wc10", "Sun, if time"), ("wc11", "Sun, if time"), ("wc12", "Sun"),
]

# What to say, in the words to say it.
SCRIPTS = [
    {"id": "intro", "title": "Intro", "length": "about 40 seconds",
     "when": "The first question, whatever form it takes.",
     "say": [
         "I'm a founding engineer at alfred_, an AI executive assistant that runs over your work apps, email and calendar, at 5,000-plus active users. My work there has been taking an agent product and making it reliable in production: the evaluation infrastructure, the memory architecture, and the orchestration underneath it.",
         "The piece most relevant to this conversation is the eval side. I built a bench that takes real production failures and replays them against new versions of the agent, with the tools answered from a snapshot instead of hitting live systems. So I've built a rough version of what Kitaru does, and I know where mine broke.",
         "Before alfred_ I was at WheelPrice, a Techstars-backed marketplace with two engineers, where I worked across product, backend, ML features and a computer vision project. I like small teams and vertical ownership, and I want to keep doing that in AI infrastructure."],
     "never": ["Never mention alfred_'s funding or a crunch.", "No filler openers: 'I have some experience', 'so to say', 'essentially'."]},
    {"id": "seat", "title": "Why this seat", "length": "about 45 seconds",
     "when": "Why are you looking, why Kitaru, why product engineer.",
     "say": [
         "I'm not looking to urgently leave alfred_. What I want is a team where the problem is clear and the AI infrastructure is the centre of the product instead of one of many hats. Kitaru being early is the appeal, since I've spent the last year on exactly this problem from the inside.",
         "On the product-engineer half: the hard part here isn't only the server. The product is a method as much as a system, and the gap between 'it works' and 'someone adopts it' is mostly the on-ramp. I want to be close enough to users to know which of the two is failing.",
         "On the public half, honestly: I'm active on LinkedIn and a heavy reader on X rather than a poster. What I'm not new to is demoing and explaining: MetaRAG at INFORMS Analytics+ to 700-plus practitioners, hackathons, and MockFlow-AI shipped with a launch video. The first thing I'd post here is a walkthrough of importing real traces, finding a failure, and proving the fix with a replay."]},
    {"id": "bench2", "title": "The bench, in two minutes", "length": "about 2 minutes",
     "when": "Tell me about the eval harness. Headline first, every time.",
     "say": [
         "When I joined alfred_, we had no reliable way to say whether a new version of the agent was better than the old one. People tried it and had opinions. So I built the loop that turns production failures into regression tests.",
         "It starts with a scanner over real conversations. Cheap deterministic signals flag anything that looks like one of twelve failure types, and an LLM judge, trained on a week of labels I did by hand, decides which flags are real. Roughly three out of four are genuine bugs. Real ones get fixed and promoted into a bench of a little over a hundred cases.",
         "Replay is the interesting part. The real agent runs in a harness mode. The tools execute normally, so ranking, filtering and formatting are the production code. Only the call out to Gmail, the calendar or an MCP server gets routed to a SQLite snapshot. And the snapshot isn't one recorded path: for a query type we pulled about twenty-five real instances and covered every tool the agent used across all of them, plus deliberate ambiguity, like three people named Michael.",
         "So the agent can take a path it never took in production and still get truthful answers. We score on tool calls per completed task and on assertions against the snapshot, run it nightly, and it's what we used to sign off a full rewrite of the agent's multi-turn orchestration."]},
    {"id": "bench5", "title": "The bench, in five minutes", "length": "about 5 minutes, nine beats",
     "when": "When they want the whole thing.",
     "say": [
         "**The problem.** The agent runs over email and calendar for 5,000-plus users. Every change touched prompts, tools or orchestration, and we had no deterministic way to compare versions. The trigger was a rewrite of how the agent handles multi-turn conversations: too big to eyeball, too risky to ship on vibes.",
         "**Finding failures.** The scanner runs daily over conversations with cheap deterministic checks first: the agent said it did something and no tool ran, the user repeated themselves, a tool errored and the agent kept going. Twelve classes. Each flag carries the user turn, the agent turn, the tool traces, the reasoning, and two turns either side.",
         "**Judging.** Deterministic signals over-fire, so an LLM judge sits on top, its rubric built from a week of flags I labelled by hand, a couple of hundred. It agrees with a human on roughly three in four as genuine. We reconcile it weekly, because as features change, yesterday's bug becomes today's expected behaviour.",
         "**Promotion.** A genuine bug is fixed by hand, then promoted: a reconciler adds a new case, updates one, or merges it into a case that already covers the failure, so the bench does not fill with duplicates. A little over a hundred cases now.",
         "**The snapshot.** For a query type like 'create a task from this email', we pulled about twenty-five real instances and looked at every tool used across them: six or seven, against an ideal path of two or three. The snapshot covers all of them, plus deliberate ambiguity. The base is append-only, so a case that used to pass and now fails points at the agent, not the fixture.",
         "**Replay.** The agent runs from the CLI with a harness flag. Tool code runs for real; at the provider boundary the call goes to the case's SQLite copy, which returns rows in the provider's shape. Writes land there, so a task created at turn two is visible at turn three, and we reset to the base between cases.",
         "**Scoring.** Deterministic assertions against the snapshot: the right tools, the right records, every event in the window in the output. Then an LLM judge for what is not enumerable, like a summary's quality. The headline number is tool calls per completed task: 2.5 down to 2.2 means the same outcome, found faster.",
         "**Trustworthy and cheap.** About ten percent of cases are flaky, so those run three times and we read a pass rate. A change to a tool or its description runs only the cases whose snapshots touch it: fifteen to thirty cases, under ten minutes. The full bench runs nightly, about half an hour.",
         "**Outcome.** It's how we signed off the orchestration rewrite: old and new agent against the same hundred-plus cases, and we could point at exactly which cases got better, which got worse, and why."]},
    {"id": "refunds", "title": "When the bench passed something broken", "length": "about 75 seconds",
     "when": "Tell me about a false signal. Lead with the case, never with 'I don't have one'.",
     "say": [
         "The clearest one was a ledger request: pull every financial event across my accounts and cards into one view. The agent produced a clean, well-formed ledger and left out two refunds. Every surface check passed, and the same omission showed up again on a later agent version.",
         "We found it the way you find most of these: a user noticed the output was wrong rather than malformed. The report path and the frustration signals don't fire when an answer merely looks right.",
         "The lesson was about what the scorer asserted. We checked trajectory and shape, and nothing checked completeness. For this class we could, because we own the snapshot: the fixture knows how many financial events fall in that window, so the case can assert every one appears. That's asserting against ground truth we hold, which is different from pinning an expected answer, and it's the advantage of freezing a world rather than a transcript.",
         "Where I'd stay honest: it only works when the correct answer is enumerable from the fixture. A meeting brief isn't a set you can count, so those need a human lens and stay out of automated gating."]},
    {"id": "miss", "title": "The cache miss: the better the change, the worse the replay", "length": "about 90 seconds",
     "when": "A prompt change makes the agent call search_email with different phrasing, and the replay dies.",
     "say": [
         "First thing I'd separate: a miss is information. It's telling you the agent's behaviour changed, which is the thing you were measuring. So the goal isn't to make misses disappear, it's to stop a miss from killing the run and make it cheap for a human to resolve.",
         "What I'd ship first is the miss experience. Fail loudly with a diff: the recorded call, what the new agent tried, how far apart they are. Then one command to accept that variant as equivalent, which writes a static alias. Deterministic, auditable, no threshold, and it generates labelled pairs for anything automatic later.",
         "Second, enrichment at import: index the argument variants seen across every session with the same intent, so one recorded result can answer phrasings you've actually observed. That's what we did at alfred_ by hand. It needs volume, so it defaults off.",
         "Fuzzy matching last, carefully: pick the band from score distributions of known-equivalent and known-different pairs, treat the overlap as ambiguous, and ship it in shadow, then suggest, then opt-in per tool. To know it's wrong a week later: a golden set tracked every release, plus miss rate, fuzzy-hit share and the ambiguous share. And every fuzzy hit is stamped on the node, because a silent false pass is the worst bug an eval product can ship."]},
    {"id": "critique", "title": "What's wrong with Kitaru", "length": "about 60 seconds",
     "when": "Name one thing that's wrong, badly designed or oversold. Never answer with a compliment. If stuck: 'give me a second'.",
     "say": [
         "The one that stood out to me is provenance on mocked calls. When a tool has no policy, or on_miss is set to passthrough, the call goes out to the live provider and the node doesn't carry anything saying so. Someone reading a replay can't tell which results came from the recording and which came from the real world. For a product whose core promise is that a replay is trustworthy, I'd want every node stamped with how it was served.",
         "That one's personal, because the equivalent bug at alfred_ was the agent claiming it did something it never did. We fixed it by grounding the claim against the real tool-execution record rather than the agent's account of it. Same shape of problem.",
         "The second is time: the tool results are frozen but the agent's clock isn't, so anything reasoning about 'today' drifts against an old snapshot and shows up as a confusing failure rather than an obvious one."],
     "never": ["In reserve: evaluators see only what the trace captured; provider-native tools bypass the policy; there is no repeat-run machinery; multi-turn replays only the last turn.",
               "Ask about the gaps as questions. Never call them bugs."]},
    {"id": "compare", "title": "The comparison, when they ask how the two designs differ", "length": "about 30 seconds",
     "when": "Hold this until they ask. It is the strongest closing move.",
     "say": [
         "Kitaru freezes the transcript, so ingestion is free and counterfactuals are brittle. We froze the world, so counterfactuals held up and ingestion was expensive. They fail in opposite directions.",
         "The interesting product question is whether a recorded session can be promoted into a small queryable world model on demand, so the common case stays free and only the sessions you actually fork on get upgraded into something the agent can explore."]},
    {"id": "close", "title": "The close", "length": "about 20 seconds",
     "when": "The last minute. Then ask about next steps plainly.",
     "say": [
         "This is the first eval product whose source I've read and come away thinking the hard parts were hard for the right reasons. I've been on the other side of it: I know what it costs to build in-house and what it costs to keep. I'd like to build it as the product."]},
]

# The technical question bank. Each answer is written to be said.
QA = [
    {"group": "Your work, at depth", "items": [
        {"q": "Walk me through your day-to-day.", "tests": "Is the ownership real?",
         "a": ["It varies, but a typical week has three modes. Feature work on the email automation layer: the rules engine is our stickiest feature, users create rules in plain language from chat, so there's a steady stream of 'this rule didn't fire when I expected'.",
               "Reliability: I own the eval harness and the scanner that reads real production conversations and promotes genuine failures into a triage queue, so I'm looking at what actually broke rather than what I guessed would break.",
               "And work nobody asks for until it hurts. Our LLM spend was concentrated in one background pipeline, and I spent a week instrumenting cost per model and per stage before changing anything, because I didn't trust my intuition about where it was going."],
         "land": "I own a slice end to end, including after it ships."},
        {"q": "When you replay a case, what's running, what's faked, and where does the faking happen?", "tests": "Intercept depth.",
         "a": ["The tool body runs. Only the provider call is swapped, behind a harness flag that routes to the snapshot. So permission checks, ranking and response shaping are all on the production path.",
               "The alternative, replacing the whole tool function, would have meant testing the model against a simplified world, and most of our bugs lived in the seam between tool output and model interpretation."],
         "land": "Swap the provider, not the tool."},
        {"q": "How long does one case take to author, end to end?", "tests": "The number the whole scaling argument rests on. Do not dodge it.",
         "a": ["I never instrumented it, so this is an estimate rather than a measurement: about three to four hours per case at the start, dropping to forty-five minutes to an hour once the scanner aggregated the tool traces and prior turns automatically.",
               "It's expensive, and that's the honest trade-off. We bought counterfactual tolerance and paid for it in expert time per case. Importing a thousand recorded sessions is nearly free and gives you weaker cases. I'd want both."],
         "land": "Estimate first, with its basis. Never deflect to how cases are found."},
        {"q": "Why SQLite when production is Postgres?", "tests": "The sharpest fidelity question you will face.",
         "a": ["Two reasons, one good and one I'd revisit. The good one: a snapshot is a single file. Trivial to capture, trivial to spin up per case, no process to manage, full isolation between cases by construction, and I can open it and see exactly what the agent saw.",
               "The one I'd revisit: it isn't the production engine. No row-level security, different type affinity, dialect differences. So it tests agent behaviour faithfully and database behaviour not at all.",
               "Rebuilt today I'd use Postgres template databases, CREATE DATABASE ... TEMPLATE, cloning per case at near-SQLite speed on the real engine. The cost is a server in the test path. Did the gap bite? Not that I caught, which isn't quite the same thing."],
         "land": "Name the fidelity you traded, then the production-grade alternative."},
        {"q": "What happens when the production schema changes?", "tests": "Have you lived with it, or only built it?",
         "a": ["The base snapshot is append-only by design: old rows don't move under old cases, and a new case that needs another Michael gets a new name. So a case that used to pass and now fails is a signal about the agent, not the fixture.",
               "The structural fix I'd want on top is to version the snapshot and pin each case to a version, and fail loudly on a mismatch. A test that silently measures the wrong thing is worse than one that refuses to run."],
         "land": "It rots quietly unless the version is pinned and checked."},
        {"q": "How do you stop teaching to the test?", "tests": "Do you know what a fixture is for?",
         "a": ["We never pin expected output text. Assertions are computed from the snapshot: if the fixture has four financial events in the window, the output must contain four. That's checking against ground truth we own. Pinning a known-good answer would be teaching to the test."],
         "land": "Assert against ground truth you hold."},
        {"q": "How do you deal with nondeterminism?", "tests": "Do you separate noise from regression?",
         "a": ["Partly by removing it, partly by running more. On the gating path I removed it: the decision layer is deterministic risk scoring rather than a model call, because if an action commits a side effect I don't want the classification to be a sample.",
               "On generative paths you can't, so known-flaky cases, about ten percent, run three times and report a pass rate. A case that flips between versions without a code change is quarantined and looked at. One lucky run never counts as a pass.",
               "If they push on tool calls per task: on its own it rewards an agent that guesses instead of clarifying, which is why it sits next to counts of false completion claims. A version that got decisive and wrong would win on one and lose on the other."],
         "land": "Remove it on dangerous paths; measure around it elsewhere."},
        {"q": "How do you know the judge is still right?", "tests": "Is the judge's value measured?",
         "a": ["Weekly reconciliation against fresh human labels on a sample, which is where the roughly three-in-four agreement comes from. When agreement drops it's usually because a feature changed what correct means, and the rubric gets updated."],
         "land": "The judge is calibrated, not trusted."},
        {"q": "How do you decide what becomes an eval case?", "tests": "The heart of the role.",
         "a": ["The first filter is the whole game, because everything downstream is conditioned on it. Early on a signal flagged abandoned conversations, the agent said something and the user never replied, and a large share were one-way notifications where no reply was ever expected. Another class, 'agent did nothing', was just wrong: the agent had acted, we weren't joining against the tool-execution record.",
               "Both got fixed by grounding the signal in execution truth rather than tuning a threshold."],
         "land": "Ground signals in execution truth, not thresholds."},
        {"q": "What doesn't the bench catch?", "tests": "Do you volunteer the limit?",
         "a": ["Anything where the right answer isn't enumerable from the fixture, like whether a meeting brief is actually useful. And anything the scanner never saw fail: the bench only knows failures that happened. New features start with no coverage."],
         "land": "Volunteer the limit before they find it."},
        {"q": "Was it gating deploys?", "tests": "Is it real engineering practice?",
         "a": ["Nightly runs plus subset runs on changes, reviewed by whoever made the change. It informed releases and blocked the big ones, like the orchestration rewrite. It wasn't a hard CI gate on every commit, because a thirty-minute run with model variance on every push would have slowed the team more than it protected them."],
         "land": "It gated the releases that mattered."},
        {"q": "What would you do differently?", "tests": "Self-awareness.",
         "a": ["Instrument authoring time from day one, since I can't give you a measured number. And version the base snapshot explicitly so each case pins a version, instead of relying on append-only discipline."],
         "land": "Two concrete changes, no hedging."},
    ]},
    {"group": "Backend depth", "items": [
        {"q": "A side-effecting tool call fails halfway. What happens?", "tests": "Idempotency and crash windows.",
         "a": ["You can't get exactly-once against a third-party API you don't control, so the honest goal is at-least-once delivery with effects that are safe to repeat.",
               "We write the intent to a tool-execution ledger before the call, so there's a record even if the process dies mid-flight. That ledger is also what the anti-fabrication guards read: the agent can't claim it sent something unless there's a row saying it did. And side-effecting actions sit behind a confirm verdict with a bounded undo window.",
               "If the send succeeded but the response timed out, reconcile by looking the effect up at the provider before retrying blind. The design work is deciding where the idempotency key lives."],
         "land": "At-least-once plus idempotent effects; intent written before the call."},
        {"q": "Tell me about the queue. How is it claimed and drained?", "tests": "Postgres under concurrency.",
         "a": ["At our volume it's a Postgres table with a periodic drain, which is respectable at that scale. Where it strains is concurrent claiming: SELECT ... FOR UPDATE SKIP LOCKED so two workers don't serialise on the same rows.",
               "And a cron drain's worst-case latency is the interval, which is exactly the problem we hit on notifications: about ninety seconds down to about three by triggering on the event, with cron kept as a backstop, not removed."],
         "land": "Name the idiom, and the backstop."},
        {"q": "Hardest bug you've debugged?", "tests": "Mechanism-level understanding.",
         "a": ["Agent-facing read functions in Postgres were SECURITY DEFINER RPCs, so they run with the definer's privileges and can see past row-level security to do their job. The subtle part: Postgres grants EXECUTE to PUBLIC by default on a new function, so a function deliberately bypassing RLS was callable by any authenticated role. A cross-user leak class.",
               "Nothing was exploited; it came out of an adversarial design review. We fixed the grants, and the more important fix was the migration checklist, plus the test I'd automate: assert no SECURITY DEFINER function carries a PUBLIC execute grant."],
         "land": "Fix the class, not the instance."},
        {"q": "How do you normalise Gmail, Outlook and IMAP?", "tests": "Provider adapters, his own world.",
         "a": ["One internal model behind all three, where each provider fails differently, which is the same problem as Kitaru's importers across Langfuse, LangSmith and Braintrust with different nouns. Have your one concrete behavioural difference ready and what it forced in the model."],
         "land": "One real provider difference, and what it changed."},
    ]},
    {"group": "Tools and the landscape", "items": [
        {"q": "What's the difference between LangChain, LangGraph and LangSmith?", "tests": "Do you know the ecosystem Kitaru imports from?",
         "a": ["LangChain is the open-source framework: model wrappers, prompts, tools, retrievers, and the glue that chains them.",
               "LangGraph is its open-source orchestration layer for stateful agents: the agent as a graph of nodes and edges over shared state, with checkpointers for persistence, human-in-the-loop and streaming. LangChain's agents now run on it.",
               "LangSmith is the commercial platform around both, and it works outside them too: tracing, datasets, evals, a prompt hub and deployment. It's one of the trace sources Kitaru imports from.",
               "In a line: a framework, a runtime for stateful agents, and the observability-and-eval product."],
         "land": "Framework, runtime, platform."},
        {"q": "What's your experience with trace stores, open source or otherwise?", "tests": "Honest scope.",
         "a": ["At alfred_ we kept our own: conversations, the tool-execution ledger and the scanner's flags live in our own tables in Supabase Postgres, and the scanner and the bench run over them. I haven't run Langfuse or LangSmith in production; the closest I've come is importing Langfuse traces into Kitaru's example agent.",
               "What I know well is what a trace needs to hold for evaluation to work, because I built the consumer: tool inputs and outputs untruncated, the reasoning, and enough surrounding turns to judge a flag."],
         "land": "Own tables, honestly; and you know the consumer side deeply."},
        {"q": "Supabase for traces, a dedicated trace store, or build it yourself?", "tests": "Judgement.",
         "a": ["Keeping execution records in Postgres next to product data was the right call for us. The scanner's biggest false-positive fix was joining a flag against the tool-execution record, which is only easy when both live in the same database.",
               "Where a dedicated store earns its place is span trees, a UI for reading them, retention, and cost and latency at volume. So: build it yourself while your questions are about product data; adopt a trace store when your questions become about spans. That's also the appeal of Kitaru's importers: you don't have to pick."],
         "land": "Own it while the questions are about product data."},
        {"q": "How do you use AI in your own workflow?", "tests": "Are your instincts product instincts?",
         "a": ["Heavily, with scaffolding: Claude Code with project instructions and skills for the jobs I repeat, a review pass, and a verification step that drives the running surface instead of trusting that it compiled.",
               "The thing I've got strict about is not trusting an agent's self-report, the same instinct as the anti-fabrication work in our product. And where it's weak: anything depending on runtime state it can't see. It will tell you confidently which code path executes, reasoning from imports. That's exactly the gap replay closes."],
         "land": "Don't trust self-reports, from models or from yourself."},
        {"q": "Python or TypeScript?", "tests": "Don't oversell.",
         "a": ["My production work at alfred_ is TypeScript on Deno; my research and ML work is Python. Their server is Python, and I'd say that plainly rather than oversell fluency to someone with years in this codebase."],
         "land": "Plain and exact."},
    ]},
    {"group": "Designing replay", "items": [
        {"q": "What's hard about replay? How would you design one?", "tests": "First principles, not reciting Kitaru.",
         "a": ["Clarify first: are we reproducing a known failure or testing a change? The design splits there. Then name the hard part: capture isn't hard, divergence is.",
               "Sketch: intercept every boundary the agent crosses, model calls, tool calls, clock, randomness, key them for lookup, and re-run the real agent with the recording answering for the outside world.",
               "Then attack it. Divergence: exact keys punish the change you're measuring. Side effects: interception must sit at a boundary that catches everything, or a direct HTTP call walks past it. Ordering: repeated identical calls and concurrency make an ordinal ambiguous. The model: if model calls go live, the baseline isn't deterministic, so you need repeat runs."],
         "land": "Name the hard part before sketching."},
        {"q": "Multi-turn: the agent's reply changes at turn two. What happens at turn three?", "tests": "The open problem.",
         "a": ["The recorded turn-three user message may no longer make sense, in Kitaru or in my bench: freezing the world doesn't fix user divergence. The options are last-turn replay, which is honest but blind; a stateful world across turns, which fixes effects but not replies; or a simulated user seeded from the recording, which only counts once it's calibrated against real replies. I'd scope the simulator to sessions that actually fork early."],
         "land": "A simulator counts only once it's calibrated."},
        {"q": "If you ran Kitaru for a quarter, what would you ship first?", "tests": "Product judgement with dependencies.",
         "a": ["Provenance on every node first: small, and everything else depends on a reader trusting where a result came from. Then productive misses: the recorded-versus-attempted diff and one command to accept a variant. Then multi-turn with a calibrated simulator. The order follows dependency: trust, then the cheap feature, then the hardest open problem."],
         "land": "Trust first."},
    ]},
]

ASK = [
    {"to": "Either", "q": "When an unchanged replay diverges because the model just sampled differently, what do you show the user? Is that noise, a finding, or does it fail the baseline?"},
    {"to": "Either", "q": "In multi-turn replays, when the agent's reply changes at turn two, the recorded turn-three message may no longer make sense. How are you handling that today, and is a simulated user on the roadmap or deliberately out of scope?"},
    {"to": "Either", "q": "What's been the hardest thing to get right in the replay path?"},
    {"to": "Either", "q": "How often does a forked replay hit a cache miss for your early users? Is that the main support conversation or a rare edge?"},
    {"to": "Hamza", "q": "Where do you see Kitaru sitting against observability tools long term: is replay the wedge, or the product?"},
    {"to": "Hamza", "q": "One thing I've run into repeatedly is that the hard part isn't collecting traces, it's deciding which production behaviours are worth turning into durable evaluation cases. How are you thinking about that?"},
    {"to": "Alex", "q": "What have you learned from early users about the first ten minutes, and what did the guided tour change?"},
    {"to": "Either", "q": "What would you want someone in this seat to have shipped by the end of the first month?"},
]

TRAPS = [
    ("Leading with history", "Headline first: the real agent against a frozen snapshot of the user's world, only the provider call swapped."),
    ("Dodging the authoring-cost question", "Say it's an estimate, then the number, then the basis."),
    ("Praising Kitaru when asked what's wrong", "Provenance, then time. If stuck, 'give me a second'."),
    ("Two questions in one breath", "One at a time, name the thing, then wait."),
    ("Vague numbers", "5,000+ users, 12 classes, about 3 in 4, 100+ cases, 25 to 30 minutes nightly, 90 to 3 seconds."),
    ("Going sideways when pushed", "Add a detail about the same system, not a second system."),
    ("Defending SQLite", "Name the fidelity gap, then CREATE DATABASE ... TEMPLATE."),
    ("Calling their gaps bugs", "Ask as questions; they maintain the code."),
    ("Citing their PRs or commits", "Never. Ask a normal question and let them bring it up."),
    ("Funding, crunch, internal version names, colleagues' names", "Never."),
    ("Running long", "At minute 70 of 90, hand them your questions."),
]

# Kitaru, read from source (KITARU.md), as tables.
KITARU_TABLES = [
    {"title": "Tool policies", "note": "Resolution is by exact tool name, then the default.",
     "head": ["Policy", "What it does"],
     "rows": [["passthrough", "Runs the real tool. The default when no policy is set."],
              ["history", "The recorded result, by cache key, within a scope."],
              ["static", "Ordered cases, first match wins; exact or subset matching."],
              ["llm", "Modelled in the API; rejected at runtime by the PydanticAI adapter."]]},
    {"title": "on_miss", "note": "Three values, and every one is a bad escape for an improved agent.",
     "head": ["Value", "What happens"],
     "rows": [["fail", "Raises; the node is recorded failed and the whole replay dies."],
              ["error_result", "The model gets a literal error and keeps running: you grade recovery from an error you invented."],
              ["passthrough", "Calls the real tool; the node carries no mocked attribute. The silent fidelity hole."]]},
    {"title": "The cache key", "note": "sha256(tool_name + a null byte + canonical JSON: sorted keys, compact separators, allow_nan false). No fuzzy or subset matching on history.",
     "head": ["Change to the arguments", "Matches?"],
     "rows": [["Key order, JSON formatting", "Yes"], ["Whitespace inside a string", "No"], ["1 against 1.0, true against 1", "No"],
              ["NaN, infinity, unserialisable", "No key at all: straight to on_miss, no diagnostic"],
              ["Non-ASCII", "Within one adapter language only"]]},
    {"title": "Repeated calls flip with scope", "note": "Ask about the concurrency point as a question: the counter is read, the lookup awaited, then the counter written.",
     "head": ["Scope", "Behaviour"],
     "rows": [["baseline", "The nth recorded node, ordered by started_at: ordered consumption, from completed and failed nodes."],
              ["agent, cohort version", "The latest completed node, the same one every time."]]},
    {"title": "What always runs live", "note": "",
     "head": ["Thing", "Why it matters"],
     "rows": [["Model calls", "Every replay is billed and nondeterministic, even unchanged."],
              ["Anything outside a registered tool", "A bare HTTP call reaches production."],
              ["Provider-native tools", "Recorded but never checked against policy."],
              ["Earlier turns' tool calls", "Dropped: only the final turn re-executes."]]},
    {"title": "Claims against the source", "note": "",
     "head": ["Claim", "Reality"],
     "rows": [["Replays never touch production", "The default policy is passthrough, and so is one on_miss value."],
              ["No card gets refunded twice", "True for registered function tools; native tools bypass."],
              ["Compare distributions across runs", "No repeat-count or aggregation exists."],
              ["Multi-turn replays faithfully", "Final turn only; earlier tool activity stripped."],
              ["No user code runs on the server", "Accurate."]]},
]

ADMIRE = "The selector design is the bit I keep thinking about: storing a JSON path into the payload instead of copying text out, so a human judgement, an evaluator verdict and the UI all point at the same coordinates. I hand-rolled a worse version."

# One question, out loud, timed. ref points at the script or answer to compare against.
DRILLS = [
    {"id": "intro", "prompt": "Introduce yourself.", "target": "40 seconds", "seconds": 40, "ref": "#say-intro"},
    {"id": "seat", "prompt": "Why this seat, and why now?", "target": "45 seconds", "seconds": 45, "ref": "#say-seat"},
    {"id": "bench2", "prompt": "Tell me about your eval bench.", "target": "2 minutes", "seconds": 120, "ref": "#say-bench2"},
    {"id": "refunds", "prompt": "When did your bench pass something that was actually broken?", "target": "75 seconds", "seconds": 75, "ref": "#say-refunds"},
    {"id": "critique", "prompt": "Name one thing in Kitaru that's wrong or oversold.", "target": "60 seconds", "seconds": 60, "ref": "#say-critique"},
    {"id": "miss", "prompt": "A prompt change causes a cache miss and the replay dies. What would you do?", "target": "90 seconds", "seconds": 90, "ref": "#say-miss"},
    {"id": "sqlite", "prompt": "Why SQLite when production is Postgres?", "target": "60 seconds", "seconds": 60, "ref": "#qa"},
    {"id": "halfway", "prompt": "A side-effecting tool call fails halfway. What happens?", "target": "60 seconds", "seconds": 60, "ref": "#qa"},
    {"id": "langs", "prompt": "LangChain, LangGraph, LangSmith: what's the difference?", "target": "30 seconds", "seconds": 30, "ref": "#qa"},
    {"id": "close", "prompt": "Close the interview.", "target": "20 seconds", "seconds": 20, "ref": "#say-close"},
]

MOCK_HOW = ("Full mocks run in the Claude Code chat, not here. Say **'run the ZenML mock, 15 minutes'**. "
            "The interviewer opens with a first question and adapts from your answers like a person would, "
            "with opinions and follow-ups, and never summarises your answer back to you. Critique comes only after the "
            "time is up. The latest two mocks, with their critique, are kept below.")

KITARU_LEAD = ("Kitaru spawns your agent as an ordinary subprocess in your own environment, and an in-process adapter "
               "intercepts the agent framework's tool-execution hook, answering each tool call by a SHA-256 lookup "
               "against a recorded call log. The diagrams are from your teardown; the tables are the mechanisms "
               "they will probe.")

# Phrases bolded wherever they appear in what you say: the ideas the interviewer must hear.
EMPHASIS = [
    "frozen snapshot of the user's world", "only the call out to", "Only the provider call is swapped", "the only thing swapped",
    "harness mode", "harness flag", "SQLite snapshot", "twelve failure types", "three out of four", "a little over a hundred cases",
    "twenty-five real instances", "three people named Michael", "path it never took", "tool calls per completed task",
    "multi-turn orchestration", "append-only", "ground truth", "pinning an expected answer", "freezing a world rather than a transcript",
    "freezes the transcript", "froze the world", "fail in opposite directions", "promoted into a small queryable world",
    "a miss is information", "static alias", "shadow", "stamped on the node", "provenance", "the agent's clock isn't",
    "anti-fabrication", "tool-execution record", "tool-execution ledger", "at-least-once", "idempotent", "exactly-once",
    "FOR UPDATE SKIP LOCKED", "CREATE DATABASE ... TEMPLATE", "backstop", "SECURITY DEFINER", "PUBLIC", "row-level security",
    "fidelity", "execution truth", "a framework, a runtime for stateful agents, and the observability-and-eval product",
    "our own tables in Supabase Postgres", "divergence", "I never instrumented it", "estimate", "5,000-plus",
    "WheelPrice", "INFORMS Analytics+", "MockFlow-AI", "MetaRAG", "not looking to urgently leave",
]

# Per step on the Sessions tab: extra links into the system design guide, down to the one
# technique that step is about, and which of the teardown figures belongs with it.
_SD = "../SYSTEM%20DESIGN.html#/"


def _t(pattern, technique, label, why):
    return {"href": _SD + "patterns/" + pattern + "/" + technique, "label": label, "why": why}


def _d(design, anchor, label, why):
    return {"href": _SD + "designs/" + design + "/" + anchor, "label": label, "why": why}


STEP_EXTRA = {
    "wc13:0": {"figs": [3], "sd": [
        _t("agent-durability", "env-snapshots", "Technique: environment snapshots", "The bench's frozen world is this technique: the agent runs against a copy, never the real inbox."),
        _t("grounding", "eval-gate", "Technique: eval suites as release gates", "What the bench became: the thing that signed off the orchestration rewrite.")]},
    "wc13:1": {"sd": [_d("alfred", "deepdives", "alfred_, deep dives", "The system the bench tests, drawn from your own code.")]},
    "wc13:4": {"sd": [_t("grounding", "shadow-online", "Technique: shadow mode and online signals", "Where the scanner's production signals come from, and why they over-fire.")]},
    "wc13:5": {"sd": [_d("alfred", "hld", "alfred_, high-level design", "Draw the bench as a box beside this: scanner, judge, reconciler, snapshot, replay.")]},
    "wc14:0": {"sd": [_t("grounding", "citations", "Technique: enforced citations and verification", "Provenance is the same idea: every result says where it came from.")]},
    "wc14:1": {"sd": [_t("scaling-reads", "cache-aside", "Technique: cache-aside", "What a miss means in an ordinary cache, and why a replay miss is different: it is information.")]},
    "wc14:2": {"sd": [_t("reliability", "monitoring", "Technique: monitoring and completeness checks", "Asserting every refund appears is a completeness check against ground truth you hold.")]},
    "wc15:0": {"figs": [0]},
    "wc15:1": {"figs": [1], "sd": [_t("agent-safety", "least-privilege", "Technique: least privilege and sandboxing", "What Kitaru deliberately does not do: your agent runs with your process's rights.")]},
    "wc15:3": {"sd": [_t("agent-safety", "effect-classes", "Technique: tool effect classes", "Tool policies are a replay-time version of sorting tools by what they do to the world.")]},
    "wc15:5": {"figs": [2]},
    "wc15:6": {"sd": [_t("agent-durability", "transcript-checkpoint", "Technique: transcript checkpoint every turn", "Why last-turn replay is possible at all: every turn is recorded as it happens.")]},
    "wc16:1": {"figs": [0]},
    "wc16:2": {"figs": [3]},
    "wc16:3": {"sd": [_t("grounding", "citations", "Technique: enforced citations and verification", "Trust in a replay is provenance on every node, the same move as citing every claim.")]},
    "wc16:4": {"sd": [
        _t("contention", "claim-skip-locked", "Technique: queue claiming with SKIP LOCKED", "Two workers, one table, no double claims."),
        _t("long-running", "leases", "Technique: leases, heartbeats, visibility timeouts", "What happens when a worker dies holding a replay."),
        _t("long-running", "worker-pool", "Technique: queue plus worker pool", "The shape of the replay runner.")]},
    "wc17:0": {"sd": [_t("agent-durability", "env-snapshots", "Technique: environment snapshots", "SQLite file or Postgres template: two ways to build the same snapshot.")]},
    "wc17:1": {"sd": [
        _t("multi-step", "idempotency", "Technique: idempotency keys", "Where the key lives decides whether a retry is safe."),
        _t("multi-step", "outbox", "Technique: transactional outbox", "Write the intent before the call, the ledger's shape."),
        _t("agent-durability", "unknown-results", "Technique: idempotent tools and unknown results", "The send succeeded but the response timed out.")]},
    "wc17:2": {"sd": [
        _t("contention", "claim-skip-locked", "Technique: queue claiming with SKIP LOCKED", "The idiom to name when they ask how the queue is claimed."),
        _t("real-time", "polling", "Technique: polling and long polling", "Why a cron drain's worst case is its interval, and what triggering on the event buys."),
        _t("long-running", "retries-dlq", "Technique: retries with backoff and a dead-letter queue", "The backstop you keep after moving to events.")]},
    "wc17:3": {"sd": [_t("agent-safety", "least-privilege", "Technique: least privilege and sandboxing", "SECURITY DEFINER plus a PUBLIC grant is least privilege failing by default.")]},
    "wc17:4": {"sd": [_d("email-agent", "hld", "Email and calendar agent, high-level design", "An agent over Gmail and a calendar, with the providers behind one model.")]},
    "wc11:1": {"figs": [4]},
}

# Outside reading per step on the Sessions tab. Every URL here was opened and checked on
# 25 Sep 2026; the lesson folders in AI Engineering from Scratch were checked against the repo.
_AE = "https://github.com/rohitg00/ai-engineering-from-scratch/tree/main/phases/"


def _r(label, url):
    return {"label": label, "url": url}


def _ae(path, label):
    return {"label": "AI Engineering from Scratch, " + label, "url": _AE + path}


def _b(t):
    return {"book": t}


STEP_READING = {
    "wc7:3": [_r("Kitaru docs: what a replay is", "https://docs.zenml.io/kitaru/core-concepts/replay")],
    "wc13:0": [_r("Hamel Husain: your AI product needs evals", "https://hamel.dev/blog/posts/evals/index.html"),
               _ae("14-agent-engineering/30-eval-driven-agent-development", "phase 14, lesson 30: eval-driven agent development")],
    "wc13:1": [_r("Anthropic: demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents")],
    "wc13:4": [_r("Eugene Yan: evaluating LLM evaluators, agreement with human labels", "https://eugeneyan.com/writing/llm-evaluators/"),
               _ae("14-agent-engineering/52-design-success-metrics", "phase 14, lesson 52: designing success metrics")],
    "wc13:5": [_ae("14-agent-engineering/31-agent-workbench-why-models-fail", "phase 14, lesson 31: the agent workbench, why models fail"),
               _ae("11-llm-engineering/10-evaluation", "phase 11, lesson 10: evaluating LLM applications")],
    "wc14:0": [_r("Replay baselines that silently drift when a tool's identity changes", "https://dev.to/gabrielanhaia/stop-keying-agent-replay-on-tool-names-use-fingerprints-1m63")],
    "wc14:1": [_r("VCR.py: record modes, what happens on a miss", "https://vcrpy.readthedocs.io/en/latest/usage.html"),
               _r("VCR.py: how a request is matched to a recording", "https://vcrpy.readthedocs.io/en/latest/configuration.html")],
    "wc14:2": [_r("Snapshot tests against behaviour-checking tests, the trade-offs", "https://www.sitepen.com/blog/snapshot-testing-benefits-and-drawbacks")],
    "wc15:0": [_r("Control plane and data plane, explained", "https://konghq.com/blog/learning-center/control-plane-vs-data-plane")],
    "wc15:1": [_r("What running a subprocess without a sandbox gives away", "https://www.pandastack.ai/blog/how-to-sandbox-untrusted-code/")],
    "wc15:2": [_r("Postgres docs: WITH RECURSIVE, for a tree in one table", "https://www.postgresql.org/docs/current/queries-with.html"),
               _b("DDIA, ch. 2, Data models and query languages: the part on trees and graphs")],
    "wc15:3": [_r("Kitaru docs: replay and overrides, the tool policies", "https://docs.zenml.io/kitaru/guides/replay-and-overrides")],
    "wc15:4": [_r("Kitaru docs: replay and overrides, the cache key and on_miss", "https://docs.zenml.io/kitaru/guides/replay-and-overrides")],
    "wc15:6": [_r("Regression-testing multi-turn conversations as whole trajectories", "https://dev.to/jackm-singularity/conversation-regression-testing-for-ai-agents-catch-multi-turn-failures-before-production-emg")],
    "wc16:0": [_r("Temporal: what durable execution is", "https://docs.temporal.io/evaluate/understanding-temporal"),
               _ae("15-autonomous-systems/12-durable-execution", "phase 15, lesson 12: durable execution")],
    "wc16:1": [_r("Temporal: workflow execution, event history and replay", "https://docs.temporal.io/workflow-execution"),
               _ae("15-autonomous-systems/16-checkpoints-rollback", "phase 15, lesson 16: checkpoints and rollback")],
    "wc16:2": [_r("TigerBeetle: deterministic simulation testing, and why determinism is the whole game", "https://tigerbeetle.com/blog/2026-08-20-protocol-aware-dst/")],
    "wc16:3": [_ae("14-agent-engineering/24-agent-observability-platforms", "phase 14, lesson 24: agent observability platforms")],
    "wc16:4": [_r("Temporal: worker slots and concurrency on a task queue", "https://docs.temporal.io/develop/worker-performance"),
               _r("Crunchy Data: a queue in plain Postgres with SKIP LOCKED", "https://www.crunchydata.com/blog/message-queuing-using-native-postgresql")],
    "wc17:0": [_r("Postgres docs: template databases", "https://www.postgresql.org/docs/current/manage-ag-templatedbs.html"),
               _r("SQLite docs: datatypes and type affinity", "https://www.sqlite.org/datatype3.html")],
    "wc17:1": [_r("Stripe: designing APIs with idempotency", "https://stripe.com/blog/idempotency"),
               _r("Brandur Leach: Stripe-like idempotency keys in Postgres", "https://brandur.org/idempotency-keys"),
               _b("DDIA, ch. 8, The trouble with distributed systems: timeouts and unknown outcomes"),
               _b("DDIA, ch. 11, Stream processing: exactly-once and idempotence")],
    "wc17:2": [_r("Postgres docs: the locking clause, FOR UPDATE SKIP LOCKED", "https://www.postgresql.org/docs/current/sql-select.html"),
               _r("Crunchy Data: a queue in plain Postgres with SKIP LOCKED", "https://www.crunchydata.com/blog/message-queuing-using-native-postgresql"),
               _r("Postgres docs: LISTEN, triggering on the event", "https://www.postgresql.org/docs/current/sql-listen.html"),
               _b("DDIA, ch. 7, Transactions: locks and isolation")],
    "wc17:3": [_r("Postgres docs: CREATE FUNCTION, writing SECURITY DEFINER functions safely", "https://www.postgresql.org/docs/current/sql-createfunction.html"),
               _r("Postgres docs: ALTER DEFAULT PRIVILEGES, and EXECUTE granted to PUBLIC", "https://www.postgresql.org/docs/current/sql-alterdefaultprivileges.html"),
               _r("Supabase docs: row-level security and security definer functions", "https://supabase.com/docs/guides/database/postgres/row-level-security")],
    "wc17:4": [_r("Gmail API: synchronising a client with history.list", "https://developers.google.com/workspace/gmail/api/guides/sync"),
               _r("Microsoft Graph: delta query for messages", "https://learn.microsoft.com/en-us/graph/delta-query-messages")],
    "wc8:5": [_r("Temporal docs: activities, where side effects live", "https://docs.temporal.io/activities"),
              _ae("15-autonomous-systems/12-durable-execution", "phase 15, lesson 12: durable execution")],
    "wc9:1": [_r("tau-bench paper: tool, agent and a simulated user, and pass^k", "https://arxiv.org/abs/2406.12045")],
    "wc9:3": [_ae("14-agent-engineering/19-benchmarks-swebench-gaia", "phase 14, lesson 19: agent benchmarks")],
    "wc10:0": [_r("Alex Strick van Linschoten's blog", "https://alexstrick.com/")],
    "wc10:1": [_r("Alex Strick: how to think about evals for LLM applications", "https://alexstrick.com/posts/2025-05-20-how-to-think-about-evals.html")],
    "wc10:2": [_r("Kitaru docs: setup, the MCP server and agent skills", "https://docs.zenml.io/kitaru/getting-started/setup")],
    "wc10:3": [_r("Kitaru docs: welcome", "https://docs.zenml.io/kitaru")],
    "wc11:0": [_r("ZenML docs: core concepts", "https://docs.zenml.io/getting-started/core-concepts"),
               _r("ZenML docs: steps and pipelines", "https://docs.zenml.io/concepts/steps_and_pipelines"),
               _r("ZenML docs: artifacts and lineage", "https://docs.zenml.io/concepts/artifacts")],
    "wc11:1": [_r("ZenML blog: the Kitaru launch", "https://www.zenml.io/blog/kitaru-launch"),
               _r("ZenML docs: stacks and stack components", "https://docs.zenml.io/concepts/stack_components")],
}
