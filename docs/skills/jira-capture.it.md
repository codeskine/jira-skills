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

Registra una richiesta arrivata da fuori il team — una email, un messaggio in chat, un appunto
preso durante una riunione — con le parole con cui è arrivata, prima che qualcuno abbia capito
cosa significhi. Conserva il testo originale, annota chi ha chiesto e per quale via, fa tre domande
brevi ed elenca a cosa la richiesta non risponde. Poi ti mostra il testo completo e aspetta: su
Jira non finisce niente finché non approvi.

Una richiesta che nessuno mette per iscritto è una richiesta che il team non vede; una travestita
da pronta è peggio, perché qualcuno la pianificherà. È l'unica skill del plugin che crea
deliberatamente qualcosa di incompleto, e le è permesso solo perché il work item lo dichiara:
grezzo, senza refinement, non pronto per essere pianificato, con
[`jira-refine`](jira-refine.it.md) nominato come l'intento che lo prende in carico dopo.

## Quando si attiva · quando no

Si attiva quando qualcosa arriva da fuori e deve stare su Jira prima che qualcuno l'abbia
esaminato.

| Se dici qualcosa come                                       | La skill è                             |
| ----------------------------------------------------------- | -------------------------------------- |
| «è arrivata questa richiesta, nessuno l'ha ancora guardata» | `jira-capture`                         |
| «scrivila com'è, poi la capiamo»                            | `jira-capture`                         |
| «mettiamoci d'accordo sui criteri e spacchiamola»           | [`jira-refine`](jira-refine.it.md)     |
| «vogliamo che i clienti vedano il loro storico»             | [`jira-propose`](jira-propose.it.md)   |
| «l'export esce vuoto, va segnalato»                         | [`jira-diagnose`](jira-diagnose.it.md) |

Il confine che conta è quello con [`jira-refine`](jira-refine.it.md), e ha un verso solo: capture
apre il percorso e il refinement lo chiude. Se sai già dire cosa vorrà dire «fatto», la richiesta
è stata esaminata e l'intento è un altro — tutto quello che capture aggiungerebbe a quel punto è
una decisione che nessuno ha preso.

Anche la segnalazione di qualcosa di rotto, quando arriva da fuori, è di capture e non di
[`jira-diagnose`](jira-diagnose.it.md). Una segnalazione di difetto deve rispondere a domande a
cui sa rispondere solo chi ha visto succedere il fatto, e qui quella persona non è in stanza:
registrare la richiesta con le sue parole è la versione onesta.

## Come si usa

Non serve nominare la skill. Di' che è arrivato qualcosa e incollalo.

**1 · Legge prima il project profile.** Prima di chiederti qualsiasi cosa legge
`.jira/project-profile.md` per sapere com'è configurato il tuo progetto. Se quel file manca si
ferma e ti dice di eseguire `jira-init`: non tira a indovinare. Cosa contiene il project profile —
il file che registra l'esito della discovery, cioè la lettura della configurazione reale del
progetto — sta nel [processo di sviluppo](../development-process.it.md).

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

**6 · Poi il draft gate**, il cancello che precede ogni scrittura su Jira. Il record completo
compare in chat con le decisioni che porta con sé: il titolo, il work type, e ogni campo che il
progetto marca obbligatorio e a cui la richiesta non risponde. Approvi, oppure chiedi modifiche e
lo rivedi. Questa skill aggiunge una cosa al gate: la dichiarazione che il work item è grezzo deve
essere visibile nella bozza, non soltanto intesa, e il gate dice chiaramente che quello che verrà
creato è un record grezzo e non lavoro pianificato.

## Scambio di esempio

**Tu**

> È arrivata stamattina dal Responsabile Finance e nessuno l'ha ancora guardata. La metti su Jira
> com'è, prima che si perda?

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
> sprint, niente fix version: qui non c'è stato nessun refinement. Ecco il testo completo:
> approvalo e lo scrivo, oppure dimmi cosa cambiare.

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
sezione a portare la distinzione che lo schema non porta. E `In attesa di refinement` non è un
ornamento: è la dichiarazione che rende ammissibile un work item incompleto.
[`jira-refine`](jira-refine.it.md) ritira quella dichiarazione quando fa il refinement, ed è
quello che impedisce a un work item rifinito di portare criteri di accettazione accanto a una
frase che dice che non ne ha.

## Cosa non fa

- **Riscrivere la richiesta come requisiti.** Registrare cosa è stato chiesto e concordare cosa
  verrà costruito sono due fatti diversi, e perdere il primo rende il secondo indiscutibile. Del
  secondo si occupa [`jira-refine`](jira-refine.it.md).
- **Aggiungere criteri di accettazione, concordare il perimetro o stimare.** Sono tutti e tre
  refinement, e farli qui rivendica un accordo che nessuna conversazione ha prodotto.
- **Giudicare se la richiesta valga la pena.** Quello è un risultato da argomentare con un dato
  dietro, ed è di [`jira-propose`](jira-propose.it.md).
- **Decidere a chi appartiene.** Niente parent, niente sprint, niente fix version, e nessun
  proprietario scelto al posto di chi ha chiesto.
- **Correggere il testo.** Nessuna correzione ortografica, nessuna traduzione, nessuna
  riformulazione. Una richiesta riscritta non è più l'evidenza di cosa è stato chiesto.
- **Riempire un silenzio con una risposta plausibile.** Quello che chi ha chiesto non ha detto
  viene registrato come non dichiarato, e resta così finché qualcuno non glielo chiede.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, il draft gate, i
  due channel, e dove la registrazione di una richiesta si colloca nel percorso completo.
- [`jira-refine`](jira-refine.it.md) — l'intento che prende in carico il work item dopo, e quello
  che ritira la dichiarazione di grezzo.
- [`jira-propose`](jira-propose.it.md) — per un risultato che qualcuno vuole e che si argomenta,
  invece di limitarsi a riportarlo.
- [`jira-diagnose`](jira-diagnose.it.md) — per qualcosa di rotto che tu o il tuo team avete visto
  rompersi.
