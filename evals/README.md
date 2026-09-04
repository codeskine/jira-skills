# Evaluation fixtures

Prompt-level fixtures that exercise the plugin the way a user does. They are one of the three
seams this project keeps: `scripts/check-package.mjs` asserts that the package is structurally
sound, `npm test` asserts that the rules that check runs still run, and this one asserts that the
model does the right thing when someone speaks.

## What is tested, and why only this

Ten skills were separated by the **intent a user expresses**, and their descriptions are the only
thing enforcing that separation. Nothing else in the repository can catch a description that has
drifted into its neighbour's territory.

| Category    | The question it asks                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selection` | Given a phrase someone would really say, does the right skill fire — and do the wrong ones stay quiet?                                                        |
| `gate`      | Is the complete artifact presented and approval awaited, rather than written?                                                                                 |
| `ordering`  | Is the project profile read before anything is proposed — and, where it or a channel cannot supply something, is the gap announced rather than worked around? |

**What is deliberately not tested:** the wording of any template, the phrasing of any question,
the content of any persona. Those are editorial, they will change, and asserting on them produces
tests that fail on every improvement.

**Not a seam at all:** live calls against a real Jira tenant. The plugin has no runtime of its
own, and a test that needs a tenant is not a test a contributor can run.

## Running them

There is no runner. A fixture is a prompt and an expectation, and judging whether the
expectation was met is the work.

1. Install the plugin in a scratch repository, or point Claude Code at this one.
2. For an `ordering` fixture, arrange the state its `setup` field describes — most of them turn
   on a profile that is absent, incomplete, or describes a project that cannot do the thing.
3. Paste the `prompt` into a **fresh session**. This matters: a session that has already loaded
   a skill will keep choosing it, and selection is exactly what is under test.
4. Compare what happened against `expect_skill` and `expect_not`, or against `expect`.

For a change to the descriptions, running the `selection` category alone is the useful signal,
and it is the one to run before merging any description edit.

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
