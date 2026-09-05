// Tests for the installer's rule on .claude-plugin/plugin.json, run with `npm test`.
//
// The ten real entries all pass, so they cannot tell a rule that works from a rule that stopped
// running. That is precisely how the rule came to be missing: the integrity check reported a
// green package while `claude plugin install` refused the manifest. These cases hold the rule
// to its word.
//
// node:test and node:assert only: a contributor must be able to run this on a clean clone.

import { test } from "node:test";
import assert from "node:assert/strict";

import { skillNameFromEntry, validateManifestSkills } from "./plugin-manifest.mjs";

const errorsFor = (entries) => validateManifestSkills(entries).errors;
const namesFor = (entries) => validateManifestSkills(entries).names;

test("a well-formed entry passes and resolves to its directory name", () => {
  assert.deepEqual(errorsFor(["./skills/jira-init"]), []);
  assert.deepEqual(namesFor(["./skills/jira-init"]), ["jira-init"]);
});

test("the whole real manifest shape passes", () => {
  const entries = ["./skills/jira-init", "./skills/jira-capture", "./skills/jira-inspect"];
  assert.deepEqual(errorsFor(entries), []);
  assert.deepEqual(namesFor(entries), ["jira-init", "jira-capture", "jira-inspect"]);
});

test("a bare name is refused — this is the defect the check used to miss", () => {
  const [error] = errorsFor(["jira-init"]);
  assert.match(error, /must start with "\.\/"/);
  assert.deepEqual(namesFor(["jira-init"]), []);
});

test("a path without the ./ prefix is refused even when it names the right directory", () => {
  assert.match(errorsFor(["skills/jira-init"])[0], /must start with "\.\/"/);
});

test("a skill outside skills/ is refused", () => {
  assert.match(errorsFor(["./jira-init"])[0], /must be of the form/);
});

test("a nested path is refused", () => {
  assert.match(errorsFor(["./skills/jira-init/SKILL.md"])[0], /must be of the form/);
});

test("a trailing slash leaves no name, so it is refused", () => {
  assert.match(errorsFor(["./skills/"])[0], /must be of the form/);
});

test("the same skill declared twice is refused once", () => {
  const errors = errorsFor(["./skills/jira-init", "./skills/jira-init"]);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /declared twice/);
  assert.deepEqual(namesFor(["./skills/jira-init", "./skills/jira-init"]), ["jira-init"]);
});

test("a non-string entry is refused without throwing", () => {
  assert.match(errorsFor([42])[0], /is not a string/);
  assert.match(errorsFor([null])[0], /is not a string/);
});

test("an empty manifest yields no names and no errors", () => {
  assert.deepEqual(validateManifestSkills([]), { names: [], errors: [] });
});

test("one malformed entry does not hide the well-formed ones", () => {
  const entries = ["jira-init", "./skills/jira-plan"];
  assert.equal(errorsFor(entries).length, 1);
  assert.deepEqual(namesFor(entries), ["jira-plan"]);
});

test("skillNameFromEntry returns null rather than guessing", () => {
  assert.equal(skillNameFromEntry("./skills/jira-init"), "jira-init");
  assert.equal(skillNameFromEntry("jira-init"), null);
  assert.equal(skillNameFromEntry("./skills/a/b"), null);
  assert.equal(skillNameFromEntry(undefined), null);
});
