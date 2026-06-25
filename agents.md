# TPER UX Design — Project Agent Handoff

## Project Path
`C:\Users\stef3\OneDrive\Esame__UUXD`

## File Inventory (current)

### main.tex — 218 KB / 3477 righe
- **Phase C Cards:** Market Research (#3), Assessment (TPER + ATAC), Preliminary User Testing (TPER + ATAC), Conclusion
- **Snellimenti applicati:**
  - Card #3: "Segment of choice" + "Reason for choice" unificati; aggiunte interviste one-on-one su moduli stampabili
  - Assessment Card: ridotta ~25%; rimosso `\newpage` tra TPER e ATAC
  - Testing protocol: ogni test TPER/ATAC ha "Session details" (Name+Date+Assistant+Context uniti) e "SUS and reflections" (SUS+Suggestions+Outcomes uniti); fusi Testing method + methodology ATAC; accorciate descrizioni task
- **Label di ancoraggio:** `\phantomsection\label{test:sergio}`, `test:laura`, `test:chris`, `test:maria`, `test:atac-sergio`, `test:atac-laura`, `test:atac-chris`, `test:atac-maria`

### Website/css/style.css — 37.5 KB / 1439 righe
TPER red palette #CA1424, tutti i componenti (header, hero, route planner, cards, stepper, accordion, comparison table, modal, skeleton loading, trainer sidebar, a11y controls, high contrast, font scaling, responsive breakpoints).
- `body.high-contrast` selettore corretto (linea 713)
- Classi `.sanzioni-*` per tab switching pratiche/CF (linee 819–850)
- `.trainer-toggle-btn`: FAB fisso in basso a destra (44×44px, `#CA1424`, linea 1052)

### Website/js/i18n.js — 61 KB / 1077 righe
- IT/EN/AR dizionari (~297 keys ciascuno)
- `translate()`, `setLang()`, `getCurrentLang()`, auto-init
- RTL per arabo, `data-i18n`/`data-i18n-placeholder`/`data-i18n-aria`
- Chiavi `nav.percorso`/`footer.percorso` rimosse

### Website/js/app.js — 50 KB / 1085 righe
- Trainer mode modulare (4 attività, walkthrough con highlight)
- Hamburger menu, contrast/font a11y, language switch (IT/EN/AR)
- Route planner, channel redirect modal, wizard, accordion, back-to-top, skeleton loading
- `escapeHtml`: 1 definizione (linea 196)
- `.trainer-toggle-btn` click handler (linee 1095–1102)
- `loadTrainerStats()` con try/catch (linea 345)

### HTML Pages (12 total)
| File | Descrizione | trainer-toggle-btn |
|------|-------------|-------------------|
| `index.html` | Homepage — route planner hero, 6 info cards, info banner | Prima di `</body>` |
| `pianifica.html` | Route planner page | Prima di `</body>` |
| `dove-comprare.html` | Channel guide + wizard + sanzioni card | Prima di `</body>` |
| `biglietti.html` | Ticket information | Prima di `</body>` |
| `abbonamenti.html` | Subscription info | Prima di `</body>` |
| `aiuto.html` | Help + trainer-mode activation | Prima di `</body>` |
| `404.html` | Error page | Prima di `</body>` |
| `solweb/login.html` | Login + Acquisto Impersonale | Prima di `</body>` |
| `solweb/piani.html` | 3 plan cards + guest mode detection | Prima di `</body>` |
| `solweb/documenti.html` | Required documents checklist | Prima di `</body>` |
| `solweb/pagamento.html` | Order summary + payment + guest mode | Prima di `</body>` |
| `solweb/sanzioni.html` | Fines payment (no registration), tab pratiche/CF | Prima di `</body>` |

### Phase C PDFs
| Document | File | Size attuale |
|----------|------|--------------|
| IA Card | `IA/02-ia-card.pdf` | 178 KB |
| Blueprint | `Blueprint/00-blueprint-main.pdf` | 532 KB |
| Wireframes | `Wireframes/00-wireframes-main.pdf` | 570 KB |
| Comparison | `Comparison/00-comparison-main.pdf` | 153 KB |
| Reflections | `Comparison/00-reflections.pdf` | 130 KB |

## Funzionalità Implementate

### Trainer Mode
- Attivazione: pulsante `🎓` **fisso in basso a destra** su tutte le pagine (`.trainer-toggle-btn`) + pulsante `#activate-trainer` in `aiuto.html`
- Sidebar `.trainer-bar` 320px, slide-in da destra
- 4 moduli con walkthrough: Rinnova abbonamento, Pianifica viaggio, Acquista biglietto, Ricarica tessera
- `body` si sposta `margin-right: 320px` quando aperto
- Highlight visivo (`.trainer-highlight`), progress bar, step counter, i18n completo
- Persistenza: localStorage (`tper-trainer-active`), sessionStorage (`tper-trainer-current`), URL parameter (`?trainer=<module>`)

### Guest Mode (solweb)
- `login.html` → link "Acquisto Impersonale" → `piani.html?mode=guest`
- `pagamento.html?mode=guest` → nasconde nome/cognome/email/telefono, mostra solo Numero Tessera

### Channel Guide / Dove Comprare
- Wizard interattivo (3 domande: tipo utente, esigenza, metodo pagamento)
- Risultati con link diretti a canali (solweb per acquisti, tabaccherie, Roger app, Contactless)
- Card "Sanzioni" con tab switching (Con Numero Pratica / Con Codice Fiscale)

### Accessibilità
- High contrast (body.high-contrast)
- Font scaling (A+/A-)
- Skip link, ARIA labels
- RTL support for Arabic

## Key Technical Notes
- **Color palette:** White #FFFFFF, TPER Red #CA1424, Dark #333, Grey #F5F5F5
- **CRITICAL:** tper.it è INFORMATIVO SOLO. Nessun acquisto. Acquisti reali su: solweb.tper.it, Roger app, Punti Tper, Tabaccherie/PuntoLis, Contactless a bordo
- Tutti i link `https://solweb.tper.it` esterni → sostituiti con percorsi relativi interni (`solweb/login.html` o `login.html`)
- HTML pages sono statiche (nessun build step), si aprono direttamente in browser
- Path relativi: `css/style.css`, `js/i18n.js`, `js/app.js`
- Pagine solweb/ usano `../css/style.css`, `../js/i18n.js`
- `pdflatex` per compilazione LaTeX (non installato su ambiente corrente)
- Puppeteer con Edge headless per PNG: `node capture.cjs` (Blueprint Mermaid.js → HTML → PNG)
- Blueprint source HTML in `Blueprint/html/` (bp1-ia.html, bp2-ecosystem.html, bp3-journey.html)

## Git Status
- Repository **non inizializzato** (nessun `.git`)
- Per tracciare le modifiche: `git init` + `.gitignore` (escludere `*.pdf`, `*.aux`, `*.log`, `*.out`, etc.)

## Personas
- **Maria** (79yo, SUS 27.5) — digitalmente inattiva, zero completamento
- **Laura** (70yo, 7 errori) — smartphone basilare, 20% completamento TPER
- **Chris** (34yo, 226s T1) — straniero anglofono, 40% completamento TPER
- **Fatima** (45yo) — araba parlante, scenario test
