# `jira-advance` — eseguire una transition

<!-- skill-header:start -->

|                         |                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Nome**                | `jira-advance`                                                                         |
| **Versione**            | 1.0.0                                                                                  |
| **Invocabile per nome** | sì                                                                                     |
| **Channel**             | Atlassian MCP server                                                                   |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## Cosa fa

Porta un work item a un altro status. Prima di proporti qualsiasi cosa chiede a Jira cosa quel
work item può fare in quel momento — per quel work item, non per il suo work type — e offre
esattamente quello che è tornato, con i nomi che Jira usa. Niente viene dedotto da una tabella di
status, dal work type o da un diagramma disegnato da questo plugin.

Quando una transition che ti aspettavi non è nell'elenco, dice quale delle due cose manca: una
condizione che questo work item non soddisfa, oppure una strada che questo Jira Workflow non ha.
Sulla prima puoi intervenire tu, la seconda la cambia solo un amministratore del progetto, e un
report che dice «non disponibile» senza dire quale delle due ti manda a parlare con la persona
sbagliata.

Una transition è una scrittura piccola, e piccola non è un motivo per eseguirla senza fartela
vedere. Qualunque cosa tu abbia detto prima — _spostalo e basta_, _vai_ — l'operazione te la trovi
davanti lo stesso: il work item, lo status in cui si trova, lo status a cui arriverà. Approvi
qualcosa che hai visto, e mostrare una transition è breve.

## Quando si attiva · quando no

Si attiva quando un singolo work item deve arrivare a uno status diverso: farlo partire, affidarlo
a qualcun altro, rimandarlo indietro, chiuderlo.

| Se dici qualcosa come                      | La skill è                                                          |
| ------------------------------------------ | ------------------------------------------------------------------- |
| «PROJ-118 è uscito dalla review, chiudilo» | `jira-advance`                                                      |
| «rimetti PROJ-118 nel backlog»             | `jira-advance` oppure [`jira-plan`](jira-plan.it.md) — te lo chiede |
| «a che punto è PROJ-118?»                  | [`jira-inspect`](jira-inspect.it.md)                                |
| «metti questi quattro nello sprint»        | [`jira-plan`](jira-plan.it.md)                                      |
| «togli PROJ-118 dallo sprint»              | [`jira-plan`](jira-plan.it.md)                                      |
| «chiudi lo sprint, abbiamo finito»         | [`jira-plan`](jira-plan.it.md)                                      |
| «c'è ancora qualcosa di bloccato?»         | [`jira-inspect`](jira-inspect.it.md)                                |

Due confini, e una parola sta su tutti e due. **Chiudere** è una transition quando a essere chiuso
è un work item, e questa skill la esegue; è tutt'altra cosa quando a essere chiuso è uno sprint, e
lì [`jira-plan`](jira-plan.it.md) riporta cosa è stato consegnato e dove va il lavoro rimasto
aperto. L'altro confine non è il numero ma cosa cambia: qui uno status, là l'appartenenza a uno
sprint. Mettere un work item in uno sprint o toglierlo da uno è di
[`jira-plan`](jira-plan.it.md), che sia un work item o venti. Chiedere a che punto sono le cose non
cambia niente ed è di [`jira-inspect`](jira-inspect.it.md).

**E un nome non dice di che genere sia.** `Backlog` in certi Jira Workflow è uno status, ed è
anche il nome del posto in cui un work item sta quando non è in nessuno sprint. Il primo è una
transition ed è di questa skill; il secondo è un collocazione, è di [`jira-plan`](jira-plan.it.md)
ed è una delle mosse che quella skill ti restituisce. Questa non lo decide preferendo il genere che
possiede: legge il tuo project profile e, se combaciano tutti e due, ti chiede quale intendevi. La
regola, e lo stesso problema per `2.4` e `To Do`, è nel
[processo di sviluppo](../development-process.it.md).

## Come si usa

Nomina il work item e di' dove vuoi che arrivi. Non devi sapere quali transition esistono: è la
domanda che la skill fa a Jira.

**1 · Legge prima il project profile**, il file che registra l'esito della discovery, cioè la
lettura della configurazione reale del progetto. `.jira/project-profile.md` le dà la chiave del
progetto e lo strumento che esegue una transition, risolto dal project profile invece che scritto
dentro la skill. Se il project profile manca, si ferma e ti dice di eseguire `jira-init`. Vedi
[il processo di sviluppo](../development-process.it.md).

**La prima cosa che apre in quel file è _Operazioni non supportate_.** Se eseguire una transition è
elencata lì — nessun tool risolto in questa configurazione, l'account non abilitato, oppure il
channel che la serve, cioè la via con cui una skill parla a Jira, che non ha risposto quando è
stata fatta la discovery — te lo senti dire subito, con l'operazione nominata e il percorso manuale
che il project profile registra, e non ti viene chiesto altro. Arrivare a quel limite al momento
della scrittura butterebbe via tutto lo scambio che ci ha portato, e non è nemmeno un motivo per
rivolgersi all'altro channel: un'operazione ha un channel solo e nessun ripiego.

**Poi risolve il nome che hai usato, prima di farci qualsiasi cosa.** Dici `Backlog`, o `To Do`, o
`2.4`, e un nome non dice di che genere sia; l'instradamento che ha scelto questa skill è avvenuto
prima che qualcuno leggesse un project profile. Con il project profile in mano lo può stabilire. Se
combacia un genere solo, la domanda non la vedi nemmeno. Se ne combaciano due, ti chiede quale,
dicendo cosa farebbe ciascuno — e non risolve verso uno status per il fatto che gli status sono
quello che sposta. Se non ne combacia nessuno, ti dice cosa il tuo progetto ha davvero, perché un
nome che non c'è è più spesso un refuso o un project profile vecchio che una cosa da andare a
creare.

Se nomini una board la risposta è ancora più netta. Una board è un filtro sui work item, e niente
di quello che i due channel offrono toglie un work item da una board: te lo dice così, come un gap
dichiarato, invece di darti la transition possibile più vicina.

Il project profile registra anche la forma del Jira Workflow, e da lì **non viene mai offerta
nessuna transition**. Quella tabella non è la fonte di quello che un work item può fare oggi: può
essere incompleta, perché gli status si osservano solo dove del lavoro esiste già e un progetto
che non contiene niente non ne espone nessuno — e anche completa, non conosce la condizione che
rifiuterà una transition. Qui ha un uso solo, al punto 4, e quell'uso è spiegare un'assenza, non
proporre una presenza.

**2 · Chiede a Jira cosa può fare questo work item, in questo momento.** Le transition si valutano
per work item, non per work type: due work item dello stesso work type, fermi nello stesso status,
possono offrire transition diverse, perché contano le condizioni, i permessi e i campi del work
item stesso.

**3 · Offre solo quello che è tornato**, con i nomi che Jira usa. Una transition che non è in
quell'elenco non viene offerta, per quanto ragionevole suoni.

**4 · Spiega un'assenza.** Quando ti aspetti una transition che non c'è, dice di quale dei due
casi si tratta:

- **il work item** — una condizione sulla transition non è soddisfatta: un campo obbligatorio, un
  permesso, lo status di qualcosa da cui il work item dipende. Su questo puoi intervenire.
- **il Jira Workflow** — da questo status quella transition non esiste affatto, per nessuno. Una
  strada che non c'è la aggiunge solo un amministratore del progetto.

Li distingue confrontando due cose che ha già. Il project profile registra quale status è
raggiungibile da quale — la **forma** del tuo Jira Workflow, che è a cosa serve quella tabella — e
la risposta di Jira su questo work item registra cosa è disponibile **adesso**. Nominata nella
forma e assente dalla risposta di Jira vuol dire che la strada c'è e che qualcosa di questo work
item la sta chiudendo. Assente da entrambe vuol dire che la strada non c'è. Quello che ti viene
offerto non cambia in nessuno dei due casi: la tabella spiega perché qualcosa manca, non aggiunge
mai niente a quello che Jira ha restituito.

Dove il profilo non può rispondere — status non ancora osservabili perché il progetto non contiene
work item, o una tabella che registra come non letta — dice che la causa qui non è stabilibile, ti
dà il percorso manuale, e nomina `jira-init` se una nuova discovery riempirebbe la tabella.
Nominare una causa a indovinare ti manderebbe a riparare qualcosa che non è rotto, ed è peggio che
non nominarla.

**5 · Poi il draft gate**, il cancello che precede ogni scrittura su Jira, e qui un **operation
gate**, la forma che mostra un cambiamento a ciò che esiste già. Non si redige niente: il work item
c'è prima che tu cominci, quindi non c'è nessun documento da mostrarti e quello che approvi è il
cambiamento stesso. Il work item, lo status in cui si trova, lo status che la transition dichiara
di raggiungere, cosa eseguirla **non** farà là dove potresti ragionevolmente aspettartelo e — se la
tua frase chiedeva due cose — la metà che questa non fa e la skill che se ne occupa. Se il work
item è in mano a qualcun altro, il gate lo dice invece di eseguire la transition in silenzio.
Approvi, oppure chiedi altro e rivedi la scelta. Le due forme del cancello sono nel
[processo di sviluppo](../development-process.it.md).

**Chiedere di saltare il gate non lo salta.** _Spostalo e basta_, _vai_, _non mostrarmi niente_: è
impazienza, e l'impazienza non approva niente, perché quello che approveresti è una cosa che non
hai visto. Quindi l'operazione ti viene mostrata lo stesso, tenuta più corta che si può, e la
skill dice perché. Qui capita più che altrove, perché una transition sembra troppo piccola per
meritare un cancello: è una scrittura come le altre, e dopo la verità è Jira.

Se dici di no non viene scritto niente. Ti viene detto cosa vale adesso — il work item è nello
status in cui era già — e non ti viene proposta una transition più piccola sperando che passi
quella.

La scrittura passa dall'Atlassian MCP server. Una skill raggiunge un channel solo portando la
stringa esatta di quel channel fra i tool che dichiara, e questa porta `mcp__atlassian` e non
`Bash(jira:*)`: la Jira CLI non le è disponibile affatto.

**6 · Dopo, rilegge lo status.** Lo status che riporta è quello che Jira restituisce dopo la
scrittura, non quello che la transition dichiarava. Quasi sempre i due coincidono. Quando non
coincidono, perché il Jira Workflow ha portato il work item oltre lo status che la transition
nomina, il report dice dov'è davvero.

## Scambio di esempio

**Tu**

> PROJ-118 è uscito dalla review. Chiudilo — non serve che mi mostri niente, spostalo e basta.

**`jira-advance`**

> La mossa te la mostro comunque prima di eseguirla. Quella parte resta: è breve, e in un
> cambiamento che non hai visto non c'è niente da approvare.
>
> Ho chiesto a Jira cosa può fare PROJ-118 adesso. È in **In Review**, e tornano due transition:
>
> | Transition       | Status dichiarato |
> | ---------------- | ----------------- |
> | Request changes  | In Progress       |
> | Send to sign-off | Awaiting sign-off |
>
> Fra queste non ce n'è nessuna che arrivi a Done. Una cosa prima che tu scelga: PROJ-118 è
> assegnato a qualcun altro, quindi qualunque delle due prendi, stai eseguendo una transition su
> un work item che ha in mano un'altra persona.

**Tu**

> Done dovrebbe esserci. Chiudiamo le cose direttamente dalla review tutti i giorni.

**`jira-advance`**

> Nel Jira Workflow esiste, quindi questa è l'assenza che riguarda il work item e non il Jira
> Workflow: la transition verso Done è rifiutata finché PROJ-118 ha un link di blocco non risolto,
> e ne ha uno — PROJ-90, in In Progress. Su questo puoi intervenire. Non rimuovo io la condizione
> per far passare la transition; quando PROJ-90 è risolto richiedimelo, e rileggo cosa offre Jira
> invece di dare per buono questo elenco.

**Tu**

> Allora rimettilo nel backlog e lo ripianifichiamo.

**`jira-advance`**

> In questo progetto quel nome lo portano due cose diverse, e non prendo io quella che mi
> appartiene. **Backlog** è uno status del tuo Jira Workflow, e lì ci arriverei con una transition.
> Il backlog è anche il posto in cui un work item sta quando non è in nessuno sprint, e metterci
> PROJ-118 vuol dire toglierlo dallo sprint che lo contiene: quello è un collocazione, è di
> [`jira-plan`](jira-plan.it.md), ed è una mossa che quella skill ti restituisce, perché togliere
> lavoro da uno sprint non è disponibile su nessuno dei due channel. Quale dei due intendevi?

**Tu**

> Lo status.

**`jira-advance`**

> Allora è l'altro tipo di assenza: questo Jira Workflow non ha nessuna transition da In Review a
> Backlog, per nessuno. Non è una condizione che puoi soddisfare — una strada che non c'è la
> aggiunge solo un amministratore del progetto. Da In Review esistono le due qui sopra.

**Tu**

> Request changes, allora.

**`jira-advance`**

> **PROJ-118 · I filtri salvati si possono condividere con un gruppo**
>
> In Review → **Request changes**, che dichiara In Progress. Il work item è assegnato a un'altra
> persona. Quello che questo non fa è chiudere PROJ-118, né avvicinarlo a Done: Done resta
> rifiutata finché PROJ-90 è aperto, e la condizione non la rimuovo io per farci passare la
> transition. Questo è il passo che mi avevi chiesto di saltare, ed è tutto qui. La eseguo?

**Tu**

> Sì, eseguila.

**`jira-advance`**

> Eseguita. Rileggo lo status invece di darlo per scontato: PROJ-118 è in **Rework**, non in In
> Progress — la transition dichiara In Progress e questo Jira Workflow l'ha portato oltre. Done e
> Backlog restano dov'erano: la prima aspetta PROJ-90, la seconda una strada che il Jira Workflow
> non ha.

## Il risultato

Il report come arriva in chat, una volta eseguita la transition. Non viene scritto niente da
nessuna parte se non su Jira.

```text
PROJ-118 · I filtri salvati si possono condividere con un gruppo
https://<tuo-sito>.atlassian.net/browse/PROJ-118

  Transition eseguita   Request changes
  Status prima          In Review
  Status dichiarato     In Progress
  Status adesso         Rework             riletto da Jira dopo la scrittura

  Non offerte da In Review, e perché
    Done      il work item       condizione non soddisfatta — bloccato da PROJ-90 (In Progress)
    Backlog   il Jira Workflow   da In Review quella transition non esiste, per nessuno
```

La riga che conta meno è quella che dice che la transition è stata eseguita. **Status adesso** è
riletto da Jira invece che copiato da quello che la transition dichiarava, ed è l'unico motivo per
cui il report resta giusto anche nel caso in cui il Jira Workflow abbia portato il work item da
un'altra parte. E le due assenze sono registrate con la loro causa attaccata: una è una condizione
che qualcuno può andare a soddisfare, l'altra è una strada che solo un amministratore del progetto
può aggiungere. Se avessero letto soltanto che Done «non è disponibile», in due avrebbero passato
il pomeriggio nei due posti sbagliati.

## Cosa non fa

- **Proporre una transition a partire dal project profile.** Il project profile registra la forma
  del Jira Workflow, e l'unica cosa per cui questa skill lo legge è distinguere le due cause di
  un'assenza. Non risponde mai alla domanda su cosa questo work item può fare adesso.
- **Offrire una transition che Jira non ha restituito**, per quanto ragionevole suoni — compresa
  quella che hai appena chiesto per nome.
- **Saltare il gate perché glielo hai chiesto.** _Spostalo e basta_ dice quanto vuoi che ci metta,
  non che approvi. L'operazione ti viene mostrata, in breve, e poi eseguita.
- **Decidere al posto tuo di che genere è il nome che hai usato.** Se nel tuo progetto `Backlog` o
  `To Do` combaciano sia con uno status sia con qualcos'altro, te lo chiede. Risolvere verso lo
  status perché gli status sono quello che sposta sembrerebbe sapere e sarebbe un lancio di moneta.
- **Togliere un work item da una board.** Non è disponibile su nessuno dei due channel e nessuna
  transition è la stessa mossa, quindi te lo dice netto invece di darti la cosa possibile più
  vicina.
- **Riempire un campo obbligatorio per far passare una transition rifiutata.** Dice qual è la
  condizione non soddisfatta e si ferma lì. La condizione è del progetto, e uno strumento che la
  soddisfa da sé la svuota di significato.
- **Eseguire una transition su un work item che ha in mano qualcun altro senza dirlo.** Se glielo
  chiedi la esegue; quello che non fa è eseguirla in silenzio.
- **Concatenare più transition per arrivare a uno status lontano.** Ognuna è una decisione, e un
  Jira Workflow che ne richiede tre per arrivare dove stai andando ti sta dicendo qualcosa che
  vale la pena sentire.
- **Rivolgersi alla Jira CLI quando il tool MCP manca.** Un'operazione ha un channel solo. Se il
  project profile non ha risolto nessun tool per la transition, te lo dice e ti passa la via
  manuale.
- **Pianificare, fare refinement, riportare.** Decidere quando il lavoro viene affrontato è di
  [`jira-plan`](jira-plan.it.md) — compreso mettere un singolo work item in uno sprint o toglierlo
  da uno — rendere pronto un work item è di [`jira-refine`](jira-refine.it.md), rispondere a che
  punto sono le cose è di [`jira-inspect`](jira-inspect.it.md).

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, il draft gate, i
  due channel, e dove una transition si colloca nel percorso completo.
- [`jira-inspect`](jira-inspect.it.md) — per leggere a che punto è un work item, e cosa lo blocca,
  senza cambiare niente.
- [`jira-plan`](jira-plan.it.md) — per decidere quando il lavoro viene affrontato, per mettere un
  work item in uno sprint o toglierlo da uno, e per chiudere uno sprint.
- [`jira-refine`](jira-refine.it.md) — per rendere pronto un work item, invece di portarlo allo
  status successivo.
