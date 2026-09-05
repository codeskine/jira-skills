# 2026-09-05 — the channel-map batch (#52, #53, #55, #56, #59, #78)

The isolated routing replay, run before merge because two descriptions changed — `jira-plan` and
`jira-release` — and a third, `jira-advance`, changed in response to what the first round found.

Three rounds. **All routings came out as decided in every round**; every finding is in the
invented-criteria list, which is the report worth having.

## What the first round was built to catch, and did

Naming the backlog put the word in exactly one trigger, which makes it a high-weight token — and
users say it in two senses. Round 1 routed all twelve requests correctly and reported the case that
was nearly lost:

> Here "backlog" is the user's idiom for "record this as something we intend to do", the intake
> sense. A matcher that weights the rare token sends a wish nobody has written down yet to the
> sprint planner. I overrode it with an invented rule.

`sel-propose-2`'s case came out at **low** confidence, saved by the other signals in the sentence
rather than by anything separating the two senses. Asked directly what had separated them:

> The only discriminator available is the presence of the word **"back"** in 1 and 9 versus its
> absence in 2 and 3 — a one-word cue that no description mentions and that I promoted to a decision
> rule unilaterally. Strip "back" and the distinction collapses entirely.

Round 1 also found a second hole, adjacent and separate: `jira-advance` excluded "a **set** of items
into a sprint" while `jira-plan` moves "a **set** of items", so a single work item between two
sprints fell through both fences — and `jira-plan`'s own last exclusion would have handed it to
`jira-advance` precisely for being single.

## Round 2: the fix held, and left a residue

Both sides now name the discriminator — a work item **already recorded** against something **nobody
has recorded yet** — and the intake sense is disclaimed with its destination named.

> "back" is no longer doing the work, and the recorded/unrecorded axis is. That is a real change
> from the round where "back" was all there was.

The case that had been low confidence came back at high. And the singular fence:

> Yes, and specifically because of "whether one or many". Without that phrase F collides head-on.

The residue was in the trigger's grammar rather than its test: `back` still governed both arms, so
_"put KAN-12 on the backlog"_ — a first placement rather than a return — routed only by negating an
exclusion. The word went.

## Round 3: nothing left in the blast radius

Ten requests, all high confidence, nothing unroutable.

> **B — Yes.** "already recorded" is the object qualifier and governs both destinations. The
> negation is off the critical path.

A removal with no destination at all — _"get KAN-40 out of Sprint 24"_ — is covered positively, and
is the request that proves the trigger became destination-symmetric rather than merely losing a
word. One anaphora was spelled out afterwards ("out of one" → "out of a sprint"), which was the last
thing a reader had to resolve.

The round also settled a question the second had raised. `jira-plan`'s exclusion sends an unrecorded
backlog placement to `jira-propose`, and reaching `jira-capture` looks like it needs a second step:

> I reached `jira-capture` in **one** step, from its own positive trigger. Its "What decides"
> sentence exists for nothing else, and it explicitly anticipates being reached through another
> intent's exclusion. The chain is designed, documented, and correct.

## What it cost

Three rounds, two defects, both introduced by this batch and both invisible to the automated seams.
The pattern from the previous batch held exactly: **the finding is always inside the previous
round's correction**, and it is always in the invented-criteria list rather than in the table — no
round produced a single wrong row.

## Left open, deliberately

- **`jira-advance` disclaims sprint moves and never mentions the backlog**, so _"put it back on the
  backlog"_ against its own trigger phrase _"put it back"_ is separated only by a reader knowing the
  backlog is not a status. Not closed here on purpose: some projects do name a status `Backlog`, and
  excluding the word would make `jira-advance` decline a transition it owns. It is the
  container-against-status question, and it belongs with the container issue rather than to a
  one-word patch.
- **Nothing says how to recognise a container from its name.** "Take PROJ-88 out of 2.4" routes only
  because the user added "it isn't shipping with that"; `jira-plan` and `jira-release` now carry
  near-isomorphic triggers separated by knowledge no description supplies. Filed.
- **"To Do" is a status only by outside knowledge**, and a first-hand wish with no datum is claimed
  by no clause — it lands on `jira-propose` by elimination. Both are the senses-against-synonyms
  family; recorded on that issue rather than opened again.
