#!/usr/bin/env node
// Pre-publish integrity check.
// Fails the pack if the plugin manifest, the VERSION file and the skills directory have
// drifted apart, or if a skill's frontmatter would misbehave once installed. One gate:
// everything that must hold before publishing is asserted here.

import { readFileSync, readdirSync, existsSync } from 'node:fs';

import { validateSkill } from './skill-frontmatter.mjs';

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const errors = [];

const pkg = read('package.json');
const manifest = read('.claude-plugin/plugin.json');
const version = readFileSync('VERSION', 'utf8').trim();

if (pkg.version !== version) errors.push(`VERSION is ${version} but package.json is ${pkg.version}`);
if (manifest.version !== version) errors.push(`.claude-plugin/plugin.json is ${manifest.version} but VERSION is ${version}`);
if (!Array.isArray(manifest.skills)) errors.push('.claude-plugin/plugin.json has no "skills" array');

const declared = manifest.skills ?? [];
const present = existsSync('skills')
  ? readdirSync('skills', { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  : [];

for (const name of declared) {
  if (!existsSync(`skills/${name}/SKILL.md`)) errors.push(`declared skill "${name}" has no skills/${name}/SKILL.md`);
}

// `shared` holds the contracts every skill links. It is not a skill: it is neither declared
// in the manifest nor carries frontmatter, and it is the only directory here that is exempt.
for (const name of present) {
  if (name === 'shared') continue;

  if (!declared.includes(name)) errors.push(`skills/${name}/ exists but is not declared in .claude-plugin/plugin.json`);

  const path = `skills/${name}/SKILL.md`;
  if (!existsSync(path)) continue;
  for (const error of validateSkill(name, readFileSync(path, 'utf8'))) errors.push(`${path}: ${error}`);
}

const grouped = existsSync('skills.sh.json')
  ? read('skills.sh.json').groupings.flatMap((g) => g.skills)
  : declared;

for (const name of declared) {
  if (!grouped.includes(name)) errors.push(`declared skill "${name}" is in no skills.sh.json grouping`);
}

if (errors.length > 0) {
  console.error('Package integrity check failed:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Package integrity check passed: ${declared.length} skills at ${version}.`);
