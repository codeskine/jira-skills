# Template — refined item

Section order and shape for a work item enriched by `jira-refine`. The conventions that govern
every template — structure only, no fixed language, no technology, optional sections omitted
rather than left blank — are in [reading a template](../../shared/references/templates.md).

This template **adds to** what the item already holds; it does not replace it. Whatever the item
carried from the intent that created it stays, including the original wording of a request.

One thing does not stay: the statement that the item is **raw and awaiting refinement**, where
intake wrote one. That statement is the declaration that made an incomplete item admissible, and
this intent is what discharges it. Left in place beside acceptance criteria it contradicts them,
and it tells anyone planning the work — and `jira-plan`, which flags what is not ready — that the
item is not ready when it now is.

---

## Acceptance criteria

- [ ] <An observable outcome someone could check. Not a step, not a design decision.>
- [ ] <One per line, each independently checkable.>

## Dependencies

<Each dependency as a **Jira issue link** to the work item concerned — the link, not a URL written
into this text — with one line on what it blocks or is blocked by. A dependency described here and
not linked in Jira is one nobody can follow and nothing can query.>

## Out of scope

<What was considered and deliberately excluded. The boundary is part of what was agreed.>

## Required fields not yet filled

<Fields this project marks required that the item still does not answer, named so the draft gate
can raise them. Omit this section when there are none.>
