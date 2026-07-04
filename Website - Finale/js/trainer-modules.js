// Trainer modules - dati caricati inline per evitare problemi di fetch
window.INLINE_TRAINER_MODULES = {
  "rinnovo": {
    "title": "Rinnova un abbonamento",
    "icon": "&#128260;",
    "color": "#CA1424",
    "gradient": "linear-gradient(135deg, #CA1424 0%, #A0101C 100%)",
    "estimatedTime": "5 minuti",
    "category": "acquisto",
    "summary": "Guida passo-passo per scegliere, preparare documenti e acquistare un abbonamento TPER.",
    "welcome": "Vedrai, basta un passo alla volta — iniziamo a rinnovare il tuo abbonamento!",
    "steps": [
      {
        "title": "Scegli il tipo di abbonamento",
        "desc": "Qui sopra trovi tutte le opzioni: urbano mensile (51\u20ac) o annuale (390\u20ac), extraurbano (da 35\u20ac/mese), agevolato ISEE (da 30\u20ac/mese), studente (260\u20ac/anno) o famiglia (sconto 20%). Confronta prezzi e scegli quello che fa per te.",
        "highlight": "#subscription-types",
        "tip": "Se viaggi tutti i giorni conviene l'annuale: risparmi oltre il 35% rispetto al mensile.",
        "completionMessage": "Tipo di abbonamento scelto"
      },
      {
        "title": "Prepara i documenti",
        "desc": "Ti serviranno: documento d'identit\u00e0 valido, codice fiscale e una foto tessera. Se richiedi agevolazioni, prepara anche la certificazione ISEE corrente o il certificato di iscrizione (studenti). Per l'abbonamento famiglia serve lo stato di famiglia.",
        "highlight": "#documents-section",
        "tip": "NON iniziare la procedura senza tutti i documenti pronti. Alcune agevolazioni richiedono ISEE aggiornato.",
        "completionMessage": "Documenti pronti"
      },
      {
        "title": "Scegli il tipo di rinnovo",
        "desc": "Qui devi indicare se il tuo abbonamento \u00e8 personale (legato al tuo codice fiscale) o impersonale (non nominativo). Se \u00e8 impersonale, clicca su 'Rinnova senza Accesso' qui sotto. Ti baster\u00e0 il numero tessera. Se \u00e8 personale, devi prima accedere.",
        "highlight": null,
        "tip": "Clicca su 'Rinnova senza Accesso' per abbonamenti impersonali. Per quelli personali, usa 'Accedi per Rinnovare'.",
        "action": {
          "textKey": "trainer.goto-rinnovo",
          "url": "solweb/rinnova.html"
        },
        "completionMessage": "Tipo di rinnovo scelto"
      },
      {
        "title": "Inserisci il numero tessera",
        "desc": "Dopo aver scelto il rinnovo impersonale, inserisci qui il numero della tua tessera o Roger Card. Poi clicca 'Conferma e Procedi' per passare al pagamento.",
        "highlight": "#tessera",
        "tip": "Il numero tessera si trova sul retro della tua carta TPER o Roger Card.",
        "completionMessage": "Numero tessera inserito"
      },
      {
        "title": "Effettua il pagamento",
        "desc": "Online: carta di credito, PayPal o bonifico. In punto vendita: contanti o carta. Conserva SEMPRE la ricevuta: fa fede come titolo di viaggio per i primi 3 giorni.",
        "highlight": null,
        "tip": "NON buttare la ricevuta! La ricevuta via email \u00e8 il tuo titolo di viaggio fino all'arrivo della tessera.",
        "completionMessage": "Pagamento completato"
      },
      {
        "title": "Ricevi la tessera e inizia a viaggiare",
        "desc": "Se hai acquistato online ricevi l'abbonamento via email (digitale). Se hai gi\u00e0 una Roger Card, la ricarica \u00e8 immediata. Se hai acquistato al Punto Tper, ritiri la tessera cartacea. Buon viaggio!",
        "highlight": null,
        "completionMessage": "Abbonamento ricevuto, buon viaggio!"
      }
    ]
  },
  "acquista": {
    "title": "Acquista un abbonamento",
    "icon": "&#127760;",
    "color": "#1565C0",
    "gradient": "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
    "estimatedTime": "6 minuti",
    "category": "acquisto",
    "summary": "Guida passo-passo per acquistare un nuovo abbonamento TPER, dalla scelta del piano alla ricevuta.",
    "welcome": "Acquistare il tuo abbonamento \u00e8 semplice! Ti guido passo dopo passo, dal login alla conferma.",
    "steps": [
      {
        "title": "Accedi a solweb",
        "desc": "Per acquistare un abbonamento devi prima accedere. Inserisci il tuo Codice Fiscale o Email e la password, poi clicca Accedi. Se non hai un account, registrati prima.",
        "highlight": "#username",
        "tip": "Se non ricordi la password, usa il link 'Password dimenticata?' in fondo alla pagina.",
        "action": {
          "textKey": "trainer.goto-piani",
          "url": "dashboard.html?login=ok"
        },
        "completionMessage": "Accesso effettuato"
      },
      {
        "title": "Scegli Acquista Abbonamento",
        "desc": "Ora sei nella Dashboard. Qui puoi scegliere tra Acquista, Rinnova o Verifica Tessera. Clicca su 'Acquista Abbonamento' per vedere i piani disponibili.",
        "highlight": "#welcome-banner",
        "tip": "La card verde 'Acquista Abbonamento' \u00e8 la prima che vedi. Clicca su 'Scegli il Piano'.",
        "action": {
          "textKey": "trainer.goto-piani",
          "url": "piani.html?login=ok"
        },
        "completionMessage": "Pronto per scegliere il piano"
      },
      {
        "title": "Scegli il piano",
        "desc": "Qui trovi tre opzioni: Mensile Urbano (51\u20ac/mese), Annuale Urbano (390\u20ac/anno, risparmi il 35%), e Annuale Extraurbano (da 35\u20ac/mese). Scegli quello pi\u00f9 adatto alle tue esigenze e clicca su Acquista Online.",
        "highlight": "#subscription-plans",
        "tip": "Se viaggi tutti i giorni conviene l'annuale: risparmi oltre il 35% rispetto al mensile.",
        "completionMessage": "Piano scelto"
      },
      {
        "title": "Prepara i documenti",
        "desc": "Prima di pagare, prepara i documenti necessari: documento d'identit\u00e0 valido, codice fiscale e foto tessera. Se richiedi agevolazioni, serve anche ISEE o certificato di iscrizione.",
        "highlight": "#document-checklist",
        "tip": "Spunta i documenti che hai gi\u00e0 pronto. La barra verde ti mostra quanti te ne mancano.",
        "action": {
          "textKey": "trainer.goto-documenti",
          "url": "documenti.html?login=ok"
        },
        "completionMessage": "Documenti pronti"
      },
      {
        "title": "Completa il pagamento",
        "desc": "Inserisci i tuoi dati personali (nome, cognome, email), scegli il metodo di pagamento (carta, PayPal o bonifico) e clicca su Paga. Controlla il riepilogo prima di confermare.",
        "highlight": "#nome",
        "tip": "Tutti i pagamenti sono protetti con crittografia SSL a 256 bit.",
        "action": {
          "textKey": "trainer.goto-pagamento",
          "url": "pagamento.html?login=ok"
        },
        "completionMessage": "Pagamento completato"
      },
      {
        "title": "Ricevi la conferma",
        "desc": "Verifica il riepilogo dell'ordine: tipo di abbonamento, totale pagato e numero ordine. Scarica la ricevuta PDF per i tuoi archivi. L'abbonamento \u00e8 subito attivo!",
        "highlight": "#conferma-ok",
        "tip": "Conserva la ricevuta: via email \u00e8 il tuo titolo di viaggio fino all'arrivo della tessera.",
        "completionMessage": "Abbonamento acquistato, buon viaggio!"
      }
    ]
  },
  "viaggio": {
    "title": "Pianifica un viaggio",
    "icon": "&#128506;",
    "color": "#E65100",
    "gradient": "linear-gradient(135deg, #E65100 0%, #BF360C 100%)",
    "estimatedTime": "3 minuti",
    "category": "informazione",
    "summary": "Scopri come usare il pianificatore di viaggio TPER per trovare il percorso migliore con bus, treno, bici o a piedi.",
    "welcome": "Trovare il percorso giusto è facile! Ti guido passo dopo passo.",
    "steps": [
      {
        "title": "Inserisci la partenza",
        "desc": "Scrivi il tuo indirizzo, una fermata o il nome di una via nel campo 'Partenza'. Il sistema ti suggerir\u00e0 le opzioni mentre scrivi.",
        "highlight": "#from",
        "tip": "Digita qui il punto di partenza: indirizzo, via o nome della fermata.",
        "hint": true,
        "completionMessage": "Partenza inserita"
      },
      {
        "title": "Inserisci la destinazione",
        "desc": "Ora scrivi dove vuoi arrivare nel campo 'Destinazione'. Puoi usare nomi di vie, fermate, monumenti o quartieri.",
        "highlight": "#to",
        "tip": "Digita qui la destinazione: indirizzo, via, monumento o quartiere.",
        "hint": true,
        "completionMessage": "Destinazione inserita"
      },
      {
        "title": "Scegli la modalit\u00e0 di trasporto",
        "desc": "Seleziona il mezzo che preferisci: bus, treno, bici o piedi. Puoi anche lasciare 'Tutti' per vedere tutte le opzioni disponibili.",
        "highlight": "#travel-mode",
        "tip": "Scegli il mezzo di trasporto: bus, treno, bici o a piedi.",
        "completionMessage": "Modalit\u00e0 scelta"
      },
      {
        "title": "Cerca il percorso",
        "desc": "Premi il pulsante 'Cerca' per avviare la ricerca. Il sistema mostrer\u00e0 tutte le opzioni di percorso disponibili con tempi e durata.",
        "highlight": "#plan-route-btn",
        "tip": "Clicca qui per cercare tutti i percorsi disponibili.",
        "hint": true,
        "action": {
          "textKey": "trainer.search-now",
          "url": null
        },
        "completionMessage": "Ricerca avviata"
      },
      {
        "title": "Confronta i risultati",
        "desc": "Scegli il percorso pi\u00f9 adatto a te confrontando durata, numero di fermate e mezzo di trasporto. Il percorso pi\u00f9 veloce \u00e8 evidenziato.",
        "highlight": "#results-container",
        "tip": "Qui appariranno i percorsi trovati. Confronta durata, fermate e mezzi.",
        "hint": true,
        "completionMessage": "Percorso trovato!"
      },
      {
        "title": "Acquista il titolo di viaggio",
        "desc": "Ricorda: su tper.it non si acquistano biglietti! Una volta trovato il percorso, vai alla pagina 'Dove Comprare' per scegliere il canale giusto per il tuo titolo di viaggio.",
        "highlight": null,
        "action": {
          "textKey": "trainer.goto-buy",
          "url": "dove-comprare.html"
        },
        "completionMessage": "Guida completata!"
      }
    ]
  },
  "biglietto": {
    "title": "Acquista un biglietto",
    "icon": "&#128722;",
    "color": "#2E7D32",
    "gradient": "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
    "estimatedTime": "3 minuti",
    "category": "acquisto",
    "summary": "Guida alla scelta del biglietto giusto e del canale pi\u00f9 comodo per acquistarlo.",
    "welcome": "Scegliere il biglietto giusto non \u00e8 mai stato cos\u00ec semplice. Partiamo!",
    "steps": [
      {
        "title": "Scegli il tipo di biglietto",
        "desc": "Corsa singola (75 minuti), carnet 10 corse (risparmi), giornaliero (tutto il giorno), o MultiPi\u00f9 (10 corse in pi\u00f9 giorni). Scegli in base a quanto viaggi.",
        "highlight": "#ticket-types",
        "tip": "Se viaggi ogni giorno conviene l'abbonamento, non il biglietto singolo!",
        "completionMessage": "Tipo di biglietto scelto"
      },
      {
        "title": "Acquista con l'App Roger (digitale)",
        "desc": "L'App Roger \u00e8 il canale pi\u00f9 comodo per biglietti singoli e carnet digitali. Scaricala sul tuo smartphone, registrati e acquista in pochi click. Il biglietto si attiva via GPS quando sali a bordo.",
        "highlight": "#roger",
        "tip": "Scarica l'App Roger per acquistare biglietti digitali direttamente dal telefono.",
        "action": {
          "textKey": "trainer.goto-roger",
          "url": "dove-comprare.html#roger"
        },
        "completionMessage": "App Roger: biglietto acquistato!"
      },
      {
        "title": "In alternativa: canale fisico",
        "desc": "Puoi comprare biglietti cartacei in qualsiasi Punto Tper, tabaccheria convenzionata o edicola con PuntoLis. Paghi in contanti o carta.",
        "highlight": "#punti-tper",
        "tip": "Trova il Punto Tper più vicino per acquistare biglietti cartacei.",
        "action": {
          "textKey": "trainer.goto-points",
          "url": "dove-comprare.html#punti-tper"
        },
        "completionMessage": "Canale fisico individuato"
      },
      {
        "title": "Valida il titolo prima di salire",
        "desc": "Se hai un biglietto cartaceo, timbralo nell'apposita macchinetta gialla a bordo o in fermata. Se usi l'App Roger, assicurati che il GPS sia attivo: la validazione \u00e8 automatica.",
        "highlight": null,
        "tip": "Viaggiare senza biglietto validato comporta una sanzione fino a 250 euro.",
        "completionMessage": "Biglietto validato, buon viaggio!"
      }
    ]
  },
  "ricarica": {
    "title": "Ricarica la tessera",
    "icon": "&#128179;",
    "color": "#6A1B9A",
    "gradient": "linear-gradient(135deg, #6A1B9A 0%, #4A148C 100%)",
    "estimatedTime": "2 minuti",
    "category": "ricarica",
    "summary": "Scopri come ricaricare la tua Roger Card o tessera TPER nei punti vendita fisici o tramite App Roger.",
    "welcome": "Ricarica la tua tessera in pochi minuti. Ti mostro come fare.",
    "steps": [
      {
        "title": "Scegli il metodo di ricarica",
        "desc": "Puoi ricaricare in tre modi: in tabaccheria/PuntoLis (contanti o carta), all'App Roger (digitale), o in un Punto Tper (sportello). Scegli quello pi\u00f9 comodo per te.",
        "highlight": null,
        "completionMessage": "Metodo scelto"
      },
      {
        "title": "Ricaricare in tabaccheria / PuntoLis",
        "desc": "Vai in una tabaccheria o edicola con il simbolo PuntoLis. Consegna la Roger Card e chiedi una ricarica. Puoi ricaricare l'importo che preferisci. Il saldo viene aggiornato subito.",
        "highlight": "#tabaccherie",
        "tip": "Cerca una tabaccheria o edicola con il simbolo PuntoLis per ricaricare.",
        "completionMessage": "Ricarica in tabaccheria: fatta!"
      },
      {
        "title": "Ricaricare con App Roger",
        "desc": "Apri l'App Roger, vai alla sezione 'Ricarica', inserisci il numero della tua Roger Card e scegli l'importo. Il pagamento \u00e8 digitale e il saldo \u00e8 disponibile subito.",
        "highlight": "#roger",
        "tip": "Apri l'App Roger sul telefono e vai alla sezione Ricarica.",
        "completionMessage": "Ricarica digitale completata"
      },
      {
        "title": "Ricaricare online su solweb",
        "desc": "Vai su solweb.tper.it, inserisci il numero tessera e scegli l'importo (10, 20, 50 euro o personalizzato). Paghi con carta o PayPal. Il saldo \u00e8 disponibile subito. Nessuna registrazione necessaria.",
        "highlight": "#tessera",
        "tip": "Inserisci il numero della tua tessera o Roger Card e seleziona l\u2019importo che vuoi ricaricare.",
        "action": {
          "textKey": "trainer.goto-ricarica",
          "url": "solweb/ricarica.html"
        },
        "completionMessage": "Ricarica online completata"
      },
      {
        "title": "Verifica il saldo prima di salire",
        "desc": "Prima di salire a bordo, controlla che la ricarica sia effettivamente avvenuta. Puoi verificare il saldo in una tabaccheria, su App Roger o chiamando il numero verde TPER.",
        "highlight": null,
        "tip": "Un saldo insufficiente a bordo \u00e8 considerato evasione tariffaria.",
        "completionMessage": "Tutto a posto, buon viaggio!"
      }
    ]
  }
};
