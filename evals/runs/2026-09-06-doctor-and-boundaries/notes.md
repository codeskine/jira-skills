# 2026-09-06 — the doctor and boundaries batch (#93, #96, #83, #86, #84, #82)

The isolated routing replay, run before merge because this branch changes five of the ten
descriptions and one run covers the batch rather than one per change.

**Descriptions cut from** `fix/doctor-probes-the-session`, whose base `7caadab` was still the tip of
`main` at the moment of the run — verified, so the set replayed is what a merge would ship.

**What was run:** the ten `description` fields pasted into a subagent's prompt, no repository access
and no tools, plus requests in a user's words built as matched pairs moving one variable at a time.
Reported back per request: the skill chosen, the confidence, the clause that decided it, and — the
part that matters — every criterion supplied because the descriptions did not give it.

**Five rounds, in two waves.** Rounds 1 to 3 ran the same twelve requests in parallel: what is wanted
from an uncorrected set is whether readers who cannot see each other invent the same criteria. They
did, three times over, which is what makes their findings worth acting on. Rounds 4 and 5 each
followed a correction those findings forced, and exist to show the correction landed.

**Not run here:** `selection` and `handover`, one fixture per fresh session. Eleven fixtures were
added or rewritten by this batch and none has been run. That is #80 and this does not close it.

## Verdict

**Eleven of twelve unanimous in the first wave. Five findings, all closed on this branch.** Three
came from the first wave, two more from the round that confirmed the first three.

| Finding                                                                            | Origin  | Closed by                                      |
| ---------------------------------------------------------------------------------- | ------- | ---------------------------------------------- |
| The intake floor lost the negative half #81 identified as load-bearing             | 1, 2, 3 | restored in `jira-diagnose`; round 4 confirms  |
| A cross-container request is claimed by no clause                                  | 1, 2, 3 | `jira-inspect` claims it; round 5 confirms     |
| `jira-capture`'s decisive clause cannot be executed by a single-description router | 1, 2, 3 | made self-contained; round 5 confirms          |
| The handover is asserted but not specified                                         | 5       | the owning skill is entered, not merely named  |
| Two phrasings of the same floor, one readable as stricter                          | 5       | `jira-capture` echoes `jira-propose`'s wording |

The first three were introduced or left standing by this branch. The last two were introduced by the
fixes for the middle two, which is the ordinary cost of a correction and the reason round 5 existed.

## Wave one — the twelve requests

| #   | Request                                   | R1       | R2         | R3       | Confidence |
| --- | ----------------------------------------- | -------- | ---------- | -------- | ---------- |
| 1   | relayed fault, env named, no steps        | capture  | capture    | capture  | high ×3    |
| 2   | relayed fault, steps present              | diagnose | diagnose   | diagnose | high ×3    |
| 3   | relayed fault, bare error token, no steps | diagnose | diagnose   | diagnose | medium ×3  |
| 4   | first-hand fault, no steps                | diagnose | diagnose   | diagnose | high ×3    |
| 5   | which fix versions does this project have | release  | release    | release  | high ×3    |
| 6   | what is in 4.10 and what of it is open    | inspect  | inspect    | inspect  | high ×3    |
| 7   | how is my Jira project set up             | init     | init       | init     | high ×3    |
| 8   | fix version read, sprint write            | plan     | plan       | plan     | medium ×3  |
| 9   | fix version read, same fix version write  | release  | release    | release  | med/high   |
| 10  | sprint read, fix version write            | release  | release    | release  | medium ×3  |
| 11  | `take PROJ-88 out of 2.4`                 | release  | release    | release  | low/medium |
| 12  | `take PROJ-14 off the board entirely`     | plan     | UNROUTABLE | plan     | low ×3     |

**Requests 11 and 12 came back undecided, and that is the correct result rather than a defect.** #86
was fixed inside the skills, not in a description: the profile knows whether `2.4` is a sprint or a
fix version, and no skill reads the profile until after routing has chosen it. A replay routing them
confidently would mean a description had acquired knowledge it cannot have. All three rounds said so
unprompted — round 3 called its own answer "pure world knowledge", round 1 "the weakest routing in
the set".

## Finding 1 — the intake floor lost its negative half. This branch did that.

The wording before this branch ended `steps or a verbatim error clear that floor, **naming the
product or where it ran does not**`. The rewrite for #83 kept the positive half and dropped the
negative one. All three rounds reached the right answer for request 1 **by inference** and each
flagged the inference as their own:

> I inferred exhaustiveness from a two-item list. **This is the invented step**, and the other
> wording I recall supplies it explicitly — which is evidence the pasted version leaves a hole. —
> round 2

That is precisely what #81 records as the strong half: _"no other description in the plugin names a
class of **non**-evidence, and it is what makes the relayed-fault cases route."_ Rewriting the floor
from a refusal into a statement of behaviour was right, per #83; dropping the negative half while
doing it was not, and neither automated seam could have noticed.

**Closed.** The clause is back, inside the new sentence rather than alongside it — the behaviour
statement and the non-evidence clause are independent. Restoring it went 41 characters over the
1,000 limit, so two phrases elsewhere were tightened instead of the clause being trimmed.

**Round 4 is the positive case.** Request 1 came back `jira-capture` at high confidence, quoting the
restored half as the decider and observing that the request "supplies exactly the two things the
disqualifier names as insufficient — the product and where it ran — and nothing else". Rounds 1 to 3
reached the same destination by deciding for themselves that a two-item list was closed. That is the
difference the clause exists to make.

**What it does not close.** Round 4 still lists as supplied whether the two _clearers_ are themselves
exhaustive. That is the positive half of the floor, which #81 already records as having no threshold.
Restoring the negative half was never going to reach it. Still open, still #81.

## Finding 2 — a cross-container request was claimed by no clause

All three rounds invented the same rule, unprompted, and all three named it as invented: _the write
decides the route_. #82 made the anaphora explicit, so neither one-operation clause fires on a cross.
Round 2 stated the consequence:

> the pasted wording is precise; the looser wording I recall ("changes it") would have made both
> requests over-claimed rather than unclaimed, **which is a different failure, not a fix**.

That was a fair criticism of #82 and it is now acted on rather than recorded. The gap was handled
after a skill fired — `draft-gate.md` names the cross case, `hand-5` and `hand-6` assert it — but
nothing said which skill should fire.

**Closed by a positive claim in the right place.** The shared contract already orders a read before
the write it conditions, so the owner of the **read** is the entry point, and that is `jira-inspect`
in both directions. Its description now says so, which also removes the elimination that had been
ruling it out: rounds 1 and 3 both discarded `jira-inspect` because it "never writes anything", which
under the handover contract it does not need to.

**Round 5 confirms it, and confirms the elimination is gone:**

> Single-description router: **yes on the pasted text**, no on the other wording I was given, which
> lacks the clause entirely and would leave inspect and plan both half-matching.

**It also caught a fixture this branch had wrong.** `hand-5` asserted `[jira-release, jira-plan]` for
_"What's in 1.0 so far? Anything not started, take it out of the current sprint."_ — but reading what
a fix version holds is a read `jira-release` explicitly disclaims and `jira-inspect` claims. Its own
mirror `hand-6` already had `jira-inspect` first. Corrected to `[jira-inspect, jira-plan]`, which is
what round 5 routed independently.

**Residual, recorded and not acted on.** Round 5 put request 7 at low-medium confidence:

> a router seeing only that clause might over-read "reads and then changes" without noticing that the
> container read here is a _sprint_. The word "same" is doing load-bearing work in a clause most
> readers will skim.

There is no wording that removes that risk without weakening the same-container clause, which is the
one #82 exists to sharpen. It is a live hazard rather than a defect, and `hand-6` is the fixture that
would catch it.

## Finding 3 — `jira-capture`'s decisive clause could not be executed by the router

All three rounds raised it unprompted. The clause read `at the floor that intent names in its own
description`, which delegates the decision to a different description's text — so a router matching
one description at a time cannot evaluate it. Round 2:

> `jira-capture`'s floor sentence is therefore doing no routing work at all under the stated router
> model. It is the one clause in the ten that is written for a reader with all ten in front of them.

This is #83's disease in the one place #83 did not reach, and it was pre-existing rather than
introduced.

**Closed by making the clause self-contained.** It now names the test in its own terms — steps or an
error for a fault, a count of the symptom for an outcome, what deferring costs for a debt — instead
of pointing at where the test lives. That restates three floors in one compressed clause, which is
duplication; it is admitted here because the alternative is a sentence that cannot be executed.

**Round 5 confirms it, and reports the pair now works from both sides:**

> Single-description router: **yes, from either side.** `jira-capture` states the test and its
> "however plainly it is about a fault" override; `jira-diagnose` states the same floor and hands
> over. **The pair is symmetric, which is what makes it robust.**

## Findings 4 and 5 — introduced by the fixes above, and closed

**The handover was asserted but not specified.** The new `jira-inspect` clause said the owning skill
"is named with the answer", and round 5 pointed out that naming it in prose and entering it are
different outcomes, with the text not saying which. `draft-gate.md` says enter it. The clause now
says the same: the skill that owns the change **is entered for it afterwards, with a gate of its
own**.

**Two phrasings of one floor.** Making `jira-capture` self-contained introduced "a count for an
outcome" beside `jira-propose`'s "a count of the symptom clears that floor". Round 5:

> the two are phrased differently enough that a router could take the capture wording as the stricter
> one. Item 3 is the request I would expect to see mis-route most often in a real run.

`jira-capture` now echoes `jira-propose`'s wording rather than paraphrasing it. `jira-propose` owns
that floor; capture points at it in the same words.

## What the batch's own changes bought, confirmed

- **#96.** Round 5 on _"which fix versions does this project have?"_: _"This is the one request in
  the seven where I needed nothing the descriptions do not state."_ The added enumeration is what
  makes it clean.
- **#84.** The `jira-init` ↔ `jira-release` tie is still unguarded at the description level and every
  round invented a tiebreak for it. That is the expected outcome — #84 was fixed inside `jira-init`
  and no description changed. It is now harmless rather than absent: whichever of the two fires, the
  answer is right, because `jira-init` establishes the size of the question before sweeping. Recorded
  so nobody re-files it.
- **#86.** Confirmed by requests 11 and 12 coming back undecided, above.

## What this run cannot say

- **Four skills were never exercised** in wave one: `jira-propose`, `jira-assess`, `jira-refine`,
  `jira-advance`. Round 5 added a `jira-propose` case, which routed correctly. `jira-advance` appears
  only as an exclusion, so the set tests its boundary and never its trigger.
- **The isolation is not total.** Every round disclosed, unprompted, that its context carried the
  installed plugin's older wording, and each named which clauses differed and where it would have
  mattered. That is the best available evidence they routed from the pasted text; it is also why this
  seam can never be more than one of two.
- **This says whether the words decide. It does not say whether the live mechanism uses them.** The
  behavioural run of 2026-09-06 is standing evidence that the two disagree — an exclusion three
  replay rounds applied correctly was disregarded at both ends of its pair, which is #83 and the
  reason half this batch exists.

## Two gaps found and deliberately not closed

Both are adjacent to #81 rather than to anything this batch changed, neither is exercised by any
fixture, and closing either means deciding something nobody has decided. Filed rather than invented:

- **There is no first-hand floor, and nothing says so.** Requests 1 and 4 carry the same evidence — a
  symptom, no steps, no error — and differ only in who saw it, and they route to different skills.
  That is the floor working as designed. But nothing states what happens to a first-hand report
  thinner than request 4 (_"it's broken, file it"_), nor whether `jira-capture` can ever take a
  speaker who is present.
- **Mixed provenance arbitrates nowhere.** _"A user who watched half of it and was told the rest fits
  both triggers, and nothing arbitrates."_

## One round's claim that does not hold

Round 3 reported that `jira-release` carries no redirect to `jira-plan`. It does — "for planning a
sprint (→ See codeskine/jira-skills@jira-plan)". What can be argued is whether taking a work item
**out of** a sprint reads as "planning a sprint"; if it does not, the asymmetry round 3 describes is
real in substance even though the redirect is present. Neither other round raised it. Recorded as one
reader's reading, and nothing was changed on the strength of it.

## Round 2's observation on what a fixture can claim

> By its own account, `jira-diagnose` firing on request 1 is a correct outcome — it detects intake and
> hands over. Meanwhile `jira-capture` says such material "belongs here first". Both end in the same
> place; only the entry point differs. So for request 1 there may be no wrong answer, which makes any
> evaluation that scores it as capture-or-fail measuring something the descriptions do not claim.

Independent confirmation of the fixture change made for #83: `sel-capture-3` and `sel-capture-6`
stopped asserting which skill fires and now assert the outcome. A round with no knowledge of that
change reached the same conclusion from the wording alone.

Round 4 reached the same place from the other side and named the mechanism, which is the part worth
keeping:

> the clause was added to describe runtime behaviour and took on a routing meaning it may not have
> wanted.

A sentence written to describe what a skill does at runtime acquires a routing meaning when it sits
in a description, because a description is the only thing the router reads. Anyone writing the next
one should expect that.
