# Behavioural verification: the `selection` and `handover` fixtures

The third seam. `scripts/check-package.mjs` asserts the package is sound and `npm test` asserts the
frontmatter rules still run; neither can tell whether a skill **fires** when someone speaks. That
is what `evals/evals.json` is for, and what this procedure runs.

It is a prompt to paste into a dedicated session, like `e2e-testing.md` and `documentation.md`. It
is separate from the **isolated routing replay**, which dispatches a subagent holding only the ten
`description` fields: that one says whether the _words_ decide, this one says whether the real
triggering mechanism uses them. Neither replaces the other, and the replay is much cheaper.

## Why this is done by hand

`claude plugin eval` exists and is gated. `evals/README.md` § Running them carries the detail,
including the trap: `--help` prints the full documentation while every real invocation still
returns the early-access line, so the obvious re-check gives a false positive. Re-check by running
it, not by asking for help.

## Before the session that runs anything

**Two preconditions, and both are silent when unmet.**

1. **The installed plugin must provably carry the commit under test.** The cache is keyed on the
   version, the version is frozen at `1.0.0`, so `claude plugin update` propagates nothing and
   `claude plugin marketplace update` refreshes the marketplace while leaving the plugin cache
   alone. Only `uninstall` then `install` refreshes it.

   ```bash
   claude plugin uninstall jira-skills@codeskine
   claude plugin install jira-skills@codeskine
   ```

   Then prove it, rather than trusting it. Grep the installed copy for wording that exists only in
   the commit under test — `~/.claude/plugins/cache/<marketplace>/jira-skills/1.0.0/skills/`. On
   2026-09-05 the enabled copy still carried `arrives from outside the team`, which predates
   fifteen merged pull requests, and **four** cached copies had accumulated under different
   marketplace names with the enabled one the oldest. Check for more than one.

2. **Skills are frozen at session start.** Reinstalling mid-session changes nothing for that
   session or for any subagent it spawns. The refresh happens _before_, or the run grades the old
   descriptions and reports green.

## The run

One fixture per **fresh session**. This is the whole cost and it is not compressible: a session
that has already loaded a skill keeps choosing it, and selection is exactly what is under test.

For each fixture in the list below:

1. Open a fresh session in a scratch repository with the plugin installed.
2. Paste the `prompt` from `evals/evals.json` verbatim. Do not paraphrase it and do not name a
   skill.
3. Record which skill fired, and stop the session before it writes anything to Jira.
4. Compare against `expect_skill` and `expect_not`, or for a `handover` fixture against
   `expect_sequence` and `expect`.

A `handover` fixture asserts an **order**, not a choice. A run where both skills fired but the
second was never named at the first gate has failed it, however right the final state looks.

## What to run, and why these

Eighteen of the sixty-four. The `selection` category has thirty-eight fixtures and thirty-six of
them touch a description that changed, so "only the ones at risk" saves nothing — the list below is
chosen by what each fixture **decides**, and every entry brings its matched pair.

**The `handover` category — all four.** Added by #76 and never run at all, which makes them the
oldest untested thing in the suite. `hand-4` is the one to watch: it is `hand-1` with the second
intent removed, and it fails if the plugin has learned to announce a successor every time.

| Fixture  | What it pins                                                |
| -------- | ----------------------------------------------------------- |
| `hand-1` | the plain composite — refine, then plan                     |
| `hand-2` | the conditional read, where a stated condition decides      |
| `hand-3` | a split, which leaves its successor's subject undetermined  |
| `hand-4` | the single-intent twin, which must produce **no** successor |

**Fourteen `selection` fixtures**, in seven pairs that each move one variable:

| Pair                               | The variable                                         |
| ---------------------------------- | ---------------------------------------------------- |
| `sel-inspect-4` · `sel-release-1`  | whether the request changes anything                 |
| `sel-release-2` · `sel-release-3`  | the way onto a fix version against the way off       |
| `sel-inspect-3` · `sel-plan-3`     | reading a sprint against taking work out of one      |
| `sel-capture-3` · `sel-capture-6`  | how much environment a relayed fault names           |
| `sel-capture-6` · `sel-diagnose-4` | whether the relayed material carries steps           |
| `sel-capture-4` · `sel-propose-6`  | whether any figure is present at all                 |
| `sel-propose-2` · `sel-plan-4`     | "on the backlog" meaning create against meaning move |
| `sel-propose-3` · `sel-propose-6`  | first-hand against relayed, both carrying a datum    |

`sel-capture-6` and `sel-propose-6` appear twice on purpose: each is one end of two different
pairs, and a fixture that only ever moves one variable in one direction proves less than it looks.

## Recording it

Under `evals/runs/<date>-<what-changed>/`, per `evals/README.md`: one file per fixture that
misbehaved, naming the fixture, the model, what fired and what should have. A run where everything
passed needs one line saying so. Passing output is not worth keeping — it grows the repository and
nobody reads it.

Anything that misbehaves gets a fix or an issue of its own before the run is called done.
