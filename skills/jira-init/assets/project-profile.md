---
project_key: <KEY>
project_name: <name as Jira reports it>
site: <https://your-site.atlassian.net>
project_style: <team-managed | company-managed>
discovered_at: <YYYY-MM-DD>
discovered_by: jira-init <version>
channels_read: <which channels answered: mcp, cli, or both — a subject only the missing one owns is not read, not absent>
---

# Project profile — <KEY>

What this Jira project can actually do. Written by `jira-init`, read by every other skill.
Do not edit by hand: re-run `jira-init` instead, so the file and Jira stay in agreement.

## Work types

| Work type                      | Level         | Can be a child of       | Notes                           |
| ------------------------------ | ------------- | ----------------------- | ------------------------------- |
| <name as the project calls it> | <as reported> | <parent types, or none> | <required fields, restrictions> |

Levels and names are whatever this project declares. A type absent from this table does not
exist here, and no skill may offer it.

### Intents no work type serves

<Name the intents this project's scheme has no type for — a defect, unrefined intake, technical
debt — as a stated fact rather than one left to be inferred from the table above. A reading skill
acts on what the profile says; it does not audit a table for what is missing. Where every intent
has a type, say that instead of omitting the section: "none" is a fact, and a missing section is
not.>

## Hierarchy

<How deep the hierarchy goes in this project and which type sits at each level, in one or two
sentences. If the project supports levels above the top container, say so and name them.>

## Statuses and transitions

| Status | Category                                  | Reachable from           | Notes                |
| ------ | ----------------------------------------- | ------------------------ | -------------------- |
| <name> | <to do / in progress / done, as reported> | <statuses, or "initial"> | <conditions, if any> |

Transitions in Jira are evaluated per work item, not per type: this table is the shape of the
workflow, and the transitions actually available are asked of Jira at the moment of the move.

## Boards and sprints

| Board  | Type             | Active sprint   | Notes |
| ------ | ---------------- | --------------- | ----- |
| <name> | <scrum / kanban> | <name, or none> |       |

<Say which of three cases this is, because they lead to different actions: the project has no
board; the boards it has are listed above; or the Agile channel was not reachable, so whether a
board exists was never established. Never write the first when you mean the third — it sends the
reader to create a board instead of restoring the channel.>

## Versions

| Version | Status                             | Notes |
| ------- | ---------------------------------- | ----- |
| <name>  | <unreleased / released / archived> |       |

<The same three cases as above: no versions, the versions listed, or not readable because the
Agile channel was not reachable.>

## Operation resolution

Which tool serves each operation, resolved from the tools the configured MCP server actually
exposes. Skills read this table instead of hard-coding a tool name.

| Operation                        | Channel     | Tool or command                  |
| -------------------------------- | ----------- | -------------------------------- |
| <operation from the channel map> | <MCP / CLI> | <resolved tool name, or command> |

## Unsupported operations

Operations no available tool covers in this setup. A skill that needs one announces the gap and
hands the step to the user; it never simulates it.

| Operation   | Why                                                                                                           | Manual path                          |
| ----------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| <operation> | <no tool exposed / channel not reachable / not permitted for this account / concept absent from this project> | <what the user does in Jira instead> |

`channel not reachable` is the only reason here that is about this machine rather than about the
project: the operation returns when the channel does.
