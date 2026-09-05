# `jira-release` — decidere cosa viene rilasciato insieme

<!-- skill-header:start -->

|                         |                                                                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome**                | `jira-release`                                                                                                                                                                |
| **Versione**            | 1.0.0                                                                                                                                                                         |
| **Invocabile per nome** | sì                                                                                                                                                                            |
| **Channel**             | Atlassian MCP server · Jira CLI                                                                                                                                               |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". Listing fix versions needs the jira CLI authenticated; assigning work to one does not. |

<!-- skill-header:end -->

## Cosa fa

Si occupa della fix version: cosa viene rilasciato insieme. Elenca le fix version che il progetto
ha davvero, con il loro stato, assegna work item a una di esse, e mostra cosa ne contiene una e
quanto di quello è ancora aperto come base di un cambiamento che approvi. Due cose non le può fare — creare una fix version, rilasciarla o
archiviarla — e le dichiara prima che tu le chieda, restituendole a te su Jira.

È la domanda di un Release Manager, fatta nell'unico momento in cui serve. Sapere cosa vuol dire
rilasciare prima di rilasciare è il lavoro; scoprirlo dopo ha un nome, e non è un bel nome.

## Quando si attiva · quando no

Si attiva quando la domanda è cosa viene rilasciato insieme.

| Se dici qualcosa come                              | La skill è                           |
| -------------------------------------------------- | ------------------------------------ |
| «assegna questi due alla 2.4»                      | `jira-release`                       |
| «quali fix version ha questo progetto?»            | `jira-release`                       |
| «cosa c'è nella 2.4? mettici anche questi due»     | `jira-release`                       |
| «cosa c'è davvero nella 2.4?»                      | [`jira-inspect`](jira-inspect.it.md) |
| «metti questi due nello sprint»                    | [`jira-plan`](jira-plan.it.md)       |
| «questo è troppo grosso perché qualcuno lo prenda» | [`jira-refine`](jira-refine.it.md)   |
| «a che punto è lo sprint?»                         | [`jira-inspect`](jira-inspect.it.md) |

Due confini vanno detti apertamente.

**Con [`jira-inspect`](jira-inspect.it.md).** Una domanda che si limita a chiedere — _cosa c'è
nella 2.4 e quanto di quello è ancora aperto_ — è di `jira-inspect`, che legge e si ferma.
`jira-release` legge la stessa cosa come apertura di una conversazione che finisce in
un'assegnazione che hai approvato: se chiedi il contenuto e il cambiamento nello stesso respiro
sei qui, non là. Sull'asse dello sprint il confine corre allo stesso modo, così la regola da
imparare è una e non due.

Una domanda la prende solo `jira-release`: l'**elenco** delle fix
version che il progetto ha, e lo stato di ciascuna. Quell'elenco appartiene alla Jira CLI, e
`jira-inspect` non la dichiara.

**Con [`jira-plan`](jira-plan.it.md).** «Esce con la 2.4» e «è nello Sprint 25» sono due fatti
indipendenti sullo stesso work item. La fix version dice con cosa viene rilasciato, lo sprint dice
quando viene affrontato, e nessuna delle due skill deduce l'uno dall'altro. È il malinteso da cui
guardarsi qui, ed è quello che fa uscire mezza funzionalità.

## Come si usa

Di' di quale fix version stai parlando, oppure chiedi quali ci sono.

**1 · Legge prima il project profile**, il file che registra l'esito della discovery, cioè la
lettura della configurazione reale del progetto. `.jira/project-profile.md` registra le fix
version che questo progetto ha e il loro stato. Se manca, si ferma e ti dice di eseguire
`jira-init`: non tira a indovinare. Vedi [il processo di sviluppo](../development-process.it.md).

**2 · Dice cosa non può fare prima che tu glielo chieda.** Creare una fix version, e rilasciarla o
archiviarla, non sono disponibili su nessuno dei due channel — le due vie con cui una skill parla
a Jira — nelle versioni di server e CLI a cui questo plugin punta. È un buco degli strumenti, non
un limite di ambizione della skill, e viene annunciato all'inizio invece che scoperto alla fine:
quelle due le fai tu su Jira, e la skill prosegue con il resto. Non approssima mai il rilasciare
con una transition o con una label.

**3 · Elenca le fix version come le tiene il progetto**, con il loro stato, non come qualcuno
ricorda di averle pianificate. Una fix version rilasciata la settimana scorsa e una che non è mai
stata creata suonano identiche in una conversazione e non si somigliano per niente su una board.

L'elenco è la metà di questa skill che ha bisogno della Jira CLI; l'assegnazione no, perché la fix
version è un campo sul work item e i campi passano dall'MCP server. Quindi, quando il project
profile registra le fix version come _non lette_ — il channel Agile non era raggiungibile quando è
stata fatta la discovery, che non è la stessa cosa che il progetto non ne abbia — la skill dice
che l'elenco non è stato letto, dà il rimedio che corrisponde alla causa (una credenziale che la
shell non interattiva non vede e una configurazione mai generata sono due guasti diversi, e
`jira init` è il rimedio solo per il secondo; stanno tutti e due nel
[processo di sviluppo](../development-process.it.md)), e ti chiede il nome della fix version
invece di offrirti una scelta che non è in grado di compilare. Un'assegnazione a un nome che non
esiste fallisce, quindi tirando a indovinare non viene creato niente.

**4 · Mostra cosa contiene una fix version, e quanto di quello è ancora aperto.** I work item
assegnati raggruppati per categoria di status: è la risposta a «cosa vuol dire rilasciare
questa», e te la dà prima che tu la chieda. Prima di rilasciare, quelli ancora aperti sono
elencati uno per uno con il loro status — mai come conteggio, perché un conteggio invita a
leggere il resto come poca roba.

**5 · Assegnare è una modifica, non una transition.** Niente cambia status perché è stato
assegnato a una fix version, niente viene pianificato in uno sprint perché lo è, e un work item
che è già in uno sprint ci resta.

**6 · Poi il draft gate**, il cancello che precede ogni scrittura su Jira. Quello che questo
intento aggiunge: il gate elenca ogni work item la cui fix version cambierà, e quale sarà dopo.
Un insieme assegnato in blocco è una sola azione approvata su più scritture — se una parte
fallisce ti viene detto quale è riuscita e quale no, e niente viene annullato di iniziativa della
skill.

## Scambio di esempio

**Tu**

> Giovedì prossimo dovremmo rilasciare la 2.4. Cosa c'è dentro davvero?

**`jira-release`**

> Leggo il project profile per le fix version, poi le elenco dal progetto.
>
> Due cose subito, così giovedì non sono una sorpresa: questo plugin non può creare una fix
> version, e non può rilasciarla né archiviarla. Nessuno dei due channel espone quelle operazioni,
> quindi rilasciare la 2.4 tocca a te su Jira. Tutto il resto lo faccio io.
>
> | Fix version | Stato          | Assegnati |
> | ----------- | -------------- | --------- |
> | 2.3         | rilasciata     | 14        |
> | 2.4         | non rilasciata | 9         |
> | 2.5         | non rilasciata | 2         |
>
> **2.4 — 9 work item assegnati, 6 in Done.** I tre che non lo sono, uno per uno:
>
> | Work item | Status      | Titolo                                            |
> | --------- | ----------- | ------------------------------------------------- |
> | PROJ-118  | In Review   | Budget di retry sul worker di consegna            |
> | PROJ-124  | In Progress | Intervalli di export a cavallo del cambio di mese |
> | PROJ-129  | To Do       | Tracciamento delle modifiche ai permessi          |

**Tu**

> 131 e 132 sono nello Sprint 25, quindi stanno anche nella 2.4, no?

**`jira-release`**

> No, e Jira le tiene separate apposta. Lo Sprint 25 dice quando vengono affrontati; la fix
> version dice con cosa vengono rilasciati. Al momento nessuno dei due porta una fix version, ed
> essere nello sprint non gliene assegnerà mai una. Li vuoi nella 2.4?

**Tu**

> Sì, tutti e due.

**`jira-release`**

> Allora scrivo questo:
>
> | Work item | Fix version adesso | Dopo |
> | --------- | ------------------ | ---- |
> | PROJ-131  | nessuna            | 2.4  |
> | PROJ-132  | nessuna            | 2.4  |
>
> Due modifiche, una sola approvazione. Nessuna delle due cambia uno status, e tutti e due restano
> nello Sprint 25: sono campi diversi e io ne tocco uno. Approva e li scrivo, oppure dimmi cosa
> cambiare.

**Tu**

> Vai.

**`jira-release`**

> Scritti tutti e due. PROJ-131 e PROJ-132 adesso portano la fix version 2.4, che arriva così a 11
> work item assegnati e 5 ancora aperti.

**Tu**

> Bene. Allora giovedì la rilasciamo.

**`jira-release`**

> Quella parte tocca a te: nessun channel qui la espone, e non la sostituisco con una transition o
> con una label. Cinque degli undici sono ancora aperti oggi, e nessuno si chiude perché gli ho
> assegnato una fix version: questa skill modifica un campo e si ferma lì. Quello che vuoi sia
> vero di quei cinque giovedì va reso vero prima di rilasciare la 2.4, oppure deciso su Jira nel
> momento in cui la rilasci.

## Il risultato

La risposta come arriva in chat. Su Jira è stato scritto un campo su due work item; quello che
leggi è la fix version com'è adesso.

```text
Fix version 2.4 — non rilasciata, 11 work item assegnati

  Done         6    PROJ-105, PROJ-109, PROJ-112, PROJ-117, PROJ-121, PROJ-126
  In Progress  3    PROJ-118, PROJ-124, PROJ-132
  To Do        2    PROJ-129, PROJ-131

Ancora aperti, uno per uno:
  PROJ-118   In Review     Budget di retry sul worker di consegna
  PROJ-124   In Progress   Intervalli di export a cavallo del cambio di mese
  PROJ-129   To Do         Tracciamento delle modifiche ai permessi
  PROJ-131   To Do         Rate limit sull'endpoint di ricerca pubblico
  PROJ-132   In Progress   Migrazione delle definizioni dei report salvate

Scritti in questa operazione:  PROJ-131, PROJ-132 → fix version 2.4  (riusciti entrambi)
Non disponibile qui:           rilasciare la 2.4 — si fa su Jira
```

Sono due dettagli a reggere questo report. Il lavoro ancora aperto è elencato per chiave, status e
titolo invece che contato, perché «ne restano cinque» è un numero con cui si convive e cinque
titoli no. E l'ultima riga c'è anche se non è fallito niente: l'operazione di cui questa
conversazione parlava davvero è quella che il plugin non può eseguire, e un report che si fermasse
alle scritture riuscite si leggerebbe come se giovedì fosse a posto.

## Cosa non fa

- **Rilasciare o archiviare una fix version**, con nessuno dei mezzi che ha, e non sostituisce
  quel gesto con una transition o con una label. Nessuno dei due channel lo espone: si fa su Jira.
- **Creare una fix version.** Stesso buco e stessa risposta: creala su Jira, poi torna qui e
  assegnale del lavoro.
- **Pianificare un work item in uno sprint** perché appartiene a una fix version. Quello è
  [`jira-plan`](jira-plan.it.md), ed è una decisione che nessuno ha ancora preso.
- **Eseguire una transition.** Assegnare è la modifica di un campo; portare un work item allo
  status successivo è [`jira-advance`](jira-advance.it.md).
- **Dare per finito** il lavoro ancora aperto prima che tu rilasci, o toglierlo dall'elenco
  contando su quello.
- **Rispondere con un conteggio** dove la risposta è l'elenco.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, il draft gate, i
  due channel con i buchi che dichiarano, e dove sta, nel percorso intero, la decisione su cosa
  viene rilasciato.
- [`jira-plan`](jira-plan.it.md) — per l'altro asse: quando il lavoro viene affrontato.
- [`jira-inspect`](jira-inspect.it.md) — per leggere cosa contiene una fix version senza poter
  cambiare niente.
- [`jira-refine`](jira-refine.it.md) — per rendere un work item qualcosa che un team può prendere
  in carico, prima di contare sul fatto che esca.
