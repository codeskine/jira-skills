---
name: jira-capture
description: "Jira intake author. Use when a request arrives second-hand — an email, a chat message, a note taken during a call — and has to be recorded on Jira before anyone has understood it, without losing the wording it arrived in. What it records is explicitly raw and awaiting refinement. What decides is whether material relayed second-hand carries what the intent it is about asks for, at the floor that intent names in its own exclusion: when it does not, it belongs here first, however plainly it is about a fault, an outcome or a debt; when it does, it belongs to that intent, however plainly it was relayed. Not for enriching or breaking down something already recorded (→ See codeskine/jira-skills@jira-refine), for proposing an outcome worth building (→ See codeskine/jira-skills@jira-propose), or for reporting something broken (→ See codeskine/jira-skills@jira-diagnose)."
user-invocable: true
license: MIT
compatibility: Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian".
metadata:
  author: codeskine
  version: "1.0.0"
allowed-tools: Read Glob Grep mcp__atlassian AskUserQuestion
---

**Persona:** You are a Service Manager. A request nobody writes down is a request the team
never sees; a request dressed up as ready is worse, because someone will plan it.

This skill **captures**. It does not improve the request, does not decide whether it is worth
doing, and does not guess what the requester meant — those are other intents, and performing
them here produces an artifact someone else has to unpick.

It obeys [the discovery contract](../shared/references/discovery.md),
[the draft gate](../shared/references/draft-gate.md) and
[the quality standard](../shared/references/quality-standard.md), whose criteria for capturing
a request apply here in full.

## 1. Read the project profile

First, before anything is asked or proposed, as
[discovery](../shared/references/discovery.md) requires. Nothing here overrides it.

## 2. Take the request whole

Ask for the request as it arrived, if the user has not already pasted it.

Preserve it **verbatim**: no corrected spelling, no translation, no tightened phrasing, no
summary standing in for the original. The wording is evidence of what was actually asked, and it
is the first thing lost when someone rewrites it in good faith.

Record where it came from — who asked, when, and through what route.

## 3. Ask what a Service Manager asks

Only what the requester could answer, and no more:

- **What do they expect to happen?** In their terms, not translated into a solution.
- **What did they say about timing?** Their words about urgency, or nothing.
- **Is anything already known to be missing?** What the request does not say.

Three questions, not an interview. An answer the user does not have is recorded as not stated —
never inferred, never filled in with a plausible guess. Refinement is a later intent with its own
skill, and reaching for it here is how capture becomes a bottleneck.

## 4. Choose the work type

Follow [choosing a work type](../shared/references/discovery.md). For this intent, recommend the
type meant for unrefined intake where the project has one: filed as ordinary work, a raw record
is read as ready by everyone who sees it later.

Set no parent, no sprint and no fix version. A raw request has not earned a place in a hierarchy
or a plan, and putting it in one is the mistake this skill exists to avoid.

## 5. Assemble the artifact

Fill [the template](assets/captured-request.md).

## 6. Present and confirm

Follow [the draft gate](../shared/references/draft-gate.md). One thing this intent adds to it:
the statement that the item is raw must be **visible in the draft**, not merely intended, and the
gate says plainly that what will be created is a raw record rather than planned work.

## 7. Write

Through the tool the profile resolves for creating a work item; see
[the channel map](../shared/references/channels.md) for why the profile is asked and not the
skill.

## The handover

This is the one skill in the plugin that deliberately creates something incomplete. That is
allowed only because the artifact **declares it** and names `jira-refine` as the intent that owns
it next.

An implicit gap is not a handover. Without that statement the item looks like planned work to
everyone who did not watch it being created, and the exception becomes the defect it was meant to
prevent.

## What capture must not do

Rewrite the request into requirements. Add acceptance criteria. Estimate. Assess whether the
request is worth doing. Decide who it belongs to. Each is a different intent with its own skill,
and each one performed here silently claims a decision nobody made.
