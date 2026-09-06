# `jira-refine` — make a work item ready, or break it down

<!-- skill-header:start -->

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Name**              | `jira-refine`                                                                          |
| **Version**           | 1.0.0                                                                                  |
| **Invocable by name** | yes                                                                                    |
| **Channel**           | Atlassian MCP server                                                                   |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## What it does

Takes a work item that already exists and makes it something a team can pick up. That means three
things: acceptance criteria stated as outcomes someone could check, dependencies recorded as links
to the work items concerned, and a boundary saying what was deliberately left out. When the item is
too large to finish, it breaks it into children instead — each one complete on its own.

It is a Business Analyst's set of questions. "Done" agreed before the work starts is the cheapest
agreement anyone will ever make, and the only one that can still be made honestly.

It is also the skill that closes what intake opens. [`jira-capture`](jira-capture.md) is allowed
to record something incomplete only because this intent exists to discharge it.

## When it fires · when it does not

It fires when something already recorded has to become workable — or has to become smaller.

| Say something like                                | And this is the skill you get     |
| ------------------------------------------------- | --------------------------------- |
| "let's agree what done means on PROJ-421"         | `jira-refine`                     |
| "this is far too big, break it up"                | `jira-refine`                     |
| "finance sent this over, nobody has looked at it" | [`jira-capture`](jira-capture.md) |
| "put these four in the next sprint"               | [`jira-plan`](jira-plan.md)       |
| "move PROJ-14 to review"                          | [`jira-advance`](jira-advance.md) |

Two boundaries do the work here. Upstream, [`jira-capture`](jira-capture.md) owns a request nobody
has examined yet; `jira-refine` starts from a work item that already exists, and what capture
leaves behind — the original wording, plus a list of what the request does not answer — is exactly
what this skill picks up. Downstream, [`jira-plan`](jira-plan.md) decides when work is tackled;
refining is what makes that decision possible, and `jira-plan` flags an item that has not had it.

## How to use it

Name the item and say you want it ready. You do not need to name the skill.

**1 · It reads the project profile first.** `.jira/project-profile.md` tells it how your project
is configured; if the file is missing it stops and tells you to run `jira-init`. This intent leans
on two things in the profile in particular — setting a parent, and the hierarchy it records — and
if either is unsupported the skill says so before it asks you anything, rather than discovering it
at the write. See [the development process](../development-process.md).

**2 · It reads the item as it stands, and shows you.** An item that came in through intake carries
the wording it arrived in and a list of what it does not answer. That list is where refinement
starts, and it is the reason intake was allowed to produce something incomplete in the first
place. The original wording is never discarded while enriching: what was asked and what was agreed
are two different facts, and losing the first makes the second unarguable.

**3 · It asks three questions.** When is this done — the acceptance criteria, as observable
outcomes rather than steps or a design. What does this depend on — recorded as **Jira issue
links** between the items concerned, not as a sentence and not as a URL pasted into the text. Jira
owns the relation, so anything else is a copy of it that nothing can query: `jira-inspect` reports
what is blocked by reading real links, and finds nothing a description holds. The link type comes
from the ones your project defines — `Blocks` is not assumed to exist. What is
deliberately not included — the boundary is part of the agreement.

**4 · Then it asks whether the item can be finished in your planning horizon.** This is the fork,
and it is the only decision that changes what happens next. If the item fits, the skill enriches
it in place and goes to the gate. If it does not, it proposes a split in which each child is
complete.

**5 · In a split, each child is built from the template of the intent it serves.** Not from a
generic stub: the skill recognises what each child actually is, and fills that intent's own
template, so nobody has to rewrite one afterwards.

| The child is | Built from the template of          |
| ------------ | ----------------------------------- |
| a defect     | [`jira-diagnose`](jira-diagnose.md) |
| debt or risk | [`jira-assess`](jira-assess.md)     |
| value sought | [`jira-propose`](jira-propose.md)   |
| still raw    | [`jira-capture`](jira-capture.md)   |

A child that only makes sense next to its siblings has not been split — it has been cut.

**6 · Every child carries acceptance criteria too.** Whatever intent a child serves, it also gets
the acceptance criteria section of the refined-item template — what a team picks up, plans and
finishes is the child, and a child nobody can call finished is not a unit of work. The section
sits after the ones that child's own template defines, and before the two that close every
template, so the agreement reads as the conclusion of the report rather than its preface.

They are **allocated, never duplicated**: every criterion stated for the item lands on exactly one
child, and whatever no child claims stays with the item they came from. A child that claims none
has been cut in the sense above, and the answer is to redraw the split — not to invent a criterion
to fill it.

A child that is still raw is the exception. It declares itself awaiting refinement, so it carries
no criteria, and whatever would have landed on it stays with the parent until that child is
refined in its turn.

**7 · It refuses a split the hierarchy cannot hold.** The profile says which work types may
contain which. Where it allows no parent-child relation between the item's type and the
children's, the skill says so, explains why, and leaves the item whole. It does not create the
children anyway: children that cannot be attached are orphans, and an orphan is worse than an item
that is too large, because it is also invisible.

**8 · Then the draft gate.** The complete result appears in chat with the decisions it carries,
and nothing reaches Jira until you approve it. This intent adds one thing: **the whole split is
presented before any of it exists, and approved once** — never child by child, because a split
approved child by child is a split nobody rebalanced. Several items are then written under that
single approval; if part of it fails you are told which parts landed and which did not, and
nothing is undone without you. The block of decisions names the acceptance criteria of every item
involved, the parent included: they are what is being agreed, and a draft that lost them is
otherwise approvable without anyone noticing.

**9 · On the write, the raw declaration is retired.** Where intake wrote a statement saying the
item is raw and awaiting refinement, this write removes it — on both branches. That statement is
what allowed an incomplete item to exist; left standing beside acceptance criteria it makes the
item contradict itself and keeps it out of the planning it is now ready for. Where the item was
split, the skill also narrows the item's own text so that it no longer claims what its children
now carry, and it never adds a list of them: the hierarchy is queryable on Jira, and a list
maintained by hand is a second answer that will disagree with the first.

## Worked exchange

**You**

> PROJ-421 — the finance request that came in through the service desk. Can we get it ready to
> pick up?

**`jira-refine`**

> It is still the raw record: the request in the words it arrived in, and five questions it does
> not answer. Those five are where we start. First one — when is this done? Something someone
> could check, not a description of the work.

**You**

> When the monthly figures show the same period of the previous year alongside, for every period.

**`jira-refine`**

> One of the five asks what "the same period" means: the same calendar month, or the same
> position in the financial year?

**You**

> Financial year. Ours starts in April.

**`jira-refine`**

> And the last open one — does the previous year have data for every period?

**You**

> No, two of the twelve were never migrated. PROJ-418 covers it. Until that lands, those periods
> should show the absence marked, not a zero.

**`jira-refine`**

> Then PROJ-418 goes in as a link rather than a sentence about it, and the marked absence becomes
> a criterion of its own. What was considered and deliberately left out?

**You**

> Rolling averages and comparison against a plan both came up and we dropped them. The recipients
> don't change either — same people, same report, with the comparison in it.

**`jira-refine`**

> That leaves one of the five open: what "the next close" is as a date. It is a question about
> when, not about done, so it does not become a criterion here — [`jira-plan`](jira-plan.md) owns
> it. Last on my side: can your team finish this in one planning horizon? If not, I break it into
> children, each one complete on its own, and you approve the whole split in one go.

**You**

> It fits. It's one change to one report.

**`jira-refine`**

> One more thing: **Team** is required on this project and was left open at capture. Who owns
> these figures?

**You**

> The finance reporting team.

**`jira-refine`**

> Here is what goes on PROJ-421. It stays a Task, it still has no parent, and its original wording
> and source stay exactly as they are — the three sections below are added under them. The
> "Awaiting refinement" section goes: it is what let the item exist incomplete, and it is
> discharged now. Approve it and I write it, or tell me what to change.

## The result

What refinement adds to PROJ-421. The title, the request in the words it arrived in and the source
table stay as intake wrote them; these sections are appended below.

```markdown
## Acceptance criteria

- [ ] The monthly figures sent to the finance team include, for every period shown, the same
      period of the previous year.
- [ ] "The same period" means the same month of the financial year, which for this organisation
      starts in April.
- [ ] Where the previous year has no data for a period, the period is shown with the absence
      marked, not omitted and not zero.
- [ ] The recipients of the current monthly figures receive the new form without asking for it.
- [ ] Anyone who currently assembles the comparison by hand can stop doing so.

## Dependencies

- Blocked by PROJ-418 — the previous year's figures for two of the twelve periods were never
  migrated, and the comparison cannot be complete until they are.

## Out of scope

Comparison against any period other than the same period a year earlier. Rolling averages, and
comparison against a plan or a forecast, were both raised and deliberately excluded: they change
what the figures mean, and nobody has asked for that.

Changing who receives the figures.
```

The section that is **not** there is half the point. Intake left PROJ-421 carrying a statement that
it was raw and awaiting refinement, and that statement is gone from the item now — retired by this
same write, not by a later tidy-up. An item that says it is not ready two paragraphs above its own
acceptance criteria contradicts itself, and [`jira-plan`](jira-plan.md), which flags what is not
ready before planning it, will go on believing the older half.

The other thing to look for is what happened to the five open questions capture listed. Four
became acceptance criteria — one of them also producing the link to PROJ-418, because it could not
be answered here — and the fifth, the date behind "the next close", is a question about when
rather than about done, so it goes to planning. None of the five was quietly dropped. _Required
fields not yet filled_ is absent because none remain: **Team** was open at capture and was answered
here, and the template says to omit that section rather than write "none" under it. The template
fixes which sections appear and in what order and fixes no language: this artifact is in English
because the conversation that produced it was.

Had the answer to the planning-horizon question been no, this section would show a different
shape — PROJ-421 narrowed to what it still carries itself, and beside it the children, each built
from the template of the intent it serves and each complete enough to be picked up alone. No list
of those children appears in the parent's text, in either branch: Jira already answers that
question.

### The other branch, worked

PROJ-421 was enriched in place because it was already small enough. PROJ-388 — _self-service
reporting for the finance team_ — is not, and the split is the branch nothing has shown until now.

Three children, because three is what the work divided into and not a number anyone was aiming for:

```text
PROJ-388  Self-service reporting for the finance team        ← the parent, narrowed
├── PROJ-401  A finance user picks a period and sees the figures for it
├── PROJ-402  A finance user compares a period against the same period a year earlier
└── PROJ-403  A finance user exports what they are looking at
```

Each carries its own acceptance criteria, agreed before any of them existed: the whole split goes
to the gate once, never child by child. PROJ-402 is the one that shows why. On its own it is a
comparison of nothing, so its criteria name the period selection PROJ-401 provides — and that
becomes a link between the two, not a sentence in a description.

**What the parent says afterwards** is the part no source showed:

> **Before** — Self-service reporting for the finance team. They ask us for every figure they need
> and each request costs someone half a day. They should be able to select a period, compare it
> against the year before, and take the result away.
>
> **After** — Self-service reporting for the finance team. They ask us for every figure they need
> and each request costs someone half a day. What that needs is PROJ-401, PROJ-402 and PROJ-403.

The parent keeps the argument and gives up the specification. What it must **not** keep is a list
of its children: the hierarchy is queryable on Jira, and a list maintained by hand is a second
answer that disagrees with the first the day somebody adds a fourth child.

**When the hierarchy will not hold it**, the split is refused — and the refusal is not the end of
the exchange. The profile knows which work types may contain which, so what comes back is what
this project can support, cheapest first: another pair of types the hierarchy does allow, then
enriching PROJ-388 in place, then a change to the scheme — which is a project admin's to make and
not yours.

## What it will not do

- **Invent acceptance criteria you did not agree to.** Criteria nobody agreed to are still
  criteria someone will be held to.
- **Split along the layers of a solution.** One child per layer produces pieces that can only be
  finished together, which is a decomposition of the design and not of the work.
- **Estimate**, or decide priority or sequence. That is planning, and a refined item is exactly
  what lets [`jira-plan`](jira-plan.md) do it without guessing.
- **Create children the hierarchy cannot hold.** It refuses the split, says why, and leaves the
  item whole rather than producing orphans.
- **Keep a list of the children in the parent's text.** The relation lives on Jira and is
  queryable there.
- **Rewrite the original request.** What was asked stays on the item next to what was agreed.

## See also

- [The development process](../development-process.md) — the project profile, the draft gate, the
  two channels, and where refinement sits in the whole path.
- [`jira-capture`](jira-capture.md) — the intake this skill closes. What capture records is raw by
  declaration, and this is the intent that discharges the declaration.
- [`jira-plan`](jira-plan.md) — to decide when the refined work is tackled.
- [`jira-diagnose`](jira-diagnose.md), [`jira-assess`](jira-assess.md) and
  [`jira-propose`](jira-propose.md) — the intents whose templates a child is built from, and the
  skills to reach for when what you have is a new item rather than an existing one.
