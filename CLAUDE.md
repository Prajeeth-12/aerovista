# CLAUDE.md — Full Project Context for AeroVista

> **Read this file first.** It contains 100% of the context you need to understand what this project is, what has been built, what's missing, and how to continue.

---

## 1. What Is This Project?

**AeroVista** is a web application for the **Trilogy Innovation Hackathon — Task 2: "Solar & Scenic Flight Seat Advisor"**.

The app helps air travelers choose the **best airplane seat (Left/Port vs. Right/Starboard)** for optimal scenic views (sunrises, sunsets, mountains) on any given flight route and departure time.

**See `PROBLEM.md`** for the full problem statement extracted from the PDF.

---

## 2. Tech Stack

| Layer        | Technology                                                   |
|--------------|--------------------------------------------------------------|
| Framework    | **React 19** (JSX components, hooks for state)               |
| Build Tool   | **Vite 8** (fast HMR dev server, ESM-native)                 |
| Styling      | **Tailwind CSS v4** (CSS-first config, OKLCH colors)          |
| Map Engine   | **Leaflet** via `react-leaflet` (declarative React wrapper)   |
| Animations   | **Framer Motion** (spring physics, layout transitions)        |
| Icons        | **Lucide React** (clean SVG icon library)                     |
| Design Theme | Aviation HUD Noir (glassmorphism, OKLCH, ambient aurora)      |
| Fonts        | `Inter` (body), `Outfit` (headings), `JetBrains Mono` (data) |

### Key Dependencies (package.json)
```json
{
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "framer-motion": "^13.1.0",
  "lucide-react": "^1.31.0",
  "clsx": "^2.1.1"
}
```

### Commands
```bash
npm run dev      # Start Vite dev server (usually http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 3. Project Structure

```
trilogy_task_2/
├── index.html                  # Vite entry HTML (mounts #root)
├── vite.config.js              # Vite config (React plugin)
├── package.json
├── PROBLEM.md                  # Full problem statement from PDF
├── CLAUDE.md                   # THIS FILE — full project context
│
├── src/
│   ├── main.jsx                # React DOM root mount
│   ├── App.jsx                 # Root component — layout + state orchestration
│   ├── index.css               # Global design system (CSS tokens, glassmorphism)
│   ├── App.css                 # Vite scaffold (mostly unused, can delete)
│   │
│   ├── components/
│   │   ├── MapVisualizer.jsx   # Leaflet map with flight path polyline + plane icon
│   │   ├── SeatMap.jsx         # 2D cabin seat map (framer-motion animated)
│   │   └── FlightConfigurator.jsx  # Sidebar form: route picker + time input
│   │
│   └── lib/
│       ├── airports.js         # Airport coordinates + preset scenic routes
│       ├── solar-engine.js     # Great circle math + basic sun position calc
│       └── scenic-calculator.js # Seat scoring engine (left vs right)
│
└── legacy-vanilla/             # Backed-up V1 vanilla HTML/JS attempt (archived)
    ├── index.html
    ├── css/styles.css
    ├── js/airports.js
    ├── js/solar-engine.js
    ├── js/scenic-calculator.js
    ├── js/map-visualizer.js
    ├── js/seat-map-visualizer.js
    ├── js/journey-logger.js
    └── docs/
```

---

## 4. Architecture & Data Flow

```
User selects route preset + departure time
           │
           ▼
  FlightConfigurator.jsx
    → Looks up origin/dest from AIRPORTS dict
    → Creates a Date object for departure time
    → Calls App.handleCalculate({ origin, dest, startTime })
           │
           ▼
      App.jsx (state orchestrator)
        → generateGreatCircle(origin, dest, 100 waypoints)  [solar-engine.js]
        → recommendSeatSide(waypoints, startTime)            [scenic-calculator.js]
        → setFlightData({ waypoints, recommendation })
           │
           ├──▶ MapVisualizer.jsx
           │      → Draws Polyline on Leaflet map
           │      → Places plane Marker at destination
           │      → Auto-fits map bounds to route
           │
           └──▶ SeatMap.jsx
                  → Renders 2D cabin layout
                  → Glows LEFT or RIGHT seats blue based on winner
                  → Shows confidence % and reasoning text
```

---

## 5. What Has Been Built (✅ Done)

| Feature                         | Status | File(s)                              |
|--------------------------------|--------|--------------------------------------|
| Vite + React + Tailwind v4     | ✅     | `vite.config.js`, `package.json`     |
| Aviation HUD Noir design system | ✅     | `src/index.css` (OKLCH + glass)      |
| Airport data (25 airports)     | ✅     | `src/lib/airports.js`                |
| 10 scenic route presets        | ✅     | `src/lib/airports.js`                |
| Great circle path + local heading | ✅  | `src/lib/solar-engine.js`            |
| NOAA solar position (proper)   | ✅     | `src/lib/solar-engine.js`            |
| Flight duration from distance  | ✅     | `src/lib/solar-engine.js`            |
| Preference-aware scoring       | ✅     | `src/lib/scenic-calculator.js`       |
| Scenic preference selector     | ✅     | `src/components/FlightConfigurator.jsx` |
| Interactive dark-theme map     | ✅     | `src/components/MapVisualizer.jsx`   |
| SVG aircraft seat map          | ✅     | `src/components/SeatMap.jsx`         |
| Recommendation banner + ring   | ✅     | `src/components/RecommendationBanner.jsx` |
| Solar Timeline visualization   | ✅     | `src/components/SolarTimeline.jsx`   |
| Journey Document Logger        | ✅     | `src/components/JourneyLogger.jsx`   |
| Header with tab navigation     | ✅     | `src/components/Header.jsx`          |
| Framer Motion animations       | ✅     | All components                       |
| Responsive layout              | ✅     | `src/index.css` + App.jsx            |
| App orchestration + state      | ✅     | `src/App.jsx`                        |

---

## 6. What Is NOT Built Yet (⬜ Remaining — Optional Enhancements)

All PDF-required features are implemented. These are optional enhancements:

### 6a. Window View Simulator ⬜
Click a seat to see a canvas-rendered horizon/sky preview showing what you'd see out the window at that position.

### 6b. Date Picker ⬜
Currently uses today's date. Adding a full date picker would allow seasonal variation testing (winter vs summer routes).

### 6c. Custom Route Input ⬜
Allow users to type any two IATA codes instead of only preset routes.

### 6d. Animated Plane Along Path ⬜
Animate the plane icon flying along the route in real-time, synced with the timeline scrubber.

---

## 7. Known Issues (Non-Critical)

1. **Bundle size warning** — 508KB (158KB gzipped) due to leaflet + framer-motion + react bundled together. Could code-split with dynamic imports if needed.

2. **Map tiles invisible in initial state** — Dark Esri tiles are near-black ocean at world zoom level, blending with the void background. This is intentional — route appears dramatically on analyze.

---

## 8. Design System Tokens (index.css)

```css
--bg-deep: #030712;           /* Deepest background */
--bg-surface: rgba(15, 23, 42, 0.6);  /* Glass panels */
--bg-glass: rgba(255, 255, 255, 0.03); /* Subtle glass fill */

--border-glass: rgba(255, 255, 255, 0.08);
--border-glass-strong: rgba(255, 255, 255, 0.15);

--text-primary: #f8fafc;
--text-secondary: #94a3b8;
--text-muted: #475569;

--accent-blue: #3b82f6;       /* Primary actions, winning seat glow */
--accent-purple: #8b5cf6;     /* Gradients, secondary accents */
--accent-sunset: #f59e0b;     /* Sunset-related UI */
--accent-sunrise: #ec4899;    /* Sunrise-related UI */
```

**Reusable CSS classes:**
- `.glass-panel` — frosted glass card with blur + border
- `.glass-button` / `.glass-button.primary` — interactive buttons
- `.glass-input` / `.glass-select` — form controls
- `.text-gradient` / `.text-gradient-primary` — gradient text effects
- `.app-container` — 2-column grid layout
- `.map-container` — flex-fill container for Leaflet

---

## 9. Map Tile Provider

Using **Esri World Dark Canvas** (free, no API key needed):
```
https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Base/MapServer/tile/{z}/{y}/{x}
```

---

## 10. How to Continue Development

1. **Run the dev server:** `npm run dev` from the project root.
2. **All source is in `src/`** — components in `src/components/`, math in `src/lib/`.
3. **Styling goes in `src/index.css`** — use the existing CSS custom properties.
4. **No Tailwind is installed** — use vanilla CSS classes or inline styles only.
5. **The legacy V1 code is in `legacy-vanilla/`** — it has working implementations of `journey-logger.js` and `seat-map-visualizer.js` with canvas that can be ported.
6. **Priority items to build next:**
   - Fix SeatMap.jsx Tailwind classes → inline styles or CSS
   - Add Solar Timeline component
   - Add Journey Document logger
   - Expand airport database
   - Calculate flight duration from distance
   - Add scenic preference selector
