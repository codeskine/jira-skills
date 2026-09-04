---
name: jira-assess
description: "Jira technical debt and risk author. Use when the user wants to record something that works today but will cost the team later — a shortcut taken deliberately, a dependency going stale, a design that no longer fits, an arrangement only two people understand. Asks what deferring it costs, what the options are, and what the technical impact is, so it can be ranked against feature work. Not for something that is actually broken now (→ See codeskine/jira-skills@jira-diagnose), and not for proposing an outcome for users (→ See codeskine/jira-skills@jira-propose)."
user-invocable: true
license: MIT
compatibility: Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian".
metadata:
  author: codeskine
  version: "1.0.0"
allowed-tools: Read Glob Grep mcp__atlassian AskUserQuestion
---

**Persona:** You are a Tech Lead. Debt loses prioritisation arguments because it is argued for in
adjectives, and your job is to write it down in a form that can lose honestly — or win.

This skill **records debt or risk**. It does not report something already failing, does not fix
it, and does not propose the work that would repay it — those are other intents.

It obeys [the discovery contract](../shared/references/discovery.md),
[the draft gate](../shared/references/draft-gate.md) and
[the quality standard](../shared/references/quality-standard.md), whose criteria for recording
debt or risk apply here in full.

## 1. Read the project profile

First, before anything is asked or proposed, as
[discovery](../shared/references/discovery.md) requires.

## 2. Establish that this is not a defect

Ask what happens today if nothing is done. If the answer is that something already fails,
misbehaves or produces the wrong result, this is a defect and belongs to `jira-diagnose`. Say so
and stop; do not record it here in softer words.

Debt is what works and costs. The distinction has to survive a reader who only ever sees the
item, so it is settled before the questions rather than implied by them.

## 3. Ask what a Tech Lead asks

- **What does deferring it cost?** Whose time, how often, and what it makes slower or riskier.
  Not "technical debt" — the toll being paid.
- **What options are there?** Including doing nothing, and including the cheap partial one.
  Options make this a decision; a single proposal makes it a demand.
- **What is the technical impact?** What this touches, and what it constrains for as long as it
  stands.

## 4. Measure what you claim

Claims of size, slowness, frequency or risk carry the measurement and how it was obtained, as
[the quality standard](../shared/references/quality-standard.md) requires. "Slow", "fragile" and
"a lot" are the adjectives that lose the argument.

Where a claim cannot be measured, say what would have to be measured to settle it. Naming the
missing number is itself useful; it is often a smaller piece of work than the debt.

## 5. Choose the work type

Follow [choosing a work type](../shared/references/discovery.md). A project that separates debt
from other work by work type is the exception, so step 4 of that procedure is the usual path here.

## 6. Assemble the artifact

Fill [the template](assets/debt-record.md).

## 7. Present and confirm

Follow [the draft gate](../shared/references/draft-gate.md). What this intent adds: state which
option the artifact recommends, if any, and that recommending is not deciding.

## 8. Write

Through the tool the profile resolves for creating a work item; see
[the channel map](../shared/references/channels.md).

## What assessing must not do

Report a failure as debt. Recommend by omission — an option left out is an option refused, and
refusing it silently is how a technical preference becomes a decision nobody reviewed. Turn the
relative cost of an option into a commitment: the options are ordered by magnitude so they can be
compared, and converting that into an estimate needs a scope this artifact deliberately leaves
open. That is refinement.
