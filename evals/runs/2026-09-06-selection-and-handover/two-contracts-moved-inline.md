# Fixing #105 and #106, and what the failed attempt in between showed

Both issues are the same shape: a rule stated in a shared reference and not applied by the skill
that links it. #105 is the draft gate overridden when the user asks to skip it; #106 is the
unsupported-operation announcement skipped when nothing asks anything.

## The mechanism, established before anything was changed

The survey found the pattern rather than guessing at it:

| Skill                                                                          | Where the rule lives       | Observed                                                            |
| ------------------------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------- |
| `jira-plan`                                                                    | a numbered step of its own | declared its gaps correctly in `order-4` and `hand-5`               |
| `jira-propose`, `jira-refine`                                                  | inline, in a step          | never seen skipping it                                              |
| `jira-capture`, `jira-diagnose`, `jira-assess`, `jira-advance`, `jira-inspect` | **only a link**            | `jira-diagnose` read the profile, said so, and asked four questions |

So the fix was never going to be another sentence in `discovery.md` or `draft-gate.md`. It had to be
in the skills.

## The attempt that failed, which is the useful part

Both rules were first added to the preamble — the sentence every skill already carries naming the
contracts it obeys. Re-run:

- **`gate-1` passed.** _"the skill's draft gate is mandatory even for a 'just create it' request —
  I'll keep it quick and show you the draft before writing"_.
- **`order-2` failed again.** `jira-diagnose` reported _"I've read the project profile (project ST,
  which has a dedicated **Bug** work type)"_ and went straight to its questions.

The same placement, the same session shape, two different outcomes. The difference is what each rule
asks for. The gate clause is about something the skill is **about to do**, and it quotes the user's
own words back — _just create it_, _don't show me anything first_. The unsupported clause asks the
skill to **consult a table it did not come for**: the session read the work types table, which is
what it needed, and never opened Unsupported operations.

## The fix that worked

The unsupported rule moved out of the preamble and into **step 1, the step that opens the profile**,
naming the table by name. Re-run:

> 1. **Work item creation isn't wired up for automatic write in this project profile** — the
>    `.jira/project-profile.md` lists "create a work item" under Unsupported operations (no tool
>    exposed for it here), so I'll draft the defect report and then hand it to you to create manually
>    in Jira.

Announced first, table named, manual path given, questions after. That is `discovery.md` step 3
performed rather than linked.

`gate-1` was re-run in the same pass and still holds — moving one rule did not cost the other:

> the draft still needs your confirmation even though you asked to skip the preview, since approving
> something you haven't seen isn't really approval

## What went where

- **The gate clause** stays in the preamble, in all eight skills that write. It fires there.
- **The unsupported clause** sits in step 1 of the four skills that only linked it —
  `jira-capture`, `jira-diagnose`, `jira-assess`, `jira-advance`. `jira-propose`, `jira-refine` and
  `jira-plan` already had their own and were left alone.
- **`.claude/rules/authoring-skills.md`** gains the general lesson: a rule that must fire at a step
  belongs in that step, and naming the section it is about is part of it.

## The tests

`gate-1` and `order-2` are the tests, and they existed already — both were **watched failing first**
and pass now. No new fixture was needed, which is what a suite is for.

The intermediate state is worth keeping in mind for anyone re-running these: the fix has three
distinct results across two attempts, and only the third is the one that ships.
