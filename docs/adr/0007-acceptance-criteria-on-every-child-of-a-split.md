# Every child of a split carries the acceptance criteria it is responsible for

Refinement exists to produce acceptance criteria. When it decides an item is too large, it splits
it, and each child is built from the template of the intent it serves — a defect report, a debt
record, a value proposal, or, where the child is still raw, an intake record. None of those
templates has anywhere to record a condition for calling work finished, so a decomposition could
not carry the one thing the intent exists to produce. An observed run against a real project did
exactly that: two done-conditions stated verbatim by the Product Owner became the two children of
a split and were recorded nowhere, at either level.

**The decision: each child of a split carries the acceptance criteria section of the refined-item
template, whatever intent it serves.** What a team picks up, plans and finishes is the child. A
child nobody can call finished is not a unit of work, and the agreement that says when it is
finished has to travel with it.

**Allocate, never duplicate.** Every criterion stated for the item lands on exactly one child,
and what no child claims stays with the item they came from. A child that claims none has not
been split off — it has been cut, and the answer is to redraw the split, never to invent a
criterion to fill it. Refinement is already forbidden from inventing criteria the user did not
agree to, and an empty child is the most tempting place to break that rule.

**A child that is still raw is the exception**, and it is the plugin's existing one. Built from
the intake template, it declares itself awaiting refinement; a condition for calling it finished
would contradict that declaration. Anything that would have landed on it stays with the parent
until that child is refined in its turn.

## Consequences

- The three intent templates a split can land on are **unchanged**. `jira-refine` supplies the
  section; `jira-diagnose` and `jira-propose` go on asking only what they ask. Making them carry
  acceptance criteria would have them produce an agreement they never sought, and "when is this
  done?" is the question this intent owns.
- The parent keeps only what no child claims. This agrees with the rule that a split updates the
  item the children came from so its own text no longer claims what they now carry.
- An expected result is not an acceptance criterion. A defect report's expected result describes
  what correct behaviour looks like in one reproduction; a criterion is the agreed condition for
  calling the work finished. Where the two coincide, they are written once, as the criterion.
- The gate for this intent names the acceptance criteria of every item in the split, the parent
  included. They are what is being approved.
- `evals/evals.json` gains a `gate` fixture built from the observed failure. The seams that check
  structure cannot reach this: the package check reads frontmatter, and the quality standard
  explicitly disclaims the presence of any particular heading.

## Considered alternatives

- **The parent keeps the criteria and the children inherit by containment.** Nothing changes, and
  the agreement stays at the level where it was made. Rejected because what gets planned and
  picked up is the child: it would be worked, and called done, with no stated condition of its
  own. It also contradicts the requirement that a split produce children that are each complete,
  and the rule that the parent sheds what its children now carry — criteria left behind would
  describe work the parent no longer holds.
- **Add an acceptance criteria section to the three intent templates.** A single place, and no
  skill has to compose two templates. Rejected because those templates serve their own skills
  first: a defect filed directly by `jira-diagnose` would acquire a section for an agreement
  nobody was asked for. Each skill owns its own questions, and this one is not among theirs.
