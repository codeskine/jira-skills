# The draft gate

No write to Jira happens before the user has seen the complete artifact and approved it. One
form, every skill, no exceptions other than the read-only skill, which never writes.

## Procedure

1. **Assemble the artifact in full.** Not a summary, not an outline: the exact content that
   will be written, in the language the user is working in.
2. **Present it in chat.** Never in a file. After a write the truth is Jira, and a local copy
   nobody reads is drift waiting to happen.
3. **State the decisions the artifact carries**, immediately after it, as a short block:
   - the title
   - the work type
   - the parent, if any
   - the sprint and the fix version, if any
   - anything the project marks as required and the draft has left empty
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
