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

- **A server installed through claude.ai settings cannot serve this plugin. The convention
  stands, and the remediation changes.** This was first met as an unexplained failure: on a
  machine where Atlassian had been added that way, `claude mcp list` reported it connected under
  the name `claude.ai Atlassian`, no Atlassian tool was available to the session at all, and
  nothing in the status column said so. Two things were left open then and are now established
  on the same machine.

  A connector does not expose its tools under the name its row displays. The Gmail connector,
  shown as `claude.ai Gmail`, exposes `mcp__010e5c33-82c3-449b-835e-71d848969cda__*`; Google
  Drive and Google Calendar likewise, each under a different opaque identifier. A server added
  from the command line exposes exactly the id it was given — `atlassian` here, as
  `mcp__atlassian__*`. The identifier a connector gets is assigned by the connector mechanism
  and belongs to that installation, so there is no namespace a skill could declare statically
  that would match one on a second machine.

  Nor can the row be renamed or removed by the user. `claude mcp get "claude.ai Gmail"` reports
  the scope `claude.ai config`, with no transport, no URL, and — unlike a project- or
  user-scoped server, which prints its own `claude mcp remove` line — no removal command at all.
  It is not managed from the command line.

  The decision is unchanged, because the constraint is unchanged: `allowed-tools` is static
  frontmatter, something has to be named in it, and nothing about a connector can be named.
  What changes is the advice. The remediation was "remove it and add it again under the required
  id", which the user cannot perform; it is now **declaring the server at project scope in a
  `.mcp.json`** in the repository being worked in. That needs no removal, coexists with a
  connector already installed and leaves it working for everything else, holds a URL and no
  credential, is approved once when the repository is opened, and travels with the repository so
  a team configures it once rather than each on their own machine. `claude mcp add` remains the
  alternative for a user who wants the server on their machine instead. `/jira-doctor` reports
  the connector case as a failure of reachability rather than of status, and no longer sends the
  user to rename anything.

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
