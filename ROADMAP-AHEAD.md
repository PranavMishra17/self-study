# Roadmap ahead

Detail decays with distance on purpose. Milestone 2 is intent without a schedule.
Milestone 3 is a sketch. Everything after is a parked list.

At the end of each milestone this file gets rewritten: the next one is detailed out
into its own file, the one after is promoted to planned, and a new sketch appears at
the back. Check every rewrite against `CHARTER.md` and record deviations in
`CHANGELOG.md`.

---

## Milestone 2 — Mechanism · planned, not scheduled

Roughly six to seven weeks. Likely late October to mid December, though that is a
guess and the gate decides.

**The capability:** machine learning stops being metaphor. You can derive rather
than describe. And you can write PyTorch without guessing what a line does.

**TrenTorch is the spine.** Roughly twenty hours, and it works precisely because it
makes you build the thing rather than read about it — tensors, autograd, modules,
the training loop. Milestone 1's mathematics is what makes this affordable: going in
with the chain rule and matrix shapes already in hand is the difference between
learning PyTorch and fighting it.

**Alongside it, the mechanism questions get answered properly.** What an embedding
is at the level of weights. Why attention scales by the square root of `d_k`. What
batch normalisation actually does — you picked one of its two real effects on
14 September and there were two. Why cross-entropy's gradient survives saturation
when squared error's does not.

**DSA foundation begins here.** Not random LeetCode. Patterns from zero: arrays and
two pointers first, because the sorted-array question you missed is exactly that
pattern; then hashing, binary search, recursion and trees — maximum depth of a binary
tree came back blank and it is the gateway to every tree problem — then BFS and DFS,
then a first look at dynamic programming. Requeued Q18 and Q20 clear here.

**Systems drops to one drill a week** so it does not rot. One scaling question,
answered out loud, fifteen minutes.

**Alaap** opens up: Part 1's exit checklist becomes checkable because TrenTorch
covers it, and Part 3 on speaker identity becomes readable because the mathematics
is there. The three navigability papers are the intellectual core of the project and
the reward for the work of milestone 1.

**Gate:** a timed quiz plus something built. Probably a small network trained from
scratch in PyTorch on something trivial, with you able to explain every line and
what the gradients are doing.

---

## Milestone 3 — Training · sketch

Roughly eight weeks. Somewhere in the first quarter of 2027.

Alaap becomes the from-scratch artifact rather than an assembly of other people's
models. You train something. Mathematics becomes applied rather than studied — MDNs,
per-dimension rescaling, the actual loss functions, understood as mathematics
because by then they are. Alaap's Parts 4 through 6 become readable: codecs, flow
matching, and the evaluation traps, which is the part of that project with the
highest ratio of hard-won knowledge to published literature.

DSA moves to maintenance, two problems a week, permanently.

The second artifact starts taking shape here: the open-source tool extracted from
the alfred_ work. Eval harness, decision layer or memory system, generalised out of
the product and made usable by strangers.

---

## Beyond · parked, not scheduled

Named so they stop being background anxiety. Nothing here has a date.

- **The open-source tool**, finished and actually used by someone who is not you.
- **The India move.** Companies worth targeting, what each interviews on, and when
  applications should start. This becomes a real workstream once milestones 2 and 3
  have landed, not before.
- **Space and defence.** A genuine interest, newly viable as a sector, and entirely
  unexamined. At some point it deserves a week of proper research rather than a
  recurring daydream.
- **Writing.** The film criticism, the screenwriting. Tracked in the life strip as a
  binary, never planned, never assigned a target.
- **Systems depth beyond interview level.** Consensus, distributed transactions, the
  back half of DDIA. Only if it stays interesting.
