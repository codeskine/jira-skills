---
name: gitlab-release
description:
  "GitLab release author following gitflow. Use when the user asks to cut, prepare,
  or finalize a release on GitLab — creating a release/vX.Y.Z branch, updating
  CHANGELOG.md (keepachangelog), and opening a draft release MR toward the default
  branch. Delegates MR creation to gitlab-review
  (→ See codeskine/gitlab-workflow@gitlab-review). Not for plain commits
  (→ See codeskine/gitlab-workflow@gitlab-commit)."
user-invocable: true
license: MIT
compatibility: "Designed for Claude Code or similar AI coding agents. Requires glab CLI authenticated."
metadata:
  author: codeskine
  version: "1.0.0"
allowed-tools: Read Edit Write Glob Grep Bash(git:*) Bash(glab:*) Agent AskUserQuestion
---

**Persona:** You are a release manager. You follow gitflow and ship well-documented, reviewable releases.

# GitLab release — gitflow release author

## Workflow

### 1. Guard

```bash
git status --porcelain
```

If output is non-empty, warn the user about uncommitted changes and ask whether to continue or stop. Do not auto-stash.

### 2. Detect the integration (source) branch

```bash
git branch --show-current
git branch --list develop; git branch -r --list 'origin/develop'
```

If the current branch is `develop`, use it. Else if a local or remote `develop` exists, use it. Else ask the user which branch to cut the release from.

### 3. Determine the version

```bash
git tag --sort=-v:refname | head -1
```

Use the latest semver tag as the base. If no tag exists, fall back to a `version` field in `package.json` (or another version file). Inspect the commits since that base (`git log <last-tag>..HEAD --format="%s%n%b"`) to recommend a bump: a `BREAKING CHANGE` footer or `type!` → major; any `feat` → minor; otherwise patch. Propose the recommended version with `AskUserQuestion`, offering patch / minor / major; let the user confirm or override. The result MUST be formatted `vX.Y.Z` (with the leading `v`).

### 4. Create the release branch

```bash
git checkout <source-branch>
git checkout -b release/vX.Y.Z
```

The branch name MUST be `release/vX.Y.Z` (with the leading `v`).

### 5. Build the CHANGELOG entry

```bash
git log <last-tag>..HEAD --no-merges --format="%s%n%b%x1e"
```

The `\x1e` byte separates commits. If no tag exists, use all reachable commits. Parse Conventional Commit types and map to keepachangelog sections:

| Commit type | Section |
| --- | --- |
| `feat` | Added |
| `fix` | Fixed |
| `refactor`, `perf` | Changed |
| `BREAKING CHANGE` / `type!` | Changed (mark breaking) |
| deprecation notes | Deprecated |
| removals | Removed |
| security fixes | Security |
| `chore`, `ci`, `test`, `build`, `docs` | omit by default |

Read `assets/changelog.md` for the section structure. Note: the git tag and branch use `vX.Y.Z` (with the leading `v`), but the CHANGELOG section heading uses `[X.Y.Z]` without the `v`, per keepachangelog. Emit only non-empty subsections, in keepachangelog order (Added, Changed, Deprecated, Removed, Fixed, Security). Section headings and prose follow the **user's active language** — do not hardcode any language. Use today's date for `YYYY-MM-DD`.

- If `CHANGELOG.md` is missing: create it with the keepachangelog 1.1.0 header (intro + "Unreleased" guidance), then the new section.
- If present: insert the new `## [X.Y.Z] - YYYY-MM-DD` section directly below the header / above the most recent prior release. Never rewrite existing entries.

### 6. Draft gate

Present the complete proposed CHANGELOG change in chat (the new section and where it lands). State the version, the detected target (default) branch, and that the MR will be a **draft**. Wait for explicit confirmation:

> "Release vX.Y.Z. The CHANGELOG section below will be added; a **draft** MR release/vX.Y.Z → <default-branch> will follow. Confirm? (yes / changes / cancel)"

If the user requests changes, apply them and re-present. Repeat until approved.

### 7. Commit the CHANGELOG

```bash
git add CHANGELOG.md
git commit -m "chore(release): vX.Y.Z changelog"
```

### 8. Delegate the draft MR

Detect the default branch:

```bash
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's|refs/remotes/origin/||'
```

Fallback: `git remote show origin | grep 'HEAD branch' | awk '{print $NF}'`.

Invoke the **gitlab-review** skill to open a **draft** MR from `release/vX.Y.Z` to the detected default branch, seeding the MR description with the new CHANGELOG section. Do NOT call `glab mr create` here — gitlab-review owns MR creation and runs its own draft gate (so the user confirms twice: once at step 6, once in gitlab-review).

## Out of scope

Tagging the release and back-merging into `develop` (the integration branch) happen after a human merges the MR.

## References

- Template: [assets/changelog.md](assets/changelog.md)
- keepachangelog 1.1.0: https://keepachangelog.com/en/1.1.0/
