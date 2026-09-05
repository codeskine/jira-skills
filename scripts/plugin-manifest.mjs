// The installer's rule for the "skills" array of .claude-plugin/plugin.json.
//
// `claude plugin install` refuses a manifest whose entries are bare skill names: each one must
// be a relative path beginning with "./". The integrity check used to compare those entries
// against directory names directly, so a manifest the installer rejected still passed the check
// and the plugin was uninstallable with nothing saying so.
//
// `scripts/plugin-manifest.test.mjs` covers these rules, and `npm test` runs it. The ten real
// entries all pass, so they cannot tell a working rule from one that stopped running.
//
// No dependencies: the check runs on `prepack`, before anything is installed.

// The prefix the installer requires, and the only directory a skill may live in.
const PREFIX = './skills/';

/** The directory name an entry points at, or null when the entry is not a well-formed path. */
export function skillNameFromEntry(entry) {
  if (typeof entry !== 'string' || !entry.startsWith(PREFIX)) return null;

  const name = entry.slice(PREFIX.length);
  return name.length > 0 && !name.includes('/') ? name : null;
}

/**
 * Check the manifest's "skills" entries against the installer's schema.
 *
 * Returns the directory names the entries resolve to, so the caller can go on comparing them
 * with what is on disk, plus one error per malformed entry.
 */
export function validateManifestSkills(entries) {
  const errors = [];
  const names = [];
  const seen = new Set();

  for (const entry of entries) {
    if (typeof entry !== 'string') {
      errors.push(`.claude-plugin/plugin.json: skills entry ${JSON.stringify(entry)} is not a string`);
      continue;
    }

    // Reported apart from the shape below, because a bare name is the mistake an author actually
    // makes and the installer's own message names this rule.
    if (!entry.startsWith('./')) {
      errors.push(`.claude-plugin/plugin.json: skills entry "${entry}" must start with "./" — the installer rejects bare names`);
      continue;
    }

    const name = skillNameFromEntry(entry);
    if (name === null) {
      errors.push(`.claude-plugin/plugin.json: skills entry "${entry}" must be of the form "${PREFIX}<name>"`);
      continue;
    }

    if (seen.has(name)) {
      errors.push(`.claude-plugin/plugin.json: skills entry "${entry}" is declared twice`);
      continue;
    }

    seen.add(name);
    names.push(name);
  }

  return { names, errors };
}
