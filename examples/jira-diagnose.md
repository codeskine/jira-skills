# Worked example — `jira-diagnose`

What a defect report looks like when it meets the quality standard. Written in English here
because this repository is; a real artifact follows the language of the conversation that
produced it.

The point of this example is that someone who was not there can reproduce it: the steps start
from a state anyone can reach, the log is verbatim rather than remembered, and the absence of any
error is stated as the finding it is. It also omits the optional section it has nothing to put
in, as the template says to.

---

# Scheduled export produces an empty file when the range crosses a month boundary

## Steps to reproduce

1. Open the export screen as a user with the standard reporting role.
2. Set the range to start on the 28th of one month and end on the 3rd of the next.
3. Choose the delimited format and start the export.
4. Wait for the notification and open the file it points to.

## Expected result

A file containing the rows for the six days in the range, as the preview on step 3 announces.

## Actual result

The export completes and reports success. The file contains the header row and nothing else.
The preview on step 3 had announced 1,184 rows.

## Evidence

```
export.worker  range resolved: 2026-08-28 .. 2026-09-03
export.worker  partition selector matched 0 partitions for range
export.worker  wrote 0 rows in 41ms — status: completed
```

No error was raised anywhere: the run is recorded as successful, which is why nobody noticed
until a recipient asked where the figures were.

## Where it happened

- The shared environment, and reproduced in the pre-release one.
- Both were running 4.9.2.
- Reproduced under the standard reporting role and again with full permissions, so it is not a
  permissions difference.
- Any range crossing a month boundary. Ranges inside a single month are unaffected.

## Impact

Anyone exporting a range that crosses a month boundary receives an empty file and is told the
export succeeded. Two teams schedule these exports monthly; both have been receiving empty files
and one of them has been filling the gap by hand.

## Frequency

Every time, when the range crosses a month boundary. Never, when it does not. Reproduced eleven
times out of eleven attempts across two environments.
