# AeroVista — Solar & Scenic Flight Seat Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-aesthetic web application (AeroVista) that calculates the solar trajectory and air route for any flight, recommending the best window seat (Left vs. Right) for sunrises, sunsets, landscape views, or shade, complete with an interactive flight route map, 2D cabin seat visualizer, simulated window view preview, and integrated Journey Document logger.

**Architecture:** A zero-dependency, modular web application built with HTML5, vanilla CSS3 (Obsidian Dark design system with glassmorphism), Leaflet.js map visualization, and modular ES6 JavaScript modules (Airports Data, Solar Engine, Scenic Calculator, Map Visualizer, Seat Map Visualizer, Journey Logger, and App Orchestrator).

**Tech Stack:** HTML5, Vanilla CSS3 (Custom Variables, Flexbox/Grid, Glassmorphism, Micro-animations), Vanilla JavaScript (ES6 Modules), Leaflet.js (dark map tiles).

**Spec:** [implementation_plan.md](file:///C:/Users/praje/.gemini/antigravity-ide/brain/b1ac85ab-65df-4e67-b028-f5f7db0175f2/implementation_plan.md)

## Global Constraints

- No heavy framework build steps (React/Vue/Webpack) required; pure ES6 modules loadable directly in browser.
- Dark Obsidian aesthetic with indigo/cyan color tokens (`#090D16`, `#121826`, `#6366f1`, `#06b6d4`).
- Must handle arbitrary world airports and departure times in UTC / Local Time.
- Code split into single-responsibility ES6 modules under `js/`.

---

### Task 1: Project Scaffolding, HTML Layout & CSS Design System

**Files:**
- Create: `index.html`
- Create: `css/styles.css`

**Interfaces:**
- Produces: Base DOM structure with container IDs (`#flight-form`, `#preset-routes`, `#recommendation-banner`, `#tab-map`, `#tab-seats`, `#tab-timeline`, `#journey-modal`) and CSS variable theme tokens used by UI modules.

- [ ] **Step 1: Create `css/styles.css` with Obsidian Design System tokens and component styles**
- [ ] **Step 2: Create `index.html` with responsive layout, sidebar, tabs, and Leaflet CSS import**
- [ ] **Step 3: Verify HTML/CSS in browser**
- [ ] **Step 4: Commit Task 1**

---

### Task 2: Airport Database & Preset Scenic Routes

**Files:**
- Create: `js/airports.js`

**Interfaces:**
- Produces: `AIRPORTS` and `PRESET_ROUTES` dataset.

- [ ] **Step 1: Write `js/airports.js` with global airports and scenic preset routes**
- [ ] **Step 2: Verify `js/airports.js` dataset structure**
- [ ] **Step 3: Commit Task 2**

---

### Task 3: Solar Engine & Great Circle Math

**Files:**
- Create: `js/solar-engine.js`

**Interfaces:**
- Produces: `calculateGreatCirclePath`, `getSunPosition`, `analyzeFlightSolarTrajectory`.

- [ ] **Step 1: Write `js/solar-engine.js` containing Great Circle route interpolation and NOAA Solar calculation algorithms**
- [ ] **Step 2: Test `js/solar-engine.js` calculations**
- [ ] **Step 3: Commit Task 3**

---

### Task 4: Scenic Seat Recommendation Engine

**Files:**
- Create: `js/scenic-calculator.js`

**Interfaces:**
- Produces: `recommendSeatSide(trajectoryData, userPreference)`

- [ ] **Step 1: Write `js/scenic-calculator.js` scoring logic**
- [ ] **Step 2: Test scenic calculator with preset scenarios**
- [ ] **Step 3: Commit Task 4**

---

### Task 5: Interactive Map & Solar Visualizer Component

**Files:**
- Create: `js/map-visualizer.js`

**Interfaces:**
- Produces: `initMap`, `renderFlightRoute`, `updateScrubberPosition`

- [ ] **Step 1: Write `js/map-visualizer.js` with Leaflet.js custom tiles, glowing route polyline, aircraft marker, and solar direction line**
- [ ] **Step 2: Test map rendering in browser**
- [ ] **Step 3: Commit Task 5**

---

### Task 6: Interactive 2D Aircraft Seat Map & Window Simulator

**Files:**
- Create: `js/seat-map-visualizer.js`

**Interfaces:**
- Produces: `renderSeatMap`, `openWindowViewModal`

- [ ] **Step 1: Write `js/seat-map-visualizer.js` with 2D aircraft cabin blueprint, seat rating overlays, and Canvas horizon simulator**
- [ ] **Step 2: Verify cabin map interaction**
- [ ] **Step 3: Commit Task 6**

---

### Task 7: Journey Document Logger & Exporter

**Files:**
- Create: `js/journey-logger.js`

**Interfaces:**
- Produces: `initJourneyLogger`, `logPrompt`, `exportJourneyDocMarkdown`

- [ ] **Step 1: Write `js/journey-logger.js` to log prompts, LLM iterations, and export journey doc**
- [ ] **Step 2: Verify modal and download functionality**
- [ ] **Step 3: Commit Task 7**

---

### Task 8: App Orchestration & Final Integration

**Files:**
- Create: `js/app.js`

**Interfaces:**
- Produces: Application bootstrap on `DOMContentLoaded`, UI event handlers, form listeners, tab switching, and live state updates.

- [ ] **Step 1: Write `js/app.js` binding form controls, preset buttons, calculator, map, seat visualizer, timeline, and journey logger**
- [ ] **Step 2: End-to-end verification in browser**
- [ ] **Step 3: Final Commit**
