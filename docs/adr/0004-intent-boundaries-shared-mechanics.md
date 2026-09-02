# Skills are separated by user intent, and share one implementation of the mechanics

Ten skills in this plugin can create or modify the same Jira work item. They are kept apart by
the **intent the user expresses** — reporting something broken, proposing value, recording
technical debt, enriching what already exists — never by the work type that results. Each
skill owns its questions, its template and its quality criteria. The mechanics they all share
— discovery, draft gate, write, outcome — live once in `skills/shared/references/` and are
never copied into a skill.

The predecessor failed on exactly this axis: two skills owned work item creation with
different quality standards, one of them producing minimal items and explicitly deferring
enrichment to a skill that had no update capability. The result was a broken handover and two
sources of truth for the same artifact.

## Consequences

- **No skill creates an artifact another skill will have to patch.** `jira-refine` owns
  decomposition and its children are born well-formed, using the template of the recognised
  intent.
- `jira-capture` is the single, declared exception: what it writes is explicitly raw and
  awaiting refinement, and it says so in the artifact.
- Descriptions must carry `→ See` cross-references wherever two skills share trigger phrases.
  With ten skills, mis-triggering is the main risk and the descriptions are the only defence.
- A SKILL.md states the contract in three or four lines and links the procedure. Inlining the
  full procedure would restore the duplication this decision exists to prevent; linking without
  stating the contract would let the draft gate be skipped whenever the model does not open
  the reference.
