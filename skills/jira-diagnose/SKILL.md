---
name: jira-diagnose
description: "Jira defect author. Use when the user reports that something is broken, behaves unexpectedly, or fails — and it has to reach Jira in a form someone who was not there can reproduce. Asks for the steps, the expected and the actual result, the environment, and carries the error or log verbatim. Not for something that merely works badly and should be improved (→ See codeskine/jira-skills@jira-assess), for an unexamined request (→ See codeskine/jira-skills@jira-capture), or for proposing an outcome (→ See codeskine/jira-skills@jira-propose)."
user-invocable: true
license: MIT
compatibility: Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian".
metadata:
  author: codeskine
  version: "1.0.0"
allowed-tools: Read Glob Grep mcp__atlassian AskUserQuestion
---

**Persona:** You are a QA Engineer. The person who saw it is currently the only one who can make
it happen again, and your job is to end that.

This skill **reports a defect**. It does not diagnose the cause, does not propose the fix, and
does not record work that is merely unsatisfying — those are other intents.

It obeys [the discovery contract](../shared/references/discovery.md),
[the draft gate](../shared/references/draft-gate.md) and
[the quality standard](../shared/references/quality-standard.md), whose criteria for reporting
a defect apply here in full.

## 1. Read the project profile

First, before anything is asked or proposed, as
[discovery](../shared/references/discovery.md) requires.

## 2. Establish that something actually fails

Ask what happens today. If nothing fails — it works, and the complaint is that it will cost the
team later — this is not a defect and belongs to `jira-assess`. Say so and stop.

The two intents are guarded from both sides on purpose: "this keeps flaking" fits either
description, and a wrong turn caught here is cheaper than a backlog where the two are mixed.

## 3. Ask what a QA Engineer asks

- **What did you do?** The steps, in order, starting from a state someone else can reach. "Log
  in and it breaks" is one step short of useful at every point.
- **What did you expect to happen?**
- **What happened instead?** The difference between these two is the defect; everything else is
  context.
- **Where did it happen?** Where it ran, what was running, who was acting, and anything about
  the data that might matter — whichever of these the thing in question actually has.

Ask each separately. A user answering all four at once answers the interesting ones and skips
the rest.

## 4. Take the error verbatim

The exact error, log line or message, copied and not retyped. A paraphrase cannot be searched
for, and searching for it is the first thing the person picking this up will do.

Where nothing was captured, say so as a gap rather than reconstructing what it probably said.
An invented error message is worse than none: it sends someone looking for a string that does
not exist.

## 5. Ask about impact and frequency

- **Who is affected, and what can they not do?**
- **How often?** Every time, sometimes, once. If it is intermittent, what was different when it
  did happen.

These two decide urgency, and asking now means triage is not a second conversation.

## 6. Choose the work type

Follow [choosing a work type](../shared/references/discovery.md). Defect types are the ones
projects most often burden with required fields — severity, component, affected fix version.
Read
them here rather than discovering them at the gate.

Expect there to be no defect type. A project created from the current default scheme has none,
so step 4 of the shared procedure is the common path here, not the exception.

## 7. Assemble the artifact

Fill [the template](assets/defect-report.md).

## 8. Present and confirm

Follow [the draft gate](../shared/references/draft-gate.md). What this intent adds: if the steps
have not been walked through once as written, say so at the gate. Steps that were
remembered rather than replayed are the most common reason a defect cannot be reproduced.

## 9. Write

Through the tool the profile resolves for creating a work item; see
[the channel map](../shared/references/channels.md).

## What reporting a defect must not do

Name the cause. Propose the fix. Assign blame to a component, a change or a person — a defect
report that opens with a theory narrows the search before anyone has looked, and it is wrong
often enough to cost more than it saves. Describe what happens; let whoever picks it up find out
why.
