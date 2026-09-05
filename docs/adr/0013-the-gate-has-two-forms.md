# The gate has two forms, because half the plugin approves a change and not a document

The draft gate is the plugin's central invariant: no write to Jira before the user has seen the
whole of what will be written and approved it. It was described for one case — assemble the
artifact in full, present it, state the decisions it carries, ask.

Four skills do not author anything. `jira-plan` fills and closes sprints, `jira-release` assigns
work to fix versions and takes it off again, `jira-advance` moves a work item to its next status.
Each of them writes, so each of them gates, and each had to decide for itself what to put in front
of the user — because "the exact content that will be written" is not a shape their write has, and
the block of decisions the shared reference lists is a list of authoring fields: title, work type,
parent, required-but-empty.

They improvised, and they improvised well and separately:

- `jira-plan`: "every item that will move, and every unrefined item among them"
- `jira-release`: "every item whose fix version will change, and the one it will change to"
- `jira-advance`: "the item, the status it is in, and the status it will reach"

Three good answers to a question no source asked. None of them is in the shared reference.

## How it surfaced

Closing a sprint is where the improvisation ran out. `jira-plan`'s block fits a **fill** — items
moving in, readiness flagged — and says nothing that applies to a **close**, where nothing moves in
and the interesting facts are what was delivered, what was not, and where the remainder goes. The
issue that found it observed that the shared reference lists only authoring fields, so the content
of the gate for a close was undefined and the documentation page could show only the fill.

The general form was visible from there: **a gate for an operation does not exist as a shape**, and
closing a sprint is the first case that shows it rather than a case of its own.

## The rule

**One gate, two forms, and the form is decided by what the write produces — never by which skill is
running.**

- **An artifact gate** shows the thing that will exist: the complete content of a work item,
  section by section. The authoring intents, and `jira-refine` when it splits.
- **An operation gate** shows the change that will reach things that already exist: which items,
  what changes about each, what will be true of them afterwards.

Same completeness, same explicit approval, same refusal to write anything approved in part. Only
step 1 and the block in step 3 differ.

### The bullet that earns the second form

The operation block carries one thing the artifact block has no reason to: **what the operation
will not do, where a user could reasonably expect it to.**

Closing a sprint cannot place the work left unfinished in it — `jira sprint close` takes a sprint
and nothing else, and moving work out of a sprint is a declared gap. So where those items land is
Jira's to decide. A user who approves a close without being told that has approved an outcome they
did not picture, and no amount of completeness about the _fields_ of the operation would have told
them.

That is the difference between the two shapes, stated once instead of four times: an artifact is
judged by what it contains, and an operation by what it will and will not do.

## The refusal branch, in the same file

The gate covered a change request and an approval, and not a refusal — the user saying no rather
than asking for something different. For most skills that is a small hole; for `jira-init` it is
not, because a refused profile is never written and every other skill in the plugin then stops at
its own first step and sends the user back to `jira-init`.

Refusal is now step 6, stated once: write nothing, say what holds instead, do not re-present the
draft unasked, do not offer a smaller version hoping that one passes, and **name what other skills
a refused write leaves waiting**. `jira-init` states its own instance, because it is the only skill
where a refusal is not local to the thing refused.

## Consequences

- **Every skill names its form at the gate**, the four that author as well as the four that
  operate. Naming only the unusual ones would leave a reader asking why this one is marked; naming
  both makes the rule decidable whichever skill is read first, which is what ADR-0006 established
  for the intake test.
- **`jira-refine` is an artifact gate even though it changes an existing item**, because the branch
  that matters creates children and they are presented in full before any of them exists. The form
  follows the write, not the skill.
- **Three improvised blocks become one described shape**, and they survive as what each intent
  _adds_ — which is the relation between a shared procedure and a skill that invariant 6 already
  describes. Nothing was taken away from a skill; what they were each inventing now has a name.
- **`jira-plan` gains an ordering it never stated**: destinations settled before the close, never
  after, because once the sprint is closed a destination named is a report rather than a decision.
  One gate covers both, since the close is the only write in it.
- **The documentation's process page said the gate "has one form across every skill that writes".**
  It was true when written and had been false since the first operation skill shipped.

## Considered alternatives

- **Let `jira-plan` state what a close shows, and leave the shared reference alone.** The smallest
  fix, and it closes the issue as filed. Rejected because it leaves three other skills improvising
  the same shape with nothing naming it — which is the condition that produced the issue, and which
  would produce the next one.
- **Widen the single block so it covers both.** One list, with the authoring fields marked "if any".
  Rejected: a block where half the lines are inapplicable on every use is a block readers learn to
  skim, and the operation form's most valuable line — what the operation will not do — has no
  meaning at all for an artifact.
- **Treat an operation gate as a confirmation rather than a gate.** Lighter, and closer to what a
  user might expect for a status change. Rejected because it would make the invariant conditional
  on how consequential the write looks, and the plugin has exactly one gate on purpose. A
  transition that cannot be reversed is not a smaller decision than a work item that can be edited.
