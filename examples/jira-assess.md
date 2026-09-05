# Worked example — `jira-assess`

What a debt record looks like when it meets the quality standard. Written in English here
because this repository is; a real artifact follows the language of the conversation that
produced it.

The point of this example is that it can lose. It opens by saying what works, so nobody reads it
as a failure; it prices deferral in hours somebody actually counted; and it lists doing nothing
as an option with its cost stated, rather than as the thing the author is arguing against.

---

# Scheduled jobs are configured in three places that must agree by hand

## What works today

Every scheduled job runs, on time, and has done for the last year. Nothing is failing and no
recipient is affected. The cost is paid by the people who change a schedule, not by the people
who depend on one.

## What it costs to defer

A schedule change means editing three separate configurations and keeping them consistent by
reading. Two people can do it confidently.

Over the last six months there were 14 schedule changes. Four of them were wrong on the first
attempt and were caught in review; one reached the shared environment and was found the next
morning, costing about three hours between two people. Time spent on schedule changes averages
40 minutes each, against roughly 5 for the same change in the one place it should live.

## Options

| Option                                            | What it costs                                                   | What it leaves                                            |
| ------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| Do nothing                                        | ~35 minutes per change, ongoing; the same class of error recurs | Two people able to change a schedule; the risk unchanged  |
| Add a consistency check to the review path        | Around a day; no change to how schedules are written            | The three places, but disagreement caught before it ships |
| Move the schedule to one place, generate the rest | Around a week; one migration with a rollback                    | One place to change, and anyone able to change it         |

Recommended: the consistency check first, because it removes the error class at a tenth of the
cost, and it does not foreclose the full change. This is a recommendation; prioritising is not
mine to do.

## Technical impact

Any work that adds a scheduled job inherits the three-place cost, so the toll grows with the
number of jobs rather than staying flat. It also keeps schedule changes with the two people who
know the arrangement, which is a bus factor nobody chose.

## Measurements

- 14 schedule changes in six months, counted from the change history.
- 4 wrong on first attempt, from review comments on those changes; 1 reaching the shared
  environment, from the incident note of 2026-06-11.
- ~40 minutes average per change, from the time between first and final edit on those 14; ~5
  minutes is the equivalent for a single-place edit, measured on three comparable changes.
- Not measured: whether the two people who do this consider it a burden. Nobody has asked them,
  and their answer would change the ranking.

## Required fields not yet filled

- **Team** — this project marks it required on creation, and the scheduling arrangement is not
  owned by a single team. Raised at the draft gate rather than guessed.
