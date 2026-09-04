# CLAUDE.md

## Project Overview

`jira-skills` is a Claude Code Agent Skills plugin for authoring the work
items of a project on **Atlassian Jira Cloud** — capturing requests, proposing value,
reporting defects, recording technical debt, refining and decomposing, planning sprints and
fix versions. The repository is open source and serves two audiences: teams who install the
skills to run their Jira work, and contributors who extend the plugin.

The perimeter is the **tracker**. Code, branches, change proposals and technical release are
out of scope by decision — see [ADR-0002](docs/adr/0002-tracker-only-perimeter.md).

Read [CONTEXT.md](CONTEXT.md) before writing anything: it is the glossary, and it lists the
terms this project refuses to use.

## Project Structure

```
commands/             # Slash commands as flat Markdown files
skills/               # Agent Skill definitions
  shared/             # Contracts and procedures shared by every skill — never a skill itself
    references/
  <skill-name>/
    SKILL.md          # Required: metadata + instructions
    references/       # Optional: detailed documentation loaded on demand
    assets/           # Optional: templates and resources
    scripts/          # Optional: executable code
docs/adr/             # Architecture decision records (versioned; the rest of docs/ is not)
scripts/              # Repository tooling
.claude-plugin/       # Plugin metadata, marketplace entry
```

This plugin targets **Claude Code only**. Cursor and Codex manifests were dropped: keeping
three manifests in sync bought nothing while the skills depend on an MCP server id and on
tools declared in Claude Code's own `allowed-tools` syntax.

## Agent Skills Specification

All skills MUST conform to the [Agent Skills specification](https://agentskills.io/specification.md).
Project-specific requirements below are the source of truth where they differ from the spec.

## The two channels

A skill reaches Jira through one of two channels, never through a third:

| Channel                  | Owns                                                                | Declared as      |
| ------------------------ | ------------------------------------------------------------------- | ---------------- |
| **Atlassian MCP server** | work items, fields, comments, transitions, search, project metadata | `mcp__atlassian` |
| **Jira CLI** (`jira`)    | the Agile domain only — boards, sprints, backlog                    | `Bash(jira:*)`   |

The MCP server MUST be reachable under the server id `atlassian`; skills declare that id
statically and `/jira-doctor` verifies it. A server connected under any other name — including
an Atlassian connector added through claude.ai settings — serves no skill in this plugin. The full operation → channel map lives in
`skills/shared/references/channels.md` and nowhere else. Rationale in
[ADR-0001](docs/adr/0001-hybrid-mcp-and-cli-channel.md).

## Frontmatter

New skills go in `skills/<skill-name>/SKILL.md`. Each file requires YAML frontmatter.
This project does **not** use `openclaw` metadata.

| Field            | Required         | Constraints                                                                                                                                   |
| ---------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`           | Spec-required    | 1–64 chars. Lowercase `a-z`, digits, hyphens. No leading/trailing/consecutive hyphens. Must match parent directory name.                      |
| `description`    | Spec-required    | 1–1,000 chars. Must include a "Use when" or "Apply when" trigger clause. Must contain the word `Jira`.                                         |
| `license`        | Project-required | `MIT`                                                                                                                                         |
| `compatibility`  | Project-required | Base: `Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian".` Extend when the skill also needs the Jira CLI. |
| `metadata`       | Project-required | Must include `author` (string) and `version` (semver `a.b.c`, e.g. `"1.0.0"`). No `openclaw` block.                                           |
| `user-invocable` | Project-required | Boolean. `true` for every skill in this plugin: each one maps to an activity a user names out loud.                                           |
| `allowed-tools`  | Project-required | Space-delimited list. See [Allowed Tools](#allowed-tools).                                                                                    |

Example frontmatter:

```yaml
---
name: jira-example
description: "Jira X author. Use when the user asks to create or update Y on Jira."
user-invocable: true
license: MIT
compatibility: Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian".
metadata:
  author: your-username
  version: "1.0.0"
allowed-tools: Read Glob Grep mcp__atlassian AskUserQuestion
---
```

**Version discipline:** Versions follow semver (`a.b.c`). New skills start at `1.0.0`. When
modifying a skill, increment its `metadata.version` and bump the plugin `version` before
merging. Do not auto-increment — remind the developer as a next step.

### Description quality

Descriptions are the primary triggering mechanism. A poorly calibrated description wastes
context (too broad) or never fires (too vague).

Every description **MUST** contain the word `Jira` — skills must not activate on
non-Jira requests.

Descriptions **MUST NOT** name a work type at all — `bug`, `story`, `epic`, `task`,
`sub-task`, singular or plural, in a trigger clause or in a boundary disclaimer. Work types
belong to the project scheme and are discovered, not assumed: describe the **intent** the user
expresses, not the Jira object that will result. Most of these words are refused vocabulary in
any case; see the _Avoid_ lists in [CONTEXT.md](CONTEXT.md).

**Too vague** — no trigger context, ignored:

```yaml
# Bad — no trigger clause
description: Creates Jira work items

# Good — specific trigger scenarios
description:
  "Jira defect author. Use when the user reports something broken, describes
  unexpected behaviour, or asks to file a defect on Jira."
```

**Too broad** — matches all Jira work, floods context:

```yaml
# Bad — triggers on every Jira task
description: Use when working with Jira for any task.

# Good — scoped to one intent
description:
  "Jira sprint planner. Use when the user asks to plan, fill, or close a sprint
  on a Jira board."
```

**Overlap** — ten skills can write the same object, so boundaries must be explicit. Add
disclaimers with `→ See` cross-references:

```yaml
description: "...Not for enriching an existing work item (→ See codeskine/jira-skills@jira-refine)."
```

The cross-reference format is `→ See <marketplace>/<plugin>@<skill-name>`. Use it whenever
two skills share overlapping trigger phrases — it tells the model where to route instead.

## Allowed Tools

Every skill MUST declare an `allowed-tools` field. Start from the **default set** and add
skill-specific extras as needed.

**Default set** (include in every skill):

```
Read Glob Grep mcp__atlassian AskUserQuestion
```

**Skill-specific extras:**

| Extra tool     | When to add                                                     |
| -------------- | --------------------------------------------------------------- |
| `Bash(jira:*)` | Skills touching the Agile domain — boards, sprints, backlog     |
| `Write` `Edit` | Skills that write the project profile — in practice `jira-init` |
| `WebFetch`     | Skills that fetch external documentation or resources           |
| `Agent`        | Skills that dispatch a sub-agent — none so far, so justify it   |

`Bash(git:*)` is **not** in the default set. This plugin does not touch git.

## Skill Body

The body contains step-by-step instructions for the skill's procedure. Use `references/` files
for depth (referenced via relative links from SKILL.md). Keep references one level deep — avoid
deeply nested chains.

### Token budgets

- **~100 tokens per description** — loaded at startup for all skills
- **≤ 1,000 characters per description** — hard limit; keep descriptions focused and scannable
- **< 5.000 tokens per SKILL.md** (spec recommendation) — keep focused on essentials
- **< 2.500 tokens per SKILL.md** (project recommendation)
- **< 500 lines per SKILL.md** — move detailed reference material to `references/`
- **Use secondary markdown files for depth** — Claude reads these on demand, so they don't count against context until needed
- **2-4 skills loaded simultaneously** in a typical session
- **Stay below ~10k tokens of total loaded SKILL.md** to avoid degrading response quality

This is a budget. A 100 lines SKILL.md is even better. Feel free to stay far below the limits.

#### Top-of-body directives

Place these directives at the very top of the body, before the first heading, in this order:

| Directive   | Required | Format                                                                       | When to include                         |
| ----------- | -------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **Persona** | Optional | `**Persona:** You are a <role>. <mindset or goal>.`                          | Analytical/generative/multi-mode skills |
| **Modes**   | Optional | `**Modes:**` section listing each invocation mode and its sub-agent strategy | Skills invoked in distinct contexts     |

All are optional. A short procedural skill may have none.

#### Persona (optional)

Place `**Persona:**` at the very top of the body, before any heading. Keep it to 1–2 sentences:
role → mindset or goal. No fictional biography.

```
**Persona:** You are a <role>. <Mindset/assumption or goal>.
```

**Include a persona when:**

- The skill has a well-defined analytical or generative domain — it primes the model to prioritize angles it would otherwise reach only with longer prompts.
- The skill produces stylistic output — it maintains tone consistency across invocations.

**Skip a persona when:**

- The skill is purely procedural ("read X, call Y, report Z") — there is nothing to anchor.
  In this plugin that is `jira-init` and `jira-advance`, deliberately.
- The skill body is very short (~10 lines) — instruction density matters more.

A persona that carries no information is a defect, not a decoration: "You are a team member"
spends budget and orients nothing.

**Risk:** A persona that is too rich in a leaf skill can override global CLAUDE.md
instructions if the model perceives an identity conflict. Keep leaf personas minimal.

### Mandatory invariants

Seven invariants apply to every skill in this project. Violating any of them is a defect.

**1. Discovery before proposal**

No skill assumes how the Jira project is configured. Every skill reads the project profile
as its first step, and re-runs discovery when the profile is missing. Work types, statuses,
transitions, hierarchy depth, boards and fix versions belong to the project.

**2. No surrogates**

The plugin never creates a concept Jira already owns. No status labels, no type labels, no
markdown table of children, no hand-maintained hierarchy. Where Jira offers the concept, the
skill discovers it and guides the user to it. See
[ADR-0003](docs/adr/0003-no-surrogates-discovery-over-creation.md).

**3. Draft gate**

Every skill presents the complete artifact **in chat** and waits for explicit user
confirmation before any write to Jira. The confirmation prompt must include the title, the
work type, the parent if any, and the sprint or fix version if any. If the user requests
changes, apply them and re-present the draft. Repeat until approved. There is one form of
this gate and no local mirror of the artifact: after publication the truth is Jira.

**4. Evidence**

Every verifiable claim in an artifact carries its evidence, in the form that fits it — a
fenced code snippet of 5–20 lines with an exact `path/file.ext` line N citation for code, the
exact log or error for a defect, a datum or metric for a value proposal, a work item link for
a dependency. Evidence is required; code is only one of its forms.

**5. Neutrality**

Templates define structure — sections, ordering, checklist shape — never a natural language
and never a technology stack. The language of generated content follows the user's active
language at runtime. Examples must not presuppose a programming language.

**6. Contract inline, procedure shared**

A SKILL.md states in three or four lines _what must hold_ and links the shared procedure. The
steps themselves live once, in `skills/shared/references/`. Never copy a procedure into a
skill; never restate a quality criterion that the shared reference already owns.

**7. Shipped artifacts are self-contained**

Everything under `skills/` and `commands/` is installed on a user's machine, where this
repository does not exist. A shipped artifact must not link to `docs/adr/`, name `CONTEXT.md`,
`CLAUDE.md` or the README, or assume any convention of the repository that builds it. Where a
rationale is worth knowing at runtime, state it inline in one sentence; the ADR stays the record
for contributors. Cross-references **within** `skills/` are fine and expected.

### Boundaries between skills

Ten skills can write the same Jira object. The boundary between them is the **intent the user
expresses**, never the work type that results. Each skill owns its own questions, template and
quality criteria; the mechanics — discovery, draft gate, write, outcome — are shared and
identical. See [ADR-0004](docs/adr/0004-intent-boundaries-shared-mechanics.md).

The one handover rule: **no skill creates an artifact another skill will have to patch.**
`jira-capture` is the single exception, and it declares it: what it writes is explicitly raw
and awaiting refinement.

## Contributor procedures

### Working in worktrees

All implementation work MUST happen in a git worktree under `.claude/worktrees/`. Never
work directly on a checked-out branch.

Before starting any task, propose a branch name and ask the developer to confirm. Run
`git worktree list` first — if an existing worktree covers the same skill or topic, suggest
reusing it.

### Adding a new skill

1. Create `skills/<name>/SKILL.md` with all project-required frontmatter fields.
2. Create `skills/<name>/assets/<type>.md` for each artifact template the skill needs.
3. Optionally create `skills/<name>/references/` for deep documentation.
4. Add `"<name>"` to the `skills` array in `.claude-plugin/plugin.json`.
5. Add it to a grouping in `skills.sh.json`.
6. Run `node scripts/check-package.mjs` — it fails if the manifests, the VERSION file and the
   skills directory have drifted apart, or if the frontmatter would misbehave once installed.
7. Run the description quality check: contains `Jira`, has a "Use when" trigger clause, names
   an intent rather than a work type, no over-triggering, no `openclaw` block.

### Changing the frontmatter rules

The rules live in `scripts/skill-frontmatter.mjs` and are covered by
`scripts/skill-frontmatter.test.mjs`. Add a case with the rule — the ten real skills all pass, so
they cannot tell a rule that works from a rule that no longer runs.

```bash
npm test
```

Node's own test runner, no dependency, out of the publish path. It is the project's **third
testing seam**, admitted because the other two are blind to it — a rule that stopped running would
still see a green integrity check, since none of the ten skills breaks any rule. What it costs is
in [ADR-0005](docs/adr/0005-a-third-seam-for-the-frontmatter-rules.md).

### After updating a skill

After making changes, suggest the following as next steps. Do NOT execute automatically.

1. Format markdown: `npx prettier --write "**/*.md"`
2. Measure token counts:
   - Description: `awk 'NR==1 && /^---$/{found=1; next} found && /^---$/{exit} found && /^description:/{print}' skills/<name>/SKILL.md | tiktoken-cli`
   - SKILL.md body: `tiktoken-cli skills/<name>/SKILL.md`
3. Increment `metadata.version` in the changed SKILL.md.
4. Bump the plugin version with `scripts/bump-version.sh`.
5. Regenerate the README skill table.

## Agent skills

Configuration consumed by the engineering skills — where work on this repository is tracked and
how it is labelled. Unrelated to [Agent Skills Specification](#agent-skills-specification)
above, which governs the skills this repository _builds_.

### Issue tracker

Issues live as GitHub issues on `codeskine/jira-skills`, via the `gh` CLI. External pull
requests are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles, unchanged: `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. The glossary lists refused terms
as well as canonical ones, and its closing section says how to tell a refused word from a literal
command name, a mention made in order to forbid, and ordinary English — read it before removing a
word from a shipped artifact. See `docs/agents/domain.md`.
