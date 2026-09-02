# Worked example — `jira-capture`

What a captured request looks like when it meets the quality standard. Written in English here
because this repository is; a real artifact follows the language of the conversation that
produced it.

The point of this example is what it **refuses** to do: it does not turn a vague sentence into
requirements, does not guess the deadline behind "soon", and does not hide that half of what
matters is still unknown.

---

# Monthly figures sent to the finance team without the previous year alongside

> Hi — every month we get the figures and every month we have to go and dig out the same months
> from last year to compare. Can that just come with it? It's the comparison we actually look at.
> Would be good to have it before the next close if that's possible.

## Source

| Field       | Value                                |
| ----------- | ------------------------------------ |
| From        | Head of Finance                      |
| Received    | 2026-09-02                           |
| Route       | Email to the service desk            |
| Recorded by | Service Manager, from the desk queue |

## What the requester expects

That the figures they already receive each month arrive with the equivalent period from the
previous year next to them, so that no one has to assemble the comparison by hand. They describe
the comparison, not the figures, as the thing they actually use.

## Urgency, as stated

"Before the next close if that's possible." No date was given, and no consequence of missing it
was stated.

## Not yet known

- Which figures they mean — the request says "the figures" and does not name a report.
- Whether "the equivalent period" means the same calendar month, or the same position in the
  financial year.
- Whether anyone else receives the same figures and would be affected by the change.
- What "the next close" is as a date.
- Whether the previous year's data is available for every period they would expect.

## Required fields not yet filled

- **Team** — this project marks it required on creation, and the request does not say which team
  owns the figures. Raised at the draft gate rather than guessed.

## Awaiting refinement

This work item is raw. It was captured in the words it arrived in and has not been refined: it
has no acceptance criteria, no agreed scope and no estimate, and five open questions are listed
above. It is not ready to be planned. `jira-refine` owns it next.
