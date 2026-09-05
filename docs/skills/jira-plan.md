# `jira-plan` — decide when work is tackled

<!-- skill-header:start -->

|                       |                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Name**              | `jira-plan`                                                                                                           |
| **Version**           | 1.0.0                                                                                                                 |
| **Invocable by name** | yes                                                                                                                   |
| **Channel**           | Atlassian MCP server · Jira CLI                                                                                       |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian" and the jira CLI authenticated. |

<!-- skill-header:end -->

## What it does

Decides **when** work is tackled. It reads the board's sprints from Jira rather than from anyone's
memory of them, checks every work item you want planned against the bar the intent that authored it
set, and moves the whole set in one approved operation.

Closing a sprint is the same skill. It reports what was delivered and what was not from the status
of each work item rather than from the room's recollection, and it makes you name a destination for
everything unfinished before the sprint closes over it. The questions are a Scrum Master's: a plan
made against what the board actually holds survives contact with the week, and one made against
what everybody assumed does not.

Two things it cannot do at all: create a sprint, and start one. Neither is available on either
channel, so both come back to you rather than being simulated.

## When it fires · when it does not

It fires when the question is _when_, and the answer is a sprint.

| Say something like                            | And this is the skill you get     |
| --------------------------------------------- | --------------------------------- |
| "put these four in the sprint"                | `jira-plan`                       |
| "close Sprint 24, we finish Friday"           | `jira-plan`                       |
| "these three should go out in 2.4"            | [`jira-release`](jira-release.md) |
| "PROJ-121 is not ready for anyone to pick up" | [`jira-refine`](jira-refine.md)   |
| "start PROJ-99, I am on it"                   | [`jira-advance`](jira-advance.md) |
| "how is the sprint looking?"                  | [`jira-inspect`](jira-inspect.md) |

Two of those boundaries are worth saying out loud. A sprint says _when_ work is tackled and a fix
version says _what ships together_: they are orthogonal axes, and conflating them is how "when"
quietly becomes "what". And an item that is not ready stays not ready — `jira-plan` tells you so
before it plans it, and never makes it ready in passing.

Reading a sprint without changing it belongs to [`jira-inspect`](jira-inspect.md). But a request
that reads a sprint **and then changes it** — "show me what is left and drop the blocked ones" —
is one operation, not two, and it is this skill's from the start.

## How to use it

Name the sprint and the work items, or ask to close the one that is running. Nothing moves until
you have approved the whole operation.

**1 · It reads the project profile first.** `.jira/project-profile.md` supplies the project key and
the boards. If the profile is missing it stops and tells you to run `jira-init`. See
[the development process](../development-process.md). What matters for planning is that the profile
can say one of three things about boards, and they are not the same answer:

| The profile says                                      | What follows                                                                                                                                                                            |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| boards, listed                                        | it proceeds                                                                                                                                                                             |
| no board                                              | a finding, not an error: it names the operations that are therefore unavailable, and stops. Nothing here has a substitute.                                                              |
| boards not read — the Agile channel was not reachable | it says so, gives the remedy for the cause at hand, and stops. It asserts nothing about whether a board exists, because the question was never put. This returns when the channel does. |

**2 · When the Jira CLI is not reachable, the cause decides the remedy.** `jira me` fails for two
different reasons, and naming the wrong remedy sends you against a wall. Which one it is gets
established before anything is prescribed:

| What is actually wrong                                                                                                                                                                                                                                                                                                  | The remedy                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The credential is not visible to the shell the skills use.** A skill reaches the CLI through a **non-interactive** shell, and that shell reads `~/.zshenv`, never `~/.zshrc`. A token exported in `~/.zshrc` works in your own terminal and is invisible here — which looks exactly like a CLI that was never set up. | Export it from `~/.zshenv` instead. The skill reports the line and the file and never edits your own dotfile for you.                                    |
| **The CLI configuration was never generated.**                                                                                                                                                                                                                                                                          | `jira init`, and only here. It comes second: it authenticates while it runs, so without the credential it answers `401 Unauthorized` and writes nothing. |

The two are told apart, not guessed between: a CLI that is installed, configured and merely unlit
by a missing credential is not a CLI that was never set up, and the report will not say it was.

**3 · It reads the board from Jira, every time.** Which boards exist, which sprints each one has,
and which sprint is active. A sprint that closed yesterday is exactly the kind of fact a remembered
answer gets wrong, and planning against it wastes the meeting the plan was made for.

**4 · Two steps come back to you.** Creating a sprint and starting one are **declared gaps** — not
available on either channel, on the server and CLI versions this plugin targets. They are distinct
problems, and both are handed over the same way:

| The gap         | What the skill does instead                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| create a sprint | it fills and closes sprints but cannot open one, so it asks you to create it on the board and continues once it exists                    |
| start a sprint  | a sprint that already exists as `future` cannot be moved to `active`, so it fills it and closes it, and asks you to start it on the board |

A gap is not a channel that is down. A gap holds everywhere and lasts until the tooling changes; an
unreachable CLI is unsupported here and now, says nothing about your project, and returns when the
channel does. Both are announced, and only the first is permanent. If a future MCP server exposes
one of them, discovery records it and the gap closes without any skill being edited.

**5 · Filling: what is not ready is flagged before it is planned.** Every item is checked against
the universal criteria, plus whatever the intent that authored it adds. A sprint holds work of
every intent — a defect report, a debt record, a value proposal — and each was written to its own
bar: asking a defect report for the acceptance criteria of a refined item is a check that is wrong,
not a check that is strict. What falls short is named, with what it is missing, **before** it goes
in. You can plan it anyway. That is a decision, and it should be one you take knowingly rather than
one the tool takes for you.

**6 · Closing: every unfinished item gets a destination.** The next sprint, the backlog, or
something you name. An item left unhandled at close disappears from the plan without anyone
choosing that, which is the one outcome a review cannot recover from.

**7 · Then the draft gate.** The whole set is presented in chat before anything moves. What this
skill adds to the gate: it lists every item that will move, and every unrefined item among them.
One approval covers the set — ten confirmations for one decision is how planning stops being done
through the tool at all. If part of the operation fails, it reports which items moved and which did
not and stops there; it does not roll back the rest on its own initiative.

## Worked exchange

**You**

> Sprint 25 starts Monday. Put PROJ-118, PROJ-120, PROJ-121 and PROJ-88 in it — 88 is holding up
> two things in 24.

**`jira-plan`**

> Reading the profile for the board, then asking Jira what that board holds right now.
>
> Delivery board: Sprint 24 is active until Friday, and Sprint 25 exists as `future`. That saves a
> step — I cannot create a sprint from here, and this one is already there.
>
> Now checking your four against the bar each of them was written to.

**`jira-plan`**

> Three are ready, one is not.
>
> | Work item | Written as           | Verdict                                                                                                  |
> | --------- | -------------------- | -------------------------------------------------------------------------------------------------------- |
> | PROJ-118  | a defect report      | ready — steps, expected and actual result, the log verbatim, impact, frequency                           |
> | PROJ-120  | a refined item       | ready — acceptance criteria agreed, one dependency linked                                                |
> | PROJ-88   | a refined item       | ready                                                                                                    |
> | PROJ-121  | a title and one line | **not ready** — no acceptance criteria, and the claim about how presets behave today carries no evidence |
>
> I do not ask PROJ-118 for acceptance criteria: it is a defect report and was never meant to
> carry them. PROJ-121 can go in anyway if you want it in. [`jira-refine`](jira-refine.md) is what
> makes it ready — I will not write criteria into it on the way past.

**You**

> Keep it in. We will write the criteria Monday morning, before anyone picks it up.

**`jira-plan`**

> Then this is the operation, with PROJ-121 recorded as going in unrefined. Approve it and I run
> the whole set, or tell me what to change.

**You**

> Go ahead.

**`jira-plan`**

> Four moved, none failed. One thing is left and it is yours: Sprint 25 is still `future`, and
> starting it is not available on either channel. Start it on the Delivery board and you are
> planned.

## The result

Two blocks reach you, and the first is the one that matters — the operation exactly as the gate
presents it, before anything moves.

```text
Sprint 25 — Delivery board — future, starts Monday
Moving in: 4 work item

  PROJ-118   Scheduled export produces an empty file when the range crosses a month boundary
  PROJ-120   Recipients choose which columns an export carries
  PROJ-121   Export presets                                              <- not ready
  PROJ-88    Column definitions are read once at start-up and never refreshed

Not ready, and planned anyway at your request:
  PROJ-121   no acceptance criteria; the claim about today's behaviour carries no evidence

Untouched by this operation: no transition is run, no fix version is assigned, and the
backlog keeps the order it has.

Approve and I run it?
```

Then, once approved, what actually happened:

```text
Sprint 25 — 4 of 4 moved

  PROJ-118  in     PROJ-120  in     PROJ-121  in     PROJ-88  in

Still yours to do:  Sprint 25 is `future`. Starting it is available on neither channel —
                    start it on the Delivery board.
```

What makes the first block the useful one is where PROJ-121 appears: in the list of what will move,
and again in the list of what is not ready. A flag raised after the sprint is full is a note nobody
reads; raised here it is a decision you take, and the operation you approve carries the exception
in writing. The second block reports four writes made under one approval — had one of them failed,
it would name which moved and which did not and stop there, because whether a partial result is
kept or undone is yours to decide. And the line that is left is left, not faked: starting a sprint
is not something this plugin can do, so it says whose job it is instead of inventing something that
looks like a started sprint.

## What it will not do

- **Create a sprint, or start one.** Neither is available on either channel. It asks you to do both
  on the board, and it will not stand a label or a naming convention in for the sprint that is
  missing.
- **Make an item ready.** It says what is missing and names [`jira-refine`](jira-refine.md).
  Acceptance criteria written on the way into a sprint are criteria nobody agreed to.
- **Decide what ships together.** A sprint and a fix version are orthogonal axes;
  [`jira-release`](jira-release.md) owns the other one.
- **Run a transition.** Planning puts work into a sprint. Starting an item, handing it over or
  closing it is [`jira-advance`](jira-advance.md).
- **Reorder a backlog by its own judgement of priority.**
- **Close a sprint over unfinished work without asking where each item goes.** Silence at close
  removes work from the plan without anyone having chosen that.

## See also

- [The development process](../development-process.md) — the project profile, the two channels and
  the gaps they declare, the draft gate, and where planning sits in the whole path.
- [`jira-refine`](jira-refine.md) — to make an item ready before it is planned.
- [`jira-release`](jira-release.md) — to decide what ships together, which is the other axis.
- [`jira-advance`](jira-advance.md) — to run the next transition on a single work item.
- [`jira-inspect`](jira-inspect.md) — to read what a sprint holds without changing any of it.
