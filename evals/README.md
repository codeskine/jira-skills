# Evaluation fixtures

Prompt-level fixtures that exercise the plugin the way a user does. They are one of the three
seams this project keeps: `scripts/check-package.mjs` asserts that the package is structurally
sound, `npm test` asserts that the rules that check runs still run, and this one asserts that the
model does the right thing when someone speaks.

## What is tested, and why only this

Ten skills were separated by the **intent a user expresses**, and their descriptions are the only
thing enforcing that separation. Nothing else in the repository can catch a description that has
drifted into its neighbour's territory.

| Category    | The question it asks                                                                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selection` | Given a phrase someone would really say, does the right skill fire — and do the wrong ones stay quiet?                                                            |
| `gate`      | Is the complete artifact presented and approval awaited, rather than written?                                                                                     |
| `ordering`  | Is the project profile read before anything is proposed — and, where it or a channel cannot supply something, is the gap announced rather than worked around?     |
| `handover`  | Where one utterance carried two intents, do both happen — in the order the material forces, with the outstanding one named at the first gate rather than dropped? |

**What is deliberately not tested:** the wording of any template, the phrasing of any question,
the content of any persona. Those are editorial, they will change, and asserting on them produces
tests that fail on every improvement.

**Not a seam at all:** live calls against a real Jira tenant. The plugin has no runtime of its
own, and a test that needs a tenant is not a test a contributor can run.

## Running them

**There is a runner, and it is not available here.** `claude plugin eval` exists in the CLI —
it takes a path, a plugin name or a `plugin@marketplace` id, isolates each case, runs it a
configurable number of times and scores it, with an ablation arm that reports the delta against no
plugin at all. Its `--help` documents the whole thing. Every actual invocation, on the account this
was checked from, prints `plugin eval is currently in early access` and exits 0 having done
nothing.

**Do not re-check it with `--help`.** That is the obvious test and it gives a false positive: the
help printed in full while `eval .`, `eval <name>` and `eval init --bare` all still returned the
early-access line. The test that answers is running it.

So until it opens, judging whether the expectation was met is the work, and the procedure below is
how. What the runner would change when it does open — whether these fixtures become `case.yaml`
plus graders, and what a `selection` fixture maps onto — is a decision worth taking then rather
than guessing at now. Two of its features look built for this suite: a plugin target that resolves
a **directory**, which removes the stale-install trap the procedure below has to work around, and
a `tool_used: Skill` grader, which is what a `selection` fixture asserts.

1. **Install the plugin, and prove the copy is current.** The cache is keyed on the version, and
   the version is frozen at `1.0.0` until this plugin ships — so `claude plugin update` reports
   "already at the latest" and propagates nothing, however far `main` has moved, and
   `claude plugin marketplace update` refreshes the marketplace without touching the plugin cache.
   Only `uninstall` followed by `install` refreshes it.

   Then verify rather than assume: grep the installed `SKILL.md` for wording that exists only in
   the commit under test. A run against a stale install grades descriptions nobody is shipping and
   reports green. Every replay round this repository has run reported, unprompted, that the
   installed copy differed from the one it was given — which is what that failure looks like from
   the inside.

   Check for more than one cached copy while you are there. Four have accumulated on one machine,
   from marketplaces added under different names, and the enabled one was the oldest.

2. For an `ordering` fixture, arrange the state its `setup` field describes — most of them turn
   on a profile that is absent, incomplete, or describes a project that cannot do the thing.
3. Paste the `prompt` into a **fresh session**. This matters: a session that has already loaded
   a skill will keep choosing it, and selection is exactly what is under test.
4. Compare what happened against `expect_skill` and `expect_not`, against `expect_sequence`, or
   against `expect`.

A `handover` fixture asserts an **order**, not a single choice: `expect_sequence` lists the skills
in the order they must run, and `expect` says what has to be true between them — which gate names
what, and what a stated condition decides. A run where both skills fired but the second one was
never announced at the first gate has failed the fixture, however right the final state looks.

For a change to the descriptions, running the `selection` category alone is the useful signal,
and it is the one to run before merging any description edit.

The full procedure — the preconditions that are silent when unmet, and which fixtures are worth a
session — is `docs/agents/behavioural-verification.md`.

## Recording a run

Keep results under `evals/runs/<date>-<what-changed>/`, one file per fixture that did not behave,
naming the fixture, the model, what fired, and what should have. A run where everything passed
needs one line saying so.

There is no value in recording passing output verbatim: it grows the repository and nobody reads
it. What is worth keeping is the failure and what was changed in response.

## Adding a fixture

Add it to `evals.json`. Two rules:

- **Write the prompt in the user's words, not the skill's.** A fixture that says "capture this
  raw request" tests nothing: it contains the answer. The prompts here say things like "someone
  emailed asking for…" precisely because that is what arrives.
- **Say why the fixture exists** in `why`. A fixture whose point nobody remembers is one nobody
  dares delete when it becomes wrong.

The pairs most likely to be confused already have fixtures, and they are the ones to extend when
a new ambiguity appears: intake against refinement, a proposal against a risk, a defect against
debt, a sprint against a fix version, and every read-only question against the skill that would
write.

- **A `handover` fixture needs its single-intent twin.** `hand-4` is `hand-1` with the second
  intent removed, and it exists because fixtures that pinned only the composite cases would pass
  just as well against a plugin that had learned to announce a successor every time.
