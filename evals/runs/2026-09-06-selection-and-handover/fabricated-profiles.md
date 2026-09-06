# The fixtures a fabricated profile unblocks

The survey in `gate-and-ordering.md` left nine fixtures blocked on one unanswered question: whether
a runner may hand-write a profile saying what no `jira-init` would write. The answer is yes, and the
procedure now carries it with its conditions.

**Eight, not nine.** `order-12` needs the profile to say statuses were unobservable **and** Jira to
refuse a transition; `ST`'s Jira Workflow is all-to-all, so the second half cannot be arranged. Half
a setup measures what none does.

## What was run

Each fixture got its own profile, built from the one `jira-init` wrote for `ST` and changed by
between one and four lines. Every mutating tool was **denied**, not merely unlisted. **Nothing
attempted a write.**

| Fixture    | Fabricated                             | Fired                   | Verdict                                         |
| ---------- | -------------------------------------- | ----------------------- | ----------------------------------------------- |
| `gate-6`   | no work type serves the defect intent  | `jira-diagnose`         | **unrun** — the gate is past the questions      |
| `order-2`  | creating a work item unsupported       | `jira-diagnose`         | **FAIL** on re-run — see #106                   |
| `order-3`  | no work type named story               | `jira-propose`          | **unrun** — the assertion is past the questions |
| `order-4`  | the project has no board               | `jira-plan`             | **pass**                                        |
| `order-6`  | boards not read, channel unreachable   | `jira-plan → jira-init` | **partial** — see below                         |
| `order-7`  | fix versions not read                  | `jira-release`          | **pass**                                        |
| `order-9`  | setting a parent unsupported           | `jira-propose`          | **undecidable** — two variables                 |
| `order-13` | no parent-child relation holds a split | `jira-refine`           | **pass**                                        |

## The three that passed

**`order-4`** reported the absence and refused to work around it: _"the project profile already told
us: **this project has no board**. Per the skill, that's a finding to report, not something to work
around — sprint planning has no substitute path here."_ Then the remedy — create a board, re-run
discovery — with no substitute offered.

**`order-7`** assigned the fix version through the MCP server without declaring the operation
unavailable, which is what the fixture is for: listing and assigning travel on different channels,
and an unreadable list does not make an assignment impossible.

**`order-13`** refused the split, left the item whole, and offered exactly the three alternatives
the fixture names, in the order it names them: other work types that could hold it (none), enriching
in place, and a scheme change named as a project admin's. It added a fourth of its own — plain issue
links instead of parent-child — and flagged it as outside the skill's list rather than presenting it
as one.

## Three verdicts the setup cost, not the plugin

**`order-9` moved two variables, and that is my error, not the skill's.** The profile declared
setting a parent unsupported; the project also holds no Epic, so there was no parent to set either
way. The skill named the second reason. Neither a pass nor a fail can be read from that, and the
rule now says so: the project is a variable, and it is the one that gets forgotten.

**`order-13`'s profile was internally inconsistent and the run caught it.** The Hierarchy section
was rewritten to say flat while the work types table still listed `Epic` as a parent. The session
said so and chose the Hierarchy section as ground truth — graceful behaviour covering for a broken
setup, which is exactly what a fabricated profile must not require.

**`order-6` cannot be fully arranged either.** Its profile records the Agile channel as unreachable;
the machine's channel works. The session spotted the contradiction, called the profile stale and
offered to refresh — correct behaviour on a world that does not exist. It still cleared the two
negative assertions the fixture cares about: it did not report the project as having no board, and
it offered no substitute for the sprint.

## Two fixtures could not fire at all, and it is a fixture defect

`order-2` said _"Create a work item for this request."_ and `order-3` said _"Put this on the backlog
as a story."_ Both carry a dangling deictic with no antecedent, and both sessions asked what "this"
referred to. No skill fired.

The suite is run one fixture per **fresh session**, pasted verbatim — so a prompt that presupposes a
previous turn cannot work, by construction. Both now carry a referent. The variable each moves lives
in its `setup`, so supplying a subject changes nothing about what is tested.

`gate-6` is a third of the same family for a different reason: its assertion is about what the
**gate** says, and `jira-diagnose` reaches its gate only after four questions are answered. A single
`-p` turn stops at the first. It joins `gate-4` and `gate-9` as needing more than one turn.

## Re-run with a referent, and one of them fails

**`order-2` fails, and it is filed as #106.** `jira-diagnose` fired, read the profile and said so —
_"I've read the project profile — `Bug` is a dedicated work type in this project (ST)"_ — then asked
four questions. The profile it had just read lists `create a work item` among its unsupported
operations with a manual path, and `discovery.md` requires that to be announced **before asking the
user anything**. It was never mentioned.

That is the same shape as #105: a rule stated in a shared reference and not applied by the skill
that links it. Neither is a routing problem and neither is visible to any automated seam. Both were
found by running a fixture that had never been run.

**`order-3` is unrun after all**, and joins the multi-turn family. Its assertion is about work type —
that a type the project lacks is not silently substituted — and work type is chosen after the
questions. The session routed to `jira-propose` on intent, asked its three questions and stopped, so
the fabricated absence of `Story` was never reached.

Worth noting against `order-2`: `order-1` and `order-4` both show the skills **can** report a
profile fact before asking. `order-4` refused to plan against a boardless project and named the
remedy, first thing. So the ordering rule is not beyond them; it is simply not applied here.

## Where the thirty stand now

|                                                        | Count                                              |
| ------------------------------------------------------ | -------------------------------------------------- |
| run and graded                                         | 17                                                 |
| unrun — needs more than one turn                       | 4 (`gate-4`, `gate-9`, `gate-6`, `order-3`)        |
| unrun — needs Jira in a state the sandbox cannot reach | 4 (`order-10`, `order-11`, `order-12`, `order-16`) |
| unrun — needs a broken environment                     | 2 (`order-5`, `order-15`)                          |
| unrun — entity the project does not hold               | 1 (`gate-5`)                                       |
| decided by the setup rather than the plugin            | 2 (`order-6`, `order-9`)                           |

The largest remaining group is not about profiles at all: **it is about turns and about Jira**. A
harness that could answer a question and approve a gate would close three; a sandbox project with a
sequential Jira Workflow would close two more.
