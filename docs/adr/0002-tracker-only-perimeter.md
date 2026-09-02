# The plugin covers the tracker and stops there

This plugin authors and maintains Jira work items. Merge requests, commits, branching and
technical release are **out of scope by decision**, not by omission. The predecessor of this
repository — a GitLab plugin — had decided the opposite, fixing its boundary at "everything
up to the merge"; that decision is reversed here.

The reason is that the two halves have different owners and different rates of change. Ticket
authoring is where an agent adds the most value and where quality is hardest to hold: a
well-formed work item needs discovery, questions and evidence. Change proposals, by contrast,
are already well served by the forge's own tooling, and dragging them in couples the plugin to
a branching model, a forge and a CLI that have nothing to do with Jira.

## Consequences

- No skill in this plugin runs `git`. `Bash(git:*)` is not in the default `allowed-tools`.
- The work item → code link is left to Jira's own smart commits, which teams configure at the
  forge. The plugin does not generate commit messages.
- The GitLab-era skills for merge requests, commits and release branching are not ported.
  They remain reachable at the tag `archive/gitlab-workflow-1.5.0`.
- If change proposals are ever wanted back, they belong in a separate plugin with its own
  perimeter, not as skills grafted onto this one.
