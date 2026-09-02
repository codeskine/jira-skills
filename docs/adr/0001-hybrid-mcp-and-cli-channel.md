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
- The MCP server must be configured with the server id `atlassian`. Tool names have the form
  `mcp__<server-id>__<tool>` and the id is chosen at install time, so a skill that declares
  `mcp__atlassian` in `allowed-tools` only works if the convention is followed.
  `/jira-doctor` verifies the id and prints the exact remediation instead of failing
  obscurely.
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
