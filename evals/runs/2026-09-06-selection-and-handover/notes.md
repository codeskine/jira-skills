# 2026-09-06 — the `selection` and `handover` run

The third seam, run against the descriptions as `main` leaves them at `dc898a7` — after the doctor
and boundaries batch (#93, #96, #83, #86, #84, #82) and the floors and fixtures batch (#81, #98,
#99). This is the run #80 has been waiting for.

**Result: 21 of 21 as decided.** Four of them failed in the run of 2026-09-06 that produced half
this work; all four now route as their fixture says.

## The install, proved rather than trusted

It was stale — the cache carried neither batch. `uninstall` then `install`, then the proof the
previous run's record recommends over a grep:

```
diff -rq skills   <cache>/skills     → no differences
diff -rq commands <cache>/commands   → no differences
diff -q  .claude-plugin/plugin.json  → identical
```

Four cached copies are still on disk under other marketplace names. Three are orphans; settings
enable exactly one, `jira-skills@codeskine`, which is the one proved above.

## How it was run

One `claude -p` per fixture from a scratch repository outside this tree: a genuinely fresh session,
the real installed plugin, real `Skill` triggering. Which skill fired is read from the `Skill` tool
calls in `--output-format stream-json`, not from the prose.

The session's posture was meant to be the one a careful user has: reads approved, writes to Jira
absent from the allowlist.

> **This paragraph made a claim that is false, and it is corrected rather than deleted because the
> run above was performed under it.** It said a skill that tried to write would be stopped by the
> harness rather than by its own gate, and that this is what made the run safe to point at a real
> project. **Omitting a tool from `--allowedTools` does not deny it.** `gate-1`, run later the same
> day, called `mcp__atlassian__createJiraIssue` — absent from that allowlist — and it succeeded,
> creating `ST-7`.
>
> Nothing in the run recorded above wrote anything, which is a fact about what those twenty-one
> fixtures attempted and not about the harness. The only thing protecting the project was the
> skills' own draft gates.
>
> `--disallowedTools` does deny, and it wins over `--allowedTools` — proved with a tool named in
> both, on a harmless read rather than on a write. Later runs use both lists. See
> `gate-and-ordering.md` in this directory.

The sandbox is `ST` (scrum-test-space), with an active sprint opened for this run — `ST Sprint 2`,
holding `ST-2`. The project profile was produced by running `jira-init`, not written by hand: the
single-writer rule is what every other skill's first step depends on, and a profile written around
it would invalidate the run it was meant to enable. It was generated **after** the sprint existed,
because the profile records the active sprint and one written earlier would have recorded none.

### The substitution table

Required by the procedure since #98. Only tokens a fixture declares in `entities` were touched;
nine of the twenty-one carry no declaration and ran byte for byte.

| Fixture token | Ran as |
| ------------- | ------ |
| `KAN-12`      | `ST-3` |
| `KAN-4`       | `ST-2` |
| `PROJ-88`     | `ST-5` |
| `PROJ-91`     | `ST-4` |
| `4.10`        | `1.0`  |
| `2.4`         | `1.0`  |

## The result

| Fixture          | Category  | Fired             | Verdict           |
| ---------------- | --------- | ----------------- | ----------------- |
| `hand-1`         | handover  | refine            | first element     |
| `hand-2`         | handover  | inspect → plan    | **both elements** |
| `hand-3`         | handover  | refine            | first element     |
| `hand-4`         | handover  | refine, and stops | whole             |
| `hand-5`         | handover  | inspect → plan    | **both elements** |
| `hand-6`         | handover  | inspect → release | **both elements** |
| `hand-7`         | handover  | assess → capture  | **both elements** |
| `sel-capture-3`  | handover  | capture           | outcome           |
| `sel-capture-6`  | handover  | capture           | outcome           |
| `sel-inspect-4`  | selection | inspect           | pass              |
| `sel-release-1`  | selection | release           | pass              |
| `sel-release-2`  | selection | release           | pass              |
| `sel-release-3`  | selection | release           | pass              |
| `sel-inspect-3`  | selection | inspect           | pass              |
| `sel-plan-3`     | selection | plan              | pass              |
| `sel-capture-4`  | selection | capture           | pass              |
| `sel-propose-6`  | selection | propose           | pass              |
| `sel-propose-2`  | selection | propose           | pass              |
| `sel-plan-4`     | selection | plan              | pass              |
| `sel-propose-3`  | selection | propose           | pass              |
| `sel-diagnose-4` | selection | diagnose          | pass              |

`jira-doctor` opened seventeen of the twenty-one and is omitted above. That is its own description
working — _"Run before any Jira skill"_ — and not a routing answer.

## What changed since the previous run

Four fixtures that failed on 2026-09-06 now route as decided. Each is the fixture behind an issue
this work closed or touched.

- **`sel-capture-3` and `sel-capture-6`** routed to `jira-diagnose`, the skill their `expect_not`
  forbade, at **both ends of the pair**. They now reach `jira-capture` directly. This is #83: the
  intake floor stopped being an exclusion the router never weighs and became a step the skill
  applies.
- **`sel-release-3`** fired **no skill at all** and reached `editJiraIssue` directly, stopping only
  because the harness withheld the tool. It now fires `jira-release`. See the caveat below — this
  is less than it looks.
- **`sel-capture-4`** fired no skill; the phrase was taken by an unrelated instruction in the
  operator's environment. It now fires `jira-capture`. The confound has not been removed, so the
  fixture routing correctly **despite** it is stronger evidence than a clean re-run would have been.

**`jira-doctor`'s new probe is confirmed in the live mechanism.** Runs show
`mcp__atlassian__atlassianUserInfo` — a read-only call inside the session — where the old command
would have shelled out to `claude mcp list`. The isolated replay could not have told us this; only
this seam can.

**`hand-5`'s corrected first element is confirmed by observation.** It was `jira-release` until the
replay caught that reading what a fix version holds is a read `jira-release` disclaims. It ran as
`jira-inspect → jira-plan`, which is what the correction says.

## A correction to what #99 claims, found by this run

#99 concluded that under `claude -p` a handover fixture verifies "the first element and what the
first gate names, never the second". **That is too absolute, and four fixtures disprove it.**

The real rule is about whether the first element reaches a gate:

| First element                               | Second element under `-p` | Fixtures                               |
| ------------------------------------------- | ------------------------- | -------------------------------------- |
| writes, so its draft gate ends the turn     | never reached             | `hand-1`, `hand-3`                     |
| never writes, or hands over before its gate | **entered, and observed** | `hand-2`, `hand-5`, `hand-6`, `hand-7` |

`jira-inspect` never writes, so there is no gate to stop at: it answers and the successor is
entered. `jira-assess` in `hand-7` hands over at its third step, before the questions and long
before its gate. `jira-refine` in `hand-1` and `hand-3` writes, so the gate ends the turn exactly as
invariant 3 requires.

So `-p` verifies more than #99 credited it with, and the procedure is corrected in the same commit
as this record. What `-p` still cannot see is the **write** at the end of a sequence, which is a
different and smaller claim.

## What this run does not prove

**#94 is not resolved by `sel-release-3` passing.** The fixture reads _"Take ST-5 out of 1.0"_, and
`ST-5` is assigned to no fix version at all, so `jira-release` read the state, found nothing to
remove, and asked. **The write path was never reached, so the gate was never tested.** What improved
is the routing — a skill fired where none did before — and that is all this says. #94 asks whether a
one-clause request can reach the channel without entering a skill, and a no-op cannot answer it.

**`hand-5`'s precondition was not met.** It wants an item both in the active sprint and in the fix
version; the sprint holds `ST-2` and `1.0` holds `ST-1` and `ST-6`, an empty intersection. Setting
it up meant writing to a real Jira project and was not done. The fixture still routed as decided, so
it is recorded as passed on its routing and **unrun on its subject**.

## Deviations, recorded rather than hidden

- **`Bash` is allowed**, so the Jira CLI — the Agile channel — is reachable, and the CLI can write.
  Withholding it would have made five fixtures measure a degraded environment instead of a routing
  decision. Between the CLI and a write there is only the draft gate, which is what is under test.
  Nothing wrote.
- **The harness failed silently on its first attempt, and the failure is worth the space.**
  `claude -p` reads stdin, and stdin was the pipe feeding the loop that drove it. The first fixture
  drained it, the loop ended, and the script printed its completion line and **exited 0**. A run
  that executed one case of twenty-one reported success. The fix is `< /dev/null`; the lesson is
  that an exit code from a loop of subprocesses says nothing about how many iterations happened, and
  the first result was discarded rather than kept.

## What is still owed

The remaining `selection` fixtures — twenty-five of the thirty-seven — were not run. The scope is
chosen by what each fixture decides, and every entry brought its matched pair; the rest touch
descriptions this work did not change.
