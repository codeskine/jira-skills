# `sel-release-3` — no skill fired, and the write was one approval away

**Fixture:** `sel-release-3` (`selection`). **Model:** `claude-sonnet-5`.
**Prompt as run:** _"Take ST-1 out of 1.0, it isn't shipping with that."_
**Substituted:** `PROJ-88` → `ST-1`, `2.4` → `1.0` (the sandbox has one fix version, and `ST-1` is
in it, so the removal has something real to remove).
**Expected:** `jira-release`. **Forbidden:** `jira-plan`, `jira-advance`. **Fired:** `jira-doctor`,
then **no skill at all**.

## What happened

After the health check the run went straight to the channel:

```
mcp__atlassian__getJiraIssue    { issueIdOrKey: "ST-1" }
mcp__atlassian__editJiraIssue   { issueIdOrKey: "ST-1", … }
```

and ended with:

> I need your approval to edit ST-1 in Jira — this will clear its fix version field (removing it
> from "1.0"). Please approve the tool call to proceed.

`jira-release` was never entered. Neither was any forbidden skill, so this is not a boundary that
leaked into a neighbour — it is a request that never reached a skill.

## Why that is worse than routing to the wrong skill

The draft gate is invariant 3: the complete artifact is presented in chat and approval is awaited
**before any write**. That guarantee lives inside the skills. No skill ran, so nothing presented an
artifact and nothing awaited anything — the only thing between the request and the edit was the
harness withholding `editJiraIssue`. In a session where that tool is permitted, the field is
cleared.

The pair says why this is the interesting end. `sel-release-2`, the way **onto** a fix version,
routed to `jira-release` cleanly. The way **off** is mechanically the same operation with the field
emptied, and the fixture's own `why` says as much. The description claims it — _"assign work to a
Jira fix version **or take it off one**"_ — so the trigger is present and was not enough: a
one-clause request naming an item and a version looks like a field edit, and the model performed the
field edit.

## What this shares with the other two skill-less runs

`sel-capture-4` also fired no skill. Different cause — there the phrasing was claimed by something
outside the plugin — but the same shape of outcome, and it is the shape worth naming: **a routing
failure that is not a wrong skill but no skill**, which the `expect_not` list cannot catch because
no forbidden skill fires. Two of fourteen ended this way. Both are cases where the request was small
enough to look like a single tool call.

---

**Filed:** #94.
