# `/jira-doctor` — controllare l'ambiente

<!-- skill-header:start -->

|                 |                                                          |
| --------------- | -------------------------------------------------------- |
| **Nome**        | `/jira-doctor`                                           |
| **Tipo**        | comando                                                  |
| **Invocazione** | `/jira-doctor`                                           |
| **Strumenti**   | `Bash(claude:*)` `Bash(jira:*)` `Bash(command:*)` `Read` |

<!-- skill-header:end -->

## Cosa fa

Controlla le tre cose di cui le skill Jira hanno bisogno, e le riporta tutte e tre. L'Atlassian
MCP server deve essere raggiungibile esattamente con l'id `atlassian`; la `jira` CLI deve
rispondere quando è una skill a chiamarla; e `.jira/project-profile.md` deve esistere. Falliscono
in modo indipendente, quindi il report dice quale ha fallito e cosa fare per ciascuna.

Ispeziona soltanto. Non esegue mai un login interattivo e non scrive configurazione al posto tuo:
stampa il comando esatto e si ferma. In questa pagina non c'è nessun draft gate — il cancello che
precede ogni scrittura su Jira — perché non viene scritto niente.

## Quando si attiva · quando no

Si attiva quando lo digiti, e in nessun altro momento: è un comando, non una skill, quindi niente
di quello che dici lo invoca per conto suo. `/jira-doctor help` stampa il blocco Usage ed esce
senza controllare nulla.

| Se dici qualcosa come                                         | Quello che ti serve è                                                             |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| «qualunque cosa chieda, su Jira non arriva niente»            | `/jira-doctor`                                                                    |
| «ho appena installato il plugin»                              | `/jira-doctor`, poi [`jira-init`](../skills/jira-init.it.md)                      |
| «com'è configurato il mio progetto Jira?»                     | [`jira-init`](../skills/jira-init.it.md)                                          |
| «una skill si è fermata dicendo che manca il project profile» | `/jira-doctor` te lo conferma, [`jira-init`](../skills/jira-init.it.md) lo scrive |
| «configuralo tu l'MCP server»                                 | nessuno qui: il comando stampa il comando, poi lo esegui tu                       |

Il confine con [`jira-init`](../skills/jira-init.it.md) è quale domanda si sta facendo.
`/jira-doctor` chiede se questa macchina riesce a raggiungere Jira. `jira-init` chiede com'è
configurato il tuo progetto, e ha bisogno che la risposta alla prima domanda sia già sì.

## Come si usa

Digitalo e leggi le tre righe. Non c'è niente da approvare e niente da annullare.

**1 · Cerca un server che si chiami esattamente `atlassian`.** L'id è fissato per convenzione, non
per preferenza: le skill dichiarano `mcp__atlassian` in un frontmatter statico, e un frontmatter
non può leggere un file. Un server connesso con qualsiasi altro nome — `Atlassian`,
`mcp-atlassian`, `jira` — non serve nessuna skill di questo plugin per quanto sano possa sembrare,
ed è il guasto che assomiglia al non succedere niente. Il rimedio è ridichiarare lo stesso server
con l'id richiesto, prendendo il transport e l'URL dalla riga che c'è già:

```bash
claude mcp remove <l'id che hai trovato>
claude mcp add --transport <il suo transport> atlassian <il suo URL>
```

**2 · Un connettore Atlassian aggiunto dalle impostazioni di claude.ai è lo stesso guasto con
un'altra faccia.** La sua riga si legge `claude.ai Atlassian`, si dichiara connesso, e continua a
non servire nessuna skill: un connettore espone i suoi tool sotto un identificatore che assegna il
meccanismo dei connettori, non sotto il nome che la riga mostra, quindi `mcp__atlassian` non lo
può agganciare su nessuna macchina. `/jira-doctor` non ti dice di rinominarlo né di rimuoverlo —
nessuna delle due cose è offerta, e rinominarlo non cambierebbe comunque l'identificatore. Ti dice
di dichiarare il server che serve alle skill **accanto** a lui, a livello di progetto, in un
`.mcp.json` alla radice del repository su cui stai lavorando:

```json
{
  "mcpServers": {
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/mcp"
    }
  }
}
```

Claude Code ti chiede di approvarlo alla prossima apertura del repository, e il file contiene un
URL e nessuna credenziale, quindi si può committare e il team lo configura una volta sola. In
entrambi i casi il server parte non autenticato, quindi aspettati di doverlo autenticare subito
dopo. Un'ultima avvertenza di questo passo: un server aggiunto, approvato o autenticato **durante**
una sessione può non essere utilizzabile in quella sessione. Se la riga risulta connessa e nella
sessione non c'è nessun tool Atlassian, l'ambiente è a posto e la sessione è vecchia: aprine una
nuova ed esegui di nuovo il controllo.

**3 · Il controllo della CLI distingue due guasti diversi.** La `jira` CLI serve solo per il
dominio Agile — board, sprint, backlog — quindi la sua assenza è una degradazione parziale, non un
ambiente morto, e il controllo prosegue fino in fondo comunque. Se è installata ma non risponde,
due cause si somigliano dall'esterno e vogliono rimedi diversi. `/jira-doctor` stabilisce quale
sia prima di prescrivere qualcosa, verificando separatamente la credenziale e il file di
configurazione. Nessuna delle due verifiche stampa il tuo token, e nessuna deve mai essere fatta
stampare.

| Cosa trova                                    | Cosa significa                                                        | Cosa fai                                    |
| --------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| credenziale assente                           | il token non è visibile alla shell che usano le skill                 | esportalo dove la tua shell lo legge, sotto |
| credenziale presente, configurazione assente  | installata ma mai configurata                                         | esegui tu `jira init`, è interattivo        |
| credenziale presente, configurazione presente | la credenziale è rifiutata — scaduta o revocata, con ogni probabilità | un token nuovo, esportato allo stesso modo  |

La prima riga è quella su cui si inciampa. Le skill raggiungono la CLI attraverso `Bash(jira:*)`,
una shell **non interattiva**, e quale file di avvio una shell così legga — ammesso che ne legga
uno — dipende dalla shell. Un token esportato da un file che legge solo una shell interattiva
funziona quindi benissimo nel tuo terminale ed è invisibile a ogni skill, che è esattamente
l'aspetto di una CLI mai configurata.

Per questo il comando stabilisce quale sia la tua shell prima di nominare un file: la risposta non
è lo stesso file, e sotto una delle tre non è affatto un file.

| La tua shell | Dove va l'export                                                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zsh`        | `~/.zshenv`, che ogni zsh legge. Mai `~/.zshrc`, che legge solo una shell interattiva.                                                                                     |
| `bash`       | `~/.bash_profile` oppure `~/.profile` — `~/.bashrc` non basta, perché una bash non interattiva non legge alcun file di avvio suo, a meno che `BASH_ENV` non ne nomini uno. |
| `fish`       | `set -Ux JIRA_API_TOKEN …` al prompt: una variabile universale esportata, che vive fuori da ogni file di avvio.                                                            |

Per zsh e bash la riga è la stessa, e va in una tua configurazione, quindi il comando riporta il
file e la riga e non la scrive mai al posto tuo:

```bash
export JIRA_API_TOKEN=<token da https://id.atlassian.com/manage-profile/security/api-tokens>
```

Qualunque sia la shell, la modifica raggiunge solo le sessioni che apri dopo.

`jira init` è il rimedio solo per la seconda riga, e viene per secondo apposta: si autentica
mentre gira, quindi senza token risponde `401 Unauthorized` e non scrive niente. Prescritto per
una credenziale mancante ti costa un giro a vuoto e ti dice che la configurazione è rotta quando
non lo è.

**4 · Legge il project profile invece di limitarsi a verificarne l'esistenza.**
`.jira/project-profile.md` — il file che registra l'esito della discovery, cioè la lettura della
configurazione reale del progetto — è quello che ogni skill legge come primo passo; senza, si
fermano prima di fare qualsiasi cosa. Leggere il file tiene questo passo dentro a quello che il
comando dichiara, e un file assente torna come un ordinario «non trovato» invece che come
un'uscita diversa da zero che si legge come un guasto. Il rimedio è la skill
[`jira-init`](../skills/jira-init.it.md), che scopre il progetto e scrive il project profile.

**5 · Riporta i tre controlli insieme, mai solo il primo fallito.** Sapere che manca l'MCP server
**e** che la CLI è al buio ti risparmia un secondo giro. I quattro stati che distingue: passano
tutti e tre e sei pronto; MCP a posto e CLI assente vuol dire utilizzabile, con le operazioni su
sprint e board non disponibili; MCP assente vuol dire non utilizzabile, perché ogni skill di
scrittura passa di lì; project profile assente vuol dire eseguire `jira-init`. Vedi
[il processo di sviluppo](../development-process.it.md) per i due channel — le vie con cui una
skill parla a Jira — e per cosa possiede ciascuno.

## Scambio di esempio

**Tu**

> `/jira-doctor`

**`/jira-doctor`**

> Tre controlli, tre esiti.
>
> | Controllo       | Esito                                                                 |
> | --------------- | --------------------------------------------------------------------- |
> | MCP server      | ❌ connesso, e inutilizzabile da queste skill — `claude.ai Atlassian` |
> | Jira CLI        | ❌ installata, ma il token non è visibile a questa shell              |
> | Project profile | ❌ `.jira/project-profile.md` non esiste                              |
>
> La riga Atlassian che hai è un connettore aggiunto dalle impostazioni di claude.ai. Funziona, e
> nessuna skill di qui lo vede: i tool di un connettore sono esposti sotto un identificatore che
> assegna il meccanismo dei connettori, non sotto il nome che la riga mostra, e le skill chiedono
> `mcp__atlassian`. Lascialo dov'è e dichiara accanto a lui il server che serve, in un `.mcp.json`
> alla radice di questo repository: le quattro righe sono sotto il report.
>
> Sulla CLI: `jira` 1.5.2 è installata, `jira me` non risponde, e le verifiche dicono
> `credential: absent`, `config: present`, `shell: zsh`. Sotto zsh la riga di export va in
> `~/.zshenv`: aggiungila e apri una sessione nuova.

**Tu**

> Quindi eseguo `jira init`?

**`/jira-doctor`**

> No: quello è il rimedio per un guasto diverso, e tu non hai quello. Il file di configurazione ce
> l'hai già; quello che manca è il token, nella shell che usano le skill. `jira init` si autentica
> mentre gira, quindi senza token risponderebbe `401 Unauthorized` e non scriverebbe niente, e
> torneresti qui convinto che la tua configurazione sia rotta. Esporta `JIRA_API_TOKEN` in
> `~/.zshenv` — non in `~/.zshrc`, che una zsh non interattiva non legge mai — e rieseguimi.

**Tu**

> E il connettore, lo rimuovo?

**`/jira-doctor`**

> Non c'è niente da rimuovere: `claude mcp get` su quella riga riporta lo scope `claude.ai config`,
> senza transport, senza URL e senza comando di rimozione. Nemmeno rinominarlo servirebbe, perché
> l'identificatore con cui arrivano i suoi tool non è il nome che vedi. Non costa niente e serve ad
> altre cose: lascialo, e aggiungi `atlassian` accanto.

## Il risultato

Il report come arriva in chat. Non viene scritto niente: né su Jira, né sulla tua macchina.

```text
MCP server       ❌  connesso, e inutilizzabile da queste skill
     trovato     una riga di nome "claude.ai Atlassian"
     perché      un connettore espone i suoi tool sotto un identificatore che assegna il
                 meccanismo dei connettori, non sotto il nome che la riga mostra, quindi
                 mcp__atlassian non lo aggancia su nessuna macchina
     rimedio     lascia stare il connettore e dichiara accanto a lui il server che serve alle
                 skill, a livello di progetto, in un .mcp.json alla radice di questo repository:

                   {
                     "mcpServers": {
                       "atlassian": {
                         "type": "http",
                         "url": "https://mcp.atlassian.com/v1/mcp"
                       }
                     }
                   }

                 parte non autenticato — autenticalo prima di eseguire qualsiasi cosa

Jira CLI         ❌  il token non è visibile a questa shell
     trovato     jira version 1.5.2 · credential: absent · config: present · shell: zsh
     perché      le skill raggiungono la CLI attraverso una shell non interattiva, che sotto
                 zsh legge ~/.zshenv e mai ~/.zshrc — un token esportato in ~/.zshrc funziona
                 nel tuo terminale ed è invisibile qui
     rimedio     aggiungi tu questa riga a ~/.zshenv, poi apri una sessione nuova:

                   export JIRA_API_TOKEN=<token da
                   https://id.atlassian.com/manage-profile/security/api-tokens>

                 non jira init: la configurazione c'è già

Project profile  ❌  nessun project profile
     trovato     .jira/project-profile.md non esiste
     rimedio     esegui la skill jira-init — scopre il progetto e scrive il file

Non ancora utilizzabile. Ogni skill di scrittura passa dall'MCP server, quindi parti da lì. La
CLI presidia solo board, sprint e backlog; il resto del plugin funziona anche senza.
```

Tre cose rendono questo report degno di essere letto invece che rieseguito. Le tre righe sono
indipendenti, quindi sistemi tre cose in un passaggio solo invece di scoprirle un guasto alla
volta. Ogni riga porta il rimedio della causa che è stata davvero stabilita, ed è il motivo per
cui la riga della CLI dice a voce alta _non `jira init`_: è il comando a cui si pensa per primo, e
qui fallirebbe con `401` senza scrivere niente. E la riga dell'MCP non ti chiede di rimuovere
niente: il connettore non è una configurazione sbagliata e non è colpa tua, è semplicemente
invisibile a un `mcp__atlassian` statico.

Quando passano tutti e tre, lo stesso report sono quattro righe:

```text
MCP server       ✅  atlassian — connesso
Jira CLI         ✅  jira version 1.5.2 — autenticata
Project profile  ✅  .jira/project-profile.md

Pronto.
```

## Cosa non fa

- **Autenticarti.** Nessun login interattivo, mai: né l'autenticazione dell'MCP server né
  `jira init`. Stampa il comando e si ferma.
- **Scrivere configurazione al posto tuo.** Né `.mcp.json`, né il file di avvio della tua shell,
  né `.jira/project-profile.md`. Uno di questi è un tuo dotfile, e l'ultimo è di
  [`jira-init`](../skills/jira-init.it.md).
- **Stampare la tua credenziale.** Le verifiche riportano presenza o assenza, mai un valore.
- **Fermarsi al primo fallimento.** Tutti e tre i controlli girano, e una CLI assente non chiude
  il controllo prima che il project profile venga guardato.
- **Rinominare o rimuovere un connettore claude.ai.** Claude Code non offre nessuna delle due cose
  per una riga così, e rinominarlo non cambierebbe l'identificatore con cui arrivano i suoi tool.
- **Inventare un endpoint.** Per un server con l'id sbagliato riusa il transport e l'URL della riga
  che c'è già; se la riga non li mostra, te li chiede invece di indovinarli.
- **Riportare una sessione vecchia come un guasto di configurazione.** Un server che
  `claude mcp list` mostra connesso mentre nella sessione non c'è nessun tool Atlassian vuol dire
  aprire una sessione nuova, non sistemare la tua configurazione.
- **Fare la discovery del tuo progetto.** Work type, status, board e fix version non sono affari
  suoi.

## Vedi anche

- [Il processo di sviluppo](../development-process.it.md) — i due channel, quali operazioni
  possiede ciascuno, e cosa contiene il project profile.
- [`jira-init`](../skills/jira-init.it.md) — la skill che scopre il progetto e scrive il project
  profile di cui questo comando verifica l'esistenza.
- `jira-plan` e `jira-release` sono le due skill che raggiungono il dominio Agile, quindi sono
  quelle che ammutoliscono quando il controllo della CLI fallisce; tutto il resto continua a
  funzionare sul solo MCP server.
