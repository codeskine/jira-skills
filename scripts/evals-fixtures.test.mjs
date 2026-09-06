// Tests for the fixture rules, run with `npm test`.
//
// The seventy-three real fixtures all pass, so they cannot tell a rule that works from a rule that
// stopped running. These cases hold each rule to its word.
//
// node:test and node:assert only: a contributor must be able to run this on a clean clone.

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  validateFixture,
  validateFixtures,
  validateProcedureLists,
} from "./evals-fixtures.mjs";

/** A fixture that passes every rule. Each case breaks exactly one thing in it. */
const VALID = {
  id: "sel-example-1",
  category: "selection",
  prompt: "Take PROJ-88 out of 4.10.",
  entities: ["PROJ-88", "4.10"],
  expect_skill: "jira-release",
  why: "An example.",
};

const swapping = (changes) => ({ ...VALID, ...changes });

test("the fixture every case starts from is itself valid", () => {
  assert.deepEqual(validateFixture(VALID), []);
});

// --- the omission a work item key makes checkable ------------------------------------------

test("a prompt naming a work item the fixture does not declare is caught", () => {
  assert.deepEqual(validateFixture(swapping({ entities: ["4.10"] })), [
    'prompt names the work item "PROJ-88", which entities does not declare',
  ]);
});

test("a prompt naming a work item and declaring nothing at all is caught", () => {
  const bare = { ...VALID };
  delete bare.entities;
  assert.deepEqual(validateFixture(bare), [
    'prompt names the work item "PROJ-88", which entities does not declare',
  ]);
});

test("every undeclared key is reported, not only the first", () => {
  const errors = validateFixture(
    swapping({ prompt: "Move PROJ-31 and PROJ-40.", entities: [] }),
  );
  assert.equal(errors.length, 2, JSON.stringify(errors));
  assert.match(errors[0], /PROJ-31/);
  assert.match(errors[1], /PROJ-40/);
});

test("a key named twice is reported once", () => {
  const errors = validateFixture(
    swapping({
      prompt: "Take PROJ-88 out, then put PROJ-88 back.",
      entities: [],
    }),
  );
  assert.equal(errors.length, 1, JSON.stringify(errors));
});

// --- what the rule deliberately does not check ---------------------------------------------

test("a version-shaped token is left to the author, because a product version is not an entity", () => {
  // sel-capture-6 in miniature: "4.9" is a product a customer runs, inside their own sentence, and
  // the fixture exists to assert that naming it does not clear the intake floor. A rule that
  // demanded it be declared would push a runner into substituting it.
  const prose = {
    id: "sel-capture-x",
    category: "selection",
    prompt: "A customer emailed: it has been mangling the CSV. They're on 4.9.",
    expect_skill: "jira-capture",
    why: "An example.",
  };
  assert.deepEqual(validateFixture(prose), []);
});

// --- the declaration has to match the prompt -----------------------------------------------

test("declaring an entity the prompt does not name is caught", () => {
  assert.deepEqual(
    validateFixture(swapping({ entities: ["PROJ-88", "4.10", "PROJ-99"] })),
    ['entities names "PROJ-99", which the prompt does not'],
  );
});

test("entities must be a list of strings", () => {
  const errors = validateFixture(swapping({ entities: "PROJ-88" }));
  assert.match(errors[0], /entities is not a list of strings/);
});

// --- the rest of the shape ------------------------------------------------------------------

test("the category must be one of the four", () => {
  assert.deepEqual(validateFixture(swapping({ category: "routing" })), [
    'category "routing" is not one of the four',
  ]);
});

test("a missing prompt stops the checks that read it", () => {
  const bare = swapping({ prompt: "" });
  assert.deepEqual(validateFixture(bare), ["prompt is missing"]);
});

test("a missing id is one error, and no others are attempted", () => {
  assert.deepEqual(validateFixture({ category: "selection" }), [
    "id is missing",
  ]);
});

// --- the file as a whole ----------------------------------------------------------------------

test("a duplicated id is caught, which no single fixture could see", () => {
  const file = { evals: [VALID, { ...VALID, why: "A copy." }] };
  const errors = validateFixtures(file);
  assert.equal(errors.length, 1, JSON.stringify(errors));
  assert.match(errors[0], /id is used more than once/);
});

test("errors carry the fixture they belong to", () => {
  const file = { evals: [swapping({ entities: [] })] };
  assert.deepEqual(validateFixtures(file), [
    'sel-example-1: prompt names the work item "PROJ-88", which entities does not declare',
  ]);
});

test("a file with no evals array is one error", () => {
  assert.deepEqual(validateFixtures({}), ['has no "evals" array']);
});

// --- the skills a fixture names have to exist -------------------------------------------------
//
// A fixture naming a skill that does not exist can never pass and can never fail: a run compares
// what fired against a name nothing answers to, and the result reads as a misbehaving plugin
// rather than a stale fixture. A rename is the ordinary way in.

const KNOWN = new Set([
  "jira-release",
  "jira-plan",
  "jira-inspect",
  "jira-capture",
]);

test("a fixture naming only skills that exist passes", () => {
  assert.deepEqual(validateFixture(VALID, KNOWN), []);
});

test("expect_skill naming a skill that does not exist is caught", () => {
  assert.deepEqual(
    validateFixture(swapping({ expect_skill: "jira-releases" }), KNOWN),
    ['names the skill "jira-releases", which does not exist'],
  );
});

test("expect_not is checked too, since a stale exclusion silently asserts nothing", () => {
  assert.deepEqual(
    validateFixture(
      swapping({ expect_not: ["jira-plan", "jira-gone"] }),
      KNOWN,
    ),
    ['names the skill "jira-gone", which does not exist'],
  );
});

test("every element of expect_sequence is checked", () => {
  const errors = validateFixture(
    swapping({
      expect_skill: undefined,
      expect_sequence: ["jira-gone", "jira-plan", "jira-also-gone"],
    }),
    KNOWN,
  );
  assert.equal(errors.length, 2, JSON.stringify(errors));
  assert.match(errors[0], /jira-gone/);
  assert.match(errors[1], /jira-also-gone/);
});

test("a skill named in two places is reported once", () => {
  const errors = validateFixture(
    swapping({ expect_skill: "jira-gone", expect_not: ["jira-gone"] }),
    KNOWN,
  );
  assert.equal(errors.length, 1, JSON.stringify(errors));
});

test("without a skill list the check is skipped rather than guessed", () => {
  assert.deepEqual(
    validateFixture(swapping({ expect_skill: "jira-gone" })),
    [],
  );
});

// --- the procedure has to name every handover fixture -----------------------------------------
//
// The category is small enough that the procedure lists its members by name, and a runner works
// from that list rather than from the file. A fixture in one and not the other is invisible: the
// suite says it exists, the procedure never asks for it, and a run reports a clean sweep of a set
// that was short by one. That is exactly how hand-7 was added and not run.

const HANDOVER = (id) => ({
  id,
  category: "handover",
  prompt: "Something.",
  expect_sequence: ["jira-refine", "jira-plan"],
});

test("a handover fixture the procedure names passes", () => {
  assert.deepEqual(
    validateProcedureLists(
      [HANDOVER("hand-1")],
      "… | `hand-1` | the plain composite |",
    ),
    [],
  );
});

test("a handover fixture the procedure never names is caught", () => {
  assert.deepEqual(
    validateProcedureLists([HANDOVER("hand-9")], "no list here"),
    [
      'handover fixture "hand-9" is in no list the verification procedure gives a runner',
    ],
  );
});

test("every missing one is reported, not only the first", () => {
  const errors = validateProcedureLists(
    [HANDOVER("hand-8"), HANDOVER("hand-9")],
    "no list here",
  );
  assert.equal(errors.length, 2, JSON.stringify(errors));
});

test("fixtures of other categories are not required to appear", () => {
  // selection and ordering are chosen by pairs and by what each decides, not enumerated whole,
  // so requiring every id would fail on a list that is deliberately partial.
  const other = {
    id: "sel-plan-9",
    category: "selection",
    prompt: "Something.",
  };
  assert.deepEqual(validateProcedureLists([other], "no list here"), []);
});

test("a procedure that cannot be read is skipped rather than failed", () => {
  assert.deepEqual(validateProcedureLists([HANDOVER("hand-9")], null), []);
});
