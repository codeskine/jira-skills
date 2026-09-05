# Channels

A skill reaches Jira through one of two channels, never through a third. It does not choose:
it looks the operation up here.

| Channel              | Owns                                                                            | Declared as      |
| -------------------- | ------------------------------------------------------------------------------- | ---------------- |
| Atlassian MCP server | work items, fields, comments, transitions, search, project metadata             | `mcp__atlassian` |
| Jira CLI (`jira`)    | the Agile domain only — boards, sprints, and listings of epics and fix versions | `Bash(jira:*)`   |

Two channels rather than one because neither covers the whole domain: the MCP server does not
expose the Agile surface, and the CLI is not the channel the agent speaks natively.

## Resolving MCP tool names

MCP tool names have the form `mcp__atlassian__<tool>` and the `<tool>` part changes between
server versions. **Never hard-code one in a skill.** The available tools are enumerated once
during discovery, and the project profile records which tool serves which operation. A skill
reads the profile and calls what it finds there.

The server id, by contrast, _is_ fixed by convention: `atlassian`. It appears in `allowed-tools`,
which is static frontmatter and cannot read a file, so a server reachable under any other name
serves no skill here however healthy it looks. `/jira-doctor` verifies it and prints the
remediation.

## Operation map

| Operation                                                  | Channel | Note                                   |
| ---------------------------------------------------------- | ------- | -------------------------------------- |
| list projects and their metadata                           | MCP     | falls back to `jira project list`      |
| read the work types of a project                           | MCP     | needed for every authoring skill       |
| read the statuses and available transitions of a work item | MCP     | transitions are per item, not per type |
| create a work item                                         | MCP     |                                        |
| read a work item                                           | MCP     |                                        |
| edit a work item                                           | MCP     |                                        |
| comment on a work item                                     | MCP     |                                        |
| transition a work item                                     | MCP     | `jira issue move` is the fallback      |
| link two work items                                        | MCP     | `jira issue link` is the fallback      |
| set the parent of a work item                              | MCP     |                                        |
| search work items by JQL                                   | MCP     | the backbone of every read-only view   |
| list boards                                                | CLI     | `jira board list`                      |
| list sprints of a board                                    | CLI     | `jira sprint list`                     |
| add work items to a sprint                                 | CLI     | `jira sprint add`                      |
| close a sprint                                             | CLI     | `jira sprint close`                    |
| list the fix versions of a project                         | CLI     | `jira release list`                    |
| assign a work item to a fix version                        | MCP     | it is a field on the work item         |

## Declared gaps

These operations are **not available on either channel** as of the server and CLI versions this
plugin targets. A skill that needs one must say so and hand the step to the user, never simulate
it.

They are gaps in the tooling, and they hold everywhere. A channel that is simply **not reachable
on this machine** — a CLI with no token — is a different thing: it is unsupported here and now,
it returns when the channel does, and it says nothing about the project. Both are announced;
only the first is permanent, and the profile records which is which.

| Missing operation                | Consequence                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| create a sprint                  | `jira-plan` can fill and close sprints but cannot open one. It asks the user to create the sprint on the board, then continues. |
| create a fix version             | `jira-release` can list fix versions and assign work to them, but the fix version itself is created by the user in Jira.        |
| release or archive a fix version | Same. The skill reports what the fix version contains and stops at the release action.                                          |

If a future MCP server exposes any of these, the profile will record it during discovery and the
gap closes without touching a skill. That is the whole point of resolving operations through the
profile rather than through hard-coded calls.

## When the CLI channel is not reachable

`jira me` fails for two different reasons, and they take different remedies. Naming the wrong one
sends the user against a wall, so establish which it is before prescribing anything.

**The credential is not visible to the shell the skills use.** A skill reaches the CLI through
`Bash(jira:*)`, which runs a **non-interactive** shell — and a non-interactive shell reads only
the startup file that every shell reads, `~/.zshenv` under zsh, never `~/.zshrc`. A token
exported in `~/.zshrc` therefore works in the user's own terminal and is invisible here, which
looks exactly like a CLI that was never set up. The remedy is one line in that file:

```bash
export JIRA_API_TOKEN=<token from https://id.atlassian.com/manage-profile/security/api-tokens>
```

It is the user's own dotfile: report the line and the file, and never edit it for them.

**The configuration was never generated.** Only here is `jira init` the remedy, and it comes
**second**: it authenticates while it runs, so without the credential it answers
`401 Unauthorized` and writes nothing.

Test for the credential without ever printing it, and look for the configuration file rather than
assuming either state. A CLI that is installed, configured and merely unlit by a missing
credential is not a CLI that was never set up, and the report must not say it was.

## What a skill must never do

- Call a channel for an operation the map assigns to the other one.
- Invent a REST call to work around a declared gap. The gap is reported to the user.
- Hard-code an MCP tool name.
- Treat a missing capability as an error. It is a degradation, and it is announced.
