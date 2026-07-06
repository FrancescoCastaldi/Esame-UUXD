/* ============================================================
   TPER â€” app.js
   Phase C: Interaction & Behavior
   Wizard, Route Planner simulation, Trainer-Mode, A11y controls
   ============================================================ */

(function() {
  'use strict';

  /* ---------- DOM READY ---------- */
  document.addEventListener('DOMContentLoaded', function() {

    // --- Trainer DOM queries (MUST be before openTrainerMode call below) ---
    var trainerBar = document.querySelector('.trainer-bar');
    const activateTrainer = document.getElementById('activate-trainer');
    var trainerSteps = document.getElementById('trainer-steps');
    var currentStep = 0;
    var currentModule = null;
    var trainerBuilt = false;
    var highlightedElement = null;
    var trainerModules = {};
    var trainerStats = { completed: [], currentStart: null, currentErrors: 0 };
    var lastCompleted = {}; // per-modulo: ultimo step completato

    // Load trainer modules and restore state
    loadTrainerModules();
    if (checkTrainerURL() || restoreTrainerState() || isTrainerActive()) {
      openTrainerMode();
    }

    /* ============================
       1. HAMBURGER MENU (mobile)
       ============================ */
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    if (hamburger && mainNav) {
      hamburger.addEventListener('click', function() {
        const open = mainNav.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', open);
      });
      // Close on outside click
      document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
          mainNav.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* ============================
       2. ACCESSIBILITY CONTROLS
       ============================ */

    // --- High Contrast ---
    const contrastToggle = document.querySelector('.contrast-toggle');
    if (contrastToggle) {
      // Check saved state
      if (localStorage.getItem('tper-contrast') === 'true') {
        document.body.classList.add('high-contrast');
      }
      contrastToggle.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        const isHigh = document.body.classList.contains('high-contrast');
        localStorage.setItem('tper-contrast', isHigh);
        contrastToggle.setAttribute('aria-label', isHigh ? 'Disattiva contrasto elevato' : 'Attiva contrasto elevato');
      });
    }

    // --- Font Size ---
    const fontToggles = document.querySelectorAll('.font-toggle');
    if (fontToggles.length) {
      if (localStorage.getItem('tper-font') === 'large') {
        document.documentElement.classList.add('font-large');
        document.body.classList.add('font-large');
      }
      fontToggles.forEach(function(ft) {
        ft.addEventListener('click', function() {
          document.documentElement.classList.toggle('font-large');
          document.body.classList.toggle('font-large');
          var isLarge = document.documentElement.classList.contains('font-large');
          localStorage.setItem('tper-font', isLarge ? 'large' : 'normal');
          fontToggles.forEach(function(f) {
            f.setAttribute('aria-label', isLarge ? 'Riduci carattere' : 'Aumenta carattere');
          });
        });
      });
    }

    // Keyboard shortcut: Alt+C = contrast, Alt+F = font
    document.addEventListener('keydown', function(e) {
      if (e.altKey && e.key === 'c') { e.preventDefault(); if (contrastToggle) contrastToggle.click(); }
      if (e.altKey && e.key === 'f') { e.preventDefault(); if (fontToggles.length) fontToggles[0].click(); }
    });

    /* ============================
       3. LANGUAGE SWITCH
       ============================ */
    const langBtns = document.querySelectorAll('.lang-btn');
    if (langBtns.length) {
      langBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var lang = btn.getAttribute('data-lang');
          if (typeof TPER_I18N !== 'undefined' && TPER_I18N.setLang) {
            TPER_I18N.setLang(lang);
          } else {
            // Fallback if i18n not loaded
            localStorage.setItem('tper-lang', lang);
          }
        });
      });
    }

    /* ============================
       4. ROUTE PLANNER
       ============================ */
    const planBtn = document.getElementById('plan-route-btn');
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const swapBtn = document.querySelector('.swap-btn');
    const resultsContainer = document.getElementById('results-container');
    const resultsSkeleton = document.getElementById('results-skeleton');
    const departNow = document.getElementById('depart-now');
    const travelDate = document.getElementById('travel-date');
    const travelTime = document.getElementById('travel-time');

    // Swap button
    if (swapBtn && fromInput && toInput) {
      swapBtn.addEventListener('click', function() {
        var tmp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = tmp;
      });
    }

    // "Depart now" checkbox
    if (departNow) {
      departNow.addEventListener('change', function() {
        if (travelDate && travelTime) {
          travelDate.disabled = departNow.checked;
          travelTime.disabled = departNow.checked;
        }
      });
    }

    // Search handler
    if (planBtn) {
      planBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var from = fromInput ? fromInput.value.trim() : '';
        var to = toInput ? toInput.value.trim() : '';

        if (!from || !to) {
          if (resultsContainer) {
            resultsContainer.innerHTML =
              '<div class="state-message"><div class="state-icon">&#9888;</div>' +
              '<h2>&#9888; Inserisci partenza e destinazione</h2><p>Compila entrambi i campi per cercare un percorso.</p></div>';
          }
          return;
        }

        // Show skeleton
        if (resultsSkeleton) resultsSkeleton.style.display = 'block';
        if (resultsContainer) resultsContainer.innerHTML = '';

        // Simulate API call
        setTimeout(function() {
          if (resultsSkeleton) resultsSkeleton.style.display = 'none';
          if (resultsContainer) {
            resultsContainer.innerHTML = renderRouteResults(from, to);
          }
        }, 1200);
      });

      // Enter key in from/to fields triggers search
      if (fromInput) fromInput.addEventListener('keydown', function(e) { if (e.key === 'Enter' && planBtn) planBtn.click(); });
      if (toInput) toInput.addEventListener('keydown', function(e) { if (e.key === 'Enter' && planBtn) planBtn.click(); });
    }

    function renderRouteResults(from, to) {
      return '<div class="section-header" style="text-align:left;"><h2>Percorsi trovati</h2>' +
        '<p>Da <strong>' + escapeHtml(from) + '</strong> a <strong>' + escapeHtml(to) + '</strong></p></div>' +
        '<div style="display:flex;flex-direction:column;gap:1rem;">' +
        routeCard('&#128652;', 'Bus 27', 'Via Riva Reno â†’ Stazione Centrale', '18 min', '8:05 - 8:23', 'Ogni 10 min', '&#10003;') +
        routeCard('&#128646;', 'Bus 14 + Treno S1', 'Via Ugo Bassi â†’ Stazione â†’ San Lazzaro', '32 min', '8:10 - 8:42', 'Ogni 15 min', '&#10003;') +
        routeCard('&#128690;', 'Bici + Bus 20', 'Piazza Maggiore â†’ Porta San Mamolo â†’ Rastignano', '25 min', '8:15 - 8:40', 'Bici 12 min + Bus 13 min', '&#10007;') +
        '</div>' +
        '<div class="info-banner mt-2"><span class="icon">&#9432;</span>' +
        '<p><strong>Hai trovato il tuo percorso?</strong> <a href="dove-comprare.html">Scopri dove acquistare</a> il titolo di viaggio adatto.</p></div>';
    }

    function routeCard(icon, line, route, duration, time, freq, hasDiscount) {
      return '<div class="card" style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">' +
        '<div style="font-size:2rem;min-width:48px;text-align:center;">' + icon + '</div>' +
        '<div style="flex:1;min-width:150px;"><h3 style="margin-bottom:0.25rem;">' + line + '</h3>' +
        '<p style="margin:0;font-size:0.9rem;color:#4A5568;">' + route + '</p></div>' +
        '<div style="text-align:center;min-width:80px;"><div style="font-weight:700;color:#CA1424;font-size:1.25rem;">' + duration + '</div>' +
        '<small style="color:#718096;">' + time + '</small></div>' +
        '<div style="text-align:right;min-width:120px;"><small style="color:#718096;">' + freq + '</small>' +
        (hasDiscount === '&#10003;' ? '<br><small style="color:#38A169;">Agevolazioni possibili</small>' : '') + '</div>' +
        '</div>';
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    /* ============================
       5. CHANNEL REDIRECT MODAL
       ============================ */
    var modal = document.getElementById('redirect-modal');
    var modalUrl = document.getElementById('modal-url');
    var modalContinue = document.getElementById('modal-continue');
    var modalClose = document.getElementById('modal-close');

    // All channel buttons with data-channel and data-url
    document.querySelectorAll('[data-channel][data-url]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var url = btn.getAttribute('data-url');
        var channel = btn.getAttribute('data-channel');
        if (modal && modalUrl && modalContinue) {
          modalUrl.textContent = url;
          modalContinue.setAttribute('href', url);
          modal.classList.add('open');
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', function() { modal.classList.remove('open'); });
    }
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('open');
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) modal.classList.remove('open');
      });
    }

    /* ============================
       6. WIZARD â€” Channel Selector
       ============================ */
    var wizardBtn = document.getElementById('start-wizard');
    var wizardContainer = document.getElementById('wizard-container');

    if (wizardBtn && wizardContainer) {
      wizardBtn.addEventListener('click', function() {
        wizardContainer.style.display = 'block';
        wizardContainer.innerHTML = renderWizardStep1();
        wizardBtn.style.display = 'none';
      });
    }

    function renderWizardStep1() {
      return '<h3 style="margin-bottom:1rem;">&#9889; Cosa ti serve?</h3>' +
        '<div style="display:flex;flex-direction:column;gap:0.75rem;">' +
        '<button class="wizard-option" style="padding:1rem;border:2px solid #E2E8F0;border-radius:8px;background:#fff;cursor:pointer;text-align:left;font-size:1rem;" data-value="abbonamento">' +
        '<strong>&#128179; Un abbonamento</strong><br><small style="color:#718096;">Mensile, annuale, agevolato o studente</small></button>' +
        '<button class="wizard-option" style="padding:1rem;border:2px solid #E2E8F0;border-radius:8px;background:#fff;cursor:pointer;text-align:left;font-size:1rem;" data-value="biglietto">' +
        '<strong>&#128722; Un biglietto singolo o carnet</strong><br><small style="color:#718096;">Corsa semplice, carnet 10 corse, giornaliero, MultiPi&ugrave;</small></button>' +
        '<button class="wizard-option" style="padding:1rem;border:2px solid #E2E8F0;border-radius:8px;background:#fff;cursor:pointer;text-align:left;font-size:1rem;" data-value="ricarica">' +
        '<strong>&#128260; Una ricarica</strong><br><small style="color:#718096;">Ricarica Roger Card o tessera esistente</small></button>' +
        '<button class="wizard-option" style="padding:1rem;border:2px solid #E2E8F0;border-radius:8px;background:#fff;cursor:pointer;text-align:left;font-size:1rem;" data-value="non-so">' +
        '<strong>&#128270; Non so cosa mi serve</strong><br><small style="color:#718096;">Aiutami a capire cosa fare</small></button>' +
        '</div>';
    }

    // Delegate click on wizard options
    if (wizardContainer) {
      wizardContainer.addEventListener('click', function(e) {
        var target = e.target.closest('.wizard-option');
        if (!target) return;
        var val = target.getAttribute('data-value');
        if (val === 'abbonamento') {
          wizardContainer.innerHTML = wizardResult('solweb', 'Abbonamento', 'Per abbonamenti il canale migliore &egrave; <strong>solweb.tper.it</strong> (online) o un <strong>Punto Tper</strong> (fisico). Su solweb puoi acquistare e rinnovare comodamente da casa.');
        } else if (val === 'biglietto') {
          wizardContainer.innerHTML = wizardResult('roger', 'Biglietto', 'Per biglietti singoli, carnet o giornalieri il canale migliore &egrave; l\'<strong>App Roger</strong> (digitale) o un <strong>Punto Tper</strong> (fisico). Puoi anche pagare contactless a bordo.');
        } else if (val === 'ricarica') {
          wizardContainer.innerHTML = wizardResult('tabaccheria', 'Ricarica', 'Per ricaricare la tua Roger Card puoi recarti presso una <strong>tabaccheria</strong> convenzionata o un punto <strong>PuntoLis</strong>. Se preferisci il digitale, usa l\'<strong>App Roger</strong>.');
        } else {
          wizardContainer.innerHTML = wizardResult('non-so', 'Non sai cosa fare', 'Nessun problema! Consulta la guida <a href="biglietti.html"><strong>Biglietti</strong></a> per vedere le opzioni disponibili, oppure visita un <strong>Punto Tper</strong> per parlare con un operatore. Puoi anche attivare la <strong>Modalit&agrave; Trainer</strong> per assistenza guidata.');
        }
      });
    }

    function wizardResult(channel, title, desc) {
      var channelIcon = '';
      var channelName = '';
      var channelUrl = '#';
      if (channel === 'solweb') { channelIcon = '&#127760;'; channelName = 'solweb.tper.it'; channelUrl = 'solweb/login.html'; }
      else if (channel === 'roger') { channelIcon = '&#128241;'; channelName = 'App Roger'; channelUrl = 'dove-comprare.html#roger'; }
      else if (channel === 'tabaccheria') { channelIcon = '&#127991;'; channelName = 'Tabaccherie / PuntoLis'; channelUrl = 'dove-comprare.html#tabaccherie'; }
      else { channelIcon = '&#128172;'; channelName = 'Guida Biglietti'; channelUrl = 'biglietti.html'; }

      return '<div style="text-align:center;padding:1rem 0;">' +
        '<div style="font-size:3rem;margin-bottom:0.75rem;">' + channelIcon + '</div>' +
        '<h3 style="margin-bottom:0.5rem;">Canale Consigliato: ' + channelName + '</h3>' +
        '<p style="color:#4A5568;">' + desc + '</p>' +
        '<div style="margin-top:1rem;display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">' +
        '<a href="' + channelUrl + '" class="btn-primary" style="padding:0.6rem 1.5rem;text-decoration:none;">Vai a ' + channelName + '</a>' +
        '<button class="btn-secondary" id="wizard-restart" style="padding:0.6rem 1.5rem;cursor:pointer;">Ricominicia</button>' +
        '</div></div>';
    }

    // Wizard restart
    document.addEventListener('click', function(e) {
      if (e.target.id === 'wizard-restart' && wizardContainer) {
        wizardContainer.innerHTML = renderWizardStep1();
      }
    });

    /* ============================
       7. TRAINER MODE â€” Enhanced Modular Interactive Walkthrough
       Dashboard (R13), Riepilogo (R6), Rating, Tips, Rich Module Cards
       Based on main.tex: co-navigation, visual highlighting, step-by-step guidance
       ============================ */

    /* ---------- I18N Helper ---------- */
    function getI18nText(key, fallback) {
      try {
        var lang = (window.TPER_I18N && TPER_I18N.getCurrentLang) ? TPER_I18N.getCurrentLang() : 'it';
        var dict = (window.TPER_I18N && TPER_I18N.dict && TPER_I18N.dict[lang]) ? TPER_I18N.dict[lang] : {};
        return dict[key] || fallback || key;
      } catch(e) { return fallback || key; }
    }

    /* ---------- Module Loader ---------- */
    function loadTrainerModules() {
      // 1) Try inline data first (loaded via <script> tag)
      if (window.INLINE_TRAINER_MODULES && Object.keys(window.INLINE_TRAINER_MODULES).length) {
        trainerModules = window.INLINE_TRAINER_MODULES;
        return;
      }
      // 2) Fallback: fetch JSON (for dev server environments)
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'js/trainer-modules.json', false); // synchronous fallback
        xhr.overrideMimeType('application/json');
        xhr.send();
        if (xhr.status === 200) {
          trainerModules = JSON.parse(xhr.responseText);
          return;
        }
      } catch(e) { /* silent */ }
      trainerModules = {};
    }

    /* ---------- Stats Persistence (R13) ---------- */
    function loadTrainerStats() {
      try {
        var s = localStorage.getItem('tper-trainer-stats');
        if (s) { trainerStats = JSON.parse(s); }
      } catch(e) { /* ignore */ }
    }
    function saveTrainerStats() {
      try {
        localStorage.setItem('tper-trainer-stats', JSON.stringify(trainerStats));
      } catch(e) { /* ignore */ }
    }
    function resetTrainerStats() {
      trainerStats = { completed: [], currentStart: null, currentErrors: 0 };
      saveTrainerStats();
      if (trainerBar && trainerBar.classList.contains('open')) {
        renderTrainerDashboard();
      }
    }
    function getCategoryLabel(cat) {
      if (!cat) return '';
      var key = 'trainer.category-' + cat;
      return getI18nText(key, cat.charAt(0).toUpperCase() + cat.slice(1));
    }

    /* ---------- Session Persistence ---------- */
    function saveTrainerState() {
      if (currentModule) {
        sessionStorage.setItem('tper-trainer-current', JSON.stringify({
          module: currentModule, step: currentStep
        }));
      } else {
        sessionStorage.removeItem('tper-trainer-current');
      }
    }
    function restoreTrainerState() {
      try {
        var s = sessionStorage.getItem('tper-trainer-current');
        if (s) {
          var st = JSON.parse(s);
          currentModule = st.module; currentStep = st.step || 0;
          return true;
        }
      } catch(e) {}
      return false;
    }
    function isTrainerActive() {
      return localStorage.getItem('tper-trainer-active') === 'true';
    }
    function setTrainerActive(active) {
      localStorage.setItem('tper-trainer-active', active ? 'true' : 'false');
    }

    /* ---------- URL Parameter ---------- */
    function checkTrainerURL() {
      var p = new URLSearchParams(window.location.search);
      var t = p.get('trainer');
      if (t && trainerModules[t]) {
        currentModule = t; currentStep = 0;
        setTrainerActive(true);
        return true;
      }
      return false;
    }

    /* ---------- Highlighter (R4) ---------- */
    function clearHighlight() {
      if (highlightedElement) {
        highlightedElement.classList.remove('trainer-highlight');
        highlightedElement = null;
      }
      removeTrainerTooltip();
    }
    function highlightElement(selector) {
      clearHighlight();
      if (!selector) return;
      var el = document.querySelector(selector);
      if (el) {
        el.classList.add('trainer-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlightedElement = el;
      }
    }

    /* ---------- Trainer tooltip (R4) ---------- */
    function removeTrainerTooltip() {
      var tip = document.getElementById('trainer-tooltip');
      if (tip) tip.remove();
    }
    function showTrainerTooltip(text, selector) {
      removeTrainerTooltip();
      if (!text || !selector) return;
      var target = document.querySelector(selector);
      if (!target) return;
      var tooltip = document.createElement('div');
      tooltip.id = 'trainer-tooltip';
      tooltip.className = 'trainer-tooltip';
      tooltip.textContent = text;
      document.body.appendChild(tooltip);
      var targetRect = target.getBoundingClientRect();
      var tooltipRect = tooltip.getBoundingClientRect();
      var left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
      var top = targetRect.top - tooltipRect.height - 12;
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) left = window.innerWidth - tooltipRect.width - 8;
      if (top < 8) top = targetRect.bottom + 12;
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    }

    /* ---------- Dashboard (R13) ---------- */
    function renderTrainerDashboard() {
      if (!trainerBar) return;
      var existing = trainerBar.querySelector('.trainer-dashboard');
      if (existing) existing.remove();

      var dash = document.createElement('div');
      dash.className = 'trainer-dashboard';

      var title = document.createElement('div');
      title.className = 'trainer-dashboard-title';
      title.setAttribute('data-i18n', 'trainer.dashboard-title');
      title.textContent = getI18nText('trainer.dashboard-title');
      dash.appendChild(title);

      var completed = trainerStats.completed || [];
      var totalMods = Object.keys(trainerModules).length;
      var totalErrors = completed.filter(function(c) { return c.errors > 0; }).length;
      var avgTime = 0;
      if (completed.length > 0) {
        var sum = 0;
        for (var i = 0; i < completed.length; i++) {
          sum += (completed[i].time || 0);
        }
        avgTime = Math.round(sum / completed.length);
      }

      if (completed.length === 0) {
        var empty = document.createElement('div');
        empty.className = 'trainer-dashboard-empty';
        empty.setAttribute('data-i18n', 'trainer.dashboard-empty');
        empty.textContent = getI18nText('trainer.dashboard-empty');
        dash.appendChild(empty);
      } else {
        var grid = document.createElement('div');
        grid.className = 'trainer-dashboard-grid';

        // Card 1: Modules completed
        var c1 = document.createElement('div');
        c1.className = 'trainer-dashboard-card';
        c1.innerHTML = '<div class="tdc-value">' + completed.length + '/' + totalMods + '</div>' +
          '<div class="tdc-label">' + getI18nText('trainer.dashboard-module-comp') + '</div>';
        grid.appendChild(c1);

        // Card 2: Errors
        var c2 = document.createElement('div');
        c2.className = 'trainer-dashboard-card';
        c2.innerHTML = '<div class="tdc-value">' + totalErrors + '</div>' +
          '<div class="tdc-label">' + getI18nText('trainer.dashboard-errors') + '</div>';
        grid.appendChild(c2);

        // Card 3: Avg time
        var c3 = document.createElement('div');
        c3.className = 'trainer-dashboard-card';
        c3.innerHTML = '<div class="tdc-value">' + avgTime + 's</div>' +
          '<div class="tdc-label">' + getI18nText('trainer.dashboard-avgtime') + '</div>';
        grid.appendChild(c3);

        // Card 4: Last rating
        var lastRating = completed.length > 0 ? (completed[completed.length - 1].rating || '-') : '-';
        var c4 = document.createElement('div');
        c4.className = 'trainer-dashboard-card';
        c4.innerHTML = '<div class="tdc-value">' + lastRating + '</div>' +
          '<div class="tdc-label">' + getI18nText('trainer.dashboard-likert') + '</div>';
        grid.appendChild(c4);
        dash.appendChild(grid);

        // Reset button
        var resetBtn = document.createElement('button');
        resetBtn.className = 'trainer-dashboard-reset';
        resetBtn.setAttribute('data-i18n', 'trainer.dashboard-reset');
        resetBtn.textContent = getI18nText('trainer.dashboard-reset');
        resetBtn.addEventListener('click', function() { resetTrainerStats(); });
        dash.appendChild(resetBtn);
      }

      // Insert after header
      var header = trainerBar.querySelector('.trainer-header');
      if (header && header.nextSibling) {
        trainerBar.insertBefore(dash, header.nextSibling);
      } else {
        trainerBar.insertBefore(dash, trainerBar.firstChild);
      }
    }

    /* ---------- Summary View (R6) ---------- */
    function renderTrainerSummary(rating, savedStart, savedErrors) {
      if (!trainerSteps) return;
      var module = trainerModules[currentModule];
      if (!module) return;

      var ratingStars = 0;
      if (typeof rating === 'number') ratingStars = rating;

      var elapsed = 0;
      if (savedStart) {
        elapsed = Math.round((Date.now() - savedStart) / 1000);
      } else if (trainerStats.currentStart) {
        elapsed = Math.round((Date.now() - trainerStats.currentStart) / 1000);
      }

      var summaryHtml = '';
      summaryHtml += '<div class="trainer-summary">';
      summaryHtml += '<h4>' + getI18nText('trainer.summary-title') + '</h4>';

      // Operations performed
      summaryHtml += '<div class="trainer-summary-section">';
      summaryHtml += '<h5>' + getI18nText('trainer.summary-operations') + '</h5>';
      summaryHtml += '<div class="trainer-summary-item">' +
        '<span class="tsi-label">' + getI18nText('trainer.summary-module') + '</span>' +
        '<span class="tsi-value">' + getI18nText('trainer.module-' + currentModule, module.title) + '</span></div>';
      summaryHtml += '<div class="trainer-summary-item">' +
        '<span class="tsi-label">' + getI18nText('trainer.summary-steps') + '</span>' +
        '<span class="tsi-value">' + module.steps.length + '</span></div>';

      if (elapsed > 0) {
        summaryHtml += '<div class="trainer-summary-item">' +
          '<span class="tsi-label">' + getI18nText('trainer.summary-time') + '</span>' +
          '<span class="tsi-value">' + elapsed + 's</span></div>';
      }
      if (savedErrors !== undefined && savedErrors > 0) {
        summaryHtml += '<div class="trainer-summary-item">' +
          '<span class="tsi-label">Errori rilevati</span>' +
          '<span class="tsi-value" style="color:#CA1424;">' + savedErrors + '</span></div>';
      }
      if (ratingStars > 0) {
        var starsHtml = '';
        for (var si = 1; si <= 3; si++) {
          starsHtml += '<span class="tss-star' + (si <= ratingStars ? '' : ' empty') + '">&#9733;</span>';
        }
        summaryHtml += '<div class="trainer-summary-item">' +
          '<span class="tsi-label">' + getI18nText('trainer.summary-rating') + '</span>' +
          '<span class="tsi-value"><span class="trainer-summary-stars">' + starsHtml + '</span></span></div>';
      }
      summaryHtml += '</div>';

      // Path followed (with navigational path per step â€” R6)
      var pageLabels = { rinnovo:'Abbonamenti', acquista:'Login \u2192 Dashboard \u2192 Piani \u2192 Documenti \u2192 Pagamento', viaggio:'Pianifica', biglietto:'Biglietti', ricarica:'Dove Comprare' };
      var pageLabel = pageLabels[currentModule] || '';
      summaryHtml += '<div class="trainer-summary-section">';
      summaryHtml += '<h5>' + getI18nText('trainer.summary-path') + '</h5>';
      for (var pi = 0; pi < module.steps.length; pi++) {
        var navPath = 'Home \u2192 ' + pageLabel + ' \u2192 ' + module.steps[pi].title;
        summaryHtml += '<div class="trainer-summary-item">' +
          '<span class="tsi-label">' + (pi + 1) + '. ' + module.steps[pi].title +
          '<br><small style="color:#999;">' + navPath + '</small></span>' +
          '<span class="tsi-value" style="color:#2E7D32;">&#10003;</span></div>';
      }
      summaryHtml += '</div>';

      // Useful contacts
      summaryHtml += '<div class="trainer-summary-section">';
      summaryHtml += '<h5>' + getI18nText('trainer.summary-contacts') + '</h5>';
      summaryHtml += '<div class="trainer-summary-contacts">' +
        getI18nText('trainer.summary-contacts-list', 'TPER Helpline: 800-123-456\nPunto Tper: via Lame 10, Bologna\nsolweb.tper.it') +
        '</div>';
      summaryHtml += '</div>';

      // Print button
      summaryHtml += '<button class="trainer-summary-print-btn" onclick="window.print()">' +
        '&#128424; ' + getI18nText('trainer.summary-print') + '</button>';

      summaryHtml += '</div>';
      trainerSteps.innerHTML = summaryHtml;
    }

    /* ---------- Rating (R6) ---------- */
    function renderTrainerRating() {
      if (!trainerSteps) return;
      var module = trainerModules[currentModule];
      if (!module) return;

      var html = '<div class="trainer-complete-msg">' +
        getI18nText('trainer.complete-msg', 'Complimenti! Hai completato la guida.') + '</div>';

      html += '<div class="trainer-rating">';
      html += '<p>' + getI18nText('trainer.summary-rating', 'Valuta questa guida') + '</p>';
      html += '<div class="trainer-rating-stars" id="trainer-rating-stars">';
      for (var ri = 1; ri <= 3; ri++) {
        var label = getI18nText('trainer.dashboard-likert-' + ri, '');
        html += '<button data-rating="' + ri + '" title="' + label + '">' + ri + '</button>';
      }
      html += '</div>';
      html += '<button class="trainer-rating-skip" id="trainer-rating-skip">' +
        getI18nText('trainer.summary-skip-rating', 'Salta') + '</button>';
      html += '</div>';

      trainerSteps.innerHTML = html;

      // Rating click handlers
      var starContainer = document.getElementById('trainer-rating-stars');
      if (starContainer) {
        starContainer.addEventListener('click', function(e) {
          if (e.target.tagName === 'BUTTON') {
            var r = parseInt(e.target.getAttribute('data-rating'), 10);
            // Highlight selected
            starContainer.querySelectorAll('button').forEach(function(b) {
              b.classList.toggle('active', parseInt(b.getAttribute('data-rating'), 10) <= r);
            });
            // Save & show summary after short delay
            setTimeout(function() {
              finalizeModule(r);
            }, 400);
          }
        });
      }
      var skipBtn = document.getElementById('trainer-rating-skip');
      if (skipBtn) {
        skipBtn.addEventListener('click', function() {
          finalizeModule(0);
        });
      }
    }

    /* ---------- Finalize Module ---------- */
    function finalizeModule(rating) {
      // Record completion
      var elapsed = trainerStats.currentStart
        ? Math.round((Date.now() - trainerStats.currentStart) / 1000) : 0;
      trainerStats.completed.push({
        module: currentModule,
        steps: currentStep + 1,
        time: elapsed,
        rating: rating > 0 ? getI18nText('trainer.dashboard-likert-' + rating, rating.toString()) : '-',
        errors: trainerStats.currentErrors || 0,
        date: new Date().toISOString()
      });
      var savedStart = trainerStats.currentStart;
      var savedErrors = trainerStats.currentErrors || 0;
      trainerStats.currentStart = null;
      saveTrainerStats();

      // Show summary (before nulling so time/errors display correctly)
      renderTrainerSummary(rating, savedStart, savedErrors);
      // Update dashboard
      renderTrainerDashboard();

      // Update nav buttons
      var prevBtn = document.querySelector('.trainer-prev');
      var nextBtn = document.querySelector('.trainer-next');
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) { nextBtn.style.display = 'none'; }
    }

    /* ---------- Build UI Shell ---------- */
    function buildTrainerUI() {
      if (trainerBuilt || !trainerBar) return;
      trainerBuilt = true;

      var header = trainerBar.querySelector('h3');
      if (header) {
        var hd = document.createElement('div');
        hd.className = 'trainer-header';
        var cb = document.createElement('button');
        cb.className = 'trainer-close';
        cb.setAttribute('aria-label', 'Chiudi trainer');
        cb.innerHTML = '&#10005;';
        cb.addEventListener('click', function() { if (trainerBar.classList.contains('open')) openTrainerMode(); });
        var errBadge = document.createElement('span');
        errBadge.className = 'trainer-errors-badge';
        errBadge.textContent = '0 errori';
        header.parentNode.insertBefore(hd, header);
        hd.appendChild(header);
        hd.appendChild(errBadge);
        hd.appendChild(cb);
      }

      // Progress bar (simple)
      var pb = document.createElement('div');
      pb.className = 'trainer-progress-bar';
      pb.innerHTML = '<div class="trainer-progress-fill" style="width:0%"></div>';
      if (trainerSteps) trainerBar.insertBefore(pb, trainerSteps);
      else trainerBar.appendChild(pb);

      // Step counter
      var sc = document.createElement('div');
      sc.className = 'trainer-step-counter';
      sc.textContent = '';
      if (trainerSteps) trainerBar.insertBefore(sc, trainerSteps);
      else trainerBar.appendChild(sc);

      // Nav buttons
      var nav = document.createElement('div');
      nav.className = 'trainer-nav';
      nav.innerHTML = '<button class="btn-secondary trainer-prev" disabled>' + getI18nText('trainer.prev', 'Indietro') + '</button>' +
        '<button class="btn-primary trainer-next">' + getI18nText('trainer.next', 'Avanti') + '</button>';
      trainerBar.appendChild(nav);

      var backCount = 3; // allow first 3 backs without penalty
      nav.addEventListener('click', function(e) {
        if (e.target.classList.contains('trainer-prev') && !e.target.disabled) {
          if (backCount <= 0) { trainerStats.currentErrors++; updateErrorBadge(); }
          else { backCount--; }
          currentStep--;
          saveTrainerState();
          renderTrainerSteps();
        } else if (e.target.classList.contains('trainer-next')) {
          // R10: validate empty field before advancing
          var mod = trainerModules[currentModule];
          var step = mod ? mod.steps[currentStep] : null;
          if (step && step.highlight) {
            var field = document.querySelector(step.highlight);
            // If highlight is a container (div, section, form), search for first input inside
            if (field && field.tagName !== 'INPUT' && field.tagName !== 'TEXTAREA' && field.tagName !== 'SELECT') {
              var innerInput = field.querySelector('input, textarea, select');
              if (innerInput) field = innerInput;
            }
            if (field && (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') && !field.value.trim()) {
              var errMsgs = {
                '#from': 'Inserisci il punto di partenza. Scrivi un indirizzo, via o nome della fermata.',
                '#to': 'Inserisci la destinazione. Scrivi dove vuoi arrivare.',
                '#tessera': 'Inserisci il numero della tessera. Si trova sul retro della tua carta Roger o MiMuovo.',
                '#username': 'Inserisci il tuo Codice Fiscale o l\'email con cui ti sei registrato.',
                '#nome': 'Inserisci il tuo nome. Serve per identificare l\'ordine e la ricevuta.',
                '#cognome': 'Inserisci il tuo cognome. Serve per completare i dati dell\'ordine.',
                '#email': 'Inserisci un indirizzo email. Riceverai qui la ricevuta e la conferma.',
                '#num-pratica': 'Inserisci il numero pratica della sanzione.',
                '#codice-fiscale': 'Inserisci il codice fiscale.'
              };
              showFieldError(field, errMsgs[step.highlight] || 'Completa questo campo prima di proseguire al passo successivo.');
              field.focus();
              return;
            }
          }
          if (currentModule && currentStep === mod.steps.length - 1) {
            // Module complete -> show rating
            renderTrainerRating();
            // Update nav
            var pBtn = document.querySelector('.trainer-prev');
            var nBtn = document.querySelector('.trainer-next');
            if (pBtn) pBtn.style.display = 'none';
            if (nBtn) nBtn.style.display = 'none';
          } else {
            lastCompleted[currentModule] = currentStep;
            currentStep++;
            saveTrainerState();
            renderTrainerSteps();
          }
        }
      });

      // Dashboard & init stats
      loadTrainerStats();
      renderTrainerDashboard();
    }

    /* ---------- Render Module Selection ---------- */
    function renderTrainerModules() {
      if (!trainerSteps) return;
      clearHighlight();

      var pf = document.querySelector('.trainer-progress-fill');
      var sc = document.querySelector('.trainer-step-counter');
      var prv = document.querySelector('.trainer-prev');
      var nxt = document.querySelector('.trainer-next');
      if (pf) pf.style.width = '0%';
      if (sc) sc.textContent = '';
      if (prv) prv.style.display = 'none';
      if (nxt) nxt.style.display = 'none';

      var moduleOrder = ['rinnovo', 'acquista', 'viaggio', 'biglietto', 'ricarica'];
      var html = '<div class="trainer-modules" style="padding:0.5rem 1rem 1rem;">';
      html += '<h4 style="margin-bottom:0.5rem;font-size:1rem;color:#333;">' +
        getI18nText('trainer.choose-module', 'Scegli un\'attivit\u00e0') + '</h4>';

      for (var i = 0; i < moduleOrder.length; i++) {
        var key = moduleOrder[i];
        var mod = trainerModules[key];
        if (!mod) continue;
        var modTitle = getI18nText('trainer.module-' + key, mod.title);
        var modDesc = getI18nText('trainer.module-' + key + '-desc', '');
        var bgColor = mod.color || '#CA1424';
        html += '<button class="trainer-module-card" data-module="' + key + '">' +
          '<span class="tmc-icon" style="background:' + bgColor + '">' + (mod.icon || '&#8250;') + '</span>' +
          '<span class="tmc-info">' +
          '<strong>' + modTitle + '</strong>' +
          '<small>' + modDesc + '</small>' +
          '</span>' +
          '<span class="tmc-meta">' +
          (mod.estimatedTime || '') +
          '<br>' + getCategoryLabel(mod.category) +
          '</span>' +
          '</button>';
      }
      html += '</div>';
      trainerSteps.innerHTML = html;

      trainerSteps.querySelectorAll('.trainer-module-card').forEach(function(btn) {
        btn.addEventListener('click', function() {
          currentModule = btn.getAttribute('data-module');
          currentStep = 0;
          trainerStats.currentStart = Date.now();
          trainerStats.currentErrors = 0;
          delete lastCompleted[currentModule];

          var cp = window.location.pathname.split('/').pop() || 'index.html';

          // Redirect immediato alla pagina target del modulo
          if (currentModule === 'viaggio' && cp !== 'pianifica.html') {
            saveTrainerState(); setTrainerActive(true);
            window.location.href = 'pianifica.html'; return;
          }
          if (currentModule === 'rinnovo' && cp !== 'abbonamenti.html') {
            saveTrainerState(); setTrainerActive(true);
            window.location.href = 'abbonamenti.html'; return;
          }
          if (currentModule === 'biglietto' && cp !== 'biglietti.html') {
            saveTrainerState(); setTrainerActive(true);
            window.location.href = 'biglietti.html'; return;
          }
          if (currentModule === 'ricarica' && cp !== 'dove-comprare.html') {
            saveTrainerState(); setTrainerActive(true);
            window.location.href = 'dove-comprare.html'; return;
          }
          if (currentModule === 'acquista' && cp !== 'login.html') {
            saveTrainerState(); setTrainerActive(true);
            window.location.href = 'solweb/login.html'; return;
          }

          renderTrainerSteps();
        });
      });
    }

    /* ---------- Render Steps ---------- */
    function renderTrainerSteps() {
      if (!trainerSteps) return;
      if (!currentModule) { renderTrainerModules(); return; }
      clearHighlight();

      var mod = trainerModules[currentModule];
      if (!mod) { renderTrainerModules(); return; }
      var step = mod.steps[currentStep];
      var total = mod.steps.length;

      var pf = document.querySelector('.trainer-progress-fill');
      var sc = document.querySelector('.trainer-step-counter');
      var prv = document.querySelector('.trainer-prev');
      var nxt = document.querySelector('.trainer-next');

      var backLink = '<button class="trainer-back">\u2190 ' + getI18nText('trainer.back-modules', 'Torna alle attivit\u00e0') + '</button>';

      // Welcome message (R9) â€” only on first step
      var welcomeHtml = '';
      if (currentStep === 0 && mod.welcome) {
        welcomeHtml = '<div class="trainer-welcome">' + mod.welcome + '</div>';
      }

      // Action button
      var actionHtml = '';
      var currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (step.action && step.action.url) {
        var targetUrl = step.action.url;
        var targetPage = targetUrl.split(/[?#]/)[0] || targetUrl;
        var isSamePage = targetPage === '' || targetPage === currentPage;
        actionHtml = '<div class="trainer-step-action"><button class="trainer-action-btn" data-url="' +
          targetUrl + '" data-samepage="' + isSamePage + '">' +
          getI18nText(step.action.textKey, 'Vai') + '</button></div>';
      } else if (step.action && !step.action.url) {
        // Inline action (e.g. "search now" â€” just a hint)
        actionHtml = '<div class="trainer-step-action"><button class="trainer-action-btn" disabled style="opacity:0.6;">' +
          getI18nText(step.action.textKey, 'Esegui') + '</button></div>';
      }

      // Hint
      var hintHtml = '';
      if (step.hint) {
        hintHtml = '<div class="trainer-hint">&#128161; <span data-i18n="trainer.highlight-hint">' +
          getI18nText('trainer.highlight-hint') + '</span></div>';
      }

      // Completion message (only after step was actually done)
      var completeHtml = '';
      if (step.completionMessage && typeof lastCompleted[currentModule] !== 'undefined' && currentStep <= lastCompleted[currentModule]) {
        completeHtml = '<div class="trainer-complete-msg" style="font-size:0.85rem;padding:0.5rem;">' +
          step.completionMessage + '</div>';
      }

      trainerSteps.innerHTML = backLink + welcomeHtml +
        '<div class="trainer-step">' +
        '<div class="step-title">' + step.title + '</div>' +
        '<div class="step-desc">' + step.desc + '</div>' +
        hintHtml + completeHtml + actionHtml + '</div>';

      // Back handler
      var bb = trainerSteps.querySelector('.trainer-back');
      if (bb) {
        bb.addEventListener('click', function() {
          currentModule = null; currentStep = 0;
          trainerStats.currentStart = null;
          renderTrainerModules();
        });
      }

      // Action button â€” smart redirect
      var ab = trainerSteps.querySelector('.trainer-action-btn');
      if (ab && !ab.disabled) {
        ab.addEventListener('click', function() {
          var url = ab.getAttribute('data-url');
          var samePage = ab.getAttribute('data-samepage') === 'true';
          if (samePage) {
            // Already on the correct page â€” just scroll to highlight
            if (step.highlight) {
              var el = document.querySelector(step.highlight);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            // Different page â€” save trainer state and redirect
            saveTrainerState();
            setTrainerActive(true);
            window.location.href = url;
          }
        });
      }

      // Highlight + tooltip (R4)
      clearHighlight();
      if (step.highlight) {
        highlightElement(step.highlight);
        showTrainerTooltip(step.tip || getI18nText('trainer.highlight-hint', 'Elemento evidenziato sulla pagina'), step.highlight);
      }

      // Progress bar
      if (pf) {
        var pct = ((currentStep + 1) / total) * 100;
        pf.style.width = pct + '%';
      }

      // Step counter
      if (sc) {
        sc.textContent = getI18nText('trainer.progress', 'Passo {current} di {total}')
          .replace('{current}', currentStep + 1).replace('{total}', total);
      }

      // Nav buttons
      if (prv) {
        prv.style.display = '';
        prv.disabled = currentStep === 0;
        prv.textContent = getI18nText('trainer.prev', 'Indietro');
      }
      if (nxt) {
        nxt.style.display = '';
        nxt.disabled = false;
        nxt.textContent = currentStep === total - 1 ?
          getI18nText('trainer.complete', 'Completa') :
          getI18nText('trainer.next', 'Avanti');
      }

      // ----- Field validation for viaggio module (after nav buttons) -----
      if (currentModule === 'viaggio') {
        setupFieldValidation(step);
        if (step.action && step.action.textKey === 'trainer.search-now') {
          setupSearchSimulation();
        }
      }

      // Update error badge
      updateErrorBadge();

      // Re-translate
      if (typeof TPER_I18N !== 'undefined' && TPER_I18N.translate) TPER_I18N.translate();
    }

    /* ---------- Error Badge ---------- */
    function updateErrorBadge() {
      var badge = trainerBar && trainerBar.querySelector('.trainer-errors-badge');
      if (badge) {
        var e = trainerStats.currentErrors || 0;
        badge.textContent = e + ' error' + (e !== 1 ? 'i' : 'e');
        badge.style.color = e > 0 ? '#CA1424' : '#718096';
      }
    }

    /* ---------- Inline Error Messages (R10) ---------- */
    function showFieldError(input, msg) {
      removeTrainerTooltip();
      removeFieldError(input);
      var err = document.createElement('div');
      err.className = 'form-error';
      err.innerHTML = '<span class="fe-icon">&#9888;</span>' + msg;
      input.parentNode.insertBefore(err, input);
      input.style.borderColor = '#EF9A9A';
      input.classList.add('form-error-field');
      input.addEventListener('input', function once() {
        removeFieldError(input);
        input.classList.remove('form-error-field');
        input.removeEventListener('input', once);
      });
    }
    function removeFieldError(input) {
      var prev = input.previousElementSibling;
      if (prev && prev.classList.contains('form-error')) prev.remove();
      input.style.borderColor = '';
    }

    window.showFieldError = showFieldError;
    window.removeFieldError = removeFieldError;

    /* ---------- Field Validation ---------- */
    function setupFieldValidation(step) {
      if (!step.highlight) return;
      var el = document.querySelector(step.highlight);
      if (!el) return;
      if (el.tagName !== 'INPUT' && el.tagName !== 'SELECT') return;

      var nxt = document.querySelector('.trainer-next');
      if (!nxt) return;

      // Visual feedback on field fill (R10: no Next disable, error shown on click)
      var wasFilled = false;

      function checkField() {
        var valid = el.value && el.value.trim() !== '';
        if (el.tagName === 'SELECT') valid = true;

        var indicator = el.parentNode.querySelector('.trainer-field-check');
        if (valid) {
          if (!indicator) {
            var chk = document.createElement('span');
            chk.className = 'trainer-field-check';
            chk.textContent = '\u2713';
            el.parentNode.appendChild(chk);
          }
          el.style.borderColor = '#2E7D32';
          removeFieldError(el);
          wasFilled = true;
        } else {
          if (indicator) indicator.remove();
          el.style.borderColor = '';
          if (wasFilled) {
            trainerStats.currentErrors++;
            updateErrorBadge();
            wasFilled = false;
          }
        }
      }

      el.addEventListener('input', checkField);
      el.addEventListener('change', checkField);
      setTimeout(checkField, 50);
    }

    /* ---------- Search Simulation ---------- */
    function setupSearchSimulation() {
      var ab = trainerSteps.querySelector('.trainer-action-btn');
      if (!ab) return;

      // Disable Avanti until search is done
      var nxt = document.querySelector('.trainer-next');
      if (nxt) nxt.disabled = true;

      // Enable the disabled search button and attach handler
      ab.disabled = false;
      ab.style.opacity = '';
      ab.style.cursor = 'pointer';

      ab.addEventListener('click', function() {
        var from = document.getElementById('from');
        var to = document.getElementById('to');
        var btn = document.getElementById('plan-route-btn');
        var skeleton = document.getElementById('results-skeleton');
        var container = document.getElementById('results-container');
        var nxt = document.querySelector('.trainer-next');

        // Validate both fields
        if (!from || !from.value.trim() || !to || !to.value.trim()) {
          trainerStats.currentErrors++;
          updateErrorBadge();
          if (typeof showFieldError === 'function') {
            if (!from || !from.value.trim()) showFieldError(from, 'Inserisci il punto di partenza. Scrivi un indirizzo, via o nome della fermata.');
            if (!to || !to.value.trim()) showFieldError(to, 'Inserisci la destinazione. Scrivi dove vuoi arrivare.');
          }
          if (from && !from.value.trim()) { from.focus(); from.style.borderColor = '#CA1424'; }
          return;
        }

        // Loading state
        if (skeleton) skeleton.style.display = 'block';
        if (container) container.innerHTML = '';
        if (btn) btn.disabled = true;
        ab.disabled = true;
        ab.textContent = 'Ricerca in corso\u2026';

        // Simulate search
        setTimeout(function() {
          if (skeleton) skeleton.style.display = 'none';
          if (btn) btn.disabled = false;

          if (container) {
            container.innerHTML = generateSearchResults(from.value, to.value);
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          ab.textContent = 'Risultati trovati \u2713';
          ab.style.background = '#2E7D32';
          ab.disabled = true;

          // Enable Next
          if (nxt) nxt.disabled = false;
        }, 1500);
      });
    }

    /* ---------- Search Results Generator ---------- */
    function generateSearchResults(from, to) {
      var results = [
        { mode: 'Bus + Treno', duration: '32 min', departures: ['08:15', '08:45', '09:15'], changes: 1, co2: 'Bassa', fastest: true },
        { mode: 'Bus', duration: '45 min', departures: ['08:20', '08:50', '09:20'], changes: 0, co2: 'Media', fastest: false },
        { mode: 'Bici + Bus', duration: '28 min', departures: ['08:10', '08:40'], changes: 1, co2: 'Molto Bassa', fastest: true }
      ];

      var html = '<h3 data-i18n="results.title">Percorsi trovati</h3>' +
        '<p style="color:#718096;margin-bottom:1rem;" data-i18n="results.subtitle">Da ' + escapeHtml(from) + ' a ' + escapeHtml(to) + '</p>';

      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        html += '<div class="card" style="margin-bottom:0.75rem;' + (r.fastest ? 'border-color:#2E7D32;' : '') + '">';
        if (r.fastest) html += '<span style="background:#2E7D32;color:#fff;padding:0.15rem 0.5rem;border-radius:4px;font-size:0.75rem;">Pi\u00f9 veloce</span>';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.25rem;">' +
          '<strong>' + r.mode + '</strong>' +
          '<span style="font-size:1.1rem;font-weight:700;">' + r.duration + '</span></div>' +
          '<div style="display:flex;gap:1rem;font-size:0.85rem;color:#718096;margin-top:0.25rem;">' +
          '<span>Partenze: ' + r.departures.join(', ') + '</span>' +
          '<span>' + r.changes + ' cambio' + (r.changes !== 1 ? 'i' : '') + '</span></div></div>';
      }
      return html;
    }

    /* ---------- Open / Close ---------- */
    function openTrainerMode() {
      if (!trainerBar) return;
      var isOpening = !trainerBar.classList.contains('open');
      trainerBar.classList.toggle('open');
      if (isOpening) {
        setTrainerActive(true);
        buildTrainerUI();
        if (!currentModule) renderTrainerModules();
        else renderTrainerSteps();
        document.body.style.marginRight = window.innerWidth > 768 ? '320px' : '';
      } else {
        setTrainerActive(false);
        sessionStorage.removeItem('tper-trainer-current');
        clearHighlight();
        document.body.style.marginRight = '';
      }
    }

    /* ---------- Activation ---------- */
    // #activate-trainer (aiuto.html CTA)
    if (activateTrainer) {
      activateTrainer.addEventListener('click', function(e) {
        e.preventDefault();
        openTrainerMode();
      });
    }

    // .trainer-toggle-btn (floating header button on all pages)
    var trainerToggleBtn = document.querySelector('.trainer-toggle-btn');
    if (trainerToggleBtn) {
      trainerToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openTrainerMode();
      });
    }

    // Escape to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && trainerBar && trainerBar.classList.contains('open')) {
        openTrainerMode();
      }
    });

    // Responsive margin
    function checkTrainerMargin() {
      if (window.innerWidth <= 768 && trainerBar) {
        document.body.style.marginRight = '';
      }
    }
    window.addEventListener('resize', checkTrainerMargin);

    // Language change re-render
    document.addEventListener('tper-lang-changed', function() {
      if (trainerBar && trainerBar.classList.contains('open')) {
        renderTrainerDashboard();
        if (!currentModule) renderTrainerModules();
        else renderTrainerSteps();
      }
    });

    /* ============================
       8. LOGIN FORM â€” Error Handling (R10)
       ============================ */
    var loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var username = document.getElementById('username');
        var password = document.getElementById('password');
        var valid = true;
        if (!username.value.trim()) {
          if (typeof showFieldError === 'function') showFieldError(username, 'Inserisci il tuo Codice Fiscale o l\'indirizzo email con cui ti sei registrato.');
          valid = false;
        }
        if (!password.value.trim()) {
          if (typeof showFieldError === 'function') showFieldError(password, 'Inserisci la tua password. Se l\'hai dimenticata, usa il link "Password dimenticata?".');
          valid = false;
        }
        if (!valid) return;
        window.location.href = 'dashboard.html?login=ok';
      });
    }

    // Show password toggle
    var showPwd = document.getElementById('show-pwd');
    if (showPwd) {
      showPwd.addEventListener('change', function() {
        var pwd = document.getElementById('password');
        if (pwd) pwd.type = showPwd.checked ? 'text' : 'password';
      });
    }

    /* ============================
       9. ACCORDION
       ============================ */
    document.querySelectorAll('.accordion-header').forEach(function(header) {
      header.addEventListener('click', function() {
        var item = header.closest('.accordion-item');
        if (item) {
          item.classList.toggle('open');
        }
      });
    });

    /* ============================
       10. SEARCH OVERLAY
       ============================ */
    var searchToggle = document.querySelector('.search-toggle');
    var searchOverlay = document.getElementById('search-overlay');
    var searchInput = document.getElementById('search-overlay-input');
    var searchResults = document.getElementById('search-overlay-results');
    var searchClose = document.querySelector('.search-overlay-close');
    if (searchToggle && searchOverlay) {
      searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.classList.add('open');
        if (searchInput) { setTimeout(function() { searchInput.focus(); }, 100); searchInput.value = ''; }
        if (searchResults) searchResults.innerHTML = '<div class="search-overlay-empty">' + getI18nText('search.placeholder', 'Cerca notizie, orari, linee...') + '</div>';
      });
    }
    if (searchClose) {
      searchClose.addEventListener('click', function() { searchOverlay.classList.remove('open'); });
    }
    if (searchOverlay) {
      searchOverlay.addEventListener('click', function(e) { if (e.target === searchOverlay) searchOverlay.classList.remove('open'); });
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('open')) searchOverlay.classList.remove('open');
    });
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        var q = this.value.trim().toLowerCase();
        if (!q) { if (searchResults) searchResults.innerHTML = '<div class="search-overlay-empty">' + getI18nText('search.placeholder', 'Cerca...') + '</div>'; return; }
        var index = [
          { t:'Home', u:'index.html', k_it:'home pianifica orari biglietti abbonamenti', k_en:'home plan schedule tickets subscriptions', k_ar:'الرئيسية تخطيط جداول تذاكر اشتراكات' },
          { t:'Pianifica', u:'pianifica.html', k_it:'percorso viaggio itinerario bus treno bici tragitto mappa pedonale', k_en:'route trip journey bus train bike map path', k_ar:'مسار رحلة حافلة قطار دراجة خريطة' },
          { t:'Orari', u:'orari.html', k_it:'linea fermata orario frequenza bus treno autobus corriera pullman', k_en:'line stop schedule frequency bus train coach', k_ar:'خط محطة جدول تردد حافلة قطار' },
          { t:'Notizie', u:'notizie.html', k_it:'news aggiornamenti bologna ferrara deviazioni scioperi sosta evento novità', k_en:'news updates bologna ferrara diversions strikes parking event', k_ar:'أخبار تحديثات بولونيا فيرارا تحويلات إضرابات مواقف' },
          { t:'Dove Comprare', u:'dove-comprare.html', k_it:'acquista biglietto abbonamento roger app tabaccheria contactless comprare dove canale', k_en:'buy ticket subscription app store kiosk contactless where channel', k_ar:'شراء تذكرة اشتراك تطبيق متجر تماس أين قناة' },
          { t:'Biglietti', u:'biglietti.html', k_it:'corsa singola carnet giornaliero ecoticket contactless tariffa prezzo costo sconto agevolazione riduzione', k_en:'single ride carnet daily eco ticket contactless fare price cost discount reduction', k_ar:'رحلة واحدة كرنيت يومي تذكرة بيئية تماس تعرفة سعر تكلفة خصم تخفيض' },
          { t:'Abbonamenti', u:'abbonamenti.html', k_it:'mensile annuale agevolato studente rinnovo prezzo costo sconto riduzione', k_en:'monthly yearly discounted student renewal price cost discount', k_ar:'شهري سنوي مخفض طالب تجديد سعر تكلفة خصم' },
          { t:'Aiuto', u:'aiuto.html', k_it:'faq supporto assistenza trainer modalita guida aiuto', k_en:'faq support help trainer mode guide assistance', k_ar:'أسئلة دعم مساعدة مدرب وضع دليل' },
          { t:'Login / Area Personale', u:'solweb/login.html', k_it:'accedi account solweb registrazione area personale login entrare', k_en:'login account solweb register personal area access signin', k_ar:'دخول حساب تسجيل منطقة شخصية وصول' },
          { t:'Sanzioni', u:'solweb/sanzioni.html', k_it:'multa pagamento pratica codice fiscale verbale sanzione contravvenzione', k_en:'fine payment case tax code penalty sanction violation', k_ar:'غرامة دفع قضية رمز ضريبي مخالفة عقوبة' },
          { t:'Agevolazioni', u:'agevolazioni.html', k_it:'agevolazioni sconto agevolato ISEE riduzione gratuito under19 over65 studente famiglia', k_en:'discounts concessions eligibility ISEE reduction free under19 over65 student family', k_ar:'خصومات تخفيضات أهلية مجاني طالب عائلة' }
        ];
        var matches = [];
        var lang = (window.TPER_I18N && TPER_I18N.getCurrentLang) ? TPER_I18N.getCurrentLang() : 'it';
        for (var i = 0; i < index.length; i++) {
          var keywords = index[i]['k_' + lang] || index[i].k_it || '';
          if (keywords.indexOf(q) !== -1 || index[i].t.toLowerCase().indexOf(q) !== -1) matches.push(index[i]);
        }
        if (!matches.length) {
          if (searchResults) searchResults.innerHTML = '<div class="search-overlay-empty">' + getI18nText('search.no-results', 'Nessun risultato per "' + q + '"').replace('{q}', q) + '</div>';
        } else {
          var h = '';
          for (var j = 0; j < matches.length; j++) { h += '<a href="' + matches[j].u + '" class="search-overlay-result" onclick="document.getElementById(\'search-overlay\').classList.remove(\'open\')"><h4>' + matches[j].t + '</h4><p>' + getI18nText('search.result-page', 'Pagina') + '</p></a>'; }
          if (searchResults) searchResults.innerHTML = h;
        }
      });
    }

    /* ============================
       11. BACK TO TOP
       ============================ */
    var backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      });
      backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ============================
       12. SKELETON LOADING
        ============================ */
    // Show skeleton on initial page load for pages with dynamic content
    var isPianifica = document.documentElement.getAttribute('data-page') === 'pianifica';
    if (isPianifica && resultsSkeleton) {
      // Only show briefly then hide (content is static/demo)
      setTimeout(function() {
        if (resultsSkeleton) resultsSkeleton.style.display = 'none';
      }, 800);
    }

    /* ============================
       13. NEWS CATEGORY FILTER
       ============================ */
    var catBtns = document.querySelectorAll('.news-cat-btn');
    var newsCards = document.querySelectorAll('.news-card');
    if (catBtns.length && newsCards.length) {
      catBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          catBtns.forEach(function(b) { b.classList.remove('active'); });
          this.classList.add('active');
          var cat = this.getAttribute('data-category');
          newsCards.forEach(function(card) {
            card.style.display = (cat === 'all' || card.getAttribute('data-category') === cat) ? '' : 'none';
          });
        });
      });
    }

    /* ============================
       13. BUY BANNER — "Stai cercando di comprare?"
       ============================ */
    var buyPages = ['biglietti.html', 'abbonamenti.html', 'index.html'];
    var currentPage = window.location.pathname.split('/').pop();
    if (buyPages.indexOf(currentPage) !== -1 && !sessionStorage.getItem('tper-buy-dismissed') && !document.getElementById('buy-banner')) {
      var visits = parseInt(sessionStorage.getItem('tper-buy-visits') || '0') + 1;
      sessionStorage.setItem('tper-buy-visits', visits);
      if (visits >= 3) {
        var banner = document.createElement('div');
        banner.id = 'buy-banner';
        banner.className = 'buy-banner';
        banner.setAttribute('role', 'status');
        banner.innerHTML = '<div class="buy-banner-inner"><span class="buy-banner-icon">&#128722;</span><span>' + getI18nText('banner.buy-hint', 'Stai cercando di comprare? I biglietti e abbonamenti si acquistano su solweb, App Roger o Punti Tper.') + '</span><div class="buy-banner-links"><a href="solweb/login.html">&rarr; solweb.tper.it</a><a href="dove-comprare.html#roger">&rarr; App Roger</a><a href="dove-comprare.html#punti-tper">&rarr; Punti Tper</a></div><button id="dismiss-buy-banner" aria-label="Chiudi">' + getI18nText('banner.buy-dismiss', 'Chiudi') + ' &times;</button></div>';
        var header = document.querySelector('.site-header');
        if (header && header.nextSibling) {
          document.body.insertBefore(banner, header.nextSibling);
        } else {
          document.body.insertBefore(banner, document.body.firstChild);
        }
        document.getElementById('dismiss-buy-banner').addEventListener('click', function() {
          banner.remove();
          sessionStorage.setItem('tper-buy-dismissed', '1');
        });
      }
      // Reset counter if user clicks a purchase-related link
      document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (link && (link.href.indexOf('solweb/') !== -1 || link.href.indexOf('#roger') !== -1 || link.href.indexOf('#punti-tper') !== -1)) {
          sessionStorage.removeItem('tper-buy-visits');
        }
      });
    }

    console.log('tper.it â€” Phase C: Design Proposal. All systems loaded.');
  }); // end DOMContentLoaded

})();


