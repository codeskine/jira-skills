# Assess is bounded by who pays, and the intake test names no intents

`jira-assess` is drawn on **technical** debt: something that works today and will cost **the
team** later. Two neighbouring descriptions treated it as the destination for a wider category
than that, in two different ways. The symptoms look unrelated and have one cause.

## Something that works badly is not automatically debt

`jira-diagnose` refused one class of request by name — "not for something that merely works badly
and should be improved (→ `jira-assess`)" — and `jira-assess` did not take it. Its trigger is the
shortcut, the stale dependency, the design that no longer fits; it asks what deferring it costs
the team and what the technical impact is, so that it can be ranked against feature work.

A screen that confuses the people using it works badly and should be improved. It has no
technical impact to state, no options to rank, and nothing is being deferred: the cost falls on
its users now, not on the team later. It matched the words `jira-diagnose` used to push it away
and none of the words `jira-assess` used to take it in.

The defect was one-sided. `jira-assess` already declined the case — "not for proposing an outcome
for users (→ `jira-propose`)" — and `jira-propose` already asks the three questions it needs:
what outcome, who benefits and how they suffer today, how we will know it worked. Only
`jira-diagnose`'s pointer was wrong, and it had been since it was written.

**The decision: `jira-assess` stays on the cost to the team, and `jira-diagnose`'s exclusions are
rewritten on the discriminant that actually separates them — who pays, and when.** What works and
will cost the team later goes to `jira-assess`; what works and serves its users poorly today goes
to `jira-propose`. "Works badly" names neither and was the whole trouble.

Widening `jira-assess` instead would have been a different product, not a different wording. It
settles debt against defect before it asks anything, its three questions are the toll, the options
and the technical impact, and what it fills is a debt record. Asked about a confusing screen, all
three questions come back empty and the artifact records an opinion in the shape of a decision.

## The intake test stops enumerating

ADR-0006 gave the intake contest an affirmative rule, stated once in `jira-capture`: what decides
is whether material relayed second-hand carries what a defect report or a value proposal asks for.
It named two of the three authoring intents. That ADR justified the omission — "deliberate debt is
not a shape in which a third party's request arrives" — and the justification is wrong.

Take _"the architect mentioned in standup that the retry logic round the gateway is a mess, log it
before I forget"_. It is second-hand, it is ordinary, and it is debt. It matches `jira-capture` on
its own terms and `jira-assess` squarely, and nothing separated them: no exclusion ran in either
direction, and the rule did not reach the case because debt is neither a defect report nor a value
proposal. Choosing a two-name list made the silence about the third axis load-bearing where before
it was merely absent.

**The decision: the test drops the list. What decides is whether material relayed second-hand
carries what _the intent it is about_ asks for.** Naming a third intent would rebuild the same
trap one axis further out — the list would then be exhaustive by construction, and the next axis
would inherit the silence. Removing the list removes the trap, and it costs nothing: the
description got shorter.

The test stays decidable from the text of the request alone, which is the constraint ADR-0006
imposed on it. Every description already states what its intent asks for — `jira-diagnose` the
steps, the expected and the actual result, the environment; `jira-propose` the value, the
beneficiary and the measure; `jira-assess` what deferring it costs, the options and the technical
impact. A reader deciding the case has them all at selection time, which is the only moment that
matters.

`jira-assess` names its own **floor**, as ADR-0006 required of `jira-diagnose`: debt relayed with
nothing to say what deferring it costs belongs to intake. The floor is the toll alone, not all
three questions. Options and technical impact can be worked out afterwards by whoever picks the
item up; the toll — whose time, how often — is the one thing a relayer either carries or does not,
and it is what the standup remark above is missing.

## What the replay changed

The isolated routing replay — an agent given only the ten descriptions, no repository access and
no tools — routed all ten requests as intended, and both new clauses were the ones that decided
the two cases this ADR exists for. The report worth having was the other one: what the reader had
to invent in order to answer at all. Two of its findings were defects in the wording above, and
both are fixed here.

**`jira-capture`'s trigger and its rule were on different axes.** The trigger admitted a request
that "arrives from outside the team"; the rule decides on "material relayed second-hand". A remark
made by your own architect in your own standup is second-hand and is not from outside the team, so
the case this ADR routes to intake was pushed there by `jira-assess` and not admitted by
`jira-capture`'s own opening sentence. **The trigger now reads "arrives second-hand".** ADR-0006
had already argued this and stopped short of it: whether a boss or an ops lead counts as outside
is a judgement about an organisation the request text does not contain, and only what the words
show can be routed on. Applying that to the trigger is finishing the job, not reopening it.

**The rule asked for more than any exclusion does.** Every intent asks three or four things and
excludes on a floor of one or two — `jira-diagnose` asks four and excludes on steps and
environment, `jira-propose` asks three and excludes on the datum, `jira-assess` asks three and
excludes on the toll. Read literally, "carries what the intent it is about asks for" demanded all
of them, and material that cleared the specialist's own door was still claimed by intake. The
reader had to invent the weighting by going and reading the specialist's exclusion. **The rule now
says so: "at the floor that intent names in its own exclusion".** ADR-0006 recorded the floor as a
consequence — "It is a floor, not a measure of completeness" — and no description said it. Making
the rule point at the floor is what stops the two doors being different doors.

Three further findings are real, predate this change and are out of its scope: whether a bare
application name counts as an environment in `jira-diagnose`'s exclusion; that no description
claims the word "backlog", which appears in requests as a placement instruction; and that
`jira-propose` asks for "the datum" without distinguishing a symptom count from a target. They are
tracked separately.

## Consequences

- `jira-assess` is unchanged as a product. Its persona, its questions, its template and its
  quality criteria stay exactly as they were. What changed is which material reaches it.
- `jira-diagnose`'s new exclusion toward `jira-propose` absorbs the one it used to carry — "for
  proposing an outcome". That clause guarded a case its own trigger already excluded, since
  nothing is reported as failing; naming degradation that costs users spends the same characters
  on the case that was actually being lost.
- **No `jira-capture` → `jira-assess` clause is added**, and this is a choice rather than an
  omission. The case is decidable from either door already: a reader who matches `jira-capture`
  first finds the rule, and one who matches `jira-assess` first finds the floor. A fourth negative
  pointer would buy no decidability and would spend startup budget on the longest description in
  the plugin. It is also the pattern ADR-0006 established — the test is named on the specialist's
  side, and the rule is stated once on intake's.
- ADR-0006 is amended on exactly one point: `jira-assess` is no longer untouched. Everything else
  it settled stands, including that precedence changes which skill fires and never the quality bar
  of what it writes.
- A second description now carries a clause toward intake. That is not a second precedence rule:
  there is still one rule, in one place, and `jira-assess` names the same test `jira-diagnose` and
  `jira-propose` already name.
- `evals/evals.json` gains three `selection` fixtures, in the matched pairs ADR-0006 requires.
  `sel-propose-5` moves one variable against `sel-assess-1` — the same "it works, but" complaint,
  costing users now instead of the team later. `sel-capture-5` and `sel-assess-3` are the standup
  remark twice, relayed both times, once as an adjective and once carrying its toll; provenance is
  held fixed so that the toll is demonstrably what routed.

## Considered alternatives

- **Widen `jira-assess` to cover everything that works badly.** One skill for "works but should be
  improved", whoever pays. Rejected: it would have to stop asking for the technical impact and stop
  ranking against feature work, which is what it exists to do, and it would leave `jira-propose`
  with no boundary on its other side. The issue that raised this said it plainly — these are
  different products, not different wordings.
- **Name the third intent in the precedence rule.** "What a defect report, a value proposal or a
  record of debt asks for". Explicit, nothing to deduce. Rejected for the reason the list is being
  removed: an enumeration that is exhaustive by construction makes every future axis a silent
  omission, and this ADR exists because the last one had two names in it.
- **Leave relayed debt to `jira-capture`'s opening trigger.** A note taken during a call is intake
  by provenance, and debt is nearly always raised first-hand by someone on the team. Rejected
  because it decides the easy half and leaves the contested half contested: the same remark
  carrying its toll would still match both descriptions, and the isolated routing replay stalls on
  exactly that.
