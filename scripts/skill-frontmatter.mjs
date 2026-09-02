// Frontmatter rules for the skills this repository ships.
//
// A skill whose frontmatter is malformed does not fail loudly at runtime: it triggers on the
// wrong request, or never triggers at all. These rules turn that into a command an author can
// run. They are consumed by the package integrity check and are not a gate of their own.
//
// No dependencies: the check runs on `prepack`, before anything is installed.

// The sentence every skill starts from. Stored without its final period, because a skill that
// needs more — the Jira CLI, typically — continues it rather than ending it.
const COMPATIBILITY_PREFIX =
  'Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian"';

const DESCRIPTION_LIMIT = 1000;

// Work types belong to the project scheme. They are renamed, added and removed by project
// admins, so a description that requires one can trigger on a project where it does not exist.
// Longest first, so "sub-task" is reported as itself rather than as "task".
const WORK_TYPES = /\b(sub-tasks?|subtasks?|stories|story|epics?|bugs?|tasks?)\b/i;

const TRIGGER_CLAUSE = /\b(use|apply) when\b/i;

// The vocabulary a skill may declare: the default set, plus the extras the project documents.
// An allowlist rather than a denylist, because `Bash` and `Bash(*)` grant git without naming it.
const TOOL_VOCABULARY = new Set([
  'Read',
  'Glob',
  'Grep',
  'mcp__atlassian',
  'Agent',
  'AskUserQuestion',
  'Write',
  'Edit',
  'WebFetch',
  'Bash(jira:*)',
]);

const SEMVER = /^\d+\.\d+\.\d+$/;

const unquote = (value) => {
  const trimmed = value.trim();
  const quote = trimmed[0];
  return (quote === '"' || quote === "'") && trimmed.endsWith(quote)
    ? trimmed.slice(1, -1)
    : trimmed;
};

const scalar = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return unquote(value);
};

/**
 * Minimal YAML reader for the subset skill frontmatter actually uses: top-level scalars,
 * values folded onto following lines, and one level of nesting. It is not a YAML parser and
 * does not try to be one.
 *
 * @returns the parsed object, or null when the file opens with no frontmatter block.
 */
export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/.exec(text);
  if (!match) return null;

  const entries = [];
  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === '') continue;
    const top = /^([A-Za-z0-9_-]+):[ \t]*(.*)$/.exec(line);
    if (top) entries.push({ key: top[1], inline: top[2], continuation: [] });
    else if (entries.length > 0) entries.at(-1).continuation.push(line);
  }

  const result = {};
  for (const { key, inline, continuation } of entries) {
    const nested =
      inline === '' &&
      continuation.length > 0 &&
      continuation.every((line) => /^\s+[A-Za-z0-9_-]+:/.test(line));

    if (nested) {
      const map = {};
      for (const line of continuation) {
        const pair = /^\s+([A-Za-z0-9_-]+):[ \t]*(.*)$/.exec(line);
        if (pair) map[pair[1]] = scalar(pair[2]);
      }
      result[key] = map;
      continue;
    }

    const folded = [inline, ...continuation.map((line) => line.trim())]
      .filter((part) => part !== '')
      .join(' ');
    result[key] = scalar(folded);
  }

  return result;
}

/**
 * @param directory the name of the directory holding the skill — the name it must declare.
 * @param text the full contents of its SKILL.md.
 * @returns every problem found, in reading order. Never stops at the first.
 */
export function validateSkill(directory, text) {
  const frontmatter = parseFrontmatter(text);
  if (frontmatter === null) return ['has no YAML frontmatter'];

  const errors = [];
  const { name, description, license, compatibility, metadata } = frontmatter;
  const userInvocable = frontmatter['user-invocable'];
  const allowedTools = frontmatter['allowed-tools'];

  if (typeof name !== 'string' || name === '') errors.push('name is missing');
  else if (name !== directory)
    errors.push(`name "${name}" does not match its directory "${directory}"`);

  if (typeof description !== 'string' || description === '') {
    errors.push('description is missing');
  } else {
    if (!description.includes('Jira')) errors.push('description does not contain the word "Jira"');
    if (!TRIGGER_CLAUSE.test(description))
      errors.push('description has no "Use when" or "Apply when" trigger clause');
    if (description.length > DESCRIPTION_LIMIT)
      errors.push(
        `description is ${description.length} characters; the limit is 1,000 characters`,
      );
    const workType = WORK_TYPES.exec(description);
    if (workType)
      errors.push(
        `description names the work type "${workType[1]}"; work types belong to the project scheme and are discovered, so describe the intent instead`,
      );
  }

  if (license === undefined) errors.push('license is missing');
  else if (license !== 'MIT') errors.push(`license is "${license}"; it must be MIT`);

  if (userInvocable === undefined) errors.push('user-invocable is missing');
  else if (userInvocable !== true) errors.push('user-invocable must be true');

  if (typeof compatibility !== 'string' || !compatibility.startsWith(COMPATIBILITY_PREFIX))
    errors.push(`compatibility must start from: ${COMPATIBILITY_PREFIX}`);

  if (metadata === undefined || typeof metadata !== 'object') {
    errors.push('metadata is missing its author and version');
  } else {
    if (typeof metadata.author !== 'string' || metadata.author === '')
      errors.push('metadata.author is missing');
    if (typeof metadata.version !== 'string' || !SEMVER.test(metadata.version))
      errors.push(`metadata.version "${metadata.version ?? ''}" is not a semver like "1.0.0"`);
  }

  if (typeof allowedTools !== 'string' || allowedTools === '') {
    errors.push('allowed-tools is missing');
  } else {
    for (const tool of allowedTools.split(/\s+/).filter((t) => t !== '')) {
      if (TOOL_VOCABULARY.has(tool)) continue;
      if (/^Bash\(git/.test(tool))
        errors.push('allowed-tools grants git access; this plugin does not touch git');
      else
        errors.push(
          `allowed-tools declares "${tool}", which is not in the documented tool vocabulary`,
        );
    }
  }

  return errors;
}
