# Discovery and the project profile

No skill assumes how a Jira project is configured. Work types, statuses, transitions, hierarchy
depth, boards and versions belong to the project, and the plugin reads them. See
[ADR-0003](../../../docs/adr/0003-no-surrogates-discovery-over-creation.md).

Discovery runs **once**, in `jira-init`, and its result is written to the project profile. Every
other skill reads the profile as its first step and does not repeat discovery.

## Where the profile lives

```
.jira/project-profile.md
```

Versioned in the repository, so the whole team shares one answer and changes to it are
reviewable. It is the only local cache this plugin keeps, and it is kept because it is read.

It is deliberately **not** under `docs/`, which this repository treats as scratch.

## What discovery reads

| Subject                                                | Why a skill needs it                                     |
| ------------------------------------------------------ | -------------------------------------------------------- |
| project key and name                                   | every operation is scoped to it                          |
| available work types, and how they nest                | so a skill offers types that exist, at levels that exist |
| statuses, and which transitions connect them           | so `jira-advance` offers only legal moves                |
| fields that are required on creation, per work type    | so a draft is not rejected on write                      |
| boards, and the active sprint of each                  | so `jira-plan` plans against reality                     |
| versions                                               | so `jira-release` knows what already exists              |
| the MCP tool serving each operation in the channel map | so no tool name is hard-coded                            |
| operations with no available tool                      | so degradation is explicit, not a surprise               |

## Profile contract

A profile is valid when it states, at minimum: the project key, the work types with their
hierarchy, the statuses, the resolved operation → tool mapping, and the list of unsupported
operations. Anything else is convenience.

Every entry answers one question: _what can this project actually do?_ Nothing in the profile
describes what the plugin would prefer.

## Reading the profile

Every skill, as its first step:

1. Reads `.jira/project-profile.md`.
2. If it is missing or unreadable, **stops** and tells the user to run `jira-init`. It does not
   guess, does not fall back to defaults, and does not run discovery itself.
3. If the operation it needs is listed as unsupported, it says so before asking the user
   anything, and offers the manual path.

## Staleness

Invalidation is **explicit, never time-based**. A project's configuration changes rarely and a
timestamp check would add a call to every invocation to catch a rare event.

Re-run `jira-init` when: the project scheme changes, a status or transition is added, a board or
version appears that the profile does not list, or a skill reports that something it expected in
the profile is not in Jira.

A skill that hits an inconsistency between the profile and Jira reports it and names `jira-init`
as the remedy. It does not silently repair the profile: a profile edited by a skill nobody
reviewed is exactly the drift the single-writer rule exists to prevent.

## Single writer

Only `jira-init` writes the profile. Every other skill is a reader. This is what keeps the
profile from becoming the write-only mirror that the predecessor of this plugin accumulated.
