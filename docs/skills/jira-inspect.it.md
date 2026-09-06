# `jira-inspect` — leggere a che punto sono le cose

<!-- skill-header:start -->

|                         |                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Nome**                | `jira-inspect`                                                                         |
| **Versione**            | 1.0.0                                                                                  |
| **Invocabile per nome** | sì                                                                                     |
| **Channel**             | Atlassian MCP server                                                                   |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## Cosa fa

Risponde a una domanda sullo stato senza cambiarne nessuno. Come procedono un parent e i suoi
figli, cosa resta nello sprint, cos'è bloccato e da cosa, cosa contiene una fix version e quanto
di quello è ancora aperto. Riporta prima i conteggi, poi i work item che portano la risposta, e
dice quando la risposta è vuota invece di non restituire niente.

È l'unica skill qui che non scrive mai, e [il draft gate](../development-process.it.md) — il
cancello che precede ogni scrittura su Jira — la nomina come sua unica eccezione. Ne ha due forme:
l'artifact gate, che mostra il contenuto di un work item che sta per essere creato, e l'operation
gate, che mostra un cambiamento a ciò che esiste già. Questa skill non produce né l'uno né l'altro.

## Quando si attiva · quando no

Si attiva quando vuoi una risposta, non un cambiamento.

| Se dici qualcosa come                          | La skill è                           |
| ---------------------------------------------- | ------------------------------------ |
| «a che punto è lo sprint?»                     | `jira-inspect`                       |
| «porta PROJ-14 in review»                      | [`jira-advance`](jira-advance.it.md) |
| «metti questi quattro nello sprint»            | [`jira-plan`](jira-plan.it.md)       |
| «cosa manca prima di poter rilasciare la 2.4?» | `jira-inspect`                       |
| «quali fix version ha questo progetto?»        | [`jira-release`](jira-release.it.md) |
| «assegna questi alla 2.4»                      | [`jira-release`](jira-release.it.md) |
| «cosa c'è nella 2.4? mettici anche questi due» | [`jira-release`](jira-release.it.md) |
| «quali fix version ha questo progetto?»        | [`jira-release`](jira-release.it.md) |

La fix version è il confine che vale la pena dire apertamente, e l'asse è su cosa verte la
domanda. Il lavoro **dentro** una fix version — cosa contiene, quanto di quello è ancora aperto —
è di questa skill, allo stesso modo in cui lo è leggere uno sprint. La **version stessa** è di
[`jira-release`](jira-release.it.md): quali ne ha il progetto, e se una sia già stata rilasciata o
archiviata. Quell'elenco sta sulla Jira CLI, che questa skill non dichiara — e assegnare lavoro a
una version o toglierlo è un cambiamento, che questa skill comunque non fa.

`jira-release` prende anche la domanda che legge una fix version e poi la cambia, nello stesso
respiro. Sull'asse dello sprint il confine corre allo stesso modo, così la regola da imparare è una
e non due: «fammi vedere cosa resta nello sprint e togli i bloccati» è una sola operazione e
appartiene a [`jira-plan`](jira-plan.it.md) fin dall'inizio.

Per il resto lo schema tiene: una domanda è questa skill, un'istruzione è una delle altre tre. Se
chiedi un cambiamento mentre stai leggendo una risposta, `jira-inspect` non lo fa e non si offre di
farlo: un'offerta accettata nello stesso respiro di una domanda è una scrittura che nessun draft
gate ha visto. Quello che fa invece è nominare la skill che se ne occupa e consegnarle la
richiesta. La fermata riguarda quello che questa skill scrive, cioè niente, non il punto in cui
finisce quello che hai chiesto.

## Come si usa

Fai la domanda. Non c'è niente da approvare e niente da annullare.

**1 · Legge prima il project profile**, il file che registra l'esito della discovery, cioè la
lettura della configurazione reale del progetto. `.jira/project-profile.md` fornisce la chiave del
progetto, gli status con le loro categorie, e le board e le fix version a cui la domanda si
riferisce. Se il project profile manca, si ferma e ti dice di eseguire `jira-init`. Vedi
[il processo di sviluppo](../development-process.it.md).

**2 · Risponde cercando.** Quattro forme coprono quasi tutto quello che viene chiesto:

| Se chiedi di    | Riporta                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| un parent       | i suoi figli, i loro status, e cosa resta                               |
| uno sprint      | cosa contiene raggruppato per categoria di status, e cosa non è partito |
| cos'è bloccato  | i work item con link di blocco non risolti, e cosa li blocca            |
| una fix version | cosa le è assegnato, e quanto di quello è ancora aperto                 |

**3 · Legge attraverso un channel solo.** Tutto quello che c'è in quella tabella è una ricerca, e
la ricerca sta sull'Atlassian MCP server. La Jira CLI qui non è semplicemente inutilizzata: una
skill raggiunge un channel — la via con cui una skill parla a Jira — solo portandone la stringa
esatta in `allowed-tools`, e `jira-inspect` porta `mcp__atlassian` e non `Bash(jira:*)`. Il channel
Agile è quindi fuori portata, per quanto chiaramente un suo passo possa descriverlo. È deliberato
— nessuna domanda che puoi farle può arrivare a un comando che chiude uno sprint — e non c'è
nemmeno una scorciatoia, perché la mappa dei channel non porta nessun ripiego da un channel
all'altro: un'operazione ha un channel e nessun sostituto.

Così una domanda che richiede la superficie Agile viene consegnata a chi la tiene, invece di
ricevere una risposta peggiore. Quali board ha il progetto, o uno sprint che il project profile non
nomina, vanno a [`jira-plan`](jira-plan.it.md), che quel channel lo tiene; una fix version che il
project profile non nomina va a [`jira-release`](jira-release.it.md).

**4 · Riporta i vuoti come rilievi.** Uno sprint che non contiene niente, una fix version a cui
non è assegnato niente e un parent senza figli sono tre risposte diverse, e ciascuna è più utile
del silenzio. Dove una categoria di status lascia un work item ambiguo, lo dice invece di
sceglierne una.

Un tipo di vuoto però non è affatto un rilievo, e il project profile lo tiene separato. Board e fix
version vi sono registrate in uno di tre stati: elencate, nessuna, oppure **non lette** — il
channel che le serve non ha risposto quando la discovery è stata eseguita. «Questo progetto non ha
fix version» è una risposta sul tuo progetto. «Nessuno l'ha chiesto» è una risposta su un channel:
non stabilisce niente sul progetto, e torna quando torna il channel. Leggere la seconda come la
prima ti manda a creare qualcosa che forse esiste già.

## Scambio di esempio

**Tu**

> Come sta andando lo sprint? Giovedì abbiamo la review.

**`jira-inspect`**

> Leggo il project profile per la board e lo sprint attivo, poi cerco.

> **Sprint 24 — 11 work item, giorno 7 su 10**
>
> | Categoria di status | Conteggio | Work item                              |
> | ------------------- | --------- | -------------------------------------- |
> | Done                | 4         | PROJ-98, PROJ-101, PROJ-104, PROJ-110  |
> | In Progress         | 3         | PROJ-99, PROJ-107, PROJ-112            |
> | To Do               | 4         | PROJ-102, PROJ-103, PROJ-113, PROJ-115 |
>
> Quattro non sono partiti, con lo sprint al giorno 7 su 10. Due di questi, PROJ-113 e PROJ-115,
> sono bloccati: entrambi aspettano PROJ-88, che non è in questo sprint ed è in To Do.
>
> PROJ-107 è in uno status che questo progetto non mappa su nessuna categoria: l'ho lasciato in
> In Progress qui sopra e te lo segnalo, invece di decidere al posto tuo.

**Tu**

> Allora tirali fuori, 113 e 115.

**`jira-inspect`**

> Quella è una modifica allo sprint, e questa skill legge soltanto. La consegno a
> [`jira-plan`](jira-plan.it.md), che se ne occupa: la fermata riguarda quello che scrivo io, cioè
> niente, non il punto in cui finisce quello che hai chiesto. Una cosa da aspettarsi lì: togliere
> lavoro da uno sprint non è disponibile su nessuno dei due channel, quindi `jira-plan` nominerà
> PROJ-113 e PROJ-115 e dove stanno andando, e la mossa sulla board è tua.

## Il risultato

La risposta come arriva in chat. Non c'è nessun artefatto e su Jira non viene scritto niente.

```text
Sprint 24 — 11 work item, giorno 7 su 10

  Done         4    PROJ-98, PROJ-101, PROJ-104, PROJ-110
  In Progress  3    PROJ-99, PROJ-107, PROJ-112
  To Do        4    PROJ-102, PROJ-103, PROJ-113, PROJ-115

Non partiti, al giorno 7 su 10:  PROJ-102, PROJ-103, PROJ-113, PROJ-115
Bloccati:                        PROJ-113, PROJ-115 — entrambi su PROJ-88 (To Do, fuori sprint)
Ambigui:                         PROJ-107 — status "Awaiting sign-off", nessuna categoria
```

Quello che rende usabile questa risposta sono le ultime tre righe. I soli conteggi avrebbero
detto che lo sprint è a due terzi con un terzo fatto: vero, e non dice a nessuno cosa fare
giovedì. Il bloccante è fuori dallo sprint, quindi nessuna lettura dello sprint lo avrebbe
trovato — e lo status ambiguo è riportato invece che risolto, perché le categorie appartengono al
progetto e questa skill non le reinterpreta.

## Cosa non fa

- **Scrivere alcunché.** Nessuna creazione, modifica, transition, link o assegnazione.
- **Offrire una scrittura come passo successivo.** Se chiedi un cambiamento, nomina la skill che
  se ne occupa e le consegna la richiesta, invece di farlo lei.
- **Calcolare una metrica che il tuo progetto non tiene** — velocity, burndown, una data di fine
  prevista. Una stima prodotta da chi legge la board è un numero senza proprietario, e verrà
  citato come se ne avesse uno.
- **Raggiungere il channel Agile.** Non è una regola che si dà: porta `mcp__atlassian` e non
  `Bash(jira:*)`, quindi da qui quel channel non è proprio raggiungibile. Board e sprint si
  leggono dal project profile e da campi ricercabili.
- **Parlare per la fix version in sé** — quali ne ha il progetto, se una sia stata rilasciata o
  archiviata. Quell'elenco sta sulla Jira CLI ed è di [`jira-release`](jira-release.it.md). Questa
  skill legge il lavoro dentro una version, non la version.
- **Restituire tutte le righe.** Prima i conteggi, poi i work item che portano la risposta. Un
  report che nessuno legge fino in fondo è un report fallito.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, i due channel, e
  perché la skill di sola lettura ne rifiuta uno.
- [`jira-advance`](jira-advance.it.md) — per portare un singolo work item allo status successivo.
- [`jira-plan`](jira-plan.it.md) — per cambiare cosa contiene uno sprint, e per le domande che
  richiedono il channel Agile.
- [`jira-release`](jira-release.it.md) — per la fix version in sé: quali ne ha il progetto, se una
  sia stata rilasciata o archiviata, e per cambiare cosa ne contiene una.
