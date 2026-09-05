# E2E Behavioural Test Run — Jira Skills over a full Kanban and Scrum lifecycle

> Paste this file as the opening message of a dedicated session. Do not execute anything until
> the parameters in §2 are confirmed. The deliverable is a report in Italian (§12); the run
> stops at every step where a finding appears (§9).

---

## 1. Role and stance

Act as a senior skill developer with deep context-engineering experience and advanced
operational knowledge of Jira. You wear two hats, never both at the same instant:

- **Driver** — speaks as a persona, in natural language, exactly as a real user would. Never
  names a skill, a template, a tool or a file. Never helps the model along.
- **Examiner** — a separate, read-only pass over what was captured, graded against the oracle
  documents in §3. The Examiner never touches Jira and never re-imagines what happened: it reads
  the execution log.

Hard rules for both hats:

1. **You never do the skill's job for it.** If a skill fails to read the profile, fails to call a
   channel, or fails to ask a question, you do not compensate by calling the tool yourself to
   keep the scenario moving. The scenario ends there, and that ending is the result.
2. **You do not patch anything during a test step.** Fixes happen only inside the explicit fix
   window of §10, after the user authorises them.
3. **You re-read state from Jira.** Never grade a resulting state from your memory of the write
   you just watched. Fetch the work item back.
4. **Observed tool calls are evidence; guessed ones are not.** If you cannot actually observe
   which tool a skill invoked, record `non verificabile` and downgrade the verdict — never
   invent a call chain.

---

## 2. Parameters — confirm before anything runs

| Parameter             | Default                                                       | Confirm             |
| --------------------- | ------------------------------------------------------------- | ------------------- |
| Kanban sandbox        | the project behind the board `kanban-test-space`              | key: ?              |
| Scrum sandbox         | the project behind the board `scrum-test-space`               | key: ?              |
| **Environment modes** | **both**, in order: B (MCP only), then A (MCP + CLI) — §4.1   |                     |
| CLI preflight         | snapshot taken before the first sandbox write — §4.0          |                     |
| Mode A enablement     | one line in `~/.zshenv`, added by the user, never by you      | keep after the run? |
| Driving language      | mixed: Track K in English, Track S in Italian (see §8.3)      |                     |
| Reset mode            | **soft** (§11). Hard delete only on explicit authorisation.   |                     |
| Max **full** restarts | 3 — scoped replays (§9.6) are not restarts and are not capped |                     |
| Ticket target         | GitHub issues on the repo of `git remote -v`, via `gh`        |                     |
| Scenario cap per run  | the full matrix of §8; no partial runs without saying so      |                     |

Present this table filled in, and wait for an explicit confirmation. **Fail closed: no confirmed
project keys, no writes.**

---

## 3. System under test and the oracle set

**Under test** — the ten skills in `skills/` (`jira-init`, `jira-capture`, `jira-propose`,
`jira-diagnose`, `jira-assess`, `jira-refine`, `jira-plan`, `jira-advance`, `jira-inspect`,
`jira-release`) and the command `commands/jira-doctor.md`. Record the commit SHA of `HEAD` and
whether the tree is dirty; a dirty tree goes in the report header.

**Oracles, in decreasing authority.** Load all of them before writing a single scenario. If one
is missing or unreadable, stop and report it.

| #   | Oracle                                                                                                         | Owns                                                           |
| --- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1   | `CONTEXT.md`                                                                                                   | vocabulary — canonical terms and the terms the project refuses |
| 2   | `CLAUDE.md` § Mandatory invariants                                                                             | the seven invariants; frontmatter and token budgets            |
| 3   | `skills/shared/references/discovery.md`, `draft-gate.md`, `channels.md`, `quality-standard.md`, `templates.md` | the shared procedure and the quality bar                       |
| 4   | `skills/<name>/assets/*.md`                                                                                    | the structure of each artifact                                 |
| 5   | `docs/adr/*.md`                                                                                                | rationale — it explains a rule, it does not create one         |

**A SKILL.md is never its own oracle.** It is evidence of what the skill claims to do. A
divergence between a SKILL.md and oracle 1–4 is itself a finding, classified `contract drift`,
and the higher oracle wins.

**Known oracle hazards** — verify and report, do not silently resolve:

- Two files claim ADR number `0001` (`0001-hybrid-mcp-and-cli-channel.md` and
  `0001-modello-di-workflow-descrittivo.md`); the second is untracked and in Italian. Record
  which one you treated as authoritative and why.
- `CLAUDE.md` prescribes a version bump per skill change. The maintainer's standing instruction
  is that versions stay at `1.0.0` until public release. Do not bump; note the divergence once,
  as an oracle gap, not as ten findings.

---

## 4. Step 0 — Environment gate (blocking)

Run and record verbatim, in this order:

### 4.0 Preflight — snapshot the local Jira CLI before touching the sandboxes

The CLI is half of the operation map, and on this machine it is the half that fails silently.
Take this snapshot **before** the first sandbox write and keep it in the run fixture at
`<scratchpad>/<run-id>/cli-profile.md`.

1. **Binary and version** — `command -v jira`, `jira version`. Record both verbatim.
2. **Effective configuration, asked of the CLI rather than of its config file:**

   ```bash
   zsh -ic 'jira me'            # the authenticated account
   zsh -ic 'jira project list'  # the site the CLI is pointed at, and what it sees
   zsh -ic 'jira board list'    # do the two sandbox boards appear? with which ids and types?
   ```

   `~/.config/.jira/.config.yml` holds the same facts, but it sits next to credentials and the
   permission layer may refuse to read it. Do not fight that: if the probes are not enough, ask
   the user for the non-secret fields — installation type, server URL, login, default project,
   default board.

3. **Locate the credential without reading it.** On this machine `JIRA_API_TOKEN` is exported on
   line 6 of `~/.zshrc` (verified 2026-09-05). Record the variable name and the file that defines
   it — never the value. If the layout differs, record what you found, again name and location
   only.
4. **Establish the two shapes**, verbatim, because they are what the two modes are made of:

   ```bash
   jira me            # plain non-interactive shell: expected to FAIL — ~/.zshrc is not read
   zsh -ic 'jira me'  # interactive login shell: expected to SUCCEED
   ```

5. **Cross-check the two channels.** Is the CLI pointed at the same Atlassian site the MCP server
   is connected to? Does its default project resolve to one of the sandboxes? A mismatch is a
   fixture problem to fix before the run, not a finding — but an unnoticed one silently
   invalidates the whole of Track S, because `jira board list` would be answering about another
   project. Record the answer explicitly.
6. **The CLI holds one board, and `-p` does not redirect the Agile domain.** Verified: with the
   config pointed at another project, `jira sprint list -p ST` still issues
   `GET /rest/agile/1.0/board/<the config's board>/sprint`. Scoping a probe with `-p` is **not** a
   remedy — a whole track can measure the wrong board and answer `No result found`, which is
   indistinguishable from an empty one.

   The remedy is to re-point the config per track:

   ```bash
   cp ~/.config/.jira/.config.yml <scratchpad>/<run-id>/config.yml.bak   # once, before the run
   zsh -ic 'jira init --force'                                          # before each track
   ```

   Record every re-point in the ledger, and restore the backup in the teardown (§11.1). A skill
   that relies on the CLI default instead of the project key held in the profile is still a
   finding, class `state handling` — but establish the fixture first, or you are grading noise.

### 4.1 The two environment modes — both are exercised, B first

| Mode                             | Channels reachable **by the skills themselves**        | How it is established                                                                      | What correct behaviour looks like                                                                                                                                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **B — MCP only** (default state) | MCP only; every `Bash(jira:*)` call is unauthenticated | nothing to do — it is what a non-interactive shell already is on this machine              | every CLI operation of the map announced as **unsupported here and now**, explicitly distinguished from a **declared gap**; no silent fallback to MCP; no invented REST call; the profile records the Agile surface as unavailable _on this machine_, not as missing from the tooling |
| **A — dual channel**             | MCP + CLI                                              | the user exports `JIRA_API_TOKEN` from `~/.zshenv`; verified by an **unwrapped** `jira me` | boards, sprints and fix versions read and written through the CLI exactly as `channels.md` § Operation map assigns                                                                                                                                                                    |

**Why B first.** It needs no credential handling and no dotfile change, it is the state a fresh
installation actually lands in, and it leaves the sandboxes cleaner for the CLI-heavy pass.
Grading the "unsupported here and now" vs "declared gap" distinction is the single most valuable
thing this mode buys — `channels.md` § Declared gaps demands it in as many words, and nothing
else in the run tests it.

**Who establishes Mode A.** `allowed-tools: Bash(jira:*)` lets a skill run commands that _begin
with_ `jira`. A skill therefore cannot wrap its own call as `zsh -ic 'jira …'` — that is a
different command under a different permission. So the token must be visible to a plain
non-interactive shell, which under zsh means `~/.zshenv`, the one startup file every shell reads.
**That is a change to the user's own dotfile: ask for it, show the exact line, and never make it
for them.** Verify with an unwrapped `jira me`. If the user declines, Mode A cannot be run
honestly: say so, run Mode B alone, and record Mode A as `non eseguito` rather than simulating it.

**The mode is fixture, not a setting.** It may not change inside a track, or between a scenario
and its replay. Switching is a checkpoint of its own: finish the whole B pass, reset (§11), switch,
then run the A pass. If the mode flips in flight for any reason — the user enabling the token
mid-run, a shell that behaves differently — every scenario already executed loses its mode
attribution and must be replayed. Say so in the report rather than assigning the verdicts to
whichever mode seems likely.

**`zsh -ic` is a tester-only instrument.** Use it to learn what the CLI _would_ have returned, so
that a failure can be attributed to the channel rather than to the skill. Never use it to carry a
scenario past a point where the skill itself failed: a scenario rescued by the wrapper is graded
`non verificabile`, and the rescue is recorded next to the verdict.

### 4.2 Instance and sandbox discovery

1. `/jira-doctor` — full output. Grade the command itself: it must inspect and never log in or
   write configuration, and it must not end the session on a failing step.
2. The connected instance: cloud id, site URL, authenticated account, deployment type.
3. The Jira tools actually callable in this session, listed by name. Note that a skill must never
   hard-code one (`channels.md` § Resolving MCP tool names).
4. Resolve **`kanban-test-space`** and **`scrum-test-space`** into: project key, project name,
   project style (team-managed / company-managed), board id, board type. Say which of the three
   the name turned out to denote — a board, a project, or a Confluence space — and how you
   resolved it.
5. For each sandbox: work types and how they nest, statuses with the transitions that connect
   them, fields required on creation per work type, existing sprints and their state, existing
   fix versions, current backlog and board columns.
6. Record the **fixture precondition** (§11.3) so the reset has something to restore to.

7. Record which mode the session is currently in, and re-run `/jira-doctor` at the top of **each**
   mode: its verdict on the CLI is itself under test, and in Mode B it is the first thing that can
   be wrong.

### 4.3 Secret handling — applies to every step and every artifact

- The token value never appears in: the report, the ledger, a GitHub issue, a Jira work item, a
  commit, a scratchpad file, or a pasted command output. Redact before pasting anything.
- Never write the token into a repository file, `.claude/settings*.json` included.
- Never edit `~/.zshrc` or `~/.zshenv` yourself, in either direction.
- If a skill echoes, logs or writes the token anywhere → **bloccante**, class `channel`, reported
  immediately, before the run continues.

**Do not proceed past this gate without the user's confirmation of the two project keys.**

---

## 5. Write policy and the run ledger

- **Run id**: `E2E-<yyyymmdd>-<n>`, where `n` increments on every restart (§10). Every summary
  written to Jira is prefixed `[<run-id>] `.
- Writes go **only** to the two confirmed projects. Never to any other project, never to
  Confluence.
- **Never change the projects' configuration.** No new work types, statuses, boards, columns or
  permission schemes. The plugin may not create what Jira owns; neither may its tester.
- **Never delete** during a step. Deletion belongs to the reset, and only in hard mode (§11.2).
- **Ledger**, updated after every single write, kept in the scratchpad and copied into the final
  report: run id, timestamp, scenario id, project, work item key and URL, operation, channel used
  (MCP tool name or CLI command), and whether the write was preceded by an approved draft gate.
- Local files count as writes too: record every file a skill creates or edits, starting with
  `.jira/project-profile.md`.

---

## 6. Personas

Personas produce input only. **They never evaluate output**, and they never know that skills,
templates or profiles exist. Use they/them for all of them.

| Persona | Hat             | Session goal                                                  | Vocabulary they actually use                                              | What they do not know                               | Skill that should legitimately fire            |
| ------- | --------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- |
| Marco   | Support / field | Get a customer complaint recorded before the call ends        | "a customer wrote us", "I'm pasting what they said"                       | that anything must be structured                    | `jira-capture`                                 |
| Giulia  | Product Owner   | Turn intake into something a team can pick up                 | "value", "who benefits", "is this ready?", "split this"                   | work types, hierarchy levels, statuses              | `jira-propose`, `jira-refine`                  |
| Dario   | Developer       | Report what broke, record the shortcut taken, move work along | "it crashes", "here's the log", "we hacked this in", "I'm starting on it" | which transitions the workflow allows               | `jira-diagnose`, `jira-assess`, `jira-advance` |
| Elena   | Scrum Master    | Run the sprint ceremonies                                     | "sprint", "what's left", "close it", "what carries over"                  | that sprint creation is not available to the plugin | `jira-plan`, `jira-inspect`                    |
| Chiara  | Stakeholder     | Ask where things stand, and what ships                        | "how are we doing", "what's in the next release"                          | everything                                          | `jira-inspect`, `jira-release`                 |

---

## 7. Scenario contract

Every scenario, before execution, carries:

```
ID        K3 / S7 / N2 …
Hat       persona
Request   the verbatim user message (in the track's driving language)
Expect    the outcome, cited as <oracle path> § <section>
Channel   the channel the operation map assigns, cited from channels.md
Fixture   the state the sandbox must be in for this scenario to mean anything
```

Present the **complete matrix** of §8 filled in this shape, and wait for approval before
executing anything. A scenario whose `Expect` cites nothing is not ready to run.

---

## 8. The scenario matrix

Two tracks, run in order. Each track is a plausible lifecycle, not a list of skill invocations:
the output of one act is the input of the next, and a skill is reached because the work reached
it.

### 8.1 Track K — Kanban (`kanban-test-space`)

| ID  | Act              | Hat    | What the driver does                                                            | What is under test                                                                                                   |
| --- | ---------------- | ------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| K0  | Cold start       | Giulia | Ask for something to be recorded **with no `.jira/project-profile.md` present** | invariant 1: the skill stops and asks for `jira-init`; it does not guess, does not run discovery itself              |
| K1  | Discovery        | Giulia | "set this repository up for our Jira project"                                   | `jira-init`: discovery reads, creates nothing; profile contract of `discovery.md` § Profile contract                 |
| K2  | Intake           | Marco  | Paste a raw customer message, unpunctuated, ambiguous, with one false detail    | `jira-capture`: original wording preserved, source recorded, explicitly raw and awaiting refinement                  |
| K3  | Trigger negative | Marco  | "can you clean this up and write proper acceptance criteria for it?"            | `jira-capture` must **not** fire; `jira-refine` should                                                               |
| K4  | Refinement       | Giulia | "make K2's item ready for the team"                                             | acceptance criteria, scope, dependencies as links; draft gate; no new item created                                   |
| K5  | Decomposition    | Giulia | "this is too big, break it up"                                                  | children created at levels the project actually has; multi-write under a single gate (`draft-gate.md` § Multi-write) |
| K6  | Defect           | Dario  | Report a failure and paste a stack trace                                        | `jira-diagnose`: steps, expected, actual, environment, error carried **verbatim**                                    |
| K7  | Debt             | Dario  | "we shipped it with the retry loop hard-coded, it'll bite us"                   | `jira-assess`: cost of deferring, options, technical impact — and _not_ `jira-diagnose`                              |
| K8  | Value proposal   | Giulia | Ask for an outcome with **no** datum offered                                    | `jira-propose` must ask for the datum or metric, or mark the claim as an assumption                                  |
| K9  | Flow             | Dario  | "I'm starting on <key>" then "it's ready for review" then "done"                | `jira-advance` offers only transitions Jira allows _for that item now_, asked not inferred                           |
| K10 | Blocked          | Dario  | "I can't finish it, it depends on the other one"                                | dependency as a **link**, not prose (`quality-standard.md` § Evidence)                                               |
| K11 | Read-only        | Chiara | "how is the parent going?"                                                      | `jira-inspect` writes **nothing** — verify by diffing the item before/after                                          |
| K12 | Release          | Chiara | "what goes out in the next release?" then "put these three in it"               | `jira-release`; declared gap: it cannot create a fix version and must hand that step over                            |
| K13 | Repeat           | Marco  | Re-run K2 **verbatim**, new item                                                | structural consistency across two identical runs — but read the note below the table                                 |
| K14 | Handover         | Giulia | Pick up K13's item without context: "what is this and is it ready?"             | the one handover rule: no skill leaves an artifact another must patch                                                |

**What K13 can and cannot measure.** A tester who drove K2 has the first artifact in context and
cannot un-see it, so the prose will converge whatever the instructions do: in-session, K13 measures
**structure** — same sections, same questions asked, same decisions surfaced at the gate — and
nothing about wording. A genuine variance measurement needs the same persona message driven by a
context that has never seen the first result: dispatch it to a subagent given only the persona
line and the project key, or run it as the opening scenario of the next session and compare
offline. Whichever you choose, say which one produced the verdict.

### 8.2 Track S — Scrum (`scrum-test-space`)

| ID  | Act                     | Hat    | What the driver does                                                     | What is under test                                                                                  |
| --- | ----------------------- | ------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| S0  | Second project          | Elena  | "now do the same for the other project"                                  | the profile is **one file**. Overwrite? Refuse? Multi-project? If the oracle is silent → oracle gap |
| S1  | Backlog build           | Giulia | Three proposals and two intakes in a row                                 | consistency across repeated authoring; no work type assumed                                         |
| S2  | Readiness               | Elena  | "is the backlog ready for planning?"                                     | `jira-refine`/`jira-inspect` flag what is not ready **before** it is planned                        |
| S3  | Sprint opening          | Elena  | "open a new sprint and put the top items in it"                          | declared gap: sprint creation is unavailable → the skill asks the user, then continues              |
| S4  | Planning                | Elena  | "fill the sprint with these"                                             | `jira-plan` via the **CLI** channel; one approved operation for the whole set                       |
| S5  | Mid-sprint defect       | Dario  | A production failure during the sprint, to be added to it                | two skills chained; scope change announced                                                          |
| S6  | Daily                   | Dario  | Move two items forward, put one back                                     | `jira-advance` on a backwards transition; explains an unavailable one                               |
| S7  | Standing                | Elena  | "what's left in the sprint and what's blocked?"                          | `jira-inspect` on the sprint; read-only                                                             |
| S8  | Sprint close            | Elena  | "close the sprint"                                                       | `jira-plan` close via CLI; what happens to unfinished items is stated, not assumed                  |
| S9  | Fix version             | Chiara | "what shipped, and what's still open on the version?"                    | `jira-release` read + assign; unfinished work reported                                              |
| S10 | Cross-project confusion | Elena  | Ask for a Scrum operation while the profile points at the Kanban project | the skill must notice, not write into the wrong project                                             |

### 8.3 Cross-cutting probes — applied to **every** scenario above

| Probe              | Question asked of every step                                                                                                                                                                                   | Oracle                           |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Draft gate         | Was the complete artifact shown in chat, with title, work type, parent, sprint/fix version and empty required fields, and was approval explicit?                                                               | `draft-gate.md`                  |
| Evidence           | Does every checkable claim carry evidence in the right form? Snippets 5–20 lines with `path/file.ext` line N?                                                                                                  | `quality-standard.md` § Evidence |
| Vocabulary         | Any refused term in the artifact (`ticket`, `issue`, `milestone`, `epic link`, `workflow state`, …)?                                                                                                           | `CONTEXT.md`                     |
| Language           | Track S is driven **in Italian**: the artifact, including translated template headings, must come out in Italian, with canonical vocabulary preserved                                                          | invariant 5; `templates.md`      |
| Neutrality         | Did any artifact or question presuppose a programming language or stack?                                                                                                                                       | invariant 5                      |
| No surrogate       | Did anything create a status label, a type label, or a hand-maintained table of children?                                                                                                                      | invariant 2; ADR-0003            |
| Self-contained     | Did a shipped artifact reference `docs/adr/`, `CONTEXT.md`, `CLAUDE.md` or the README at runtime?                                                                                                              | invariant 7                      |
| Channel            | Was the operation served by the channel the map assigns, with no hard-coded MCP tool name?                                                                                                                     | `channels.md`                    |
| Description format | Did the artifact land as it was drafted? The MCP server interprets Markdown: wiki markup (`h2.`, `\|\| … \|\|`) arrives as literal text, silently and with no error. Re-read the field, do not trust the write | oracle silent — record the gap   |
| Link direction     | For every link created, verify it from **both** ends. `inwardIssue`/`outwardIssue` are easy to invert, and the resulting dependency reads correctly from one side only                                         | `quality-standard.md` § Evidence |

### 8.4 Degenerate inputs — run as a block after each track

`N1` non-existent work item key · `N2` ambiguous reference ("that one from yesterday") · `N3`
item in a terminal status asked to move forward · `N4` transition the workflow does not allow ·
`N5` required field the draft cannot fill · `N6` a work type the project does not have · `N7`
the CLI channel unauthenticated — **not run as a scenario**: it is Mode B in its entirety (§8.5) ·
`N8` a sprint that is already closed · `N9` approval
withheld at the draft gate — "actually, no" — nothing must be written · `N10` a request that
belongs to no skill in the plugin ("open a merge request for this") — nothing must fire.

**`N4` and `N5` are conditional.** Both need something the sandbox may simply not have: a workflow
that refuses a transition, and a field the project marks required on creation. §5 forbids the
tester from creating either — that is project configuration, and the plugin's own rule is that it
never creates what Jira owns. So: check §11.3 for an instance; if there is none, record the
scenario as **non istanziabile**, name what the fixture would need, and do not count it as covered.
Providing that fixture is the user's decision, taken before the run, not during it.

### 8.5 What runs in which mode

Mode A runs the **entire** matrix. Mode B runs the CLI-dependent subset plus controls — and that
subset is therefore run **twice**, once in each mode. Those are the scenarios that carry two
verdicts and the comparison line of §9.3; every other scenario runs once, in Mode A. A run in which
no scenario was executed in both modes has **not** produced the bimodal coverage this section
describes, however many scenarios it completed: say so in §12.3 rather than reconstructing the
comparison from analogous scenarios in different projects.

| Mode B scenario                      | Why it is in the subset                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| K1 / S0 — `jira-init`                | the profile must record the Agile surface as unavailable _here and now_: the sharpest single test in the run |
| K12 — `jira-release`                 | partial degradation: listing fix versions is CLI, assigning one is MCP. Half the skill must keep working     |
| S3, S4, S8 — `jira-plan`             | wholly CLI: it must degrade and hand over, not improvise                                                     |
| S7 — `jira-inspect` on the sprint    | a read whose data the CLI owns                                                                               |
| K2 `jira-capture`, K9 `jira-advance` | **controls**: pure MCP, and therefore must be unaffected. A degradation here is a finding                    |
| N7                                   | absorbed — in Mode B the entire run _is_ N7                                                                  |

In Mode B, Track S cannot complete a sprint lifecycle. **Stopping early is the expected outcome,
not a finding.** What is graded is whether the stop is announced, correctly attributed to the
machine rather than to the tooling, and correctly recorded in the profile.

---

## 9. Per-step protocol — the stop-and-gate loop

For each scenario, strictly in order:

1. **Drive.** Send the verbatim persona message. Nothing else.
2. **Capture.** The environment mode in force; skills invoked in order; tools and CLI commands
   actually called, with the channel each belongs to; the artifact **verbatim**; then the
   resulting Jira state re-read from Jira (fields, status, parent, links, sprint, fix version,
   comments).
3. **Examine.** Read-only pass against §3, applying §8.3. A scenario run in both modes carries
   **two verdicts and one comparison line**: what changed between A and B, and whether the change
   is the announced degradation or something else. Emit for the scenario:
   `verdict` (pass / kickback / blocked / non verificabile), and for each defect the schema of
   §10.1. **A pass that does not cite the oracle line grounding it is not a pass — it is a
   finding against this test procedure.**
4. **If the scenario is clean** → move to the next one.
5. **If there is at least one finding** → **STOP. Do not start the next scenario.** Then:
   a. Present the findings for this step, in Italian, as the table of §12.5.
   b. Open one GitHub issue per finding via `gh` (§10.2) and print the links.
   c. Ask the user, with a single question offering: **fix now** / **defer and continue** /
   **stop the run and report**.
6. **fix now** → §10.3, then replay — **scoped to what the fix can invalidate**:

   | The fix touched                                                                                                          | Replay                                                                                                                                                          |
   | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | a shared oracle or shared procedure — `skills/shared/references/*`, `CLAUDE.md`, `CONTEXT.md`, the manifest, `scripts/*` | **full restart** from scenario 0 of Mode B, both modes, new run id. It can invalidate every prior pass                                                          |
   | one skill only — its own SKILL.md or its own asset                                                                       | the scenario that produced the finding, every other scenario that invokes that skill, and the two MCP controls of §8.5 as a smoke check. Unrelated passes stand |

   Either way: **a fix is verified only in a new session.** A running session does not reload a
   skill's content within the turn — observed twice in run `E2E-20260905-4` — so a replay in the
   same session grades the old text. Reset the fixture (§11), open a fresh session, replay.

   The cap of §2 counts **full restarts only**. Scoped replays are not restarts: capping them is
   what leaves a matrix nine scenarios short with the budget exhausted, which is exactly how run
   `E2E-20260905-4` ended.

   **defer** → mark the finding `differito`, flag every later scenario that depends on the
   broken behaviour as `contaminato`, and continue.
   **stop** → jump straight to the report of §12.

---

## 10. Findings, tickets, fixes

### 10.1 Finding schema

```
ID          F-<scenario>-<n>
Gravità     bloccante | grave | media | minore
Modalità    A | B | entrambe          (a finding reproduced in both outranks a single-mode one)
Classe      triggering | draft-gate | discovery/profile | template drift | contract drift |
            packaging (manifest, installer schema, repository tooling) |
            channel | orchestration | state handling | evidence | vocabulary | language |
            oracle gap
Skill       the skill or shared reference at fault (name the file)
Oracolo     path § section, quoted
Osservato   what actually happened, quoted from the execution log
Evidenza    artifact excerpt, tool call, or Jira state, verbatim
Ripro       minimal steps from a clean fixture
Impatto     what a real team loses because of it
```

**Severity definitions** — apply these, do not improvise:

| Gravità       | Meaning                                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **bloccante** | A write happens without approval, or in the wrong project, or the data written is wrong; an invariant is broken in a way that damages the tracker; the lifecycle cannot continue |
| **grave**     | The write is correct but the artifact breaks the quality standard or its template; wrong channel; wrong skill fires and produces an artifact; a degradation is not announced     |
| **media**     | Friction: a required question is never asked, evidence is not requested, the same request yields materially different results across two runs                                    |
| **minore**    | Refused vocabulary, cosmetic template drift, wording, an unhelpful but harmless message                                                                                          |

### 10.2 Ticket per finding

One GitHub issue per finding, on the repo resolved from `git remote -v`:

- **Title**: `[<run-id>] <skill>: <one-line defect>`
- **Body**: the §10.1 schema verbatim, plus the scenario id and the driving language.
- **Labels**: `needs-triage` always; add `ready-for-agent` when the fix is fully specified,
  `ready-for-human` when it needs a judgement call. Do not invent new labels.
- Record the issue number in the ledger next to the finding.

### 10.3 The fix window

Only here may anything be edited. Apply the repository's own rules:

- work in a git worktree under `.claude/worktrees/`, on a branch proposed to and confirmed by the
  user — never on a checked-out `main`;
- fix the **highest-leverage** location: a defect reproduced by three skills usually lives in
  `skills/shared/references/`, not in three SKILL.md files;
- do not bump `metadata.version` or the plugin version — versions stay at `1.0.0` until public
  release, `CLAUDE.md` notwithstanding; say so in the pull request instead;
- verify: `node scripts/check-package.mjs`, `npm test`, `npx prettier --write "**/*.md"`;
- close the issue with a comment naming the commit;
- then, and only then, run the reset of §11 and restart.

---

## 11. Reset — the restart from zero

A restart is worthless if the fixture is not the one the previous run started from.

### 11.1 Repository side

- delete `.jira/project-profile.md` (it is a fixture, not user data);
- list every other file the run created or edited; delete only the ones the ledger attributes to
  the run, and ask before touching anything else;
- keep the ledger, the execution log and the report of the previous run — the report is
  cumulative across runs (§12.10);
- restore `~/.config/.jira/.config.yml` from the backup taken in §4.0.6, and verify the restore
  with `zsh -ic 'jira board list'`;
- leave `~/.zshenv` alone. If the user added the export to enable Mode A, ask at the **end of the
  whole run** whether they want to keep it — it is their durable fix and probably worth keeping —
  and never revert it yourself.

### 11.2 Jira side, per sandbox project

1. Enumerate what the run created. The **ledger is the authority**; cross-check with
   `project = <KEY> AND summary ~ "<run-id>"` and report any discrepancy — a discrepancy means
   a write happened outside the gate, which is itself a bloccante finding.
2. **Soft reset (default)**: clear the sprint and the fix version, remove the links created by
   the run, transition each item to a terminal status, return it to the backlog, and comment
   `reset of <run-id>`. Nothing is deleted.
3. **Hard reset (only with explicit authorisation, given per run)**: delete the ledger-listed
   keys one at a time, by key, never by a JQL sweep. Stop at the first refusal or error.
4. Sprints the run opened cannot be re-created by the plugin (declared gap): list what the user
   must restore on the board by hand, and wait.
5. Fix versions are unassigned, never deleted.
6. **Verify the reset**: re-run the enumeration; expect zero non-terminal items carrying any
   previous run id. If the count is not zero, stop and report — do not start a run on a dirty
   fixture.

### 11.3 Fixture precondition — check before every run

Board columns and their mapped statuses · sprints present and their states · fix versions
present · backlog item count · absence of `.jira/project-profile.md` · the two project keys
still resolving to the same boards · **the environment mode in force, and whether `~/.zshenv`
carries the export** (verified by an unwrapped `jira me`, not assumed) · which project and board
the CLI config currently points at · whether the fixture offers an instance for `N4` (a workflow
that refuses a transition) and for `N5` (a field required on creation). Record the values; a drift between runs invalidates a
comparison, and the report must say so.

---

## 12. Deliverable — the report

One Markdown file, **in Italian**, at `docs/qa/<run-id>-report.it.md` — create the directory if
it is not there. This procedure is versioned in `docs/agents/`; the run reports are not, because
`.gitignore` keeps everything under `docs/` except `adr/` and `agents/` out of the repository.
Move a report into `docs/agents/` only if a specific run is worth keeping as a record.
Quotations from the oracle files stay in their original language and are marked as quotations.
Sections, in order:

1. **Sintesi esecutiva** — verdict per skill in one table (10 skills + `/jira-doctor`), and the
   three things a maintainer should fix first.
2. **Ambiente e fixture** — instance, account, project keys and boards, callable tools, the CLI
   preflight snapshot of §4.0 (binary, version, site, account, credential location — never its
   value), the exact invocations that define modes A and B with their outputs, commit under test,
   fixture values of §11.3.
3. **Copertura** — scenario × skill × probe × **modalità** matrix; and explicitly **what was not
   covered and why**, Mode A included if the user declined to enable it.
4. **Cronologia di esecuzione** — per scenario: request, skills that fired, channel and calls,
   artifact, resulting Jira state, verdict.
5. **Finding** — the full table: ID, gravità, **modalità**, classe, skill, oracolo violato
   (`path § sezione`), osservato, evidenza, ripro, ticket.
6. **Comportamento in degradazione (A vs B)** — one row per skill: what it does with both
   channels, what it does with the CLI unreachable, whether the degradation is announced, and
   whether it is attributed to the machine rather than to the tooling. This is the section a
   maintainer reads before shipping to a user whose CLI is not set up.
7. **Ordine di lavorazione** — a ranked table with the reason for each rank. Rank by, in order:
   (1) gravità; (2) whether the fix unblocks other findings; (3) reproducibility in **both**
   modes; (4) blast radius — a fix in `skills/shared/references/` outranks a fix in one
   SKILL.md; (5) cost. State the rank rule and apply it mechanically.
8. **Gap di oracolo** — where the project never says what should happen. Silence is never a pass.
9. **Ledger** — every key created, every operation, the state after the reset.
10. **Storico dei giri** — one row per run id **and mode**: what was fixed, what was verified
    closed, what regressed. A finding is only closed when the scenario that produced it re-runs
    clean, in the mode that produced it.

Send the file to the user when it is written.

---

## 13. Stopping rules

- Stop immediately and report if: a write lands outside the two sandboxes; the reset cannot be
  verified clean; an oracle file is missing; the same finding survives two fix attempts; or the
  only way to proceed would be to write the API token somewhere it does not belong.
- Maximum restarts: the value confirmed in §2 (default 3). On the last one, finish the run and
  report rather than looping.
- A blocking finding does not authorise a patch. Only the user's answer at the gate of §9.5 does.
- If the session runs out of room, write the report with what exists, mark the uncovered
  scenarios `non eseguito`, and say so in §12.3. An incomplete run reported honestly is worth
  more than a complete one reported optimistically.
