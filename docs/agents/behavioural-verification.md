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

### What a `handover` result means, and under which run

What a result covers is decided by **whether the first element reaches a gate**, which is a property
of the fixture rather than of how the run is driven. Established by observation on 2026-09-06, and
recorded here because an earlier reading of this section claimed a `-p` run could never see a second
element at all:

| The first element                           | The second, under `-p`      | Fixtures                               |
| ------------------------------------------- | --------------------------- | -------------------------------------- |
| writes, so its draft gate ends the turn     | never reached               | `hand-1`, `hand-3`                     |
| never writes, or hands over before its gate | **entered, and observable** | `hand-2`, `hand-5`, `hand-6`, `hand-7` |

`jira-inspect` never writes, so there is no gate to stop at: it answers and the successor is
entered. `jira-assess` hands over at its third step, before the questions and long before its gate.
`jira-refine` writes, so the turn ends there — invariant 3 working, not failing.

What a `-p` run still cannot see is the **write** at the end of a sequence, which needs an approval
it has nobody to ask for. Driven interactively, that is observable too wherever the fixture's
`precondition` is met.

`hand-4` is the one fixture whose whole claim `-p` decides by construction: its sequence has one
element and asserts that **nothing** follows. Worth knowing before reading a green line — an earlier
run reported `handover` **4/4** on this route while three of those four asserted a second element it
had not observed, a number true of what it measured and misleading about what it meant.

### The precondition a sequence needs

A second element that plans work needs somewhere to plan it into. Where a fixture needs one, it says
so in `precondition`, and the shape of it matters: **an active sprint cannot be created from either
channel.** `jira sprint` offers add, close and list; the MCP server exposes no sprint operation at
all. So it is opened through Jira itself, before the session starts, and no amount of driving the
plugin will produce one.

Read the `precondition` of every fixture on the list before opening the first session. A sequence
whose precondition is unmet does not fail — it is **unrun**, and recording it as a failure blames
the plugin for the sandbox.

### Substituting what your project does not have

"Paste it verbatim" and "the entity has to exist" pull against each other, and the fixtures were
written against neither sandbox anyone runs. Twenty-eight of them name an item key or a fix version;
the sandbox holds `ST`/`KST` and one version. Item keys cannot be manufactured — `PROJ-388` needs
three hundred and eighty-eight issues before that key exists — so substitution is unavoidable and
the only question is whether two runners do it the same way.

**Substitute what the fixture declares in `entities`, and nothing else.** That field lists the
tokens naming a Jira entity a runner has to line up. Swap each for one your project holds, keeping
one opaque key for another opaque key: the wording is what is under test, and an item key carries no
routing signal.

**Everything not declared is pasted as written, however entity-shaped it looks.** `sel-capture-6`
says _"They're on 4.9, in the production tenant"_ — that is a product a customer runs, inside their
own sentence, and the fixture exists to assert that naming it does not clear the intake floor.
Substituting it for a fix version would quietly test something else. This is why `entities` is
declared per fixture and not derived: no pattern tells a product version from a fix version.

`check-package.mjs` catches the omission a work item key makes visible — a prompt naming one and no
declaration fails the check. **Everything else is on the author, and the gap is wider than a
version.** A fixture can name an entity in prose: `gate-8` says _"Close Sprint 24"_, `gate-5` and
`sel-inspect-1` say _"the reporting epic"_. Those are entities a project has to hold, and no pattern
distinguishes them from ordinary words — all three were undeclared until a survey for the gate and
ordering run went looking.

A deictic reference is the exception and needs no declaration: _"the current sprint"_ resolves to
whatever is current wherever the fixture runs, which is the point of writing it that way.

**A run that substituted records what it substituted.** One table in the run record, fixture by
fixture, or the run is not comparable to the next one. This is the whole point of the rule: not that
substitution is avoided, but that it stops being invisible.

## What to run, and why these

Twenty-one of the seventy-six. The `selection` category has thirty-seven fixtures and nearly all of
them touch a description that changed, so "only the ones at risk" saves nothing — the list below is
chosen by what each fixture **decides**, and every entry brings its matched pair.

**The `handover` category — all of it.** Added by #76 and run once, on the `-p` route, which saw
the first element of each sequence and none of the seconds. `hand-4` is the one to watch: it is
`hand-1` with the second intent removed, it fails if the plugin has learned to announce a successor
every time, and it is the only one a `-p` run decides whole. Five of the nine carry a
`precondition` a `-p` run cannot satisfy at all.

| Fixture  | What it pins                                                | Precondition |
| -------- | ----------------------------------------------------------- | ------------ |
| `hand-1` | the plain composite — refine, then plan                     | sprint       |
| `hand-2` | the conditional read, where a stated condition decides      | sprint       |
| `hand-3` | a split, which leaves its successor's subject undetermined  | sprint       |
| `hand-4` | the single-intent twin, which must produce **no** successor | none         |
| `hand-5` | a fix version read, a sprint changed                        | sprint       |
| `hand-6` | its mirror — a sprint read, a fix version changed           | sprint       |
| `hand-7` | the intake floor on the debt axis                           | none         |

Two more joined the category with #83, and they are the reason it now carries the intake floor.
`sel-capture-3` and `sel-capture-6` were `selection` fixtures asserting that `jira-diagnose` must
**not** fire; both failed that way in the run of 2026-09-06, on an exclusion written as plainly as
prose gets. The floor moved inside the skill, so `jira-diagnose` firing is legitimate and the
handover is what must hold.

| Fixture         | What it pins                                                      | Precondition |
| --------------- | ----------------------------------------------------------------- | ------------ |
| `sel-capture-3` | a relayed fault whose symptom reads as a gesture at reproduction  | none         |
| `sel-capture-6` | the same, with the environment named precisely and still no steps | none         |

Those two need nothing beyond a profile: intake writes a work item and plans nothing, and `hand-7`
is the same shape on the debt axis. Four of the nine are therefore runnable without a sprint —
`hand-4`, `hand-7`, `sel-capture-3` and `sel-capture-6` — which is worth knowing when a sandbox has
no active sprint and one cannot be made.

**Twelve `selection` fixtures**, in six pairs that each move one variable:

| Pair                              | The variable                                         |
| --------------------------------- | ---------------------------------------------------- |
| `sel-inspect-4` · `sel-release-1` | whether the request changes anything                 |
| `sel-release-2` · `sel-release-3` | the way onto a fix version against the way off       |
| `sel-inspect-3` · `sel-plan-3`    | reading a sprint against taking work out of one      |
| `sel-capture-4` · `sel-propose-6` | whether any figure is present at all                 |
| `sel-propose-2` · `sel-plan-4`    | "on the backlog" meaning create against meaning move |
| `sel-propose-3` · `sel-propose-6` | first-hand against relayed, both carrying a datum    |

`sel-propose-6` appears twice on purpose: it is one end of two different pairs, and a fixture that
only ever moves one variable in one direction proves less than it looks.

`sel-diagnose-4` keeps its place among the `selection` fixtures and changes role. It is the same
fault relayed, arriving complete, and it is now the guard on the new step: a skill that handed over
whenever material came in by email would pass every fixture above and fail this one. It is to the
intake floor what `hand-4` is to the handover contract.

## Recording it

Under `evals/runs/<date>-<what-changed>/`, per `evals/README.md`: one file per fixture that
misbehaved, naming the fixture, the model, what fired and what should have. A run where everything
passed needs one line saying so. Passing output is not worth keeping — it grows the repository and
nobody reads it.

Anything that misbehaves gets a fix or an issue of its own before the run is called done.
