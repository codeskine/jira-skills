---
description: "Jira environment health check — verify the Atlassian MCP server is configured under the id 'atlassian', the jira CLI is authenticated, and a project profile exists. Run before any Jira skill."
allowed-tools: mcp__atlassian Bash(claude:*) Bash(jira:*) Bash(command:*) Read
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

Two probes, and their order is the substance of this step. The question is **can this session reach
Jira**, so ask the session first and the configuration only when the answer is no.

### The probe

Ask the session for something the server can answer. Any read-only `mcp__atlassian__*` tool will
do; prefer the cheapest identity call it offers — at the time of writing `atlassianUserInfo`, which
takes no arguments and names no project.

- A tool from that server answers → ✅ **reachable from this session**. Stop here; nothing below
  applies. The skills declare `mcp__atlassian` and reach the same server under the same name, so no
  configuration listing can change the answer this call already gave.
- No `mcp__atlassian__*` tool is available here, or the call comes back an error → the server is
  not usable in this session, and the rest of this step establishes why.

**The tool name is not what is being checked.** Skills resolve the operations they need into the
project profile at discovery, because names change between server versions; this command runs
before any profile exists, so it names a probe instead of reading one. What it establishes is that
_some_ tool from the server named `atlassian` answers here, which is exactly what a skill needs.

**A configuration listing cannot establish that.** `claude mcp list` runs in a separate process and
does not share this session's connection state. The two can disagree, and do: a session with the
channel live and every Atlassian tool working has been told by its own listing that the server was
pending approval. Where they disagree the session is right, because the session is where the skills
run.

### Why it failed

Run this only when the probe did not come back. It classifies a failure; it never establishes
success.

```bash
claude mcp list 2>&1
```

Read the output:

- A row named exactly **`atlassian`**, connected → ⚠️ **cannot be determined.** The configuration is
  right and this session still cannot use it. Report both observations and assert no cause: a
  session started before the configuration existed, an authentication that lapsed after the row was
  drawn, and a network not reaching Atlassian are indistinguishable from here. Starting a new
  session in this repository is the cheapest thing to try, and it is a suggestion, not a diagnosis.

- A row named `atlassian` that needs authentication → ❌ **not authenticated**. The user
  re-authenticates it through Claude Code; do not attempt it for them.

- A row named **`plugin:<something>:atlassian`** → ❌ **unreachable by construction, and nothing the
  user did.** A server declared by an installed plugin is registered under a namespaced id, and
  every skill declares the bare `mcp__atlassian`, so a plugin-declared server can never serve them
  whatever it is called inside the plugin. It will also invite authentication, which buys nothing.
  Say so, tell the user to leave it alone, and have them declare `atlassian` by either route below.

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
  match it on any machine.

  **Do not tell the user to rename or remove it.** Neither is offered: `claude mcp get` on such
  a row reports the scope `claude.ai config`, with no transport, no URL and no removal command,
  and renaming would not change the identifier anyway. Leave the connector alone — it costs
  nothing and serves other things.

- No Atlassian row at all → ❌ **not configured**. The user adds it, by either route below; the
  plugin cannot.

### The remedy, for every ❌ above

Declare the server the skills need at project scope, in a `.mcp.json` at the root of the repository
being worked in — alongside whatever else is already there, removing nothing:

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

Claude Code asks the user to approve it the next time the repository is opened. It holds a URL and
no credential, it can be committed so the team configures it once, and it changes nothing outside
the repository. A user who would rather have it on their machine than in the repository can use
`claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp` instead — the id is
what matters, not the scope.

Either way the server starts unauthenticated, so expect the not-authenticated case next, and have
the user authenticate it before running anything.

**Nothing in this step ends the check.** Classify what came back and carry the outcome to Step 4. A
user who learns in one pass that the server is unreachable **and** the CLI unconfigured is spared a
second round trip, and an inconclusive first step is not a failed environment.

## Step 2 — The Jira CLI

Needed only for the Agile domain — boards, sprints, the fix version listing. Everything else goes
through the MCP server, so a missing CLI is a **partial** degradation, not a dead environment.

**Nothing in this step ends the check.** Run the commands, classify what comes back, and carry the
outcome to Step 4 — an absent or unauthenticated CLI is a state to report, not a reason to stop
before Step 3.

```bash
command -v jira
```

- A path → the CLI is installed.
- No output → ❌ **not installed**. Report the install route and go straight to Step 3; there is
  nothing left here to interrogate.

  ```text
  macOS: brew install ankitpokhrel/jira-cli/jira-cli
  Other: https://github.com/ankitpokhrel/jira-cli#installation
  ```

If it is installed, find out whether it is authenticated:

```bash
jira me
```

- It prints the account → ✅ **authenticated**.
- It errors, or asks for an API token → the CLI does not answer, and **two different causes look
  identical here**. Establish which before prescribing anything:

  ```bash
  [ -n "$JIRA_API_TOKEN" ] && echo "credential: present" || echo "credential: absent"
  ls "${JIRA_CONFIG_FILE:-$HOME/.config/.jira/.config.yml}" >/dev/null 2>&1 \
    && echo "config: present" || echo "config: absent"
  ```

  Neither command prints the credential, and neither must ever be made to.

- **credential absent** → ❌ **the token is not visible to this shell.** Not the same as an
  unconfigured CLI, and saying so would send the user to the wrong fix. Skills reach the CLI
  through `Bash(jira:*)`, a **non-interactive** shell, and which startup file such a shell reads
  — if any — depends on the shell. So a token exported from a file only an interactive shell
  reads works in the user's own terminal and is invisible to every skill, which is exactly what
  this looks like.

  The remedy names a file, so find out which shell first:

  ```bash
  echo "$SHELL"
  ```

  | Shell  | Where the export belongs                                                                                                                                  |
  | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `zsh`  | `~/.zshenv`, read by every zsh. Never `~/.zshrc`, which only an interactive one reads.                                                                    |
  | `bash` | `~/.bash_profile` or `~/.profile` — `~/.bashrc` never reaches a non-interactive bash, which reads no startup file of its own unless `BASH_ENV` names one. |
  | `fish` | `set -Ux JIRA_API_TOKEN …` at the prompt: a universal exported variable, held outside any startup file.                                                   |
  | other  | The file its non-interactive form reads; failing that, the environment this session was started with.                                                     |

  For zsh and bash, report this line and the file it belongs in. It is the user's own
  configuration, so never edit it for them, and the change reaches only sessions started
  afterwards:

  ```bash
  export JIRA_API_TOKEN=<token from https://id.atlassian.com/manage-profile/security/api-tokens>
  ```

- **credential present, config absent** → ❌ **installed but NOT configured**. Now `jira init` is
  the remedy. It is interactive, so ask the user to run it themselves:

  ```bash
  jira init
  ```

- **credential present, config present, still failing** → ❌ **configured, and Jira is not
  answering.** That is exactly what the probes establish and no more: a token is exported, a
  configuration exists, and the call does not come back. **Why** is not visible from here. An
  expired or revoked token is the common case; a configuration naming a site the user no longer
  means, and a network that does not reach Atlassian, look identical at this distance.

  So report the state and hand over the two things that tell them apart, rather than asserting a
  cause the step cannot see: a fresh token from the same address, exported the way the table above
  prescribes, and the site the configuration names — which the user can compare against the one
  they mean.

`jira init` is never the first step: it authenticates while it runs, so on an absent credential it
answers `401 Unauthorized` and writes nothing. Prescribing it for a missing token costs the user a
round trip and tells them their configuration is broken when it is not.

`jira me` exits non-zero whenever the CLI does not answer. That status is the answer to the
question, not a broken command: read it and move on.

## Step 3 — The project profile

Read `.jira/project-profile.md`.

- The file is there → ✅ **project profile present**.
- It does not exist → ❌ **no project profile**. The skills have nothing to read and will stop on
  their first step. The fix is the `jira-init` skill, which discovers the project and writes the
  profile.

Reading the file rather than testing for it in a shell keeps this step inside what the command
declares, and an absent file comes back as an ordinary "not found" instead of a non-zero exit that
reads like a failure.

**Run outside a repository, this step reports a different thing.** A profile lives in the
repository whose work it describes, so with no repository under the command there is nowhere for
one to be — and telling the user to run `jira-init` would send them to write a file into a
directory that is not their project. Say that instead: the check ran outside a repository, this
step could not be answered, and the command wants running from the root of the repository the work
is tracked in. Step 1 is unaffected either way, though its `.mcp.json` remedy is the project-scoped
route of two — outside a repository the user-scoped `claude mcp add` is the one that applies.

## Step 4 — Report

Report the three checks together, never just the first failure: knowing that the MCP server is
missing **and** the CLI is unconfigured saves the user a second round trip.

| State               | Meaning                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| all three pass      | ready                                                                    |
| MCP ok, CLI missing | usable, but sprint and board operations are unavailable                  |
| MCP missing         | not usable — every authoring skill goes through the MCP server           |
| MCP indeterminate   | may be usable; the probe failed and the configuration is right. Say both |
| profile missing     | run `jira-init`                                                          |

### The shape of the report

Fixed here, so that two runs of this command produce reports a user can compare. One block per
check, in the order the steps run, each headed by the subject and its marker; then a closing line
that says whether the environment is usable and what the first move is.

```text
<subject>        <✅, ⚠️ or ❌>  <the state, in the words this command's steps use>
     found       <what was observed — the call, the row, the probe results, the shell>
     why         <only where the state is one a user would otherwise misread>
     remedy      <what they do, and never what the command will do for them>
```

- **`found` carries the observation, not a judgement.** It is what makes the report checkable
  against the machine rather than believed.
- **`why` is omitted where the state explains itself.** An absent profile needs no paragraph; a
  server that is connected and still unusable needs one, and that asymmetry is the point.
- **`remedy` is written as an instruction to the user.** Every fix in this command is theirs:
  re-authenticating, editing their own shell configuration, running an interactive `jira init`.
- **A ✅ block carries `found` and stops.** There is nothing to remedy and nothing to explain.
- **A ⚠️ block carries `found` and `why`, and its `remedy` is the cheapest thing to try**, named as
  a suggestion. The one state this command cannot resolve is a configuration that looks right and a
  session that cannot use it; saying so is honest, and asserting a cause there would not be.
- **The closing line names one next move**, not three. Where more than one check failed, the MCP
  server is first: without it nothing authors at all.

## Troubleshooting

| Symptom                                                   | Cause                                           | Fix                                                                                                                            |
| --------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| a skill's Jira calls silently do nothing                  | the server is not reachable as `atlassian`      | add one under that id (Step 1)                                                                                                 |
| Atlassian shows as `claude.ai Atlassian`                  | a connector's tools are not named after its row | declare `atlassian` in `.mcp.json` and leave the connector in place (Step 1)                                                   |
| a row reads `plugin:<name>:atlassian`                     | a plugin's own server is registered namespaced  | leave it; it can serve no skill under that id. Declare `atlassian` yourself (Step 1)                                           |
| the check says the server is fine, and no Jira tool works | the listing and the session disagree            | start a new session in this repository and run the check again (Step 1)                                                        |
| `jira: command not found`                                 | CLI not installed or not on `PATH`              | install it; confirm with `command -v jira`                                                                                     |
| `The tool needs a Jira API token`                         | no credential in this shell, or no config yet   | export `JIRA_API_TOKEN` where a non-interactive shell of yours reads it; `jira init` only if the config is absent too (Step 2) |
| a skill stops asking for the profile                      | no discovery has been run in this repository    | run `jira-init`                                                                                                                |
| the profile lists an operation as unsupported             | no available tool covers it                     | expected — the skill hands that step to the user                                                                               |
