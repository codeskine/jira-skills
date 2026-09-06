# The development process

The path from something worth recording to something that shipped, and the four mechanisms every
skill shares along the way. The individual pages describe one intent each; this one describes
what holds between them, so that eleven documents do not each explain the same gate.

If you read one page before installing the plugin, read this one.

---

## The shape of it

```mermaid
flowchart LR
    R(["Something worth recording"])

    R --> CAP["jira-capture<br/>nobody has examined it yet"]
    R --> PRO["jira-propose<br/>an outcome worth having"]
    R --> DIA["jira-diagnose<br/>something is broken"]
    R --> ASS["jira-assess<br/>it works, and it will cost us"]

    CAP --> REF["jira-refine<br/>ready for a team to pick up"]
    PRO --> REF
    DIA --> REF
    ASS --> REF

    REF --> PLN["jira-plan<br/><i>when</i> — the sprint"]
    REF --> REL["jira-release<br/><i>what ships together</i> — the fix version"]

    PLN --> ADV["jira-advance<br/>the next status"]
    REL --> ADV

    INS["jira-inspect<br/>where does it stand?"]
    INS -.->|reads, never writes| REF
    INS -.-> PLN
    INS -.-> ADV
```

Four things enter, one skill makes them ready, two decide _when_ and _what ships_, one moves them,
one reads. `jira-plan` and `jira-release` sit side by side rather than in sequence because a
sprint and a fix version are orthogonal: a work item can belong to both, and answering _when_ has
never answered _what ships together_.

The boundary between skills is **the intent you express**, never the work type that results. Ten
skills can write the same Jira object; what separates them is which question they ask you first.

---

## Nothing is assumed about your project

```mermaid
flowchart TD
    A["Any skill starts"] --> B{"<code>.jira/project-profile.md</code><br/>present?"}
    B -- "no" --> C["Stop. Run <code>jira-init</code>.<br/>No guessing, no defaults,<br/>no discovery on the fly"]
    C --> D["<code>jira-init</code> runs discovery, once"]
    D --> E[("The project profile,<br/>committed to your repository")]
    B -- "yes" --> F["Read it, then ask the first question"]
    E --> F
```

Work types, statuses, transitions, hierarchy depth, boards and fix versions belong to whoever
administers your Jira project. This plugin reads them and never re-creates them.

**Discovery runs once**, in [`jira-init`](skills/jira-init.md), and its result is written to
`.jira/project-profile.md`. Every other skill reads that file as its first step. Commit it: it is
how your whole team, and every future session, learns the same facts without asking Jira again.

What it records, and why each entry earns its place:

| It records                                       | Because otherwise a skill would                          |
| ------------------------------------------------ | -------------------------------------------------------- |
| the project key and name                         | not know what it is scoped to                            |
| the work types, and how they nest                | offer a type that does not exist, at a level that cannot |
| the statuses and the transitions connecting them | infer a move Jira will refuse                            |
| the fields required on creation, per work type   | have a draft rejected after you approved it              |
| the boards, and the active sprint of each        | plan against a sprint that is not there                  |
| the fix versions                                 | invent one                                               |
| which MCP tool serves which operation            | hard-code a tool name that changes between versions      |
| the operations with no tool at all               | fail where it could have announced a limit               |

Three properties of the profile are worth knowing before you meet them:

- **One repository, one project.** Running discovery again replaces the profile rather than
  adding to it. Work spanning two Jira projects from one repository is not supported.
- **Statuses are observable only where work already exists.** They are read from the work item
  that occupy them, so a project holding none exposes none — which is the state of every project
  on the day it is created, and often the day this plugin is installed. A profile without them is
  still valid, provided it says they were not observable yet.
- **Only `jira-init` writes it.** Every other skill is a reader. A skill that finds the profile
  disagreeing with Jira reports it and names `jira-init`; it never repairs the file quietly.

Invalidation is explicit, never time-based. Re-run `jira-init` when the scheme changes, when a
status or transition is added, or when a board or fix version appears that the profile does not
list.

### A name is not a kind

Sprints, fix versions and statuses are all just names, and a name does not say which it is. `2.4`
is as plausible a sprint as a fix version. `To Do` is a status in your project and a board column
in somebody else's. `Backlog` is a placement, and in some schemes also a status.

Nothing about the words you use can settle that, and the plugin does not pretend otherwise. The
skill that fires reads your profile first, and only then does it know what `2.4` is in **your**
project. If one kind matches, it carries on and you never see the question. If two do, it asks
which you meant and says what each would do — it will not resolve the ambiguity toward the kind it
happens to own, which would look like confidence and be a coin toss. If none match, it tells you
what your project does have, because a name that is not there is more often a typo or a stale
profile than something to go and create.

And if you name a container no skill owns — a board, usually — it says so. A board is a filter
over work items; nothing either channel offers takes a work item off one. You get that as a plain
answer rather than the nearest operation that happens to be possible.

### And a word does not always say which question you asked

The same thing one level up. _"Is 4.10 done?"_ asks either whether the version has gone out, or
whether the work in it is finished — two questions, two different skills, and the word "done"
belongs to neither list.

No wording fixes this, and it is worth saying why rather than promising a better description next
time: naming the category a word belongs to does not add the word to it. A description that says it
owns _the fix version itself rather than the work inside it_ is still mute on "done", because a
request fails to route when its words match no member, and nobody can anticipate every synonym.

So you get asked. The skill names both readings and says what each would answer, and it does not
pick the more common one — the two answers belong to different skills, and choosing your own is
guessing with the appearance of knowing. Being asked costs you a line. Being answered the other
question costs you believing something you were never told.

<!-- shot:SHOT-01 pending -->

> **SHOT-01** · screenshot to capture — `jira-init` presenting what it discovered, immediately
> before it writes the profile: the work types with their hierarchy, and the operations it found
> no tool for.

---

## Nothing is written before you have seen it

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Artifact : authoring
    [*] --> Operation : changing what already exists
    Artifact --> Gate : the complete content, in chat
    Operation --> Gate : every item it reaches, named
    Gate --> Gate : change it, and see it again
    Gate --> Refused : no
    Gate --> Write : approve, explicitly
    Refused --> [*] : nothing written, and what now holds is said
    Write --> Jira : one write, through the mapped channel
    Jira --> [*] : the key and the URL
```

This is the **draft gate**, and it is one gate across every skill that writes. What reaches it
takes one of two shapes, decided by what the write produces rather than by which skill is running.

**When something is authored** — a request captured, a proposal, a defect report, a debt record,
the children of a split — you get the exact content that will be written, not a summary and not an
outline, in the language you are working in. With it come the decisions it carries: the title, the
work type, the parent if any, the sprint and the fix version if any, anything your project marks
required that the draft left empty, and — where your scheme has no work type for the intent —
which type it is being filed under instead.

**When something already existing is changed** — a sprint filled or closed, work assigned to a fix
version or taken off one, a work item moved to its next status — there is no document to show you,
so you get the change itself: every item it reaches, named, with what changes about each, what
will be true of them afterwards, and what the operation will **not** do where you could reasonably
expect it to. That last one is the point of the shape. Closing a sprint cannot place the work left
unfinished in it, and being told that at the gate is the difference between approving an outcome
and discovering it.

Either shape names one more thing when it applies: **the intent your request carried that this
write does not satisfy, and the skill that owns it.** One sentence can ask for two things, and an
approval given without that is an approval of half a request. The section after next says what
happens to the other half.

Then you approve, or you ask for changes and see it again — as many times as you want — or you say
no. Saying no is an answer and gets treated as one: nothing is written, you are told what now holds
instead, and you are not shown a smaller version of the same thing in the hope that one passes.
Where what you refused is something other skills rely on, they are named. Refusing the project
profile is the case that matters, because every other skill stops at its first step without it.

- **Approval is explicit.** Not silence, not an unrelated message, and not your original request:
  the request is what produced the draft, not what approves it.
- **And it cannot be waived in advance.** _"Just create it"_, _"don't show me anything first"_,
  _"go ahead"_ say something about impatience and nothing about approval, because what they would
  approve does not exist yet. You get the draft anyway, kept short, with that as the reason. A
  write you did not see is a write you did not approve, whatever you asked for beforehand.
- **Some skills write several things under one approval** — a decomposition creating children, a
  set of work item moved into a sprint. The gate stays single: all of it is presented, approved
  once, then executed. If part of it fails you are told which parts succeeded, and you decide
  whether the partial result is kept.
- **In full means in full.** Every section the template defines and does not mark optional is
  there. A section that cannot be filled is raised at the gate as a gap, never quietly dropped —
  optionality is declared in the template, never inferred from silence.
- **After the write, Jira is the truth.** No local copy of what was published is kept, anywhere.

<!-- shot:SHOT-02 pending -->

> **SHOT-02** · screenshot to capture — a complete draft at the gate in a Claude Code session:
> the artifact, the block of decisions beneath it, and the approval question.

---

## When one request carries two intents

_"It is too large, and it needs to go in the current sprint."_ _"How is it doing, and plan it if
it is ready."_ Both halves are real, both have to happen, and the skill that fired owns one of
them. What follows:

- **The other half is named at the gate**, in the block of decisions. An approval given without it
  is an approval of half a request you believed you made whole.
- **Order is not a preference.** The intent whose result the other operates on runs first — a
  split before the sprint that will hold its children, a read before the write it conditions.
  Where neither consumes the other, the order you stated stands.
- **Two gates, never one.** The second thing cannot be assembled before the first is written,
  because its subject does not exist yet. Approving the first approves nothing of the second.
- **The write is not the end of the request.** Reporting the key ends the write; the skill then
  hands over to whichever owns what is outstanding, and says that is what it is doing.
- **You are asked when the first half changed the subject of the second.** After a split, _"put it
  in the sprint"_ no longer names one item, and which level a team plans belongs to your project.
  The question comes to you rather than being settled by default.
- **A condition you stated is a condition.** _"Plan it if it is ready"_ is not satisfied by
  planning it.
- **Reading one container and changing another is two intents, not one.** Two skills carry an
  exception for reading and changing **the same** container — a sprint, or a fix version. It says
  _that same_, and it means it. _"What is in 4.10 so far? Anything not started, take it out of the
  current sprint"_ reads a fix version and changes a sprint, so the exception does not apply: you
  get the read answered first, the change named at the gate, and a separate approval from the
  skill that owns the container being changed. Swap the containers and it is the same request
  taking the same path.

---

## Two channels, and what happens when one is dark

```mermaid
flowchart TB
    S["A skill"] --> M["<b>Atlassian MCP server</b><br/>work item · fields · comments<br/>transitions · search · project metadata"]
    S --> C["<b>Jira CLI</b><br/>boards · sprints · the fix version listing"]
    M --> J[("Jira Cloud")]
    C --> J

    G["<b>Available on neither channel</b><br/>create a sprint · start a sprint<br/>create a fix version · release or archive one<br/>move a work item back out of a sprint"]
    G -. "handed back to you, never simulated" .-> S
```

A skill does not choose its channel: it looks the operation up in a map declared once and shared.
Two channels rather than one because neither covers the whole domain — the MCP server does not
expose the Agile surface, and the CLI is not the channel an agent speaks natively.

**The server id is fixed by convention: `atlassian`.** It appears in static frontmatter that
cannot read a file, so a server reachable under any other name serves no skill here however
healthy it looks. An Atlassian connector added through claude.ai settings is exactly such a name.
[`/jira-doctor`](commands/jira-doctor.md) checks this and prints the remedy.

**Five operations exist on neither channel** and are handed back to you rather than simulated:
creating a sprint, starting one, creating a fix version, releasing or archiving one, and moving a
work item back out of a sprint. The skills say so before you ask, and they name the destination
they cannot reach — the next sprint, or the backlog — so you can make the move on the board
yourself. These are gaps in the tooling and they hold everywhere.

**A channel that is merely unreachable on your machine is a different thing** — it is a
degradation, it returns when the channel does, and it says nothing about your project. Without an
authenticated `jira` CLI, [`jira-plan`](skills/jira-plan.md) and the fix version listing of
[`jira-release`](skills/jira-release.md) are unavailable; everything else works. And the CLI goes
dark for two distinct reasons that take two distinct remedies — a credential the non-interactive
shell cannot see, or a configuration that was never generated. Naming the wrong one sends you
against a wall, so [`/jira-doctor`](commands/jira-doctor.md) tells them apart before prescribing.

---

## What "good" means

Every artifact these skills write meets the same bar, whatever the intent:

1. **The title names the thing, not the activity.** Someone scanning a backlog should know what
   it is without opening it.
2. **The reason is stated** — why it matters, or what happens if it is not done.
3. **Every verifiable claim carries its evidence**, in the form that fits the claim.
4. **Canonical vocabulary** — work item, work type, parent, status, transition, sprint, fix
   version. Tracker-generic synonyms encode a different model and are defects, not style.
5. **The language is yours.** Structure comes from the template, language from the conversation.
   Neither is hard-coded — the seven names above are the exception, and they are not translated.
6. **No technology stack is assumed.**
7. **Required fields are filled or flagged** at the gate, rather than letting the write fail.
8. **A substituted work type is stated by the artifact**, not only at the gate.

Evidence is required, and code is only one of its forms:

| The claim                             | The evidence                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| code behaves a certain way            | a fenced snippet of 5–20 lines, with an exact `path/file.ext` line N citation |
| something fails                       | the exact error or log line, verbatim, not paraphrased                        |
| something is slow, large or frequent  | the measurement, and how it was obtained                                      |
| users want or struggle with something | the observation, the request, or the datum behind it                          |
| this depends on other work            | a link to the work item, not a description of it                              |
| this is how it is meant to behave     | a reference to the decision or document that says so                          |

An artifact with no checkable content is an opinion, and it reads as one — marked as an
assumption rather than dressed as a fact.

---

## Nothing is invented that Jira already owns

No status labels, no type labels, no hand-maintained table of children, no local mirror of what
was published. Where Jira has the concept, the skills discover it and guide you to it; where Jira
does not, they say so and stop.

The hierarchy is the clearest case. A parent and its children are queryable on Jira, so no skill
writes a list of children into a description: a list maintained by hand is a second answer that
will eventually disagree with the first.

![The work item as Jira shows it: the work type, the parent and the sprint are Jira's own fields, and the plugin invented none of them.](assets/shot-03-work-item.png)

![A parent and its children in Jira's own hierarchy view, after a decomposition: nothing maintains that list by hand.](assets/shot-04-hierarchy.png)

---

## The whole path, skill by skill

| Phase      | Skill                                      | You get                                              |
| ---------- | ------------------------------------------ | ---------------------------------------------------- |
| Setup      | [`jira-init`](skills/jira-init.md)         | the project profile, discovered once and committed   |
| Setup      | [`/jira-doctor`](commands/jira-doctor.md)  | three independent checks, each with its own remedy   |
| Intake     | [`jira-capture`](skills/jira-capture.md)   | a request recorded in the words it arrived in        |
| Intake     | [`jira-propose`](skills/jira-propose.md)   | an outcome, with the datum that makes it arguable    |
| Intake     | [`jira-diagnose`](skills/jira-diagnose.md) | a defect someone else can reproduce                  |
| Intake     | [`jira-assess`](skills/jira-assess.md)     | debt or risk, with what deferring it costs           |
| Refinement | [`jira-refine`](skills/jira-refine.md)     | acceptance criteria, a finishable scope, or children |
| Planning   | [`jira-plan`](skills/jira-plan.md)         | a sprint filled or closed, and what leaves one named |
| Planning   | [`jira-release`](skills/jira-release.md)   | a fix version's contents, and what is unfinished     |
| Progress   | [`jira-advance`](skills/jira-advance.md)   | the transitions Jira allows right now, and no others |
| Progress   | [`jira-inspect`](skills/jira-inspect.md)   | an answer, and never a change                        |

Only `jira-capture` is allowed to produce something incomplete, and it declares it: what it
writes is explicitly raw and awaiting refinement. Every other skill is bound by one handover
rule — **no skill creates an artifact another skill will have to patch.**
