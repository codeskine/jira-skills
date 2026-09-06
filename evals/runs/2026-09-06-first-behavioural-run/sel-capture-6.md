# `sel-capture-6` — the floor does not hold in the live mechanism

**Fixture:** `sel-capture-6` (`selection`). **Model:** `claude-sonnet-5`.
**Prompt, verbatim:** _"A customer emailed: invoicing has been mangling the CSV for a fortnight.
They're on 4.9, in the production tenant. Put it on Jira."_
**Expected:** `jira-capture`. **Forbidden:** `jira-diagnose`. **Fired:** `jira-doctor` →
**`jira-diagnose`**.

No substitution — this prompt names no Jira entity, so it ran exactly as written.

## Why this one matters more than a wrong row

This is the fixture that failed round 1 of the isolated routing replay and passed after the floor
was rewritten (`evals/runs/2026-09-05-routing-boundaries/sel-capture-6.md`). The wording has been
sharpened once more since, and now answers this case by name:

> for a fault relayed second-hand that carries nothing anyone could act on to see it happen —
> **steps or a verbatim error clear that floor, naming the product or where it ran does not**

The prompt names a product (`4.9`) and where it ran (`the production tenant`), and carries no steps
and no error text. The second clause disposes of it in so many words. `jira-diagnose` fired anyway.

So the wording is not the defect. **Three wordings have now been tried** — a negative enumeration,
an inverted list naming what a failing case carries, and this positive statement of what clears the
floor — and the third is about as explicit as prose can be made. A fourth is not worth writing.

## What the two seams disagree about

The isolated replay reads ten `description` fields side by side and weighs them against each other,
so it applies an exclusion. The live mechanism matches a request against descriptions, and an
exclusion inside the description of the skill being excluded is not what decides.

The previous run had already filed this, under _left open, deliberately_:

> **Nothing states that an exclusion outranks a trigger.** Every round applied it, every round
> listed it as invented, and round 2 counted five of twelve routings resting on it entirely.

That was an inference from a replay reporting its own invented criteria. This run is the
demonstration: an exclusion written as plainly as it can be, disregarded by the mechanism that
ships. Whatever fixes this is structural — it is not another sentence in `jira-diagnose`.

## The tell is in what happened next

Having chosen `jira-diagnose`, the run asked the user for the material the floor says is absent:

> 1. **Steps to reproduce** — what exactly is "invoicing" here … and what does "mangling" look like?
> 2. **Expected vs. actual** … 3. **Evidence** — do you have the customer's email verbatim …

That is the behaviour ADR-0010 exists to prevent: the relayed request is not recorded as it arrived
and refined later, it is held at the door until someone reconstructs a reproduction that the person
relaying it does not have. `jira-capture` exists for exactly this and was not reached.

## Its pair

`sel-capture-3` failed identically — see its file. `sel-diagnose-4`, the same fault relayed but
arriving **with** steps, environment and actual result, routed to `jira-diagnose` correctly. So the
mechanism distinguishes a complete report from an incomplete one in the direction that costs it
nothing, and not in the direction the floor is for.

---

**Filed:** demonstrated on #83, which had already named the cause from replay evidence alone.
No separate issue — a second one would restate it.
