# `sel-capture-6` — failed round 1, passed on the second wording

**Fixture:** `sel-capture-6` (`selection`), added on this branch for #77.
**Prompt:** _"A customer emailed: invoicing has been mangling the CSV for a fortnight. They're on
4.9, in the production tenant. Put it on Jira."_
**Expected:** `jira-capture`. **Fired in round 1:** `jira-diagnose`.

## What was under test

ADR-0010 decided that a floor is a threshold on the whole of the material and never a list of
fields to tick. The wording written for it was:

> for a fault relayed second-hand with nothing to reproduce it from — **no steps, no environment,
> nothing that would let someone else see it happen**

The third item was meant to govern the two in front of it.

## What the replay reported

> Diagnose names three absences with no connective. I ruled that any one of them being present
> clears the floor.

It listed the choice as an invented criterion, which is the only reason it is visible: the routing
of the other eleven requests was unaffected, and a run reporting the table alone would have shown
one wrong answer with no explanation attached to it.

So the wording reconstructed the reading the ADR exists to exclude. **A negative enumeration reads
disjunctively** — a reader looking for a reason not to apply an exclusion needs only one listed item
to be present — and a general condition placed last reads as the third item rather than as the test.

## What changed

The list is inverted. It now names what a failing case **carries** rather than what it lacks, so
there is nothing to satisfy item by item, and _at most_ says outright that naming where it ran does
not lift the exclusion:

> for a fault relayed second-hand that carries nothing anyone could act on to see it happen — **a
> symptom, and at most a product or a version, with no steps**

## Worth keeping

This fixture is the reason the defect was caught. It was written to pin a decision that changed no
routing — every other fixture on the floor kept its expectation — so on the usual argument it was
the one that could have been skipped.
