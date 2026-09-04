# The frontmatter rules get a seam of their own, and the count goes to three

The phase spec allowed two testing seams and no more: the package integrity check, and the
evaluation fixtures. The reasoning was economic — the product of this repository is Markdown
instructions, every command a contributor must keep green is a cost, and a repository like this
one has few places where a unit test pays for itself. That accounting is right, and it stays.

A unit suite over the frontmatter rules was written while implementing them and removed before
the commit on the strength of that limit. It is reinstated, and the limit is raised to three
rather than argued around: **`npm test` is the third seam.** It is a command a contributor must
keep green, it is counted as one, and what it costs is stated below rather than defined away.

## Why this one is worth its cost

The integrity check asserts things about the ten skills. Nothing asserts that the check tells the
truth, and nothing can: the ten skills all pass. A rule that silently stopped running — the one
rejecting a description that names a work type, say — would still see a green check, because no
skill in the repository names one. The other two seams are blind to it by construction, not by
oversight.

That is the admission test, and it is narrow on purpose: **a seam is admitted when it asserts
something no existing seam can reach, and when the thing it guards would keep passing silently if
it broke.** A fourth has to meet it too.

The suite earned its keep while it existed. The allowlist for `allowed-tools` — needed because
`Bash` and `Bash(*)` grant git without naming it — and the distinction between an omitted field
and a wrong one, which send an author to different places, both came out of asking what a case
should assert.

## What it costs, stated plainly

- A contributor who changes what a rule accepts must add or update a case. The suite is the
  reason the rule is trustworthy; a rule added without one restores the blind spot.
- `npm test` joins `node scripts/check-package.mjs` as something to run before finishing. Two
  commands, not one.
- A third seam makes a fourth easier to ask for. It should not be: "it would be nice to have"
  does not meet the admission test above.

## Consequences

- `npm test` runs `scripts/skill-frontmatter.test.mjs`: the frontmatter reader on inline,
  quoted, folded, nested and CRLF input, one case per rule, and the guarantee that every failure
  is reported rather than the first. `node:test` and `node:assert` only, so it runs on a clean
  clone before anything is installed.
- It stays out of the publish path. `prepack` runs the integrity check and nothing else — the
  gate before publishing is that the package is installable, not that a developer's tests are
  green.
- The phase spec, `CLAUDE.md` and `evals/README.md` say three where they said two.
- A test of a skill's wording is still not a test. Templates, question phrasing and persona
  content are editorial, and asserting on them produces tests that fail on every improvement.
  Raising the count admits one seam, not a habit.

## Considered alternatives

- **Rule that testing the tooling is not a seam at all** — a seam being a place where the
  _product_ is tested, and the rules being the instrument rather than the product. It keeps the
  count at two and needs no change to the spec. Rejected because the cost the spec was counting is
  the command, not the subject of the assertion: a contributor keeping `npm test` green pays the
  same either way, and a definition that makes the cost invisible is how a fourth and a fifth
  arrive unannounced.
- **Leave it out, as the spec said.** Fewest commands to keep green. Rejected because it leaves
  the rules unverifiable in practice: the only thing exercising them would be ten skills that all
  pass, which cannot distinguish a rule that works from a rule that no longer runs.
- **Fold the cases into the integrity check**, as fixture skills under a test directory. No new
  command, so the count stays at two honestly. Rejected because the check walks the real skills
  tree and would have to learn to walk a second one, and because a malformed fixture skill on disk
  is a trap for every other tool that globs `skills/*/SKILL.md`.
- **Add it to `prepack`.** Publishing would be gated on the tests too, and no new command appears.
  Rejected because it changes what publishing means for the sake of the count; the integrity check
  is the gate because it is the thing that says the package is installable.
