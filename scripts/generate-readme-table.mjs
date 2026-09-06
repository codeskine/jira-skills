#!/usr/bin/env node
// Regenerates every block in the documentation that restates a fact a skill already carries.
//
// Prose about ten skills can silently stop being true: a skill is added, renamed or repurposed
// and the sentence describing it stays. Generating those blocks means the only way to change what
// the documentation says about a skill is to change the skill.
//
// It owns three kinds of block:
//   1. the skill table in README.md, between <!-- skills:start --> and <!-- skills:end -->
//   2. the same table in README.it.md, with the group titles from skills.sh.it.json
//   3. the header block of every document under docs/skills/ and docs/commands/, between
//      <!-- skill-header:start --> and <!-- skill-header:end -->
//
// Run with --check to fail instead of writing, which is what a pre-publish check wants.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";

import { format, resolveConfig } from "prettier";

import { parseFrontmatter } from "./skill-frontmatter.mjs";

const TABLE = ["<!-- skills:start -->", "<!-- skills:end -->"];
const HEADER = ["<!-- skill-header:start -->", "<!-- skill-header:end -->"];

const errors = [];
const written = [];

/**
 * A description is built as: what the skill is, when to use it, then the boundaries against its
 * neighbours. The first two sentences are the useful half here — the boundary clauses matter to
 * the model choosing a skill and only crowd a reader choosing one.
 */
const summarise = (description) =>
  description
    .split(/(?<=\.)\s+/)
    .slice(0, 2)
    .join(" ")
    .trim();

/**
 * The Italian column cannot come from the frontmatter: a skill's description is English by design,
 * because it is what the model reads when it chooses a skill, and it is not a text to translate.
 * The Italian page's own opening paragraph is the Italian voice of that skill, so the summary is
 * taken from there — one source, already maintained, already checked by check-docs.mjs.
 */
const summariseItalian = (path) => {
  const text = readFileSync(path, "utf8");
  const section = text.split("\n## Cosa fa\n")[1];
  if (section === undefined) {
    errors.push(`${path} has no "## Cosa fa" section to summarise`);
    return "";
  }
  const paragraph = section
    .trim()
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, " ")
    .trim();
  // One sentence, unless it is short enough that the next one still fits a table cell. A cell
  // longer than the English column's two-sentence summary stops being an index entry.
  const [first, second] = paragraph.split(/(?<=\.)\s+/);
  const pair = second === undefined ? first : `${first} ${second}`;
  return (first.length < 90 && pair.length < 200 ? pair : first).trim();
};

/**
 * The channels a skill reaches Jira through, read from what it is actually allowed to call.
 * One spelling, generated, because three documents spelled it three ways when it was prose.
 */
const channels = (allowedTools) => {
  const reached = [];
  if (allowedTools.includes("mcp__atlassian"))
    reached.push("Atlassian MCP server");
  if (allowedTools.includes("Bash(jira:*)")) reached.push("Jira CLI");
  return reached.length ? reached.join(" · ") : "—";
};

const replaceBlock = (text, [start, end], block, path) => {
  const before = text.indexOf(start);
  const after = text.indexOf(end);
  if (before === -1 || after === -1) {
    errors.push(`${path} has no ${start} / ${end} markers`);
    return null;
  }
  return `${text.slice(0, before + start.length)}\n\n${block}\n\n${text.slice(after)}`;
};

const emit = async (path, updated) => {
  if (updated === null) return;
  const original = readFileSync(path, "utf8");
  const formatted = await format(updated, {
    ...(await resolveConfig(path)),
    parser: "markdown",
  });
  if (formatted === original) return;
  if (process.argv.includes("--check")) {
    errors.push(
      `${path} is out of date. Run: node scripts/generate-readme-table.mjs`,
    );
    return;
  }
  writeFileSync(path, formatted);
  written.push(path);
};

// ---------------------------------------------------------------- the two README skill tables

const groupings = JSON.parse(readFileSync("skills.sh.json", "utf8")).groupings;
const italian = new Map(
  JSON.parse(readFileSync("skills.sh.it.json", "utf8")).groupings.map((g) => [
    g.title,
    g,
  ]),
);

const skillTable = (lang) => {
  const rows = [];
  for (const group of groupings) {
    const it = italian.get(group.title);
    if (lang === "it" && !it) {
      errors.push(`skills.sh.it.json has no grouping titled "${group.title}"`);
      continue;
    }
    const title = lang === "it" ? it.titleIt : group.title;
    const description = lang === "it" ? it.descriptionIt : group.description;
    rows.push(`**${title}** — ${description}`, "");
    rows.push(
      lang === "it"
        ? "| Skill | Cosa fa | Pagina |"
        : "| Skill | What it does | Page |",
      "| ----- | ------------ | ---- |",
    );
    for (const name of group.skills) {
      const path = `skills/${name}/SKILL.md`;
      if (!existsSync(path)) {
        errors.push(`${path} does not exist`);
        continue;
      }
      const frontmatter = parseFrontmatter(readFileSync(path, "utf8"));
      if (frontmatter === null) {
        errors.push(`${path} has no frontmatter`);
        continue;
      }
      const page =
        lang === "it" ? `docs/skills/${name}.it.md` : `docs/skills/${name}.md`;
      const link = lang === "it" ? "leggi" : "read";
      const what =
        lang === "it"
          ? summariseItalian(page)
          : summarise(frontmatter.description);
      rows.push(`| \`${frontmatter.name}\` | ${what} | [${link}](${page}) |`);
    }
    rows.push("");
  }
  return rows.join("\n").trimEnd();
};

for (const [path, lang] of [
  ["README.md", "en"],
  ["README.it.md", "it"],
]) {
  if (!existsSync(path)) {
    errors.push(`${path} does not exist`);
    continue;
  }
  await emit(
    path,
    replaceBlock(readFileSync(path, "utf8"), TABLE, skillTable(lang), path),
  );
}

// ------------------------------------------------------------------ the document header blocks

const table = (rows) =>
  [
    "|  |  |",
    "| --- | --- |",
    ...rows.map(([k, v]) => `| **${k}** | ${v} |`),
  ].join("\n");

for (const name of readdirSync("skills", { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== "shared")
  .map((entry) => entry.name)
  .sort()) {
  const source = `skills/${name}/SKILL.md`;
  const frontmatter = parseFrontmatter(readFileSync(source, "utf8"));
  if (frontmatter === null) {
    errors.push(`${source} has no frontmatter`);
    continue;
  }
  const tools = frontmatter["allowed-tools"] ?? "";
  const version = frontmatter.metadata?.version ?? "—";
  const invocable = frontmatter["user-invocable"] === true;
  const environment = frontmatter.compatibility ?? "—";

  const blocks = {
    [`docs/skills/${name}.md`]: table([
      ["Name", `\`${frontmatter.name}\``],
      ["Version", version],
      ["Invocable by name", invocable ? "yes" : "no"],
      ["Channel", channels(tools)],
      ["Environment", environment],
    ]),
    [`docs/skills/${name}.it.md`]: table([
      ["Nome", `\`${frontmatter.name}\``],
      ["Versione", version],
      ["Invocabile per nome", invocable ? "sì" : "no"],
      ["Channel", channels(tools)],
      ["Ambiente", environment],
    ]),
  };

  for (const [path, block] of Object.entries(blocks)) {
    if (!existsSync(path)) {
      errors.push(`${path} does not exist — every skill needs both documents`);
      continue;
    }
    await emit(
      path,
      replaceBlock(readFileSync(path, "utf8"), HEADER, block, path),
    );
  }
}

// A command declares neither a name nor a version: its frontmatter carries a description and
// allowed-tools, and nothing else. Its header block says so rather than printing empty rows.
for (const file of readdirSync("commands")
  .filter((f) => f.endsWith(".md"))
  .sort()) {
  const name = file.replace(/\.md$/, "");
  const frontmatter = parseFrontmatter(
    readFileSync(`commands/${file}`, "utf8"),
  );
  if (frontmatter === null) {
    errors.push(`commands/${file} has no frontmatter`);
    continue;
  }
  const tools = (frontmatter["allowed-tools"] ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((tool) => `\`${tool}\``)
    .join(" ");

  const blocks = {
    [`docs/commands/${name}.md`]: table([
      ["Name", `\`/${name}\``],
      ["Kind", "command"],
      ["Invocation", `\`/${name}\``],
      ["Tools", tools || "—"],
    ]),
    [`docs/commands/${name}.it.md`]: table([
      ["Nome", `\`/${name}\``],
      ["Tipo", "comando"],
      ["Invocazione", `\`/${name}\``],
      ["Strumenti", tools || "—"],
    ]),
  };

  for (const [path, block] of Object.entries(blocks)) {
    if (!existsSync(path)) {
      errors.push(
        `${path} does not exist — every command needs both documents`,
      );
      continue;
    }
    await emit(
      path,
      replaceBlock(readFileSync(path, "utf8"), HEADER, block, path),
    );
  }
}

// ------------------------------------------------------------------------------------ report

if (errors.length) {
  console.error("Generated documentation blocks are not in order:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  process.argv.includes("--check")
    ? "Generated documentation blocks are up to date."
    : `Generated documentation blocks written: ${written.length} file(s) changed.`,
);
