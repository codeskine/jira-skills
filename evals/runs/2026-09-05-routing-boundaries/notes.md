# 2026-09-05 — the routing-boundaries batch (#72, #77, #79)

The isolated routing replay, run before merge because all three issues in this batch change
descriptions and the triage on #77 asks for one run covering the batch rather than one per change.

**What was run:** the `description` fields pasted into a subagent's prompt, no repository access and
no tools, plus requests in a user's words built as matched pairs that move one variable at a time.
Reported back: the skill chosen, the confidence, the clause that decided it, and — the part that
matters — every request where a criterion had to be supplied that the descriptions did not give.

**Not run here:** the `selection` and `handover` categories, which `evals/README.md` prescribes one
fixture per fresh session. Those remain deferred to #80, unchanged by this.

## The isolation is not total, and every round said so unprompted

The installed plugin carries the pre-change descriptions, so the agent has the old wording in view
alongside the pasted set. Every round reported the discrepancy without being asked and named the
specific clauses — the best evidence available that it routed from the pasted text, and also why
this method can never be more than one of two seams. `selection` exercises the real triggering
mechanism; this one only asks whether the words decide.

## Round by round

| Round | Scope                        | Outcome                                                                                        |
| ----- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| 1     | 12 requests, all ten skills  | **One wrong.** `sel-capture-6` fired `jira-diagnose`; the floor read disjunctively.            |
| 2     | 12 requests, all ten skills  | All as decided. Two residues: a ceiling that can be exceeded, a low-confidence catalogue read. |
| 3     | 14 requests, all ten skills  | All as decided, confidence up. One request found **unroutable**.                               |
| 4     | 9 requests, fix-version axis | All as decided. A **hole**: the release state of one named fix version was claimed by nobody.  |
| 5     | 9 requests, lifecycle seam   | Hole closed, confirmed in both directions. Two ambiguous words still unroutable.               |
| 6     | 11 requests, the named axis  | No regression; two requests moved from synonym-matching to category-matching.                  |

**Round 1** caught the only outright routing failure, and caught it in the invented-criteria list
rather than in the table: eleven of twelve were right, and the wrong one arrived with the sentence
explaining why. See `sel-capture-6.md`.

**Round 2** confirmed the corrected floor and reported it had reached the right answer by ranking
steps above environment — a rule it invented, because "at most a product or a version" reads as a
ceiling and a request naming a version _and_ a tenant exceeds it. The floor was restated in the
positive, on the model of `jira-propose`'s, which every round routed at high confidence and quoted
verbatim as the decider.

**Round 3** probed the rewritten clause with a relayed fault carrying a verbatim error and no steps,
and one carrying four environment facts and no steps. Both routed as intended. It also found a
request it could not route: _"what's the state of 4.10?"_, claimed by `jira-release`'s trigger and
disclaimed by its exclusion at once, because "the state of each" and "what of it is unfinished" are
a hair apart in ordinary English.

**Round 4** showed the repair had moved the problem rather than solved it. Binding the lifecycle
claim to a **list** left the release state of one named version claimed by no clause on either side:
_"has 4.10 shipped yet?"_ routed only by generalising plural to singular. It specified the fix —
a singular lifecycle trigger on `jira-release`, and the reciprocal disclaimer on `jira-inspect`.

**Round 5** confirmed that fix: _"G and J, which the old pair could not route, now route from the
text in both directions. That is a real fix, and the reciprocity is what makes it one."_ It located
what remained precisely — _"the gap moved from scope to synonymy"_ — and proposed naming the axis
rather than adding more instances.

**Round 6** tested the named axis. It converts two requests from routable-only-by-domain-synonym to
routable-by-category, is inert for six, and rescues none of the three whose words sit on neither
side: _"adding a category name above a list does not add a member to the list."_ No regression, and
it confirmed the qualifier "read without changing anything" still does its job.

## What the six rounds cost, and what they bought

Every round found something, and each finding was inside the previous round's correction. Three were
defects this branch introduced; none would have been caught by the automated seams, which assert
that a description is well formed and never that it routes.

Two patterns worth carrying forward:

- **Confidence in a wording is not evidence about it.** Each wording was written deliberately,
  reviewed, and wrong in a way visible only once a reader with no other context had tried to use it.
- **The report that matters is the invented-criteria list, not the table.** Round 1's failure was one
  row in a table of twelve; what made it actionable was the sentence saying which rule had been
  supplied to get there. Rounds 2 through 5 produced no wrong rows at all and still found four
  defects.

## Where to stop

Round 6 was the last by decision, not because the list was empty. The replay reports everything it
had to supply, and that list never reaches zero — round 6's includes "I assumed PROJ-88 is a work
item" and "the confidence scale is mine". The stopping rule used here: **every decision this batch
made routes as decided, and no request inside the batch's blast radius is unroutable for a reason
more wording could fix.** What is left is filed.

## Left open, deliberately

Named by the replay, outside what #72, #77 and #79 decided, and filed rather than fixed here:

- **No threshold on the minimum that counts as steps or as a verbatim error**, and the same shape on
  the fix-version axis, where "state", "done" and "up to" match neither named sense. The descriptions
  name senses; users speak in synonyms.
- **A request that reads one container and changes another.** `jira-plan` and `jira-release` carry
  the identical read-then-change formula — symmetric within a domain, jointly silent across domains.
  Every round broke it with an invented rule, "the write decides". Round 6 also found the formula
  unbounded on the read side: a trailing imperative drags the reading skill's territory across the
  boundary.
- **Nothing states that an exclusion outranks a trigger.** Every round applied it, every round listed
  it as invented, and round 2 counted five of twelve routings resting on it entirely.
- **`jira-init` against `jira-release` on "which fix versions does this project have?"** Both claim
  it and neither disclaims the other. Rounds 3 to 6 all broke it on specificity, which is a rule none
  of the descriptions carries.
