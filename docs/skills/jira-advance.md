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

## When it fires · when it does not

It fires when one work item has to reach a different status — start it, hand it over, put it
back, close it.

| Say something like                    | And this is the skill you get     |
| ------------------------------------- | --------------------------------- |
| "PROJ-118 is out of review, close it" | `jira-advance`                    |
| "where has PROJ-118 got to?"          | [`jira-inspect`](jira-inspect.md) |
| "put these four in the sprint"        | [`jira-plan`](jira-plan.md)       |
| "close the sprint, we are done"       | [`jira-plan`](jira-plan.md)       |
| "is anything still blocked?"          | [`jira-inspect`](jira-inspect.md) |

Two boundaries, and one word sits on both. **Close** means a transition when it is a work item
being closed, and this skill runs it; it means something else entirely when it is a sprint being
closed, which is [`jira-plan`](jira-plan.md) reporting what was delivered and where the unfinished
work goes. The other boundary is the count: one item and one decision here, a set of items in one
approved operation there. A question about where things stand changes nothing and belongs to
[`jira-inspect`](jira-inspect.md).

## How to use it

Name the work item and say where you want it to get to. You do not have to know which transitions
exist — that is the question the skill puts to Jira.

**1 · It reads the project profile first.** `.jira/project-profile.md` gives it the project key
and the tool that performs a transition, resolved from the profile rather than hard-coded. If the
profile is missing it stops and tells you to run `jira-init`. See
[the development process](../development-process.md).

The profile also records the shape of the Jira Workflow, **and this skill does not read that
part**. The table of statuses is not the source for what an item can do today: it may be
incomplete, because statuses are observable only where work already exists and a project holding
nothing exposes none — and even complete, it does not know the condition that will refuse a
transition.

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

**5 · Then the draft gate.** There is no artifact to show here, so what the gate carries is the
item, the status it is in, and the status it will reach; you approve, or you ask for something
else and see the choice again. Where the item is held by someone else, the gate says so rather
than transitioning it quietly. The write goes through the Atlassian MCP server — this skill does
not declare the Jira CLI at all.

**6 · It reads the status back afterwards.** The status it reports is the one Jira returns after
the write, not the one the transition declared. Most of the time the two agree. When they do not,
because the Jira Workflow carried the item onward from the status the transition names, the report
says where the item actually is.

## Worked exchange

**You**

> PROJ-118 is out of review. Close it.

**`jira-advance`**

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

> Then put it back to To Do and we will plan it again.

**`jira-advance`**

> That one is the other kind: this Jira Workflow has no transition from In Review to To Do at all,
> for anyone. It is not a condition you can satisfy — only a project admin adds a path that is not
> there. From In Review, what exists is the two above.

**You**

> Request changes, then.

**`jira-advance`**

> **PROJ-118 · Saved filters can be shared with a group**
>
> In Review → **Request changes**, which declares In Progress. The item is assigned to someone
> other than you. Run it?

**You**

> Go ahead.

**`jira-advance`**

> Ran it. Reading the status back rather than assuming it: PROJ-118 is in **Rework**, not in In
> Progress — the transition declares In Progress and this Jira Workflow carried it on from there.
> Done and To Do stay where they were: the first waiting on PROJ-90, the second on a path the Jira
> Workflow does not have.

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
    Done     the item           condition unmet — blocked by PROJ-90 (In Progress)
    To Do    the Jira Workflow  no transition from In Review, for anyone
```

The line that matters least is the one saying the transition ran. **Status now** was read back
from Jira instead of copied from the transition's own declaration, which is the only reason the
report is right in the case where the Jira Workflow carried the item somewhere else. And the two
absences are recorded with their cause attached: one is a condition somebody can go and satisfy,
the other is a path only a project admin can add. Told merely that Done was "unavailable", two
people would have spent the afternoon in the wrong two places.

## What it will not do

- **Propose a transition from the project profile.** The profile records the shape of the Jira
  Workflow; it never answers what this item can do now.
- **Offer a transition Jira did not return**, however reasonable it sounds — including the one you
  just asked for by name.
- **Fill a required field so that a refused transition passes.** It names what is unmet and stops
  there. The condition belongs to the project, and satisfying it on the way past is how it stops
  meaning anything.
- **Transition an item somebody else is holding without saying so.** It will run it if you ask; it
  will not run it quietly.
- **Chain several transitions to reach a distant status.** Each one is a decision, and a Jira
  Workflow that needs three of them to get where you are going is telling you something you should
  hear.
- **Plan, refine or report.** Deciding when work is tackled is [`jira-plan`](jira-plan.md), making
  an item ready is [`jira-refine`](jira-refine.md), and answering where things stand is
  [`jira-inspect`](jira-inspect.md).

## See also

- [The development process](../development-process.md) — the project profile, the draft gate, the
  two channels, and where a transition sits in the whole path.
- [`jira-inspect`](jira-inspect.md) — to read where an item stands, and what is blocking it,
  without changing anything.
- [`jira-plan`](jira-plan.md) — to decide when a set of items is tackled, and to close a sprint.
- [`jira-refine`](jira-refine.md) — to make an item ready, rather than to take it to its next
  status.
