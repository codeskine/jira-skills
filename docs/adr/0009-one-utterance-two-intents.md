# One utterance can carry two intents, and the gate names the one it does not satisfy

Ten skills are separated by the intent the user expresses. That holds while users express one at
a time, and an isolated routing test showed they do not. _"KAN-12 is too big, and it needs to go
in the current sprint"_ is refinement and then planning. _"How is KAN-4 doing? And if it's ready,
put it in the sprint"_ is a read and then, conditionally, a write.

Each description hands the other half away and neither claims the composite: `jira-refine` says
"not for deciding when the work is tackled (→ `jira-plan`)", `jira-plan` says "not for making an
item ready (→ `jira-refine`)". A skill firing on the first intent had nothing telling it to reach
the second, and the user got half of what they asked for with no sign that the rest had been
dropped.

## Selection is not the seam that gives way

The issue framed the choice as either every description admitting a successor, or something above
the skills decomposing the utterance before they run — and noted that the second has no home in
the current architecture. Neither is needed.

The model that fires `jira-refine` on that sentence has already read the whole sentence, and the
exclusions already name where the other half goes. Nothing is missing from **selection**. What was
missing is an obligation of **continuation**, which takes effect after a skill is running — and
that has a home: `skills/shared/references/`, read by every skill, where the draft gate already
lives.

**The decision: the obligation lives in the draft gate.** The gate's block of decisions gains one
line — the intent the request carried that this artifact does not satisfy, and the skill that owns
it — and the gate gains a section stating order, gates, continuation and the two traps below. The
nine skills that write already link it, so none of their bodies changes. `jira-inspect` stands
outside the gate by construction and carries its own version, in the read-only contract it already
has.

This is not a new invariant. The place where an outstanding intent must be declared **is** the
gate: the user is approving something, and an approval given without knowing that half the request
is not in it is the same defect the gate exists to prevent.

## Two gates, and what the order is

**Order is forced by the material, not chosen.** The intent whose result the other operates on
runs first — a split before the sprint that holds its children, a read before the write it
conditions. Where neither consumes the other, the order the user stated stands. Nothing here needs
a rule beyond saying so.

**Two gates, never one.** The second artifact cannot be assembled before the first is written,
because its subject does not exist yet, and the gate is explicit that what it presents is the
exact content and not an outline. A single gate spanning both would have to present a promise.

Two consequences the descriptions could not have carried:

- **Decomposition changes the subject of the sentence that follows it.** Once KAN-12 has children,
  "put it in the sprint" no longer names one item. Which level a team plans belongs to the project,
  and the profile is what records it, so the successor asks rather than defaulting to the children.
- **A condition the user stated is a condition.** "Plan it if it is ready" is not satisfied by
  planning it. The read decides, and the answer says which way it fell.

## Consequences

- **No description changes.** All ten already name their successors in their exclusions, and this
  is the strongest evidence that the boundary ADR-0004 drew was right: what failed was not where
  the line runs but what happens when a request crosses it twice.
- ADR-0004's consequence — "no skill creates an artifact another skill will have to patch" —
  is unchanged in substance and narrowed in reach. When the second intent was asked for in the
  same breath, what follows is not a patch on a defective artifact; it is the second half of the
  request, performed by the skill that owns it, on an artifact that was complete for its own
  intent. The rule still forbids a skill from shipping a stub for someone else to finish.
- `jira-inspect` still never writes and still never offers a write as a next step. Its stop is
  about what it writes, not about where the request ends: naming what is outstanding and handing
  over is not an offer, because the skill that takes over brings its own gate.
- CLAUDE.md's invariant 3 gains the clause and stays invariant 3. An eighth invariant would have
  claimed this is a separate rule; it is the gate telling the truth about what is being approved.
- `evals/evals.json` gains a `handover` category and an `expect_sequence` field. `expect_skill`
  stays singular and no existing fixture changes. Four cases: the plain composite, the conditional
  read, the split that leaves its successor's subject undetermined, and — the one that keeps the
  others honest — the same request carrying only one intent, which must produce no successor at
  all. Fixtures pinning only the composites would pass against a plugin that announced a handover
  every time.

## Considered alternatives

- **Every description admits a successor.** A clause in each saying what to do when the request
  also asks for the neighbour's intent. Rejected on arithmetic and on redundancy: ten descriptions
  times several successors each, spent at startup on every session, to state something the
  exclusions already say. It would also put a rule about continuation in the one place that is
  read before continuation is possible.
- **A layer above the skills that decomposes the utterance first.** The issue's own second option.
  Rejected because the failure is not in selection — the whole sentence is in view when the first
  skill fires — and because building a component to solve a problem that a shared contract already
  reaches would be the largest change in the plugin for the smallest gap in it.
- **A standalone `handover.md` contract.** A proper name for the concept and one place to read it
  whole. Rejected for what it costs: eleven files instead of two, an eighth invariant, and mutual
  cross-references, since the gate would still be where an outstanding intent gets declared.
- **One gate covering both intents.** Fewer approvals for one sentence, which is a real benefit
  where the second intent is a decision rather than an artifact — a sprint or a fix version. It
  needs a "decision versus artifact" distinction that exists nowhere else in the plugin, and it
  would let one skill's gate approve another skill's write. Revisit if two gates prove to be the
  thing users complain about.
