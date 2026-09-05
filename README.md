# jira-skills

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@codeskine/jira-skills.svg)](https://www.npmjs.com/package/@codeskine/jira-skills)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-6b46c1.svg)](https://docs.claude.com/en/docs/claude-code)

**English** · [Italiano](README.it.md)

Claude Code Agent Skills for authoring the work items of a project on **Atlassian Jira Cloud** —
capturing requests, proposing value, reporting defects, recording technical debt, refining and
decomposing, planning sprints and fix versions.

The perimeter is the **tracker**. Code, branches, change proposals and technical release are out
of scope by decision, not by omission.

## How it works

You say what you want in your own words. The skill that owns that intent loads, reads the
**project profile** to learn how your Jira project is actually configured, asks the questions its
persona would ask, assembles the work item, and shows it to you in chat. Nothing is written to
Jira until you approve it.

```mermaid
flowchart LR
    R[A request, a defect,<br/>an outcome, a risk] --> S[The skill that<br/>owns that intent]
    P[(Project profile)] -.read first.-> S
    S --> D[Complete draft,<br/>in chat]
    D -->|change it| S
    D -->|approve| W[Written to Jira]
    W --> J[(Jira is now<br/>the only truth)]
```

Two things follow from that shape, and they are the whole design:

- **Nothing is assumed about your project.** Work types, statuses, transitions, hierarchy depth,
  boards and fix versions belong to your project scheme. `jira-init` discovers them once and
  records them in a profile your team commits; every other skill reads it and stops if it is
  missing rather than guessing.
- **Nothing is invented that Jira already owns.** No status labels, no type labels, no
  hand-maintained table of children. Where Jira has the concept, the skills discover it and guide
  you to it.

**[Read the development process](docs/development-process.md)** for the whole path — discovery,
the draft gate, the two channels and their declared gaps — with the diagrams. It is the one page
to read before installing.

## What is in this repository

| Path                          | What it holds                                                                |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `skills/`                     | the ten Agent Skills, one directory each, plus `shared/` for what they share |
| `commands/`                   | the slash commands — today, `/jira-doctor`                                   |
| `docs/skills/`                | a documentation page per skill, in English and Italian                       |
| `docs/commands/`              | the same, per command                                                        |
| `docs/development-process.md` | the shared mechanics and the full path, with diagrams                        |
| `docs/termbase.md`            | the English ↔ Italian term table the documentation is written against        |
| `docs/adr/`                   | the architecture decision records                                            |
| `docs/agents/`                | procedures for the agents that work on this repository                       |
| `scripts/`                    | the integrity checks and the generators                                      |
| `.claude-plugin/`             | plugin metadata and the marketplace entry                                    |

## Requirements

| What                                 | Why                                                                                                                                                                                                                                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code                          | The only harness this plugin targets                                                                                                                                                                                                                                                                          |
| The Atlassian MCP server             | Work items, fields, comments, transitions, search and project metadata                                                                                                                                                                                                                                        |
| — reachable under the id `atlassian` | Skills declare that id statically, so a server under any other name is invisible to them. An Atlassian connector added through claude.ai settings is one such name: it shows as connected, exposes its tools under an identifier of its own, and serves no skill here. Adding `atlassian` does not disturb it |
| The `jira` CLI, authenticated        | Only for the Agile surface — boards, sprints, the fix-version listing. Without it, `jira-plan` and that listing are unavailable and everything else still works                                                                                                                                               |

The simplest way to get that id is a `.mcp.json` at the root of the repository where your work
is tracked:

```json
{
  "mcpServers": {
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/mcp"
    }
  }
}
```

Claude Code asks you to approve it the next time you open the repository, and you authenticate it
yourself. It holds a URL and no credential, so commit it and your team configures the server once
instead of each on their own machine. If you would rather have it on your machine than in the
repository, `claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp` does the
same job — the id is what matters, not the scope.

Run [`/jira-doctor`](docs/commands/jira-doctor.md) to check all three at once. It reports each
failure with the exact remediation, and tells you which half of the plugin is degraded rather
than failing as a whole.

## Installation

```bash
claude plugin install @codeskine/jira-skills
```

Then, in the repository where your work is tracked:

```
/jira-doctor
```

and, once it is happy:

```
jira-init
```

`jira-init` discovers your project and writes `.jira/project-profile.md`. Commit it: it is how
your whole team, and every future session, learns the same facts without asking Jira again.

## Skills

Each row links to the page for that skill: what it does, when it fires, a worked exchange, and
the artifact or report it produces.

<!-- skills:start -->

**Setup** — Discover how the Jira project is really configured and record the project profile every other skill reads.

| Skill       | What it does                                                                                                                                                                                          | Page                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `jira-init` | Jira project discovery. Use when the user sets up this plugin on a repository, asks how their Jira project is configured, or when another skill reports that the project profile is missing or stale. | [read](docs/skills/jira-init.md) |

**Authoring** — Turn a request, a defect or a technical risk into a well-formed Jira work item.

| Skill           | What it does                                                                                                                                                                                                                                                       | Page                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| `jira-capture`  | Jira intake author. Use when a request arrives second-hand — an email, a chat message, a note taken during a call — and has to be recorded on Jira before anyone has understood it, without losing the wording it arrived in.                                      | [read](docs/skills/jira-capture.md)  |
| `jira-propose`  | Jira value proposal author. Use when someone wants an outcome recorded on Jira in a form that survives a prioritisation discussion — the value sought, who benefits, how success will be known.                                                                    | [read](docs/skills/jira-propose.md)  |
| `jira-diagnose` | Jira defect author. Use when the user reports that something is broken, behaves unexpectedly, or fails — and it has to reach Jira in a form someone who was not there can reproduce.                                                                               | [read](docs/skills/jira-diagnose.md) |
| `jira-assess`   | Jira technical debt and risk author. Use when the user wants to record something that works today but will cost the team later — a shortcut taken deliberately, a dependency going stale, a design that no longer fits, an arrangement only two people understand. | [read](docs/skills/jira-assess.md)   |

**Refinement** — Enrich a work item and break it down into well-formed children.

| Skill         | What it does                                                                                                                                                                                                                                       | Page                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `jira-refine` | Jira refinement author. Use when an existing Jira work item has to become something a team can pick up — acceptance criteria agreed, scope small enough to finish, dependencies linked — or when it is too large and must be broken into children. | [read](docs/skills/jira-refine.md) |

**Planning** — Decide when work is tackled and what ships together.

| Skill          | What it does                                                                                                                                                                                                            | Page                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `jira-plan`    | Jira sprint planner. Use when the user asks to fill a sprint on a Jira board, to move a work item already recorded out of one or onto the backlog, or to close one and account for what was delivered and what was not. | [read](docs/skills/jira-plan.md)    |
| `jira-release` | Jira fix version manager. Use when the user asks to assign work to a Jira fix version or take it off one, or for the list of fix versions the project has, or whether one of them has been released or archived.        | [read](docs/skills/jira-release.md) |

**Progress** — Advance a work item through its Jira Workflow and read where it stands.

| Skill          | What it does                                                                                                                                                                                                                                                                                      | Page                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `jira-advance` | Jira transition runner. Use when the user wants a Jira work item to reach its next status — start it, hand it over, put it back, close it — without opening Jira.                                                                                                                                 | [read](docs/skills/jira-advance.md) |
| `jira-inspect` | Jira read-only reporter. Use when the user asks where something stands on Jira — how a parent and its children are progressing, what a sprint contains and what it has left, what is blocked, what a fix version holds and what of it is unfinished — and expects an answer rather than a change. | [read](docs/skills/jira-inspect.md) |

<!-- skills:end -->

## What this plugin will not do

Out by decision, and recorded as such:

- **Merge requests, pull requests, commits, branches and technical release.** They belong to a
  different plugin, not to a later version of this one.
- **Jira administration.** Work types, statuses, Jira Workflows, schemes, boards and permissions are
  discovered and never changed.
- **Any tracker other than Jira Cloud.** The abstraction that would have allowed it was
  deliberately removed.
- **Confluence**, and every other Atlassian product.
- **Any local mirror of what was published.** After a write, the truth is Jira.

Three operations are unavailable on both channels and are handed back to you rather than
simulated: creating a sprint, and creating or releasing a fix version. The skills say so before
you ask.

## Contributing

`CLAUDE.md` holds the authoring standards — frontmatter, token budgets, the mandatory invariants
and the boundaries between skills. `CONTEXT.md` is the glossary, and it lists the words this
project refuses to use as well as the ones it uses. `docs/termbase.md` extends that glossary to
Italian, for the documentation.

This repository carries its own `.mcp.json`, declaring the Atlassian server under the id the
skills require — the same file described under [Requirements](#requirements), here so that
testing the plugin never means reconfiguring the environment you work in.

Before opening a change:

```bash
node scripts/check-package.mjs
node scripts/generate-readme-table.mjs
node scripts/check-docs.mjs
```

The first fails if the manifest, the version file and the skills directory disagree, or if any
frontmatter would misbehave once installed. The second regenerates every block that restates a
fact a skill already carries — both README tables and the header of every documentation page —
so that they cannot drift; never edit those blocks by hand. The third fails if a skill or command
is missing its documentation pair, if a page has lost one of its sections, or if a link is broken.

If you change what the frontmatter rules accept, run `npm test` as well: it covers the reader and
one case per rule, on Node alone, and it is what says the check still means what it claims.

## License

MIT. See [LICENSE](LICENSE).
