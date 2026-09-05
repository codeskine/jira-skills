---
name: jira-advance
description: "Jira transition runner. Use when the user wants a Jira work item to reach its next status — start it, hand it over, put it back, close it — without opening Jira. Offers only the transitions the item allows at that moment, asked of Jira rather than inferred, and explains why an expected one is unavailable. Not for reading where things stand (→ See codeskine/jira-skills@jira-inspect), and not for moving a work item into or out of a sprint, whether one or many (→ See codeskine/jira-skills@jira-plan)."
user-invocable: true
license: MIT
compatibility: Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian".
metadata:
  author: codeskine
  version: "1.0.0"
allowed-tools: Read Glob Grep mcp__atlassian AskUserQuestion
---

This skill **transitions one work item to another status**. It does not plan, does not refine and
does not report; those are other intents.

It obeys [the discovery contract](../shared/references/discovery.md) and
[the draft gate](../shared/references/draft-gate.md).

## 1. Read the project profile

First, as [discovery](../shared/references/discovery.md) requires.

The profile records the shape of the Jira Workflow. It is **not** the source of truth for what
this item can do right now, and this skill never proposes a transition from it.

## 2. Ask Jira what this item can do

Transitions are evaluated per work item, not per work type: two items of the same type, in the
same status, can offer different transitions depending on conditions, permissions and the item's
own fields.

So ask, for this item, at this moment. Never infer a transition from the work type, from the
profile's table of statuses, or from a diagram this plugin owns — none of them knows about the
condition that will refuse it.

## 3. Offer only what came back

Present the transitions Jira returned, named as Jira names them, and let the user choose. One
that is not in that list is not offered, however reasonable it sounds.

## 4. Explain an absence

When the user expects a transition that is not there, say which of the two it is:

- **the item** — a condition on the transition is unmet: a required field, a permission, the
  state of something the item depends on;
- **the Jira Workflow** — no such transition exists from this status at all, for anyone.

The first is something the user can act on. The second only a project admin can change.
Reporting "unavailable" without saying which sends the user to the wrong person.

**What tells them apart is the profile.** Its table of statuses records what is reachable from
what — the shape of the Jira Workflow, which is the reason it is recorded at all — while Jira's
answer for this item records what is available right now. The difference between the two is the
cause:

- **named in the shape, absent from Jira's answer** → the item. The path exists, and something
  about this one is closing it.
- **absent from both** → the Jira Workflow. There is no such path from this status, and no field
  the user could fill would produce one.

This is the one use that table has here, and it is not the use § 2 refuses: nothing is offered
from it, and the transitions presented are still only the ones Jira returned.

**Where the profile cannot answer, say so instead of choosing.** Two of its three states are
silence — statuses not observable yet because the project holds no work item, and a table recorded
as not read. Then report that the transition is not available and that which of the two causes it
is cannot be established here, with the manual path, and name `jira-init` where a run would fill
the table in. A cause named by guess sends the user to repair something that is not broken, which
is worse than a cause not named.

## 5. Confirm and perform it

Follow [the draft gate](../shared/references/draft-gate.md) in its **operation** form: the item,
the status it is in, and the status it will reach. Then perform the transition through the tool the profile resolves; see
[the channel map](../shared/references/channels.md).

Report the status the item is in afterwards, read back rather than assumed. A transition can
succeed and land somewhere other than expected, when the Jira Workflow routes it onward.

## What advancing must not do

Fill a required field to make a refused transition succeed. Transition an item somebody else is
holding, without saying so. Chain several transitions to reach a distant status — each one is a
decision, and a Jira Workflow that requires three of them is telling you something the user
should hear.
