# Capture takes precedence when nobody present can answer

Four skills receive incoming work. `jira-capture` was defined on **provenance** — the request
arrived from outside and nobody has examined it — and `jira-diagnose`, `jira-propose` and
`jira-assess` on **content**: something is broken, an outcome is sought, something works today
and will cost later. Those are orthogonal axes. A fault reported by email satisfies both fully,
and the descriptions had no way to say which one wins.

The exclusions could not settle it because they were written negatively and pointed at each
other: capture said "not for reporting something broken (→ diagnose)", diagnose said "not for an
unexamined request (→ capture)". A contested case bounced between the two and never terminated.
Exclusions work when a case belongs to a single skill, which is when they are not needed.

**The rule: for material relayed second-hand, what decides is whether it carries what the other
intake intents ask for. When it does not, `jira-capture` takes precedence, however plainly the
material is about a fault or an outcome; when it does, the intent it satisfies takes it, however
plainly it arrived from outside.** It is stated affirmatively, in `jira-capture`'s description —
an exit from the loop rather than a fourth clause feeding it.

This was found by an isolated routing test: an agent was given only the ten `description` fields,
no skill bodies and no repository access, and seven realistic requests. Two deadlocked at low
confidence, both on `jira-capture`. The tiebreak the test eventually reached was practical rather
than declared — `jira-diagnose` asks for steps, expected, actual and environment, and an email
from a customer who is not in the chat answers none of them. The rule above is that tiebreak,
promoted from something a reader has to invent to something the descriptions state.

The test is written on **the material**, not on the people, and that is the second thing the
replay bought. A first draft made capture win when _nobody in the conversation could answer_ what
the other intents ask. That is a fact about the conversation's future — whether someone, once
asked, would know — and the routing decision is taken before anything has been asked. Replaying
the test against that draft, the reader had to invent the missing half, and said so: absence of a
datum is not inability to supply one. **A triggering rule has to be decidable from the text of the
request alone.** A rule about what people could tell you is a good rule at runtime, inside a skill
that can ask; as a rule for choosing the skill, it quietly asks the reader to guess. Writing it on
the material also removed an overreach the same draft carried: relayed material that _does_ carry
the steps and the environment is a defect report, and now routes as one, where the draft would
have filed a reproducible fault as raw intake on the strength of who typed it.

ADR-0004 is not overturned. The boundary is still the intent the user expresses; this settles
which of two intents owns material that fully satisfies both. A different question the same test
raised — one utterance carrying two intents in sequence, to be handed from one skill to the
next — is out of scope here and tracked on its own.

## Consequences

- The rule is stated in full **once**, in `jira-capture`. `jira-diagnose` and `jira-propose` name
  the same test where they used to name a category — "a fault relayed second-hand with nothing to
  reproduce it from" rather than "an unexamined request" — so the test is decidable whichever
  description is read first, and the rule is not copied three times.
- The rule is stated in **both directions**, and the second one is what a replay had to be run to
  find. Written only as _material that does not carry it goes to intake_, it left `jira-capture`'s
  opening trigger — a request arrives from outside the team — standing unconditionally over
  material that arrived complete, and a reader had to invent for itself whether provenance or
  sufficiency wins. It is sufficiency, and saying so is what stops a forwarded report carrying its
  own steps and environment from being filed as raw.
- `jira-diagnose`'s test names what makes a fault reproducible — the steps and the environment —
  and not the whole list of four the skill goes on to ask for. The expected result can be supplied
  by whoever files the report; steps and an environment cannot, and reproducing a fault someone
  else saw is what the skill exists for. It is a **floor**, not a measure of completeness: relayed
  material goes to intake when there is nothing to work from at all, never because one item of the
  four is missing. Partial material is a defect report whose gaps the skill then asks about.
- The test says **second-hand**, not "from outside the team". Whether a boss or an ops lead counts
  as outside is a judgement about an organisation that the request text does not contain; whether
  the person who wants the thing is in the conversation is visible in the words themselves. Only
  the second can be routed on.
- `jira-assess` is untouched. It neither declares nor receives a clause toward `jira-capture`:
  deliberate debt is not a shape in which a third party's request arrives.
- Precedence changes which skill fires, never the quality bar of what it writes. What capture
  produces is still raw and still says so, and the handover to `jira-refine` that ADR-0004 permits
  as the single exception is unchanged.
- `evals/evals.json` is the only seam that can notice if this stops working. Its selection
  fixtures come in **matched pairs** — the same material, once lacking what the rival intent asks
  for and once carrying it — because a fixture that pinned only the deadlocked case would pass
  just as well against a description that had learned to always choose capture. One pair keeps the
  provenance and completes the material instead: a fault relayed second-hand that arrives with
  its steps and its environment is a defect report, and routes as one. A pair has to move one
  variable, not two: flipping provenance and completeness together proves only that something
  routed, never which of the two did it.
- A description may now carry an affirmative precedence clause. It stays the exception: the other
  nine skills are separated by intent alone, and a second precedence rule would be evidence that
  two intents had been drawn on the wrong axis rather than that another rule was needed.

## Considered alternatives

- **State the rule in `jira-capture` only**, as the issue proposed. One description changes and
  the loop formally breaks, since it acquires the asymmetry it lacked. Rejected because
  `jira-diagnose` and `jira-propose` would go on naming a category: a reader who matches their
  description first finds the pointer to capture and no reason to follow it.
- **Restate the rule in all three descriptions.** Whichever one is read first carries the whole
  answer. Rejected because it spends the rule's full wording at startup three times over, in three
  places that drift apart independently — the duplication "contract inline, procedure shared"
  exists to prevent.
- **Redefine `jira-capture` on answerability alone**, demoting provenance from trigger to
  evidence. One axis, and no precedence rule needed at all. Rejected because provenance is not a
  proxy for the contest: it is why capture exists. "Record this email as it came" is capture even
  when the person present could answer every question about it, because the wording is what must
  survive. Answerability decides who wins a tie; it cannot carry the trigger on its own.
