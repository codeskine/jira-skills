# `jira-advance` — run a transition

<!-- skill-header:start -->

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Name**              | `jira-advance`                                                                         |
| **Version**           | 1.0.0                                                                                  |
| **Invocable by name** | yes                                                                                    |
| **Channel**           | Atlassian MCP server                                                                   |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## What it does

Takes one work item to another status. Before it offers you anything it asks Jira what that item
can do at that moment — for that item, not for its work type — and offers exactly what came back,
named as Jira names it. Nothing is inferred from a table of statuses, from the work type, or from
a diagram this plugin drew.

When a transition you expected is not in the list, it says which of two things is missing: a
condition this item does not meet, or a path this Jira Workflow does not have. The first is yours
to act on, the second only a project admin can change, and a report that says "unavailable"
without saying which sends you to the wrong person.

A transition is a small write, and small is not a reason to run one unseen. Whatever you said
beforehand — _just move it_, _go ahead_ — the operation is put in front of you first: the work
item, the status it is in, the status it will reach. You approve something you have seen, and a
transition is short to show.

## When it fires · when it does not

It fires when one work item has to reach a different status — start it, hand it over, put it
back, close it.

| Say something like                     | And this is the skill you get                           |
| -------------------------------------- | ------------------------------------------------------- |
| "PROJ-118 is out of review, close it"  | `jira-advance`                                          |
| "put PROJ-118 back on the backlog"     | `jira-advance` or [`jira-plan`](jira-plan.md) — it asks |
| "where has PROJ-118 got to?"           | [`jira-inspect`](jira-inspect.md)                       |
| "put these four in the sprint"         | [`jira-plan`](jira-plan.md)                             |
| "take PROJ-118 back out of the sprint" | [`jira-plan`](jira-plan.md)                             |
| "close the sprint, we are done"        | [`jira-plan`](jira-plan.md)                             |
| "is anything still blocked?"           | [`jira-inspect`](jira-inspect.md)                       |

Two boundaries, and one word sits on both. **Close** means a transition when it is a work item
being closed, and this skill runs it; it means something else entirely when it is a sprint being
closed, which is [`jira-plan`](jira-plan.md) reporting what was delivered and where the unfinished
work goes. The other boundary is not the count but what changes: a status here, membership of a
sprint there. Moving a work item into a sprint or back out of one is [`jira-plan`](jira-plan.md)
whether it is one item or twenty. A question about where things stand changes nothing and belongs to
[`jira-inspect`](jira-inspect.md).

**And a name does not say what kind of thing it is.** `Backlog` is a status in some Jira
Workflows, and it is also the name for where a work item sits when it is in no sprint. The first
is a transition and this skill's; the second is a placement, [`jira-plan`](jira-plan.md)'s, and
one of the three moves that skill hands back to you. This one does not settle it by preferring the
kind it happens to own: it reads your profile and, where both match, asks which you meant. The
rule, and the same problem for `2.4` and `To Do`, is in
[the development process](../development-process.md).

## How to use it

Name the work item and say where you want it to get to. You do not have to know which transitions
exist — that is the question the skill puts to Jira.

**1 · It reads the project profile first.** `.jira/project-profile.md` gives it the project key
and the tool that performs a transition, resolved from the profile rather than hard-coded. If the
profile is missing it stops and tells you to run `jira-init`. See
[the development process](../development-process.md).

**What it opens first in that file is _Unsupported operations_.** If running a transition is listed
there — no tool resolved for it in this setup, the account not permitted, the channel that serves
it silent when discovery ran — you hear it immediately, with the operation named and the manual
path the profile records, and nothing else is asked. Meeting that limit at the write instead would
throw away the whole exchange that led to it. It is not a reason to reach for the other channel
either: an operation has one channel and no substitute.

**Then it resolves the name you used, before doing anything with it.** You say `Backlog`, or `To
Do`, or `2.4`, and a name does not say which kind of thing it is; the routing that chose this skill
happened before any profile was read. With the profile in hand it can tell. One kind matches and
you never see the question. Two match and it asks which, saying what each would do — it will not
resolve toward a status on the grounds that statuses are what it moves. None match and it tells you
what your project does hold, because a name that is not there is more often a typo or a stale
profile than something to go and create.

Name a board and the answer is plainer still. A board is a filter over work items, nothing either
channel offers takes a work item off one, and you are told that as a declared gap rather than
handed the nearest transition that happens to exist.

The profile also records the shape of the Jira Workflow, and **no transition is ever offered from
it**. That table is not the source for what an item can do today: it may be incomplete, because
statuses are observable only where work already exists and a project holding nothing exposes
none — and even complete, it does not know the condition that will refuse a transition. It has one
use here, in step 4, and that use is explaining an absence rather than proposing a presence.

**2 · It asks Jira what this item can do, at this moment.** Transitions are evaluated per work
item, not per work type: two items of the same type, sitting in the same status, can offer
different transitions, because conditions, permissions and the item's own fields all count.

**3 · It offers only what came back**, named as Jira names it. A transition absent from that list
is not offered, however reasonable it sounds.

**4 · It explains an absence.** When you expect a transition that is not there, it says which of
the two it is:

- **the item** — a condition on the transition is unmet: a required field, a permission, the
  status of something the item depends on. This one you can act on.
- **the Jira Workflow** — no such transition exists from this status at all, for anyone. Only a
  project admin adds a path that is not there.

It tells them apart by comparing two things it already has. The project profile records which
status is reachable from which — the **shape** of your Jira Workflow, which is what that table is
for — and Jira's answer for this work item records what is available **right now**. Named in the
shape and missing from Jira's answer means the path exists and something about this item is
closing it. Missing from both means there is no path. What you were offered does not change
either way: the table explains why something is absent, it never adds to what Jira returned.

Where the profile cannot answer — statuses not observable yet because the project holds no work
item, or a table it records as not read — it says the cause cannot be established here, gives you
the manual path, and names `jira-init` if a run would fill the table in. A cause named by guess
would send you to repair something that is not broken, and that is worse than a cause not named.

**5 · Then the draft gate — here an operation gate.** Nothing is authored: the work item is there
before you start, so there is no document to show you and what you approve is the change itself.
The work item, the status it is in, the status the transition declares it will reach, what running
it will **not** do where you could reasonably expect otherwise, and — where your sentence asked
for two things — the half this does not do and the skill that owns it. Where the item is held by
someone else, the gate says so rather than transitioning it quietly. You approve, or you ask for
something else and see the choice again. Both shapes of the gate are in
[the development process](../development-process.md).

**Asking for the gate to be skipped does not skip it.** _Just move it_, _go ahead_, _don't show me
anything_ — that is impatience, and impatience approves nothing: what you would be approving is
something you have not seen. So the operation is shown anyway, kept as short as it can be, and
the skill says that is why. Expect to meet this here more than anywhere, because a transition
feels too small to be worth a gate. It is a write like any other, and after it Jira is the truth.

Say no and nothing is written. You are told what now holds — the item is in the status it was
already in — and you are not offered a smaller transition in the hope that one passes.

The write goes through the Atlassian MCP server. A skill reaches a channel only by carrying that
channel's exact string among its declared tools, and this one carries `mcp__atlassian` and not
`Bash(jira:*)`: the Jira CLI is not available to it at all.

**6 · It reads the status back afterwards.** The status it reports is the one Jira returns after
the write, not the one the transition declared. Most of the time the two agree. When they do not,
because the Jira Workflow carried the item onward from the status the transition names, the report
says where the item actually is.

## Worked exchange

**You**

> PROJ-118 is out of review. Close it — no need to show me anything, just move it.

**`jira-advance`**

> I will show you the move before I run it. That part stays: it is short, and there is nothing to
> approve in a change you have not seen.
>
> I asked Jira what PROJ-118 can do right now. It is in **In Review**, and two transitions come
> back:
>
> | Transition       | Status it declares |
> | ---------------- | ------------------ |
> | Request changes  | In Progress        |
> | Send to sign-off | Awaiting sign-off  |
>
> Nothing that reaches Done is among them. One thing before you choose: PROJ-118 is assigned to
> someone other than you, so whichever you pick, you are transitioning an item somebody else is
> holding.

**You**

> Done should be there. We close things straight out of review all the time.

**`jira-advance`**

> It exists in the Jira Workflow, so this is the absence that is about the item rather than about
> the Jira Workflow: the transition to Done is refused while PROJ-118 has an unresolved blocking
> link, and it has one — PROJ-90, in In Progress. That is something you can act on. I will not
> clear the condition to make the transition pass; once PROJ-90 is resolved, ask me again and I
> will re-read what Jira offers rather than assume this list still holds.

**You**

> Then put it back on the backlog and we will plan it again.

**`jira-advance`**

> Two different things in this project answer to that name, and I am not going to pick the one I
> happen to own. **Backlog** is a status in your Jira Workflow, which I would reach with a
> transition. The backlog is also where a work item sits when it is in no sprint, and putting
> PROJ-118 there means taking it out of the sprint holding it — that is a placement,
> [`jira-plan`](jira-plan.md)'s, and one it hands back to you, because removing work from a sprint
> is available on neither channel. Which did you mean?

**You**

> The status.

**`jira-advance`**

> Then it is the other kind of absence: this Jira Workflow has no transition from In Review to
> Backlog at all, for anyone. It is not a condition you can satisfy — only a project admin adds a
> path that is not there. From In Review, what exists is the two above.

**You**

> Request changes, then.

**`jira-advance`**

> **PROJ-118 · Saved filters can be shared with a group**
>
> In Review → **Request changes**, which declares In Progress. The item is assigned to someone
> other than you. What this does not do is close PROJ-118, or bring it any nearer to Done: Done
> stays refused while PROJ-90 is open, and I will not clear that condition to get past it. This is
> the step you asked me to skip, and it is the whole of it. Run it?

**You**

> Yes — run it.

**`jira-advance`**

> Ran it. Reading the status back rather than assuming it: PROJ-118 is in **Rework**, not in In
> Progress — the transition declares In Progress and this Jira Workflow carried it on from there.
> Done and Backlog stay where they were: the first waiting on PROJ-90, the second on a path the
> Jira Workflow does not have.

## The result

The report as it arrives in chat once the transition has run. Nothing is written anywhere but
Jira.

```text
PROJ-118 · Saved filters can be shared with a group
https://<your-site>.atlassian.net/browse/PROJ-118

  Transition run     Request changes
  Status before      In Review
  Status declared    In Progress
  Status now         Rework             read back from Jira after the write

  Not offered from In Review, and why
    Done      the item           condition unmet — blocked by PROJ-90 (In Progress)
    Backlog   the Jira Workflow  no transition from In Review, for anyone
```

The line that matters least is the one saying the transition ran. **Status now** was read back
from Jira instead of copied from the transition's own declaration, which is the only reason the
report is right in the case where the Jira Workflow carried the item somewhere else. And the two
absences are recorded with their cause attached: one is a condition somebody can go and satisfy,
the other is a path only a project admin can add. Told merely that Done was "unavailable", two
people would have spent the afternoon in the wrong two places.

## What it will not do

- **Propose a transition from the project profile.** The profile records the shape of the Jira
  Workflow, and the one thing this skill reads it for is telling the two causes of an absence
  apart. It never answers what this item can do now.
- **Offer a transition Jira did not return**, however reasonable it sounds — including the one you
  just asked for by name.
- **Skip the gate because you asked it to.** _Just move it_ says how long you want this to take and
  nothing about approval. The operation is shown, briefly, and then run.
- **Decide for you which kind of thing you named.** Where `Backlog` or `To Do` matches both a status
  and something else in your project, it asks. Resolving toward the status because statuses are
  what it moves would look like knowledge and be a coin toss.
- **Take a work item off a board.** Neither channel offers it and no transition is the same move, so
  you are told so plainly instead of being handed the nearest thing that happens to be possible.
- **Fill a required field so that a refused transition passes.** It names what is unmet and stops
  there. The condition belongs to the project, and satisfying it on the way past is how it stops
  meaning anything.
- **Transition an item somebody else is holding without saying so.** It will run it if you ask; it
  will not run it quietly.
- **Chain several transitions to reach a distant status.** Each one is a decision, and a Jira
  Workflow that needs three of them to get where you are going is telling you something you should
  hear.
- **Reach for the Jira CLI when the MCP tool is missing.** An operation has one channel. Where the
  profile resolved no tool for a transition, it says so and hands you the manual path.
- **Plan, refine or report.** Deciding when work is tackled is [`jira-plan`](jira-plan.md) —
  including moving a single work item into a sprint or back out of one — making an item ready is
  [`jira-refine`](jira-refine.md), and answering where things stand is
  [`jira-inspect`](jira-inspect.md).

## See also

- [The development process](../development-process.md) — the project profile, the draft gate, the
  two channels, and where a transition sits in the whole path.
- [`jira-inspect`](jira-inspect.md) — to read where an item stands, and what is blocking it,
  without changing anything.
- [`jira-plan`](jira-plan.md) — to decide when work is tackled, to move a work item into a sprint
  or back out of one, and to close a sprint.
- [`jira-refine`](jira-refine.md) — to make an item ready, rather than to take it to its next
  status.
