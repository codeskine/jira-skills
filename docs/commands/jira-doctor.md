# `/jira-doctor` — check the environment

<!-- skill-header:start -->

|                |                                                          |
| -------------- | -------------------------------------------------------- |
| **Name**       | `/jira-doctor`                                           |
| **Kind**       | command                                                  |
| **Invocation** | `/jira-doctor`                                           |
| **Tools**      | `Bash(claude:*)` `Bash(jira:*)` `Bash(command:*)` `Read` |

<!-- skill-header:end -->

## What it does

Checks the three things the Jira skills need, and reports all three. The Atlassian MCP server has
to be reachable under exactly the id `atlassian`; the `jira` CLI has to answer when a skill calls
it; and `.jira/project-profile.md` has to exist. They fail independently, so the report says which
one failed and what to do about each.

It only inspects. It never runs an interactive login and never writes configuration for you — it
prints the exact command and stops. There is no draft gate on this page because nothing is
written.

## When it fires · when it does not

It fires when you type it, and at no other time: this is a command, not a skill, so nothing you
say invokes it on its own. `/jira-doctor help` prints the usage block and exits without checking
anything.

| Say something like                                       | And this is what you want                                                  |
| -------------------------------------------------------- | -------------------------------------------------------------------------- |
| "nothing I ask for seems to reach Jira"                  | `/jira-doctor`                                                             |
| "I have just installed the plugin"                       | `/jira-doctor`, then [`jira-init`](../skills/jira-init.md)                 |
| "how is my Jira project configured?"                     | [`jira-init`](../skills/jira-init.md)                                      |
| "a skill stopped, saying the project profile is missing" | `/jira-doctor` confirms it, [`jira-init`](../skills/jira-init.md) fixes it |
| "just set the MCP server up for me"                      | nobody here — the command prints the command and you run it                |

The boundary with [`jira-init`](../skills/jira-init.md) is which question is being asked.
`/jira-doctor` asks whether this machine can reach Jira at all. `jira-init` asks how your project
is configured, and it needs the answer to the first question to already be yes.

## How to use it

Type it, read the three lines. There is nothing to approve and nothing to undo.

**1 · It looks for a server named exactly `atlassian`.** The id is fixed by convention, not by
preference: skills declare `mcp__atlassian` in static frontmatter, and frontmatter cannot read a
file. A server connected under any other name — `Atlassian`, `mcp-atlassian`, `jira` — serves no
skill in this plugin however healthy it looks, and that is the failure that looks like nothing
happening. The remedy is to re-add the same server under the required id, taking the transport and
the URL from the row that is already there:

```bash
claude mcp remove <the id you found>
claude mcp add --transport <its transport> atlassian <its URL>
```

**2 · An Atlassian connector added through claude.ai settings is the same failure wearing a
different face.** Its row reads `claude.ai Atlassian`, it reports itself connected, and it still
serves no skill here: a connector exposes its tools under an identifier the connector mechanism
assigns, not under the name the row displays, so `mcp__atlassian` cannot match it on any machine.
`/jira-doctor` does not tell you to rename or remove it — neither is offered, and renaming would
not change the identifier anyway. It tells you to declare the server the skills need **alongside**
it, at project scope, in a `.mcp.json` at the root of the repository you are working in:

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

Claude Code asks you to approve it the next time the repository is opened, and the file holds a
URL and no credential, so it can be committed and the team configures it once. Either way the
server starts unauthenticated, so expect to authenticate it next. One more caveat this step
carries: a server added, approved or authenticated **during** a session may not be usable in that
session. When the row says connected and no Atlassian tool is available, the environment is right
and the session is stale — start a new one and run the check again.

**3 · The CLI check tells two different failures apart.** The `jira` CLI is needed only for the
Agile domain — boards, sprints, the fix version listing — so an absent one is a partial
degradation, not a dead
environment, and the check carries on to the end regardless. If it is installed but does not
answer, two causes look identical from the outside and take different remedies. `/jira-doctor`
establishes which before prescribing anything, by testing for the credential and for the
configuration file separately. Neither test prints your token, and neither must ever be made to.

| What it finds                             | What it means                                               | What you do                                 |
| ----------------------------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| credential absent                         | the token is not visible to the shell the skills use        | export it where your shell reads it, below  |
| credential present, configuration absent  | installed but never configured                              | run `jira init` yourself, it is interactive |
| credential present, configuration present | the credential is refused — expired or revoked, most likely | a new token, exported the same way          |

The first row is the one that catches people. Skills reach the CLI through `Bash(jira:*)`, a
**non-interactive** shell, and which startup file such a shell reads — if any — depends on the
shell. A token exported from a file only an interactive shell reads therefore works perfectly in
your own terminal and is invisible to every skill, which is exactly what a CLI that was never set
up looks like.

So the command establishes your shell before it names a file, because the answer is not the same
file — and under one of the three it is not a file at all:

| Your shell | Where the export belongs                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `zsh`      | `~/.zshenv`, read by every zsh. Never `~/.zshrc`, which only an interactive one reads.                                                                       |
| `bash`     | `~/.bash_profile` or `~/.profile` — `~/.bashrc` will not do it, because a non-interactive bash reads no startup file of its own unless `BASH_ENV` names one. |
| `fish`     | `set -Ux JIRA_API_TOKEN …` at the prompt: a universal exported variable, which lives outside any startup file.                                               |

For zsh and bash the line is the same, and it goes in your own configuration, so the command
reports the file and the line and never edits it for you:

```bash
export JIRA_API_TOKEN=<token from https://id.atlassian.com/manage-profile/security/api-tokens>
```

Whatever the shell, the change reaches only sessions you start afterwards.

`jira init` is the remedy for the second row only, and it comes second on purpose: it
authenticates while it runs, so on a missing token it answers `401 Unauthorized` and writes
nothing. Prescribed for a missing credential it costs you a round trip and tells you your
configuration is broken when it is not.

**4 · It reads the project profile rather than testing for it.** `.jira/project-profile.md` is
what every skill reads as its first step; without it they stop before doing anything. Reading the
file keeps this step inside what the command declares, and an absent file comes back as an
ordinary "not found" instead of a non-zero exit that reads like a failure. The remedy is the
[`jira-init`](../skills/jira-init.md) skill, which discovers the project and writes the profile.

**5 · It reports the three together, never just the first failure.** Knowing that the MCP server
is missing **and** that the CLI is dark saves you a second round trip. The four states it
distinguishes: all three pass and you are ready; MCP fine and CLI missing means usable, with
sprint and board operations unavailable; MCP missing means not usable, because every authoring
skill goes through it; profile missing means run `jira-init`. See
[the development process](../development-process.md) for the two channels and what each one owns.

## Worked exchange

**You**

> `/jira-doctor`

**`/jira-doctor`**

> Three checks, three results.
>
> | Check           | State                                                              |
> | --------------- | ------------------------------------------------------------------ |
> | MCP server      | ❌ connected, and unusable by these skills — `claude.ai Atlassian` |
> | Jira CLI        | ❌ installed, but the token is not visible to this shell           |
> | Project profile | ❌ `.jira/project-profile.md` does not exist                       |
>
> The Atlassian row you have is a connector added through claude.ai settings. It works, and no
> skill here can see it: a connector's tools are exposed under an identifier the connector
> mechanism assigns, not under the name the row displays, and the skills ask for `mcp__atlassian`.
> Leave it where it is and declare the server they need alongside it, in a `.mcp.json` at the root
> of this repository — I have printed the four lines below the report.
>
> For the CLI: `jira` is installed, `jira me` does not answer, and the probes say
> `credential: absent`, `config: present`, `shell: zsh`. Under zsh the export line goes in
> `~/.zshenv` — open a new session after it.

**You**

> So I run `jira init`?

**`/jira-doctor`**

> No — that is the remedy for a different failure, and you do not have that one. Your
> configuration file is already there; what is missing is the token, in the shell the skills use.
> `jira init` authenticates while it runs, so without the token it would answer `401 Unauthorized`
> and write nothing, and you would come back thinking your configuration is broken. Export
> `JIRA_API_TOKEN` in `~/.zshenv` — not `~/.zshrc`, which a non-interactive zsh never reads —
> and run me again.

**You**

> And the connector — should I just remove it?

**`/jira-doctor`**

> There is nothing to remove: `claude mcp get` on that row reports the scope `claude.ai config`,
> with no transport, no URL and no removal command. Renaming it would not help either, because the
> identifier its tools arrive under is not the name you see. It costs nothing and it serves other
> things — leave it, and add `atlassian` next to it.

## The result

The report as it arrives in chat. Nothing is written: not to Jira, not to your machine.

```text
MCP server       ❌  connected, and unusable by these skills
     found       a row named "claude.ai Atlassian"
     why         a connector exposes its tools under an identifier the connector mechanism
                 assigns, not under the name the row displays, so mcp__atlassian cannot
                 match it on any machine
     remedy      leave the connector alone and declare the server the skills need alongside
                 it, at project scope, in a .mcp.json at the root of this repository:

                   {
                     "mcpServers": {
                       "atlassian": {
                         "type": "http",
                         "url": "https://mcp.atlassian.com/v1/mcp"
                       }
                     }
                   }

                 it starts unauthenticated — authenticate it before running anything

Jira CLI         ❌  the token is not visible to this shell
     found       credential: absent · config: present · shell: zsh
     why         skills reach the CLI through a non-interactive shell, which under zsh reads
                 ~/.zshenv and never ~/.zshrc — a token exported in ~/.zshrc works in your
                 own terminal and is invisible here
     remedy      add this line to ~/.zshenv yourself, then open a new session:

                   export JIRA_API_TOKEN=<token from
                   https://id.atlassian.com/manage-profile/security/api-tokens>

                 not jira init: the configuration is already present

Project profile  ❌  no project profile
     found       .jira/project-profile.md does not exist
     remedy      run the jira-init skill — it discovers the project and writes the file

Not usable yet. Every authoring skill goes through the MCP server, so start there. The CLI
gates only boards, sprints and the fix version listing; the rest of the plugin works without it.
```

Three things make this report worth reading rather than worth re-running. The three lines are
independent, so you fix three things in one pass instead of discovering them one failure at a
time. Each line carries the remedy for the cause that was actually established, which is why the
CLI line says _not `jira init`_ out loud: that is the command a reader reaches for, and here it
would fail with `401` and write nothing. And the MCP line does not ask you to remove anything —
the connector is not a misconfiguration and not something you did wrong, it is simply invisible to
a static `mcp__atlassian`.

When all three pass, the same report is four lines:

```text
MCP server       ✅  atlassian — connected
Jira CLI         ✅  authenticated
Project profile  ✅  .jira/project-profile.md

Ready.
```

## What it will not do

- **Log you in.** No interactive login, ever — not the MCP server's authentication, not
  `jira init`. It prints the command and stops.
- **Write configuration for you.** Not `.mcp.json`, not your shell's startup file, not
  `.jira/project-profile.md`. One of those is your own dotfile, and the last one belongs to
  [`jira-init`](../skills/jira-init.md).
- **Print your credential.** The probes report presence or absence and never a value.
- **Stop at the first failure.** All three checks run, and an absent CLI does not end the check
  before the profile is looked at.
- **Rename or remove a claude.ai connector.** Neither is offered by Claude Code for such a row,
  and renaming would not change the identifier its tools arrive under.
- **Invent an endpoint.** For a server under the wrong id it reuses the transport and URL of the
  row already there; where the row shows none, it asks you rather than guessing one.
- **Report a stale session as a configuration failure.** A server that `claude mcp list` shows
  connected while no Atlassian tool is available in the session means start a new session, not fix
  your setup.
- **Discover your project.** Work types, statuses, boards and fix versions are not its business.

## See also

- [The development process](../development-process.md) — the two channels, which operations each
  one owns, and what the project profile holds.
- [`jira-init`](../skills/jira-init.md) — the skill that discovers the project and writes the
  profile this command checks for.
- `jira-plan` and `jira-release` are the two skills that reach the Agile domain, so they are the
  ones that go quiet when the CLI check fails; everything else keeps working on the MCP server
  alone.
