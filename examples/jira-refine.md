# Worked example — `jira-refine`

What refinement adds to an item that arrived raw. Written in English here because this repository
is; a real artifact follows the language of the conversation that produced it.

This is the same request captured in the `jira-capture` example, after refinement. The point is
what survives: the original wording is still there, and the five open questions it listed have
become four answers and one dependency — not a fifth question quietly dropped.

The sections below are appended to the item; nothing already on it is replaced.

---

## Acceptance criteria

- [ ] The monthly figures include, for every period shown, the same period of the previous year.
- [ ] "The same period" means the same month of the financial year, which for this organisation
      starts in April.
- [ ] Where the previous year has no data for a period, the period is shown with the absence
      marked, not omitted and not zero.
- [ ] The recipients of the current monthly figures receive the new form without asking for it.
- [ ] Anyone who currently assembles the comparison by hand can stop doing so.

## Dependencies

- Blocked by PROJ-418 — the previous year's figures for two of the twelve periods were never
  migrated, and the comparison cannot be complete until they are.

## Out of scope

Comparison against any period other than the same period a year earlier. Rolling averages, and
comparison against a plan or a forecast, were both raised and deliberately excluded: they change
what the figures mean, and nobody has asked for that.

Changing who receives the figures.

## Required fields not yet filled

None remain. The **Team** field left open at capture is answered: the finance reporting team owns
this.
