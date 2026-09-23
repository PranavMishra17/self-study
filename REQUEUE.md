# Requeue

Open items. Nothing here gets deleted — only answered, with a date.

Opened 14 September 2026 from the baseline diagnostic, which is where the list of
topics to rebuild came from. Add to it whenever something is set aside unresolved.

---

## From the baseline diagnostic, 14 September 2026

### Clears in milestone 1

| # | The thing | Why it matters | Due |
|---|---|---|---|
| Q6 | Shape of `(AB)ᵀ` for A 4×3, B 3×5 | Half of all PyTorch errors are shape errors | Wk 3 |
| Q7 | Derivative of sigmoid in terms of itself | The self-referential form is why it is used in backprop | Wk 2 |
| Q8 | What an eigenvector is geometrically | The null-space definition came out instead | Wk 3 |
| Q9 | Bayes with base rates, set up and solved | Identified correctly, could not set it up | Wk 5 |
| Q10 | What the learning rate multiplies | Unknown, and it is the definition of a thing you tune | Wk 4 |
| Q11 | Why the chain rule makes backprop possible | This is the whole mechanism, in two sentences | Wk 4 |
| Q14 | Backpressure, and what a system without it does | It was the answer to the question you were actually asked | Wk 1 |
| Q1 | Overfitting interventions, by mechanism not name | Diagnosis was right, the interventions stayed vague | Wk 2 |
| Q3 | Where embedding numbers physically come from | Closeness was covered, the mechanism was not | Wk 4 |
| Q4 | Q, K, V, and why divide by √d_k | V is Value. The scaling is a variance argument | Wk 4 |
| Q12 | The 100M answer in primitives, no vendor names | Right instinct, expressed in stack terms | Wk 1, again Wk 5 |
| Q16 | The cache question including what you give up | The tradeoff was skipped, and the tradeoff is the answer | Wk 5 |

### Clears in milestone 2

| # | The thing | Why it matters |
|---|---|---|
| Q2 | Both real effects of batch normalisation | Picked one of two; the answer was both |
| Q17 | Sorted array, two sum — why two pointers, not a hash set | The hash set works; the sorted constraint allows better |
| Q18 | What n log n tells you about an algorithm's shape | Not covered yet |
| Q19 | First non-repeating character, written properly | Half the idea was there; it is a frequency pass |
| Q20 | Maximum depth of a binary tree | The gateway problem for every tree question |

---

## Added since

_Date each addition and each clearing._

**2026-09-22 — The gate's bar contradicts this file.**
`MILESTONE-1.md` says of the requeued items that "those six are what this milestone
exists to clear". The milestone-1 table above has **twelve** rows, not six. Either the
bar was written before the list grew, or six of the twelve were meant to be optional
and nobody recorded which. `PROTOCOL.md`'s re-plan ritual opens with taking the gate
and recording the result, so a gate whose bar cannot be evaluated blocks the ritual
rather than just being untidy. Decide before the week of 26 October: is the bar all
twelve, or a named six.

**2026-09-22 — The gate has no scoring instrument.**
The bar includes "seventy percent on the systems section", but the 14 September
diagnostic it is modelled on was free text, self-graded, with no percentage logic
anywhere. So the number cannot currently be produced. `diagnostics/baseline-diagnostic.html`
is the precedent to build from. None of the twenty-one items in `IMPROVEMENTS.md`
owns this, which is how it stayed invisible.

**2026-09-22 — Alaap does not exist on this machine.**
Three of the fifteen planned sessions are Alaap — `w1c` Part 0 orientation, `w3c`
sampling and the frequency domain, `w5c` the source-filter model — and the charter
budgets four hours of milestone 1 to it. The sessions reference `architecture.html`,
diagrams 1 to 5, an executive verdict, and a demo to run and listen to. A search of
the whole of `E:\_Resume-Curator` by filename and by content, and a sweep of every
top-level folder on `E:`, found nothing named Alaap and no `architecture.html`.

It is presumably on another drive, in a repository not cloned here, or not yet built.
Until its location is known, those three sessions cannot be done as written, and the
public-source substitutes now in `w5c` cover the idea but not the project. This is
not a failure of the plan; it is a missing pointer, and it costs four hours of the
milestone if it stays missing.
