# `jira-inspect` — read where things stand

<!-- skill-header:start -->

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Name**              | `jira-inspect`                                                                         |
| **Version**           | 1.0.0                                                                                  |
| **Invocable by name** | yes                                                                                    |
| **Channel**           | Atlassian MCP server                                                                   |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## What it does

Answers a question about state without changing any. How a parent and its children are
progressing, what the sprint has left, what is blocked and by what, what a fix version currently
contains. It reports counts first, then the items that carry the answer, and it says when the
answer is empty instead of returning nothing.

It is the only skill here that never writes. There is no draft gate on this page because there is
nothing to gate.

## When it fires · when it does not

It fires when you want an answer, not a change.

| Say something like                           | And this is the skill you get     |
| -------------------------------------------- | --------------------------------- |
| "where is the sprint at?"                    | `jira-inspect`                    |
| "move PROJ-14 to review"                     | [`jira-advance`](jira-advance.md) |
| "put these four in the sprint"               | [`jira-plan`](jira-plan.md)       |
| "what still has to land before we ship 2.4?" | [`jira-release`](jira-release.md) |
| "assign these to 2.4"                        | [`jira-release`](jira-release.md) |

Fix versions are the one genuine overlap. `jira-inspect` can report the contents of a fix
version you name, because that is a search — but only [`jira-release`](jira-release.md) can
tell you which fix versions exist and what state each is in, since that listing lives on the
Jira CLI and this skill does not declare it. Ask about fix versions there.

Otherwise the pattern holds: a question is this skill, an instruction is one of the other three.
When you ask for a change mid-answer, `jira-inspect` names the skill that owns it and stops — it
does not offer to make the change itself, because an offer accepted in the same breath as a
question is a write nobody gated.

A request that asks for both at once is not a mid-answer change: "show me what is left in the
sprint and drop the blocked ones" is one operation and belongs to
[`jira-plan`](jira-plan.md) from the start.

## How to use it

Ask the question. There is nothing to approve and nothing to undo.

**1 · It reads the project profile first.** `.jira/project-profile.md` supplies the project key,
the statuses and their categories, and the boards and fix versions your question refers to. If
the profile is missing it stops and tells you to run `jira-init`. See
[the development process](../development-process.md).

**2 · It answers by searching.** Four shapes cover most of what gets asked:

| You ask about   | It reports                                                           |
| --------------- | -------------------------------------------------------------------- |
| a parent        | its children, their statuses, and what remains                       |
| a sprint        | what is in it grouped by status category, and what has not started   |
| what is blocked | items whose blocking links are unresolved, and what is blocking them |
| a fix version   | what is assigned to it, and how much of that is unfinished           |

**3 · It reads through one channel only.** Everything above is a search, so `jira-inspect` never
touches the Jira CLI — it is not even declared. That is deliberate: no question you can ask it
can reach a command that closes a sprint. The consequence is that a question needing the Agile
surface — which boards the project has, or a sprint the profile does not name — gets an honest
"I cannot answer that from here" and the name of [`jira-plan`](jira-plan.md), which holds that
channel.

**4 · It reports the gaps as findings.** A sprint with nothing in it, a fix version nothing is
assigned to, and a parent with no children are three different answers, and each is more useful
than silence. Where a status category leaves an item ambiguous, it says so rather than picking a
bucket for it.

## Worked exchange

**You**

> How's the sprint looking? We've got the review on Thursday.

**`jira-inspect`**

> Reading the profile for the board and the active sprint, then searching.

> **Sprint 24 — 11 work item, day 7 of 10**
>
> | Status category | Count | Work item                              |
> | --------------- | ----- | -------------------------------------- |
> | Done            | 4     | PROJ-98, PROJ-101, PROJ-104, PROJ-110  |
> | In Progress     | 3     | PROJ-99, PROJ-107, PROJ-112            |
> | To Do           | 4     | PROJ-102, PROJ-103, PROJ-113, PROJ-115 |
>
> Four have not started with the sprint at day 7 of 10. Two of those, PROJ-113 and PROJ-115, are
> blocked: both are waiting on PROJ-88, which is not in this sprint and sits in To Do.
>
> PROJ-107 is in a status this project maps to no category, so I have left it in In Progress
> above and flagged it here rather than deciding for you.

**You**

> Can you pull 113 and 115 out then?

**`jira-inspect`**

> That is a change to the sprint, and this skill only reads. [`jira-plan`](jira-plan.md) owns it
> — ask it to empty those two out of Sprint 24 and it will show you the operation before it runs.

## The result

The reply as it arrives in chat. There is no artifact and nothing is written to Jira.

```text
Sprint 24 — 11 work item, day 7 of 10

  Done         4    PROJ-98, PROJ-101, PROJ-104, PROJ-110
  In Progress  3    PROJ-99, PROJ-107, PROJ-112
  To Do        4    PROJ-102, PROJ-103, PROJ-113, PROJ-115

Not started, at day 7 of 10:  PROJ-102, PROJ-103, PROJ-113, PROJ-115
Blocked:                      PROJ-113, PROJ-115 — both on PROJ-88 (To Do, not in this sprint)
Ambiguous:                    PROJ-107 — status "Awaiting sign-off" maps to no category
```

What makes this answer usable is the last three lines. The counts alone would have said the
sprint is two thirds through with a third done, which is true and tells nobody what to do on
Thursday. The blocker is outside the sprint, so no amount of reading the sprint would have found
it — and the ambiguous status is reported rather than resolved, because the categories belong to
the project and this skill does not reinterpret them.

## What it will not do

- **Write anything.** No create, no edit, no transition, no link, no assignment.
- **Offer a write as a next step.** When you ask for a change it names the skill that owns it and
  stops there.
- **Compute a metric your project does not keep** — velocity, a burndown, a projected end date.
  An estimate produced by a reader of the board is a number with no owner, and it will be quoted
  as though it had one.
- **Reach the Agile channel.** Boards and sprints are read from the profile and from searchable
  fields, never from the Jira CLI.
- **Return every row.** Counts first, then the items that carry the answer. A report nobody reads
  to the end is a report that failed.

## See also

- [The development process](../development-process.md) — the project profile, the two channels,
  and why the read-only skill declines one of them.
- [`jira-advance`](jira-advance.md) — to run the next transition on a single work item.
- [`jira-plan`](jira-plan.md) — to change what a sprint contains, and for questions that need the
  Agile channel.
- [`jira-release`](jira-release.md) — to change what a fix version contains.
