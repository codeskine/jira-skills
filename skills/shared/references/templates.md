# Reading a template

Every authoring skill fills a template held in its own `assets/`. The conventions are the same
for all of them and are stated here once.

- **A template defines structure**: which sections, in which order, and what belongs in each.
  It defines nothing else.
- **It fixes no language.** The artifact is written in the language the user is working in, and
  its headings are translated with it. The English in a template names the structure; it is not
  the wording of the result. The canonical names are the exception — see
  [the quality standard](quality-standard.md), criterion 5 — so a heading that is one of them,
  _Fix versions_ say, keeps it.
- **It presumes no technology.** No platform, no programming language, no assumption about how
  the thing being described is built or run.
- **Angle brackets are replaced.** `<like this>` marks what the author supplies.
- **An empty section is filled or removed, never left blank.** A heading with nothing under it
  reads as an oversight; a stated absence reads as a fact. Where a template marks a section
  optional, omitting it is the intended behaviour when it does not apply.
- **It is filled in Markdown.** Headings, lists, tables and fenced blocks reach the work item
  interpreted. Wiki markup — `h2.`, `|| … ||` — reaches it as literal text, silently and with no
  error to say so, and the structure the template defines is lost in the process.

A template that repeats an instruction from its skill has drifted: the skill owns the procedure,
the template owns the shape.
