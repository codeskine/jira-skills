# `jira-assess` — registrare un debito tecnico o un rischio

<!-- skill-header:start -->

|                         |                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Nome**                | `jira-assess`                                                                          |
| **Versione**            | 1.0.0                                                                                  |
| **Invocabile per nome** | sì                                                                                     |
| **Channel**             | Atlassian MCP server                                                                   |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## Cosa fa

Registra qualcosa che oggi funziona e che costerà al team più avanti — una scorciatoia presa
consapevolmente, una dipendenza che invecchia, un design che non calza più, un assetto che
conoscono solo in due. Chiede quanto costa rimandare, quali sono le opzioni compreso il non fare
niente, e cosa quella cosa vincola finché resta in piedi — poi ti mostra il testo completo e
aspetta. Su Jira non finisce niente finché non approvi.

Sono le domande di un Tech Lead. Il debito perde le discussioni sulle priorità perché viene
sostenuto con degli aggettivi, e lo scopo di questa skill è metterlo per iscritto in una forma
che possa perdere onestamente — o vincere.

## Quando si attiva · quando no

Si attiva quando non sta fallendo niente e vuoi comunque che il costo sia agli atti.

| Se dici qualcosa come                                       | La skill è                             |
| ----------------------------------------------------------- | -------------------------------------- |
| «adesso funziona, ma fra sei mesi ci si ritorce contro»     | `jira-assess`                          |
| «l'export esce vuoto, va segnalato»                         | [`jira-diagnose`](jira-diagnose.it.md) |
| «vogliamo che i clienti vedano il loro storico»             | [`jira-propose`](jira-propose.it.md)   |
| «è arrivata questa richiesta, nessuno l'ha ancora guardata» | [`jira-capture`](jira-capture.it.md)   |

Il confine con [`jira-diagnose`](jira-diagnose.it.md) è presidiato da entrambi i lati apposta.
_«Continua a dare problemi»_ sta bene in tutte e due le descrizioni, quindi qui la prima domanda
è cosa succede oggi se non si fa niente. Se la risposta è che qualcosa già fallisce, si comporta
male o produce il risultato sbagliato, questa skill lo dice e si ferma, invece di registrare un
difetto con parole più morbide.

## Come si usa

Non serve nominare la skill. Racconta cosa vi costerà, con parole tue, e rispondi alle domande.

**1 · Legge prima il project profile.** Prima di chiederti qualsiasi cosa legge
`.jira/project-profile.md` per sapere com'è configurato il tuo progetto. Se quel file manca si
ferma e ti dice di eseguire `jira-init`: non tira a indovinare. Cosa contiene il project profile
— il file che registra l'esito della discovery, cioè la lettura della configurazione reale del
progetto — sta nel [processo di sviluppo](../development-process.it.md).

**2 · Stabilisce che non è un difetto.** La prima cosa che chiede è cosa succede oggi se non si
fa niente. Il debito è ciò che funziona e costa, e la distinzione deve reggere davanti a chi
vedrà solo il work item finito: si chiude prima delle altre domande invece di restare implicita
in quelle che vengono dopo.

**3 · Fa tre domande.** Quanto costa rimandare: il tempo di chi, con che frequenza, e cosa rende
più lento o più rischioso — non la formula «debito tecnico», ma il pedaggio che si sta pagando.
Quali sono le opzioni, compreso il non fare niente e compresa quella parziale ed economica,
perché le opzioni fanno di questa cosa una decisione mentre un'unica proposta la trasforma in una
pretesa. E qual è l'impatto tecnico: cosa tocca, e cosa vincola finché resta in piedi.

**4 · Misura quello che afferma.** Dimensione, lentezza, frequenza e rischio arrivano con il
numero e con il modo in cui è stato ottenuto. «Lento», «fragile» e «tanto» sono gli aggettivi che
perdono la discussione. Dove un'affermazione non è misurabile, il testo dice cosa bisognerebbe
misurare per chiuderla: nominare il numero mancante serve già di per sé, ed è spesso un lavoro
più piccolo del debito stesso.

**5 · Sceglie un work type fra quelli del tuo progetto**, non da un elenco che si porta dietro.
Aspettati che un work type per il debito non ci sia: un progetto che separa il debito dal resto
del lavoro per work type è l'eccezione. In quel caso la skill lo archivia sotto un altro work
type e l'artefatto dice di quale intento si tratta, così la distinzione non si perde.

**6 · Poi il draft gate**, il cancello che precede ogni scrittura su Jira. Il testo completo
compare in chat con le decisioni che porta con sé — titolo, work type, parent, e ogni campo che
il progetto marca obbligatorio e che la bozza ha lasciato vuoto. Approvi, oppure chiedi modifiche
e lo rivedi. Questa skill aggiunge una cosa al gate: dichiara quale opzione il testo raccomanda,
se ne raccomanda una, e che raccomandare non è decidere.

## Scambio di esempio

**Tu**

> I nostri job pianificati sono configurati in tre posti separati che vanno tenuti allineati a
> mano. Non sta bruciando niente. Vorrei metterlo per iscritto prima che ci dimentichiamo che c'è.

**`jira-assess`**

> Fissiamo prima di tutto il «non sta bruciando niente». Se oggi nessuno tocca quelle
> configurazioni, qualcosa fallisce, arriva in ritardo o esce sbagliato?

**Tu**

> No. Ogni job gira, in orario, ed è così da un anno. Il costo lo paga chi cambia una
> pianificazione, non chi ne dipende.

**`jira-assess`**

> Allora questo è un debito e non un difetto, e il testo si aprirà dicendolo. Cosa costa oggi
> cambiare una pianificazione?

**Tu**

> Tre configurazioni da modificare, tenute coerenti rileggendole a fianco. In due lo sanno fare
> senza pensarci.

**`jira-assess`**

> «In due» è un numero. Riesci a darmi gli altri — quante modifiche, quante sono andate male,
> quanto dura una? Un testo che dice «soggetto a errori» perde contro una richiesta di
> funzionalità tutte le volte.

**Tu**

> Lo storico delle modifiche dice 14 cambi di pianificazione negli ultimi sei mesi. Quattro
> sbagliati al primo tentativo e intercettati in revisione. Uno è arrivato nell'ambiente
> condiviso e ce ne siamo accorti la mattina dopo: circa tre ore in due, sta nella nota
> dell'incidente dell'11 giugno. Dalla prima all'ultima scrittura passano in media 40 minuti; la
> stessa modifica in un posto solo ne dura 5.

**`jira-assess`**

> Bene. Adesso le opzioni, e lasciare tutto com'è deve essere una di quelle.

**Tu**

> Lasciare tutto com'è: 35 minuti in più a modifica, per sempre, e gli stessi errori. Un
> controllo di coerenza nel percorso di revisione intercetterebbe le divergenze prima che escano
> — un giorno, forse. Oppure spostare la pianificazione in un posto solo e generare gli altri
> due: una settimana circa, una migrazione, e vorremmo una via di ritorno.

**`jira-assess`**

> E cosa vi impedisce di fare, l'assetto a tre posti, finché resta in piedi?

**Tu**

> Ogni nuovo job pianificato se lo eredita, quindi il pedaggio cresce con il numero di job invece
> di restare fisso. E i cambi di pianificazione restano in mano alle due persone che conoscono
> l'assetto.

**`jira-assess`**

> Un campo non riesco a compilarlo: questo progetto marca **Team** obbligatorio alla creazione, e
> l'assetto delle pianificazioni non appartiene a un team solo, quindi lo sollevo invece di
> indovinarlo. Il tuo progetto non ha nemmeno un work type per il debito, quindi lo archivio come
> Task e il testo dirà cos'è. Raccomanda per primo il controllo di coerenza, e dice che
> raccomandare non è decidere: le tre opzioni restano tutte in tabella. Ecco il testo completo:
> approvalo e lo scrivo, oppure dimmi cosa cambiare.

## Il risultato

Il testo come arriva su Jira. È Markdown, e arriva interpretato: intestazioni, elenchi e la
tabella delle opzioni sopravvivono alla scrittura.

```markdown
# I job pianificati sono configurati in tre posti che devono concordare a mano

## Cosa funziona oggi

Ogni job pianificato gira, in orario, e lo fa da un anno. Non sta fallendo niente e nessun
destinatario ne subisce le conseguenze. Il costo lo pagano le persone che cambiano una
pianificazione, non quelle che ne dipendono.

## Cosa costa rimandare

Cambiare una pianificazione significa modificare tre configurazioni separate e tenerle coerenti
rileggendole. In due lo sanno fare con sicurezza.

Negli ultimi sei mesi ci sono stati 14 cambi di pianificazione. Quattro erano sbagliati al primo
tentativo e sono stati intercettati in revisione; uno è arrivato nell'ambiente condiviso ed è
stato trovato la mattina dopo, al costo di circa tre ore in due. Il tempo speso per un cambio di
pianificazione è in media di 40 minuti, contro i 5 circa della stessa modifica nell'unico posto
in cui dovrebbe vivere.

## Opzioni

| Opzione                                                          | Cosa richiede                                                                        | Cosa lascia                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Non fare niente                                                  | ~35 minuti in più a modifica, all'infinito; la stessa classe di errore si ripresenta | Due persone in grado di cambiare una pianificazione; il rischio invariato |
| Aggiungere un controllo di coerenza al percorso di revisione     | Un giorno circa; nessun cambiamento nel modo di scrivere le pianificazioni           | I tre posti, ma le divergenze intercettate prima che escano               |
| Spostare la pianificazione in un posto solo e generare gli altri | Una settimana circa; una migrazione con una via di ritorno                           | Un posto solo da cambiare, e chiunque in grado di cambiarlo               |

Raccomandato: prima il controllo di coerenza, perché elimina quella classe di errore a un decimo
del costo e non preclude il cambiamento completo. Questa è una raccomandazione; dare le priorità
non spetta a me.

## Impatto tecnico

Qualsiasi lavoro che aggiunga un job pianificato eredita il costo dei tre posti, quindi il
pedaggio cresce con il numero di job invece di restare fisso. Inoltre tiene i cambi di
pianificazione in mano alle due persone che conoscono l'assetto, che è un bus factor che nessuno
ha scelto.

## Misurazioni

- 14 cambi di pianificazione in sei mesi, contati dallo storico delle modifiche.
- 4 sbagliati al primo tentativo, dai commenti di revisione su quelle modifiche; 1 arrivato
  nell'ambiente condiviso, dalla nota dell'incidente del 2026-06-11.
- ~40 minuti di media a modifica, dal tempo fra la prima e l'ultima scrittura su quelle 14; ~5
  minuti è l'equivalente per una modifica in un posto solo, misurato su tre modifiche
  confrontabili.
- Non misurato: se le due persone che se ne occupano lo vivano come un peso. Nessuno gliel'ha
  chiesto, e la loro risposta cambierebbe la classifica.

## Campi obbligatori non ancora compilati

- **Team** — questo progetto lo marca obbligatorio alla creazione, e l'assetto delle
  pianificazioni non appartiene a un team solo. Sollevato al draft gate invece che indovinato.

## Work type

Questa è la registrazione di un debito. È archiviata sotto Task perché lo schema di questo
progetto non ha un work type che la nomini.
```

Il senso di un testo così è che possa perdere. Si apre dicendo cosa funziona, così nessuno lo
legge come un guasto. Mette un prezzo al rinvio in ore che qualcuno ha contato davvero, così lo
si può mettere accanto a una richiesta di funzionalità invece di discuterne. E il non fare niente
sta in tabella con il suo costo dichiarato, invece di restare fuori come la cosa contro cui
l'autore sta argomentando.

Due dettagli più piccoli sono voluti. L'ultima misurazione è una che non esiste — nessuno ha
chiesto alle due persone se quell'assetto sia un peso — e nominare il numero mancante vale più di
un quarto numero inventato per fare compagnia agli altri. E il template fissa le sezioni, mai la
lingua: lo stesso testo prodotto da una conversazione in un'altra lingua esce in quella lingua,
con queste intestazioni tradotte e il work type riportato esattamente come lo dichiara il
progetto.

## Cosa non fa

- **Registrare qualcosa che oggi fallisce.** Se già si rompe, si comporta male o produce il
  risultato sbagliato è un difetto, il caso è di [`jira-diagnose`](jira-diagnose.it.md), e questa
  skill lo dice e si ferma invece di scrivere la stessa cosa con parole più morbide.
- **Raccomandare per omissione.** Un'opzione lasciata fuori è un'opzione rifiutata, e rifiutarla
  in silenzio è il modo in cui una preferenza tecnica diventa una decisione che nessuno ha
  rivisto.
- **Trasformare il costo di un'opzione in un impegno.** Le opzioni sono ordinate per ordine di
  grandezza perché si possano confrontare; convertirlo in una stima richiede un perimetro che
  questo testo lascia aperto apposta, ed è il lavoro di [`jira-refine`](jira-refine.it.md).
- **Decidere.** Può raccomandare, e dove lo fa dichiara che sta raccomandando. Dare le priorità
  spetta a chi dà le priorità.
- **Affermare una dimensione che non ha misurato.** «Lento», «fragile» e «tanto» non sopravvivono
  alla bozza. Dove il numero ancora non c'è, il testo nomina la misura che lo chiuderebbe.
- **Ripagare il debito, o scrivere il lavoro che lo ripagherebbe.** Registra il costo. Cosa farne
  è un work item a parte, e lo decide qualcun altro.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, il draft gate, i
  due channel, e dove la registrazione di un debito si colloca nel percorso completo.
- [`jira-diagnose`](jira-diagnose.it.md) — per qualcosa che oggi fallisce.
- [`jira-refine`](jira-refine.it.md) — per trasformare questa registrazione in lavoro che un team
  può prendere in carico, con un perimetro e dei criteri di accettazione.
- [`jira-propose`](jira-propose.it.md) — per un risultato che qualcuno desidera, invece di un
  costo che il team sta già pagando.
