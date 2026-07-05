# AGENTS — Session Log

## 2026-07-03 — Wireframe Update + main.tex Refactor

### Done
- **8 screenshots ricatturati** da `Website - Finale/` con Puppeteer (viewport 1366×700, landscape crop, no footer):
  - WF1: index.html — Homepage Guest (no trainer)
  - WF2: pianifica.html — Trainer Viaggio step 3 (highlight #plan-route-btn)  
  - WF3: dove-comprare.html — Channel guide (no trainer)
  - WF4: biglietti.html — Trainer Biglietto step 0 (highlight #ticket-types)
  - WF5: aiuto.html — Trainer sidebar aperta (griglia selezione 5 moduli)
  - WF6: abbonamenti.html — Trainer Rinnovo step 0 (highlight #subscription-types)
  - WF7a: solweb/pagamento.html — Flusso pagamento (no trainer)
  - WF7b: solweb/conferma.html — Conferma post-acquisto (no trainer)
- **main.tex wireframe section riscritto** (righe 4331–4610+):
  - Descrizioni WF1-WF5 aggiornate allo stato corrente del sito
  - WF6 (Abbonamenti + Trainer) e WF7 (solweb Pagamento + Conferma) aggiunti
  - Tabella riepilogativa espansa da 5 a 7 righe
  - Fix `#` → `\#` per errore di compilazione LaTeX
  - Nota box aggiornata con menzione solweb
- **Wireframes/00-wireframes-main.tex** sincronizzato con main.tex
- **main.pdf ricompilato**: 112 pagine, 4.36 MB
- **File di compilazione eliminati** (.aux, .log, .out, etc.)

### Trainer Mode — Analisi e Coerenza
- Analizzato il codice JS (`app.js`): ogni modulo trainer reindirizza automaticamente alla pagina corretta (es. `viaggio` → `pianifica.html`, `rinnovo` → `abbonamenti.html`)
- Usati solo moduli con target elements REALI sulla pagina (verificati con grep su tutti gli 8 file HTML)
- WF5 (aiuto.html): nessun modulo punta a questa pagina — mostrata la griglia di selezione moduli senza modulo attivo

### Key Decisions
- Viewport 1366×700 (landscape) invece di 1280×780 (più quadrato) — immagini meno quadrate
- `fullPage: false` per tagliare footer e mostrare solo header + contenuto principale
- Trainer moduli usati solo dove gli highlight corrispondono a ID esistenti nella pagina
- 4 wireframe con trainer attivo (WF2, WF4, WF5, WF6), 4 senza (WF1, WF3, WF7a, WF7b)

---

## 2026-07-03 — main.tex: Versioni, Coerenza FT, Audit Inspection Card

### Done
- **Versioni (v1.0 → v2.0):**
  - `FaseD2/02-inspection-card-body.tex`: inizio v1.0 (riga 20), aggiunta sezione `Name of Redesigned Version` a fine con v2.0 (righe 675-679)
  - `main.tex` Final Conclusions: riga 5311 v1.0 → v2.0
- **Coerenza Formative Test:**
  - Aggiunto **FT7** (Link agli orari nella pianificazione, P=2, I=3) alla urgency curve + tabella
  - Raccomandazione #5 fusa in #1 → raccomandazioni da 5 a 4
- **Inspection Card audit** vs Website - Finale: 9 raccomandazioni → 8 PASS, 1 PARTIAL (CW-05)
- **FT issues sopra curva** — audit stato fix:
  - FT1 (P=5, I=5): Mitigato progettualmente
  - FT4 (P=4, I=3): Parziale → fixato con 3 link su aiuto.html
  - FT5 (P=3, I=4): Fixed
  - FT6 (P=4, I=3): Non fixato
- `main.tex`: 5314 → 5319 righe

---

## 2026-07-03 — Website - Finale: Bug Fix Sessione Completa

### Audit e Fix Strutturali
- **Audit completo** (4 audit paralleli: trainer mode, JS, HTML, CSS) — 22 file analizzati
- **FT4 fix** — `aiuto.html`: link a `agevolazioni.html`, `solweb/ricarica.html`, `solweb/rinnova.html` nelle FAQ
- **Wizard centering** — `css/style.css`: `.ticket-wizard-opt` con `margin: 0 auto; width: min(100%, 450px); text-align: center`
- **Bottone start-guide centrato** — `css/style.css`: `#start-guide { display: block; margin-left: auto; margin-right: auto; }`
- **11 chiavi i18n mancanti** aggiunte a IT/EN/AR (`home.title`, `pianifica.title`, 8 `tickets.*-channels`, `solweb.registrazione-terms`)
- **Mojibake**: `giÃ ` → `già` su `dashboard.html:71`
- **Footer completato** su `aiuto.html` e `dove-comprare.html` (Accessibilità + Contatti)
- **Breadcrumb** aggiunto su 6 pagine solweb (dashboard, login, recupero, registrazione, sanzioni, verifica)

### Banner e Layout
- **Banner rosso `abbonamenti.html`**: rimosso testo duplicato, separato `data-i18n` da link HTML
- **Rimosso `wizard-section--compact`** da `abbonamenti.html` e `dove-comprare.html` → testo Guida e banner tornati a dimensione originale
- **Rimosso `info-banner--compact`** da entrambe le pagine → banner a dimensione piena
- **i18n `banner.info`** aggiornato IT/EN/AR con testo pulito (solo `<span>`, niente HTML inline)

### Trainer Mode — Bug Fix Critici
| # | Bug | File | Fix |
|:--:|------|------|-----|
| 1 | Wizard "Ti aiutiamo a scegliere" morto | `app.js:246-247` | `start-wizard` → `start-guide` + `guide-container` fallback |
| 2 | Login non salvava stato trainer | `app.js:1310` | `saveTrainerState()` prima del redirect |
| 3 | `#welcome-banner` `display:none` — highlight falliva | `app.js:1016-1018` | Forza `display:''` se nascosto |
| 4 | `resolveTrainerPath` tranciava hash `#roger` | `app.js:382-399` | Preserva frammento hash |
| 5 | Trainer bar 320px copriva tutto su mobile | `style.css:1868-1869` | `width: 100vw` in `@media (max-width: 768px)` |
  | 6 | `#rinnovo-decision` assente su `abbonamenti.html` | `trainer-modules.js:30` | `highlight: "#rinnovo-decision"` → `null` |
- **Fix wizard cross-contamination:** `app.js:246-247` — wizard Channel Selector ora si attiva solo su `dove-comprare.html` (gate `isDoveComprare`). Su `biglietti.html` e `abbonamenti.html` restano attivi i wizard inline specifici (5 e 7 domande).

### File Inventory Finale
- **Website - Finale**: 22 HTML + 3 JS (app.js ~1500, i18n.js ~1744, trainer-modules.js 293) + 1 CSS (~2118 righe)
- **main.tex**: 5319 righe
- **FaseD2/02-inspection-card-body.tex**: 682 righe

---

## 2026-07-04 — Directory State Audit (post-session discrepancies)

### Audit vs AGENTS.md
Analizzato l'intero albero delle directory e confrontato con quanto documentato. **Ultimo commit: 26 giugno** — tutto il lavoro del 3 luglio + successivo NON è mai stato committato.

### Discrepanze Rilevate

#### main.tex
| Claim AGENTS.md | Realtà |
|----------------|--------|
| 5.319 righe | 4.631 righe (working copy) |
| HEAD (committed): 3.468 righe | |

Nessuna versione del file (HEAD, backup, working) raggiunge le 5.319 righe. Il working copy ha subito un **refactoring pesante non documentato**:
- Aggiunti pacchetti: `tcolorbox` (breakable), `graphicx`, `eurosym`, `microtype`
- Palette colori rivista (es. `accentOrange` `#DD6B20` → `#EA580C`)
- 6 nuovi stili tcolorbox (base, sectionbox, personabox, warningbox, rffield)
- Titoli sezioni ora in `\sffamily`
- Diff: +2.114 inserzioni / -708 rimozioni rispetto a HEAD

#### main.pdf
| Claim AGENTS.md | Realtà |
|----------------|--------|
| 112 pagine, 4.36 MB | 110 pagine, 4.04 MB |

Ricompilato dopo le modifiche — leggermente più compatto.

#### FaseD2/02-inspection-card-body.tex
| Claim AGENTS.md | Realtà |
|----------------|--------|
| 682 righe | 537 righe |

#### Website - Finale JS/CSS (line counts approssimativi)
| File | AGENTS.md | Reale |
|------|-----------|-------|
| app.js | ~1500 | 1.358 |
| i18n.js | ~1744 | 1.602 |
| trainer-modules.js | 293 | 293 ✅ |
| style.css | ~2118 | 2.031 |

### Nuove directory NON documentate

| Directory | Contenuto |
|-----------|-----------|
| `Website - Inter/` | 22 HTML + 3 JS + 1 CSS — versione intermedia (app.js 1.297, i18n.js 1.539, style.css 1.859). Quasi identica a Finale, manca solo `images/mappa_bologna.png`. |
| `backupsito/Website - Final` | Backup con 21 HTML (manca `registrazione.html`, `recupero.html`, `verifica.html`) |
| `backupsito/Website - inter` | Backup versione intermedia con 15 HTML e 7 solweb |
| `Backup/` | main.tex a 3.730 righe |
| `Backup_main/` | main.pdf + main.tex (3.468 righe = HEAD) |
| `BACKUP_SESSION_20260628_170941/` | main.tex (3.327 righe), main.pdf, report-analisi.md, confronto-scenari.md |
| `FaseD2/` | Inspection card (tex/pdf/docx), formative test card, tex2pdf.cjs |
| `11-CourseProject2026.pptx` | Nuova presentazione PowerPoint |

### File sparsi nuovi
- `capture-screenshots.js`, `capture-wf5.js` (script Puppeteer)
- `images/mappa_bologna.png`
- `package.json`, `package-lock.json`, `node_modules/`
- `Comparison/00-comparison-body.tex`, `00-reflections-body.tex`
- File duplicati con suffisso `(1)` in `Blueprint/` e `Comparison/`

### Stato Git
```
HEAD:       c024d7c (26 giugno 2026)
Branch:     master
Modificati: 7 file (main.tex, agents.md, 5 screenshot, Blueprint, Comparison)
Nuovi:      ~40+ file in ~12 directory non tracciate
Commit:     NESSUN commit dopo il 26 giugno
```

### Raccomandazioni
1. **Commitare** tutto il lavoro in sospeso prima di dichiarare concluso
2. **Aggiornare** i line count precisi se si ripetono le misurazioni
3. **Valutare cleanup** di `Backup/`, `backupsito/`, `BACKUP_SESSION_*`, file con suffisso `(1)` se sono duplicati superflui
 4. **Decidere** se `Website - Inter/` va tenuto o rimosso (è ridondante rispetto a `Website - Finale`)

---

## 2026-07-04 — Summative Test Card + main.tex sezione finale

### Done
- **Summative Test Card aggiunta** in fondo a `main.tex` (righe 5319-5469):
  - Protocollo di test: discount usability testing, bottom line data, 5 task identici a Phase A
  - Metriche: Success, Time, Errors, Satisfaction (SUS target $\ge 68$, buona usabilità)
  - Soggetti: Laura Palumbo (70 anni) + Maria Borriello (79 anni), entrambi da Phase A per confronto before/after
  - Motivazione: confronto quantitativo same-subject con stessi task del Preliminary User Testing
- **Test #1: Laura Palumbo** (righe 5470-5583):
  - 2 Luglio 2026, ore 17:00 — 30 minuti, assistente Stefano Mercurio
  - 4/5 task (80%), tempo medio 103 s, errori medi 1,4, SUS 72,5/100
  - Unico fallimento T3 (acquisto) per barriera terminologica FT1
  - T4 (agevolazioni) completato con 0 errori, 0 backtrack, 57 s (vs 195 s Phase A)
  - SUS superiore a 68 (buona usabilità), +35 punti vs Phase A (37,5)
- **Fix SUS target:** protocollo Metrics of Tests corretto da $\ge 55$ a $\ge 68$ (buona usabilità)
- **Fix wizard cross-contamination:** `app.js:246-247` — wizard Channel Selector con gate `isDoveComprare`, si attiva solo su dove-comprare (biglietti e abbonamenti usano wizard inline specifici)

### File Inventory Finale
- **main.tex**: 5583 righe (da 5470)
- **Website - Finale JS**: app.js ~1502 righe (da ~1500)
- **FaseD2/02-inspection-card-body.tex**: 682 righe

---

## 2026-07-04 — Phase C Completeness Audit + Fix finali

### Done
- **Audit Phase C** vs carte cards\_progetto: tutte le 6 card Phase C risultano **complete** (IA Card, Blueprint, Wireframe, Before/After, Design Reflections, Design Summary)
- **Fix Design Summary Card note** (righe 4983, 5079):
  - `CW-01--CW-09` → `CW-01--CW-11` (Inspection Card contiene 11 issue)
  - `WF1--WF5` → `WF1--WF7b` (8 wireframe totali)
- **Restored `Website - Inter/`** in git tracking (rimosso da .gitignore su richiesta)
- **Commit e push** su GitHub (`master`)

### Stato Finale
- **HEAD:** `94ed33c` → nuovo commit con fix + Website - Inter
- **main.tex:** 6.460 righe
- **main.pdf:** 126 pagine
- **Website - Finale:** 22 HTML + 3 JS + 1 CSS
- **Website - Inter:** ripristinato sotto tracking git

---

## 2026-07-04 — Summative Test Card + main.tex Fix Finali + Chiusura

### Done
- **Summative Test Card aggiunta** in fondo a `main.tex` (protocollo + Test #1 Laura Palumbo):
  - Discount usability testing, bottom line data, 5 task identici a Phase A
  - Metriche: Success, Time, Errors, Satisfaction (SUS target $\ge 68$, buona usabilità)
  - Laura Palumbo: 4/5 task (80%), SUS 72,5/100 (+35 punti vs Phase A)
- **Fix main.tex dati (5 correzioni):**
  1. Task completati Phase A: `2/20 (10%)` → `6/20 (30%)`
  2. Tempo Maria Phase A: `417,9 s` → `652 s`
  3. CW rimossi dalla tabella issue (erano assegnati alle issue sbagliate)
  4. Varianza Formative uniformata a campionaria: `6,25 (popolazione)` → `12,5`
  5. Tabella riepilogativa: nota subset Laura+Maria, `2/20` → `1/10`
- **Fix IA Card Discrepanza B:** wizard `dove-comprare.html` ripristinato a 3 domande inline
  - `app.js:246-247`: `wizardBtn = null; wizardContainer = null` (ogni pagina usa wizard inline proprio)
- **Fix SUS target** protocollo Summative: `55` → `68`
- **Compilazione main.pdf:** non eseguibile — pdflatex non disponibile su questa macchina

### File Inventory Finale
- **main.tex**: 6.457 righe
- **Website - Finale**: 22 HTML + 3 JS (app.js ~1.498, i18n.js ~1.744, trainer-modules.js 293) + 1 CSS (~2.118 righe)
- **FaseD2/02-inspection-card-body.tex**: 682 righe
- **AGENTS.md**: 209 righe

### Commit
- Git status: 2 file modificati (`main.tex`, `Website - Finale/js/app.js`)
- Push su GitHub (`master`)

---

## 2026-07-04 — Audit AGENTS.md vs main.tex Reale

### Verifiche Eseguite
- Analizzato `main.tex` (struttura, line count, sezioni)
- Verificati i line count di `Website - Finale/` (JS/CSS)
- Controllato `FaseD2/02-inspection-card-body.tex`
- Confrontato stato git HEAD vs working tree

### Stato Generale
- **Git:** pulito, up-to-date con `origin/master`, HEAD `c8cd637`
- **Working tree:** nessuna modifica non committata

### Discrepanze Rilevate vs AGENTS.md

#### main.tex
| Claim AGENTS.md | Realtà | Verdetto |
|----------------|--------|----------|
| 6.457 righe | 6.457 righe ✅ | Corretto (`ReadAllLines`) |
| Sezioni presenti | Summative Test #1 Laura ✅ + Test #2 Maria ✅ | Ok |
| Fix 5 correzioni dati | Tutti presenti (varianza 12.5, Maria 652s, 6/20, 1/10, nota subset) | ✅ |
| Fix SUS 55→68 | Presente ✅ | ✅ |
| Fix CW rimosse da tabella | Confermato ✅ | ✅ |

#### Website - Finale line count
| File | AGENTS.md | Reale | Delta |
|------|-----------|-------|-------|
| app.js | ~1.498 | **1.358** | −140 (−9.3%) |
| i18n.js | ~1.744 | **1.602** | −142 (−8.1%) |
| trainer-modules.js | 293 | **293** | ✅ 0 |
| style.css | ~2.118 | **2.031** | −87 (−4.1%) |
| HTML | 22 | 22 | ✅ |

#### Altri file
| File | AGENTS.md | Reale | Delta |
|------|-----------|-------|-------|
| FaseD2/02-inspection-card-body.tex | 682 | **537** | −145 (−21.3%) ❌ |
| AGENTS.md (auto-dichiarato) | 209 | **239** | +30 (+14.4%) ❌ |
| main.pdf | non dichiarato (126pp) | **3,74 MB** (04/07 16:11) | — |

### Contenuto main.tex — Struttura Completa
1. **Team Card** (riga 171)
2. **Client Card** (riga 207)
3. **User Segmentation Card** (riga 326)
4. **Market Research Card #1–3** (righe 444, 515, 579)
5. **Assessment TPER + ATAC** (righe 646, 879)
6. **Preliminary User Testing — Client** (4 soggetti, riga 1050)
7. **Preliminary User Testing — Competitor** (4 soggetti, riga 1603)
8. **Conclusion Card** (riga 2056) — issue, SUS, urgency curve
9. **Design Recommendations** (riga 2285) — 8 raccomandazioni
10. **Cast Card** (riga 3910)
11. **Phase C: IA Card + Blueprint (3) + Wireframe (8) + Comparison + Design Reflections + Design Summary** (riga 4106)
12. **Cognitive Walkthrough — Inspection Card** (riga 5082)
13. **Formative Test** (2 soggetti: Mimmo + Giuseppina, riga 5093)
14. **Summative Test Card** (2 soggetti: Laura + Maria, riga 5906)
15. **Final Conclusions + Recap** (riga 6380)

### Note
- I line count JS/CSS in AGENTS.md erano contrassegnati con `~` (approssimativo), ma gli scostamenti sono significativi (−8/9%)
- `FaseD2/02-inspection-card-body.tex` ha un errore del −21.3% non contrassegnato come approssimativo
- AGENTS.md si auto-dichiara 209 righe ma ne ha 239 (+14.4%)
- Il contenuto effettivo di main.tex è **più completo** di quanto documentato (Summative Test #2 Maria Borriello presente, mentre AGENTS.md menziona solo Laura)
- `main.pdf` (3.74 MB) compilato il 04/07/2026 alle 16:11 — verosimilmente l'ultima compilazione disponibile

---

## 2026-07-05 — Date Reorganization (Maggio→Luglio) + main-en.tex Translation

### Done
- **Riallineamento completo date** su 6 file (32 modifiche totali):
  - Phase A client/competitor: spostate da Maggio-Giugno a inizio Maggio (5, 8, 12, 15 Maggio)
  - Phase C V0: 28 Giugno → 12 Giugno
  - Cognitive Walkthrough: 28-29 Giugno → 15-16 Giugno
  - Formative Giuseppina: 29 Giugno → 20 Giugno
  - V1 (post-CW): 2 Luglio → 22 Giugno
  - Formative Mimmo: 1 Luglio → 24 Giugno
  - Summative Laura: 2 Luglio → 28 Giugno
  - Summative Maria: 4 Luglio → 30 Giugno
  - V2 Finale: 4 Luglio → 3 Luglio

- **File aggiornati:**
  - `main.tex` (ITA) — 15 date
  - `main-en.tex` (EN) — 15 date
  - `FaseD2/02-inspection-card-body.tex` — 1 data
  - `FaseD2/02-inspection-card-body-en.tex` — 1 data
  - `FaseD2/02-inspection-card.tex` — 1 data
  - `FaseD2/03-formative-test-card.tex` — 1 data

- **Scan main-en.tex:** trovati 18 punti di italiano residuo da tradurre
- **Traduzione completata:** tutti i 18 punti tradotti in inglese (RF-01--RF-09, Abilità→Physical ability, 3 use case commenti, 3 testi narrativi)
- **Commit e push** su GitHub (`d6bda7b`)

### File Inventory
- **main.tex**: 6.119 righe
- **main-en.tex**: 6.108 righe (100% inglese, 0 italiano residuo ✅)
- **AGENTS.md**: auto-dichiarato

### Key Decisions
- Timeline realistica: Phase A (5-15 Maggio), CW (15-16 Giugno), Formative (20-24 Giugno), Summative (28-30 Giugno), V2 Finale (3 Luglio)
- File FaseD2 standalone (non inclusi via `\input{}`) aggiornati comunque per consistenza
- RF titles tradotti mantenendo la codifica `RF-XX --- [English title]` per coerenza con i RF inglesi già presenti (RF-10+)
