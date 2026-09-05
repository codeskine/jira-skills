# The draft gate

No write to Jira happens before the user has seen the complete artifact and approved it. One
form, every skill, no exceptions other than the read-only skill, which never writes.

## Procedure

1. **Assemble the artifact in full.** Not a summary, not an outline: the exact content that
   will be written, in the language the user is working in. In full means every section its
   template defines and does not mark optional; a section that cannot be filled is raised at the
   gate as a gap, never quietly dropped.
2. **Present it in chat.** Never in a file. After a write the truth is Jira, and a local copy
   nobody reads is drift waiting to happen.
3. **State the decisions the artifact carries**, immediately after it, as a short block:
   - the title
   - the work type
   - the parent, if any
   - the sprint and the fix version, if any
   - anything the project marks as required and the draft has left empty
   - a work type standing in for an intent the project has none for, and whether the draft says so
   - the intent the request carried that this artifact does not satisfy, and the skill that owns it
4. **Ask for explicit approval.** A question the user answers, not an announcement of what is
   about to happen.
5. **On a change request**, apply it and return to step 2 with the revised artifact. Loop as
   many times as the user wants. Never write a partially approved artifact.
6. **On approval**, perform the write through the channel the map assigns, then report the key
   and the URL of what was created or changed.
7. **On failure**, report what failed and what the state now is. Never retry a write silently:
   a duplicate work item is worse than an error message.

## What counts as approval

An explicit affirmative from the user in this conversation. Not silence, not an unrelated
message, not the user's original request — the request is what produced the draft, not what
approves it.

## Multi-write operations

Some skills write more than one thing in one approved action — a decomposition creating several
children, a set of items moved into a sprint. The gate stays single: present **all** of it,
approve **once**, then execute.

If part of a multi-write operation fails, report which parts succeeded and which did not. Do not
roll back on your own initiative: the user decides whether a partial result is kept or undone.

## A request that carried more than one intent

One sentence can ask for two things — "it is too large, and it needs to go in the current sprint";
"how is it doing, and plan it if it is ready". Both are real, both must happen, and the skill that
fired owns one of them.

- **Name the other at the gate.** It belongs in the block of decisions. An approval given without
  it is an approval of half a request the user believes they made whole.
- **Order is not a choice.** The intent whose result the other operates on runs first: a split
  before the sprint that holds its children, a read before the write it conditions. Where neither
  consumes the other, the order the user stated stands.
- **Two gates, never one.** The second artifact cannot be assembled before the first is written,
  because its subject does not exist yet. Approving the first approves nothing of the second.
- **Continue after the write.** Reporting the key ends the write, not the request. Hand over to
  the skill that owns what is outstanding, and say that is what you are doing.
- **Ask when the first intent changed the subject of the second.** After a split, "put it in the
  sprint" no longer names one item. Which level a team plans belongs to the project, and the
  profile is what says so. Ask; never resolve it by default.
- **A condition the user stated is a condition.** "Plan it if it is ready" is not satisfied by
  planning it.
