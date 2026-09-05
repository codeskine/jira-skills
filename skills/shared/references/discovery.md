# Discovery and the project profile

No skill assumes how a Jira project is configured. Work types, statuses, transitions, hierarchy
depth, boards and fix versions belong to the project admin, not to this plugin. The plugin reads
them and never re-creates them.

Discovery runs **once**, in `jira-init`, and its result is written to the project profile. Every
other skill reads the profile as its first step and does not repeat discovery.

## Where the profile lives

```
.jira/project-profile.md
```

Versioned in the repository, so the whole team shares one answer and changes to it are
reviewable. It is the only local cache this plugin keeps, and it is kept because it is read.

**One repository, one project.** The profile records a single project, and running discovery
again replaces it rather than adding to it. Work spanning two Jira projects from one repository
is not supported: every skill would act on whichever project was discovered last. Before
replacing a profile, say what goes with it — the previous project's work types, statuses, boards
and fix versions.

## What discovery reads

| Subject                                                | Why a skill needs it                                     |
| ------------------------------------------------------ | -------------------------------------------------------- |
| project key and name                                   | every operation is scoped to it                          |
| available work types, and how they nest                | so a skill offers types that exist, at levels that exist |
| statuses, and which transitions connect them           | so `jira-advance` offers only permitted transitions      |
| fields that are required on creation, per work type    | so a draft is not rejected on write                      |
| boards, and the active sprint of each                  | so `jira-plan` plans against reality                     |
| fix versions, and whether each is released or archived | so `jira-release` knows what exists and what can ship    |
| the MCP tool serving each operation in the channel map | so no tool name is hard-coded                            |
| operations with no available tool                      | so degradation is explicit, not a surprise               |

## Profile contract

A profile is valid when it states, at minimum: the project key, the work types with their
hierarchy, the intents no work type serves, the statuses as far as they can be observed, the
boards, the fix versions with the release state of each, the resolved operation → tool mapping,
and the list of unsupported operations. Anything else is convenience.

**Boards and fix versions are recorded in one of three states, never two.** They are listed, or
the project has none, or they were **not read** because the channel that serves them did not
answer. The third is not the second, and the difference is the whole of it: a skill that reads
_no board_ where the profile means _nobody asked_ sends the user to create one instead of
restoring a channel. Skills branch on that marker, so it is part of the contract and not a note
about how the file is written.

**Statuses are observable only where work already exists.** They are read from the items that
occupy them, so a project holding no work item exposes none — which is the state of every project
on the day it is created, and often the day this plugin is installed. A profile without them is
valid, provided it says they were not observable yet and what will make them so. Nothing is lost
by waiting: an empty project has no item whose status could be asked about, and the skill that
moves an item between statuses never reads that table anyway — it asks Jira for that item, at that
moment, because no table knows the condition that will refuse a transition.

**What makes an operation unsupported is this setup, not the channel map.** The map assigns every
operation to a channel; the profile records whether this installation can actually perform it. An
operation lands in the unsupported list when discovery resolves no tool for it, when the channel
that serves it did not answer, when the account is not permitted, or when the concept is absent
from this project. So **any** operation in the map can be unsupported here, including ones the map
declares no gap for — a gap is a fact about the tooling everywhere, and this list is a fact about
one project on one machine. A skill that depends on an operation says so when the profile lists
it, and owes no argument for why it might be there.

Absences are stated, not inferred. A skill acts on what the profile says; it does not audit a
table for what is missing from it.

Every entry answers one question: _what can this project actually do?_ Nothing in the profile
describes what the plugin would prefer.

## Reading the profile

Every skill, as its first step:

1. Reads `.jira/project-profile.md`.
2. If it is missing or unreadable, **stops** and tells the user to run `jira-init`. It does not
   guess, does not fall back to defaults, and does not run discovery itself.
3. If the operation it needs is listed as unsupported, it says so before asking the user
   anything, and offers the manual path.

## Choosing a work type

Every authoring skill reaches this point and does the same thing with it.

1. **Offer the types the profile reports**, and let the user choose. A type absent from the
   profile does not exist in this project and is never offered, however natural it sounds.
2. **Recommend one where the intent has an obvious home** — a type meant for unrefined intake,
   for instance — and say why you recommend it. A recommendation is not a choice made for the
   user.
3. **Read the fields the profile marks required on creation** for the chosen type. Fill what the
   answers already cover; name what remains so the draft gate can raise it. A required field
   discovered after approval wastes the approval.
4. **Where the profile records no type for this intent at all**, say so at the gate and name the
   type being filed under instead, so the user approves the substitution knowingly. The artifact
   is then the only thing carrying the distinction and must carry it well. Never rename,
   approximate or invent a type to supply it: the scheme is the project admin's.

A skill states which of these carry extra weight for its intent. It does not restate the steps.

## Staleness

Invalidation is **explicit, never time-based**. A project's configuration changes rarely and a
timestamp check would add a call to every invocation to catch a rare event.

Re-run `jira-init` when: the project scheme changes, a status or transition is added, a board or
fix version appears that the profile does not list, or a skill reports that something it expected
in the profile is not in Jira.

A skill that hits an inconsistency between the profile and Jira reports it and names `jira-init`
as the remedy. It does not silently repair the profile: a profile edited by a skill nobody
reviewed is exactly the drift the single-writer rule exists to prevent.

## Single writer

Only `jira-init` writes the profile. Every other skill is a reader. This is what keeps the
profile from becoming the write-only mirror that the predecessor of this plugin accumulated.
