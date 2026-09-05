# Bilingual Documentation Build — Jira Skills

> Paste this file as the opening message of a dedicated session. Confirm the parameters in §2
> before writing anything. The deliverable is the file set of §3 plus a short report in Italian
> (§13). This run does **not** produce screenshots: it produces the shot list that lets someone
> else capture them (§11).

---

## 1. Role and stance

Act as a technical writer who has read this repository's conventions and works inside them. You
are documenting a plugin for two audiences at once: a team installing the skills to run their
Jira work, and a contributor extending them.

Hard rules, all five:

1. **You document what the sources say, never what you assume.** Every behaviour in a document
   traces to a `SKILL.md`, a shared reference, an asset or a worked example. Where a source is
   silent or ambiguous, the document says so in the reader's terms and the ambiguity goes in the
   report of §13. You never fill a gap by inventing plausible behaviour.
2. **You do not patch the thing you are documenting.** A skill that reads badly, a template with
   a hole, a contradiction between two references — each is a finding, reported, not fixed.
   Outside `docs/`, this run touches only what §10 names: the two READMEs, two scripts,
   `.gitignore`, `CLAUDE.md`, and the removal of `examples/`.
3. **Documentation points at skills; skills never point at documentation.** `CLAUDE.md`
   invariant 7 makes everything under `skills/` and `commands/` self-contained, because it is
   installed on machines where this repository does not exist. Nothing you write creates a link
   in that direction.
4. **The two languages are peers, not original and translation.** Both are written from the same
   source facts. You never write one by translating the other, and neither carries a note saying
   it is the authoritative one, because neither is.
5. **You never fabricate an image.** No screenshot is described as if it existed, and no
   placeholder is quietly dropped because the text reads fine without it.

---

## 2. Parameters — confirm before anything runs

| Parameter          | Value                                                                    | Confirm |
| ------------------ | ------------------------------------------------------------------------ | ------- |
| Languages          | English and Italian, **peers** — no canonical source, no alignment check |         |
| Naming             | `<name>.md` and `<name>.it.md` side by side, as `docs/qa/` already does  |         |
| Documentation root | `docs/`, with `.gitignore` unblocked for the new paths (§10.5)           |         |
| Units              | 10 skills + the `/jira-doctor` command = **11** document pairs           |         |
| `examples/`        | absorbed into the skill documents, then the directory is **removed**     |         |
| Screenshots        | shot list and placeholders only — no capture happens in this run (§11)   |         |
| Parallelism        | one sub-agent per unit, dispatched after the pilot gate of §7            |         |
| Drift guard        | `scripts/check-docs.mjs` plus generated blocks (§10.4)                   |         |
| Report language    | Italian                                                                  |         |

Present this table filled in and wait for an explicit confirmation. **Fail closed: unconfirmed
parameters, nothing written.**

---

## 3. The inventory — what exists when this is done

```
docs/
  termbase.md                       EN↔IT term table, the constraint every agent obeys
  development-process.md            the shared mechanics and the full path, with diagrams
  development-process.it.md
  skills/
    jira-init.md        jira-init.it.md
    jira-capture.md     jira-capture.it.md
    jira-propose.md     jira-propose.it.md
    jira-diagnose.md    jira-diagnose.it.md
    jira-assess.md      jira-assess.it.md
    jira-refine.md      jira-refine.it.md
    jira-plan.md        jira-plan.it.md
    jira-release.md     jira-release.it.md
    jira-advance.md     jira-advance.it.md
    jira-inspect.md     jira-inspect.it.md
  commands/
    jira-doctor.md      jira-doctor.it.md
  assets/                           screenshots, once someone captures them
README.md                           rewritten as the collector
README.it.md                        new
scripts/check-docs.mjs              new
scripts/generate-readme-table.mjs   extended
.gitignore                          the new documentation paths unblocked
CLAUDE.md                           one section under "Agent skills"
examples/                           removed
```

**The file is not called `workflow`.** `CONTEXT.md` bans the bare word as overloaded and names
the replacement: for the sequence from request to release, say **development process**. The
Italian file keeps that slug — the pair is `<name>.md` / `<name>.it.md` throughout — and takes
its heading from the term the termbase settles in §6.

---

## 4. Oracles

Load all of them before writing anything. If one is missing or unreadable, stop and report it.

| #   | Oracle                          | Owns                                                        |
| --- | ------------------------------- | ----------------------------------------------------------- |
| 1   | `CONTEXT.md`                    | vocabulary — the canonical terms and the terms refused      |
| 2   | `CLAUDE.md`                     | the seven invariants, the frontmatter rules, the boundaries |
| 3   | `skills/shared/references/*.md` | discovery, the draft gate, the channel map, the quality bar |
| 4   | `skills/<name>/SKILL.md`        | what that skill instructs — the primary source for its doc  |
| 5   | `skills/<name>/assets/*.md`     | the structure of each artifact                              |
| 6   | `examples/*.md`                 | five worked examples, to be absorbed and not merely copied  |
| 7   | `docs/adr/0001`–`0005`          | rationale — it explains a rule, it does not create one      |
| 8   | `README.md` as it stands        | the claims already made publicly, which must stay true      |

Unlike the E2E procedure, here a `SKILL.md` **is** an authoritative source: it is the instruction
that ships. But a divergence between a `SKILL.md` and oracle 1, 2 or 3 is still a finding — the
higher oracle wins, the document follows the higher oracle, and the divergence goes in the report.

`CONTEXT.md` closes with the section _Applying the Avoid lists_. Read it before removing any word
from any draft: a refused word is refused **as the name of the concept above it**, and the same
letters are legitimate as a literal command name, as a mention made in order to forbid, and as
ordinary English.

---

## 5. Anatomy of a document — the section contract

Every one of the eleven pairs has the same sections, in this order. The contract is what makes
eleven documents written by eleven agents read as one set.

| #   | Section                          | Content                                                               | Source              |
| --- | -------------------------------- | --------------------------------------------------------------------- | ------------------- |
| 1   | Header block                     | name, version, invocability, channels, required environment           | **generated**       |
| 2   | What it does                     | two or three sentences, in the reader's terms, not the frontmatter's  | prose               |
| 3   | When it fires · when it does not | the intent it owns, and the neighbours it hands over to               | frontmatter `→ See` |
| 4   | How to use it                    | what you say, what it asks you, where the draft gate falls            | prose               |
| 5   | Worked exchange                  | a conversation extract: the user's words, the questions, the approval | new                 |
| 6   | The result                       | the artifact in full, or the report the skill returns                 | `examples/` + new   |
| 7   | What it will not do              | the declared limits, and what to reach for instead                    | SKILL.md            |
| 8   | See also                         | the development process document and the neighbouring skills          | prose               |

Rules that hold for every section:

- **Section 1 is generated and hand-edited never.** It sits between
  `<!-- skill-header:start -->` and `<!-- skill-header:end -->`, written by the generator of
  §10.4 from the skill's own frontmatter. Anything a reader could check against the frontmatter
  belongs there and nowhere else.
- **The shared procedure is not repeated eleven times.** Discovery, the draft gate, the channel
  map and the quality standard belong to `development-process.md`; a skill document states in a
  line what that skill adds to them and links across. This is `CLAUDE.md` invariant 6 —
  _contract inline, procedure shared_ — applied to prose.
- **Section 6 differs by shape, and the contract admits both.** Six units produce a written
  artifact (`init`, `capture`, `propose`, `diagnose`, `assess`, `refine`); five return a report
  or a state change (`plan`, `release`, `advance`, `inspect`, `jira-doctor`). For the first
  group the result is the artifact, complete, as `examples/` already shows it. For the second it
  is the reply as the user reads it in chat, verbatim in a fenced block.
- **The artifact is shown in the document's own language.** The English document shows the
  scenario producing an English artifact; the Italian document shows the _same scenario_
  producing an Italian one. The templates fix structure and never a language — this is
  invariant 5, and showing it costs nothing where describing it convinces no one.
- **Every unit gets a worked exchange, including the five that have no example today.** For
  `init`, `plan`, `release`, `advance`, `inspect` and `jira-doctor` there is nothing in
  `examples/` to absorb: build the scenario from the skill's own procedure, and keep it
  recognisably the same house style as the five that exist.
- **The artifact of section 6 goes inside a fenced ` ````markdown ` block**, never as real
  headings. Real headings would put the artifact's own sections into the document's structure,
  where `check-docs` can no longer tell them from the contract's. The outer fence takes four
  backticks so that a fenced block inside the artifact still closes correctly.
- **The worked exchange is a bold speaker label followed by a blockquote**, not a code block. A
  skill's reply carries tables and emphasis, and they have to render.
- **Template headings are translated; the seven canonical names are not.**
  `skills/shared/references/templates.md` settles it, and `docs/termbase.md` §2b carries the
  agreed table. A heading absent from that table is added to the termbase, not invented locally.
- **Prose wraps at 100 columns.** The repository does, and `prettier` preserves prose wrapping
  rather than reflowing it. Tables and links are left long.

---

## 6. Phase 1 — The termbase (blocking, orchestrator only, no agents yet)

Write `docs/termbase.md`. Nothing else starts until it exists and the operator has seen it.

This file is the reason eleven parallel agents can produce one voice. `CONTEXT.md` is a glossary
of canonical **and refused** terms, and it is entirely in English. Without an agreed Italian
rendering, eleven agents invent eleven translations of _work item_, _fix version_, _draft gate_
and _project profile_, and some of them write `ticket`, which is a banned word.

Contents:

1. **The term table.** One row per `CONTEXT.md` glossary entry, with columns: concept, English
   canonical, Italian canonical, English refused, Italian refused. The Italian refused list is
   yours to build — it is not a translation of the English one, because the words Italian
   speakers reach for instinctively are not the words English speakers reach for.
2. **Terms the documentation needs that `CONTEXT.md` does not carry** — _skill_, _plugin_,
   _command_, _sub-agent_, _shot_, and the name settled for the development process document.
   Mark them as documentation-only, so nobody mistakes them for domain vocabulary.
3. **How the Avoid lists apply in Italian.** Restate the three legitimate roles from the closing
   section of `CONTEXT.md` — a literal name owned by something else, a mention made in order to
   forbid, ordinary language carrying no domain sense — with Italian examples. The test is the
   same single question: does this word stand where the canonical term belongs?
4. **A short note on register.** Both languages are written for a reader who has not installed
   the plugin yet. No second person plural, no marketing voice, no exclamation marks.

`docs/termbase.md` is English-only and has no `.it.md` twin: it is a bilingual artifact by
construction, and a translated copy of it would be a second answer that disagrees with the first.

---

## 7. Phase 2 — Two pilots (blocking gate)

Do not dispatch eleven agents against an unproven contract. Write two documents yourself, in
both languages, and have the operator approve them:

| Pilot           | Why this one                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------- |
| `jira-diagnose` | the typical authoring shape: a persona, an asset, a worked example, MCP only, a stated limit |
| `jira-inspect`  | the other shape entirely: read-only, no asset, no draft gate, its result is a report         |

Four files. Present both pairs and ask a single question: **approve the contract** / **change it
and re-present**. Iterate until approved. Only then does §8 begin, and the two pilots become the
model every agent is handed.

If the contract of §5 has to change to fit either pilot, change §5 in this file first, so that
the agents receive the contract that was actually approved.

---

## 8. Phase 3 — Nine agents in parallel

Dispatch nine sub-agents in a single message so they run concurrently — the eleven units minus
the two pilots. If the harness caps concurrency, wave them in groups of four following the
groupings of `skills.sh.json`, so neighbours land together and their boundary sections agree.

Hand each agent this brief, filled in:

```
Write the documentation pair for <unit> in this repository.

Files, and no others:
  docs/<skills|commands>/<unit>.md
  docs/<skills|commands>/<unit>.it.md

Read first, in this order:
  docs/termbase.md                       — binding; every term comes from here
  docs/agents/documentation.md §1 §4 §5  — stance, oracles, section contract
  docs/skills/jira-diagnose.md + .it.md  — the approved model, authoring shape
  docs/skills/jira-inspect.md + .it.md   — the approved model, report shape
  skills/<unit>/SKILL.md and its assets/ — the primary source for this unit
  skills/shared/references/*.md          — the shared procedure you must link, not restate
  examples/<unit>.md                     — the worked example to absorb, where one exists

Follow the section contract exactly: same sections, same order, same headings as the model,
translated in the Italian file. English and Italian are peers — write both from the sources,
never translate one from the other. Show the artifact in each document's own language.

Do not edit any file outside the two above. Do not link from skills/ or commands/ to docs/.
Do not invent behaviour: where the sources are silent or contradict each other, write what is
verifiable and report the gap.

Return: the two paths, every gap you found in the sources, and every term you needed that the
termbase did not carry.
```

Collect all nine returns before touching anything else.

---

## 9. Phase 4 — Coherence pass (orchestrator)

Read all twenty-two files in one pass and fix what only the whole set reveals:

- **Terminology** against the termbase, in both languages. Terms the agents requested go into
  the termbase first, then get propagated to every document that needed them.
- **Section order and heading wording** identical across all eleven pairs.
- **Boundaries agree in both directions.** Where `jira-capture` says it hands over to
  `jira-refine`, the `jira-refine` document must describe receiving that handover in compatible
  words. Contradictory boundary pairs are the most likely defect of a parallel run.
- **No document restates the shared procedure.** Any paragraph explaining the draft gate,
  discovery or the channel map belongs in the development process document, replaced here by a
  link.
- **The two languages carry the same facts.** Not the same sentences — the same claims, the same
  limits, the same numbers.
- **Every cross-link resolves**, in both directions and in both languages.

---

## 10. Phase 5 — The rest, in this order

### 10.1 `docs/development-process.md` and `.it.md`

It owns everything the skill documents deliberately do not repeat: discovery and the project
profile, the draft gate, the two channels and the declared gaps, the quality standard, and the
whole path from a request arriving to work shipping in a fix version.

Four diagrams, in Mermaid, rendered by GitHub without a library:

| Diagram          | What it must show                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------- |
| The path         | intake → refinement → planning → progress → release, with the skill owning each step     |
| The draft gate   | draft, present, revise, approve, write — and that after the write Jira is the only truth |
| The two channels | which operations go MCP, which go CLI, and what degrades when the CLI is unreachable     |
| Discovery        | the profile read first, what happens when it is missing, why nothing is assumed          |

A fifth diagram only if it shows a mechanism the prose cannot. **A diagram that redraws a
bulleted list is noise**, and this repository has enough tables already.

This is where the screenshots of §11 belong. A flow is worth a picture; a single skill's page
almost never is.

### 10.2 `README.md`, rewritten, and `README.it.md`

The collector, in open-source shape:

1. One-line description, then the paragraph that says the perimeter is the tracker
2. Language switcher — one line at the top of each file pointing at the other
3. What is in this repository — the directory map, briefly annotated
4. Requirements — Claude Code, the MCP server under the id `atlassian`, the `jira` CLI, and
   which half degrades without it
5. Installation, and the first two commands: `/jira-doctor`, then `jira-init`
6. The skill table, **generated**, with a link from each row to its document
7. The development process document, linked prominently — it is the page that explains the whole
8. What this plugin will not do
9. Contributing, and the checks a change must pass
10. License

Keep every claim the current README already makes; this is a restructure, not a revision of
what the plugin promises. `README.md` stays the file GitHub renders.

### 10.3 The removal of `examples/`

Only after every worked example it holds appears, absorbed and rewritten, in a skill document.
Then delete the five files and the directory, and remove any reference to them.

### 10.4 The generator, extended

`scripts/generate-readme-table.mjs` already reads every `SKILL.md` frontmatter and owns the
block between `<!-- skills:start -->` and `<!-- skills:end -->`. Extend it to own **every**
generated block in the documentation:

- the skill table in `README.md`, unchanged
- the skill table in `README.it.md`, with Italian group titles and descriptions
- the header block in each `docs/skills/*.md`, `*.it.md` and the two command documents

The Italian group titles do **not** go in `skills.sh.json`: that file declares an external
`$schema` and extra keys may not validate against it. Put them in a companion file the generator
reads alongside it — `skills.sh.it.json`, same shape, titles and descriptions only — and leave
`skills.sh.json` untouched.

The script's name will then understate what it does. **Raise the rename with the maintainer;
do not rename it in this run** — `README.md` names it in the contributing section and a rename
touches instructions people have already followed.

### 10.5 The machinery, and the files outside `docs/`

`scripts/check-docs.mjs`, new, and separate from `check-package.mjs` — that one is the
pre-publish gate and the documentation is not published (`package.json` `files` does not carry
it). It verifies:

- every directory in `skills/` and every file in `commands/` has both documents
- every document has every section of §5, with the headings spelled as the contract spells them
- every generated block matches what the generator would write
- every relative link resolves
- `--strict` additionally fails while any shot placeholder is still pending

`.gitignore` — today `docs/*` is ignored with exceptions for `adr/` and `agents/`. Add
exceptions for `skills/`, `commands/`, `assets/`, `development-process.md`,
`development-process.it.md` and `termbase.md`. Leave `docs/qa/`, `docs/revisione/` and
`docs/superpowers/` ignored: they are scratch and stay that way.

`CLAUDE.md` — the **Documentation** section under _Agent skills_ already names this file.
Extend it with the documentation tree and the section contract, and add a step to the _Adding a
new skill_ checklist, so that whoever writes a skill knows what documentation it owes and where
that documentation goes.

`README.md` contributing section — add `node scripts/check-docs.mjs` to the commands a change
must pass.

---

## 11. The shot list

This run captures nothing. Screenshots of a Claude Code session are taken by a person at a
keyboard, and screenshots of Jira need an authenticated browser and a presentable sandbox.
Producing the list is the deliverable; producing the images is a separate job.

Write the list into the report of §13 as a table:

| Field     | Content                                                           |
| --------- | ----------------------------------------------------------------- |
| `SHOT-nn` | stable id, referenced by the placeholder in the Markdown          |
| Where     | the file and section the image belongs to                         |
| Source    | Claude Code session, or Jira UI                                   |
| What      | precisely what must be on screen, and at which moment of the flow |
| Caption   | in both languages                                                 |
| Redact    | what must not be in the frame                                     |

Every shot leaves a placeholder in the Markdown that renders as visible, non-broken text:

```markdown
<!-- shot:SHOT-03 pending -->

> **SHOT-03** · screenshot to capture — the draft gate of `jira-diagnose`, with the complete
> artifact shown and the approval question below it.
```

Rules:

- **Sandbox data only.** No customer name, no real person's name, no email address, no URL of a
  production instance, no token, no fragment of a credential. The `Redact` column says what to
  remove for each shot, and the shot is not taken until it is removable.
- **A shot earns its place or it is not listed.** Fewer, better-chosen images beat a gallery.
  Aim for the development process document plus, at most, the two or three skill documents where
  a picture shows something the text cannot.
- **Never replace a pending placeholder with prose** to make the page look finished.

---

## 12. Rules that hold everywhere

1. Documentation links to `skills/` and `commands/`; those two never link back (invariant 7).
2. No file outside §3 is created, edited or deleted. A change that seems necessary elsewhere is a
   finding for §13, not an edit.
3. Format with `npx prettier --write "**/*.md"` at the end of each phase, never mid-phase.
4. No skill version is incremented and the plugin version is not bumped: no shipped artifact
   changes in this run.
5. Mermaid only, no external theme, no diagram library — GitHub renders it natively.
6. Both languages get the same worked scenario. Different scenarios in the two files make the
   pair impossible to review.
7. When a source contradicts another, the oracle order of §4 decides, the document follows it,
   and the contradiction is reported.

---

## 13. Deliverable

The file set of §3, plus a report **in Italian**, in the session and not committed, carrying:

1. **Files written**, grouped by phase.
2. **Gaps found in the skills** — every place a source was silent, ambiguous or self-contradicting,
   with the file and what a reader cannot learn from it. This is the most valuable half of the
   report: documenting a plugin is the closest reading its instructions ever get.
3. **Terms added to the termbase** after the agents ran, and which documents were revisited.
4. **The shot list** of §11, complete.
5. **Decisions left to the maintainer** — the generator rename, and anything else that would
   have meant editing a file outside §3.

---

## 14. Stopping rules

Stop and ask, rather than proceeding:

- An oracle of §4 is missing or unreadable.
- The pilot contract of §7 is rejected twice — the contract itself is wrong and needs a
  conversation, not a third attempt.
- A unit's behaviour cannot be established from its sources at all. Write nothing for it, and
  report it; a document that guesses is worse than a document that is absent, because it will be
  believed.
- Any step would require editing a shipped artifact under `skills/` or `commands/`.
