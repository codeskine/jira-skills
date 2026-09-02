# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the
codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — the glossary.
- **`docs/adr/`** — read the ADRs that touch the area you are about to work in.

This repo is **single-context**: one `CONTEXT.md` and one `docs/adr/`, both at the root. There
is no `CONTEXT-MAP.md` and no context-scoped ADR directory.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest
creating them upfront. The `/domain-modeling` skill creates them lazily when terms or decisions
actually get resolved.

## File structure

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-hybrid-mcp-and-cli-channel.md
│   ├── 0002-tracker-only-perimeter.md
│   ├── 0003-no-surrogates-discovery-over-creation.md
│   └── 0004-intent-boundaries-shared-mechanics.md
└── skills/
```

## Use the glossary's vocabulary — and respect what it refuses

`CONTEXT.md` here is stricter than a normal glossary: every term carries an explicit `_Avoid_`
list of the words this project has decided **not** to use. Those lists are not stylistic
preferences. They mark vocabulary that was removed because it encoded a wrong model — `issue`
and `ticket` for a **Work item**, `milestone` for a **Sprint** or a **Fix Version**,
`workflow::*` for a **Status**, bare `workflow` for the development process.

So the rule has two halves:

- When your output names a domain concept — an issue title, a skill description, a template
  heading, a test name — use the canonical term.
- When your output uses a term from an `_Avoid_` list, that is a defect, not a nuance. It is
  checkable, and it should be corrected rather than defended.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing
language the project doesn't use (reconsider) or there's a real gap (note it for
`/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently
overriding:

> _Contradicts ADR-0002 (the perimeter is the tracker) — but worth reopening because…_

The four ADRs in this repo are unusually load-bearing: they define the perimeter, the access
channel, the rule against surrogates, and the boundary between skills. A proposal that crosses
one of them is a proposal to change the shape of the plugin, and should say so.
