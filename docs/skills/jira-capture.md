# `jira-capture` — record a request as it arrived

<!-- skill-header:start -->

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Name**              | `jira-capture`                                                                         |
| **Version**           | 1.0.0                                                                                  |
| **Invocable by name** | yes                                                                                    |
| **Channel**           | Atlassian MCP server                                                                   |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## What it does

Records a request that arrived from outside the team — an email, a chat message, a note taken
during a call — in the words it arrived in, before anyone has worked out what it means. It keeps
the original wording, notes who asked and by what route, asks three short questions, and lists
what the request does not answer. Then it shows you the whole thing and waits: nothing reaches
Jira until you approve it.

A request nobody writes down is a request the team never sees; one dressed up as ready is worse,
because someone will plan it. This is the one skill in the plugin that deliberately creates
something incomplete, and that is allowed only because the work item says so — raw, no
refinement yet, not ready to be planned, with [`jira-refine`](jira-refine.md) named as the intent
that owns it next.

## When it fires · when it does not

It fires when something arrives from outside and has to be on Jira before anyone has examined it.

| Say something like                                 | And this is the skill you get       |
| -------------------------------------------------- | ----------------------------------- |
| "finance sent this over, nobody has looked at it"  | `jira-capture`                      |
| "write it down as it stands, we work it out later" | `jira-capture`                      |
| "let's agree criteria on this one and split it"    | [`jira-refine`](jira-refine.md)     |
| "we want customers to see their history"           | [`jira-propose`](jira-propose.md)   |
| "the export comes out empty, we need to file this" | [`jira-diagnose`](jira-diagnose.md) |

The boundary that matters is the one with [`jira-refine`](jira-refine.md), and it runs in one
direction: capture opens the path and refinement closes it. If you can already say what "done"
would look like, the request has been examined and this is the wrong intent — everything capture
adds at that point is a decision nobody made.

Something broken that arrives from outside can be capture's or
[`jira-diagnose`](jira-diagnose.md)'s, and what decides is **the material, not who sent it**. If
the relayed text already carries what makes a fault reproducible — the steps and the environment —
it is a defect report and belongs to `jira-diagnose`, however plainly it arrived from elsewhere.
If it carries neither, nobody here can supply them, and recording the complaint in the sender's
words is the honest version. The same test runs against [`jira-propose`](jira-propose.md): a
relayed wish with no datum behind it is intake.

The test is deliberately written on the text of the request and not on the people around it.
Whether someone, once asked, would know the answer is a fact about the conversation's future, and
the routing decision is taken before anything has been asked.

## How to use it

You do not need to name the skill. Say that something came in and paste it.

**1 · It reads the project profile first.** Before it asks you anything, it reads
`.jira/project-profile.md` to learn how your project is configured. If that file is missing it
stops and tells you to run `jira-init` — it does not guess. See
[the development process](../development-process.md) for what the profile holds and why.

**2 · It takes the request whole, and keeps it verbatim.** No corrected spelling, no translation,
no tightened phrasing, no summary standing in for the original. The wording is evidence of what
was actually asked, and it is the first thing lost when someone rewrites it in good faith. It also
records who asked, when, and through what route.

**3 · It asks three questions and stops there.** What the requester expects to happen, in their
terms rather than translated into a solution. What they said about timing, in their words. And
whether anything is already known to be missing. Three questions, not an interview — reaching for
a fourth is how intake becomes the bottleneck.

**4 · It records an answer you do not have as not stated.** Never inferred, never filled in with a
plausible guess. The same holds for the list of what the request does not answer: those are
questions, not assumptions, and that list is where refinement will start.

**5 · It recommends a work type meant for unrefined intake, where your project has one.** Where
it has none, it says so at the gate and files the request under another type, and the artifact
itself carries the distinction. It sets no parent, no sprint and no fix version: a raw request has
not earned a place in a hierarchy or a plan, and putting it in one is the mistake this skill
exists to avoid.

**6 · Then the draft gate.** The complete record appears in chat with the decisions it carries —
the title, the work type, and anything the project marks required that the request does not
answer. You approve, or you ask for changes and see it again. This skill adds one thing to the
gate: the statement that the item is raw has to be visible in the draft itself, not merely
intended, and the gate says plainly that what will be created is a raw record rather than planned
work.

## Worked exchange

**You**

> This came in from the Head of Finance this morning and nobody has looked at it yet. Can you get
> it onto Jira as it is, before it gets lost?

**`jira-capture`**

> Paste it exactly as it arrived — I record the wording, not a summary of it. And who sent it,
> when, and through what route?

**You**

> ```
> Hi — every month we get the figures and every month we have to go and dig out the same months
> from last year to compare. Can that just come with it? It's the comparison we actually look at.
> Would be good to have it before the next close if that's possible.
> ```
>
> Head of Finance, it landed on the service desk queue on the 2nd. I am recording it, not them.

**`jira-capture`**

> What do they expect to happen, in their own terms? Not what we would build — what they say
> should be true afterwards.

**You**

> That the monthly figures turn up with the same period from last year beside them, so nobody
> assembles the comparison by hand. They say the comparison is the thing they actually use.

**`jira-capture`**

> Did they say anything about timing?

**You**

> Only "before the next close if that's possible". No date, and nothing about what happens if it
> slips.

**`jira-capture`**

> Then I record the phrase and the absence, and neither becomes a deadline. Reading the request
> back, five things it does not answer:
>
> - which figures — it says "the figures" and names no report
> - whether "the same months from last year" means the same calendar months or the same position
>   in the financial year
> - whether anyone else receives the same figures and would be affected
> - what "the next close" is as a date
> - whether last year's data exists for every period they would expect
>
> Anything to add to that list, or take off it?

**You**

> No, that is the lot.

**`jira-capture`**

> Your project's scheme has a type meant for unexamined intake, `Request`, so that is the one I
> recommend. It marks `Team` required on creation and the request does not say which team owns the
> figures, so the draft names the field rather than filling it. No parent, no sprint and no fix
> version — this has not been refined. Here is the whole thing: approve it and I write it, or tell
> me what to change.

## The result

The work item as it reaches Jira. It is Markdown, and it arrives interpreted — headings, tables
and quoted blocks survive the write.

```markdown
# Monthly figures sent to the finance team without the previous year alongside

> Hi — every month we get the figures and every month we have to go and dig out the same months
> from last year to compare. Can that just come with it? It's the comparison we actually look at.
> Would be good to have it before the next close if that's possible.

## Source

| Field       | Value                                |
| ----------- | ------------------------------------ |
| From        | Head of Finance                      |
| Received    | 2026-09-02                           |
| Route       | Email to the service desk            |
| Recorded by | Service Manager, from the desk queue |

## What the requester expects

That the figures they already receive each month arrive with the equivalent period from the
previous year next to them, so that no one has to assemble the comparison by hand. They describe
the comparison, not the figures, as the thing they actually use.

## Urgency, as stated

"Before the next close if that's possible." No date was given, and no consequence of missing it
was stated.

## Not yet known

- Which figures they mean — the request says "the figures" and does not name a report.
- Whether "the same months from last year" means the same calendar months, or the same position
  in the financial year.
- Whether anyone else receives the same figures and would be affected by the change.
- What "the next close" is as a date.
- Whether the previous year's data is available for every period they would expect.

## Required fields not yet filled

- **Team** — this project marks it required on creation, and the request does not say which team
  owns the figures. Raised at the draft gate rather than guessed.

## Awaiting refinement

This work item is raw. It was captured in the words it arrived in and has had no refinement: it
has no acceptance criteria, no agreed scope and no estimate, and five open questions are listed
above. It is not ready to be planned. `jira-refine` owns it next.
```

What makes this record usable is what it refuses to do. It does not turn a vague sentence into
requirements. It does not guess the date behind "before the next close" — it quotes the phrase and
says no date was given. And it does not hide that half of what matters is still unknown: the five
open questions are the section refinement starts from, not an embarrassment to be smoothed over.
The blockquote under the title is the evidence for all of it, which is why it is reproduced rather
than described.

Two of the template's sections are optional and they behave in opposite ways here. `Required
fields not yet filled` is present because one is unfilled, so the gate raises it instead of the
write failing. `Work type` is absent because this project does have a type for unexamined intake —
where a project has none, that section is what carries the distinction the scheme cannot. And
`Awaiting refinement` is not decoration: it is the declaration that makes an incomplete work item
admissible at all. [`jira-refine`](jira-refine.md) retires that declaration when it refines the
item, which is what keeps a refined item from carrying acceptance criteria beside a statement that
it has none.

## What it will not do

- **Rewrite the request into requirements.** Recording what was asked and agreeing what will be
  built are two different facts, and losing the first makes the second unarguable.
  [`jira-refine`](jira-refine.md) owns the second.
- **Add acceptance criteria, agree scope, or estimate.** All three are refinement, and performing
  them here claims agreement from a conversation that never happened.
- **Judge whether the request is worth doing.** That is an outcome argued with a datum behind it,
  and it belongs to [`jira-propose`](jira-propose.md).
- **Decide who it belongs to.** No parent, no sprint, no fix version, and no owner chosen on the
  requester's behalf.
- **Correct the wording.** No spelling fix, no translation, no tightening. A rewritten request is
  no longer evidence of what was asked.
- **Fill a silence with a plausible answer.** What the requester did not say is recorded as not
  stated, and stays that way until someone asks them.

## See also

- [The development process](../development-process.md) — the project profile, the draft gate, the
  two channels, and where intake sits in the whole path.
- [`jira-refine`](jira-refine.md) — the intent that owns the item next, and the one that retires
  the raw declaration.
- [`jira-propose`](jira-propose.md) — for an outcome someone wants, argued rather than relayed.
- [`jira-diagnose`](jira-diagnose.md) — for something broken that you or your team watched break.
