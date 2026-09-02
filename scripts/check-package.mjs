#!/usr/bin/env node
// Pre-publish integrity check.
// Fails the pack if the three plugin manifests, the VERSION file and the skills
// directory have drifted apart. Replaces the hard-coded path list that had to be
// edited by hand every time a skill was added.

import { readFileSync, readdirSync, existsSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const manifests = ['.claude-plugin/plugin.json', '.cursor-plugin/plugin.json', '.codex-plugin/plugin.json'];
const errors = [];

const pkg = read('package.json');
const version = readFileSync('VERSION', 'utf8').trim();

if (pkg.version !== version) {
  errors.push(`VERSION is ${version} but package.json is ${pkg.version}`);
}

const [reference, ...others] = manifests.map((path) => ({ path, json: read(path) }));

for (const { path, json } of [reference, ...others]) {
  if (json.version !== version) errors.push(`${path} is ${json.version} but VERSION is ${version}`);
  if (!Array.isArray(json.skills)) errors.push(`${path} has no "skills" array`);
}

for (const { path, json } of others) {
  const a = JSON.stringify(reference.json.skills);
  const b = JSON.stringify(json.skills);
  if (a !== b) errors.push(`${path} skills array differs from ${reference.path}`);
}

const declared = reference.json.skills ?? [];
const present = existsSync('skills')
  ? readdirSync('skills', { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  : [];

for (const name of declared) {
  if (!existsSync(`skills/${name}/SKILL.md`)) errors.push(`declared skill "${name}" has no skills/${name}/SKILL.md`);
}

for (const name of present) {
  if (name !== 'shared' && !declared.includes(name)) errors.push(`skills/${name}/ exists but is not declared in the plugin manifests`);
}

if (errors.length > 0) {
  console.error('Package integrity check failed:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Package integrity check passed: ${declared.length} skills at ${version}.`);
