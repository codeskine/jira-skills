# `jira-capture` — registrare una richiesta com'è arrivata

<!-- skill-header:start -->

|                         |                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Nome**                | `jira-capture`                                                                         |
| **Versione**            | 1.0.0                                                                                  |
| **Invocabile per nome** | sì                                                                                     |
| **Channel**             | Atlassian MCP server                                                                   |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## Cosa fa

Registra una richiesta che ti è arrivata di seconda mano — una email, un messaggio in chat, un
appunto preso durante una riunione — con le parole con cui è arrivata, prima che qualcuno abbia
capito cosa significhi. Conserva il testo originale, annota chi ha chiesto e per quale via, fa
tre domande brevi ed elenca a cosa la richiesta non risponde. Poi ti mostra il testo completo e
aspetta: su Jira non finisce niente finché non approvi.

Una richiesta che nessuno mette per iscritto è una richiesta che il team non vede; una travestita
da pronta è peggio, perché qualcuno la pianificherà. È l'unica skill del plugin che crea
deliberatamente qualcosa di incompleto, e le è permesso solo perché il work item lo dichiara:
grezzo, senza refinement, non pronto per essere pianificato, con
[`jira-refine`](jira-refine.it.md) nominato come l'intento che lo prende in carico dopo.

## Quando si attiva · quando no

Si attiva quando qualcosa ti arriva di seconda mano e deve stare su Jira prima che qualcuno
l'abbia esaminato.

| Se dici qualcosa come                                       | La skill è                             |
| ----------------------------------------------------------- | -------------------------------------- |
| «è arrivata questa richiesta, nessuno l'ha ancora guardata» | `jira-capture`                         |
| «scrivila com'è, poi la capiamo»                            | `jira-capture`                         |
| «mettiamoci d'accordo sui criteri e spacchiamola»           | [`jira-refine`](jira-refine.it.md)     |
| «vogliamo che i clienti vedano il loro storico»             | [`jira-propose`](jira-propose.it.md)   |
| «l'export esce vuoto, va segnalato»                         | [`jira-diagnose`](jira-diagnose.it.md) |
| «adesso funziona, ma fra sei mesi ci si ritorce contro»     | [`jira-assess`](jira-assess.it.md)     |

Il confine che conta è quello con [`jira-refine`](jira-refine.it.md), e ha un verso solo: capture
apre il percorso e il refinement lo chiude. Se sai già dire cosa vorrà dire «fatto», la richiesta
è stata esaminata e l'intento è un altro — tutto quello che capture aggiungerebbe a quel punto è
una decisione che nessuno ha preso.

Tutto il resto che arriva di seconda mano lo decide **il materiale, non chi l'ha mandato**. Il
messaggio parla evidentemente di qualcosa — un guasto, un risultato che qualcuno vuole, un debito
tecnico — e l'intento che se ne occupa dichiara una **soglia** nel proprio confine. A decidere è una
domanda sola: il materiale porta qualcosa su cui un lettore possa agire senza tornare da chi l'ha
mandato? Se non lo porta, arriva prima qui.

| Materiale riportato su          | La soglia da superare                                                           | L'intento che allora se ne occupa      |
| ------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------- |
| un guasto                       | dei passi che qualcun altro può rifare, o l'errore copiato esattamente          | [`jira-diagnose`](jira-diagnose.it.md) |
| un risultato che qualcuno vuole | un conteggio del sintomo — _una quarantina di chiamate il mese scorso_          | [`jira-propose`](jira-propose.it.md)   |
| un debito tecnico               | qualsiasi cosa dica cosa costa rimandarlo — una conseguenza, una data, un conto | [`jira-assess`](jira-assess.it.md)     |

Sotto la soglia è intake, per quanto evidentemente il messaggio parli di un guasto, di un
risultato o di un debito: qui nessuno può fornire quello che chi ha scritto non ha mandato, e
registrare la richiesta con le sue parole è la versione onesta. Superata la soglia, il materiale
appartiene a quell'intento, per quanto evidentemente sia stato riportato.

**Una soglia è un minimo da superare, non una checklist.** Si legge su tutto il messaggio, e
nessun singolo elemento la decide in nessuna delle due direzioni. Passi vuol dire un'azione, il suo
risultato e un punto di partenza che qualcun altro può raggiungere; nominare il programma in cui un
guasto si è rotto, o la versione che usano, non sono i passi e non sono l'errore, e non superano
niente. Una proposta non ha bisogno di un obiettivo, perché la soglia è la cifra e da cosa si
capirà che ha funzionato è la prima cosa che [`jira-propose`](jira-propose.it.md) chiede dopo.
Nominare la scorciatoia, la libreria o chi ha preso la decisione dice cosa il debito **è**, non
cosa costa lasciarlo lì, e nemmeno quello supera niente; un costo dichiarato, però, non deve essere
preciso per valere. Una soglia non è nemmeno una prova di completezza: il materiale che la supera e
poi lascia scoperta metà di quello che il suo intento chiederà va comunque a quell'intento, che
chiede.

**Ognuno dei tre applica la propria soglia dopo essere scattato, quindi la skill che parte può
benissimo essere la vicina invece di questa.** Le tue parole vengono confrontate con ogni
descrizione presa per sé, prima che sia stato letto un project profile e senza pesarne una contro
l'altra: una soglia che funziona solo se due descrizioni vengono lette affiancate deve vivere dove
una skill può applicarla. [`jira-diagnose`](jira-diagnose.it.md) legge al suo terzo passo quello
che è arrivato, dice cosa manca e passa la richiesta qui prima di rivolgere una sola domanda a chi
l'ha inoltrata; [`jira-assess`](jira-assess.it.md) fa lo stesso con quanto costa rimandare.

Il test è scritto apposta sul testo della richiesta e non sulle persone intorno. Se qualcuno, una
volta interpellato, saprebbe rispondere è un fatto sul futuro della conversazione, e la decisione
di instradamento si prende prima che sia stato chiesto niente.

## Come si usa

Non serve nominare la skill. Di' che è arrivato qualcosa e incollalo.

**1 · Legge prima il project profile.** Prima di chiederti qualsiasi cosa legge
`.jira/project-profile.md` per sapere com'è configurato il tuo progetto. Se quel file manca si
ferma e ti dice di eseguire `jira-init`: non tira a indovinare. Cosa contiene il project profile —
il file che registra l'esito della discovery, cioè la lettura della configurazione reale del
progetto — sta nel [processo di sviluppo](../development-process.it.md).

**E prima di ogni altra cosa legge la tabella Operazioni non supportate del project profile.** Se
lì dentro c'è quello che serve a questa skill — creare un work item, per questo intento — te lo
dice subito, con l'operazione nominata e il percorso manuale che il project profile registra, e le
tre domande qui sotto non si aprono nemmeno. Scoprirlo al momento della scrittura ti costerebbe
tutte le risposte che hai già dato. In quella tabella finisce quello che la discovery non è
riuscita a risolvere **su questa installazione**: nessun tool per quell'operazione, un channel che
non ha risposto, un account senza il permesso, o un concetto che questo progetto non ha.

**2 · Prende la richiesta intera e la conserva verbatim.** Nessuna correzione ortografica, nessuna
traduzione, nessuna riformulazione più stretta, nessun riassunto al posto dell'originale. Il testo
è l'evidenza di cosa è stato chiesto davvero, ed è la prima cosa che si perde quando qualcuno lo
riscrive in buona fede. Annota anche chi ha chiesto, quando e per quale via.

**3 · Fa tre domande e si ferma lì.** Cosa si aspetta chi ha chiesto, con i suoi termini e non
tradotto in una soluzione. Cosa ha detto sui tempi, con le sue parole. E se si sa già che manca
qualcosa. Tre domande, non un'intervista: cercarne una quarta è il modo in cui la registrazione
diventa un collo di bottiglia.

**4 · Una risposta che non hai viene registrata come non dichiarata.** Mai dedotta, mai riempita
con un'ipotesi plausibile. Vale anche per l'elenco di ciò a cui la richiesta non risponde: sono
domande, non assunzioni, ed è da lì che partirà il refinement.

**5 · Consiglia un work type pensato per le richieste non ancora esaminate**, se il tuo progetto
ne ha uno. Se non ne ha, lo dichiara prima di scrivere e archivia la richiesta sotto un altro work
type, e la distinzione la porta l'artefatto stesso. Non imposta né parent, né sprint, né fix
version: una richiesta grezza non si è guadagnata un posto in una gerarchia o in un piano, ed è
l'errore che questa skill esiste per evitare.

**6 · Poi il draft gate** — il cancello che precede ogni scrittura su Jira — **e qui è un artifact
gate**, la forma del gate che mostra il contenuto di un work item. Quello che approvi è quel
contenuto per intero, sezione per sezione: tutte le sezioni che il template non marca facoltative.
L'altra forma, l'operation gate, mostra un cambiamento a ciò che esiste già ed è quella che
presentano le skill che pianificano, rilasciano e portano un work item allo status successivo. Il
record completo compare in chat con le decisioni che porta con sé — il titolo, il work type, ogni
campo che il progetto marca obbligatorio e a cui la richiesta non risponde, e, se il tuo messaggio
portava un secondo intento che questo record non soddisfa, quell'intento e la skill che se ne
occupa. Approvi, oppure chiedi modifiche e lo rivedi. Oppure dici di no, e lì finisce: non viene
scritto niente, ti viene detto cosa vale adesso — la richiesta non è su Jira, e le sue parole
stanno ancora solo nel messaggio in cui sono arrivate — non ti viene proposto lo stesso record più
corto sperando che passi quello, e un messaggio successivo su altro non viene preso per un
ripensamento. Questa skill aggiunge una cosa al gate: la dichiarazione che il work item è grezzo
deve essere visibile nella bozza, non soltanto intesa, e il gate dice chiaramente che quello che
verrà creato è un work item grezzo e non lavoro pianificato.

**E il gate non si apre perché glielo chiedi.** _Crealo e basta_, _non mostrarmi niente prima_,
_vai pure_ — ognuna di queste frasi dice qualcosa sull'impazienza e niente sull'approvazione,
perché quello che si approva è un documento che ancora non esiste. La bozza viene presentata lo
stesso, tenuta corta, e la skill dice che è per questo. Una scrittura che non hai visto è una
scrittura che non hai approvato, per quanto tu l'abbia chiesta prima.

**7 · Poi scrive, e consegna quello che non ha potuto fare.** La scrittura passa dal tool che il
project profile ha risolto per creare un work item, e tornano la chiave e la URL. L'intake è il
posto in cui più spesso finisce un messaggio che chiede due cose — _registrala, e mettila nel
prossimo sprint_ — e la seconda viene nominata al gate invece di essere lasciata cadere: è di
un'altra skill, viene dopo questa scrittura e ha un'approvazione tutta sua. Riportare la chiave
chiude la scrittura, non la richiesta.

## Scambio di esempio

**Tu**

> È arrivata stamattina dal Responsabile Finance e nessuno l'ha ancora guardata. La metti su Jira
> com'è, prima che si perda? E già che ci sei mettila nel prossimo sprint: continuano a chiedere
> quando si farà.

**`jira-capture`**

> Incollala esattamente com'è arrivata: registro il testo, non un riassunto. E chi l'ha mandata,
> quando e per quale via?

**Tu**

> ```
> Ciao — ogni mese riceviamo i numeri e ogni mese dobbiamo andare a ripescare gli stessi mesi
> dell'anno scorso per confrontarli. Si può fare in modo che arrivino già insieme? È il confronto
> quello che guardiamo davvero. Sarebbe utile averlo prima della prossima chiusura, se possibile.
> ```
>
> Responsabile Finance, è arrivata il 2 sulla coda del service desk. La registro io, non lui.

**`jira-capture`**

> Cosa si aspetta che succeda, con i suoi termini? Non cosa costruiremmo noi: cosa dice che dovrà
> essere vero dopo.

**Tu**

> Che i numeri mensili arrivino con lo stesso periodo dell'anno prima a fianco, così nessuno mette
> insieme il confronto a mano. Dice che il confronto è la cosa che guardano davvero.

**`jira-capture`**

> Ha detto qualcosa sui tempi?

**Tu**

> Solo «prima della prossima chiusura, se possibile». Nessuna data, e niente su cosa succede se
> slitta.

**`jira-capture`**

> Allora registro la frase e l'assenza, e nessuna delle due diventa una scadenza. Rileggendo la
> richiesta, cinque cose a cui non risponde:
>
> - quali numeri: dice «i numeri» e non nomina nessun report
> - se «gli stessi mesi dell'anno scorso» siano gli stessi mesi di calendario o la stessa
>   posizione nell'anno fiscale
> - se qualcun altro riceva gli stessi numeri e sarebbe toccato dalla modifica
> - che data sia «la prossima chiusura»
> - se i dati dell'anno prima esistano per ogni periodo che si aspettano
>
> C'è qualcosa da aggiungere a quell'elenco, o da togliere?

**Tu**

> No, è tutto lì.

**`jira-capture`**

> Lo schema del tuo progetto ha un work type per le richieste non ancora esaminate, `Request`,
> quindi consiglio quello. Marca `Team` obbligatorio in creazione e la richiesta non dice quale
> team possieda i numeri, così la bozza nomina il campo invece di riempirlo. Niente parent, niente
> sprint, niente fix version: qui non c'è stato nessun refinement.
>
> Lo sprint è la metà della tua richiesta che questo record non fa. È di
> [`jira-plan`](jira-plan.it.md), è un'approvazione a sé, e prima di pianificare segnala il lavoro
> che non è pronto — e questo non lo è. Ecco il testo completo: approvalo e lo scrivo, e poi
> andiamo lì. Oppure dimmi cosa cambiare.

## Il risultato

Il work item come arriva su Jira. È Markdown, e arriva interpretato: intestazioni, tabelle e
blocchi citati sopravvivono alla scrittura.

```markdown
# I numeri mensili arrivano al team Finance senza l'anno precedente a fianco

> Ciao — ogni mese riceviamo i numeri e ogni mese dobbiamo andare a ripescare gli stessi mesi
> dell'anno scorso per confrontarli. Si può fare in modo che arrivino già insieme? È il confronto
> quello che guardiamo davvero. Sarebbe utile averlo prima della prossima chiusura, se possibile.

## Provenienza

| Campo         | Valore                               |
| ------------- | ------------------------------------ |
| Da            | Responsabile Finance                 |
| Ricevuta      | 2026-09-02                           |
| Tramite       | Email al service desk                |
| Registrata da | Service Manager, dalla coda del desk |

## Cosa si aspetta chi ha chiesto

Che i numeri che già riceve ogni mese arrivino con il periodo equivalente dell'anno precedente a
fianco, così che nessuno debba mettere insieme il confronto a mano. Come cosa che usa davvero
descrive il confronto, non i numeri.

## Urgenza, come dichiarata

«Prima della prossima chiusura, se possibile.» Nessuna data indicata, e nessuna conseguenza
dichiarata per il caso in cui slitti.

## Non ancora noto

- Quali numeri: la richiesta dice «i numeri» e non nomina nessun report.
- Se «gli stessi mesi dell'anno scorso» siano gli stessi mesi di calendario o la stessa posizione
  nell'anno fiscale.
- Se qualcun altro riceva gli stessi numeri e sarebbe toccato dalla modifica.
- Che data sia «la prossima chiusura».
- Se i dati dell'anno precedente siano disponibili per ogni periodo che si aspettano.

## Campi obbligatori non ancora compilati

- **Team** — questo progetto lo marca obbligatorio in creazione, e la richiesta non dice quale
  team possieda i numeri. Sollevato al draft gate invece che indovinato.

## In attesa di refinement

Questo work item è grezzo. È stato registrato con le parole con cui è arrivato e non ha avuto
nessun refinement: non ha criteri di accettazione, non ha un perimetro concordato e non ha una
stima, e sopra sono elencate cinque domande aperte. Non è pronto per essere pianificato. Se ne
occupa `jira-refine`.
```

Quello che rende usabile questo record è ciò che si rifiuta di fare. Non trasforma una frase vaga
in requisiti. Non indovina la data dietro «prima della prossima chiusura»: cita la frase e dice
che una data non è stata indicata. E non nasconde che metà di quello che conta è ancora ignoto —
le cinque domande aperte sono la sezione da cui partirà il refinement, non una mancanza da
smussare. Il blocco citato sotto il titolo è l'evidenza di tutto il resto, ed è per questo che
viene riportato e non descritto.

Due sezioni del template sono facoltative e qui si comportano al contrario l'una dell'altra.
`Campi obbligatori non ancora compilati` c'è perché un campo obbligatorio è rimasto vuoto, così il
gate lo solleva invece di far fallire la scrittura. `Work type` non c'è perché questo progetto un
work type per le richieste non ancora esaminate ce l'ha: dove un progetto non ce l'ha, è quella
sezione a portare la distinzione che lo schema non porta.

`In attesa di refinement` non appartiene a nessuno dei due casi. È la dichiarazione che rende
ammissibile un work item incompleto, e il template non le dà nessuna clausola _ometti questa
sezione quando…_ perché quel caso non esiste: tutto quello che l'intake scrive è grezzo per
costruzione. E non è nemmeno permanente. [`jira-refine`](jira-refine.it.md) la ritira con la
stessa scrittura che rende pronto il work item — su entrambi i rami del refinement, e mai con un
riordino successivo. Ritirarla vuol dire rimuoverla, non ammorbidirla in _un tempo era grezzo_:
quello lo tiene già la storia di Jira, e questo plugin non conserva una seconda copia di ciò che il
tracker registra. L'intestazione se ne va con la dichiarazione, perché esiste solo per lei e una
sezione senza niente sotto è una forma che nessun template ammette. Obbligatoria qui e assente lì
sono due momenti, non due template che si contraddicono.

## Cosa non fa

- **Riscrivere la richiesta come requisiti.** Registrare cosa è stato chiesto e concordare cosa
  verrà costruito sono due fatti diversi, e perdere il primo rende il secondo indiscutibile. Del
  secondo si occupa [`jira-refine`](jira-refine.it.md).
- **Aggiungere criteri di accettazione, concordare il perimetro o stimare.** Sono tutti e tre
  refinement, e farli qui rivendica un accordo che nessuna conversazione ha prodotto.
- **Giudicare se la richiesta valga la pena.** Quello è un risultato da argomentare con un dato
  dietro, ed è di [`jira-propose`](jira-propose.it.md).
- **Decidere a chi appartiene.** Niente parent, niente sprint, niente fix version, e nessun
  proprietario scelto al posto di chi ha chiesto. Se lo sprint lo chiedi nella stessa frase, viene
  nominato al gate e consegnato a [`jira-plan`](jira-plan.it.md), mai eseguito qui di nascosto.
- **Correggere il testo.** Nessuna correzione ortografica, nessuna traduzione, nessuna
  riformulazione. Una richiesta riscritta non è più l'evidenza di cosa è stato chiesto.
- **Riempire un silenzio con una risposta plausibile.** Quello che chi ha chiesto non ha detto
  viene registrato come non dichiarato, e resta così finché qualcuno non glielo chiede.
- **Scrivere qualcosa che non hai visto.** _Crealo e basta_ non è l'approvazione di un documento
  che ancora non esiste, quindi non salta il gate: rende la bozza più corta, non assente.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, il draft gate, i
  due channel, e dove la registrazione di una richiesta si colloca nel percorso completo.
- [`jira-refine`](jira-refine.it.md) — l'intento che prende in carico il work item dopo, e quello
  che ritira la dichiarazione di grezzo.
- [`jira-propose`](jira-propose.it.md) — per un risultato che qualcuno vuole e che si argomenta,
  invece di limitarsi a riportarlo.
- [`jira-diagnose`](jira-diagnose.it.md) — per qualcosa di rotto che tu o il tuo team avete visto
  rompersi.
- [`jira-assess`](jira-assess.it.md) — per un debito tecnico riportato con qualcosa che dice cosa
  costa rimandarlo.
- [`jira-plan`](jira-plan.it.md) — dove finisce il «e mettila nel prossimo sprint». L'intake non
  colloca mai niente da sé.
