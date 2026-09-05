# `jira-assess` — record debt or risk

<!-- skill-header:start -->

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Name**              | `jira-assess`                                                                          |
| **Version**           | 1.0.0                                                                                  |
| **Invocable by name** | yes                                                                                    |
| **Channel**           | Atlassian MCP server                                                                   |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## What it does

Records something that works today and will cost the team later — a shortcut taken deliberately,
a dependency going stale, a design that no longer fits, an arrangement only two people
understand. It asks what deferring it costs, what the options are including doing nothing, and
what the thing constrains for as long as it stands — then shows you the finished record and
waits. Nothing reaches Jira until you approve it.

It is a Tech Lead's set of questions. Debt loses prioritisation arguments because it is argued
for in adjectives, and the whole point is to write it down in a form that can lose honestly — or
win.

## When it fires · when it does not

It fires when nothing is failing and you still want the cost put on the record.

| Say something like                                 | And this is the skill you get       |
| -------------------------------------------------- | ----------------------------------- |
| "this works but it will bite us in six months"     | `jira-assess`                       |
| "the export comes out empty, we need to file this" | [`jira-diagnose`](jira-diagnose.md) |
| "we want customers to see their history"           | [`jira-propose`](jira-propose.md)   |
| "finance sent this over, nobody has looked at it"  | [`jira-capture`](jira-capture.md)   |

The boundary with [`jira-diagnose`](jira-diagnose.md) is guarded from both sides on purpose.
_"This keeps flaking"_ fits either description, so the first question here is what happens today
if nothing is done. If the answer is that something already fails, misbehaves or produces the
wrong result, this skill says so and stops rather than recording a defect in softer words.

## How to use it

You do not need to name the skill. Say what is going to cost you, in your own words, and answer
the questions.

**1 · It reads the project profile first.** Before it asks you anything, it reads
`.jira/project-profile.md` to learn how your project is configured. If that file is missing it
stops and tells you to run `jira-init` — it does not guess. See
[the development process](../development-process.md) for what the profile holds and why.

**2 · It establishes that this is not a defect.** The first thing it asks is what happens today
if nothing is done. Debt is what works and costs, and the distinction has to survive a reader who
only ever sees the finished work item, so it is settled before the other questions rather than
implied by them.

**3 · It asks three questions.** What deferring it costs — whose time, how often, and what it
makes slower or riskier; not the phrase "technical debt" but the toll being paid. What the
options are, including doing nothing and including the cheap partial one, because options make
this a decision where a single proposal makes it a demand. And what the technical impact is: what
this touches, and what it constrains for as long as it stands.

**4 · It measures what it claims.** Size, slowness, frequency and risk arrive with the number and
how it was obtained. "Slow", "fragile" and "a lot" are the adjectives that lose the argument.
Where a claim cannot be measured, the record says what would have to be measured to settle it —
naming the missing number is useful on its own, and it is often a smaller piece of work than the
debt.

**5 · It chooses a work type from your project, not from a list it carries.** Expect there to be
no work type for debt at all: a project that separates debt from other work by work type is the
exception. When that is the case the skill files the record under another type and the artifact
itself says which intent it serves, so the distinction is not lost.

**6 · Then the draft gate.** The complete record appears in chat with the decisions it carries —
title, work type, parent, anything the project marks required and the draft left empty. You
approve, or you ask for changes and see it again. This skill adds one thing to the gate: it
states which option the record recommends, if any, and that recommending is not deciding.

## Worked exchange

**You**

> Our scheduled jobs are configured in three separate places that have to be kept in step by
> hand. Nothing is on fire. I would like it written down before we forget it is there.

**`jira-assess`**

> Let me pin down "nothing is on fire" before anything else. If nobody touches those
> configurations today, does anything fail, run late, or come out wrong?

**You**

> No. Every job runs, on time, and has done for the last year. The cost lands on whoever changes
> a schedule, not on whoever depends on one.

**`jira-assess`**

> Then this is a record of debt and not a defect, and it will open by saying so. What does a
> schedule change cost you at the moment?

**You**

> Three configurations to edit, kept consistent by reading them side by side. Two people can do
> it confidently.

**`jira-assess`**

> Two people is a number. Can you get me the others — how many changes, how many went wrong, how
> long one takes? A record that says "error-prone" loses to a feature request every time.

**You**

> The change history says 14 schedule changes in the last six months. Four were wrong on the
> first attempt and review caught them. One reached the shared environment and we found it the
> next morning — about three hours between two people, it is in the incident note from 11 June.
> Time from first to final edit averages about 40 minutes; the same change in one place is about 5.

**`jira-assess`**

> Good. Now the options, and leaving it exactly as it is has to be one of them.

**You**

> Leave it: the extra 35 minutes a change, forever, and the same mistakes. A consistency check in
> the review path would catch disagreement before it ships — a day, maybe. Or move the schedule
> to one place and generate the other two: around a week, one migration, and we would want a way
> back.

**`jira-assess`**

> And what does the three-place arrangement stop you doing while it stands?

**You**

> Every new scheduled job inherits it, so the toll grows with the number of jobs instead of
> staying flat. And schedule changes stay with the two people who know the arrangement.

**`jira-assess`**

> One field I cannot fill: this project marks **Team** required on creation, and the scheduling
> arrangement is not owned by a single team, so I am raising it rather than guessing. Your
> project also has no work type for debt, so I will file this as a Task and the record will say
> what it is. It recommends the consistency check first, and says that recommending is not
> deciding — all three options stay in the table. Here is the whole thing: approve it and I write
> it, or tell me what to change.

## The result

The record as it reaches Jira. It is Markdown, and it arrives interpreted — headings, lists and
the options table survive the write.

```markdown
# Scheduled jobs are configured in three places that must agree by hand

## What works today

Every scheduled job runs, on time, and has done for the last year. Nothing is failing and no
recipient is affected. The cost is paid by the people who change a schedule, not by the people
who depend on one.

## What it costs to defer

A schedule change means editing three separate configurations and keeping them consistent by
reading. Two people can do it confidently.

Over the last six months there were 14 schedule changes. Four of them were wrong on the first
attempt and were caught in review; one reached the shared environment and was found the next
morning, costing about three hours between two people. Time spent on a schedule change averages
40 minutes, against roughly 5 for the same change in the one place it should live.

## Options

| Option                                            | What it takes                                                         | What it leaves                                            |
| ------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| Do nothing                                        | ~35 extra minutes per change, ongoing; the same class of error recurs | Two people able to change a schedule; the risk unchanged  |
| Add a consistency check to the review path        | Around a day; no change to how schedules are written                  | The three places, but disagreement caught before it ships |
| Move the schedule to one place, generate the rest | Around a week; one migration with a rollback                          | One place to change, and anyone able to change it         |

Recommended: the consistency check first, because it removes the error class at a tenth of the
cost and does not foreclose the full change. This is a recommendation; prioritising is not mine
to do.

## Technical impact

Any work that adds a scheduled job inherits the three-place cost, so the toll grows with the
number of jobs rather than staying flat. It also keeps schedule changes with the two people who
know the arrangement, which is a bus factor nobody chose.

## Measurements

- 14 schedule changes in six months, counted from the change history.
- 4 wrong on first attempt, from review comments on those changes; 1 reaching the shared
  environment, from the incident note of 2026-06-11.
- ~40 minutes average per change, from the time between first and final edit on those 14; ~5
  minutes is the equivalent for a single-place edit, measured on three comparable changes.
- Not measured: whether the two people who do this consider it a burden. Nobody has asked them,
  and their answer would change the ranking.

## Required fields not yet filled

- **Team** — this project marks it required on creation, and the scheduling arrangement is not
  owned by a single team. Raised at the draft gate rather than guessed.

## Work type

This is a record of debt. It is filed under Task because this project's scheme has no work type
that names one.
```

The point of a record like this is that it can lose. It opens by saying what works, so nobody
reads it as a failure. It prices deferral in hours somebody actually counted, so it can be set
against a feature request instead of argued about. And doing nothing sits in the table with its
cost stated, rather than being left out as the thing the author is arguing against.

Two smaller things are deliberate. The last measurement is one that does not exist — nobody has
asked the two people whether the arrangement bothers them — and naming the missing number is
worth more than a fourth number invented to match the others. And the template fixes the
sections, never the language: the same record produced by a conversation in another language
comes out in that language, with these headings translated and the work type carried across
exactly as the project reports it.

## What it will not do

- **Record something that is failing today.** If it already breaks, misbehaves or produces the
  wrong result it is a defect, it belongs to [`jira-diagnose`](jira-diagnose.md), and this skill
  says so and stops rather than writing the same thing in softer words.
- **Recommend by omission.** An option left out is an option refused, and refusing one silently
  is how a technical preference becomes a decision nobody reviewed.
- **Turn the cost of an option into a commitment.** The options are ordered by magnitude so they
  can be compared; converting that into an estimate needs a scope this record deliberately leaves
  open, and that is [`jira-refine`](jira-refine.md).
- **Decide.** It may recommend, and where it does it says that it is recommending. Prioritising
  belongs to whoever prioritises.
- **Claim a size it has not measured.** "Slow", "fragile" and "a lot" do not survive the draft.
  Where the number does not exist yet, the record names the measurement that would settle it.
- **Repay the debt, or write the work that would.** It records the cost. What gets done about it
  is a separate item, decided by someone else.

## See also

- [The development process](../development-process.md) — the project profile, the draft gate, the
  two channels, and where recording debt sits in the whole path.
- [`jira-diagnose`](jira-diagnose.md) — for something that fails today.
- [`jira-refine`](jira-refine.md) — for turning this record into work a team can pick up, with a
  scope and acceptance criteria.
- [`jira-propose`](jira-propose.md) — for an outcome someone wants, rather than a cost the team is
  already paying.
