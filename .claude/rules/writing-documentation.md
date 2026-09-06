---
paths:
  [
    "docs/skills/*.md",
    "docs/commands/*.md",
    "docs/development-process*.md",
    "docs/termbase.md",
    "README.md",
    "README.it.md",
  ]
---

# Writing documentation in this repository

These files are read by someone who has not installed the plugin and does not yet know how this
project uses Jira's vocabulary. They arrive at the README and leave through a link.

Not covered here: `docs/adr/` argues a decision to a contributor, and `docs/agents/` is a
procedure for an agent. Both are English-only and neither follows what is below.

## The reader

Answer, in this order: what it is, what problem it solves, how to try it, how it works, and only
then how it is built. A page that opens with a mechanism has answered a question nobody asked yet.

Say what the thing refuses to do. Half of what makes this plugin predictable is what it declines —
an operation on neither channel, a work type it will not invent, a write it will not perform
unasked — and a reader who learns that late feels misled rather than informed.

## The two languages

English and Italian are **peers**. Neither is canonical, nothing checks one against the other, and
neither is written by translating the other: both are written from the sources.

`docs/termbase.md` binds, and settles the part that is not a matter of taste:

- The seven Jira object names stay English in both languages — _il work item_, _la fix version_,
  _lo status_ — for the reason `quality-standard.md` criterion 5 gives.
- Template headings **are** translated, except where the heading is one of those seven.
- A term the termbase does not carry is added to the termbase, never chosen locally. Eleven
  authors choosing independently is how one concept acquires four Italian names.

The pair shows the **same scenario**, and each document shows the artifact in its own language.
That is not a nicety: it is what demonstrates that templates fix structure and never a language.

## The section contract

Every page under `docs/skills/` and `docs/commands/` carries the same eight sections, in the same
order, with the headings spelled as `CLAUDE.md` § Documentation spells them. `check-docs.mjs`
fails otherwise.

Discovery, the draft gate, the channel map and the quality standard belong to
`docs/development-process.md`. A page states in a line what its own intent adds and links across.
Never restate a shared procedure — that is invariant 6 applied to prose, and eleven copies of the
draft gate is eleven things to update.

Documentation links to `skills/` and `commands/`. **They never link back**: they ship to machines
where `docs/` does not exist.

## What is generated

The header block of every page, between `<!-- skill-header:start -->` and `<!-- skill-header:end -->`,
and the skill table of both READMEs, between `<!-- skills:start -->` and `<!-- skills:end -->`.

`scripts/generate-readme-table.mjs` owns them. Editing one by hand is reverted by the next run and
rejected by `--check`. If a generated block says something wrong, the frontmatter it reads is
wrong, or the generator is.

## Diagrams

Mermaid, which GitHub renders natively — never a diagram library. Draw a **mechanism**: a state
that loops, two channels one of which can go dark, a decision with a real fork. A diagram that
redraws a bulleted list is noise, and this repository already has enough tables.

They belong in `docs/development-process.md`. A single skill's page almost never earns one.

No diagram presumes a technology. The perimeter is the tracker: there is no service tier and no
database here, and an example that invents one teaches a reader something false about the project.

## Accuracy

Every statement traces to a `SKILL.md`, a shared reference or an asset. Where a source is silent,
ambiguous or contradicts another, write the verifiable half, say plainly what is not established,
and open an issue — never fill the gap with something plausible. Documentation is the closest
reading a skill's instructions get, and what it finds is worth more than what it invents.

A screenshot that does not exist stays a placeholder, `<!-- shot:SHOT-nn pending -->` with the
visible line beneath it. `check-docs.mjs --strict` fails while one remains. Never replace one with
prose to make the page look finished.

## Formatting

- Prose wraps at 100 columns. Prettier preserves prose wrapping; it will not do this for you.
- An artifact goes inside a fenced `markdown` block, never as real headings — real ones would
  enter the page's own structure. The outer fence is longer than any fence inside it.
- A worked exchange is a bold speaker label and a blockquote, not a code block: a reply carries
  tables and emphasis, and they have to render.
- Inline code for a path, a command, a field or a tool name. A link says what it leads to.

## What this documentation does not sound like

No "in this section we will explore". No sentence about the documentation itself. No feature list
padded to look complete, no superlative, no closing summary that repeats the page. No heading
created to give a page more structure — a heading introduces a concept or it goes.

If a paragraph can lose words without losing information, it keeps the shorter version.

## Before finishing

```bash
node scripts/generate-readme-table.mjs
node scripts/check-docs.mjs
npx prettier --write "**/*.md"
```

Then the two questions no script can ask: could a reader who has never installed this plugin
follow the page from the top, and does any sentence here say something no source says?
