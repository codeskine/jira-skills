# `jira-init` — discover the project, write the profile

<!-- skill-header:start -->

|                       |                                                                                                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**              | `jira-init`                                                                                                                                                                                   |
| **Version**           | 1.0.0                                                                                                                                                                                         |
| **Invocable by name** | yes                                                                                                                                                                                           |
| **Channel**           | Atlassian MCP server · Jira CLI                                                                                                                                                               |
| **Environment**       | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". Uses the jira CLI for the Agile surface where it is authenticated, and degrades explicitly without it. |

<!-- skill-header:end -->

## What it does

Reads how your Jira project is actually configured and writes what it found into
`.jira/project-profile.md`, the file every other skill reads as its first step. It looks at the
work types and how they nest, the statuses, the fields required on creation, the boards with their
active sprint, and the fix versions. It creates nothing in Jira and changes nothing there.

It is the first thing you run in a repository, after `/jira-doctor`, and the only skill that runs
discovery or writes that file. It brings no opinion of its own: it records what the project
reports, including what the project cannot do — an intent no work type serves, an operation no
tool covers, a channel that did not answer.

## When it fires · when it does not

It fires when nothing yet knows how your project is configured, or when what is recorded no longer
matches it.

| Say something like                                    | And this is the skill you get                |
| ----------------------------------------------------- | -------------------------------------------- |
| "we track this repository's work on Jira, set it up"  | `jira-init`                                  |
| "what work types does this project actually have?"    | `jira-init`                                  |
| "a skill just told me the project profile is missing" | `jira-init`                                  |
| "the admin added a status last week"                  | `jira-init`, run again                       |
| "is the Atlassian server even connected?"             | [`/jira-doctor`](../commands/jira-doctor.md) |

The boundary with [`/jira-doctor`](../commands/jira-doctor.md) is the difference between two
questions. The command asks whether this machine can reach Jira at all: the MCP server under the
id `atlassian`, the `jira` CLI, and whether a profile exists. This skill asks what the project on
the other end is like. Run the command first — on an unreachable MCP server this skill stops and
sends you there anyway.

Nothing re-runs it for you. Invalidation is explicit and never time-based: a project's
configuration changes rarely, and a check on every invocation would cost every session in order to
catch a rare event. Run it again when the scheme changes, when a status, a board or a fix version
appears that the profile does not list, or when a skill reports that something it expected in the
profile is not in Jira.

## How to use it

Say that this repository's work is tracked on Jira, and answer the questions. Nothing is written —
not even locally — until you approve what you have read.

**1 · It checks that discovery is what you wanted.** This skill sweeps your whole project and
writes a file your team shares, which is a large answer to a small question. Ask it which fix
versions you have, or which boards, and it answers that and stops — no sweep, and no profile
rewritten behind a question you did not mean as a setup step. Where the question is really about
fix versions rather than about your project's shape,
[`jira-release`](jira-release.md) is the skill that owns them and it hands over. Where you are
setting up, or a skill told you the profile is missing or stale, it carries on.

**2 · It checks both channels first, and they fail independently.** The Atlassian MCP server is a
precondition: nothing else answers for work types, statuses or fields, so if it is not reachable
under the id `atlassian` the skill stops and points you at `/jira-doctor`. The `jira` CLI is not a
precondition. Without it, discovery runs on everything the MCP server reaches, and the Agile
surface — boards, sprints, fix versions — is recorded as unsupported **on this machine** rather
than as missing from the tooling. The profile keeps _read_ and _not reachable_ apart because they
send you to different places: one to restore a channel, the other to create a board. See
[the development process](../development-process.md) for which operations each channel owns.

**3 · It asks which project.** If `.jira/project-profile.md` is already there, it tells you which
project it describes and when it was discovered, then asks whether to refresh it or to target a
different one. Otherwise it lists the projects your account can see and asks you to choose — it
never infers the project from the repository name. One repository holds one profile: discovering
again replaces it, and before replacing it the skill says what goes with it.

**4 · It reads seven subjects, in one order.**

| What it reads                                   | Why a skill will need it                                 |
| ----------------------------------------------- | -------------------------------------------------------- |
| work types, and how they nest                   | so a skill offers types that exist, at levels that exist |
| statuses, and the shape of the Jira Workflow    | so a reader knows which positions this project has       |
| fields required on creation, per work type      | so an approved draft is not rejected on write            |
| boards, and the active sprint of each           | so sprint planning happens against reality               |
| fix versions, with their state                  | so nothing is assigned to one that does not exist        |
| project style — team-managed or company-managed | because it changes which fields exist                    |
| the issue link types the project defines        | so a dependency becomes a real link, not a sentence      |

**5 · An absence is a finding, not a failure.** A project with no board, a hierarchy one level
deep, no work type for a defect: each is a valid outcome, written down and said out loud. Statuses
are the case worth expecting, because they are read from the work items that occupy them — a
project holding none exposes none, which is the state of every project on the day it is created.
The profile then says they were not observable yet and that the first work item will make them
readable, and discovery carries on to the next subject.

**6 · It resolves every operation to the tool that serves it.** MCP tool names change between
server versions, so no skill hard-codes one: this skill enumerates what the configured server
actually exposes and records the mapping. Whatever no available tool covers goes to _Unsupported
operations_ with the manual path you will take instead — including the four the tooling has no
route to on either channel: creating a sprint, starting one, creating a fix version, releasing or
archiving one.

**7 · Then the gate, and the file.** Writing the profile is not a write to Jira, but it is a change
to an artifact your whole team shares, so it passes
[the same gate](../development-process.md): the complete profile in chat, the project it
describes, how much of each subject was found, and every unsupported operation — that last one
because it is what surprises people later. You approve, you ask for changes and see it again, or
you say no.

Saying no is worth its own sentence here, because this is the one skill where a refusal is not
local to the thing refused. Nothing is written, which means every other skill in the plugin will
stop at its own first step and send you back here — so it tells you that when you refuse, rather
than letting you meet it three steps later, and it leaves what it found in the conversation instead
of putting the file somewhere quieter.

On approval it writes `.jira/project-profile.md`, creating the directory if needed and overwriting
any profile already there; it is that file's only writer, so there is nothing to merge. Then it
tells you to commit it, and why.

## Worked exchange

**You**

> We track this repository's work on Jira. Set the plugin up.

**`jira-init`**

> Both channels checked before I read anything about your project.
>
> The MCP server answered under the id `atlassian`. The `jira` CLI is installed but does not
> answer: the credential is not visible to the shell I reach it through. That shell reads
> `~/.zshenv` and never `~/.zshrc`, so a token exported in your own terminal's startup file works
> for you and is invisible here.
>
> That is not a blocker. I can discover everything the MCP server reaches now, and boards, sprints
> and fix versions get recorded as **not read on this machine** rather than as absent. Carry on,
> or fix the CLI first?

**You**

> Carry on, I'll sort the token out later.

**`jira-init`**

> These are the projects your account can see. Which one is this repository's work tracked in? I
> do not infer it from the repository name.
>
> | Key | Project           | Style           |
> | --- | ----------------- | --------------- |
> | PAY | Payments Platform | company-managed |
> | INT | Internal Tools    | team-managed    |
> | WEB | Marketing Site    | team-managed    |

**You**

> PAY.

**`jira-init`**

> Discovered on PAY, through the MCP server only:
>
> | Subject             | Found                                              |
> | ------------------- | -------------------------------------------------- |
> | Work types          | 4 — Epic, Story, Task, Sub-task                    |
> | Hierarchy           | three levels, nothing above Epic                   |
> | Statuses            | 4, observed on the 37 work items the project holds |
> | Boards and sprints  | not read — the CLI channel did not answer          |
> | Fix versions        | not read — the same channel                        |
> | Operations resolved | 12 of the 17 this plugin uses                      |
>
> Two things you will meet later, so I am saying them now. This project's scheme has **no work
> type for a defect, for unrefined intake, or for technical debt** — all three will be filed under
> Task, and the artifact that creates one will say which intent it serves. And **nine operations
> are unsupported here**: five because the CLI channel did not answer, and they return when it
> does; four because no tool covers them on either channel — creating a sprint, starting one,
> creating a fix version, releasing or archiving one.
>
> Here is the whole profile. Approve it and I write `.jira/project-profile.md`, or tell me what to
> change.

**You**

> Can you add a work type for defects while you're in there?

**`jira-init`**

> No — this skill only reads. Work types, statuses, Jira Workflows, boards and fix versions belong
> to your project admin, and nothing here creates, renames or configures one. What the profile
> does instead is state the absence, so that every skill filing a defect knows it is filing under
> Task and says so in the work item itself.

**You**

> Understood. Approved.

**`jira-init`**

> Written to `.jira/project-profile.md`. Commit it: it is how the rest of the team, and every
> future session, learn the same facts without asking Jira again. When the CLI answers, run
> `jira-init` again — the five operations waiting on it come back, and the profile stops saying
> "not read".

## The result

The profile as it lands in the repository. It is the only file this plugin keeps locally, and it
is kept because it is read.

```markdown
---
project_key: PAY
project_name: Payments Platform
site: https://example.atlassian.net
project_style: company-managed
discovered_at: 2026-09-05
discovered_by: jira-init 1.0.0
channels_read: mcp — the CLI channel did not answer; its subjects are not read, not absent
---

# Project profile — PAY

What this Jira project can actually do. Written by `jira-init`, read by every other skill.
Do not edit by hand: re-run `jira-init` instead, so the file and Jira stay in agreement.

## Work types

| Work type | Level | Can be a child of | Notes                                   |
| --------- | ----- | ----------------- | --------------------------------------- |
| Epic      | 1     | none              | Required on creation: Summary           |
| Story     | 0     | Epic              | Required on creation: Summary, Reporter |
| Task      | 0     | Epic              | Required on creation: Summary, Reporter |
| Sub-task  | -1    | Story, Task       | Required on creation: Summary, Parent   |

Levels and names are whatever this project declares. A type absent from this table does not
exist here, and no skill may offer it.

### Intents no work type serves

No type names a defect, none names unrefined intake, and none names technical debt or risk. All
three are filed under Task, and the artifact that creates one states which intent it serves.

## Hierarchy

Three levels. Epic contains Story and Task, and both contain Sub-task. This project declares
nothing above Epic.

## Statuses and transitions

| Status      | Category    | Reachable from       | Notes                           |
| ----------- | ----------- | -------------------- | ------------------------------- |
| To Do       | To Do       | initial, In Progress |                                 |
| In Progress | In Progress | To Do, In Review     |                                 |
| In Review   | In Progress | In Progress          | Restricted to the reviewer role |
| Done        | Done        | In Review            |                                 |

Observed on the 37 work items this project currently holds.

Transitions in Jira are evaluated per work item, not per type: this table is the shape of the
Jira Workflow, and the transitions actually available are asked of Jira when one is attempted.

## Boards and sprints

**Not read.** The Jira CLI channel did not answer on this machine, so whether this project has a
board was never established. That is not the same as having none: the answer returns when the
channel does.

## Fix versions

**Not read**, for the same reason and with the same remedy.

## Operation resolution

Which tool serves each operation, resolved from the tools the configured MCP server actually
exposes. Skills read this table instead of hard-coding a tool name.

| Operation                                                  | Channel | Tool or command                    |
| ---------------------------------------------------------- | ------- | ---------------------------------- |
| list projects and their metadata                           | MCP     | `getVisibleJiraProjects`           |
| read the work types of a project                           | MCP     | `getJiraProjectIssueTypesMetadata` |
| read the statuses and available transitions of a work item | MCP     | `getTransitionsForJiraIssue`       |
| create a work item                                         | MCP     | `createJiraIssue`                  |
| read a work item                                           | MCP     | `getJiraIssue`                     |
| edit a work item                                           | MCP     | `editJiraIssue`                    |
| comment on a work item                                     | MCP     | `addCommentToJiraIssue`            |
| transition a work item                                     | MCP     | `transitionJiraIssue`              |
| link two work items                                        | MCP     | `createIssueLink`                  |
| set the parent of a work item                              | MCP     | `editJiraIssue`, parent field      |
| search work items by JQL                                   | MCP     | `searchJiraIssuesUsingJql`         |
| assign a work item to a fix version                        | MCP     | `editJiraIssue`, fix version field |

## Unsupported operations

Operations no available tool covers in this setup. A skill that needs one announces the gap and
hands the step to the user; it never simulates it.

| Operation                          | Why                   | Manual path                                             |
| ---------------------------------- | --------------------- | ------------------------------------------------------- |
| list boards                        | channel not reachable | Read the boards in Jira                                 |
| list sprints of a board            | channel not reachable | Read them on the board                                  |
| add work items to a sprint         | channel not reachable | Add them to the sprint on the board                     |
| close a sprint                     | channel not reachable | Close it from the board                                 |
| list the fix versions of a project | channel not reachable | Read the fix versions in Jira                           |
| create a sprint                    | no tool exposed       | Create it on the board, then ask `jira-plan` to fill it |
| start a sprint                     | no tool exposed       | Start it on the board                                   |
| create a fix version               | no tool exposed       | Create it in Jira, then re-run `jira-init`              |
| release or archive a fix version   | no tool exposed       | Release or archive it in Jira                           |

`channel not reachable` is the only reason here that is about this machine rather than about the
project: the operation returns when the channel does.
```

Three things in here matter later, and two of them are absences. **Boards and sprints** says _not
read_ and not _none_ — the first sends someone to restore a channel, the second to create a board,
and the wrong one costs an afternoon. **Intents no work type serves** is stated rather than left
to be worked out from the table above it, because a skill reading this file acts on what it says
and does not audit a table for what is missing from it. And the **operation resolution** table is
the reason no skill contains a tool name: when the CLI answers again, or a future server exposes
one of the four gaps, re-running `jira-init` closes it without a line changing in any skill.

## What it will not do

- **Create or change anything in Jira.** Work types, statuses, Jira Workflows, boards and fix
  versions belong to your project admin. This skill reads them, and never adds, renames or
  configures one.
- **Guess the project.** It lists what your account can see and asks. The name of the repository
  is not evidence.
- **Hold two projects.** One repository, one profile: work spanning two Jira projects from one
  repository is not supported, because every skill would act on whichever project was discovered
  last.
- **Write "no board" when it means "not read".** A channel that did not answer says nothing about
  the project, and the profile keeps the two facts apart.
- **Let another skill repair the profile.** Every other skill is a reader. One that finds the
  profile disagreeing with Jira reports it and names this skill; it does not quietly patch the
  file, because a profile edited by a skill nobody reviewed is exactly the drift the single-writer
  rule exists to prevent.
- **Tell you whether your environment can reach Jira.** That is
  [`/jira-doctor`](../commands/jira-doctor.md), and it runs first.

## See also

- [The development process](../development-process.md) — discovery and the project profile, the
  draft gate, the two channels, and where setting up sits in the whole path.
- [`/jira-doctor`](../commands/jira-doctor.md) — run before this one: can this machine reach Jira
  at all.
- [`jira-capture`](jira-capture.md) — the usual first thing to do once the profile exists: record
  a request nobody has examined yet.
- [`jira-plan`](jira-plan.md) — the skill most affected when the profile says the Agile channel
  was not read.
