# TPER Website Redesign — UX Design Project

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen)](https://francescocastaldi.github.io/Esame-UUXD/)
[![Deploy to GitHub Pages](https://github.com/FrancescoCastaldi/Esame-UUXD/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/FrancescoCastaldi/Esame-UUXD/actions/workflows/deploy-pages.yml)
[![Last Commit](https://img.shields.io/github/last-commit/FrancescoCastaldi/Esame-UUXD)](https://github.com/FrancescoCastaldi/Esame-UUXD/commits/master)
[![Repo Size](https://img.shields.io/github/repo-size/FrancescoCastaldi/Esame-UUXD)](https://github.com/FrancescoCastaldi/Esame-UUXD)
[![Contributors](https://img.shields.io/github/contributors/FrancescoCastaldi/Esame-UUXD)](https://github.com/FrancescoCastaldi/Esame-UUXD/graphs/contributors)

A comprehensive **User Experience redesign** of the [TPER](https://www.tper.it) website (public transport company serving Bologna and Emilia-Romagna, Italy). This project follows the **Double Diamond methodology** (Discover, Define, Develop, Deliver) and was developed for the *User Experience Design* course at the University of Bologna.

---

## 🚀 Live Demo

> **[View the redesigned website →](https://francescocastaldi.github.io/Esame-UUXD/)**  
> Hosted on **GitHub Pages** — fully interactive prototype (22 pages)

---

## 📋 Project Overview

| Area | Description |
|------|-------------|
| **Goal** | Redesign TPER's website to improve usability, accessibility, and user satisfaction, especially for elderly users |
| **Methodology** | Double Diamond (Discover → Define → Develop → Deliver) |
| **Target Users** | Commuters, elderly users, tourists, occasional travelers |
| **Key Innovation** | **Trainer Mode** — an interactive step-by-step overlay that guides users through complex tasks (buying tickets, renewing subscriptions, planning trips) |

---

## 🏗️ Repository Structure

```
├── main.tex                  # Main LaTeX thesis document (~4,600 lines)
├── main.pdf                  # Compiled thesis PDF (110+ pages)
├── Website - Finale/         # Final prototype — 22-page functional website
│   ├── index.html            # Homepage
│   ├── biglietti.html        # Tickets page with interactive wizard
│   ├── abbonamenti.html      # Subscriptions page with renewal wizard
│   ├── pianifica.html        # Trip planner
│   ├── dove-comprare.html    # Where to buy (channel selector)
│   ├── aiuto.html            # Help / FAQ
│   ├── solweb/               # User account area (12 pages)
│   ├── js/                   # JavaScript (app, i18n, trainer modules)
│   ├── css/                  # Stylesheet (~2,000 lines)
│   └── images/               # Assets
├── FaseD2/                   # Inspection card & Formative test card
├── Blueprint/                # IA diagrams, ecosystem map, journey map
├── Wireframes/               # 8 wireframe screenshots + LaTeX document
├── Comparison/               # Before/after comparison & reflections
├── IA/                       # Information Architecture card
├── Redesign Tper 1.0/        # First redesign screenshots (12 PNG)
├── Redesign Tper 2.0/        # Second redesign screenshots (12 PNG)
├── Tper sito originale/      # Original site screenshots (11 PNG)
└── images/                   # Thesis images (personas, charts, etc.)
```

---

## ✨ Key Features

### 🌐 Redesigned Website
- **22 HTML pages** covering all user journeys (tickets, subscriptions, trip planning, account management)
- **Multilingual support** — Italian, English, Arabic (i18n via JavaScript)
- **Responsive design** — works on desktop and mobile
- **Accessibility** — breadcrumbs, ARIA labels, high-contrast color palette

### 🧠 Trainer Mode
An innovative guided-tour system that activates when users need help:
- **Ticket Wizard** — 5-question flow to find the right ticket
- **Subscription Wizard** — 7-question flow for subscription renewal
- **Trip Planning Guide** — step-by-step journey builder
- **Channel Selector** — helps users choose where to buy

---

## 📊 Usability Testing

### Phase A — Preliminary (Original TPER site)

| # | Participant | Age | Tasks | Avg Time | Errors | SUS |
|---|-------------|:---:|:-----:|:--------:|:------:|:---:|
| 1 | Sergio Magini | 68 | 3/5 (60%) | 149.6 s | 2.6 | **40.0** |
| 2 | Laura Palumbo | 70 | 1/5 (20%) | 183.8 s | 5.0 | **37.5** |
| 3 | Chris Harper | 34 | 2/5 (40%) | 156.6 s | 2.4 | **45.0** |
| 4 | Maria Borriello | 79 | 0/5 (0%) | 652.0 s | 3.8 | **27.5** |

### Phase C — Summative (Redesigned v2.0)

| # | Participant | Age | Tasks | Avg Time | Errors | SUS | vs Phase A |
|---|-------------|:---:|:-----:|:--------:|:------:|:---:|:----------:|
| 1 | Laura Palumbo | 70 | **4/5 (80%)** | **103.0 s** (−44%) | **1.4** (−72%) | **72.5** | **+35 pts** |
| 2 | Maria Borriello | 79 | *(testing in progress)* | | | | |

> **Laura Palumbo** passed the **good usability** threshold (SUS ≥ 68), with dramatic improvements in task T4 (agevolazioni): 0 errors, 0 backtrack, 57 s (vs 195 s / 7 errors in Phase A).

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5 + CSS3** | Static website prototype (~2,000 lines CSS) |
| **JavaScript (Vanilla)** | Interactive UI, Trainer Mode, i18n, wizards (~3,400 lines across 3 files) |
| **LaTeX** | Thesis document (`tcolorbox`, `tikz`, `hyperref`) |
| **GitHub Actions** | CI/CD — automated validation & deploy to Pages |
| **Puppeteer / Playwright** | Automated screenshot capture for wireframes |

---

## 🔄 CI/CD

The repository uses **GitHub Actions** for continuous deployment:

1. **Validate** — Checks HTML structure and file integrity on every push
2. **Deploy** — Automatically deploys `Website - Finale/` to GitHub Pages

The workflow runs automatically on pushes to `master` affecting the website or workflow files, and can also be triggered manually from the [Actions tab](https://github.com/FrancescoCastaldi/Esame-UUXD/actions).

---

## 📚 Academic Context

- **Course:** User Experience Design (UUXD)
- **University:** University of Bologna
- **Year:** 2025/2026
- **Team:** Francesco Castaldi & Stefano Mercurio

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

> *TPER brand, logos, and content belong to [TPER S.p.A.](https://www.tper.it). This project is for academic purposes only.*
