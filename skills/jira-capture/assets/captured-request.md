# Template — captured request

Section order and shape for a work item created by `jira-capture`. The words below name the
structure; the artifact itself is written in the language the user is working in, and its
headings are translated with it. Nothing here presumes a technology.

Everything in angle brackets is replaced. A section with nothing to put in it says so
explicitly — an empty heading reads as an oversight, "not stated" reads as a fact.

---

# <What was asked, named as a thing>

> <The request, exactly as it arrived>

## Source

| Field       | Value                                   |
| ----------- | --------------------------------------- |
| From        | <who asked>                             |
| Received    | <when>                                  |
| Route       | <how it arrived>                        |
| Recorded by | <who captured it, if not the requester> |

## What the requester expects

<What they said should happen, in their terms>

## Urgency, as stated

<What the requester said about timing, in their words, or that they said nothing>

## Not yet known

<What the request does not answer and someone will have to ask. One line each. This is the list
refinement starts from.>

## Required fields not yet filled

<Fields this project marks required on creation that the request does not answer, named so the
draft gate can raise them. Omit this section when there are none.>

## Awaiting refinement

<The statement that this item is raw: captured as it arrived, with no acceptance criteria, no
agreed scope and no estimate, and therefore not ready to be planned. Names `jira-refine` as the
intent that owns it next.>
