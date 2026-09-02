---
paths: ["skills/**/*.md", "commands/*.md"]
---

# Authoring a skill in this repository

These files ship to a user's machine. Check them against the following before considering an
edit finished.

## Self-containment

- No link to `docs/adr/`, no mention of `CONTEXT.md`, `CLAUDE.md` or the README, no assumption
  about this repository's layout. On a user's machine none of it exists.
- Cross-references inside `skills/` are fine: a skill links the shared references, and a skill
  links its own assets.
- A rationale worth knowing at runtime is stated inline, in one sentence.

## Vocabulary

Use the canonical terms; the alternatives listed here are defects, not synonyms.

| Use                 | Never                                                        |
| ------------------- | ------------------------------------------------------------ |
| work item           | issue, ticket, task, story (as a generic word), work element |
| work type           | issue type, kind, category                                   |
| parent              | epic link, hierarchy level                                   |
| status              | workflow state, phase, column                                |
| transition          | state change, move                                           |
| sprint              | iteration, milestone, cycle                                  |
| fix version         | release, version, milestone, tag                             |
| development process | workflow (bare)                                              |

`Jira Workflow` is allowed, and means the Jira object made of statuses and transitions.

## Frontmatter

- `name` matches the parent directory.
- `description` contains the word `Jira`, carries a "Use when" trigger clause, and describes an
  **intent** — never a work type. Work types belong to the project scheme and may be renamed or
  absent, so a description that names one can trigger on a project where it does not exist.
- `description` stays under 1,000 characters.
- `user-invocable: true`, `license: MIT`, `metadata.author`, `metadata.version` present.
- `compatibility` starts from `Designed for Claude Code. Requires the Atlassian MCP server
configured as "atlassian".`
- `allowed-tools` starts from `Read Glob Grep mcp__atlassian Agent AskUserQuestion`. Add
  `Bash(jira:*)` only for the Agile domain; add `Write`/`Edit` only where the skill writes the
  project profile. Never add `Bash(git:*)` — this plugin does not touch git.

## Body

- State the contract in three or four lines and link the shared procedure. Never inline a
  procedure that the shared layer already owns; never restate a quality criterion.
- Persona only where it orients a real judgement. `jira-init` and `jira-advance` have none by
  decision. A persona that carries no information is a defect.
- Never hard-code an MCP tool name: they change between server versions and are resolved into
  the project profile at discovery.
- Read the project profile first, and stop if it is missing rather than assuming defaults.
- Templates define structure only — no natural language and no technology stack.

## Budget

Under 2,500 tokens and 500 lines per `SKILL.md`; move depth into `references/`.

## Before finishing

Run `node scripts/check-package.mjs`. A new skill must also be declared in
`.claude-plugin/plugin.json` and placed in a `skills.sh.json` grouping.
