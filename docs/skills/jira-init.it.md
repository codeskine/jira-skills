# `jira-init` — fare la discovery e scrivere il project profile

<!-- skill-header:start -->

|                         |                                                                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome**                | `jira-init`                                                                                                                                                                                   |
| **Versione**            | 1.0.0                                                                                                                                                                                         |
| **Invocabile per nome** | sì                                                                                                                                                                                            |
| **Channel**             | Atlassian MCP server · Jira CLI                                                                                                                                                               |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". Uses the jira CLI for the Agile surface where it is authenticated, and degrades explicitly without it. |

<!-- skill-header:end -->

## Cosa fa

Legge com'è configurato davvero il tuo progetto Jira e scrive quello che ha trovato in
`.jira/project-profile.md`, il file che ogni altra skill legge come primo passo. Guarda i work type
e come si annidano, gli status, i campi obbligatori alla creazione, le board con il loro sprint
attivo, le fix version. Su Jira non crea niente e non cambia niente.

Questa lettura è la discovery, cioè la lettura della configurazione reale del progetto, e il file
che ne registra l'esito è il project profile. È la prima cosa che esegui in un repository, dopo
`/jira-doctor`, ed è l'unica skill che fa la discovery e l'unica che scrive quel file. Non porta
opinioni proprie: registra quello che il progetto dichiara, comprese le cose che il progetto non
sa fare — un intento che nessun work type serve, un'operazione che nessun tool copre, un channel
che non ha risposto. Il channel è la via con cui una skill parla a Jira, e qui sono due.

## Quando si attiva · quando no

Si attiva quando ancora niente sa com'è configurato il tuo progetto, oppure quando quello che
risulta registrato non corrisponde più.

| Se dici qualcosa come                                          | La skill è                                                 |
| -------------------------------------------------------------- | ---------------------------------------------------------- |
| «il lavoro di questo repository lo tracciamo su Jira, prepara» | `jira-init`                                                |
| «che work type ha davvero questo progetto?»                    | `jira-init`                                                |
| «una skill mi ha detto che il project profile manca»           | `jira-init`                                                |
| «l'admin ha aggiunto uno status la settimana scorsa»           | `jira-init`, di nuovo                                      |
| «ma il server Atlassian è connesso?»                           | [il comando `/jira-doctor`](../commands/jira-doctor.it.md) |

Il confine con [`/jira-doctor`](../commands/jira-doctor.it.md) è la differenza fra due domande. Il
comando chiede se questa macchina riesce a raggiungere Jira: il server MCP sotto l'id `atlassian`,
la Jira CLI, e se un project profile esiste. Questa skill chiede com'è fatto il progetto che sta
dall'altra parte. Esegui prima il comando — con il server MCP irraggiungibile questa skill si
ferma e ti manda lì comunque.

Niente la riesegue al posto tuo. L'invalidazione è esplicita e mai basata sul tempo: la
configurazione di un progetto cambia di rado, e un controllo a ogni invocazione costerebbe a ogni
sessione per intercettare un evento raro. Rieseguila quando cambia lo schema, quando compare uno
status, una board o una fix version che il project profile non elenca, o quando una skill segnala
che su Jira non c'è qualcosa che il project profile le prometteva.

## Come si usa

Di' che il lavoro di questo repository è tracciato su Jira, e rispondi alle domande. Non viene
scritto niente — nemmeno in locale — finché non approvi quello che hai letto.

**1 · Controlla che la discovery sia quello che volevi.** Questa skill scandaglia l'intero
progetto e scrive un file che il tuo team condivide, il che è una risposta grossa a una domanda
piccola. Chiedile quali fix version hai, o quali board, e ti risponde e si ferma — nessuna
scansione, e nessun project profile riscritto dietro a una domanda che non intendevi come un passo
di setup. Se la domanda verte davvero sulle fix version e non sulla forma del tuo progetto,
[`jira-release`](jira-release.it.md) è la skill che le possiede e le passa la mano. Se invece stai
configurando, o una skill ti ha detto che il project profile manca o è vecchio, prosegue.

**2 · Controlla prima i due channel, che falliscono in modo indipendente.** Il server MCP di
Atlassian è una precondizione: nient'altro risponde per work type, status e campi, quindi se non è
raggiungibile sotto l'id `atlassian` la skill si ferma e ti manda a `/jira-doctor`. La Jira CLI non
è una precondizione. Senza di lei la discovery gira su tutto quello che il server MCP raggiunge, e
la superficie Agile — board, sprint, fix version — viene registrata come non supportata **su
questa macchina**, non come assente dagli strumenti. Il project profile tiene separati _letto_ e
_non raggiungibile_ perché portano in due posti diversi: uno a ripristinare un channel, l'altro a
creare una board. Quali operazioni appartengono a quale channel sta nel
[processo di sviluppo](../development-process.it.md).

**3 · Chiede quale progetto.** Se `.jira/project-profile.md` c'è già, ti dice quale progetto
descrive e quando è stato scoperto, poi ti chiede se aggiornarlo o puntare a un altro progetto.
Altrimenti elenca i progetti che il tuo account vede e ti chiede di scegliere: il progetto non lo
deduce mai dal nome del repository. Un repository tiene un solo project profile — rifare la
discovery lo sostituisce, e prima di sostituirlo la skill dice cosa se ne va con lui.

**4 · Legge sei soggetti, in un ordine solo.**

| Cosa legge                                             | Perché servirà a una skill                                            |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| i work type, e come si annidano                        | così una skill propone work type che esistono, a livelli che esistono |
| gli status, e la forma del Jira Workflow               | così chi legge sa quali posizioni ha questo progetto                  |
| i campi obbligatori alla creazione, per work type      | così una bozza approvata non viene rifiutata in scrittura             |
| le board, e lo sprint attivo di ciascuna               | così la pianificazione degli sprint parla della realtà                |
| le fix version, con il loro stato                      | così niente viene assegnato a una che non esiste                      |
| lo stile del progetto — team-managed o company-managed | perché cambia quali campi esistono                                    |

**5 · Un'assenza è un rilievo, non un errore.** Un progetto senza board, una gerarchia di un solo
livello, nessun work type per un difetto: sono tutti esiti validi, scritti nel file e detti a voce
alta. Gli status sono il caso da aspettarsi, perché si leggono dai work item che li occupano — un
progetto che non ne contiene nessuno non ne espone nessuno, ed è lo stato di ogni progetto il
giorno in cui nasce. Il project profile allora dice che non erano ancora osservabili e che il
primo work item li renderà leggibili, e la discovery prosegue con il soggetto successivo.

**6 · Risolve ogni operazione nel tool che la serve.** I nomi dei tool MCP cambiano da una versione
all'altra del server, quindi nessuna skill se ne porta dietro uno: questa skill enumera quello che
il server configurato espone davvero e registra la corrispondenza. Tutto ciò che nessun tool
disponibile copre finisce in _Operazioni non supportate_ con il percorso manuale che prenderai al
suo posto — comprese le quattro operazioni che non hanno strada su nessuno dei due channel: creare
uno sprint, avviarlo, creare una fix version, rilasciarla o archiviarla.

**7 · Poi il gate, e il file.** Scrivere il project profile non è una scrittura su Jira, ma è una
modifica a un artefatto che tutto il team condivide, quindi passa dallo stesso draft gate — il
cancello che precede ogni scrittura su Jira — descritto nel
[processo di sviluppo](../development-process.it.md): il project profile completo in chat, il
progetto che descrive, quanto è stato trovato di ogni soggetto, e ogni operazione non supportata,
quest'ultima perché è quello che sorprende dopo. Approvi, chiedi modifiche e lo rivedi, oppure dici
di no.

Dire di no merita una frase a parte qui, perché questa è l'unica skill in cui un rifiuto non resta
locale alla cosa rifiutata. Non viene scritto niente, il che vuol dire che ogni altra skill del
plugin si fermerà al proprio primo passo rimandandoti qui — quindi te lo dice quando rifiuti,
invece di lasciartelo incontrare tre passi dopo, e lascia quello che ha trovato nella conversazione
invece di mettere il file in un posto più tranquillo.

All'approvazione scrive `.jira/project-profile.md`, creando la directory se serve e sovrascrivendo
il project profile che ci fosse già: di quel file è l'unica scrittrice, quindi non c'è niente da
fondere. Poi ti dice di committarlo, e perché.

## Scambio di esempio

**Tu**

> Il lavoro di questo repository lo tracciamo su Jira. Prepara il plugin.

**`jira-init`**

> Ho controllato i due channel prima di leggere qualsiasi cosa sul tuo progetto.
>
> Il server MCP risponde sotto l'id `atlassian`. La Jira CLI è installata ma non risponde: la
> credenziale non è visibile alla shell da cui la raggiungo. Quella shell legge `~/.zshenv` e mai
> `~/.zshrc`, quindi un token esportato nel file di avvio del tuo terminale funziona per te ed è
> invisibile qui.
>
> Non è un blocco. Posso scoprire adesso tutto quello che il server MCP raggiunge, e board, sprint
> e fix version restano registrate come **non lette su questa macchina** anziché come assenti.
> Vado avanti, o sistemiamo prima la CLI?

**Tu**

> Vai avanti, il token lo sistemo dopo.

**`jira-init`**

> Questi sono i progetti che il tuo account vede. In quale è tracciato il lavoro di questo
> repository? Dal nome del repository non lo deduco.
>
> | Chiave | Progetto          | Stile           |
> | ------ | ----------------- | --------------- |
> | PAY    | Payments Platform | company-managed |
> | INT    | Internal Tools    | team-managed    |
> | WEB    | Marketing Site    | team-managed    |

**Tu**

> PAY.

**`jira-init`**

> Scoperto su PAY, solo attraverso il server MCP:
>
> | Soggetto           | Trovato                                                |
> | ------------------ | ------------------------------------------------------ |
> | Work type          | 4 — Epic, Story, Task, Sub-task                        |
> | Gerarchia          | tre livelli, niente sopra Epic                         |
> | Status             | 4, osservati sui 37 work item che il progetto contiene |
> | Board e sprint     | non letti — il channel della CLI non ha risposto       |
> | Fix version        | non lette — lo stesso channel                          |
> | Operazioni risolte | 12 delle 17 che questo plugin usa                      |
>
> Due cose che incontrerai dopo, quindi te le dico adesso. Lo schema di questo progetto **non ha
> un work type per un difetto, per una richiesta grezza in attesa di refinement o per il debito
> tecnico**: tutti e tre finiranno sotto Task, e l'artefatto che li crea dirà a quale intento
> serve. E **nove operazioni qui non sono supportate**: cinque perché il channel della CLI non ha
> risposto, e tornano quando torna lui; quattro perché nessun tool le copre su nessuno dei due
> channel — creare uno sprint, avviarlo, creare una fix version, rilasciarla o archiviarla.
>
> Ecco il project profile completo. Approvalo e scrivo `.jira/project-profile.md`, oppure dimmi
> cosa cambiare.

**Tu**

> Già che ci sei, aggiungi un work type per i difetti?

**`jira-init`**

> No: questa skill legge soltanto. Work type, status, Jira Workflow, board e fix version sono
> dell'admin del tuo progetto, e qui dentro non se ne crea, rinomina o configura nessuno. Quello
> che il project profile fa invece è dichiarare l'assenza, così ogni skill che archivia un difetto
> sa che lo sta archiviando sotto Task e lo dice nel work item stesso.

**Tu**

> Chiaro. Approvato.

**`jira-init`**

> Scritto in `.jira/project-profile.md`. Committalo: è così che il resto del team, e ogni sessione
> futura, imparano gli stessi fatti senza richiederli a Jira. Quando la CLI risponderà, riesegui
> `jira-init` — le cinque operazioni che la aspettano tornano, e il project profile smette di dire
> «non letto».

## Il risultato

Il project profile come arriva nel repository. È l'unico file che questo plugin tiene in locale,
ed è ammesso perché viene letto.

```markdown
---
project_key: PAY
project_name: Payments Platform
site: https://example.atlassian.net
project_style: company-managed
discovered_at: 2026-09-05
discovered_by: jira-init 1.0.0
channels_read: mcp — il channel CLI non ha risposto; i suoi soggetti sono non letti, non assenti
---

# Project profile — PAY

Cosa sa fare davvero questo progetto Jira. Scritto da `jira-init`, letto da ogni altra skill.
Non modificarlo a mano: riesegui `jira-init`, così il file e Jira restano d'accordo.

## Work type

| Work type | Livello | Può essere figlio di | Note                                          |
| --------- | ------- | -------------------- | --------------------------------------------- |
| Epic      | 1       | nessuno              | Obbligatori alla creazione: Summary           |
| Story     | 0       | Epic                 | Obbligatori alla creazione: Summary, Reporter |
| Task      | 0       | Epic                 | Obbligatori alla creazione: Summary, Reporter |
| Sub-task  | -1      | Story, Task          | Obbligatori alla creazione: Summary, Parent   |

I livelli e i nomi sono quelli che dichiara questo progetto. Un work type assente da questa
tabella qui non esiste, e nessuna skill può proporlo.

### Intenti che nessun work type serve

Nessun work type nomina un difetto, nessuno nomina una richiesta grezza in attesa di refinement e
nessuno nomina il debito tecnico o un rischio. Tutti e tre vengono archiviati sotto Task, e
l'artefatto che li crea dichiara a quale intento serve.

## Gerarchia

Tre livelli. Epic contiene Story e Task, ed entrambi contengono Sub-task. Questo progetto non
dichiara niente sopra Epic.

## Status e transition

| Status      | Categoria   | Raggiungibile da      | Note                            |
| ----------- | ----------- | --------------------- | ------------------------------- |
| To Do       | To Do       | iniziale, In Progress |                                 |
| In Progress | In Progress | To Do, In Review      |                                 |
| In Review   | In Progress | In Progress           | Riservato al ruolo di revisione |
| Done        | Done        | In Review             |                                 |

Osservati sui 37 work item che il progetto contiene adesso.

Su Jira le transition sono valutate per work item, non per work type: questa tabella è la forma
del Jira Workflow, e le transition davvero disponibili si chiedono a Jira nel momento in cui se ne
tenta una.

## Board e sprint

**Non letti.** Il channel della Jira CLI non ha risposto su questa macchina, quindi non è mai
stato stabilito se questo progetto abbia una board. Non è la stessa cosa che non averne: la
risposta torna quando torna il channel.

## Fix version

**Non lette**, per lo stesso motivo e con lo stesso rimedio.

## Risoluzione delle operazioni

Quale tool serve ogni operazione, risolto a partire dai tool che il server MCP configurato espone
davvero. Le skill leggono questa tabella invece di portarsi dietro un nome di tool.

| Operazione                                                     | Channel | Tool o comando                     |
| -------------------------------------------------------------- | ------- | ---------------------------------- |
| elencare i progetti e i loro metadati                          | MCP     | `getVisibleJiraProjects`           |
| leggere i work type di un progetto                             | MCP     | `getJiraProjectIssueTypesMetadata` |
| leggere gli status e le transition disponibili di un work item | MCP     | `getTransitionsForJiraIssue`       |
| creare un work item                                            | MCP     | `createJiraIssue`                  |
| leggere un work item                                           | MCP     | `getJiraIssue`                     |
| modificare un work item                                        | MCP     | `editJiraIssue`                    |
| commentare un work item                                        | MCP     | `addCommentToJiraIssue`            |
| eseguire una transition su un work item                        | MCP     | `transitionJiraIssue`              |
| collegare due work item                                        | MCP     | `createIssueLink`                  |
| impostare il parent di un work item                            | MCP     | `editJiraIssue`, campo parent      |
| cercare work item con JQL                                      | MCP     | `searchJiraIssuesUsingJql`         |
| assegnare un work item a una fix version                       | MCP     | `editJiraIssue`, campo fix version |

## Operazioni non supportate

Operazioni che nessun tool disponibile copre in questa configurazione. Una skill che ne ha bisogno
annuncia il vuoto e passa il passo all'utente; non lo simula mai.

| Operazione                              | Perché                    | Percorso manuale                                             |
| --------------------------------------- | ------------------------- | ------------------------------------------------------------ |
| elencare le board                       | channel non raggiungibile | Guardare le board su Jira                                    |
| elencare gli sprint di una board        | channel non raggiungibile | Guardarli sulla board                                        |
| aggiungere work item a uno sprint       | channel non raggiungibile | Aggiungerli allo sprint dalla board                          |
| chiudere uno sprint                     | channel non raggiungibile | Chiuderlo dalla board                                        |
| elencare le fix version di un progetto  | channel non raggiungibile | Leggere le fix version su Jira                               |
| creare uno sprint                       | nessun tool esposto       | Crearlo sulla board, poi chiedere a `jira-plan` di riempirlo |
| avviare uno sprint                      | nessun tool esposto       | Avviarlo dalla board                                         |
| creare una fix version                  | nessun tool esposto       | Crearla su Jira, poi rieseguire `jira-init`                  |
| rilasciare o archiviare una fix version | nessun tool esposto       | Rilasciarla o archiviarla su Jira                            |

`channel non raggiungibile` è l'unico motivo qui che riguarda questa macchina e non il progetto:
l'operazione torna quando torna il channel.
```

Tre cose qui dentro contano dopo, e due sono assenze. **Board e sprint** dice _non letto_ e non
_nessuna_: la prima manda qualcuno a ripristinare un channel, la seconda a creare una board, e
sbagliare costa un pomeriggio. **Intenti che nessun work type serve** è dichiarato invece che
lasciato dedurre dalla tabella sopra, perché una skill che legge questo file agisce su quello che
c'è scritto e non va a controllare una tabella per capire cosa manca. E la tabella di **risoluzione
delle operazioni** è il motivo per cui nessuna skill contiene un nome di tool: quando la CLI
tornerà a rispondere, o quando un server futuro esporrà una delle quattro operazioni mancanti,
rieseguire `jira-init` chiude il vuoto senza cambiare una riga in nessuna skill.

## Cosa non fa

- **Creare o cambiare qualcosa su Jira.** Work type, status, Jira Workflow, board e fix version
  sono dell'admin del tuo progetto. Questa skill li legge, e non ne aggiunge, rinomina o configura
  nessuno.
- **Indovinare il progetto.** Elenca quello che il tuo account vede e chiede. Il nome del
  repository non è una prova.
- **Tenere due progetti.** Un repository, un project profile: il lavoro che si estende su due
  progetti Jira dallo stesso repository non è supportato, perché ogni skill agirebbe sul progetto
  scoperto per ultimo.
- **Scrivere «nessuna board» quando intende «non letto».** Un channel che non ha risposto non dice
  niente sul progetto, e il project profile tiene i due fatti separati.
- **Lasciare che un'altra skill ripari il project profile.** Ogni altra skill è una lettrice. Se
  una trova il project profile in disaccordo con Jira lo segnala e nomina questa skill; non
  corregge il file di nascosto, perché un project profile modificato da una skill che nessuno ha
  rivisto è esattamente la deriva che la regola dell'unica scrittrice esiste per evitare.
- **Dirti se il tuo ambiente riesce a raggiungere Jira.** Quello è
  [`/jira-doctor`](../commands/jira-doctor.it.md), e viene prima.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — la discovery e il project profile, il
  draft gate, i due channel, e dove si colloca la preparazione nel percorso completo.
- [`/jira-doctor`](../commands/jira-doctor.it.md) — da eseguire prima di questa skill: questa
  macchina riesce a raggiungere Jira?
- [`jira-capture`](jira-capture.it.md) — di solito la prima cosa da fare quando il project profile
  esiste: registrare una richiesta che nessuno ha ancora esaminato.
- [`jira-plan`](jira-plan.it.md) — la skill che risente di più di un project profile in cui il
  channel Agile risulta non letto.
