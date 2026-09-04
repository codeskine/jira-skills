# A test of the repository's own tooling is not a seam

The phase spec allows two testing seams and no more: the package integrity check, and the
evaluation fixtures. It says so because the product of this repository is Markdown instructions,
and the two things that can actually break are the package being structurally inconsistent and
the model doing the wrong thing when a user speaks. Everything else is editorial and would
produce tests that fail on every improvement.

A unit suite over the frontmatter rules was written while implementing them, and removed before
the commit on the strength of that rule. It is reinstated, because the rule was read one level
too high.

**A seam is a place where the product is tested.** The integrity check is one: it asserts things
about the ten skills. The rules that check runs are not the product — they are the instrument.
Asserting that the instrument reads what it claims to read is not a third opinion about the
skills; it is the first opinion about the check. Nothing else holds it: an integrity check that
silently stopped rejecting a description naming a work type would pass on every skill in the
repository, because none of them names one.

## Consequences

- `npm test` runs `scripts/skill-frontmatter.test.mjs`: the frontmatter reader on inline,
  quoted, folded, nested and CRLF input, one case per rule, and the guarantee that every failure
  is reported rather than the first. `node:test` and `node:assert` only, so it runs on a clean
  clone before anything is installed.
- It stays out of the publish path. `prepack` runs the integrity check and nothing else — the
  gate before publishing is still that the package is consistent, not that a developer's tests
  are green.
- The rule generalises: **a test of this repository's tooling is not a seam and does not need to
  argue for itself. A test of a skill's wording is not a test, and no amount of arguing makes it
  one.** The line is what the assertion is about, not which command runs it.
- Writing the cases is what surfaced the two rules worth having: an allowlist for `allowed-tools`
  rather than a denylist, because `Bash` and `Bash(*)` grant git without naming it; and the
  distinction between an omitted field and a wrong one, which produce different errors because
  they send an author to different places. Both came out of asking what a case should assert.

## Considered alternatives

- **Leave it out, as the spec said.** Fewest commands to keep green. Rejected because it leaves
  the rules unverifiable in practice: the only thing exercising them would be ten skills that all
  pass, which cannot distinguish a rule that works from a rule that no longer runs.
- **Fold the cases into the integrity check**, as fixture skills under a test directory. No new
  command. Rejected because the check walks the real skills tree and would have to learn to walk
  a second one, and because a malformed fixture skill on disk is a trap for every other tool that
  globs `skills/*/SKILL.md`.
- **Add it to `prepack`.** Publishing would then be gated on the tests too. Rejected because it
  changes what publishing means for the sake of tidiness; the integrity check is the gate because
  it is the thing that says the package is installable.
