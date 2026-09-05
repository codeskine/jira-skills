# `jira-inspect` — leggere a che punto sono le cose

<!-- skill-header:start -->

|                         |                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------- |
| **Nome**                | `jira-inspect`                                                                        |
| **Versione**            | 1.0.0                                                                                 |
| **Invocabile per nome** | sì                                                                                    |
| **Channel**             | Atlassian MCP server                                                                  |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## Cosa fa

Risponde a una domanda sullo stato senza cambiarne nessuno. Come procedono un parent e i suoi
figli, cosa resta nello sprint, cos'è bloccato e da cosa, cosa contiene adesso una fix version.
Riporta prima i conteggi, poi i work item che portano la risposta, e dice quando la risposta è
vuota invece di non restituire niente.

È l'unica skill qui che non scrive mai. In questa pagina non c'è nessun draft gate perché non
c'è niente da sottoporre a un cancello.

## Quando si attiva · quando no

Si attiva quando vuoi una risposta, non un cambiamento.

| Se dici qualcosa come                          | La skill è                            |
| ---------------------------------------------- | ------------------------------------- |
| «a che punto è lo sprint?»                     | `jira-inspect`                        |
| «porta PROJ-14 in review»                      | [`jira-advance`](jira-advance.it.md)  |
| «metti questi quattro nello sprint»            | [`jira-plan`](jira-plan.it.md)        |
| «cosa manca prima di poter rilasciare la 2.4?» | `jira-inspect`                        |
| «assegna questi alla 2.4»                      | [`jira-release`](jira-release.it.md)  |

Lo schema: una domanda è questa skill, un'istruzione è una delle altre tre. Se chiedi un
cambiamento mentre stai leggendo una risposta, `jira-inspect` nomina la skill che se ne occupa e
si ferma — non si offre di farlo lei, perché un'offerta accettata nello stesso respiro di una
domanda è una scrittura che nessun cancello ha visto.

## Come si usa

Fai la domanda. Non c'è niente da approvare e niente da annullare.

**1 · Legge prima il project profile.** `.jira/project-profile.md` fornisce la chiave del
progetto, gli status con le loro categorie, e le board e le fix version a cui la domanda si
riferisce. Se il project profile manca, si ferma e ti dice di eseguire `jira-init`. Vedi
[il processo di sviluppo](../development-process.it.md).

**2 · Risponde cercando.** Quattro forme coprono quasi tutto quello che viene chiesto:

| Se chiedi di      | Riporta                                                                       |
| ----------------- | ------------------------------------------------------------------------------ |
| un parent         | i suoi figli, i loro status, e cosa resta                                     |
| uno sprint        | cosa contiene raggruppato per categoria di status, e cosa non è partito       |
| cos'è bloccato    | i work item con link di blocco non risolti, e cosa li blocca                  |
| una fix version   | cosa le è assegnato, e quanto di quello è ancora aperto                       |

**3 · Legge attraverso un channel solo.** Tutto quello che c'è sopra è una ricerca, quindi
`jira-inspect` non tocca mai la Jira CLI: non la dichiara nemmeno. È deliberato — nessuna domanda
che puoi farle può arrivare a un comando che chiude uno sprint. La conseguenza è che una domanda
che richiede la superficie Agile — quali board ha il progetto, o uno sprint che il project
profile non nomina — riceve un onesto «da qui non posso rispondere» e il nome di
[`jira-plan`](jira-plan.it.md), che quel channel lo tiene.

**4 · Riporta i vuoti come rilievi.** Uno sprint che non contiene niente, una fix version a cui
non è assegnato niente e un parent senza figli sono tre risposte diverse, e ciascuna è più utile
del silenzio. Dove una categoria di status lascia un work item ambiguo, lo dice invece di
sceglierne una.

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

> Quella è una modifica allo sprint, e questa skill legge soltanto. Se ne occupa
> [`jira-plan`](jira-plan.it.md): chiedile di svuotare quei due dallo Sprint 24 e ti mostrerà
> l'operazione prima di eseguirla.

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
  se ne occupa e si ferma lì.
- **Calcolare una metrica che il tuo progetto non tiene** — velocity, burndown, una data di fine
  prevista. Una stima prodotta da chi legge la board è un numero senza proprietario, e verrà
  citato come se ne avesse uno.
- **Raggiungere il channel Agile.** Board e sprint si leggono dal project profile e da campi
  ricercabili, mai dalla Jira CLI.
- **Restituire tutte le righe.** Prima i conteggi, poi i work item che portano la risposta. Un
  report che nessuno legge fino in fondo è un report fallito.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, i due channel, e
  perché la skill di sola lettura ne rifiuta uno.
- [`jira-advance`](jira-advance.it.md) — per portare un singolo work item allo status successivo.
- [`jira-plan`](jira-plan.it.md) — per cambiare cosa contiene uno sprint, e per le domande che
  richiedono il channel Agile.
- [`jira-release`](jira-release.it.md) — per cambiare cosa contiene una fix version.
