// Tests for the frontmatter rules, run with `npm test`.
//
// The integrity check asserts things about skills; this asserts that the check tells the truth.
// It is not a third seam — see docs/adr/0005 — and it is never in the publish path.
//
// node:test and node:assert only: a contributor adding a rule must be able to run this on a
// clean clone, before anything is installed.

import { test } from "node:test";
import assert from "node:assert/strict";

import { parseFrontmatter, validateSkill } from "./skill-frontmatter.mjs";

// A skill that passes every rule. Each case below breaks exactly one thing in it, so a failure
// names the rule that broke rather than everything that happens to be wrong.
const VALID = `---
name: jira-example
description: "Jira example author. Use when the user asks to record something on Jira."
user-invocable: true
license: MIT
compatibility: Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian".
metadata:
  author: codeskine
  version: "1.0.0"
allowed-tools: Read Glob Grep mcp__atlassian AskUserQuestion
---

The body.
`;

/** VALID with one piece of text swapped, so a case states only what it changes. */
const swapping = (from, to) => {
  assert.ok(VALID.includes(from), `fixture does not contain: ${from}`);
  return VALID.replace(from, to);
};

/** VALID with one piece of text dropped, for the cases that omit a field. */
const without = (text) => swapping(text, "");

const errorsFor = (text, directory = "jira-example") =>
  validateSkill(directory, text);

/** Asserts exactly one error, matching `pattern`. */
const onlyError = (text, pattern, directory) => {
  const errors = errorsFor(text, directory);
  assert.equal(
    errors.length,
    1,
    `expected one error, got: ${JSON.stringify(errors)}`,
  );
  assert.match(errors[0], pattern);
};

test("the fixture every case starts from is itself valid", () => {
  assert.deepEqual(errorsFor(VALID), []);
});

// --- the reader -------------------------------------------------------------------------

test("reads an inline scalar", () => {
  assert.equal(
    parseFrontmatter("---\nname: jira-example\n---\n").name,
    "jira-example",
  );
});

test("strips the quotes from a quoted scalar, single or double", () => {
  const parsed = parseFrontmatter("---\na: \"one: two\"\nb: 'three'\n---\n");
  assert.equal(parsed.a, "one: two");
  assert.equal(parsed.b, "three");
});

test("reads true and false as booleans, and only those", () => {
  const parsed = parseFrontmatter('---\na: true\nb: false\nc: "true"\n---\n');
  assert.equal(parsed.a, true);
  assert.equal(parsed.b, false);
  assert.equal(
    parsed.c,
    "true",
    'a quoted "true" is the string, not the boolean',
  );
});

test("folds a value continued on the following lines into one string", () => {
  const parsed = parseFrontmatter(
    "---\ndescription: one\n  two\n  three\nname: x\n---\n",
  );
  assert.equal(parsed.description, "one two three");
  assert.equal(
    parsed.name,
    "x",
    "the folded value does not swallow the next key",
  );
});

test("reads one level of nesting as an object", () => {
  const parsed = parseFrontmatter(
    '---\nmetadata:\n  author: codeskine\n  version: "1.0.0"\n---\n',
  );
  assert.deepEqual(parsed.metadata, { author: "codeskine", version: "1.0.0" });
});

test("a key with an empty inline value and no continuation is the empty string", () => {
  assert.equal(parseFrontmatter("---\nname:\n---\n").name, "");
});

test("ignores blank lines inside the block", () => {
  const parsed = parseFrontmatter("---\nname: x\n\nlicense: MIT\n---\n");
  assert.equal(parsed.name, "x");
  assert.equal(parsed.license, "MIT");
});

test("returns null when the file does not open with a frontmatter block", () => {
  assert.equal(parseFrontmatter("# A heading\n\nno frontmatter here\n"), null);
  assert.equal(
    parseFrontmatter("\n---\nname: x\n---\n"),
    null,
    "it must open the file",
  );
});

test("accepts CRLF line endings", () => {
  assert.equal(
    parseFrontmatter("---\r\nname: jira-example\r\n---\r\n").name,
    "jira-example",
  );
});

// --- one case per rule ------------------------------------------------------------------

test("a file with no frontmatter is one error, and no others are attempted", () => {
  assert.deepEqual(errorsFor("# Just a body\n"), ["has no YAML frontmatter"]);
});

test("name must be present", () => {
  onlyError(without("name: jira-example\n"), /name is missing/);
});

test("name must match the directory it sits in", () => {
  onlyError(VALID, /does not match its directory "jira-other"/, "jira-other");
});

test("description must be present", () => {
  assert.deepEqual(
    errorsFor(
      without(
        'description: "Jira example author. Use when the user asks to record something on Jira."\n',
      ),
    ),
    ["description is missing"],
  );
});

test("description must contain the word Jira", () => {
  onlyError(
    swapping(
      "Jira example author. Use when the user asks to record something on Jira.",
      "Example author. Use when the user asks to record something.",
    ),
    /does not contain the word "Jira"/,
  );
});

test("description must carry a trigger clause", () => {
  onlyError(
    swapping(
      "Jira example author. Use when the user asks to record something on Jira.",
      "Jira example author. It records things on Jira.",
    ),
    /no "Use when" or "Apply when" trigger clause/,
  );
});

test('"Apply when" is a trigger clause too', () => {
  assert.deepEqual(
    errorsFor(swapping("Use when the user asks", "Apply when the user asks")),
    [],
  );
});

test("description must stay within 1,000 characters", () => {
  const trigger =
    "Jira example author. Use when the user asks to record something on Jira.";
  // Padded to an exact length, so editing the fixture cannot break this case.
  const padTo = (total) => trigger + " ".repeat(total - trigger.length);

  assert.deepEqual(
    errorsFor(swapping(trigger, padTo(1000))),
    [],
    "1,000 is inside the limit",
  );
  onlyError(
    swapping(trigger, padTo(1001)),
    /description is 1001 characters; the limit is 1,000 characters/,
  );
});

test("description must not name a work type", () => {
  const types = ["bug", "bugs", "story", "stories", "epic", "task", "subtask"];
  for (const word of types) {
    onlyError(
      swapping(
        "asks to record something on Jira.",
        `asks to record a ${word} on Jira.`,
      ),
      new RegExp(`names the work type "${word}"`),
    );
  }
});

test("sub-task is reported as itself, not as task", () => {
  onlyError(
    swapping("record something on Jira.", "record a sub-task on Jira."),
    /names the work type "sub-task"/,
  );
});

test("a work type inside a longer word is not a work type", () => {
  assert.deepEqual(
    errorsFor(
      swapping("record something on Jira.", "record multitasking on Jira."),
    ),
    [],
  );
});

test("license must be present", () => {
  onlyError(without("license: MIT\n"), /license is missing/);
});

test("license must be MIT", () => {
  onlyError(
    swapping("license: MIT", "license: Apache-2.0"),
    /license is "Apache-2.0"; it must be MIT/,
  );
});

test("user-invocable must be present", () => {
  onlyError(without("user-invocable: true\n"), /user-invocable is missing/);
});

test("user-invocable must be true", () => {
  onlyError(
    swapping("user-invocable: true", "user-invocable: false"),
    /user-invocable must be true/,
  );
});

test("an omitted field and a wrong one are different errors", () => {
  // They send an author to different places: one to add a line, one to correct it.
  assert.match(
    errorsFor(without("name: jira-example\n"))[0],
    /name is missing/,
  );
  assert.match(
    errorsFor(VALID, "jira-other")[0],
    /does not match its directory/,
  );
});

test("compatibility must be present", () => {
  onlyError(
    without(
      'compatibility: Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian".\n',
    ),
    /compatibility must start from/,
  );
});

test("compatibility must start from the documented sentence", () => {
  onlyError(
    swapping(
      "compatibility: Designed for Claude Code.",
      "compatibility: Works anywhere.",
    ),
    /compatibility must start from/,
  );
});

test("compatibility may continue past the documented sentence", () => {
  assert.deepEqual(
    errorsFor(
      swapping(
        'configured as "atlassian".',
        'configured as "atlassian". Uses the jira CLI for the Agile surface.',
      ),
    ),
    [],
  );
});

test("metadata must be present at all", () => {
  assert.deepEqual(
    errorsFor(without('metadata:\n  author: codeskine\n  version: "1.0.0"\n')),
    ["metadata is missing its author and version"],
  );
});

test("metadata.author must be present", () => {
  onlyError(without("  author: codeskine\n"), /metadata\.author is missing/);
});

test("metadata.version must be a semver", () => {
  onlyError(
    swapping('version: "1.0.0"', 'version: "1.0"'),
    /"1\.0" is not a semver/,
  );
  onlyError(
    swapping('version: "1.0.0"', 'version: "v1.0.0"'),
    /"v1\.0\.0" is not a semver/,
  );
});

test("a missing metadata.version reads as a semver failure, not as an absence", () => {
  onlyError(without('  version: "1.0.0"\n'), /"" is not a semver/);
});

test("allowed-tools must be present", () => {
  onlyError(
    without("allowed-tools: Read Glob Grep mcp__atlassian AskUserQuestion\n"),
    /allowed-tools is missing/,
  );
});

test("allowed-tools accepts every tool the project documents", () => {
  assert.deepEqual(
    errorsFor(
      swapping(
        "allowed-tools: Read Glob Grep mcp__atlassian AskUserQuestion",
        "allowed-tools: Read Glob Grep mcp__atlassian AskUserQuestion Write Edit WebFetch Agent Bash(jira:*)",
      ),
    ),
    [],
  );
});

test("allowed-tools rejects a tool outside the documented vocabulary", () => {
  onlyError(
    swapping("allowed-tools: Read", "allowed-tools: Bash(npm:*) Read"),
    /declares "Bash\(npm:\*\)", which is not in the documented tool vocabulary/,
  );
});

test("allowed-tools names git specifically, because a plain Bash grant would hide it", () => {
  onlyError(
    swapping("allowed-tools: Read", "allowed-tools: Bash(git:*) Read"),
    /grants git access; this plugin does not touch git/,
  );
});

// --- reporting --------------------------------------------------------------------------

test("every failure is reported, not just the first", () => {
  const broken = VALID.replace("license: MIT\n", "")
    .replace("user-invocable: true", "user-invocable: false")
    .replace('version: "1.0.0"', 'version: "1"');

  const errors = errorsFor(broken, "jira-other");
  assert.equal(errors.length, 4, JSON.stringify(errors));
  assert.match(errors[0], /does not match its directory/);
  assert.match(errors[1], /license is missing/);
  assert.match(errors[2], /user-invocable must be true/);
  assert.match(errors[3], /is not a semver/);
});

test("errors come back in reading order, so the first names the first problem", () => {
  assert.deepEqual(
    errorsFor(
      VALID.replace("name: jira-example\n", "").replace("license: MIT\n", ""),
    ),
    ["name is missing", "license is missing"],
  );
});
