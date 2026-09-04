---
description: "Jira environment health check — verify the Atlassian MCP server is configured under the id 'atlassian', the jira CLI is authenticated, and a project profile exists. Run before any Jira skill."
allowed-tools: Bash(claude:*) Bash(jira:*) Bash(command:*) Read
---

# jira-doctor

Get the environment ready for the Jira skills. This command only **inspects**; it never runs an
interactive login or writes configuration for the user — it reports the exact command to run.

Three things must be true. They fail independently, and the report says which.

## Usage

```text
/jira-doctor        Check the environment
/jira-doctor help   Show this help and exit
```

**If the argument is `help`, `-h` or `--help`:** print the Usage block and stop.

## Step 1 — The MCP server

```bash
claude mcp list 2>&1
```

Read the output and classify:

- A row named exactly **`atlassian`**, connected → ✅.
- A row named `atlassian` that needs authentication → ❌ **not authenticated**. The user
  re-authenticates it through Claude Code; do not attempt it for them.
- A row that is the Atlassian server under **another id** (`Atlassian`, `mcp-atlassian`,
  `jira`, …) → ❌ **wrong id**. This is the failure that looks like nothing happening, because
  skills declare `mcp__atlassian` statically in `allowed-tools` and a differently-named server
  is invisible to them.

  Report the id found, and the remediation — re-adding the same server under the required id:

  ```bash
  claude mcp remove <the id you found>
  claude mcp add --transport <its transport> atlassian <its URL>
  ```

  Take the transport and URL from the row that is already there. Do not invent an endpoint: if
  the row does not show one, ask the user for it or point them at Atlassian's own setup
  documentation.

- A row whose name begins with **`claude.ai `** — `claude.ai Atlassian`, say → ❌ **connected,
  and unusable by these skills.** Not a misconfiguration and not something the user did wrong:
  a server installed through claude.ai settings exposes its tools under an identifier the
  connector mechanism assigns, not under the name the row displays, so `mcp__atlassian` cannot
  match it on any machine. Confirm it if you like — no Atlassian tool will be available in the
  session — but do not report it as a status problem.

  **Do not tell the user to rename or remove it.** Neither is offered: `claude mcp get` on such
  a row reports the scope `claude.ai config`, with no transport, no URL and no removal command,
  and renaming would not change the identifier anyway. Leave the connector alone — it costs
  nothing and serves other things.

  The remediation is to declare the server the skills need **alongside** it, at project scope,
  in a `.mcp.json` at the root of the repository being worked in:

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

  Claude Code asks the user to approve it the next time the repository is opened. It holds a URL
  and no credential, it can be committed so the team configures it once, and it changes nothing
  outside the repository. A user who would rather have it on their machine than in the
  repository can use `claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp`
  instead — the id is what matters, not the scope.

  Either way the server starts unauthenticated, so expect the second case above next, and have
  the user authenticate it before running anything.

- **A server added, approved or authenticated during this session may not be usable in it.**
  When `claude mcp list` reports it connected and no Atlassian tool is available here, the
  environment is fine and the session is not: tell the user to start a new one in this
  repository and run this check again. Do not report it as a configuration failure — you would
  be sending them to fix something that is already correct.

- No Atlassian row at all → ❌ **not configured**. The user adds it, by either route above;
  the plugin cannot.

## Step 2 — The Jira CLI

Needed only for the Agile domain — boards, sprints, backlog. Everything else goes through the
MCP server, so a missing CLI is a **partial** degradation, not a dead environment.

```bash
{
  if ! command -v jira >/dev/null 2>&1; then
    echo "jira CLI is NOT installed."
    echo "   macOS: brew install ankitpokhrel/jira-cli/jira-cli"
    echo "   Other: https://github.com/ankitpokhrel/jira-cli#installation"
    exit 1
  fi
  echo "jira installed"
  jira version 2>/dev/null | head -1

  if jira me >/dev/null 2>&1; then
    echo "jira authenticated"
    jira me 2>/dev/null | head -1
  else
    echo "jira installed but NOT configured (no API token)."
    exit 2
  fi
}
```

On exit 2, the fix is interactive — ask the user to run it themselves:

```bash
jira init
```

It needs an API token from <https://id.atlassian.com/manage-profile/security/api-tokens>.

## Step 3 — The project profile

```bash
test -f .jira/project-profile.md && echo "project profile present" || echo "no project profile"
```

If absent, the skills have nothing to read and will stop on their first step. The fix is the
`jira-init` skill, which discovers the project and writes the profile.

## Step 4 — Report

Report the three checks together, never just the first failure: knowing that the MCP server is
missing **and** the CLI is unconfigured saves the user a second round trip.

| State               | Meaning                                                        |
| ------------------- | -------------------------------------------------------------- |
| all three pass      | ready                                                          |
| MCP ok, CLI missing | usable, but sprint and board operations are unavailable        |
| MCP missing         | not usable — every authoring skill goes through the MCP server |
| profile missing     | run `jira-init`                                                |

## Troubleshooting

| Symptom                                       | Cause                                           | Fix                                                                          |
| --------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| a skill's Jira calls silently do nothing      | the server is not reachable as `atlassian`      | add one under that id (Step 1)                                               |
| Atlassian shows as `claude.ai Atlassian`      | a connector's tools are not named after its row | declare `atlassian` in `.mcp.json` and leave the connector in place (Step 1) |
| `jira: command not found`                     | CLI not installed or not on `PATH`              | install it; confirm with `command -v jira`                                   |
| `The tool needs a Jira API token`             | CLI installed, never configured                 | `jira init`                                                                  |
| a skill stops asking for the profile          | no discovery has been run in this repository    | run `jira-init`                                                              |
| the profile lists an operation as unsupported | no available tool covers it                     | expected — the skill hands that step to the user                             |
