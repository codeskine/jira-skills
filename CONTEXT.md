# Jira Skills

A set of Agent Skills that lets an AI agent produce and maintain the work items of a project
on **Atlassian Jira Cloud** — from a raw request to a well-formed work item, placed in the
right hierarchy, sprint and release.

The perimeter is the **tracker**. Code, branches, change proposals and technical release are
not owned by this plugin.

## Language

### Ownership principle

**Native concept**:
A process concept Jira owns and manages on its own — status, work type, parent, sprint, fix
version. The plugin **discovers and guides** it; it never creates or replaces it.
_Avoid_: platform feature, Jira object

**Surrogate**:
A concept invented by the plugin to fill the absence of a Native concept — the scoped labels
`workflow::*` and `kind::*`, the markdown table of children. On Jira Cloud **no legitimate
surrogate exists**: every process concept in the model has a native counterpart. The term
stays in the vocabulary only to name what was removed.
_Avoid_: workaround, emulation, simulation

**Discovery**:
Reading the real configuration of the Jira project — which work types exist, how they nest,
which statuses and transitions are defined, which boards and sprints are active. It precedes
any proposal. No skill assumes a configuration.
_Avoid_: introspection, probe, detection

**Project profile**:
The file, versioned in the repository, that records the outcome of Discovery and that every
skill reads as its first step. It is the only local cache allowed, and it is allowed because
it is **read**. Describing it that way is fine; **naming** it that way is not — a thing called
the cache invites being treated as disposable and silently refreshed, and this file is neither.
_Avoid_: config, mirror, local state, "the cache"

### Work

**Work item**:
The elementary unit of tracked work on Jira. It has a Work type, a Status and, optionally, a
Parent. It is the canonical term and matches the native one.
_Avoid_: issue, ticket, task, story, work element

**Work type**:
The attribute that classifies a Work item — Epic, Story, Task, Bug, Sub-task, and any custom
type of the project. **Values are never hard-coded**: they belong to the project scheme and
are known only through Discovery.
_Avoid_: issue type, kind, category, `type::*`

**Parent**:
The native single relation from a Work item to the one containing it. The model declares the
relation; **depth belongs to the project** and is discovered. There is no markdown table of
children: the hierarchy is queryable on Jira.
_Avoid_: epic link, `kind::epic`, simulated hierarchy, children table

**Status**:
The position of a Work item in the Jira Workflow. It is owned by the project admin: the
plugin **defines no states** and invents no names for them.
_Avoid_: workflow state, `workflow::*`, phase, column

**Transition**:
The move from one Status to another, allowed only if the Jira Workflow permits it. Available
transitions are asked of Jira, never inferred from a diagram owned by the plugin.
_Avoid_: state change, move

**Jira Workflow**:
The Jira object made of statuses and transitions, owned by the project admin. The bare word
`workflow` is banned in this repository because it is overloaded: for the sequence from
request to release, say **development process**.

### Containers

**Sprint**:
The native time container, owned by a board: it defines _when_ a Work item is tackled. It has
a start, an end, and it closes.
_Avoid_: iteration, milestone, cycle, cadence

**Fix Version**:
The native versioned release target: it defines _what_ ships together. It has no duration, it
has a version, and it is released or archived.
_Avoid_: release, version, milestone, tag

A Work item may belong to a Sprint and to a Fix Version at the same time: they are orthogonal
axes. The term **milestone** does not belong to this domain.

### Access

**Channel**:
The route a skill uses to talk to Jira. There are two, and the choice is not free: the
**Atlassian MCP server** is the primary channel for work items, fields, comments, transitions
and search; the **Jira CLI** covers what the server does not expose, namely the Agile domain —
boards, sprints, backlog. The operation → channel map is declared once and shared.
_Avoid_: backend, provider, adapter, integration

### Process invariants

**Draft gate**:
The rule that no write to Jira happens before the user has seen the complete artifact in chat
and approved it explicitly. It holds for every skill, in one single form.
_Avoid_: confirmation, approval, internal review

**Evidence**:
The rule that every verifiable claim carries its evidence in the form that fits it — a code
snippet with `path/file.ext` line N for code, the exact log or error for a defect, a datum or
metric for a value proposal, a work item link for a dependency.
_Avoid_: snippet policy, proof, backing

**Neutrality**:
Templates define structure and sections, never a natural language nor a technology stack. The
language of generated content follows the user's active language; code examples, where they
apply, assume no programming language.
_Avoid_: i18n, localization, agnosticism

## Applying the _Avoid_ lists

An _Avoid_ list bans a word **as a name for the concept above it**, not as a string. The same
letters are fine, and often required, in three other roles:

- **A literal name owned by something else.** `jira issue move` and `jira release list` are what
  those CLI commands are called; `Category` is what Jira calls the status category field;
  `metadata.version` is a frontmatter key. Renaming them in prose would make the prose wrong.
  Quote them as code and leave them alone. The same goes for a verb Jira owns: **releasing** a
  fix version is the action Jira performs on it, and only the noun standing in for _fix version_
  is refused.
- **A mention made in order to forbid.** "never simulate it", "the write-only mirror the
  predecessor accumulated", and the shared quality standard's own list of tracker-generic
  synonyms all name a refused thing so that a reader recognises it. The glossary does the same:
  Surrogate stays in the vocabulary only to name what was removed.
- **Ordinary English carrying no domain sense.** "exactly the kind of fact", "server versions",
  "the status column of that output", "ask for approval". Approval is the act the Draft gate
  performs; it is a substitute only when it is used as the _name_ of the gate.

The test is one question: **does this word stand where the canonical term belongs?** "at the
moment of the move" stands where _transition_ belongs, and is a defect. "`jira issue move` is the
fallback" does not.

### Is this checkable mechanically?

**No, not as a word list, and the sweep of 2026-09-04 is the evidence.** Every refused word that
appeared in the shipped artifacts was searched for. Most occurrences were legitimate under one of
the three roles above, and separating them from the dozen real defects took reading the sentence
each one sat in. A list that fires on `move`, `version`, `category`, `approval`, `kind`, `column`
and `issue` reports mostly noise, and a check whose output is mostly noise stops being read.

What is checkable is the narrow case where the rule admits no exceptions and the surrounding text
is fixed. `scripts/skill-frontmatter.mjs` already carries one: a description that names a work
type is rejected, because a description has no room for a literal command name or a mention made
in order to forbid. Add a mechanical rule when a case reaches that standard, and not before.
