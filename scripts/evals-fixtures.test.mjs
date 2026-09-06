// Tests for the fixture rules, run with `npm test`.
//
// The seventy-three real fixtures all pass, so they cannot tell a rule that works from a rule that
// stopped running. These cases hold each rule to its word.
//
// node:test and node:assert only: a contributor must be able to run this on a clean clone.

import { test } from "node:test";
import assert from "node:assert/strict";

import { validateFixture, validateFixtures } from "./evals-fixtures.mjs";

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
