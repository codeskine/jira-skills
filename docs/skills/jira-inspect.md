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
progressing, what the sprint has left, what is blocked and by what, what a fix version holds and
how much of it is still open. It reports counts first, then the items that carry the answer, and
it says when the answer is empty instead of returning nothing.

It is the only skill here that never writes, and [the draft gate](../development-process.md) names
it as its one exception. The gate takes two forms — an artifact gate, showing the content about to
be created, and an operation gate, showing the change about to reach work items that already
exist. This skill produces neither.

## When it fires · when it does not

It fires when you want an answer, not a change.

| Say something like                           | And this is the skill you get     |
| -------------------------------------------- | --------------------------------- |
| "where is the sprint at?"                    | `jira-inspect`                    |
| "move PROJ-14 to review"                     | [`jira-advance`](jira-advance.md) |
| "put these four in the sprint"               | [`jira-plan`](jira-plan.md)       |
| "what still has to land before we ship 2.4?" | `jira-inspect`                    |
| "which fix versions does this project have?" | [`jira-release`](jira-release.md) |
| "assign these to 2.4"                        | [`jira-release`](jira-release.md) |
| "what's in 2.4? add these two as well"       | [`jira-release`](jira-release.md) |

The fix version is the boundary worth stating outright, and the axis is what the question is
_about_. The work **inside** a fix version — what it holds, how much of it is still open — is this
skill, the same way reading a sprint is. The **version itself** is
[`jira-release`](jira-release.md): which ones the project has, and whether one has been released
or archived. That listing lives on the Jira CLI, which this skill does not declare — and assigning
work to a version or taking it off one is a change, which this skill does not make either.

`jira-release` also takes the question that reads a fix version and then changes it in one breath.
The line runs the same way on the sprint axis, so there is one rule to learn and not two: "show me
what is left in the sprint and drop the blocked ones" is one operation and belongs to
[`jira-plan`](jira-plan.md) from the start.

Otherwise the pattern holds: a question is this skill, an instruction is one of the other three.
Ask for a change mid-answer and `jira-inspect` will not make it and will not offer to — an offer
accepted in the same breath as a question is a write nobody gated. What it does instead is name
the skill that owns the change and hand the request over: the stop is about what this skill
writes, which is nothing, and not about where your request ends.

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

**3 · It reads through one channel only.** Everything in that table is a search, and search is on
the Atlassian MCP server. The Jira CLI is not merely unused here: a skill reaches a channel by
carrying its exact string in `allowed-tools`, and `jira-inspect` carries `mcp__atlassian` and not
`Bash(jira:*)`, so the Agile channel is out of reach however plainly a step might describe one.
That is deliberate — no question you can ask can arrive at a command that closes a sprint — and
there is no way around it either, because the channel map carries no cross-channel fallbacks: an
operation has one channel and no substitute.

So a question needing the Agile surface gets a handover rather than a worse answer. Which boards
the project has, or a sprint the profile does not name, goes to [`jira-plan`](jira-plan.md), which
holds that channel; a fix version the profile does not name goes to
[`jira-release`](jira-release.md).

**4 · It reports the gaps as findings.** A sprint with nothing in it, a fix version nothing is
assigned to, and a parent with no children are three different answers, and each is more useful
than silence. Where a status category leaves an item ambiguous, it says so rather than picking a
bucket for it.

One kind of emptiness is not a finding at all, and the profile keeps it apart. Boards and fix
versions are recorded there in one of three states: listed, none, or **not read** — the channel
that serves them did not answer when discovery ran. "This project has no fix version" is an answer
about your project. "Nobody asked" is an answer about a channel: it establishes nothing about the
project, and it comes back when the channel does. Reading the second as the first sends you off to
create something that may already exist.

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

> That is a change to the sprint, and this skill only reads. I am handing it to
> [`jira-plan`](jira-plan.md), which owns it — the stop is about what I write, not about where
> your request ends. One thing to expect there: taking work back out of a sprint is available on
> neither channel, so `jira-plan` will name PROJ-113 and PROJ-115 and where they are going, and
> the move on the board is yours.

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
  hands the request over, rather than making the change itself.
- **Compute a metric your project does not keep** — velocity, a burndown, a projected end date.
  An estimate produced by a reader of the board is a number with no owner, and it will be quoted
  as though it had one.
- **Reach the Agile channel.** Not a policy it keeps: it carries `mcp__atlassian` and not
  `Bash(jira:*)`, so that channel is not reachable from here at all. Boards and sprints are read
  from the profile and from searchable fields.
- **Speak for the fix version itself** — which ones the project has, whether one has been released
  or archived. That listing is on the Jira CLI and belongs to [`jira-release`](jira-release.md);
  this skill reads the work inside a version, not the version.
- **Return every row.** Counts first, then the items that carry the answer. A report nobody reads
  to the end is a report that failed.

## See also

- [The development process](../development-process.md) — the project profile, the two channels,
  and why the read-only skill declines one of them.
- [`jira-advance`](jira-advance.md) — to run the next transition on a single work item.
- [`jira-plan`](jira-plan.md) — to change what a sprint contains, and for questions that need the
  Agile channel.
- [`jira-release`](jira-release.md) — for the fix version itself: which ones the project has,
  whether one has been released or archived, and to change what one contains.
