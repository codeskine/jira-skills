# `jira-release` — decide what ships together

<!-- skill-header:start -->

|                       |                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**              | `jira-release`                                                                                                                                                                |
| **Version**           | 1.0.0                                                                                                                                                                         |
| **Invocable by name** | yes                                                                                                                                                                           |
| **Channel**           | Atlassian MCP server · Jira CLI                                                                                                                                               |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". Listing fix versions needs the jira CLI authenticated; assigning work to one does not. |

<!-- skill-header:end -->

## What it does

Owns the fix version — what ships together. It lists the fix versions the project actually has
with their state, assigns work items to one and takes them off again, and shows what one contains
and which part of that is unfinished as the ground for a change you approve. Two things it cannot
do at all — create a fix version, and release or archive one — it names before you ask and hands
back to you in Jira.

It is a Release Manager's question asked at the only useful moment. Knowing what shipping means
before you ship is the job; finding out afterwards has a name, and it is not a good one.

## When it fires · when it does not

It fires when the question is what ships together.

| Say something like                           | And this is the skill you get     |
| -------------------------------------------- | --------------------------------- |
| "assign these two to 2.4"                    | `jira-release`                    |
| "take PROJ-88 out of 2.4"                    | `jira-release`                    |
| "which fix versions does this project have?" | `jira-release`                    |
| "what's in 2.4? put these two in it as well" | `jira-release`                    |
| "what is actually in 2.4?"                   | [`jira-inspect`](jira-inspect.md) |
| "put these two in the sprint"                | [`jira-plan`](jira-plan.md)       |
| "this one is too big for anyone to pick up"  | [`jira-refine`](jira-refine.md)   |
| "where is the sprint at?"                    | [`jira-inspect`](jira-inspect.md) |

Two boundaries are worth stating outright.

**With [`jira-inspect`](jira-inspect.md).** The line is what the question is _about_. Ask about the
work **inside** a fix version — _what is in 2.4, and what of it is unfinished_ — and it is
`jira-inspect`, which reads and stops. Ask about the **fix version itself** — putting work on one,
taking work off one, which ones the project has, whether 2.4 has been released or archived — and
it is `jira-release`. The last two live on the Jira CLI, which `jira-inspect` does not declare;
the first two change something, which `jira-inspect` never does.

`jira-release` also reads the contents, as the opening of a conversation that ends in an assignment
you approved: ask for the contents and the change in one breath and you are here, not there. The
line runs the same way on the sprint axis, so there is one rule to learn and not two.

**With [`jira-plan`](jira-plan.md).** "Ships in 2.4" and "is in Sprint 25" are two independent
facts about the same work item. The fix version says what it ships with, the sprint says when it
is tackled, and neither skill infers one from the other. This is the misunderstanding to guard
against here: it is the one that puts half a feature in a shipment.

## How to use it

Name the fix version you are asking about, or ask which ones exist.

**1 · It reads the project profile first.** `.jira/project-profile.md` records the fix versions
this project has and their state. If the profile is missing it stops and tells you to run
`jira-init` — it does not guess. See [the development process](../development-process.md).

**2 · It says what it cannot do before you ask.** Creating a fix version, and releasing or
archiving one, are available on neither channel at the versions this plugin targets. That is a gap
in the tooling rather than a limit of this skill's ambition, and it is announced at the start
instead of discovered at the end: those two you do in Jira, and the skill carries on with the
rest. It never approximates releasing with a transition or a label.

**3 · It lists the fix versions as the project holds them**, with their state, not as anyone
remembers planning them. A fix version released last week and one that was never created sound
identical in a conversation and are nothing alike on a board.

Listing is the half of this skill that needs the Jira CLI; assigning is not, because the fix
version is a field on the work item and fields travel over the MCP server. So when the profile
records the fix versions as _not read_ — the Agile channel was unreachable when discovery ran,
which is not the same as the project having none — the skill says the list could not be read,
gives the remedy that fits the cause (a credential the non-interactive shell cannot see and a
configuration that was never generated are two different failures, and `jira init` is the remedy
for the second of them only; both are in [the development process](../development-process.md)),
and then
asks you for the fix version name rather than offering a choice it cannot compile. An assignment
to a name that does not exist fails, so nothing is created by guessing.

**4 · It shows what a fix version contains, and what of that is unfinished.** Assigned items
grouped by status category, which is the answer to "what does shipping this mean", and it is
offered before anyone asks for it. Before you release, the unfinished ones are listed item by
item with their status — never as a count, because a count invites you to read the remainder as
small.

**5 · Assigning is an edit, not a transition.** Nothing changes status because it was assigned to
a fix version, nothing is planned into a sprint because it was, and an item already in a sprint
stays in it.

The way off is the way on, cleared. Moving an item from 2.4 to 2.5 sets the same field; taking it
off 2.4 empties it. Neither is a release and neither needs the Jira CLI. The skill says which of
the two is happening, because an item that leaves 2.4 for 2.5 and an item that leaves 2.4 for
nothing are different decisions, and only one of them has somewhere to be.

**6 · Then the draft gate, in its operation form.** Nothing here is authored, so what the gate
shows you is the change itself rather than a document: every work item whose fix version will
change, and the one it will change to — or, where it is being taken off one, that it will end up
assigned to none. A set assigned together is one approved action over several writes — if part of
it fails you are told which part succeeded and which did not, and nothing is rolled back on the
skill's initiative.

## Worked exchange

**You**

> We are supposed to ship 2.4 next Thursday. What is actually in it?

**`jira-release`**

> Reading the project profile for the fix versions, then listing them from the project.
>
> Two things up front, so they are not a surprise on Thursday: this plugin cannot create a fix
> version, and it cannot release or archive one. Neither channel exposes those operations, so
> releasing 2.4 is yours to do in Jira. Everything else here I can do.
>
> | Fix version | State      | Assigned |
> | ----------- | ---------- | -------- |
> | 2.3         | released   | 14       |
> | 2.4         | unreleased | 9        |
> | 2.5         | unreleased | 2        |
>
> **2.4 — 9 work item assigned, 6 of them done.** The three that are not, item by item:
>
> | Work item | Status      | Title                                       |
> | --------- | ----------- | ------------------------------------------- |
> | PROJ-118  | In Review   | Retry budget on the delivery worker         |
> | PROJ-124  | In Progress | Month-boundary handling in the export range |
> | PROJ-129  | To Do       | Audit trail for permission changes          |

**You**

> 131 and 132 are in Sprint 25, so they are in 2.4 too, right?

**`jira-release`**

> No, and Jira keeps those apart on purpose. Sprint 25 says when they are tackled; the fix version
> says what they ship with. Neither of them carries a fix version at the moment, and being in the
> sprint will never assign one. Do you want them in 2.4?

**You**

> Yes, both.

**`jira-release`**

> Then this is what I will write:
>
> | Work item | Fix version now | After |
> | --------- | --------------- | ----- |
> | PROJ-131  | none            | 2.4   |
> | PROJ-132  | none            | 2.4   |
>
> Two edits, one approval. Neither changes a status, and both stay in Sprint 25 — the two are
> separate fields and I am touching one of them. Approve and I write them, or tell me what to
> change.

**You**

> Go ahead.

**`jira-release`**

> Both written. PROJ-131 and PROJ-132 now carry fix version 2.4, which brings it to 11 work item
> assigned and 5 unfinished.

**You**

> Good. Release it on Thursday, then.

**`jira-release`**

> That part is yours: no channel here exposes it, and I will not stand in for it with a transition
> or a label. Five of the eleven are unfinished today, and none of them became finished by being
> assigned — this skill edits a field and stops there. What you want to be true of those five on
> Thursday has to be made true before you release 2.4, or decided in Jira at the moment you do.

## The result

The reply as it arrives in chat. What was written to Jira is a field on two work item; what you
read back is the fix version as it now stands.

```text
Fix version 2.4 — unreleased, 11 work item assigned

  Done         6    PROJ-105, PROJ-109, PROJ-112, PROJ-117, PROJ-121, PROJ-126
  In Progress  3    PROJ-118, PROJ-124, PROJ-132
  To Do        2    PROJ-129, PROJ-131

Unfinished, item by item:
  PROJ-118   In Review     Retry budget on the delivery worker
  PROJ-124   In Progress   Month-boundary handling in the export range
  PROJ-129   To Do         Audit trail for permission changes
  PROJ-131   To Do         Rate limit on the public search endpoint
  PROJ-132   In Progress   Migration of the stored report definitions

Written in this operation:  PROJ-131, PROJ-132 → fix version 2.4  (both succeeded)
Not available here:         releasing 2.4 — do it in Jira
```

Two details carry this report. The unfinished work is listed by key, status and title rather than
counted, because "five remaining" is a number anyone can live with and five titles is not. And
the last line is present even though nothing failed: the operation this conversation was really
about is the one the plugin cannot perform, and a report that ended at the successful writes
would read as though Thursday were taken care of.

## What it will not do

- **Release or archive a fix version**, by any means it has, and it will not stand in for the act
  with a transition or a label. Neither channel exposes it; you do it in Jira.
- **Create a fix version.** The same gap, and the same answer: create it in Jira, then come back
  and assign to it. Coming back needs nothing re-run — the skill lists the fix versions from the
  project rather than from the profile, so the one you just made is there. The profile is the
  thing that is now behind, and it will say so and leave the re-run to you.
- **Plan an item into a sprint** because it belongs to a fix version. That is
  [`jira-plan`](jira-plan.md), and it is a decision nobody made yet.
- **Transition anything.** Assigning is an edit of a field; moving a work item to its next status
  is [`jira-advance`](jira-advance.md).
- **Assume unfinished work will be finished** before you release, or drop it from the list on that
  assumption.
- **Answer with a count** where the list is the answer.

## See also

- [The development process](../development-process.md) — the project profile, the draft gate, the
  two channels and the gaps they declare, and where deciding what ships sits in the whole path.
- [`jira-plan`](jira-plan.md) — for the other axis: when the work is tackled.
- [`jira-inspect`](jira-inspect.md) — to read what a fix version contains without being able to
  change it.
- [`jira-refine`](jira-refine.md) — to turn an item that is not ready into one a team can pick up
  before you count on it shipping.
