# Milestone 1 — Primitives

**21 September to 25 October 2026. Five weeks. Roughly 25 hours.**

Systems leads. Mathematics runs underneath. Alaap stays warm. DSA is at zero, and
that is deliberate, not an oversight.

---

## The two capabilities this milestone buys

**One.** Take any system you have built, be asked the ten-thousand-times question,
and answer for five minutes in primitives — throughput, partitioning, backpressure,
failure, cost — without once naming a vendor. The instinct is already there; what is
missing is the vocabulary to carry it, which is why the answer currently comes out
in terms of your stack rather than in terms that generalise. That is a fixable
translation problem and five weeks is enough for it.

**Two.** Be ready for TrenTorch. Not ready for all of machine learning — ready for
the specific, small, nameable set that PyTorch actually rests on: partial
derivatives and the chain rule, because autograd *is* the chain rule on a tape;
matrix shapes and multiplication, because half of all PyTorch errors are shape
errors; logs and exponentials, because every loss is built from them; and enough
probability to know that a softmax output is a distribution. That is a short list and
five weeks is a generous amount of time for it.

## The weekly shape

Three sessions. Protect the first two; the third is the one that gives way.

| | Length | Track | When |
|---|---|---|---|
| **A** | ~2h 30m | Systems | The long block. Mornings, 07:00, before anything opens. |
| **B** | ~1h 30m | Mathematics | Split into two sittings if that helps. It usually does. |
| **C** | ~45m | Alaap, or the requeue | Wherever it lands. First to go on an Amber week. |

Session A is the one with no multitasking. Nothing else open. Not Claude Code,
not applications, not the phone. If that rule breaks, the session did not happen.

**Extra practice, added 25 September.** Three system design sessions written for the
Oxus loop now sit after session C as optional practice, one a week: week 2, evidence
ingestion from messy documents (1h 30m); week 3, walkthrough to flowchart and the
year-over-year base (1h); week 4, an agent that tests a SOX control (2h). They do not
count toward a week's state and do not move the gate.

**How each session is worked.** In the tracker, every step starts shut and opens to
what it is, its figure, what to read with minutes, and where it sits in the system
design guide, with the answer behind a toggle until tried. The closing quiz is five to
eight open questions. The long form below is the plan; the tracker is where it is done.

---

# Week 1 · 21–27 September · The words you were missing

### Session A — Systems: throughput, latency, queues, backpressure

You had the right instinct on the eval-harness question and no vocabulary to carry
it. Backpressure came back unknown, and backpressure *is* the answer to the question
you were asked. This week is the vocabulary.

Cover: throughput against latency and why they trade; what a queue actually is and
what bounded versus unbounded means; **backpressure** — what it is, what a system
without it does when it saturates (it does not slow down, it dies, and the way it
dies is the interesting part); load shedding; tail latency and why the mean is a lie.

**DDIA** (2nd edition) — look up *percentiles* in the index; the sections are Describing Performance, Latency and Response Time, and Average, Median, and Percentiles. Not chapter 1 in this edition. It is short. The p99
argument is the single most quotable thing in the book and you will use it in
interviews.

**Do.** Rewrite your 14 September answer to the hundred-million question. Same
question, but you may not use the words Supabase, edge function, or any product
name. Only primitives. Three hundred words, written down, kept.

**Check.** Your eval harness saturates. Describe what happens with backpressure and
what happens without it, and name which component you would rather have fail.

### Session B — Mathematics: functions, exponentials, logarithms

Start here and not with calculus, because logs are load-bearing everywhere
downstream — log-likelihood, log-loss, log scales on every plot you will read — and
because it is a gentle re-entry after a year away.

Cover: what a function is as a machine; exponential growth and decay; logarithm as
the inverse of exponentiation; why `log(ab) = log a + log b` matters (it turns
products into sums, which is the whole reason likelihoods are logged); natural log
and *e*, at the level of why *e* is special rather than a history lesson.

**Watch.** 3Blue1Brown, *Essence of Calculus*, chapter 1. Twenty minutes and it
reframes what a derivative is before you ever compute one.

**Do.** Ten log and exponent manipulations by hand, on paper. Khan Academy's
logarithm practice set is fine. Paper, not a screen — the point is the hand.

### Session C — Alaap: Part 0, orientation

Run the demo. **Listen to the output.** Read `architecture.html`, diagrams 1 to 5,
and the executive verdict. This is two hours of the four Alaap gets all milestone.

**Check.** Why is the TTS model never trained, and what breaks if it is?

---

# Week 2 · 28 September – 4 October · Partitioning

### Session A — Systems: how work splits

The honest answer to "make it a hundred million" almost always begins with "stop
doing it on one machine." That sounds obvious and the interesting part is
immediately underneath it: what do you split *on*, and what goes wrong when the
split is uneven.

Cover: partitioning and sharding; choosing a partition key; hot partitions and skew
— why one shard ends up with all the traffic and why it is usually a key choice, not
bad luck; rebalancing; fan-out and the tail-latency amplification problem, where one
slow shard makes the whole request slow.

**DDIA** (2nd edition) — chapter 7, *Sharding*, all of it. This was chapter 6 in the first edition. This is the chapter that pays for itself.

**Do.** Design the sharding for your eval harness at a hundred million replays. What
is the partition key — scenario, user, time, hash? Where is the skew? What happens
when one scenario family is a thousand times more common than the rest? Write it.

**Check.** You partition by user id. One user accounts for four percent of all
traffic. What breaks, and what do you change?

### Session B — Mathematics: derivatives, properly

Cover: derivative as instantaneous rate of change and as slope; the power rule;
product and quotient rules; and then the **chain rule**, which is the one that
matters more than everything else in this list combined.

**Watch.** 3Blue1Brown, *Essence of Calculus*, chapters 2, 3 and 4.

**Do.** Requeued from the diagnostic: derive the derivative of the sigmoid and
express it in terms of the sigmoid itself. Do not look up the result first. Get to
`σ'(x) = σ(x)(1 − σ(x))` with your own hand and understand why that self-referential
form is so convenient in backpropagation.

**Requeue cleared this week.** Q7 (sigmoid derivative).

### Session C — Requeue

Q1 from the diagnostic: overfitting was named correctly, the interventions less so.
Pin them down. Name four —
regularisation of both kinds and what each actually penalises, early stopping,
dropout, more or augmented data — and for each one say the mechanism, not the name.

---

# Week 3 · 5–11 October · Storage, and the shape of data

### Session A — Systems: where a hundred million things live

Cover: rough orders of magnitude — what a million, a billion, a terabyte cost and
how long they take; object storage against a database, and when each is the wrong
answer; the write path versus the read path; append-only logs; indexes and what they
cost you on write; retention and tiering, because the answer to "where do a hundred
million traces live" is often "not all in the same place, and not forever."

**DDIA** (2nd edition) — the storage and retrieval chapter, first half; look up *LSM-tree* and *B-tree* in the index. LSM-trees against B-trees at the level of
*why writes are cheap in one and reads are cheap in the other*, not implementation.

**Do.** Size it. Estimate bytes per eval trace, multiply by a hundred million, and
get a real number. Then choose where it lives and defend the choice on cost and
access pattern. This exercise — the back-of-envelope — is asked constantly and it is
almost entirely a willingness to do arithmetic out loud.

**Check.** Ten kilobytes per trace, a hundred million traces a day. How much a day?
A month? What does that cost on object storage, and what changes if you need to query
it rather than just store it?

### Session B — Mathematics: vectors and matrices

Cover: vectors as things with direction and magnitude; dot product, and both its
geometric meaning and why cosine similarity is the dot product of normalised vectors
— you use this every day in the memory system without having derived it once; matrix
multiplication as composition of transformations; shapes and why they must line up;
transpose; and eigenvectors geometrically.

**Watch.** 3Blue1Brown, *Essence of Linear Algebra*, chapters 1 through 4, then
chapter 14 on eigenvectors. This series is the single highest-return thing on this
page.

**Do.** Requeued: A is 4×3, B is 3×5. Work out the shape of `(AB)ᵀ` by hand, then
prove to yourself why `(AB)ᵀ = BᵀAᵀ`. Then ten shape problems until shapes are
automatic.

**Requeue cleared this week.** Q6 (matrix shapes), Q8 (eigenvector).

### Session C — Alaap: sampling and the frequency domain

Study guide §2.1. Sample rate, Nyquist, why this project juggles four different
sample rates and what it cost when one was analysed at another's rate. Physics, not
machine learning — none of the maths you are rebuilding is needed here.

---

# Week 4 · 12–18 October · Failure

### Session A — Systems: things break at a hundred million

Cover: what actually fails — networks partition, machines die mid-work, calls time
out, and at a hundred million scale rare means constant; retries and why naive
retries make outages worse (the thundering herd); exponential backoff and jitter;
idempotency, which you already understood for payments — now generalise it;
at-least-once against at-most-once, and why exactly-once is mostly a marketing
claim; dead-letter queues; partial failure and why a run that is 97% complete is a
design question, not an error.

**DDIA** (2nd edition) — chapter 9, *The Trouble with Distributed Systems*. Skim the stream-processing chapter's section on delivery
guarantees.

**Do.** Three percent of your hundred million replays fail mid-run. Design the retry
path and the deduplication. Say explicitly what you would do with a scenario that
fails deterministically every time, versus one that fails on a coin flip.

**Check.** Why does adding retries to a struggling service sometimes take it down
completely, and what is the standard fix?

### Session B — Mathematics: gradients and descent

This is the week the math track has been building toward and the week TrenTorch
actually needs.

Cover: partial derivatives; the gradient as the vector of them and why it points
uphill; the gradient descent update rule, written out in full; and then the chain
rule applied through composed functions, which *is* backpropagation — the tape, the
forward pass recording, the backward walk.

**Watch.** 3Blue1Brown, *Neural Networks*, chapters 1 through 4. Chapter 4 is
backpropagation calculus and it is the payoff for everything since week 2.

**Do.** Requeued: write the gradient descent update rule from memory. Then take a
tiny composed function — two or three layers, scalar, no matrices — and
backpropagate it by hand on paper. Once. It is tedious and it is the single most
clarifying hour in this milestone.

**Requeue cleared this week.** Q10 (learning rate), Q11 (chain rule and backprop).

### Session C — Requeue

Q3 and Q4 from the diagnostic, where the answers stayed at the level of what these
things do rather than how they work. Write, properly: where do embedding numbers
physically come from and what drags them into a meaningful arrangement. Then Q, K and V — V is Value — and why the dot product is
divided by the square root of `d_k`. You will find the second one is a variance
argument and that it connects directly to what you learned about dot products in
week 3.

---

# Week 5 · 19–25 October · Caching, consolidation, and the spoken answer

### Session A — Systems: caching, then putting it together

Cover: cache placement; what to key on; TTL against explicit invalidation; the hard
part, which is invalidation when the underlying data changes — for a memory system,
a write to memory must invalidate the cached search, and *that* is the tradeoff you
skipped on 14 September; read-through and write-through; and what staleness costs in
a product where the whole promise is that it remembers.

**DDIA** (2nd edition) — replication, lightly; look up *replication lag* and *read-your-writes* in the index, for the staleness and read-your-writes
material.

**Do, part one.** Answer the memory-system cache question properly. Where the cache
sits, exactly what the key is, what the invalidation rule is, and what you give up.

**Do, part two — this is the milestone's real deliverable.** Record yourself
answering the hundred-million question out loud for five minutes. No notes. Then
listen to it. Saying something fluently is a separate skill from knowing it, and the
only way to build it is to hear yourself do it badly a few times first.

### Session B — Mathematics: probability

Cover: random variables and distributions; conditional probability; **Bayes**,
which you correctly identified on 14 September and could not set up; base rates and
why a 99%-accurate test for a rare disease is mostly wrong; expectation; and softmax
as a distribution, which closes the loop back to cross-entropy — the one ML question
you got right and can now explain rather than recognise.

**Do.** Requeued: the disease problem. Set it up, work it, and get the number. Then
do three more base-rate problems until the shape stops surprising you.

**Requeue cleared this week.** Q9 (Bayes).

### Session C — Alaap: the source–filter model

Study guide §2.3. The guide calls it the single most important idea in Part 2 and it
is right: vocal folds make a buzz at F0, the vocal tract is a tube that resonates,
change the buzz and it is the same person, change the tube and it is someone else.
Everything Alaap measures sits on this split.

---

# The gate

**Week of 26 October.** A timed quiz in the same format as 14 September, built when
you reach it so it can be calibrated to what actually happened rather than what was
planned.

**The bar:**

- Every requeued item from milestone 1 answered. Not perfectly — answered. Those six
  are what this milestone exists to clear.
- The five-minute spoken answer recorded, and it uses primitives rather than product
  names.
- Seventy percent on the systems section.

Fail the gate and milestone 1 extends by a week. That is a normal outcome, not a
crisis. The dates are soft; the capabilities are not.

---

## The wildcard slot

A sixth slot on the planner, empty until an interview lands. Sessions for a
scheduled loop are written there instead of being crammed into the weeks, the loop
gets its own page in `interviews/`, and closing its sessions earns credit toward
folding up to four planned sessions in as covered.
See `WILDCARD.md` for the mechanics. The relevant line for this milestone: a loop
arriving in October does not push the gate, and does not mean the five weeks
stopped existing.

## What is deliberately not here

**DSA is at zero for five weeks.** When a coding round appears — and it will — the
instinct will be to drop everything, like September of last year with Amazon. That
is what the interruption protocol is for. Declare a Red week, sprint for the
interview, come back on the ramp. The sprint is not a betrayal of the plan. Dropping
the plan afterwards is.

**Alaap's Parts 3 through 6 are parked.** MDNs, the navigability papers, Vendi
scores, per-dimension rescaling. All of it is readable once the mathematics is
rebuilt and nearly worthless before that, because you would be reading it as
vocabulary. That is the exact trap this milestone exists to break.

**TrenTorch does not start here.** It starts in milestone 2, on top of a rebuilt
floor, and it will move roughly twice as fast for it.
