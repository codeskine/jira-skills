---
name: jira-init
description: "Jira project discovery. Use when the user sets up this plugin on a repository, asks how their Jira project is configured, or when another skill reports that the project profile is missing or stale. Reads the project's work types, hierarchy, statuses, boards and fix versions and records them in a versioned project profile that every other skill reads. Creates nothing in Jira. Not for verifying that the environment can reach Jira at all (→ See the /jira-doctor command)."
user-invocable: true
license: MIT
compatibility: Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". Uses the jira CLI for the Agile surface where it is authenticated, and degrades explicitly without it.
metadata:
  author: codeskine
  version: "1.0.0"
allowed-tools: Read Write Edit Glob Grep mcp__atlassian Bash(jira:*) AskUserQuestion
---

This skill **discovers**. It never creates, renames or configures anything in Jira: work types,
statuses, Jira Workflows, boards and fix versions belong to the project admin. Read
[the discovery contract](../shared/references/discovery.md) before running, and
[the channel map](../shared/references/channels.md) to know which channel answers what.

Present the profile and get approval before writing the file — the profile is versioned and the
team shares it.

## 1. Check the channels

The two channels fail independently, and only one of them is a precondition.

- **MCP server unreachable under the id `atlassian`** — stop. Nothing else answers for work
  types, statuses or fields. Point the user at `/jira-doctor`.
- **`jira` CLI missing or unauthenticated** — degrade, as
  [the channel map](../shared/references/channels.md) requires of any missing capability.
  Discover what the MCP server reaches, and record the Agile surface as unsupported with
  `jira init` as the manual path.

Record which channels answered. Read and not reachable are different facts, and the profile
must keep them apart.

## 2. Identify the project

If `.jira/project-profile.md` already exists, read it and tell the user which project it
describes and when it was discovered. Ask whether to refresh it or to target a different project.

Otherwise list the projects visible to the account and ask the user to choose. Never infer the
project from the repository name.

## 3. Discover

Gather, in this order. Report anything that fails rather than working around it — but a subject
the unreachable channel of step 1 owns is **not** a failure to stop on: record it as not read and
carry on to the next.

1. **Work types** available in the project, with the hierarchy between them. Record the names
   exactly as the project reports them, including custom and renamed types — and record which of
   the intents this plugin authors no type serves, as a stated fact. A reader acts on what the
   profile says, not on what it can infer is missing from a table.
2. **Statuses** and the shape of the Jira Workflow connecting them.
3. **Fields required on creation**, per work type. These are what make a write fail after an
   approved draft, so they matter more than they look.
4. **Boards** and, for each, the active sprint — the Agile channel. A project with no board has
   no sprint operations, and that is a finding, not an error. A channel that did not answer is a
   different finding: record that it was not read, never that no board exists.
5. **Fix versions**, with their state — the Agile channel, and the same two findings apply.
6. **Project style** — team-managed or company-managed — because it changes which fields exist.

## 4. Resolve the operations

Enumerate the tools the MCP server actually exposes and map each operation in the channel map to
the tool that serves it. Record the mapping in the profile, so no skill ever hard-codes a tool
name.

Anything the map lists that no available tool covers goes to **Unsupported operations**, with
the manual path the user will take instead. The channel map already declares the gaps known at
the CLI level — creating a sprint, creating or releasing a fix version — carry them across
unless a resolved MCP tool closes one.

## 5. Present and confirm

Fill [the profile template](assets/project-profile.md) and present it in full, in the language
the user is working in. State plainly:

- the project it describes;
- how many work types, statuses, boards and fix versions were found;
- **every unsupported operation**, because that is what will surprise the user later.

Ask for approval. Apply changes and re-present until approved. Writing this file is not a write
to Jira, but it is a change to a shared, versioned artifact and follows
[the same gate](../shared/references/draft-gate.md).

## 6. Write

Write `.jira/project-profile.md`, creating the directory if needed. Overwrite an existing
profile — this skill is its only writer, so there is nothing to merge.

Then tell the user to commit it, and why: the profile is how the rest of the team, and every
future session, learns the same facts without asking Jira again.

## Reporting a finding is not a failure

A project with no board, a hierarchy of one level, a missing work type, an operation no tool
covers: all of these are valid outcomes. Write them down and say them out loud. The plugin is
useful precisely because it knows what this project cannot do.
