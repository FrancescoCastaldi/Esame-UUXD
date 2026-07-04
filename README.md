# TPER Website Redesign — UX Design Project

A comprehensive **User Experience redesign** of the [TPER](https://www.tper.it) website (public transport company serving Bologna and Emilia-Romagna, Italy). This project follows the **Double Diamond methodology** (Discover, Define, Develop, Deliver) and was developed for the *User Experience Design* course at the University of Bologna.

## 🚀 Live Demo

> **[View the redesigned website →](https://francescocastaldi.github.io/Esame-UUXD/)**  
> Hosted on **GitHub Pages** — fully interactive prototype (22 pages)

## 📋 Project Overview

| Area | Description |
|------|-------------|
| **Goal** | Redesign TPER's website to improve usability, accessibility, and user satisfaction, especially for elderly users |
| **Methodology** | Double Diamond (Discover → Define → Develop → Deliver) |
| **Target Users** | Commuters, elderly users, tourists, occasional travelers |
| **Key Innovation** | **Trainer Mode** — an interactive step-by-step overlay that guides users through complex tasks (buying tickets, renewing subscriptions, planning trips) |

## 🏗️ Repository Structure

```
├── main.tex                  # Main LaTeX thesis document (~4,600 lines)
├── main.pdf                  # Compiled thesis PDF (110 pages)
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
└── images/                   # Thesis images (personas, charts, etc.)
```

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

### 📊 Usability Testing
| Phase | Participants | Key Results |
|-------|-------------|-------------|
| **Preliminary (Phase A)** | Laura Palumbo (70), Maria Borriello (79) | Baseline metrics, identified critical issues (FT1-FT7) |
| **Summative (v2.0)** | Laura Palumbo (70) | **SUS 72.5/100** (+35 points vs Phase A), 4/5 tasks completed |

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5 + CSS3** | Static website prototype (~2,000 lines CSS) |
| **JavaScript (Vanilla)** | Interactive UI, Trainer Mode, i18n, wizards (~3,400 lines across 3 files) |
| **LaTeX** | Thesis document (`tcolorbox`, `tikz`, `hyperref`) |
| **Puppeteer / Playwright** | Automated screenshot capture for wireframes |
| **GitHub Pages** | Live demo hosting |

## 📚 Academic Context

- **Course:** User Experience Design (UUXD)
- **University:** University of Bologna
- **Year:** 2025/2026
- **Team:** Francesco Castaldi & Stefano Mercurio

## 📄 License

This project is developed for academic purposes. TPER brand and content belong to [TPER S.p.A.](https://www.tper.it).
