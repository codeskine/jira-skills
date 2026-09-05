# Template — defect report

Section order and shape for a work item created by `jira-diagnose`. The conventions that govern every
template — structure only, no fixed language, no technology, optional sections omitted rather
than left blank — are in [reading a template](../../shared/references/templates.md).

---

# <What is broken, named as the observable failure>

## Steps to reproduce

1. <From a state someone else can reach>
2. <One action per step>
3. <Up to the moment it fails>

## Expected result

<What should have happened at the last step.>

## Actual result

<What happened instead.>

## Evidence

<The error, log line or message, verbatim and unedited, in a fenced block. When nothing was
captured, say that nothing was captured.>

## Where it happened

<Where, what was running, who was acting, and anything about the data that might matter. One
line each, and only the ones that apply — a system without accounts has nothing to say about who
was acting.>

## Impact

<Who is affected and what they cannot do. Not a severity label — the consequence.>

## Frequency

<Every time, or the conditions under which it has been seen. When intermittent, what was
different on the occasions it happened.>

## Required fields not yet filled

<Fields this project marks required on creation that the answers do not cover, named so the
draft gate can raise them. Omit this section when there are none.>

## Work type

<That this is a defect report, filed under a work type that does not name it because this
project's scheme has none. Omit this section when the project has a work type for this
intent.>
