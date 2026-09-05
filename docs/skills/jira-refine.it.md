# `jira-refine` — rendere pronto un work item, o scomporlo

<!-- skill-header:start -->

|                         |                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Nome**                | `jira-refine`                                                                          |
| **Versione**            | 1.0.0                                                                                  |
| **Invocabile per nome** | sì                                                                                     |
| **Channel**             | Atlassian MCP server                                                                   |
| **Ambiente**            | Designed for Claude Code. Requires the Atlassian MCP server configured as "atlassian". |

<!-- skill-header:end -->

## Cosa fa

Prende un work item che esiste già e lo porta al punto in cui un team può prenderlo in carico. Vuol
dire tre cose: criteri di accettazione formulati come esiti che qualcuno può verificare, dipendenze
registrate come link ai work item interessati, e un confine che dice cosa è stato deliberatamente
escluso. Quando il work item è troppo grande per essere finito, lo scompone in figli, ciascuno
completo per conto proprio.

Sono le domande di un Business Analyst. Il «fatto» concordato prima che il lavoro cominci è
l'accordo meno costoso che qualcuno stipulerà mai, ed è l'unico che si possa ancora stipulare
onestamente.

È anche la skill che chiude quello che l'intake apre. [`jira-capture`](jira-capture.it.md) può
registrare qualcosa di incompleto solo perché esiste questo intento a raccoglierlo subito dopo.

## Quando si attiva · quando no

Si attiva quando qualcosa di già registrato deve diventare lavorabile — o deve diventare più
piccolo.

| Se dici qualcosa come                                       | La skill è                           |
| ----------------------------------------------------------- | ------------------------------------ |
| «mettiamoci d'accordo su cosa vuol dire fatto per PROJ-421» | `jira-refine`                        |
| «questo è enorme, va spezzato»                              | `jira-refine`                        |
| «è arrivata questa richiesta, nessuno l'ha ancora guardata» | [`jira-capture`](jira-capture.it.md) |
| «metti questi quattro nel prossimo sprint»                  | [`jira-plan`](jira-plan.it.md)       |
| «porta PROJ-14 in review»                                   | [`jira-advance`](jira-advance.it.md) |

Sono due i confini che contano. A monte, [`jira-capture`](jira-capture.it.md) si occupa di una
richiesta che nessuno ha ancora esaminato; `jira-refine` parte da un work item che esiste già, e
quello che l'intake lascia dietro di sé — le parole originali della richiesta, più l'elenco di
quello a cui non risponde — è esattamente ciò che questa skill raccoglie. A valle,
[`jira-plan`](jira-plan.it.md) decide quando il lavoro viene affrontato: è il refinement a rendere
possibile quella decisione, e `jira-plan` segnala un work item che non l'ha ricevuto.

## Come si usa

Nomina il work item e di' che lo vuoi pronto. Non serve nominare la skill.

**1 · Legge prima il project profile**, il file che registra l'esito della discovery, cioè della
lettura della configurazione reale del progetto. Sta in `.jira/project-profile.md`; se manca, la
skill si ferma e ti dice di eseguire `jira-init`. Questo intento si appoggia in particolare a due
cose che il project profile registra — la possibilità di impostare un parent e la gerarchia dei
work type — e se una delle due non è supportata lo dichiara prima di chiederti qualsiasi cosa,
invece di scoprirlo al momento della scrittura. Vedi
[il processo di sviluppo](../development-process.it.md).

**2 · Legge il work item com'è adesso, e te lo mostra.** Un work item arrivato dall'intake porta
con sé le parole in cui è arrivato e l'elenco di quello a cui non risponde. Quell'elenco è il punto
da cui parte il refinement, ed è il motivo per cui all'intake è stato permesso di produrre
qualcosa di incompleto. Le parole originali non vengono mai buttate via mentre si arricchisce:
quello che è stato chiesto e quello che è stato concordato sono due fatti diversi, e perdere il
primo rende il secondo inoppugnabile.

**3 · Fa tre domande.** Quando è fatto — i criteri di accettazione, come esiti osservabili e non
come passi o come progetto della soluzione. Da cosa dipende — nominato come link ai work item
interessati, perché una dipendenza descritta a parole è una dipendenza che nessuno può seguire.
Cosa è deliberatamente escluso — il confine fa parte dell'accordo.

**4 · Poi chiede se il work item si può finire nel tuo orizzonte di pianificazione.** È il bivio, ed
è l'unica decisione che cambia quello che succede dopo. Se ci sta, la skill lo arricchisce dov'è e
va al gate. Se non ci sta, propone una scomposizione in cui ogni figlio è completo.

**5 · In una scomposizione ogni figlio è costruito dal template dell'intento che serve.** Non da
uno stub generico: la skill riconosce cosa sia davvero ciascun figlio e compila il template di
quell'intento, così che nessuno debba riscriverlo dopo.

| Se il figlio è        | È costruito dal template di            |
| --------------------- | -------------------------------------- |
| un difetto            | [`jira-diagnose`](jira-diagnose.it.md) |
| debito o rischio      | [`jira-assess`](jira-assess.it.md)     |
| un valore da ottenere | [`jira-propose`](jira-propose.it.md)   |
| ancora grezzo         | [`jira-capture`](jira-capture.it.md)   |

Un figlio che ha senso solo accanto ai suoi fratelli non è stato scomposto: è stato tagliato.

**6 · Anche ogni figlio porta i criteri di accettazione.** Qualunque intento serva, un figlio
riceve anche la sezione dei criteri di accettazione del template dell'item rifinito: quello che un
team prende in carico, pianifica e finisce è il figlio, e un figlio che nessuno può dire finito
non è un'unità di lavoro. La sezione sta dopo quelle che il template proprio del figlio definisce
e prima delle due che chiudono ogni template, così l'accordo si legge come la conclusione del
documento e non come la sua premessa.

I criteri si **ripartiscono, non si duplicano**: ogni criterio formulato per il work item atterra
su esattamente un figlio, e quello che nessun figlio rivendica resta al work item da cui vengono.
Un figlio che non ne rivendica nessuno è stato tagliato nel senso di sopra, e la risposta è
ridisegnare la scomposizione — non inventare un criterio per riempirlo.

Un figlio ancora grezzo è l'eccezione. Si dichiara in attesa di refinement, quindi non porta
criteri, e quello che gli sarebbe atterrato resta al parent finché quel figlio non viene rifinito
a sua volta.

**7 · Rifiuta una scomposizione che la gerarchia non può reggere.** Il project profile dice quali
work type possono contenere quali. Dove non ammette nessuna relazione parent-figlio fra il work
type del work item e quello dei figli, la skill lo dice, spiega perché, e lascia il work item
intero. Non crea i figli lo stesso: figli che non si possono attaccare sono orfani, e un orfano è
peggio di un work item troppo grande, perché in più è invisibile.

Il rifiuto non è il punto in cui si ferma. Il project profile sa quali work type possono contenere
quali, quindi insieme al rifiuto arriva cosa questo progetto può sostenere, dal più economico:
un'altra coppia di work type che la gerarchia ammette, poi arricchire il work item dov'è — l'altro
ramo di questa skill — poi un cambio dello schema del progetto, che richiede un project admin e non
tocca a te. Dove il project profile registra i work type come _non letti_ invece di elencarli, il
rifiuto dice quello: ciò che non si è potuto stabilire non è la stessa cosa di ciò che il progetto
non può fare.

**8 · Poi il draft gate**, il cancello che precede ogni scrittura su Jira, nella sua forma di
**artifact gate**: quella che mostra il contenuto di un work item, che è ciò che una scomposizione
crea. Il risultato completo compare in chat con le decisioni che porta con sé, e su Jira non finisce
niente finché non approvi. Questo intento aggiunge una cosa: **l'intera scomposizione viene
presentata prima che ne esista un solo pezzo, e approvata una volta sola** — mai figlio per figlio,
perché una scomposizione approvata figlio per figlio è una scomposizione che nessuno ha
riequilibrato. Con quella singola approvazione vengono poi scritti più work item; se una parte
fallisce ti viene detto quali pezzi sono passati e quali no, e niente viene disfatto senza di te. Il
blocco delle decisioni nomina i criteri di accettazione di ogni work item coinvolto, parent
compreso: sono loro l'oggetto dell'accordo, e una bozza che li avesse persi resterebbe approvabile
senza che nessuno se ne accorga.

Se chiedi la scomposizione e nello stesso respiro chiedi che i figli finiscano da qualche parte —
nello sprint corrente, per dire — il cancello lo incontri due volte, una per forma: qui l'artifact
gate, e là l'operation gate che [il processo di sviluppo](../development-process.it.md) descrive. I
figli devono esistere prima che qualcosa possa collocarli, quindi la scomposizione si approva qui e
la collocazione si approva nella skill che se ne occupa. Nessuna delle due approvazioni vale per
l'altra.

**9 · Con la scrittura, la dichiarazione di lavoro grezzo viene ritirata.** Dove l'intake aveva
scritto che il work item è grezzo e in attesa di refinement, questa scrittura la rimuove — su
entrambi i rami. Quella dichiarazione è ciò che ha permesso a un work item incompleto di esistere;
lasciata accanto ai criteri di accettazione fa contraddire il work item con sé stesso e lo tiene
fuori dalla pianificazione per cui adesso è pronto.

Ritirata vuol dire rimossa, non ammorbidita in una versione più tenue di sé: un work item che dice
di essere stato grezzo tiene una seconda copia di quello che la storia di Jira già registra. Dove
il titolo di sezione esiste solo per quella dichiarazione se ne va con lei, perché una sezione
senza niente sotto è una forma che nessun template ammette; dove la dichiarazione sta sotto un
titolo che porta anche altro, se ne va la dichiarazione e il resto rimane.

Dove il work item è stato scomposto, la skill restringe anche il testo del work item di partenza,
perché non rivendichi più quello che ora portano i suoi figli; e non ne aggiunge mai l'elenco: la
gerarchia si interroga su Jira, e un elenco tenuto a mano è una seconda risposta destinata a
smentire la prima.

## Scambio di esempio

**Tu**

> PROJ-421 è la richiesta di finance arrivata dal service desk. Lo rendiamo pronto da prendere in
> carico?

**`jira-refine`**

> Al momento è ancora grezzo: c'è la richiesta nelle parole in cui è arrivata, e cinque domande a
> cui non risponde. Partiamo da quelle cinque. La prima: quando è fatto? Qualcosa che si possa
> verificare, non una descrizione del lavoro.

**Tu**

> Quando i numeri mensili mostrano accanto lo stesso periodo dell'anno prima, per ogni periodo.

**`jira-refine`**

> Una delle cinque chiede cosa significhi «lo stesso periodo»: lo stesso mese di calendario, o la
> stessa posizione nell'anno fiscale?

**Tu**

> Anno fiscale. Il nostro parte ad aprile.

**`jira-refine`**

> E l'ultima rimasta aperta: l'anno precedente ha i dati per tutti i periodi?

**Tu**

> No, due dei dodici non sono mai stati migrati. Se ne occupa PROJ-418. Finché non arriva, quei
> periodi devono mostrare l'assenza segnalata, non uno zero.

**`jira-refine`**

> Allora PROJ-418 entra come link, non come frase che lo descrive, e l'assenza segnalata diventa un
> criterio a sé. Cosa è stato valutato ed escluso di proposito?

**Tu**

> Medie mobili e confronto con il piano sono venuti fuori tutti e due e li abbiamo scartati. E i
> destinatari non cambiano — stesse persone, stesso report, con dentro il confronto.

**`jira-refine`**

> Delle cinque ne resta aperta una: che data sia «la prossima chiusura». È una domanda sul quando,
> non sul cosa vuol dire fatto, quindi qui non diventa un criterio — se ne occupa
> [`jira-plan`](jira-plan.it.md). Ultima cosa da parte mia: il tuo team riesce a finirlo in un solo
> orizzonte di pianificazione? Se no lo scompongo in figli, ciascuno completo per conto suo, e
> approvi l'intera scomposizione in un colpo solo.

**Tu**

> Ci sta. È una modifica sola a un report solo.

**`jira-refine`**

> Un'ultima cosa: **Team** è obbligatorio su questo progetto ed è rimasto vuoto all'intake. Chi è
> titolare di questi numeri?

**Tu**

> Il team di reporting di finance.

**`jira-refine`**

> Ecco cosa va su PROJ-421. Resta un Task, continua a non avere parent, e le parole originali con
> la loro provenienza restano esattamente dove sono: le tre sezioni qui sotto si aggiungono in
> coda. La sezione «In attesa di refinement» sparisce: è ciò che ha permesso al work item
> di esistere incompleto, e adesso la ritiro. Approvalo e lo scrivo, oppure dimmi cosa cambiare.

## Il risultato

Quello che il refinement aggiunge a PROJ-421. Il titolo, la richiesta nelle parole in cui è
arrivata e la tabella della provenienza restano come li aveva scritti l'intake; le sezioni qui
sotto si aggiungono in coda.

```markdown
## Criteri di accettazione

- [ ] I numeri mensili che arrivano al team Finance comprendono, per ogni periodo mostrato, lo
      stesso periodo dell'anno precedente.
- [ ] «Lo stesso periodo» significa lo stesso mese dell'anno fiscale, che per questa
      organizzazione comincia ad aprile.
- [ ] Dove l'anno precedente non ha dati per un periodo, il periodo è mostrato con l'assenza
      segnalata: non omesso e non a zero.
- [ ] Chi riceve oggi i numeri mensili riceve la nuova forma senza doverla chiedere.
- [ ] Chi oggi mette insieme il confronto a mano può smettere di farlo.

## Dipendenze

- Bloccato da PROJ-418 — i numeri dell'anno precedente per due dei dodici periodi non sono mai
  stati migrati, e il confronto non può essere completo finché non lo saranno.

## Fuori perimetro

Il confronto con qualsiasi periodo che non sia lo stesso periodo di un anno prima. Le medie mobili
e il confronto con un piano o una previsione sono stati sollevati ed esclusi di proposito:
cambiano il significato dei numeri, e nessuno l'ha chiesto.

Cambiare chi riceve i numeri.
```

La sezione che **non** c'è è metà del punto. L'intake aveva lasciato su PROJ-421 la dichiarazione
che il work item era grezzo e in attesa di refinement, e adesso quella dichiarazione non c'è più:
ritirata con questa stessa scrittura, non con un riordino successivo. Un work item che due paragrafi
sopra i propri criteri di accettazione dichiara di non essere pronto si contraddice da solo, e
[`jira-plan`](jira-plan.it.md), che segnala cosa non è pronto prima di pianificarlo, continuerebbe
a credere alla metà più vecchia.

L'altra cosa da guardare è che fine hanno fatto le cinque domande aperte che l'intake elencava.
Quattro sono diventate criteri di accettazione — e una di quelle ha prodotto anche il link a
PROJ-418, perché qui non le si poteva rispondere — mentre la quinta, che data sia «la prossima
chiusura», è una domanda sul quando e non sul cosa vuol dire fatto: passa alla pianificazione.
Nessuna delle cinque è stata lasciata cadere in silenzio. _Campi obbligatori non ancora compilati_
non c'è perché non ne restano: **Team** era aperto all'intake ed è stato risolto qui, e il template
dice di omettere quella sezione invece di scriverci sotto «nessuno». Il template fissa quali sezioni
compaiono e in quale ordine, e non fissa nessuna lingua: questo artefatto è in italiano perché lo
era la conversazione che l'ha prodotto.

Se la risposta sull'orizzonte di pianificazione fosse stata no, questa sezione avrebbe una forma
diversa: PROJ-421 ristretto a quello che continua a portare da sé, e accanto i figli, ciascuno
costruito dal template dell'intento che serve e ciascuno abbastanza completo da essere preso in
carico da solo. L'elenco di quei figli non compare nel testo del parent in nessuno dei due rami:
quella domanda Jira la sa già.

### L'altro ramo, lavorato

PROJ-421 è stato arricchito dov'è perché era già abbastanza piccolo. PROJ-388 — _reportistica
self-service per il team finance_ — non lo è, e la scomposizione è il ramo che finora non era
mostrato da nessuna parte.

Tre figli, perché è in tre che il lavoro si è diviso e non perché qualcuno puntasse a quel numero:

```text
PROJ-388  Reportistica self-service per il team finance      ← il parent, ristretto
├── PROJ-401  Chi lavora in finance sceglie un periodo e ne vede i numeri
├── PROJ-402  Chi lavora in finance confronta un periodo con lo stesso di un anno prima
└── PROJ-403  Chi lavora in finance esporta quello che sta guardando
```

Ognuno porta i propri criteri di accettazione, concordati prima che esistesse anche solo uno di
loro: l'intera scomposizione passa dal cancello una volta sola, mai figlio per figlio. PROJ-402 è
quello che fa vedere perché. Da solo è un confronto di niente, quindi i suoi criteri nominano la
selezione del periodo che dà PROJ-401 — e quello diventa un link fra i due, non una frase in una
descrizione.

**Cosa dice il parent dopo** è la parte che nessuna fonte mostrava:

> **Prima** — Reportistica self-service per il team finance. Ci chiedono ogni numero di cui hanno
> bisogno e ogni richiesta costa mezza giornata a qualcuno. Dovrebbero poter scegliere un periodo,
> confrontarlo con l'anno prima, e portarsi via il risultato.
>
> **Dopo** — Reportistica self-service per il team finance. Ci chiedono ogni numero di cui hanno
> bisogno e ogni richiesta costa mezza giornata a qualcuno. Quello che serve è PROJ-401, PROJ-402 e
> PROJ-403.

Il parent tiene l'argomento e cede la specifica. Quello che **non** deve tenere è un elenco dei
suoi figli: la gerarchia su Jira si interroga, e un elenco tenuto a mano è una seconda risposta che
smentisce la prima il giorno in cui qualcuno aggiunge un quarto figlio.

**Quando la gerarchia non la regge**, la scomposizione viene rifiutata — e il rifiuto non chiude lo
scambio. Il profilo sa quali work type possono contenere quali, quindi quello che torna è cosa
questo progetto può sostenere, dal più economico: un'altra coppia di type che la gerarchia ammette,
poi arricchire PROJ-388 dov'è, poi un cambio di schema — che è di un project admin e non tuo.

## Cosa non fa

- **Inventare criteri di accettazione che non hai concordato.** Criteri che nessuno ha concordato
  restano criteri di cui qualcuno risponderà.
- **Scomporre lungo gli strati di una soluzione.** Un figlio per strato produce pezzi che si
  possono finire solo insieme: è la scomposizione del progetto, non del lavoro.
- **Stimare**, né decidere priorità o sequenza. Quella è pianificazione, e un work item rifinito è
  esattamente ciò che permette a [`jira-plan`](jira-plan.it.md) di farla senza indovinare.
- **Creare figli che la gerarchia non può reggere.** Rifiuta la scomposizione, dice perché, e
  lascia il work item intero invece di produrre orfani.
- **Tenere l'elenco dei figli nel testo del parent.** La relazione vive su Jira e lì si interroga.
- **Riscrivere la richiesta originale.** Quello che è stato chiesto resta sul work item accanto a
  quello che è stato concordato.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — il project profile, il draft gate, i
  due channel, e dove il refinement si colloca nel percorso completo.
- [`jira-capture`](jira-capture.it.md) — l'intake che questa skill chiude. Quello che registra è
  grezzo per dichiarazione, e questo è l'intento che ritira quella dichiarazione.
- [`jira-plan`](jira-plan.it.md) — per decidere quando il lavoro rifinito viene affrontato.
- [`jira-diagnose`](jira-diagnose.it.md), [`jira-assess`](jira-assess.it.md) e
  [`jira-propose`](jira-propose.it.md) — gli intenti dai cui template si costruisce un figlio, e le
  skill a cui rivolgersi quando quello che hai è un work item nuovo e non uno che esiste già.
