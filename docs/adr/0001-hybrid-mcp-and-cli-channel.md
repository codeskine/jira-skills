# Skills reach Jira through the MCP server, and through the Jira CLI only for the Agile domain

The obvious choice is a single channel. We use two: the **Atlassian MCP server** for work
items, fields, comments, transitions, search and project metadata, and the **Jira CLI** for
boards, sprints and backlog. The reason is coverage, not preference — Atlassian's published
material for the remote MCP server describes searching and creating work items and does not
document the Agile surface, while `jira` covers boards, sprints and versions natively. Rather
than force sprint planning through whatever generic call happens to exist, or drop sprint
management from the plugin, we let each channel own what it actually serves.

## Consequences

- The operation → channel map is declared once, in `skills/shared/references/channels.md`.
  A skill never decides for itself which channel to use.
- The MCP server must be reachable under the server id `atlassian`. Tool names have the form
  `mcp__<server-id>__<tool>` and the id is chosen at install time, so a skill that declares
  `mcp__atlassian` in `allowed-tools` only works if the convention is followed.
  `/jira-doctor` verifies the id and prints the exact remediation instead of failing
  obscurely.

- **The convention does not cover every way Atlassian can be installed, and the decision stands
  anyway.** On a machine where Atlassian had been added through claude.ai settings,
  `claude mcp list` reported it connected, under the name `claude.ai Atlassian`, and no
  Atlassian tool was available to the session at all — so no skill could have reached Jira,
  and nothing in the status column said so. Other connectors added the same way did expose
  tools, under names that were not the ones their rows displayed. What namespace the Atlassian
  connector would expose once it does, and whether such a row can be renamed or removed, were
  not established: neither was tested. The decision is unchanged because the constraint is
  unchanged — `allowed-tools` is static frontmatter and something has to be named in it — and
  the remediation that does not depend on any of the untested parts is to add a server under
  the required id. `/jira-doctor` now separates that case from a plain wrong id, and says which
  of its advice rests on what was seen.
- Two dependencies to install and authenticate instead of one. `/jira-doctor` checks both.
- If the MCP server later covers the Agile domain, the CLI dependency can be dropped without
  touching any skill: only the channel map changes.

## Considered alternatives

- **Jira CLI only.** Complete Agile coverage, testable from a shell, no MCP setup. Rejected
  because it gives up the native agent integration and the authenticated session the MCP
  server already provides.
- **MCP only.** One channel, no shell dependency. Rejected because sprint and board
  management would have had to leave the plugin, and the Sprint is a first-class concept of
  the domain model.
- **REST API v3 via curl.** Full field coverage, no third-party dependency. Rejected because
  every SKILL.md would carry JSON payloads and auth headers, blowing the token budget.
