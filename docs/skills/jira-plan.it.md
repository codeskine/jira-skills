# `jira-plan` — decidere quando si affronta il lavoro

<!-- skill-header:start -->

|                         |                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Nome**                | `jira-plan`                                                                                                           |
| **Versione**            | 1.0.0                                                                                                                 |
| **Invocabile per nome** | sì                                                                                                                    |
| **Channel**             | Atlassian MCP server · Jira CLI                                                                                       |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian" and the jira CLI authenticated. |

<!-- skill-header:end -->

## Cosa fa

Decide **quando** si affronta il lavoro. Legge gli sprint della board da Jira e non dal ricordo che
qualcuno ne ha, controlla ogni work item che vuoi pianificare rispetto al livello preteso
dall'intento con cui è stato scritto, e porta l'insieme intero nello sprint in una sola operazione
approvata.

Chiudere uno sprint è la stessa skill. Riporta cosa è stato consegnato e cosa no leggendo lo status
di ciascun work item, non la memoria della stanza, e ti fa dire dove va tutto quello che resta
aperto prima che lo sprint gli si chiuda sopra. Le domande sono quelle di uno Scrum Master: un
piano fatto su quello che la board contiene davvero regge l'impatto con la settimana, uno fatto su
quello che tutti davano per scontato no.

Tre cose non le può fare affatto: creare uno sprint, avviarlo, e togliere lavoro da uno. Nessuna
delle tre è disponibile su nessuno dei due channel — la via con cui una skill parla a Jira —
quindi tornano tutte e tre a te invece di essere simulate; e per la terza ti consegna la decisione
presa e una mossa da fare, non un rifiuto.

## Quando si attiva · quando no

Si attiva quando la domanda è _quando_, e la risposta è uno sprint.

| Se dici qualcosa come                              | La skill è                           |
| -------------------------------------------------- | ------------------------------------ |
| «metti questi quattro nello sprint»                | `jira-plan`                          |
| «chiudi lo Sprint 24, venerdì finiamo»             | `jira-plan`                          |
| «togli KAN-12 dallo sprint, rimettilo nel backlog» | `jira-plan`                          |
| «mettilo nel backlog per bene» (un'idea nuova)     | [`jira-propose`](jira-propose.it.md) |
| «questi tre devono uscire nella 2.4»               | [`jira-release`](jira-release.it.md) |
| «PROJ-121 non è pronto perché qualcuno lo prenda»  | [`jira-refine`](jira-refine.it.md)   |
| «fai partire PROJ-99, me ne occupo io»             | [`jira-advance`](jira-advance.it.md) |
| «come sta andando lo sprint?»                      | [`jira-inspect`](jira-inspect.it.md) |

Due di questi confini vale la pena dirli ad alta voce. Lo sprint dice _quando_ si affronta il
lavoro, la fix version dice _cosa esce insieme_: sono assi ortogonali, e confonderli è il modo in
cui il «quando» diventa in silenzio il «cosa». E un work item che non è pronto resta non pronto:
`jira-plan` te lo dice prima di pianificarlo, e non lo rende pronto passando.

**Backlog sono due parole in una.** Detto di un work item che esiste già — _rimetti KAN-12 nel
backlog_ — nomina il posto in cui un work item sta quando non è in nessuno sprint. Lì non si scrive
niente: l'operazione intera è tirarlo fuori dallo sprint, ed è una delle tre mosse che questa skill
ti restituisce. Detto di un'idea che nessuno ha ancora scritto — _mettilo nel backlog per bene_ —
vuol dire registrala: è una proposta, non il collocamento di qualcosa che esiste già, ed è
[`jira-propose`](jira-propose.it.md), o [`jira-capture`](jira-capture.it.md) se è arrivata da
qualcun altro. A separarli è se la cosa è già registrata, non la parola.

Leggere uno sprint senza cambiarlo è di [`jira-inspect`](jira-inspect.it.md). Ma una richiesta che
legge uno sprint **e poi cambia quello stesso sprint** — «fammi vedere cosa resta e togli i
bloccati» — è una sola operazione, non due, ed è di questa skill fin dall'inizio.

«Quello stesso» non è un riempitivo. Se leggi un contenitore e ne cambi uno **diverso** — «cosa c'è
nella 4.10 finora? quello non ancora iniziato toglilo dallo sprint corrente» — torna a essere due
intenti e non uno: la fix version ti viene risposta per prima, il cambio sullo sprint ti viene
nominato accanto alla risposta, e per quello c'è un'approvazione a sé. Vedi
[il processo di sviluppo](../development-process.it.md) su cosa succede quando una frase chiede due
cose.

[`jira-inspect`](jira-inspect.it.md) ti manda qui anche per una domanda che ha bisogno della board
stessa — quali board esistono, o uno sprint che il project profile non nomina. La Jira CLI non ce
l'ha, questa skill sì.

## Come si usa

Nomina lo sprint e i work item, oppure chiedi di chiudere quello in corso. Niente si muove finché
non hai approvato l'operazione intera.

**1 · Legge prima il project profile.** `.jira/project-profile.md` fornisce la chiave del progetto
e le board. Se il project profile — il file che registra l'esito della discovery, cioè la lettura
della configurazione reale del progetto — manca, la skill si ferma e ti dice di eseguire
`jira-init`. Vedi [il processo di sviluppo](../development-process.it.md). Quello che conta qui è
che sulle board il project profile può dire tre cose diverse, e non sono la stessa risposta:

| Il project profile dice                                  | Cosa segue                                                                                                                                                                            |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| le board, elencate                                       | procede                                                                                                                                                                               |
| nessuna board                                            | è un rilievo, non un errore: nomina le operazioni che di conseguenza non sono disponibili e si ferma. Qui niente ha un sostituto.                                                     |
| board non lette — il channel Agile non era raggiungibile | lo dice, dà il rimedio adatto alla causa che ha davanti, e si ferma. Non afferma niente sull'esistenza di una board: la domanda non è mai stata posta. Torna quando torna il channel. |

**2 · Se la Jira CLI non è raggiungibile, è la causa a decidere il rimedio.** `jira me` fallisce
per due motivi diversi, e nominare il rimedio sbagliato ti manda contro un muro. Quale dei due sia
viene stabilito prima di prescrivere qualsiasi cosa:

| Cos'è che non va davvero                                                                                                                                                                                                                                                                                                                                                                         | Il rimedio                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **La credenziale non è visibile alla shell che usano le skill.** Una skill raggiunge la CLI attraverso una shell **non interattiva**, e quale file di avvio una shell così legga — ammesso che ne legga uno — dipende dalla shell. Un token esportato da un file che legge solo una shell interattiva funziona nel tuo terminale ed è invisibile qui: sembra identico a una CLI mai configurata. | Esportalo dal file che legge la forma non interattiva della tua shell: `~/.zshenv` sotto zsh, un file diverso sotto bash, e sotto fish non è affatto un file. Quale sia la tua shell lo stabilisce [`/jira-doctor`](../commands/jira-doctor.it.md) prima di nominare un file. La skill ti riporta il file e la riga, e non modifica mai il tuo dotfile al posto tuo. |
| **La configurazione della CLI non è mai stata generata.**                                                                                                                                                                                                                                                                                                                                        | `jira init`, e solo in questo caso. Viene **dopo**: si autentica mentre gira, quindi senza la credenziale risponde `401 Unauthorized` e non scrive niente.                                                                                                                                                                                                           |

I due casi si distinguono, non si tirano a indovinare: una CLI installata, configurata e solo
spenta da una credenziale mancante non è una CLI mai configurata, e il report non dirà che lo è.

**3 · Legge la board da Jira ogni volta.** Quali board esistono, quali sprint ha ciascuna e quale
sprint è attivo. Uno sprint chiuso ieri è esattamente il tipo di dato che una risposta ricordata
sbaglia, e pianificare contro quella butta via la riunione per cui il piano è stato fatto.

**4 · Tre passi tornano a te.** Creare uno sprint, avviarlo e togliere lavoro da uno sono **gap
dichiarati**: non sono disponibili su nessuno dei due channel, nelle versioni di server e CLI a cui
questo plugin si rivolge. Sono tre problemi distinti e vengono consegnati a te allo stesso modo:

| Il gap                 | Cosa fa invece la skill                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| creare uno sprint      | riempie e chiude gli sprint ma non ne apre uno: ti chiede di crearlo sulla board, e prosegue quando esiste                                  |
| avviare uno sprint     | uno sprint che esiste già come `future` non può essere portato ad `active`: lo riempie e lo chiude, e ti chiede di avviarlo tu sulla board  |
| togliere lavoro da uno | `jira sprint` sa aggiungere, chiudere ed elencare, e non sa rimuovere: nomina il work item e dove sta andando, e la mossa sulla board è tua |

E al suo posto non viene tentato niente attraverso l'Atlassian MCP server. Che il Jira del tuo
progetto permetta a quel server di scrivere il campo Sprint è un fatto della tua configurazione, non
qualcosa che una skill possa dare per scontato, quindi il plugin lo tratta come assente — e comunque
la mappa che assegna le operazioni ai channel non prevede ripieghi: un'operazione ha un solo
channel, e quando quel channel non ha niente per lei il passo torna a te.

Un gap non è un channel che è giù. Un gap vale ovunque e dura finché non cambia il tooling; una CLI
non raggiungibile non è supportata qui e ora, non dice niente sul tuo progetto, e torna quando
torna il channel. Sono annunciati entrambi, ma solo il primo è permanente. Se un futuro MCP server
esporrà una di queste operazioni, la discovery lo registrerà e il gap si chiuderà senza toccare
nessuna skill.

**5 · Riempire: quello che non è pronto viene segnalato prima di essere pianificato.** Ogni work
item è controllato rispetto ai criteri universali, più quello che aggiunge l'intento con cui è
stato scritto. Uno sprint contiene lavoro di ogni intento — la segnalazione di un difetto, un
debito registrato, una proposta di valore — e ciascuno è stato scritto per il proprio livello:
chiedere a una segnalazione di difetto i criteri di accettazione di un work item raffinato è un
controllo sbagliato, non un controllo severo. Quello che non regge viene nominato, con ciò che gli
manca, **prima** di entrare. Puoi pianificarlo lo stesso: è una decisione, ed è giusto che la
prenda tu sapendo, invece che la prenda lo strumento al posto tuo.

**6 · Chiudere: ogni work item non finito riceve una destinazione, e la riceve prima.** Lo sprint
successivo, il backlog, o qualcosa che nomini tu. Un work item lasciato senza risposta alla chiusura
sparisce dal piano senza che nessuno l'abbia scelto, ed è l'unico esito da cui una review non si
riprende — quindi le destinazioni si stabiliscono e ti vengono mostrate prima che qualcosa si
chiuda, mai dopo. Nominate dopo sarebbero un resoconto e non una decisione.

Chiudere è l'unica scrittura, ed è grossolana: il comando prende uno sprint e nient'altro, quindi
dove un work item non finito atterri davvero lo decide Jira e non questa skill. Te lo dice al
cancello e non dopo, e il resoconto nomina gli spostamenti che restano tuoi.

**7 · Poi [il draft gate](../development-process.it.md)** — il cancello che precede ogni scrittura
su Jira, e qui un **operation gate**, la forma che mostra un cambiamento a ciò che esiste già. Qui non si scrive niente ex novo, quindi quello che
approvi è il cambiamento e non un documento: ogni work item che tocca, cosa cambia di ciascuno,
cosa sarà vero dopo, e cosa l'operazione **non** farà là dove potresti ragionevolmente
aspettartelo. Riempire uno sprint mostra ogni work item che si sposterà e, fra quelli, ogni work
item non raffinato; chiuderne uno mostra lo sprint, cosa è stato consegnato e cosa no, la
destinazione stabilita per ogni work item non finito, e senza giri di parole che chiudere è tutto
quello che questa skill fa. Una sola approvazione copre l'insieme — dieci conferme per una sola
decisione è il modo in cui si smette del tutto di pianificare con lo strumento. Se una parte
dell'operazione fallisce, riporta quali work item si sono spostati e quali no, e si ferma lì: non
annulla gli altri di sua iniziativa.

**Dire di no chiude la cosa.** Non si muove niente, e ti viene detto cosa vale adesso: lo sprint
com'era, il lavoro dov'era. Non ti viene riproposta una lista più corta sperando che passi quella,
e un messaggio successivo su altro non viene letto come un ripensamento.

## Scambio di esempio

**Tu**

> Lunedì parte lo Sprint 25. Mettici PROJ-118, PROJ-120, PROJ-121 e PROJ-88 — l'88 sta bloccando
> due cose nel 24.

**`jira-plan`**

> Leggo il project profile per la board, poi chiedo a Jira cosa contiene adesso quella board.
>
> Board Delivery: lo Sprint 24 è attivo fino a venerdì, e lo Sprint 25 esiste come `future`.
> Questo ci risparmia un passo: da qui non posso creare uno sprint, e questo c'è già.
>
> Adesso controllo i tuoi quattro rispetto al livello per cui ciascuno è stato scritto.

**`jira-plan`**

> Tre sono pronti, uno no.
>
> | Work item | Scritto come               | Verdetto                                                                                                                  |
> | --------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
> | PROJ-118  | segnalazione di un difetto | pronto — passi, risultato atteso ed effettivo, il log verbatim, impatto, frequenza                                        |
> | PROJ-120  | work item raffinato        | pronto — criteri di accettazione concordati, una dipendenza collegata                                                     |
> | PROJ-88   | work item raffinato        | pronto                                                                                                                    |
> | PROJ-121  | un titolo e una riga       | **non pronto** — nessun criterio di accettazione, e l'affermazione su come si comportano oggi i preset non porta evidenza |
>
> A PROJ-118 non chiedo criteri di accettazione: è la segnalazione di un difetto e non è mai stata
> pensata per portarli. PROJ-121 può entrare lo stesso, se lo vuoi dentro. È
> [`jira-refine`](jira-refine.it.md) che lo rende pronto — non gli scrivo i criteri passando di lì.

**Tu**

> Tienilo dentro. I criteri li scriviamo lunedì mattina, prima che qualcuno lo prenda.

**`jira-plan`**

> Allora l'operazione è questa, con PROJ-121 registrato come entrato non raffinato. Approvala ed
> eseguo l'insieme intero, oppure dimmi cosa cambiare.

**Tu**

> Vai.

**`jira-plan`**

> Quattro spostati, nessuno fallito. Resta una cosa ed è tua: lo Sprint 25 è ancora `future`, e
> avviarlo non è disponibile su nessuno dei due channel. Avvialo sulla board Delivery e hai
> pianificato.

## Il risultato

Ti arrivano due blocchi, e quello che conta è il primo — l'operazione esattamente come la presenta
il gate, prima che si muova qualcosa.

```text
Sprint 25 — board Delivery — future, parte lunedì
Entrano: 4 work item

  PROJ-118   L'export pianificato produce un file vuoto se l'intervallo attraversa il cambio di mese
  PROJ-120   I destinatari scelgono quali colonne contiene un export
  PROJ-121   Preset di export                                          <- non pronto
  PROJ-88    Le definizioni delle colonne si leggono all'avvio e non si aggiornano più

Non pronti, pianificati lo stesso su tua richiesta:
  PROJ-121   nessun criterio di accettazione; l'affermazione sul comportamento attuale non
             porta evidenza

Questa operazione non tocca altro: nessuna transition viene eseguita, nessuna fix version
viene assegnata, e il backlog resta nell'ordine in cui è.

Approvi ed eseguo?
```

Poi, una volta approvata, cosa è successo davvero:

```text
Sprint 25 — 4 su 4 spostati

  PROJ-118  dentro    PROJ-120  dentro    PROJ-121  dentro    PROJ-88  dentro

Resta a te:  lo Sprint 25 è `future`. Avviarlo non è disponibile su nessuno dei due channel —
             avvialo sulla board Delivery.
```

Quello che rende utile il primo blocco è dove compare PROJ-121: nell'elenco di cosa si sposterà, e
di nuovo nell'elenco di cosa non è pronto. Una segnalazione fatta a sprint già pieno è una nota che
non legge nessuno; fatta qui è una decisione che prendi tu, e l'operazione che approvi porta
l'eccezione per iscritto. La riga sotto fa lo stesso lavoro dall'altro lato: cosa l'operazione non
farà — nessuna transition, nessuna fix version, nessun riordino — sta scritto dove puoi ancora
rifiutarlo, invece di scoprirlo dopo. Il secondo blocco riporta quattro scritture fatte sotto una
sola approvazione: se una fosse fallita, direbbe quali si sono spostate e quali no e si fermerebbe
lì, perché se un risultato parziale si tiene o si annulla lo decidi tu. E la riga che resta, resta:
non viene finta. Avviare uno sprint non è qualcosa che questo plugin possa fare, quindi dice di chi
è il compito invece di inventare qualcosa che assomigli a uno sprint avviato.

## Cosa non fa

- **Creare uno sprint, avviarlo, o togliere lavoro da uno.** Nessuna delle tre è disponibile su
  nessuno dei due channel. Ti chiede di farle sulla board — e per la terza prima ti nomina il work
  item e dove sta andando, così quello che fai lì è una mossa sola e non un rebus. E non mette una
  label o una convenzione di nomi al posto dello sprint che manca.
- **Rendere pronto un work item.** Dice cosa manca e nomina [`jira-refine`](jira-refine.it.md). I
  criteri di accettazione scritti mentre si entra in uno sprint sono criteri che non ha concordato
  nessuno.
- **Decidere cosa esce insieme.** Lo sprint e la fix version sono assi ortogonali; l'altro se lo
  tiene [`jira-release`](jira-release.it.md).
- **Eseguire una transition.** Pianificare mette il lavoro dentro uno sprint. Far partire un work
  item, passarlo a qualcun altro o chiuderlo è [`jira-advance`](jira-advance.it.md).
- **Riordinare un backlog secondo un proprio giudizio di priorità.**
- **Chiudere uno sprint sopra lavoro non finito senza chiedere dove va ciascun work item.** Il
  silenzio alla chiusura toglie lavoro dal piano senza che nessuno l'abbia scelto.
- **Insistere dopo un no.** Un'operazione rifiutata non viene scritta, ti viene detto cosa vale
  adesso al suo posto, e non ne arriva una versione più piccola da approvare.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, i due channel e i
  gap che dichiarano, il draft gate, e dove la pianificazione si colloca nel percorso completo.
- [`jira-refine`](jira-refine.it.md) — per rendere pronto un work item prima di pianificarlo.
- [`jira-release`](jira-release.it.md) — per decidere cosa esce insieme, che è l'altro asse.
- [`jira-advance`](jira-advance.it.md) — per portare un singolo work item allo status successivo.
- [`jira-inspect`](jira-inspect.it.md) — per leggere cosa contiene uno sprint senza cambiarne
  niente.
