# `jira-diagnose` — report a defect

<!-- skill-header:start -->

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Name**              | `jira-diagnose`                                                                        |
| **Version**           | 1.0.0                                                                                  |
| **Invocable by name** | yes                                                                                    |
| **Channel**           | Atlassian MCP server                                                                   |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## What it does

Turns something you watched break into a defect report that someone who was not there can
reproduce. It asks for the steps, the expected and the actual result, where it happened, the
error exactly as it was printed, and who is affected — then shows you the finished report and
waits. Nothing reaches Jira until you approve it.

It is a QA Engineer's set of questions, asked in a QA Engineer's order. The person who saw it is
currently the only one who can make it happen again, and ending that is the whole point.

## When it fires · when it does not

It fires when you say something is broken, behaves unexpectedly or fails, and it has to be
recorded.

| Say something like                                 | And this is the skill you get     |
| -------------------------------------------------- | --------------------------------- |
| "the export comes out empty, we need to file this" | `jira-diagnose`                   |
| "this works but it will bite us in six months"     | [`jira-assess`](jira-assess.md)   |
| "finance sent this over, nobody has looked at it"  | [`jira-capture`](jira-capture.md) |
| "we want customers to see their history"           | [`jira-propose`](jira-propose.md) |

The boundary with [`jira-assess`](jira-assess.md) is guarded from both sides on purpose. _"This
keeps flaking"_ fits either description, so the skill establishes early that something actually
fails today; if nothing does, it says so and stops rather than filing a defect that is really a
risk.

The boundary with [`jira-capture`](jira-capture.md) is decided by the material too, and it is
decided **inside this skill** rather than before it. A fault relayed second-hand that carries the
steps or the error is a defect report and belongs here, whoever forwarded it. One that carries
nothing anyone could act on to see it happen is intake: nobody present can answer what this skill
is about to ask. So `jira-diagnose` may well be the skill that starts — and its third step reads
what arrived, says what is missing, and hands the request to `jira-capture` before putting a single
question to the person who forwarded it.

That is deliberate, and it is a correction. The bar used to be stated as a refusal, on the
assumption that a skill declining a request is enough to route it elsewhere. It is not: the
mechanism that chooses a skill matches your words against each description on its own, and does not
weigh one against its neighbour. A bar that only works when two descriptions are read side by side
therefore has to live where the skill can apply it — after it fires.

The bar is not a checklist: an email naming the program it broke in and the version they run, with
no steps and no error, is still intake. It is not a completeness test either — partial material
belongs here, and its gaps are what the questions below are for.

## How to use it

You do not need to name the skill. Describe what broke, in your own words, and answer the
questions.

**1 · It reads the project profile first.** Before it asks you anything, it reads
`.jira/project-profile.md` to learn how your project is configured. If that file is missing it
stops and tells you to run `jira-init` — it does not guess. See
[the development process](../development-process.md) for what the profile holds and why.

**2 · Where the fault was relayed, it checks the material before it asks you anything.** You
forwarded an email; you did not see the fault. So it reads what arrived rather than putting
questions to you about it. Steps, or an error copied exactly, and it carries on here. Neither, and
it says what is missing and hands the request to [`jira-capture`](jira-capture.md) — which is the
point of the check: being asked for reproduction steps you never had is a round trip through
somebody who is not in the room. Reported first-hand, this does not apply; you can answer for the
material yourself.

**3 · It asks four questions, one at a time.** What you did, what you expected, what happened
instead, and where. They are asked separately on purpose: answered all at once, people answer
the interesting ones and skip the rest.

**4 · It wants the error verbatim.** Copied, not retyped and not remembered. A paraphrase cannot
be searched for, and searching for it is the first thing whoever picks this up will do. Where
nothing was captured, the report says nothing was captured — it never reconstructs what the
message probably said.

**5 · It asks who is affected and how often.** These two decide urgency, and asking now means
triage is not a second conversation.

**6 · It chooses a work type from your project, not from a list it carries.** Expect there to be
no defect type at all: a project created from the current default scheme has none. When that is
the case the skill files the report under another type and the artifact itself says which intent
it serves, so the distinction is not lost.

**7 · Then the draft gate.** The complete report appears in chat with the decisions it carries —
title, work type, parent, anything the project marks required and the draft left empty. You
approve, or you ask for changes and see it again. This skill adds one thing to the gate: if the
steps have not been walked through once as written, it says so, because steps that were
remembered rather than replayed are the most common reason a defect cannot be reproduced.

## Worked exchange

**You**

> The scheduled export is producing empty files. Can you file it?

**`jira-diagnose`**

> Before I write anything: what did you do, step by step, starting from something anyone here
> could reach?

**You**

> Open the export screen, set a range from the 28th to the 3rd of the next month, pick the
> delimited format, run it. You get the notification, you open the file, it's just the header.

**`jira-diagnose`**

> And what did you expect at that last step?

**You**

> Six days of rows. The preview on the export screen even said 1,184.

**`jira-diagnose`**

> Was anything logged? Paste it exactly as it came out rather than summarising — I need the
> string someone can search for.

**You**

> ```
> export.worker  range resolved: 2026-08-28 .. 2026-09-03
> export.worker  partition selector matched 0 partitions for range
> export.worker  wrote 0 rows in 41ms — status: completed
> ```

**`jira-diagnose`**

> No error at all, then — it records the run as successful. That goes in as a finding of its own.
> Who is hitting this, and how often?

**You**

> Two teams schedule it monthly, both have been getting empty files. One has been rebuilding it
> by hand. It's every time the range crosses a month boundary.

**`jira-diagnose`**

> Your project has no work type for defects, so I will file this as a Task and the report will
> say it is a defect report. Here is the whole thing — approve it and I write it, or tell me what
> to change.

## The result

The report as it reaches Jira. It is Markdown, and it arrives interpreted — headings, lists and
fenced blocks survive the write.

````markdown
# Scheduled export produces an empty file when the range crosses a month boundary

## Steps to reproduce

1. Open the export screen as a user with the standard reporting role.
2. Set the range to start on the 28th of one month and end on the 3rd of the next.
3. Choose the delimited format and start the export.
4. Wait for the notification and open the file it points to.

## Expected result

A file containing the rows for the six days in the range, as the preview on step 3 announces.

## Actual result

The export completes and reports success. The file contains the header row and nothing else.
The preview on step 3 had announced 1,184 rows.

## Evidence

```
export.worker  range resolved: 2026-08-28 .. 2026-09-03
export.worker  partition selector matched 0 partitions for range
export.worker  wrote 0 rows in 41ms — status: completed
```

No error was raised anywhere: the run is recorded as successful, which is why nobody noticed
until a recipient asked where the figures were.

## Where it happened

- The shared environment, and reproduced in the pre-release one.
- Both were running 4.9.2.
- Reproduced under the standard reporting role and again with full permissions, so it is not a
  permissions difference.
- Any range crossing a month boundary. Ranges inside a single month are unaffected.

## Impact

Anyone exporting a range that crosses a month boundary receives an empty file and is told the
export succeeded. Two teams schedule these exports monthly; both have been receiving empty files
and one of them has been filling the gap by hand.

## Frequency

Every time, when the range crosses a month boundary. Never, when it does not. Reproduced eleven
times out of eleven attempts across two environments.

## Work type

This is a defect report. It is filed under Task because this project's scheme has no work type
that names one.
````

Three things this report does that a hurried one does not. The steps start from a state anyone
can reach, so nobody has to ask what "the export screen" was reachable from. The log is verbatim,
so the absence of an error is itself evidence rather than an impression. And the optional section
the template offers for unfilled required fields is **absent**, because there were none — a
template section with nothing under it reads as an oversight, so it is removed rather than left
blank.

## What it will not do

- **Name the cause.** A defect report that opens with a theory narrows the search before anyone
  has looked, and it is wrong often enough to cost more than it saves.
- **Propose the fix.** Describe what happens; let whoever picks it up find out why.
- **Assign blame** to a component, a change or a person.
- **Record something that works.** If nothing fails today, it belongs to
  [`jira-assess`](jira-assess.md), and this skill says so and stops.
- **Invent an error message.** An invented one is worse than none: it sends someone looking for a
  string that does not exist.

## See also

- [The development process](../development-process.md) — the project profile, the draft gate, the
  two channels, and where reporting a defect sits in the whole path.
- [`jira-assess`](jira-assess.md) — for something that works today and will cost later.
- [`jira-capture`](jira-capture.md) — for a report arriving from outside that nobody has examined.
- [`jira-refine`](jira-refine.md) — for turning this report into something a team can pick up.
