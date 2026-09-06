# `jira-propose` — proporre valore

<!-- skill-header:start -->

|                         |                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Nome**                | `jira-propose`                                                                         |
| **Versione**            | 1.0.0                                                                                  |
| **Invocabile per nome** | sì                                                                                     |
| **Channel**             | Atlassian MCP server                                                                   |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## Cosa fa

Mette agli atti un risultato che qualcuno vuole ottenere, in una forma che sopravvive a una
discussione sulle priorità. Chiede cosa diventa vero se il lavoro viene fatto, chi ne trae
beneficio e come ne soffre oggi, e da cosa si capirà che ha funzionato — poi chiede il dato o la
metrica che sta sotto a tutto questo, e separa ciò che è misurato da ciò che è creduto. La
proposta finita compare in chat, e su Jira non finisce niente finché non approvi.

Sono le domande di un Product Owner. Un backlog di soluzioni che nessuno riesce a ordinare viene
ordinato da chi discute più forte, e il risultato per cui il lavoro esisteva è la prima cosa che
sparisce.

## Quando si attiva · quando no

Si attiva quando vuoi che un risultato sia messo agli atti e difendibile per quello che è, prima
che qualcuno decida come raggiungerlo.

| Se dici qualcosa come                                       | La skill è                             |
| ----------------------------------------------------------- | -------------------------------------- |
| «vogliamo che i clienti vedano il loro storico»             | `jira-propose`                         |
| «è arrivata questa richiesta, nessuno l'ha ancora guardata» | [`jira-capture`](jira-capture.it.md)   |
| «l'export esce vuoto, va segnalato»                         | [`jira-diagnose`](jira-diagnose.it.md) |
| «adesso funziona, ma fra sei mesi ci si ritorce contro»     | [`jira-assess`](jira-assess.it.md)     |

Il confine con [`jira-capture`](jira-capture.it.md) è **il dato**. Riportare il desiderio di qualcun
altro senza proprio nessun dato dietro è intake — capture lo registra con le parole con cui è
arrivato e dichiara che è così — e resta intake per quanto chiaramente il risultato sia descritto.
Quella soglia si legge su tutto quello che è stato riportato, mai come un elenco di risposte da
spuntare, ed è più bassa di quanto sembri: **la supera un conteggio del sintomo, e un obiettivo non
serve.** _Una quarantina di chiamate il mese scorso_ basta, e la skill chiede poi da cosa si capirà
che ha funzionato — la misura è quello che questa skill va a stabilire, non quello che devi portarle
già pronto. Quello che non fa è fabbricare il risultato, il pubblico o la misura insistendo con le
domande.

Il confine a valle è [`jira-refine`](jira-refine.it.md). Proporre dichiara il valore e si ferma.
I criteri di accettazione, un perimetro abbastanza piccolo da poter essere finito e i figli che
la proposta implica appartengono al refinement, e produrli qui produrrebbe figli che nessuno ha
concordato.

## Come si usa

Non serve nominare la skill. Di' cosa vuoi che sia vero, e rispondi alle domande.

**1 · Legge prima il project profile.** Prima di chiedere qualsiasi cosa, `.jira/project-profile.md`
— il file che registra l'esito della discovery, cioè la lettura della configurazione reale del
progetto — le dice quali work type ha questo progetto, come si annidano, e quali campi sono
obbligatori alla creazione. Se il project profile manca si ferma e ti dice di eseguire `jira-init`:
non tira a indovinare. Prima di ogni altra cosa legge la tabella **Operazioni non supportate**, e
una voce lì dentro decide se questo intento può funzionare come è scritto: impostare il parent. Se
il project profile la registra come non supportata te lo senti dire adesso, con l'operazione
nominata e il percorso manuale, e non dopo una bozza che non puoi avere. Non è un ramo teorico: in
quell'elenco finisce quello che la discovery non è riuscita a risolvere **su questa
installazione** — nessun tool che la serva, un channel che non ha risposto, un account senza il
permesso — che è cosa diversa da un'operazione a cui gli strumenti non arrivano da nessuna parte.
Vedi [il processo di sviluppo](../development-process.it.md).

**2 · Fa le domande che fa un Product Owner.** Tre, e ognuna rifiuta un certo tipo di risposta:

| Chiede                                        | E non accetta                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| che risultato vuoi ottenere?                  | un elenco di funzionalità: chiede cosa renderebbero vero                 |
| chi ne trae beneficio, e oggi come ne soffre? | «gli utenti»: un pubblico a cui nessuno può andare a chiedere non è tale |
| come sapremo che ha funzionato?               | un'affermazione senza un'osservazione o un numero attaccati              |

Una proposta il cui autore non sa dire chi ne trae beneficio non è ancora una proposta, e dirlo
adesso costa meno che dirlo in una riunione in cui si stabiliscono le priorità.

**3 · Chiede il dato, e marca quello che manca.** È la richiesta che separa una proposta
dall'intake: per ogni affermazione verificabile, la misura o l'osservazione che ci sta sotto, e
come è stata ottenuta. Quello che resta senza niente dietro non viene buttato via né tenuto di
nascosto: finisce sotto **Assunzioni**, attribuito a chi lo sostiene, così che chi ordina le
proposte veda quale metà di questa è convinzione.

**4 · Sceglie un work type fra quelli del tuo progetto**, non da un elenco che si porta dietro.
Il work type si decide prima del parent, perché è lui a stabilire a quale livello della gerarchia
guarderà il passo successivo. Se lo schema del tuo progetto non ha un work type che nomini questo
intento, la skill archivia la proposta sotto un altro e l'artefatto stesso dice di quale intento
si tratta.

**5 · Colloca il work item sotto un parent nel momento in cui lo crea.** Il project profile dice
quali work type possono contenere quello scelto; la skill cerca su Jira i work item di quei tipi
e ti propone quello che trova. Collocarlo alla creazione è il punto: una gerarchia sistemata
dopo è una gerarchia che nel frattempo era sbagliata sulla board. Se la gerarchia del progetto
non ammette nessun parent per quel work type, o se nessun candidato va bene, lo dice e crea il
work item senza parent. Non inventa mai un contenitore in cui metterlo.

**6 · Poi il draft gate** — il cancello che precede ogni scrittura su Jira — **e qui è un artifact
gate**, la forma del gate che mostra il contenuto di un work item. Quello che approvi è quel
contenuto per intero, sezione per sezione. L'altra forma, l'operation gate, mostra un cambiamento a
ciò che esiste già — uno sprint riempito, del lavoro assegnato a una fix version, un work item
portato allo status successivo — e quando si scrive ex novo non si presenta mai. La proposta
completa compare in chat con le decisioni che porta con sé — titolo, work type, parent, ogni campo
che questo progetto marca obbligatorio e che la bozza ha lasciato vuoto, e, se la tua richiesta
portava un secondo intento che questa proposta non soddisfa, quell'intento e la skill che se ne
occupa, che subentra a scrittura fatta e ha un gate suo. Approvi, oppure chiedi modifiche e la
rivedi. Oppure dici di no, ed è una risposta: non viene scritto niente, ti viene detto cosa vale
adesso, non ti viene proposta una versione più magra sperando che passi quella, e un messaggio
successivo su altro non viene preso per un ripensamento. Questo intento aggiunge una cosa al gate:
quando il work item resterà senza parent, il gate dice perché.

**E il gate non si apre perché glielo chiedi.** _Crealo e basta_, _non mostrarmi niente prima_,
_vai pure_ — ognuna di queste frasi dice qualcosa sull'impazienza e niente sull'approvazione,
perché quello che si approva è un documento che ancora non esiste. La proposta viene presentata lo
stesso, tenuta corta, e la skill dice che è per questo. Una scrittura che non hai visto è una
scrittura che non hai approvato, per quanto tu l'abbia chiesta prima.

**7 · Dopo la scrittura, riporta quello che non è riuscito.** Se il work item viene creato ma il
parent non si riesce a impostare, te lo dice. Una proposta che sta al livello sbagliato è una
cosa che devi vedere, non un passo da ritentare in silenzio.

## Scambio di esempio

**Tu**

> La gente abbandona il checkout quando compare il costo di consegna. Lo voglio nel backlog prima
> di pianificare venerdì.

**`jira-propose`**

> Cosa deve diventare vero perché sia risolto? Raccontalo come un cambiamento per chi sta
> comprando, non come la schermata che costruiremmo.

**Tu**

> Devono sapere quanto costa la consegna prima di mettersi a digitare un indirizzo.

**`jira-propose`**

> Chi, esattamente? Qualcuno deve poter andare a chiederglielo, e «i clienti» è troppo generico
> per reggere un confronto con le altre proposte.

**Tu**

> Chi compra un singolo articolo di poco valore, dove la consegna pesa parecchio sul totale. E il
> supporto: rispondono alla stessa domanda tutta la settimana.

**`jira-propose`**

> Da cosa capiremmo che ha funzionato? Qualcosa che potrai guardare dopo e che puoi già guardare
> adesso.

**Tu**

> L'abbandono al passo dell'indirizzo. Adesso è al 34%.

**`jira-propose`**

> Il 34% da dove viene, e c'è qualcosa con cui confrontarlo?

**Tu**

> Dal report del funnel, ultimo trimestre pieno. Il percorso di chi ha già comprato è al 12% nello
> stesso periodo, e lì il costo si conosce prima di quel passo. Il supporto ha etichettato «costo
> di consegna» su 512 conversazioni in tre mesi.

**`jira-propose`**

> Dietro a tutto questo ci sono due affermazioni non misurate, e le voglio collocate invece che
> fatte passare: che sia la visibilità del costo a spiegare la differenza fra i due percorsi, e
> che chi ha abbandonato avrebbe comprato. Una delle due è verificata?

**Tu**

> No. Nessuno gliel'ha chiesto.

**`jira-propose`**

> Allora vanno sotto Assunzioni, attribuite a te, e i due numeri vanno sotto Evidenza. Questo
> progetto archivia una proposta così come Story, e qui Story sta sotto Epic. La ricerca ne ha
> restituiti due che possono contenerla: PROJ-31 «Checkout» e PROJ-58 «Prezzi e costi
> accessori».

**Tu**

> Checkout.

**`jira-propose`**

> Parent PROJ-31, allora. Il tuo progetto marca Team obbligatorio alla creazione e niente di
> quello che mi hai detto lo riempie, quindi la bozza lo segnala invece di tirare a indovinare.
> Ecco il testo completo: approvalo e lo scrivo, oppure dimmi cosa cambiare.

## Il risultato

La proposta come arriva su Jira. È Markdown, e arriva interpretato: intestazioni ed elenchi
sopravvivono alla scrittura.

```markdown
# Costo di consegna visibile prima di inserire l'indirizzo

## Risultato perseguito

Chi sta decidendo se comprare vede quanto gli costerà la consegna prima di impegnarsi a digitare
un indirizzo. La decisione che sta davvero prendendo — se ne vale la pena in totale — smette di
essere una decisione che può prendere solo alla fine.

## Chi ne trae beneficio

Chi compra un singolo articolo di poco valore, dove la consegna pesa molto sul totale. Oggi
arriva all'ultimo passo, vede il totale e se ne va; quelli che tornano dicono al supporto di aver
dato per scontato che il prezzo mostrato fosse il prezzo.

Anche il team di supporto, che risponde alla stessa domanda sul costo di consegna circa quaranta
volte a settimana.

## Come si misura il successo

La quota di sessioni abbandonate al passo dell'indirizzo, che adesso è il 34%. Una proposta che
avesse funzionato la porterebbe verso il 12% abbandonato al passo equivalente nel percorso di chi
ha già comprato, dove il costo è già noto.

Secondaria: il volume di domande sul costo di consegna che arrivano al supporto, contato dalle
etichette con cui il supporto classifica la propria coda.

## Evidenza

- L'abbandono al passo dell'indirizzo è al 34% sull'ultimo trimestre pieno, dal report del
  funnel; il percorso di chi ha già comprato, dove il costo si conosce prima, è al 12% nello
  stesso periodo.
- Il supporto ha registrato il termine «costo di consegna» su 512 conversazioni negli ultimi tre
  mesi, una media di 39 a settimana.

## Assunzioni

- Che sia la visibilità del costo a spiegare la differenza fra i due percorsi, e non il fatto che
  a seguire i due percorsi siano persone diverse. Sostenuta dal Product Owner; non verificata.
- Che chi abbandona avrebbe comprato se avesse visto il costo prima. Nessuno gliel'ha chiesto.

## Campi obbligatori non ancora compilati

- **Team** — questo progetto lo marca obbligatorio alla creazione, e quale team sia responsabile
  del percorso di acquisto non è stato deciso. Sollevato al draft gate invece che indovinato.
```

Lo scopo di questa proposta è la separazione fra **Evidenza** e **Assunzioni**. Due delle quattro
affermazioni sono verificabili e portano con sé come sono state ottenute; le altre due sono
convinzioni e lo dicono, con un nome accanto. È questo che permette di ordinarla rispetto a una
proposta le cui affermazioni sono tutte sostenute — ed è la differenza fra una proposta che
sopravvive alla riunione e una che dipende da chi in quel momento c'è nella stanza.

La misura è un confronto che esiste già, non un obiettivo inventato da qualcuno. Il 34% di oggi
contro il 12% di un percorso in cui il costo si conosce prima è un numero che la proposta non ha
scelto e non può addolcire.

Delle due sezioni facoltative che il template offre, una c'è e una no, per lo stesso motivo.
**Campi obbligatori non ancora compilati** c'è perché il progetto marca Team obbligatorio e le
risposte non lo coprivano. La sezione riservata a un work type che fa le veci di un intento che
il progetto non sa nominare non c'è, perché qui lo schema ne aveva uno adatto; dove non ce l'ha,
l'artefatto dice di quale intento si tratta, come mostra
[`jira-diagnose`](jira-diagnose.it.md). Una sezione con niente sotto si legge come una
dimenticanza, quindi si rimuove invece di lasciarla vuota.

## Cosa non fa

- **Decidere come il risultato verrà raggiunto.** Dichiara il valore e si ferma. Una proposta che
  arriva con la soluzione già attaccata la dà per decisa prima che qualcuno ne abbia discusso, ed
  è il risultato, non la soluzione, a dover reggere quando si stabiliscono le priorità.
- **Scrivere criteri di accettazione o stimare.** Sono entrambi di
  [`jira-refine`](jira-refine.it.md), dove la proposta va una volta che è stata scelta.
- **Scomporre la proposta nel lavoro che implica.** Anche questo è refinement, e farlo qui
  produce figli che nessuno ha concordato.
- **Far passare una convinzione per un fatto.** Un'affermazione senza niente dietro finisce sotto
  **Assunzioni** con il nome di chi la sostiene. Niente viene promosso in silenzio perché suona
  bene.
- **Inventare un parent in cui metterla.** Se la gerarchia del progetto non ne ammette nessuno per
  il work type scelto, il work item viene creato senza parent e il gate dice perché.
- **Scrivere qualcosa che non hai visto.** _Crealo e basta_ non è l'approvazione di una proposta
  che ancora non esiste, quindi non salta il gate: rende la bozza più corta, non assente.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, il draft gate, i
  due channel, e dove proporre valore si colloca nel percorso completo.
- [`jira-capture`](jira-capture.it.md) — per un desiderio riportato di seconda mano senza nessun
  dato dietro, nemmeno un conteggio del sintomo.
- [`jira-diagnose`](jira-diagnose.it.md) — per qualcosa che oggi è rotto.
- [`jira-assess`](jira-assess.it.md) — per qualcosa che oggi funziona e costerà al team più avanti.
- [`jira-refine`](jira-refine.it.md) — per trasformare una proposta approvata in qualcosa che un
  team può prendere in carico.
