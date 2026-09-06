# The draft gate

No write to Jira happens before the user has seen exactly what it will do and approved it. One
gate, every skill, no exceptions other than the read-only skill, which never writes.

## Two forms

What the user is shown takes one of two forms. Which one is decided by what the write produces,
never by which skill is running.

**An artifact gate** shows the thing that will exist: the complete content of a work item, section
by section, before it is created or enriched. This is what the authoring intents present.

**An operation gate** shows the change that will reach things that already exist: which items,
what changes about each, and what will be true of them afterwards. Planning a sprint, closing one,
assigning to a fix version and running a transition are all this shape. There is no artifact to
assemble, and assembling one would mean inventing a document for the user to approve instead of
the change they asked for.

Both are the same gate — the same completeness, the same explicit approval, the same refusal to
write anything approved in part. Only step 1 and the block in step 3 differ.

One request can need both. A split creates children and may then place them; each is gated on its
own, in the order the material forces.

## Procedure

1. **Assemble what is to be approved, in full.** Not a summary, not an outline.
   - _An artifact:_ the exact content that will be written, in the language the user is working
     in. In full means every section its template defines and does not mark optional; a section
     that cannot be filled is raised at the gate as a gap, never quietly dropped.
   - _An operation:_ every item it reaches, named, with what changes about each. Not a count and
     not a sample — a list the user can refuse one line of. An operation touching more items than
     are worth reading is one to ask the user to narrow, never one to summarise.
2. **Present it in chat.** Never in a file. After a write the truth is Jira, and a local copy
   nobody reads is drift waiting to happen.
3. **State the decisions it carries**, immediately after it, as a short block.

   For an artifact:
   - the title
   - the work type
   - the parent, if any
   - the sprint and the fix version, if any
   - anything the project marks as required and the draft has left empty
   - a work type standing in for an intent the project has none for, and whether the draft says so

   For an operation:
   - what changes, and on which items
   - what will be true of them once it has run, including anything that becomes irreversible
   - what the operation will **not** do where a user could reasonably expect it to — a move this
     plugin cannot make, a placement Jira decides for itself. An approval given without that is an
     approval of an outcome the user did not picture.

   For either:
   - the intent the request carried that this does not satisfy, and the skill that owns it

4. **Ask for explicit approval.** A question the user answers, not an announcement of what is
   about to happen.
5. **On a change request**, apply it and return to step 2 with the revised artifact. Loop as
   many times as the user wants. Never write a partially approved artifact.
6. **On a refusal**, write nothing and say what now holds: the artifact does not exist, or the
   change did not happen, and what the user has instead. A refusal is an answer, not a failure —
   do not re-present the draft unasked, do not offer a smaller version of it hoping that one
   passes, and do not read a later unrelated message as a change of mind. Where the refused write
   is one other skills depend on, name them and say what they will do instead: a refusal whose
   consequences surface three steps later was not really answered.
7. **On approval**, perform the write through the channel the map assigns, then report the key
   and the URL of what was created or changed.
8. **On failure**, report what failed and what the state now is. Never retry a write silently:
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
- **A read of one container and a change to another is two intents, not one.** Two skills carry a
  formula making a read and a change to **the same** container one operation — a sprint read then
  changed, a fix version read then changed. It says "that same", and it means it. _"What is in 4.10
  so far? Anything not started, take it out of the current sprint"_ reads a fix version and changes
  a sprint, so the exception does not apply and the ordinary rule above does: the read is answered
  first, the change is named at the gate, and the skill that owns the container being changed is
  entered for it. The mirror — a sprint read, a fix version written — is the same request with the
  containers swapped and takes the same path.
