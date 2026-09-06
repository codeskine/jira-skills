#!/usr/bin/env node
// Integrity check for the bilingual documentation under docs/.
//
// Separate from check-package.mjs on purpose: that one is the pre-publish gate, and the
// documentation is not published — package.json "files" does not carry docs/. This runs before a
// change is opened, alongside the generator.
//
// It asserts the things that actually go wrong: a skill added without its pair, a page that lost
// a section, a link that rotted, a fence left open, and a file written but never tracked.
//
// --strict additionally fails while any screenshot placeholder is still pending.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, normalize } from "node:path";

const SECTIONS = {
  en: [
    "## What it does",
    "## When it fires · when it does not",
    "## How to use it",
    "## Worked exchange",
    "## The result",
    "## What it will not do",
    "## See also",
  ],
  it: [
    "## Cosa fa",
    "## Quando si attiva · quando no",
    "## Come si usa",
    "## Scambio di esempio",
    "## Il risultato",
    "## Cosa non fa",
    "## Vedi anche",
  ],
};

const HEADER = ["<!-- skill-header:start -->", "<!-- skill-header:end -->"];

const errors = [];
const pending = [];

// Written but never tracked is the failure this project has already had once: docs/* is ignored
// by default, so `git add -A` skips a new page in silence and the commit looks fine.
const tracked = new Set(
  execFileSync("git", ["ls-files", "docs", "README.md", "README.it.md"], {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean),
);

const pairsFor = (kind, name) => [
  [`docs/${kind}/${name}.md`, "en"],
  [`docs/${kind}/${name}.it.md`, "it"],
];

const units = [
  ...readdirSync("skills", { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "shared")
    .map((e) => pairsFor("skills", e.name)),
  ...readdirSync("commands")
    .filter((f) => f.endsWith(".md"))
    .map((f) => pairsFor("commands", f.replace(/\.md$/, ""))),
].flat();

const extras = [
  ["docs/development-process.md", "prose"],
  ["docs/development-process.it.md", "prose"],
  ["docs/termbase.md", "prose"],
  ["README.md", "prose"],
  ["README.it.md", "prose"],
];

for (const [path, lang] of [...units, ...extras]) {
  if (!existsSync(path)) {
    errors.push(
      `${path} is missing — every skill and every command needs both documents`,
    );
    continue;
  }
  if (!tracked.has(path)) {
    errors.push(
      `${path} exists but git does not track it — check .gitignore before committing`,
    );
  }

  const text = readFileSync(path, "utf8");
  const lines = text.split("\n");

  if (!lines[0].startsWith("# "))
    errors.push(`${path} does not open with an H1 title`);

  if (lang !== "prose") {
    for (const heading of SECTIONS[lang]) {
      if (!lines.includes(heading))
        errors.push(`${path} has no "${heading}" section`);
    }
    const order = SECTIONS[lang]
      .map((h) => lines.indexOf(h))
      .filter((i) => i !== -1);
    if (order.some((value, i) => i > 0 && value < order[i - 1])) {
      errors.push(`${path} has its sections out of the contract's order`);
    }
    for (const marker of HEADER) {
      if (!text.includes(marker)) errors.push(`${path} has no ${marker}`);
    }
  }

  // A fence opens and closes with the same run of backticks; an odd count means one is open.
  const fences = lines.filter((line) => /^`{3,}/.test(line)).length;
  if (fences % 2 !== 0)
    errors.push(`${path} leaves a code fence open (${fences} fence lines)`);

  for (const shot of text.matchAll(/<!--\s*shot:(\S+)\s+pending\s*-->/g)) {
    pending.push(`${path}: ${shot[1]}`);
  }

  for (const link of text.matchAll(/]\((?!https?:|mailto:|#)([^)\s]+)\)/g)) {
    const target = normalize(join(dirname(path), link[1].split("#")[0]));
    if (!target || target.startsWith("..")) continue;
    if (!existsSync(target))
      errors.push(`${path} links to ${link[1]}, which does not exist`);
    else if (statSync(target).isDirectory() && !link[1].endsWith("/")) {
      errors.push(`${path} links to ${link[1]}, which is a directory`);
    }
  }
}

if (errors.length) {
  console.error("Documentation check failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const strict = process.argv.includes("--strict");
if (pending.length) {
  const label = strict
    ? "Screenshots still pending"
    : "Screenshots pending (not a failure)";
  console[strict ? "error" : "log"](`${label}:`);
  for (const shot of pending) console[strict ? "error" : "log"](`  - ${shot}`);
  if (strict) process.exit(1);
}

console.log(
  `Documentation check passed: ${units.length / 2} units, ${units.length + extras.length} files.`,
);
