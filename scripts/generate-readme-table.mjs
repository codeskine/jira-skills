#!/usr/bin/env node
// Regenerates the skill table in README.md from the skills themselves.
//
// The table is the one part of the README that can silently stop being true: a skill is added,
// renamed or repurposed and the prose describing it stays. Generating it means the only way to
// change what the README says about a skill is to change the skill.
//
// Groups come from skills.sh.json; names and summaries from each SKILL.md frontmatter. Run with
// --check to fail instead of writing, which is what a pre-publish check wants.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

import { parseFrontmatter } from './skill-frontmatter.mjs';

const START = '<!-- skills:start -->';
const END = '<!-- skills:end -->';

/**
 * A description is built as: what the skill is, when to use it, then the boundaries against its
 * neighbours. The first two sentences are the useful half here — the boundary clauses matter to
 * the model choosing a skill and only crowd a reader choosing one.
 */
const summarise = (description) =>
  description
    .split(/(?<=\.)\s+/)
    .slice(0, 2)
    .join(' ')
    .trim();

const groupings = JSON.parse(readFileSync('skills.sh.json', 'utf8')).groupings;

const rows = [];
for (const group of groupings) {
  rows.push(`**${group.title}** — ${group.description}`, '');
  rows.push('| Skill | What it does |', '| ----- | ------------ |');
  for (const name of group.skills) {
    const path = `skills/${name}/SKILL.md`;
    if (!existsSync(path)) throw new Error(`${path} does not exist`);
    const frontmatter = parseFrontmatter(readFileSync(path, 'utf8'));
    if (frontmatter === null) throw new Error(`${path} has no frontmatter`);
    rows.push(`| \`${frontmatter.name}\` | ${summarise(frontmatter.description)} |`);
  }
  rows.push('');
}

const table = rows.join('\n').trimEnd();
const readme = readFileSync('README.md', 'utf8');
const before = readme.indexOf(START);
const after = readme.indexOf(END);
if (before === -1 || after === -1) {
  console.error(`README.md has no ${START} / ${END} markers.`);
  process.exit(1);
}

const updated = `${readme.slice(0, before + START.length)}\n\n${table}\n\n${readme.slice(after)}`;

if (process.argv.includes('--check')) {
  if (updated !== readme) {
    console.error('README.md skill table is out of date. Run: node scripts/generate-readme-table.mjs');
    process.exit(1);
  }
  console.log('README.md skill table is up to date.');
} else {
  writeFileSync('README.md', updated);
  console.log(`README.md skill table regenerated: ${groupings.length} groups.`);
}
