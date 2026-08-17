/**
 * AeroVista Main Application Orchestrator & State Manager
 */

import { AIRPORTS, PRESET_ROUTES, getAirportByIata, searchAirports } from './airports.js';
import { analyzeFlightSolarTrajectory } from './solar-engine.js';
import { recommendSeatSide } from './scenic-calculator.js';
import { initMap, renderFlightRoute, updateScrubberPosition } from './map-visualizer.js';
import { renderSeatMap } from './seat-map-visualizer.js';
import { initJourneyLogger } from './journey-logger.js';

// Application State
let currentOrigin = AIRPORTS[0]; // ZRH
let currentDest = AIRPORTS[1];   // FCO
let currentPref = 'sunset';
let currentTrajectoryData = null;
let currentRecommendation = null;
let animationTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  initUtcClock();
  initPresets();
  initAutocomplete();
  initTabs();
  initPreferences();
  initFormListeners();
  initScrubber();
  initPlayButton();
  initSwapButton();
  initJourneyLogger();

  // Initialize Map
  initMap('map');

  // Initial Calculation with default ZRH -> FCO
  calculateAndRender();
});

/**
 * Live UTC Clock in Header
 */
function initUtcClock() {
  const clockElem = document.getElementById('utc-time-display');
  function updateClock() {
    if (!clockElem) return;
    const now = new Date();
    clockElem.innerText = `${now.toISOString().substring(11, 19)} UTC`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Render Preset Route Chips in Top Controller
 */
function initPresets() {
  const container = document.getElementById('presets-container');
  if (!container) return;

  container.innerHTML = '';

  PRESET_ROUTES.forEach(p => {
    const chip = document.createElement('div');
    chip.className = `preset-chip ${p.id === 'zrh-fco-sunset' ? 'active' : ''}`;
    chip.innerText = p.title;

    chip.addEventListener('click', () => {
      container.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyPresetRoute(p);
    });

    container.appendChild(chip);
  });
}

function applyPresetRoute(preset) {
  const origin = getAirportByIata(preset.origin);
  const dest = getAirportByIata(preset.dest);

  if (origin && dest) {
    currentOrigin = origin;
    currentDest = dest;

    const originInput = document.getElementById('origin-input');
    const destInput = document.getElementById('dest-input');
    if (originInput) originInput.value = `${origin.iata} - ${origin.city}`;
    if (destInput) destInput.value = `${dest.iata} - ${dest.city}`;

    const dateInput = document.getElementById('dep-date');
    const timeInput = document.getElementById('dep-time');
    const durInput = document.getElementById('flight-duration');

    if (dateInput) dateInput.value = preset.date;
    if (timeInput) timeInput.value = preset.time;
    if (durInput) durInput.value = preset.duration;

    // Preference
    currentPref = preset.pref;
    document.querySelectorAll('.pref-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pref === currentPref);
    });

    calculateAndRender();
  }
}

/**
 * Swap Origin & Destination Button
 */
function initSwapButton() {
  const swapBtn = document.getElementById('btn-swap-airports');
  if (!swapBtn) return;

  swapBtn.addEventListener('click', () => {
    const temp = currentOrigin;
    currentOrigin = currentDest;
    currentDest = temp;

    const originInput = document.getElementById('origin-input');
    const destInput = document.getElementById('dest-input');
    if (originInput && currentOrigin) originInput.value = `${currentOrigin.iata} - ${currentOrigin.city}`;
    if (destInput && currentDest) destInput.value = `${currentDest.iata} - ${currentDest.city}`;

    calculateAndRender();
  });
}

/**
 * Autocomplete for Origin and Destination Inputs
 */
function initAutocomplete() {
  setupAutocompleteInput('origin-input', 'origin-dropdown', (ap) => {
    currentOrigin = ap;
    calculateAndRender();
  });

  setupAutocompleteInput('dest-input', 'dest-dropdown', (ap) => {
    currentDest = ap;
    calculateAndRender();
  });
}

function setupAutocompleteInput(inputId, dropdownId, onSelect) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const val = input.value;
    const matches = searchAirports(val);

    if (matches.length === 0) {
      dropdown.classList.remove('active');
      return;
    }

    dropdown.innerHTML = '';
    matches.forEach(ap => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = `
        <div>
          <span class="code">${ap.iata}</span>
          <span class="name"> - ${ap.city}, ${ap.country}</span>
        </div>
        <span style="font-size:0.75rem; color:var(--text-muted);">${ap.name}</span>
      `;

      item.addEventListener('click', () => {
        input.value = `${ap.iata} - ${ap.city}`;
        dropdown.classList.remove('active');
        onSelect(ap);
      });

      dropdown.appendChild(item);
    });

    dropdown.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}

/**
 * Tab Control Switcher
 */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(tabId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

/**
 * Preference Button Group
 */
function initPreferences() {
  const prefBtns = document.querySelectorAll('.pref-btn');
  prefBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      prefBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPref = btn.dataset.pref;
      calculateAndRender();
    });
  });
}

/**
 * Form Change Listeners
 */
function initFormListeners() {
  const inputs = ['dep-date', 'dep-time', 'flight-duration'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', calculateAndRender);
    }
  });

  const modalClose = document.getElementById('close-window-modal');
  const windowModal = document.getElementById('window-modal');
  if (modalClose && windowModal) {
    modalClose.addEventListener('click', () => windowModal.classList.remove('active'));
  }
}

/**
 * Flight Time Scrubber Slider Listener
 */
function initScrubber() {
  const scrubber = document.getElementById('time-scrubber');
  if (!scrubber) return;

  scrubber.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (currentTrajectoryData) {
      const totalWp = currentTrajectoryData.waypoints.length;
      const wpIndex = Math.round((val / 100) * (totalWp - 1));
      updateScrubberPosition(wpIndex);
    }
  });
}

/**
 * Play Flight Simulation Animation Button
 */
function initPlayButton() {
  const playBtn = document.getElementById('btn-play-simulation');
  const scrubber = document.getElementById('time-scrubber');
  if (!playBtn || !scrubber) return;

  playBtn.addEventListener('click', () => {
    if (animationTimer) {
      clearInterval(animationTimer);
      animationTimer = null;
      playBtn.innerText = '▶ Play Flight';
      return;
    }

    playBtn.innerText = '⏸ Pause';
    let currentVal = parseInt(scrubber.value, 10);
    if (currentVal >= 100) currentVal = 0;

    animationTimer = setInterval(() => {
      currentVal += 1;
      scrubber.value = currentVal;
      
      if (currentTrajectoryData) {
        const totalWp = currentTrajectoryData.waypoints.length;
        const wpIndex = Math.round((currentVal / 100) * (totalWp - 1));
        updateScrubberPosition(wpIndex);
      }

      if (currentVal >= 100) {
        clearInterval(animationTimer);
        animationTimer = null;
        playBtn.innerText = '▶ Play Flight';
      }
    }, 120);
  });
}

/**
 * Core Calculation & UI Render Trigger
 */
function calculateAndRender() {
  if (!currentOrigin || !currentDest) return;

  if (animationTimer) {
    clearInterval(animationTimer);
    animationTimer = null;
    const playBtn = document.getElementById('btn-play-simulation');
    if (playBtn) playBtn.innerText = '▶ Play Flight';
  }

  const dateVal = document.getElementById('dep-date')?.value || '2026-08-17';
  const timeVal = document.getElementById('dep-time')?.value || '17:30';
  const durVal = parseFloat(document.getElementById('flight-duration')?.value || '2.0');

  // Parse Departure UTC Date
  const depUtcDate = new Date(`${dateVal}T${timeVal}:00Z`);

  // Analyze Trajectory
  currentTrajectoryData = analyzeFlightSolarTrajectory(
    currentOrigin,
    currentDest,
    depUtcDate,
    durVal,
    40 // Waypoints count
  );

  // Recommend Seat Side
  currentRecommendation = recommendSeatSide(currentTrajectoryData, currentPref);

  // Update Recommendation Banner Card
  updateRecommendationBanner(currentRecommendation, currentOrigin, currentDest);

  // Render Interactive Map
  renderFlightRoute(currentTrajectoryData);

  // Reset Scrubber to 0
  const scrubber = document.getElementById('time-scrubber');
  if (scrubber) scrubber.value = 0;

  // Render 2D Aircraft Seat Map
  renderSeatMap('cabin-grid', currentRecommendation, currentTrajectoryData);

  // Render Flight Timeline Cards
  renderTimeline(currentRecommendation.timelineEvents);
}

/**
 * Updates Recommendation Banner UI
 */
function updateRecommendationBanner(rec, origin, dest) {
  const badge = document.getElementById('rec-badge');
  const title = document.getElementById('rec-title');
  const summary = document.getElementById('rec-summary');
  const routeTag = document.getElementById('rec-route-tag');

  const leftBar = document.getElementById('score-left-bar');
  const leftVal = document.getElementById('score-left-val');
  const rightBar = document.getElementById('score-right-bar');
  const rightVal = document.getElementById('score-right-val');

  if (routeTag) routeTag.innerText = `${origin.iata} ➔ ${dest.iata}`;
  if (title) title.innerText = rec.title;
  if (summary) summary.innerText = rec.summary;

  if (badge) {
    if (rec.recommendedSide === 'LEFT') {
      badge.innerText = 'LEFT SIDE (PORT)';
      badge.className = 'rec-badge left';
    } else if (rec.recommendedSide === 'RIGHT') {
      badge.innerText = 'RIGHT SIDE (STARBOARD)';
      badge.className = 'rec-badge right';
    } else {
      badge.innerText = 'EITHER SIDE (BALANCED)';
      badge.className = 'rec-badge either';
    }
  }

  if (leftBar) leftBar.style.width = `${rec.leftScore}%`;
  if (leftVal) leftVal.innerText = `${rec.leftScore}%`;

  if (rightBar) rightBar.style.width = `${rec.rightScore}%`;
  if (rightVal) rightVal.innerText = `${rec.rightScore}%`;
}

/**
 * Renders Flight Timeline Cards
 */
function renderTimeline(events) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = '';

  events.forEach(ev => {
    const card = document.createElement('div');
    card.className = 'timeline-card';
    card.innerHTML = `
      <div class="timeline-time">${ev.time}</div>
      <div class="timeline-icon">${ev.icon}</div>
      <div class="timeline-body">
        <div class="timeline-title">${ev.title}</div>
        <div class="timeline-desc">${ev.desc}</div>
      </div>
    `;
    container.appendChild(card);
  });
}
