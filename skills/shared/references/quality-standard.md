# Quality standard

The criteria every artifact this plugin writes must meet. Owned here, in one place. A SKILL.md
states which criteria apply to its intent and links this file; it never restates them.

## Universal criteria

Every artifact, whatever the intent:

1. **The title names the thing, not the activity.** A reader scanning a backlog should know what
   this is without opening it.
2. **The reason is stated.** Why this matters, or what happens if it is not done. An artifact
   that only says _what_ leaves prioritisation to guesswork.
3. **Every verifiable claim carries its evidence.** See below.
4. **Canonical vocabulary.** Say work item, work type, parent, status, transition, sprint, fix
   version — the words Jira itself uses. Tracker-generic synonyms (ticket, issue, milestone,
   epic link, workflow state) encode a different model and are defects, not stylistic choices.
5. **The language is the user's.** Structure comes from the template, language from the
   conversation. Neither is hard-coded. The seven names in criterion 4 are the exception, and
   they are not translated: they name objects Jira owns, and their _values_ are already carried
   across untouched — a work type or a status is recorded exactly as the project reports it,
   whatever language the artifact is written in. An Italian artifact says _il work item_ and _la
   fix version_ for the same reason it says _In Progress_ rather than a translation of it.
6. **No technology stack is assumed.** An example may show code; it must not presume which
   language the project is written in.
7. **Required fields are filled or flagged.** If the project marks a field required for this
   work type and the draft cannot fill it, the draft gate says so rather than letting the write
   fail.
8. **A substituted work type is stated by the artifact.** If the project has no work type for this
   intent and the item is filed under another, the artifact that creates it says which intent it
   serves, rather than leaving the gate as the only place that was said.

## Evidence

A claim that could be checked must come with the means to check it. The form follows the claim:

| Claim                                     | Evidence                                                                     |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| code behaves a certain way                | a fenced snippet of 5–20 lines with an exact `path/file.ext` line N citation |
| something fails                           | the exact error or log line, verbatim, not paraphrased                       |
| something is slow, large, frequent        | the measurement, with how it was obtained                                    |
| users want or struggle with something     | the observation, the request, or the datum behind it                         |
| this depends on other work                | a link to the work item, not a description of it                             |
| this is how the system is meant to behave | a reference to the decision or document that says so                         |

Evidence is required; code is only one of its forms. An artifact with no checkable content is an
opinion, and it should read as one — explicitly marked as an assumption rather than dressed as
a fact.

**Snippets** are 5–20 lines. Shorter loses the context that makes them readable; longer stops
being evidence and becomes a copy of the file.

## Per-intent criteria

Each authoring skill adds its own, and owns them:

| Intent              | Adds                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| capture a request   | the original wording preserved; the source of the request; an explicit statement that this is raw and awaiting refinement                      |
| propose value       | the outcome sought; who benefits; how success is measured                                                                                      |
| report a defect     | steps to reproduce; expected result; actual result; environment; impact and frequency                                                          |
| record debt or risk | what it costs to defer; the options considered; the technical impact                                                                           |
| refine              | acceptance criteria; a scope small enough to be finished; dependencies named as links; the raw declaration retired, where the item carried one |

A skill may tighten these. It may not silently drop one.

## What is not a criterion

Length, tone, formatting flourishes, and the presence of any particular section heading. The
template owns structure. This file owns whether the content is worth writing down.
