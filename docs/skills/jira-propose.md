# `jira-propose` — propose value

<!-- skill-header:start -->

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Name**              | `jira-propose`                                                                         |
| **Version**           | 1.0.0                                                                                  |
| **Invocable by name** | yes                                                                                    |
| **Channel**           | Atlassian MCP server                                                                   |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## What it does

Records an outcome someone wants, in a form that survives a prioritisation discussion. It asks
what becomes true if the work is done, who benefits and how they suffer today, and how anyone
would know it worked — then it asks for the datum or the metric behind all of that, and separates
what is measured from what is believed. The finished proposal appears in chat and nothing reaches
Jira until you approve it.

It is a Product Owner's set of questions. A backlog of solutions nobody can rank gets ranked by
whoever argues hardest, and the outcome the work was for is the first thing to disappear.

## When it fires · when it does not

It fires when you want an outcome recorded and defended on its own terms, before anyone decides
how to reach it.

| Say something like                                 | And this is the skill you get       |
| -------------------------------------------------- | ----------------------------------- |
| "we want customers to see their history"           | `jira-propose`                      |
| "finance sent this over, nobody has looked at it"  | [`jira-capture`](jira-capture.md)   |
| "the export comes out empty, we need to file this" | [`jira-diagnose`](jira-diagnose.md) |
| "this works but it will bite us in six months"     | [`jira-assess`](jira-assess.md)     |

The line against [`jira-capture`](jira-capture.md) is **the datum**. Relaying someone else's wish
with nothing checkable behind it at all is intake — capture records it in the words it arrived in
and says so — and it stays intake however clearly the outcome is described. That bar is read against
the whole of what was relayed, never as a list of answers to tick, and it is lower than it sounds:
any figure saying the problem is real clears it, and a target is not required. _About forty calls
last month_ is enough, and the skill then asks what success would have to look like. What it will
not do is manufacture the outcome, the audience or the measure by asking harder.

The line downstream is [`jira-refine`](jira-refine.md). Proposing states the value and stops.
Acceptance criteria, a scope small enough to finish, and the children the proposal implies are
refinement's, and producing them here would produce children nobody agreed to.

## How to use it

You do not need to name the skill. Say what you want to be true, and answer the questions.

**1 · It reads the project profile first.** Before anything is asked, `.jira/project-profile.md`
tells it which work types this project has, how they nest, and which fields are required on
creation. If the profile is missing it stops and tells you to run `jira-init` — it does not guess.
It also checks one operation in particular: setting a parent. This is the intent that depends on it,
so if the profile records that operation as unsupported you hear it now, with the manual path,
rather than after a draft you cannot have. That is not a theoretical branch: what lands in that list
is what discovery could not resolve **on this installation** — no tool for it, a channel that did
not answer, an account not permitted — which is a different thing from an operation the tooling has
no route to anywhere. See [the development process](../development-process.md).

**2 · It asks what a Product Owner asks.** Three questions, and each one is refused a certain
kind of answer:

| It asks                                     | And does not accept                                              |
| ------------------------------------------- | ---------------------------------------------------------------- |
| what outcome do you want?                   | a list of features — it asks what those features would make true |
| who benefits, and how do they suffer today? | "users" — an audience nobody could go and ask is not an audience |
| how will we know it worked?                 | a claim with no observation or number attached to it             |

A proposal whose author cannot say who benefits is not yet a proposal, and saying so now is
cheaper than saying it in a prioritisation meeting.

**3 · It asks for the datum, and marks what is missing.** This is the demand that distinguishes
this skill from the rest of intake: for each claim that could be checked, the measurement or the
observation behind it, and how it was obtained. Anything left with nothing behind it is not
dropped and not quietly kept — it is written under **Assumptions** and attributed to whoever
holds it, so that whoever ranks the proposal can see which half of it is belief.

**4 · It chooses a work type from your project, not from a list it carries.** The type is settled
before the parent, because the type decides which level of the hierarchy the next step looks at.
If your project's scheme has no type that names this intent, the skill files the proposal under
another one and the artifact itself says which intent it serves.

**5 · It places the item under a parent as it creates it.** The profile says which types may
contain the chosen one; the skill searches Jira for the items of those types and offers what
comes back. Placing it at creation is the point — a hierarchy repaired afterwards is a hierarchy
that was wrong on the board in between. Where the project's hierarchy allows no parent for that
type, or none of the candidates fits, it says so and creates the item without one. It never
invents a container to hold it.

**6 · Then the draft gate, which here is an artifact gate.** What you approve is the complete
content of the work item, section by section. Its other form, an operation gate, shows a change
reaching things that already exist — a sprint filled, work assigned to a fix version, an item moved
to its next status — and authoring never produces one. The proposal appears in chat with the
decisions it carries — title, work type, parent, anything this project marks required that the draft
left empty, and, where your request carried a second intent this proposal does not satisfy, that
intent and the skill that owns it — which takes over once this write is done, with a gate of its
own. You approve, or you ask for changes and see it again. Or you say no, and that is an answer:
nothing is written, you are told what holds instead, no thinner proposal is offered in the hope that
one passes, and a later message about something else is not read as a change of mind. This intent
adds one thing to the gate: when the item will have no parent, the gate says why not.

**7 · After the write, it reports what did not happen.** If the item is created but the parent
cannot be set, you are told. A proposal sitting at the wrong level is something you have to see,
not a step to retry quietly.

## Worked exchange

**You**

> People are dropping out of checkout when the delivery cost appears. I want it on the backlog
> before we plan on Friday.

**`jira-propose`**

> What has to become true for that to be fixed? Describe it as a change for the person buying,
> not as the screen we would build.

**You**

> They should know what delivery costs before they start typing an address.

**`jira-propose`**

> Who is that, specifically? Someone has to be able to go and ask them, so "customers" is too
> wide to rank anything against.

**You**

> People buying one low-value item, where delivery is a big share of the total. And support —
> they answer the same question all week.

**`jira-propose`**

> How would we know it worked? Something you can look at afterwards and can already look at now.

**You**

> Abandonment at the address step. It is 34% at the moment.

**`jira-propose`**

> Where does the 34% come from, and is there anything to compare it against?

**You**

> The funnel report, last full quarter. The returning-customer path is 12% over the same period,
> and there the cost is known before that step. Support tagged "delivery cost" on 512
> conversations in three months.

**`jira-propose`**

> Two of the claims underneath that are not measured, and I want them placed rather than
> smuggled: that cost visibility is what explains the gap between the two paths, and that the
> people who abandoned would have bought. Is either of those tested?

**You**

> No. Nobody has asked them.

**`jira-propose`**

> Then they go under Assumptions, attributed to you, and the two figures go under Evidence. This
> project files this kind of proposal as a Story, and Story sits under Epic here. The search came
> back with two that could hold it: PROJ-31 "Checkout" and PROJ-58 "Pricing and fees".

**You**

> Checkout.

**`jira-propose`**

> Parent PROJ-31, then. Your project marks Team required on creation and nothing you have told me
> fills it, so the draft flags it instead of guessing. Here is the whole thing — approve it and I
> write it, or tell me what to change.

## The result

The proposal as it reaches Jira. It is Markdown, and it arrives interpreted — headings and lists
survive the write.

```markdown
# Delivery cost visible before the address is entered

## Outcome sought

Someone deciding whether to buy can see what delivery will cost them before they commit to typing
an address. The decision they are actually making — is this worth it in total — stops being one
they can only make at the end.

## Who benefits

People buying a single low-value item, where delivery is a large share of the total. Today they
reach the last step, see the total and leave; the ones who do come back tell support they assumed
the price shown was the price.

Also the support team, who answer the same question about delivery cost roughly forty times a
week.

## How success is measured

The share of sessions abandoned at the address step, which is 34% now. A proposal that worked
would move it toward the 12% abandoned at the equivalent step on the returning-customer path,
where the cost is already known.

Secondary: the volume of delivery-cost questions reaching support, counted from their queue tags.

## Evidence

- Abandonment at the address step is 34% over the last full quarter, from the funnel report; the
  returning-customer path, where the cost is known earlier, sits at 12% over the same period.
- Support logged the term "delivery cost" against 512 conversations in the last three months, an
  average of 39 a week.

## Assumptions

- That cost visibility is what explains the gap between the two paths, rather than the paths
  differing in who walks them. Held by the Product Owner; not tested.
- That people who abandon would have bought had they seen the cost earlier. Nobody has asked
  them.

## Required fields not yet filled

- **Team** — this project marks it required on creation, and which team owns the purchase path
  has not been decided. Raised at the draft gate rather than guessed.
```

The split between **Evidence** and **Assumptions** is what this proposal is for. Two of the four
claims are checkable and carry how they were obtained; the other two are beliefs and say so, with
a name against them. That is what lets someone rank this against a proposal whose claims are all
backed — and it is the difference between a proposal that survives the meeting and one that is
defended by whoever is in the room.

The measure is a comparison that already exists rather than a target somebody invented. 34% today
against 12% on a path where the cost is known earlier is a number the proposal did not choose and
cannot flatter.

Of the two optional sections the template offers, one is present and one is absent, and both for
the same reason. **Required fields not yet filled** is there because the project marks Team
required and the answers did not cover it. The section reserved for a work type standing in for
an intent the project cannot name is gone, because here the scheme had one that fits; where it
does not, the artifact says which intent it serves, as [`jira-diagnose`](jira-diagnose.md) shows.
A heading with nothing under it reads as an oversight, so it is removed rather than left blank.

## What it will not do

- **Decide how the outcome will be reached.** State the value and stop. A proposal that arrives
  with the solution attached settles the design before anyone has discussed it, and it is the
  outcome, not the design, that has to survive being ranked.
- **Write acceptance criteria, or estimate.** Both belong to [`jira-refine`](jira-refine.md),
  which is where the proposal goes once it has been picked.
- **Split the proposal into the work it implies.** That is refinement too, and doing it here
  produces children nobody agreed to.
- **Dress a belief as a fact.** A claim with nothing behind it goes under **Assumptions** with
  the name of whoever holds it. Nothing is silently promoted for reading well.
- **Invent a parent to hold it.** Where the project's hierarchy allows none for the chosen type,
  the item is created without one and the gate says why.

## See also

- [The development process](../development-process.md) — the project profile, the draft gate, the
  two channels, and where proposing value sits in the whole path.
- [`jira-capture`](jira-capture.md) — for a wish relayed second-hand with no figure behind it at
  all.
- [`jira-diagnose`](jira-diagnose.md) — for something that is broken today.
- [`jira-assess`](jira-assess.md) — for something that works today and will cost the team later.
- [`jira-refine`](jira-refine.md) — for turning an approved proposal into something a team can
  pick up.
