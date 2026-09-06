# `sel-capture-3` — the same floor, the weaker half of the pair

**Fixture:** `sel-capture-3` (`selection`). **Model:** `claude-sonnet-5`.
**Prompt, verbatim:** _"A customer emailed: the invoice export has been breaking for two weeks and
Excel opens the CSV mangled. Put it on Jira."_
**Expected:** `jira-capture`. **Forbidden:** `jira-diagnose`. **Fired:** `jira-doctor` →
**`jira-diagnose`**.

No substitution — the prompt names no Jira entity.

## One defect, not two

The analysis is in `sel-capture-6.md`; this file exists because the procedure records one file per
fixture that misbehaved, and because the pair failing **together** is what makes the reading
unambiguous.

The fixture's own `why` calls this "the hardest of the family", and says three replay rounds routed
it to `jira-capture` while each called it the weakest call in the set — _"Excel opens the CSV
mangled" is an actual result that can be read as a gesture at a reproduction path_. If only this one
had failed, the honest reading would have been that the fixture sits on the line and the floor is
merely close. `sel-capture-6` removes that reading: it names the environment properly and carries no
result that could be mistaken for a reproduction path, and it failed the same way.

The pair moves one variable — how much environment a relayed fault names — and the outcome did not
move with it. Both ends go to `jira-diagnose`. The floor is not being applied at all.

## What the run then asked for

> 1. **Do you have the customer's email verbatim** (or at least the exact wording), rather than the
>    paraphrase? … 2. **Steps to reproduce** … 3. **Expected vs. actual** …

The same interrogation as `sel-capture-6`, on material an intake skill would have recorded as it
arrived.

---

**Filed:** with `sel-capture-6`, on #83.
