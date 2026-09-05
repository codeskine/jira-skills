# Termbase — English ↔ Italian

The documentation of this plugin exists in two languages that are peers: neither is a translation
of the other, and nothing checks one against the other. What keeps them saying the same thing is
this file.

It exists for one failure in particular. `CONTEXT.md` is a glossary of canonical **and refused**
terms, and it is written entirely in English. Without an agreed Italian rendering, every author
picks their own — and three of them write `ticket`, which is a banned word in any language.

This file is bilingual by construction and has no `.it.md` twin. A translated copy of a termbase
is a second answer that will disagree with the first.

---

## The rule, in one line

**The names of the objects stay English in both languages; everything around them is written in
the reader's language.**

This is not a preference. `skills/shared/references/quality-standard.md`, criterion 5, settles it
for the artifacts the plugin writes, and it settles it with an Italian example: an Italian
artifact says _il work item_ and _la fix version_ for the same reason it says _In Progress_ rather
than a translation of it. The documentation follows the artifacts it documents — prose that used a
different word from the artifact printed below it would be teaching the reader the wrong term.

---

## 1. Jira objects — never translated

The seven names of criterion 4, plus the Jira object that owns two of them. English in both
documents, with the Italian article and plural fixed here so that eleven authors do not each
choose their own.

| Object           | English      | In Italian prose         | Plural (IT)      |
| ---------------- | ------------ | ------------------------ | ---------------- |
| the unit of work | work item    | **il** work item         | i work item      |
| its class        | work type    | **il** work type         | i work type      |
| its container    | parent       | **il** parent            | i parent         |
| its position     | status       | **lo** status            | gli status       |
| the move         | transition   | **la** transition        | le transition    |
| the time box     | sprint       | **lo** sprint            | gli sprint       |
| the ship target  | fix version  | **la** fix version       | le fix version   |
| the Jira object  | Jira Workflow | **il** Jira Workflow    | i Jira Workflow  |

English loanwords are **invariant in the plural**: _i work item_, never _i work items_.

Refused as the name of the concept — in both languages:

| Object        | Refused in English                             | Refused in Italian                                                    |
| ------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| work item     | issue, ticket, task, story, work element       | issue, ticket, attività, task, storia, scheda, elemento di lavoro     |
| work type     | issue type, kind, category, `type::*`          | tipo di issue, tipologia, categoria, genere                           |
| parent        | epic link, `kind::epic`, simulated hierarchy   | epica, elemento padre, genitore, gerarchia simulata, tabella dei figli |
| status        | workflow state, `workflow::*`, phase, column   | stato del workflow, fase, colonna, stato di avanzamento               |
| transition    | state change, move                             | cambio di stato, passaggio, spostamento, avanzamento                  |
| sprint        | iteration, milestone, cycle, cadence           | iterazione, milestone, ciclo, cadenza                                 |
| fix version   | release, version, milestone, tag               | release, versione, milestone, tag, rilascio                           |

Two of these need the test of §4 applied rather than the list read:

- **`stato`** is ordinary Italian and stays ordinary Italian — _lo stato attuale del progetto_ is
  fine. It is refused only where it stands in for the Jira object: _lo status del work item_.
- **`rilascio`** is refused as a noun standing for _fix version_. The verb is not: **rilasciare**
  una fix version is the action Jira performs on it, exactly as `CONTEXT.md` allows _releasing_
  in English.

**The bare word `workflow` is banned**, in both languages, because it is overloaded. `Jira
Workflow` names the Jira object made of statuses and transitions. For the sequence that runs from
a request arriving to work shipping, say **development process** in English and **processo di
sviluppo** in Italian.

---

## 2. Plugin mechanisms — English name, Italian prose

These are not Jira objects; they are what this plugin does. The name stays English because the
reader will meet it in the repository, in a skill and in a commit message, and a searchable name
is worth more than a translated one. The Italian gloss is given **once per document**, at first
use, and never again.

| Mechanism       | In Italian prose  | Gloss at first use                                    | Refused in Italian                        |
| --------------- | ----------------- | ----------------------------------------------------- | ----------------------------------------- |
| draft gate      | il draft gate     | il cancello che precede ogni scrittura su Jira        | conferma, approvazione (come nome), revisione interna |
| discovery       | la discovery      | la lettura della configurazione reale del progetto    | introspezione, sonda, rilevamento, scansione |
| project profile | il project profile | il file che registra l'esito della discovery         | configurazione, mirror, stato locale, "la cache" |
| channel         | il channel        | la via con cui una skill parla a Jira                 | backend, provider, adattatore, integrazione |
| surrogate       | il surrogate      | un concetto inventato al posto di uno nativo di Jira  | workaround, emulazione, simulazione       |

**`Evidence` is translated**, and is the exception to this section. It is not a Jira object and it
is a section heading in three templates — say **evidenza**, and _l'evidenza_ in running prose.

`Native concept` and `Neutrality` are contributor vocabulary and appear in the documentation only
where a reader needs the rule, not the label. Say what the rule does instead of naming it.

---

## 2b. Template headings are translated

`skills/shared/references/templates.md` settles this and the documentation follows it: the
headings of an artifact are translated with the artifact, **except** where the heading is one of
the seven canonical names of §1 — a section called _Work type_ keeps that name in an Italian
artifact, a section called _Evidence_ becomes _Evidenza_.

The headings the templates use, fixed once here:

| English                        | Italian                                |
| ------------------------------ | -------------------------------------- |
| Steps to reproduce             | Passi per riprodurre                   |
| Expected result                | Risultato atteso                       |
| Actual result                  | Risultato effettivo                    |
| Evidence                       | Evidenza                               |
| Where it happened              | Dove è successo                        |
| Impact                         | Impatto                                |
| Frequency                      | Frequenza                              |
| Required fields not yet filled | Campi obbligatori non ancora compilati |
| Work type                      | Work type                              |
| Source                         | Provenienza                            |
| Not yet known                  | Non ancora noto                        |
| Awaiting refinement            | In attesa di refinement                |
| Acceptance criteria            | Criteri di accettazione                |
| Out of scope                   | Fuori perimetro                        |
| Dependencies                   | Dipendenze                             |

An agent that needs a heading absent from this table adds it and says so in its return, rather
than choosing one on its own.

---

## 3. Documentation-only terms

Not domain vocabulary. Fixed here so that eleven documents agree.

| English              | Italian                     | Note                                                      |
| -------------------- | --------------------------- | --------------------------------------------------------- |
| skill                | la skill                    | invariant plural: _le skill_                              |
| plugin               | il plugin                   |                                                            |
| command              | il comando                  | `/jira-doctor` is a command, not a skill                  |
| Agent Skill          | Agent Skill                 | the specification's own name, unchanged                   |
| development process  | il processo di sviluppo     | the title of `development-process.md` and its Italian pair |
| sub-agent            | il sub-agent                | build-time only; it never appears in user documentation   |
| shot                 | lo shot                     | an entry in the shot list — build-time only               |
| worked exchange      | lo scambio di esempio       | section 5 of every document                               |
| the result           | il risultato                | section 6 of every document                               |
| project profile file | `.jira/project-profile.md`  | quoted as a path, never described in words alone          |

---

## 4. Applying the Avoid lists in Italian

A refused word is refused **as the name of the concept above it**, not as a string. The same
letters are legitimate in three other roles, and `CONTEXT.md` names all three. They hold in
Italian unchanged:

- **A literal name owned by something else.** `jira issue move` and `jira release list` are what
  those CLI commands are called; `Category` is what Jira calls the status category field. Quote
  them as code and leave them alone, in either language.
- **A mention made in order to forbid.** Naming a refused thing so the reader recognises it is
  what this table does. _«mai simulare una gerarchia»_ has to say _gerarchia simulata_ to forbid
  it.
- **Ordinary language carrying no domain sense.** _lo stato attuale_, _la versione di Node_, _un
  passaggio del documento_. None of them stands where a canonical term belongs.

The test is one question, and it is the same in both languages: **does this word stand where the
canonical term belongs?** _al momento del passaggio_ stands where _transition_ belongs, and is a
defect. _un passaggio del documento_ does not.

This is not checkable mechanically, and `CONTEXT.md` closes with the evidence for why: a list that
fires on `passaggio`, `versione`, `stato` and `approvazione` reports mostly noise, and a check
whose output is mostly noise stops being read.

---

## 5. Register

Both languages, every document:

- **The reader has not installed the plugin yet.** Nothing assumes they know what a skill is, and
  nothing explains Jira to them.
- **Second person singular in Italian** — _dici_, _approvi_ — matching the direct address of the
  English. No _voi_, no impersonal _si_.
- **No marketing voice.** No exclamation marks, no _potente_, no _semplicemente_. The plugin's own
  documents state limits as facts; so does this documentation.
- **Present tense for what the skill does**, not future. _La skill legge il project profile_, not
  _leggerà_.
- **Prose wraps at 100 columns.** The repository does, and `prettier` preserves prose wrapping
  rather than reflowing it.
