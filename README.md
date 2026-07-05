# TperTutti — TPER Website Redesign

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen)](https://francescocastaldi.github.io/Esame-UUXD/)
[![Deploy to GitHub Pages](https://github.com/FrancescoCastaldi/Esame-UUXD/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/FrancescoCastaldi/Esame-UUXD/actions/workflows/deploy-pages.yml)

A comprehensive **User Experience redesign** of the [TPER](https://www.tper.it) website (public transport company serving Bologna and Emilia-Romagna, Italy). Follows the **Double Diamond methodology** (Discover, Define, Develop, Deliver) for the *User Experience Design* course at the University of Bologna.

**Team:** TperTutti

---

## Live Demo

> **[View the redesigned website](https://francescocastaldi.github.io/Esame-UUXD/)**  
> Hosted on **GitHub Pages** — fully interactive prototype (22 pages)

---

## Project Overview

| Area | Description |
|------|-------------|
| **Goal** | Redesign TPER's website to improve usability, accessibility, and user satisfaction, especially for elderly users |
| **Methodology** | Double Diamond (Discover → Define → Develop → Deliver) |
| **Target Users** | Commuters, elderly users, tourists, occasional travelers |
| **Key Innovation** | **Trainer Mode** — an interactive step-by-step overlay that guides users through complex tasks (buying tickets, renewing subscriptions, planning trips) |

---

## Repository Structure

```
├── Website - Finale/          # Final redesigned prototype (V2)
│   ├── index.html             # Homepage (guest)
│   ├── pianifica.html         # Route planner
│   ├── dove-comprare.html     # Channel guide
│   ├── biglietti.html         # Ticket types & prices
│   ├── abbonamenti.html       # Subscription plans + wizard
│   ├── agevolazioni.html      # Discount eligibility wizard
│   ├── aiuto.html             # Help + Trainer Mode
│   ├── orari.html             # Timetables
│   ├── notizie.html           # News
│   ├── 404.html               # Error page
│   ├── solweb/                # Transactional portal pages
│   │   ├── dashboard.html     # User dashboard
│   │   ├── pagamento.html     # Payment flow
│   │   ├── conferma.html      # Post-purchase confirmation
│   │   ├── login.html         # Login
│   │   ├── registrazione.html # Registration
│   │   ├── recupero.html      # Password recovery
│   │   ├── piani.html         # Subscription plans
│   │   ├── rinnova.html       # Renewal
│   │   ├── ricarica.html      # Top-up
│   │   ├── documenti.html     # Document upload
│   │   ├── sanzioni.html      # Fines
│   │   └── verifica.html      # Ticket verification
│   ├── css/style.css          # Stylesheet (~2100 lines)
│   └── js/
│       ├── app.js             # Main app logic (~1500 lines)
│       ├── i18n.js            # Internationalization (IT/EN/AR)
│       └── trainer-modules.js # Trainer mode modules
│
├── Website/                   # Deployment build (same as Finale)
│
├── Redesign Tper 1.0/         # V1 redesign screenshots (before CW fixes)
│
├── images/                    # Photos & charts for LaTeX document
├── Wireframes/                # Screenshot wireframes (WF1–WF7)
├── Blueprint/                 # Blueprint diagrams (IA, Ecosystem, Journey)
│
├── main.tex                   # LaTeX project document (Italian, ~6065 lines)
├── main-en.tex                # LaTeX project document (English, ~6060 lines)
├── main.pdf                   # Compiled PDF (Italian, 126 pp.)
├── main-en.pdf                # Compiled PDF (English, 125 pp.)
│
├── .github/workflows/         # GitHub Pages deployment
├── LICENSE                    # MIT License
├── README.md                  # This file
└── .gitignore                 # Git ignore rules
```

---

## Project Phases

| Phase | Description | Key Artifacts |
|-------|-------------|---------------|
| **Phase A** | User research: testing existing TPER site with 4 subjects | SUS scores, task completion data, user journey maps |
| **Phase B** | Define personas, scenarios, design recommendations | Personas (Maria, Fatima, David, Roberto), 13 recommendations (R1–R13) |
| **Phase C** | Design proposal: IA, Blueprint, Wireframe, Comparison | IA card, 3 blueprints, 7 wireframes, 5 Before/After comparisons |
| **Phase D** | Evaluation: CW, Formative test, Summative test | Inspection card, 2 formative tests, 2 summative tests (SUS > 68) |

---

## Key Metrics

| Metric | Before (Phase A) | After (Phase D) | Improvement |
|--------|------------------|-----------------|-------------|
| Task completion | 30% (6/20) | 80% (4/5, Laura P.) | +50 pp |
| Avg SUS score | 37.5/100 | 72.5/100 | +35 pts |
| Task time (T4) | 195 s, 7 errors | 57 s, 0 errors | −71% time |

---

## Built With

- **Prototype:** HTML5, CSS3, JavaScript (vanilla)
- **Documentation:** LaTeX (MiKTeX 25.12)
- **Diagrams:** Forest package (LaTeX), custom TikZ
- **Screenshots:** Puppeteer
- **Hosting:** GitHub Pages
