# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues on `codeskine/jira-skills`. Use the `gh`
CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## Pull requests as a triage surface

**PRs as a request surface: no.**

This repo is private and single-author, so there is no external request surface to triage.
`/triage` reads only issues. Flip this flag to `yes` if the repo is opened up and external pull
requests start arriving as feature requests; the `gh pr` equivalents of the commands above then
apply, and note that GitHub shares one number space across issues and PRs.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Not to be confused with

This plugin authors work items on **Atlassian Jira Cloud**. That is the product; this file is
about where the work _on the plugin itself_ is tracked. They are unrelated.
