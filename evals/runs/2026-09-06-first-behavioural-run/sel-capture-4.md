# `sel-capture-4` — "Record this" was taken by the memory system, not by Jira

**Fixture:** `sel-capture-4` (`selection`). **Model:** `claude-sonnet-5`.
**Prompt, verbatim:** _"Record this: the boss wants the portal to load faster."_
**Expected:** `jira-capture`. **Forbidden:** `jira-propose`. **Fired:** **no skill at all** — and
`jira-doctor` did not fire either, the only run of the eighteen where it did not.

No substitution — the prompt names no Jira entity.

## What happened

The run wrote the sentence into the session's own persistent memory:

```
Write  ~/.claude/projects/<project>/memory/…
```

> Recorded as a project memory: the boss wants the portal to load faster, with a note to prioritize
> load-time work when touching the portal going forward.

The fixture was run twice during this session's harness work. The second time, the run found the
file the first had written and reported:

> This memory already exists and captures exactly this … No update needed, it's already recorded.

Jira was never mentioned in either run.

## How much of this belongs to the plugin

Partly not at all: the collision is with an auto-memory instruction in this operator's environment,
which claims _"remember"_ and _"record"_ phrasings, and a user without it would not see this run.
Recorded anyway, for two reasons.

**It is the phrasing the intake fixture was built on.** `sel-capture-4` is one end of the pair with
`sel-propose-6`, moving whether any figure is present. `sel-propose-6` — relayed, carrying a count —
routed to `jira-propose` correctly. So the variable the pair moves was never tested: this end did
not lose to `jira-propose`, it lost to something that is not a Jira skill. The pair reports a pass
on one side and no reading at all on the other.

**"Record this" is not an unusual way to ask.** It is close to the plainest phrasing an intake skill
should claim, and `jira-capture`'s description does not contain the word _record_ at all — it opens
on _"a request arrives second-hand — an email, a chat message, a note taken during a call"_, which
describes the **provenance** and not the **instruction**. Whatever else is competing for the word,
the skill that owns recording a request does not say so.

## What to do with it

Not a fix to make from this run. It needs the fixture re-run in an environment without a competing
memory instruction, to establish whether `jira-capture` wins the phrase when nothing else claims it.
Until then this end of the pair is **unread**, not failed.

---

**Filed:** #95.
