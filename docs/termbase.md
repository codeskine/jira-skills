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

| Object           | English       | In Italian prose     | Plural (IT)     |
| ---------------- | ------------- | -------------------- | --------------- |
| the unit of work | work item     | **il** work item     | i work item     |
| its class        | work type     | **il** work type     | i work type     |
| its container    | parent        | **il** parent        | i parent        |
| its position     | status        | **lo** status        | gli status      |
| the move         | transition    | **la** transition    | le transition   |
| the time box     | sprint        | **lo** sprint        | gli sprint      |
| the ship target  | fix version   | **la** fix version   | le fix version  |
| the Jira object  | Jira Workflow | **il** Jira Workflow | i Jira Workflow |

English loanwords are **invariant in the plural**: _i work item_, never _i work items_.

Refused as the name of the concept — in both languages:

| Object      | Refused in English                           | Refused in Italian                                                     |
| ----------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| work item   | issue, ticket, task, story, work element     | issue, ticket, attività, task, storia, scheda, elemento di lavoro      |
| work type   | issue type, kind, category, `type::*`        | tipo di issue, tipologia, categoria, genere                            |
| parent      | epic link, `kind::epic`, simulated hierarchy | epica, elemento padre, genitore, gerarchia simulata, tabella dei figli |
| status      | workflow state, `workflow::*`, phase, column | stato del workflow, fase, colonna, stato di avanzamento                |
| transition  | state change, move                           | cambio di stato, passaggio, spostamento, avanzamento                   |
| sprint      | iteration, milestone, cycle, cadence         | iterazione, milestone, ciclo, cadenza                                  |
| fix version | release, version, milestone, tag             | release, versione, milestone, tag, rilascio                            |

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

| Mechanism       | In Italian prose   | Gloss at first use                                                  | Refused in Italian                                    |
| --------------- | ------------------ | ------------------------------------------------------------------- | ----------------------------------------------------- |
| draft gate      | il draft gate      | il cancello che precede ogni scrittura su Jira                      | conferma, approvazione (come nome), revisione interna |
| artifact gate   | l'artifact gate    | la forma del gate che mostra il contenuto di un work item           | gate di redazione                                     |
| operation gate  | l'operation gate   | la forma che mostra un cambiamento a ciò che esiste già             | gate di operazione                                    |
| discovery       | la discovery       | la lettura della configurazione reale del progetto                  | introspezione, sonda, rilevamento, scansione          |
| project profile | il project profile | il file che registra l'esito della discovery                        | configurazione, mirror, stato locale, "la cache"      |
| channel         | il channel         | la via con cui una skill parla a Jira                               | backend, provider, adattatore, integrazione           |
| surrogate       | il surrogate       | un concetto inventato al posto di uno nativo di Jira                | workaround, emulazione, simulazione                   |
| connector       | il connettore      | un connettore Atlassian aggiunto dalle impostazioni di claude.ai    | channel (NON è un channel)                            |
| degradation     | la degradazione    | un channel irraggiungibile qui e ora, non un limite dello strumento | guasto, errore, malfunzionamento                      |
| declared gap    | il gap dichiarato  | un'operazione che non esiste su nessuno dei due channel             | buco, mancanza, limitazione                           |

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
| Acceptance criteria            | Criteri di accettazione                |
| Actual result                  | Risultato effettivo                    |
| Assumptions                    | Assunzioni                             |
| Awaiting refinement            | In attesa di refinement                |
| Boards and sprints             | Board e sprint                         |
| Dependencies                   | Dipendenze                             |
| Evidence                       | Evidenza                               |
| Expected result                | Risultato atteso                       |
| Fix versions                   | Fix version                            |
| Frequency                      | Frequenza                              |
| Hierarchy                      | Gerarchia                              |
| How success is measured        | Come si misura il successo             |
| Impact                         | Impatto                                |
| Intents no work type serves    | Intenti che nessun work type serve     |
| Measurements                   | Misurazioni                            |
| Not yet known                  | Non ancora noto                        |
| Operation resolution           | Risoluzione delle operazioni           |
| Options                        | Opzioni                                |
| Out of scope                   | Fuori perimetro                        |
| Outcome sought                 | Risultato perseguito                   |
| Required fields not yet filled | Campi obbligatori non ancora compilati |
| Source                         | Provenienza                            |
| Statuses and transitions       | Status e transition                    |
| Steps to reproduce             | Passi per riprodurre                   |
| Technical impact               | Impatto tecnico                        |
| Unsupported operations         | Operazioni non supportate              |
| Urgency, as stated             | Urgenza, come dichiarata               |
| What it costs to defer         | Cosa costa rimandare                   |
| What the requester expects     | Cosa si aspetta chi ha chiesto         |
| What works today               | Cosa funziona oggi                     |
| Where it happened              | Dove è successo                        |
| Who benefits                   | Chi ne trae beneficio                  |
| Work type                      | Work type                              |
| Work types                     | Work type                              |

_Outcome sought_ is deliberately **not** _Risultato atteso_: that pair is already bound to
_Expected result_ in a defect report, and one Italian phrase cannot name two different things.

A **table column inside an artifact** is translated on the same rule, and the ones the templates
use are fixed here too:

| English              | Italian                    | Template         |
| -------------------- | -------------------------- | ---------------- |
| Option               | Opzione                    | debt record      |
| What it takes        | Cosa richiede              | debt record      |
| What it leaves       | Cosa lascia                | debt record      |
| Field / Value        | Campo / Valore             | captured request |
| From                 | Da                         | captured request |
| Received             | Ricevuta                   | captured request |
| Route                | Tramite                    | captured request |
| Recorded by          | Registrata da              | captured request |
| Level                | Livello                    | project profile  |
| Can be a child of    | Può essere figlio di       | project profile  |
| Category             | Categoria                  | project profile  |
| Reachable from       | Raggiungibile da           | project profile  |
| Operation            | Operazione                 | project profile  |
| Tool or command      | Tool o comando             | project profile  |
| Manual path          | Percorso manuale           | project profile  |
| Active sprint        | Sprint attivo              | project profile  |
| Notes                | Note                       | project profile  |
| Why                  | Perché                     | project profile  |
| Required on creation | Obbligatori alla creazione | project profile  |

_Route_ is **Tramite** and never _Canale_: §2 reserves `channel` for the route a skill uses to
reach Jira, and a request arriving by email has nothing to do with it.

An agent that needs a heading absent from this table adds it and says so in its return, rather
than choosing one on its own.

---

## 3. Documentation-only terms

Not domain vocabulary. Fixed here so that eleven documents agree.

| English                    | Italian                        | Note                                                                                                                   |
| -------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| skill                      | la skill                       | invariant plural: _le skill_                                                                                           |
| plugin                     | il plugin                      |                                                                                                                        |
| command                    | il comando                     | `/jira-doctor` is a command, not a skill                                                                               |
| Agent Skill                | Agent Skill                    | the specification's own name, unchanged                                                                                |
| development process        | il processo di sviluppo        | the title of `development-process.md` and its Italian pair                                                             |
| artifact                   | l'artefatto                    |                                                                                                                        |
| intent                     | l'intento                      |                                                                                                                        |
| template                   | il template                    |                                                                                                                        |
| report                     | il report                      | the reply a read-only skill returns in chat                                                                            |
| finding                    | il rilievo                     |                                                                                                                        |
| tool                       | il tool                        | invariant plural: _i tool_                                                                                             |
| board                      | la board                       | invariant plural: _le board_ — a Jira object, but not one of the seven                                                 |
| backlog                    | il backlog                     |                                                                                                                        |
| label                      | la label                       | English, as `CONTEXT.md` names the scoped labels                                                                       |
| intake                     | l'intake                       | two authors kept it English independently; ratified here                                                               |
| refinement                 | il refinement                  | the activity and the noun, matching _In attesa di refinement_                                                          |
| refined                    | rifinito                       | _un work item rifinito_                                                                                                |
| raw                        | grezzo / grezza                |                                                                                                                        |
| child / children           | il figlio / i figli            | and _relazione parent-figlio_ for the mixed form                                                                       |
| split, decomposition       | la scomposizione, scomporre    |                                                                                                                        |
| orphan                     | l'orfano                       |                                                                                                                        |
| planning horizon           | orizzonte di pianificazione    |                                                                                                                        |
| hierarchy                  | la gerarchia                   | ordinary Italian — only _gerarchia simulata_ is refused                                                                |
| technical debt             | il debito tecnico              | never _debito tecnologico_                                                                                             |
| risk                       | il rischio                     |                                                                                                                        |
| project admin              | l'amministratore del progetto  |                                                                                                                        |
| condition                  | la condizione                  | _condizione non soddisfatta_ for an unmet one                                                                          |
| blocking link              | il link di blocco              |                                                                                                                        |
| status category            | la categoria di status         |                                                                                                                        |
| what ships together        | cosa viene rilasciato insieme  |                                                                                                                        |
| the state of a fix version | lo stato della fix version     | _rilasciata_ / _non rilasciata_ / _archiviata_. Deliberately **not** _status_, which names the position of a work item |
| credential                 | la credenziale                 |                                                                                                                        |
| non-interactive shell      | shell non interattiva          |                                                                                                                        |
| dotfile                    | il dotfile                     |                                                                                                                        |
| single writer              | l'unica scrittrice             | of the project profile                                                                                                 |
| staleness                  | l'invalidazione                | explicit, never time-based                                                                                             |
| value proposal             | la proposta di valore          |                                                                                                                        |
| project style              | lo stile del progetto          | values `team-managed` / `company-managed` untranslated                                                                 |
| floor, threshold           | **la soglia**                  | il minimo che un materiale riportato deve portare perché un intento lo prenda                                          |
| second-hand, relayed       | **di seconda mano, riportato** | materiale che arriva tramite qualcuno che non è nella conversazione                                                    |
| handover                   | **la consegna, consegnare**    | il passaggio di una richiesta alla skill che ne possiede il resto                                                      |
| axis                       | **l'asse**                     | la dimensione su cui corre un confine fra due intenti                                                                  |
| placement                  | **il collocamento**            | mettere in uno sprint o su una fix version un work item già registrato                                                 |
| fallback                   | **il ripiego**                 | una seconda via per un'operazione — la mappa dei channel non ne dichiara nessuna                                       |
| probe                      | **la verifica**                | il comando con cui `/jira-doctor` stabilisce uno stato · evitare _sonda_, che rende _discovery_                        |
| release state              | **lo stato di rilascio**       | di una fix version: non rilasciata, rilasciata, archiviata · non è lo _status_                                         |
| capability                 | **una capacità dell'agente**   | una voce di `allowed-tools` che non è un channel                                                                       |
| installation               | **l'installazione**            | questo progetto su questa macchina, di cui il project profile è il verbale                                             |
| sub-agent                  | il sub-agent                   | build-time only; never in user documentation                                                                           |
| shot                       | lo shot                        | an entry in the shot list — build-time only                                                                            |
| worked exchange            | lo scambio di esempio          | section 5 of every document                                                                                            |
| the result                 | il risultato                   | section 6 of every document                                                                                            |

A persona's role name is **not** translated: _QA Engineer_, _Scrum Master_, _Business Analyst_,
_Delivery Manager_. Neither is a Jira field name or a work type value — _Team_, _Task_,
_In Progress_ — for the reason criterion 5 gives.

Two words to avoid in Italian that no _Avoid_ list catches: **il record** for a work item, which
stands exactly where the canonical term belongs, and **canale** for anything but a `channel`.

A **chat report has no template**, so its labels are not in §2b. The one shape the set has settled
is a transition outcome: Transition run / Status before / Status declared / Status now / Not
offered, and why → _Transition eseguita / Status prima / Status dichiarato / Status adesso / Non
offerte, e perché_.

The second is `/jira-doctor`'s report, whose labels `commands/jira-doctor.md` now owns: found /
why / remedy → _trovato / perché / rimedio_. The command settled them after this documentation had
to invent them once; the page cites the command, never the reverse.

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
