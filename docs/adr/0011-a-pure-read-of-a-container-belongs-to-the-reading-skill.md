# A pure read of a container belongs to the reading skill

Two skills act on containers — `jira-plan` on sprints, `jira-release` on fix versions — and one
skill only reads, `jira-inspect`. Each container therefore has a boundary to draw, and until now
the plugin drew them differently.

The sprint half was settled while fixing #35: `jira-plan` gave up the pure read and `jira-inspect`
claimed it positively. The fix-version half was left with both descriptions claiming the same
object in nearly the same words — `jira-release` on "what a Jira fix version contains",
`jira-inspect` on "what a fix version currently contains". The word _currently_ carries no
separating weight, and neither disclaimer covered the disputed case: `jira-inspect` declined
_assigning_, which is a write and not this, and `jira-release` declined reading _progress_, while a
plain "what is in 4.10" is contents.

`jira-release` also contradicted itself outright, claiming the contents question in its trigger and
ceding reading in its disclaimer.

## Three signals, and they did not agree

- **The fixture said `jira-release`.** `sel-release-1`'s own `why` field called it "the genuinely
  ambiguous one" and resolved it by fiat, not by a clause a reader could find.
- **The live run said `jira-inspect`**, and said so _because_ of the clause #35 had held up as the
  model to copy. So the fixture would have failed as written.
- **Two rounds of the isolated routing replay could not decide it.** Both flagged it as the single
  unresolved collision left after #35, and each had to invent a precedence rule to break the tie —
  that fix-version contents are `jira-release`'s home domain, and that a lead trigger clause
  outranks the same content inside another skill's enumeration. Neither rule is written anywhere.

Three signals, three answers, and a repository disagreeing with itself is worse than either
decision would have been.

## The rule, stated once for both axes

**A pure read of a container belongs to `jira-inspect`. A request that reads a container and then
changes it is one operation, and belongs to the skill that owns the change.** The acting skill
gives up the read; the reading skill claims it positively; the compound is named affirmatively on
the acting side, where ADR-0009 already put the obligation to carry a request through.

The fix-version axis now says what the sprint axis says, in the same words. That symmetry is the
substance of the decision, not a tidiness argument: a plugin that answers "who owns a pure read of
a container" differently depending on which container was named has a boundary no user can learn.

## The discriminant that is founded in the sources is the channel

Worth recording, because it is the argument that survives the tie and it is not in the issue that
raised it. Listing **which** fix versions the project has, and whether one has been released or
archived, is `jira release list` — the Agile channel. `jira-release` declares `Bash(jira:*)`; `jira-inspect`
deliberately does not, and its read-only contract says the Agile channel is not declared at all.

So that listing is a fix-version question only `jira-release` can answer, and it stays with it, on
a capability rather than on a boundary. Reporting the contents of a fix version the **user names**
is a search, and both skills can do it — which is exactly why the contested case needed a decision
and could not be read off the channel map.

## Consequences

- **`jira-release` loses two claims, not one.** "What a Jira fix version contains" leaves the
  trigger, and so does "or wants to know what is still unfinished before shipping it", which #65
  identified as the same question asked a second time. What remains is assignment, the listing the
  CLI channel gives it, and the compound.
- **`jira-release` gains the clause already written for `jira-plan`** — a request that reads a fix
  version and then changes it is one operation and belongs here — so the decision costs it no real
  case. Its disclaimer names the read explicitly instead of declining "progress", a word the
  disputed case never used.
- **`jira-inspect` claims both halves positively**: what a fix version holds, and what of it is
  unfinished. Its § 2 already had the shape and keeps it, along with the hand-back for the one
  question it cannot answer.
- **`sel-release-1` is split rather than rewritten.** As written it is a pure read — "what's going
  out in 4.10, and is any of it still open?" reads twice and changes nothing — so it becomes
  `sel-inspect-4` with its expectation corrected, the twin of `sel-inspect-3` on the sprint axis. A
  new `sel-release-1` asserts the compound: a fix version read and then written to in one breath.
- **The three signals now agree**, and the one that was right was the live run. That is worth
  saying plainly: the fixture encoded an intention the descriptions did not carry, and a fixture
  that resolves an ambiguity by fiat will pass in review and fail in use.
- **The boundary is named as an axis, and it took four replay rounds to get there.** The first
  wording set "which fix versions the project has" beside "not for reading what a fix version holds
  without changing it", and a replay routed the catalogue question at low confidence, having
  invented the distinction it needed — _holds_ as the contents of one version, _has_ as the
  catalogue, "a two-word hinge holding up three routings". Each repair moved the problem rather
  than closing it: naming Jira's release states removed the collision with "unfinished" but bound
  the lifecycle claim to a **list**, leaving the release state of one named version claimed by
  nobody; adding the singular claim and its reciprocal disclaimer closed that, and left the pair
  precise only where a user echoes its four nouns.

  What holds is the axis itself, stated on both sides — **what is inside a fix version** against
  **the fix version itself** — with the instances kept underneath it. That is ADR-0006's move
  applied here: name the test on both sides so it is decidable whichever description is read first,
  rather than enumerating the cases. It converted two questions from routable-only-by-synonym to
  routable-by-category and regressed none, which is the whole of what an axis can do: _"adding a
  category name above a list does not add a member to the list."_ Words a user reaches for that sit
  on neither side — "state", "done", "up to" — are still unroutable, and that is filed rather than
  papered over.

- **Nothing changes in either skill's channel or contract.** `jira-inspect` still never writes and
  still declares no Agile channel; `jira-release` still needs the CLI for the listing and not for
  assignment. This is a boundary between intents, which is where ADR-0004 said boundaries go.

## Considered alternatives

- **`jira-release` owns the read.** Defensible, and it is what `sel-release-1` asserted. Rejected
  because it requires reopening #35 so the sprint axis matches, and the two axes must match: the
  alternative leaves the plugin answering the same question differently depending on the container
  named, which is the one outcome neither decision can justify.
- **Leave both claiming it and let the fixture decide.** What the repository did. Rejected on
  evidence: the live run contradicted the fixture, and two replay rounds had to invent a rule to
  get an answer at all. A collision that only a fixture resolves is resolved nowhere the model can
  read.
- **Split on the shape of the question — contents to one, readiness to ship to the other.** It
  reads well and it is the distinction `jira-release`'s § 6 draws internally. Rejected because the
  two are not separable in a user's words: "what's going out in 4.10, and is any of it still open?"
  is one sentence and would have had to route twice.
