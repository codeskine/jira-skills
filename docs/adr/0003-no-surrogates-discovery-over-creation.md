# The plugin discovers what Jira owns and never re-creates it

Jira owns statuses, work types, hierarchy, sprints and versions, and the project admin owns
Jira. The plugin therefore **discovers** that configuration and guides the user through it; it
never creates a parallel version of a concept the platform already provides. Concretely: no
status labels, no type labels, no markdown table of children, no work type hard-coded in a
skill name or in a description.

This principle is inherited from the GitLab predecessor, where it had the opposite outcome.
There the platform tier offered none of these concepts, so the plugin simulated all of them —
`workflow::*` labels for status, `kind::*` for hierarchy, a hand-maintained table of children.
Carrying those surrogates onto Jira would produce two truths for the same datum: boards,
reports and SLAs aligned to the native status, and the plugin aligned to its own label.

## Consequences

- Project initialization is **discovery**, not configuration: `jira-init` reads the project and
  records a profile; it does not create anything in Jira.
- Every skill reads that profile before proposing anything. A work type that the project does
  not have is reported as missing, never invented.
- Skills are named after the user's intent (`jira-diagnose`, `jira-assess`) rather than after
  a Jira object (`jira-bug`, `jira-story`), because object names belong to the project scheme
  and can be renamed or absent.
- Hierarchy depth is whatever the project declares. The plugin states the parent relation and
  nothing about how many levels exist.
