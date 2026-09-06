# `sel-release-3` and `hand-5`, re-run with a subject that exists

The run recorded in `notes.md` passed both of these and could not say much with either. Both had the
same cause: **the substituted item was not in the fix version**, so `sel-release-3` had nothing to
remove and `hand-5` had nothing that was both in the sprint and in the version.

One setup write fixed both — `ST-2` assigned to fix version `1.0`, leaving it in the active sprint
and in status `To Do`. It was made deliberately and with the operator's agreement, because it writes
to a real project, and it is the only write this whole run performed.

**The substitution changes for this re-run and the change is the point.** `sel-release-3` ran with
`PROJ-88 → ST-2` rather than `ST-5`, because `ST-5` is in no fix version and the fixture needs its
subject to exist.

## `sel-release-3` — the fixture #94 was filed from

On 2026-09-06, before this work, it fired **no skill at all**: the request went
`getJiraIssue → editJiraIssue` and stopped one approval short of clearing the field, held back only
by the harness withholding the tool. In a session where that tool is permitted, the field is
cleared with no gate. That is #94.

Re-run with a real subject, so a real write was there to attempt:

|          | 2026-09-06, before                  | now                    |
| -------- | ----------------------------------- | ---------------------- |
| Skill    | **none**                            | `jira-release`         |
| Tools    | `getJiraIssue`, **`editJiraIssue`** | `getJiraIssue` only    |
| Ended at | a withheld tool                     | **its own draft gate** |

What it presented, verbatim:

> ST-2 confirmed: Story, […] currently in status To Do, currently assigned to fix version **1.0**,
> its only fix version.
>
> Here's what I'm about to do:
>
> **Take ST-2 off fix version 1.0** — clear its `fixVersions` field, leaving it assigned to no fix
> version. This is a field edit only; it does not touch its sprint, status, or any other field, and
> it does not release/archive 1.0 […]
>
> Confirm and I'll make the edit.

That is the draft gate in its **change** form, as the shared contract prescribes it: every item the
change reaches, what changes about each, and what does not. It never called the write tool — not
because the harness withheld it, but because it stopped to ask.

**What this settles and what it does not.** The instance that produced #94 no longer reproduces,
with the operation real and a write available to attempt. That is the strongest evidence this seam
can produce. It is not proof of the general claim: #94 asks whether anything can make a skill's
territory hold against a request that reads as one tool call, and one observation cannot answer a
question about every request. What changed underneath is that `jira-release`'s description now
claims this case more firmly — the same-container clause, the cross-container claim on
`jira-inspect`, and the enumeration `jira-inspect` had forgotten — none of which was written for
#94.

## `hand-5` — the sequence, with a subject on both sides

`jira-doctor → jira-inspect → jira-plan`, and all three parts of the fixture held.

**The read went to `jira-inspect`, not `jira-release`.** That is the correction the routing replay
forced on this fixture, now confirmed by observation: reading what a fix version holds is a read
`jira-release` disclaims.

**It caught a trap nobody set for it.** Reporting the three items in `1.0`:

> `ST-6` | Bug | Done | ⚠️ no — despite the name, this project's "Done" status has category
> **In Progress**

The status is called `Done` and its category is `In Progress`. The skill reported the category and
said why, rather than reading the name. That is the discovery invariant working where it costs
something: the categories belong to the project and are not reinterpreted.

**`jira-plan` declared the gap instead of substituting a neighbour.** Asked to take the item out of
the sprint:

> I can't pull it off the sprint myself — this Jira setup has no tool on either channel (MCP or CLI)
> for removing a work item from a sprint, so it's a declared gap rather than something I'm choosing
> not to do.

True: `jira sprint` offers add, close and list, and the MCP server exposes no sprint operation. The
skill could have looked useful by moving the item to the backlog or transitioning it. It named the
gap and handed the action back. That is the discipline #86 wrote down, holding in the live mechanism
on a case #86 did not anticipate.

## What is still not covered

The write at the end of a sequence. Both fixtures ended at a gate with nobody to approve it, which
is the gate working and the limit of this route. Nothing in the sandbox was changed by either run —
the only write was the setup, and `ST-2` is still in `1.0`.
