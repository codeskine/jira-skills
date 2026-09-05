# `jira-diagnose` — segnalare un difetto

<!-- skill-header:start -->

|                         |                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Nome**                | `jira-diagnose`                                                                        |
| **Versione**            | 1.0.0                                                                                  |
| **Invocabile per nome** | sì                                                                                     |
| **Channel**             | Atlassian MCP server                                                                   |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## Cosa fa

Trasforma qualcosa che hai visto rompersi in una segnalazione che chi non era presente riesce a
riprodurre. Chiede i passi, il risultato atteso e quello effettivo, dove è successo, l'errore
esattamente come è stato stampato, e chi ne subisce le conseguenze — poi ti mostra la
segnalazione completa e aspetta. Su Jira non finisce niente finché non approvi.

Sono le domande di un QA Engineer, nell'ordine in cui un QA Engineer le fa. Chi l'ha visto
succedere è al momento l'unico in grado di rifarlo succedere, e lo scopo di questa skill è
mettere fine a quella condizione.

## Quando si attiva · quando no

Si attiva quando dici che qualcosa è rotto, si comporta in modo inatteso o fallisce, e va messo
agli atti.

| Se dici qualcosa come                                       | La skill è                           |
| ----------------------------------------------------------- | ------------------------------------ |
| «l'export esce vuoto, va segnalato»                         | `jira-diagnose`                      |
| «adesso funziona, ma fra sei mesi ci si ritorce contro»     | [`jira-assess`](jira-assess.it.md)   |
| «è arrivata questa richiesta, nessuno l'ha ancora guardata» | [`jira-capture`](jira-capture.it.md) |
| «vogliamo che i clienti vedano il loro storico»             | [`jira-propose`](jira-propose.it.md) |

Il confine con [`jira-assess`](jira-assess.it.md) è presidiato da entrambi i lati apposta.
_«Continua a dare problemi»_ sta bene in tutte e due le descrizioni, quindi la skill stabilisce
presto se oggi qualcosa fallisce davvero; se non fallisce niente, lo dice e si ferma invece di
archiviare come difetto quello che è un rischio.

## Come si usa

Non serve nominare la skill. Racconta cosa si è rotto, con parole tue, e rispondi alle domande.

**1 · Legge prima il project profile.** Prima di chiederti qualsiasi cosa legge
`.jira/project-profile.md` per sapere com'è configurato il tuo progetto. Se quel file manca si
ferma e ti dice di eseguire `jira-init`: non tira a indovinare. Cosa contiene il project profile
— il file che registra l'esito della discovery, cioè la lettura della configurazione reale del
progetto — sta nel [processo di sviluppo](../development-process.it.md).

**2 · Fa quattro domande, una alla volta.** Cosa hai fatto, cosa ti aspettavi, cosa è successo
invece, e dove. Sono separate apposta: se le ricevono tutte insieme, le persone rispondono a
quelle interessanti e saltano le altre.

**3 · Vuole l'errore verbatim.** Copiato, non ribattuto e non ricordato. Una parafrasi non si può
cercare, e cercarla è la prima cosa che farà chi prende in carico il lavoro. Se non è stato
catturato niente, la segnalazione dice che non è stato catturato niente: non ricostruisce mai
quello che il messaggio probabilmente diceva.

**4 · Chiede chi è colpito e con che frequenza.** Sono le due cose che decidono l'urgenza, e
chiederle adesso evita che il triage diventi una seconda conversazione.

**5 · Sceglie un work type fra quelli del tuo progetto**, non da un elenco che si porta dietro.
Aspettati che un work type per i difetti non ci sia: un progetto creato dallo schema predefinito
attuale non ne ha. In quel caso la skill lo archivia sotto un altro work type e l'artefatto dice
di quale intento si tratta, così la distinzione non si perde.

**6 · Poi il draft gate**, il cancello che precede ogni scrittura su Jira. La segnalazione
completa compare in chat con le decisioni che porta con sé — titolo, work type, parent, e ogni
campo che il progetto marca obbligatorio e che la bozza ha lasciato vuoto. Approvi, oppure chiedi
modifiche e la rivedi. Questa skill aggiunge una cosa al gate: se i passi non sono stati
ripercorsi almeno una volta così come sono scritti, lo dichiara — passi ricordati anziché
rieseguiti sono il motivo più frequente per cui un difetto non si riproduce.

## Scambio di esempio

**Tu**

> L'export pianificato sta producendo file vuoti. Lo segnaliamo?

**`jira-diagnose`**

> Prima di scrivere qualcosa: cosa hai fatto, passo per passo, partendo da uno stato a cui
> chiunque qui può arrivare?

**Tu**

> Apri la schermata di export, imposti un intervallo dal 28 al 3 del mese dopo, scegli il formato
> delimitato, lanci. Arriva la notifica, apri il file, e c'è solo l'intestazione.

**`jira-diagnose`**

> E cosa ti aspettavi a quell'ultimo passo?

**Tu**

> Sei giorni di righe. L'anteprima nella schermata diceva pure 1.184.

**`jira-diagnose`**

> È stato loggato qualcosa? Incollalo esattamente com'è uscito, senza riassumerlo: mi serve la
> stringa che qualcuno possa cercare.

**Tu**

> ```
> export.worker  range resolved: 2026-08-28 .. 2026-09-03
> export.worker  partition selector matched 0 partitions for range
> export.worker  wrote 0 rows in 41ms — status: completed
> ```

**`jira-diagnose`**

> Quindi nessun errore: la corsa risulta completata con successo. Questo entra come rilievo a sé.
> Chi ci sbatte contro, e con che frequenza?

**Tu**

> Due team lo pianificano ogni mese, entrambi ricevono file vuoti. Uno lo sta rifacendo a mano. È
> ogni volta che l'intervallo attraversa il cambio di mese.

**`jira-diagnose`**

> Il tuo progetto non ha un work type per i difetti, quindi lo archivio come Task e la
> segnalazione dirà che è la segnalazione di un difetto. Ecco il testo completo: approvalo e lo
> scrivo, oppure dimmi cosa cambiare.

## Il risultato

La segnalazione come arriva su Jira. È Markdown, e arriva interpretato: intestazioni, elenchi e
blocchi di codice sopravvivono alla scrittura.

````markdown
# L'export pianificato produce un file vuoto quando l'intervallo attraversa il cambio di mese

## Passi per riprodurre

1. Aprire la schermata di export con un utente che ha il ruolo di reporting standard.
2. Impostare l'intervallo dal 28 di un mese al 3 del mese successivo.
3. Scegliere il formato delimitato e avviare l'export.
4. Attendere la notifica e aprire il file a cui rimanda.

## Risultato atteso

Un file contenente le righe dei sei giorni dell'intervallo, come annuncia l'anteprima al passo 3.

## Risultato effettivo

L'export si conclude e riporta successo. Il file contiene la riga di intestazione e nient'altro.
L'anteprima al passo 3 aveva annunciato 1.184 righe.

## Evidenza

```
export.worker  range resolved: 2026-08-28 .. 2026-09-03
export.worker  partition selector matched 0 partitions for range
export.worker  wrote 0 rows in 41ms — status: completed
```

Non è stato sollevato nessun errore: la corsa risulta completata con successo, ed è il motivo per
cui nessuno se n'era accorto finché un destinatario non ha chiesto dove fossero i numeri.

## Dove è successo

- Nell'ambiente condiviso, e riprodotto in quello di pre-rilascio.
- Entrambi in versione 4.9.2.
- Riprodotto con il ruolo di reporting standard e di nuovo con permessi pieni: non è una
  differenza di permessi.
- Qualsiasi intervallo che attraversi il cambio di mese. Gli intervalli interni a un solo mese
  non sono interessati.

## Impatto

Chiunque esporti un intervallo che attraversa il cambio di mese riceve un file vuoto e si sente
dire che l'export è riuscito. Due team pianificano questo export ogni mese; entrambi ricevono
file vuoti e uno dei due sta colmando il buco a mano.

## Frequenza

Ogni volta, quando l'intervallo attraversa il cambio di mese. Mai, quando non lo attraversa.
Riprodotto undici volte su undici tentativi in due ambienti.

## Work type

Questa è la segnalazione di un difetto. È archiviata sotto Task perché lo schema di questo
progetto non ha un work type che la nomini.
````

Tre cose che questa segnalazione fa e una frettolosa no. I passi partono da uno stato
raggiungibile da chiunque, quindi nessuno deve chiedere da dove si arrivi alla «schermata di
export». Il log è verbatim, quindi l'assenza di errore è essa stessa un'evidenza e non
un'impressione. E la sezione facoltativa che il template offre per i campi obbligatori non
compilati **non c'è**, perché non ce n'erano: una sezione con niente sotto si legge come una
dimenticanza, quindi si rimuove invece di lasciarla vuota.

## Cosa non fa

- **Nominare la causa.** Una segnalazione che si apre con una teoria restringe la ricerca prima
  che qualcuno abbia guardato, e sbaglia abbastanza spesso da costare più di quanto faccia
  risparmiare.
- **Proporre la correzione.** Descrive cosa succede; a chi prende in carico il lavoro spetta
  scoprire perché.
- **Attribuire colpe** a un componente, a una modifica o a una persona.
- **Registrare qualcosa che funziona.** Se oggi non fallisce niente, il caso è di
  [`jira-assess`](jira-assess.it.md), e la skill lo dice e si ferma.
- **Inventare un messaggio di errore.** Inventato è peggio che assente: manda qualcuno a cercare
  una stringa che non esiste.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, il draft gate, i
  due channel, e dove la segnalazione di un difetto si colloca nel percorso completo.
- [`jira-assess`](jira-assess.it.md) — per qualcosa che oggi funziona e costerà dopo.
- [`jira-capture`](jira-capture.it.md) — per una segnalazione che arriva da fuori e che nessuno ha
  ancora esaminato.
- [`jira-refine`](jira-refine.it.md) — per trasformare questa segnalazione in qualcosa che un team
  può prendere in carico.
