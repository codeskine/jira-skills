# The channel map says what a channel is, and what it cannot reach

ADR-0001 gave the plugin two channels and made the operation map the single place that assigns
work to them. Writing the bilingual documentation read those sources more closely than anything
had, and four issues came back saying the map does not answer questions a reader arrives with.

- The CLI's perimeter is stated in four documents, in three different ways, and none of them was
  ever checked against the CLI (#55).
- No source says which entries of `allowed-tools` constitute a channel. The rule had to be
  invented for a script, and now lives there and nowhere else (#59).
- The map declares CLI fallbacks for operations whose skills do not declare the CLI, so the
  fallback cannot be reached from the only place that would use it (#56).
- `backlog` is named in the perimeter of three documents, appears in no row of the map, and has no
  entry in the glossary — while being among the most ordinary words a user says (#78), and while
  `jira-plan` promises to "empty" a sprint with nothing mapped and no gap declared (#52).

## What the CLI actually exposes

Checked rather than assumed, on the version this plugin targets:

| Command        | Subcommands                       |
| -------------- | --------------------------------- |
| `jira board`   | `list`                            |
| `jira sprint`  | `add`, `close`, `list`            |
| `jira release` | `list`                            |
| `jira epic`    | `add`, `create`, `list`, `remove` |

There is no `jira backlog` at any level. And the asymmetry is per command rather than general:
`jira epic remove` exists, `jira sprint remove` does not — so "the Agile verbs are additive only"
is a convenient summary and a false one, and the map has to be written against the surface rather
than against a rule of thumb about it.

## Four decisions

**1. The perimeter is what the map assigns, and it is stated once.** Boards, sprints, and the fix
version listing. Not `backlog`, which no command reaches. Not "listings of epics", which
`channels.md` claimed and no skill has ever used. Every other document summarises the map and
says so; `channels.md` is the authority and the summaries are marked as summaries.

**2. A channel is the string in the _Declared as_ column, and nothing else.** A skill reaches a
channel by carrying that exact string in `allowed-tools`; the string is matched, never
interpreted, and `allowed-tools` is static frontmatter that cannot read a file. Everything else a
skill declares — `Read`, `Write`, `Glob`, `Grep`, `AskUserQuestion` — is a capability of the agent
and not a way to Jira. This was already true and already load-bearing; what changes is that it is
written where a reader and a script can both find it, instead of only in the script.

**3. The map carries no cross-channel fallbacks.** An operation has one channel. Where the profile
resolves no tool for an MCP operation, `discovery.md` already governs — say so and offer the manual
path — and reaching for the CLI instead would mean declaring `Bash(jira:*)` on a skill that needs
it for something outside the Agile domain. That widens the perimeter ADR-0001 drew, for a path no
skill has ever taken.

Three notes went, not the two #56 named. `jira issue move` and `jira issue link` were unreachable
from `jira-advance` and `jira-refine`, which declare no CLI; `jira project list` was reachable from
`jira-init`, which declares one, and was never used by it — and is not the Agile domain either.
Removing two of three on a stated principle and keeping the third would have been a defect
introduced knowingly.

**4. The backlog is named, and cannot be reached.** It enters the glossary as a container — where a
work item is when it belongs to no sprint, a position rather than a field — and `jira-plan`'s
description claims it, so that _"take KAN-12 off the sprint and put it back on the backlog"_ routes
to the skill that owns the question. Moving work out of a sprint becomes a **declared gap**: the
CLI has no removal, and whether the MCP server can write the Sprint field is a fact about a
project's own configuration that the plugin cannot assume.

**Naming a thing and reaching it are separate.** The plugin already names four operations it
cannot perform — creating a sprint, starting one, creating a fix version, releasing one — and says
so before the user asks. The backlog is the fifth, and the reason to name it is stronger than for
the other four: those are things a user asks for by describing them, and this is a word they say.

## Consequences

- **ADR-0001 is amended on one point.** Its context says the CLI covers "boards, sprints and
  backlog"; the CLI has no backlog command and never did. The two-channel decision stands
  unchanged — only the sentence describing what the second channel holds was wrong, and it had
  propagated into three other documents.
- **`jira-plan` stops promising "empty" and starts claiming the request.** The description says
  taking work back out of a sprint or onto the backlog, § 3 says the move is the user's, and § 5
  separates naming a destination at close from making the move. The skill is where the sentence
  belongs and is honest about what it does with it.
- **`jira-release` gains the way off a fix version**, which #53 found missing from both the map and
  the skill. It is the same field cleared, so it is an edit, and the only new thing to say is that
  leaving 4.10 for 4.11 and leaving 4.10 for nothing are different decisions.
- **`jira-init` drops `Edit`.** It declared it and no step used it: the profile is overwritten
  whole, which is `Write`. A declared tool nothing uses is a claim about the skill that is not
  true, and decision 2 is what makes that worth fixing rather than tidy.
- **`evals/evals.json` gains three fixtures.** Two `selection` — the backlog placement case paired
  against `sel-propose-2`, where the same words mean create rather than move, and the way off a fix
  version paired against the way on — and one `ordering`, which is the one that matters: a declared
  gap must leave the user holding a decision and one move, not a refusal.
- **The gap table's escape clause covers this without changes.** It already says that if a future
  MCP server exposes a missing operation, the profile records it at discovery and the gap closes
  without touching a skill. So declaring sprint removal a gap costs nothing if the Sprint field
  turns out to be writable: discovery closes it.

## Considered alternatives

- **Leave the backlog unnamed.** The backlog is the absence of a sprint, so arguably there is
  nothing to name, and `jira-plan` could simply drop "empty". Rejected because the routing problem
  is real and independent of the tooling: users say the word, no description claimed it, and a
  replay routed it to the skill that creates items. Dropping the promise fixes the honesty and
  leaves the sentence homeless.
- **Map sprint removal to MCP and let discovery probe the Sprint field.** Architecturally
  attractive — discovery over assumption, which is invariant 1. Rejected because it adds a probe
  for a capability that will be absent on many projects, and the gap table's escape clause already
  delivers the same outcome without one: declare the gap, and let discovery close it if a server
  ever exposes the operation.
- **Give `jira-advance` and `jira-refine` the CLI so the fallbacks work.** Rejected: transitions
  and links are not the Agile domain, and "the Agile domain only" is the sentence the whole
  two-channel design rests on. A fallback that costs the perimeter is not a fallback worth having,
  and neither skill has ever taken the path.
- **Record decision 2 as a rule in `scripts/check-package.mjs` instead.** It would be enforced
  rather than merely stated. Rejected for now because the rule is about meaning — which strings
  reach Jira — and the script can only assert that a declared tool is in the documented vocabulary,
  which it already does. Enforcement without the statement is what produced #59 in the first place.
