# 2026-09-06 — the first behavioural run

The eighteen fixtures `docs/agents/behavioural-verification.md` prescribes: all four `handover`
and the fourteen `selection` fixtures in its seven pairs. **Model: `claude-sonnet-5`**, the
configured default.

**Result: handover 4/4 as decided; selection 10/14.** Four selection fixtures misbehaved and have
a file each. Two of them are one defect, and it is the finding this run exists to have produced.

**Filed:** the floor defect is demonstrated on **#83**, which had already named its cause; the
skill-less write path is **#94**; the intake phrasing is **#95**; the doctor probe is **#93**. The
run itself is reported on **#80**, which stays open — its third item, the isolated routing replay,
was not re-run here.

## Preconditions, proved rather than trusted

The procedure asks for an uninstall/install cycle and then a grep. The cycle was not needed and
the proof is stronger than a grep: the installed cache at
`~/.claude/plugins/cache/codeskine/jira-skills/1.0.0` was **byte-identical** to the commit under
test across `skills/`, `commands/` and `.claude-plugin/plugin.json` (`diff -rq`, no differences).
`installed_plugins.json` records `gitCommitSha 4c59dfa`, one merge behind `HEAD` (`b09f526`), and
that merge — #91 — touched only `docs/` and `evals/`, so the shipped surface had not moved.

The four cached copies the procedure warns about are still on disk
(`jira-skills-e2e`, `jira-e2e-probe`, `jira-verify-fix`, `codeskine`). Three are **orphans**: their
marketplaces are no longer in `known_marketplaces.json` and none appears in `installed_plugins.json`.
`~/.claude/settings.json` enables exactly one, `jira-skills@codeskine`. So the warning still applies
to the disk and no longer to the enabled copy.

## How it was run, and where that departs from the procedure

The procedure says one fixture per fresh session, pasted into a dedicated session. It was run as one
**`claude -p` invocation per fixture** from a scratch git repository outside this tree — a genuinely
fresh session per fixture, the real plugin at user scope, the `atlassian` server id from a project
`.mcp.json`, the `jira` CLI authenticated, and a `.jira/project-profile.md` produced by running
`jira-init` against the sandbox. Which skill fired was read from the `Skill` tool calls in
`--output-format stream-json`. Every Jira-mutating tool was withheld, so no run could write whatever
it decided; `--disallowedTools` was verified to hard-disable a tool before being relied on for that.

**Two deliberate departures, both recorded because they bound what the run proves:**

1. **Item keys and one fix version were substituted.** The fixtures name `KAN-12`, `KAN-4`,
   `PROJ-88`, `PROJ-91` and versions `4.10` and `2.4`; the sandbox has `ST`/`KST` and one version,
   `1.0`. Item keys cannot be manufactured — `PROJ-88` would need eighty-eight issues — so each
   placeholder was swapped for a real `ST` key and `4.10`/`2.4` for `1.0` where the entity had to
   exist. One opaque key for another opaque key alters no routing signal, which is what the verbatim
   rule protects; the eight free-text fixtures were pasted unchanged. The substitution table is in
   each fixture file that needed one.

2. **The second half of a `handover` fixture could not execute.** The draft gate ends the turn, and
   a `-p` invocation has nobody to approve it — which is the gate working, not failing. The `ST`
   board also has no active sprint and none can be created from here: `jira sprint` has no `create`,
   the MCP exposes no sprint tool, and authenticated `curl` writes were refused. So `expect_sequence`
   was verified on its **first** element and on the assertion that distinguishes these fixtures —
   what the first gate names — and not on the second skill running.

## The finding

**`sel-capture-3` and `sel-capture-6` both routed to `jira-diagnose`, the skill their `expect_not`
forbids.** The floor between intake and a defect report does not hold when the real triggering
mechanism runs it.

What makes it worth the eighteen sessions: `sel-capture-6` is the fixture the isolated routing
replay caught in round 1 and passed after the wording was rewritten — see
`evals/runs/2026-09-05-routing-boundaries/sel-capture-6.md`. The wording has since been sharpened
again, into a positive statement that answers this case by name:

> steps or a verbatim error clear that floor, naming the product or where it ran does not

`sel-capture-6` names a product (4.9) and where it ran (the production tenant) and no steps. The
sentence disposes of it explicitly. The live mechanism routed it to `jira-diagnose` anyway.

So the two seams disagree, and the disagreement is the point of keeping both. The replay applies an
exclusion because an agent reading ten descriptions side by side weighs them against each other; the
live mechanism matches a request against descriptions and does not. That is the item the previous
run already filed under _left open, deliberately_ — **"nothing states that an exclusion outranks a
trigger"** — now demonstrated rather than inferred. No further rewording of this floor is worth
attempting until that is addressed: three wordings have now been tried and the third is as explicit
as prose gets.

## `jira-doctor` fires first, and its probe cannot see the session it runs in

`jira-doctor` opened **12 of the 14** selection runs. That is its own description working as
written — _"Run before any Jira skill"_ — and it is not a routing failure: in ten of those runs the
intended skill followed it.

But it probes the MCP server by running **`claude mcp list`**, a separate process that does not
share the session's connection state. In a scratch repository whose trust dialog has not been
accepted it reports `⏸ Pending approval` while the session's own init event reports
`{"name":"atlassian","status":"connected"}` and 32 `mcp__atlassian__*` tools are live and working.
Doctor then reports the environment unusable and the session stops without doing the work asked of
it. **Six of fourteen runs in the first pass died this way**, on a channel that was in fact
connected. Accepting trust for the scratch repository — what a person does on first opening it —
turned the same probe green and the six runs into routing results.

Two consequences worth separating. The false negative is partly an artefact of a headless run, since
a person would have accepted the dialog already. That a health check can contradict the session it
is checking, and that the contradiction halts the work rather than being reported as uncertainty,
is not.

## What each pair moved

Seven of the eight pairs held. The pair that did not is the floor.

| Pair                               | Verdict                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `sel-inspect-4` · `sel-release-1`  | held — the read stays with `jira-inspect`, the read-then-change goes to `jira-release` |
| `sel-release-2` · `sel-release-3`  | the way on held; the way off fired **no skill at all** (see `sel-release-3.md`)        |
| `sel-inspect-3` · `sel-plan-3`     | held — reading a sprint against taking work out of one                                 |
| `sel-capture-3` · `sel-capture-6`  | **both failed to `jira-diagnose`** — the floor does not hold                           |
| `sel-capture-6` · `sel-diagnose-4` | only the complete report routed as decided; the relayed one did not                    |
| `sel-capture-4` · `sel-propose-6`  | `sel-propose-6` held; `sel-capture-4` fired **no skill** (see its file)                |
| `sel-propose-2` · `sel-plan-4`     | held — "on the backlog" separated by whether the item is already recorded              |
| `sel-propose-3` · `sel-propose-6`  | held — first-hand and relayed, both carrying a datum, both to `jira-propose`           |

## The handover category, run for the first time

Added by #76 and never run until now. **All four correct on every assertion this environment can
observe**, and nothing needed a file.

| Fixture  | First skill                   | What the gate did                                                                                                                |
| -------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `hand-1` | `jira-refine` ✓               | named the sprint as outstanding: _"you asked for this in the current sprint, but the ST board has no active sprint right now"_   |
| `hand-2` | `jira-inspect` ✓              | answered first, the stated condition decided against planning (the item is `Done`), and the answer said so and named `jira-plan` |
| `hand-3` | `jira-refine` ✓               | named the successor: _"then we can move to getting the resulting item(s) into next sprint"_                                      |
| `hand-4` | `jira-refine` ✓, **and only** | **no** sprint, **no** successor, **no** second gate — zero mentions in 2,517 characters                                          |

`hand-4` is the one the procedure says to watch, and it is the one this run verifies completely: the
contract does not fire on its own. `hand-2` is the strongest of the four, because the condition fell
the way that makes planning wrong and the run stopped for that reason rather than for a missing
sprint.

What is **not** verified: that the second skill runs. That needs an active sprint on the board and
permission to write, and neither was available. It is the remaining gap in this category, not a
finding against it.
