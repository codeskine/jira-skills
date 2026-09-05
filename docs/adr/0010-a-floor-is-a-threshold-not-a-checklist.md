# A floor is a threshold, not a checklist

ADR-0006 settled which intent owns material that arrives second-hand: what decides is whether the
material carries what the intent it is about asks for, and ADR-0008 sharpened the test to point at
**the floor that intent names in its own exclusion**. The rule reads a floor. It never said how a
floor is read, and two of them turned out to admit two readings each.

Both were found by the isolated routing replay run while fixing #51, and both are older than that
change. In each case the replay routed correctly and then reported that it had supplied the
deciding criterion itself — which is the report that matters, because a routing that came out
right by luck reads exactly like one that came out right by design.

## The two unreadable floors

**`jira-diagnose`** excluded "a fault relayed second-hand with nothing to reproduce it from — no
steps, no environment". Take `sel-capture-3`: _"A customer emailed: the invoice export has been
breaking for two weeks and Excel opens the CSV mangled."_ It names Excel.

- Read as a head clause with an illustrative gloss, nothing here lets anyone reproduce the fault,
  the exclusion applies, and it is intake.
- Read as a two-part test in which both halves must fail, Excel is an environment, the exclusion
  does not apply, and it is a defect report.

**`jira-propose`** excluded "relaying someone else's wish with no datum behind it". Two kinds of
number satisfy the word and do different work: a **symptom count** — _"about forty calls last
month"_ — which says the problem is real and nothing about what success would look like, and a
**target** — _"I want it under three"_ — which is a condition that could later be checked. The
skill body asks those as separate questions, so at runtime the gap closes; the description does
not, and the description is what the precedence rule reads.

## The rule: a floor is read against the whole of the material

**A floor fails when the material carries nothing the intent could start from. It is never a list
of fields to tick, and no single named item decides it in either direction.** Where a floor
enumerates, the enumeration is illustration of the threshold and not a definition of it.

Applied to the two:

- **`jira-diagnose`.** What governs is whether the material carries anything anyone could act on
  to see the fault happen. The enumeration stays, because ADR-0006 was right that a test has to be
  decidable from the text of a request — but it is **inverted**. It no longer lists absences; it
  describes the failing state as a whole: _a symptom, and at most a product or a version, with no
  steps_. Why it had to be inverted is recorded below, and it is the one part of this decision a
  replay caught rather than confirmed.
- **`jira-propose`.** Any figure that says the problem is real clears the floor; a target is not
  required. The exclusion says so rather than leaving one word to carry both meanings.

ADR-0006 had already decided this, in the sentence that was never read as governing: relayed
material goes to intake "when there is nothing to work from at all, never because one item of the
four is missing". What survived it was the wording. An enumeration of two fields, glossed onto a
head clause with an em-dash and named in the ADR as "the steps and the environment", left both
readings of that conjunction available, and the prose never chose between them.

## What this dissolves rather than decides

The second question in #77 — whether "environment" has a floor of its own, a bare product name
against a version, a deployment, or who was acting — **stops being a routing question**. Nothing
routes on whether a word qualifies as an environment, because the test is not a checklist and no
single item clears it. The question survives at runtime, inside `jira-diagnose`, which asks for the
environment and can say what it needs; that is a question about what a skill asks, not about which
skill fires. It is left open there deliberately, and it blocks nothing.

This is the same shape as ADR-0006's own finding about answerability: a rule that is good at
runtime, inside a skill that can ask, quietly asks the reader to guess when it is made to choose
the skill.

## The first wording failed, and how

The rule above was first written as a list of absences closing on the general condition — "no steps,
no environment, nothing that would let someone else see it happen" — on the assumption that a
trailing general clause governs the two items in front of it. An isolated routing replay, given only
the ten descriptions and no tools, reported the opposite:

> Diagnose names three absences with no connective. I ruled that any one of them being present
> clears the floor.

That is Reading B, reconstructed out of the wording written to exclude it, and the fixture built for
this decision — the fault relayed with an environment and no steps — failed against it. Which is
what the fixture exists for.

**A negative enumeration reads disjunctively.** A reader looking for a reason not to apply an
exclusion needs only one listed item to be present, and a general condition placed last reads as the
third item rather than as the test. Putting the governing clause at the end does not make it govern.

The wording that holds inverts the list: it names what a failing case **carries** rather than what it
lacks, so there is nothing to satisfy item by item, and _at most_ says outright that naming where it
ran does not lift the exclusion. The lesson is not local to this floor — a negative enumeration
cannot carry a conjunctive test anywhere the reader is looking for an exit.

## Consequences

- **Two descriptions change and no rule is added.** The precedence rule is still stated once, in
  `jira-capture`, and still turns on the floor each intent names. What changes is that two floors
  can now be read only one way.
- **ADR-0006 is amended on exactly one point**: how the conjunction in `jira-diagnose`'s floor is
  read. Everything else it settled stands — the rule stated affirmatively in `jira-capture`, the
  test written on the material rather than on the people, the floor as distinct from a measure of
  completeness. This ADR is that distinction applied twice more, not a retreat from it.
- **`jira-diagnose`'s floor is no cheaper to clear than it was.** Under the conjunctive reading it
  would have been: naming any product would have carried relayed material out of intake, and a
  forwarded sentence with no steps would have been filed as a reproducible defect. The reading
  chosen here is the stricter of the two, and it is the one the existing fixture already asserted.
- **`jira-propose`'s floor is cheaper to clear than a reader might have assumed**, and that is the
  point. Symmetry with `jira-diagnose` demands it: partial material is a proposal whose gaps the
  skill then asks about, exactly as partial material is a defect report whose gaps it asks about.
  A floor set at "a measure of success" would have been a completeness test wearing a floor's name.
- **`evals/evals.json` gains two `selection` fixtures**, in the matched pairs ADR-0006 requires.
  `sel-capture-6` holds provenance and absent steps fixed against `sel-capture-3` and moves only
  the amount of environment named — a version and a tenant instead of a product — and still routes
  to intake, which is what pins the enumeration as illustration. `sel-propose-6` holds the symptom
  count fixed against `sel-capture-4` and moves only whether any figure is present at all.
- **No fixture changes its expectation.** Both floors resolve to what the existing fixtures already
  asserted, which is evidence that the wording had drifted from the intent rather than the reverse.

## Considered alternatives

- **Read `jira-diagnose`'s floor as the conjunctive test.** Defensible on the wording as it stood,
  and it has the merit of being mechanical. Rejected because it turns a floor into a completeness
  test in the one direction ADR-0006 explicitly refused, and because it makes routing turn on
  classifying a word — is "Excel" an environment? — rather than on the state of the material. It
  would also flip `sel-capture-3`, the fixture that exists to pin the deadlocked case ADR-0006 was
  written for.
- **Drop the enumeration and state only "nothing to reproduce it from".** Shortest, and the head
  clause is what governs anyway. Rejected because ADR-0006 named the two fields for a reason: they
  are what a reader can check against the text of a request, and a bare "nothing to reproduce it
  from" asks for a judgement with nothing to anchor it. The enumeration earns its characters as
  long as it cannot be mistaken for the test.
- **Set `jira-propose`'s floor at a measure of success.** It matches the skill's own third question
  and would make the floor sharper to evaluate. Rejected because it breaks the symmetry that makes
  the precedence rule learnable: two intents would then name floors of different kinds, one a
  threshold and one a completeness bar, and a user would have no way to know which they were being
  held to. Relayed material carrying a symptom count and no target is a proposal missing one of
  three answers, and the skill asks for it.
