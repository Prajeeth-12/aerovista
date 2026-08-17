# AeroVista Premium UI — Design Spec

## Decision: Tailwind CSS v4 + Framer Motion + Custom Aviation HUD Design System

---

## 1. Stack Changes

| Add | Version | Purpose |
|-----|---------|---------|
| tailwindcss | ^4.3 | Utility-first styling (CSS-first config, no JS config file) |
| @tailwindcss/vite | ^4.3 | Vite plugin for Tailwind v4 |

Keep existing: `framer-motion`, `lucide-react`, `react-leaflet`, `leaflet`, `clsx`

## 2. Design Language: "Aviation HUD Noir"

### Color Palette (OKLCH for vibrancy)
- **Deep void:** `oklch(0.05 0.01 260)` — near-black with cold blue undertone
- **Surface glass:** `oklch(0.12 0.02 260)` at 60% opacity + 16px blur
- **Border subtle:** white at 6% opacity
- **Border active:** white at 15% opacity
- **Text primary:** `oklch(0.97 0.01 260)` — near-white
- **Text muted:** `oklch(0.55 0.02 260)` — desaturated slate
- **Accent blue:** `oklch(0.65 0.20 250)` — electric HUD blue
- **Accent purple:** `oklch(0.60 0.22 290)` — depth accent
- **Sunset gold:** `oklch(0.75 0.18 75)` — warm amber
- **Sunrise pink:** `oklch(0.70 0.20 350)` — vivid magenta
- **Success green:** `oklch(0.70 0.18 155)` — scan confirmation

### Typography
- Headings: `'Outfit', sans-serif` — geometric, modern, technical
- Body: `'Inter', sans-serif` — optimized for screens
- Data/HUD: `'JetBrains Mono', monospace` — coordinates, timestamps, percentages

### Glassmorphism Spec
- Background: surface color at 40-70% opacity
- Backdrop-filter: `blur(16px) saturate(1.4)`
- Border: 1px solid white/8%
- Inner glow: `inset 0 1px 0 0 rgba(255,255,255,0.06)`
- Drop shadow: `0 8px 32px rgba(0,0,0,0.4)`

### Animation Principles
- Entrances: spring physics (`stiffness: 300, damping: 30`)
- Data updates: `duration: 0.4s, ease: [0.25, 0.46, 0.45, 0.94]`
- Background ambient: `duration: 20-60s, infinite, linear`
- Interactions: `duration: 0.15s` — snappy, immediate

## 3. Layout Architecture

```
┌─────────────────────────────────────────────────────────┐
│ HEADER BAR (fixed, glass, 56px)                         │
│  Logo + Nav tabs (Map | Timeline | Journey)             │
├──────────────┬──────────────────────────────────────────┤
│  SIDEBAR     │  MAIN STAGE                              │
│  (380px)     │                                          │
│              │  [Active view based on tab]              │
│  Flight      │  - Map: Leaflet + flight path           │
│  Config      │  - Timeline: Solar timeline viz          │
│  Panel       │  - Journey: Dev log modal               │
│              │                                          │
│  Seat Map    │                                          │
│  Panel       │                                          │
│              │                                          │
│  Rec Banner  │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

Mobile (<768px): Single column, sidebar collapses to bottom sheet.

## 4. Component Designs

### 4a. Header Bar
- Fixed top, full width, glass panel (thinner: 12px blur)
- Left: AeroVista logo (plane icon + gradient text)
- Center: Tab navigation (Map | Timeline | Journey) — pill-shaped active indicator with spring animation
- Right: Departure date picker (compact)

### 4b. Flight Configurator (Sidebar)
- Glass panel with subtle gradient border on hover
- Route selector: custom dropdown with airport flags/codes
- Time input: styled native time picker with HUD styling
- "Analyze Flight" button: gradient blue→purple, pulsing glow on idle, expands on hover
- Scenic Preference selector: 4 icon pills (Sunrise/Sunset/Mountain/Shade)

### 4c. Seat Map (Sidebar)
- SVG-based aircraft fuselage outline (rounded nose, tapered tail)
- 3-3 seat layout (6 columns, 10 rows)
- Seat states: neutral (dark slate), recommended (blue glow + pulse), warning (red subtle)
- Row labels: 1A-1F format in monospace
- Animated highlight sweep on recommendation change
- Port/Starboard labels with directional arrows

### 4d. Recommendation Banner
- Full-width card below seat map in sidebar
- Large percentage: animated counter (0→N%)
- Winner side: "SIT LEFT" or "SIT RIGHT" in bold with arrow icon
- Reasoning text below in muted
- Confidence ring: SVG circular progress with gradient stroke

### 4e. Map Visualizer (Main)
- Dark Esri tiles (existing)
- Flight path: animated dashed polyline (gradient from blue to purple along length)
- Origin/destination markers: pulsing ring markers with IATA code labels
- Plane icon: rotates to match heading, animates along path
- Sun position indicator: small golden circle showing sun location at current timeline point

### 4f. Solar Timeline (Main — new)
- Horizontal scrollable timeline bar (full width of main stage)
- X-axis: flight duration (takeoff → landing)
- Y-axis: sun elevation angle
- Visual layers:
  - Background gradient: dark→sunrise gold→daylight→sunset amber→dark
  - Sun path curve: golden line with glow
  - Left/Right indicator: colored band below (blue=left, purple=right)
  - Key moment markers: takeoff, sunrise, sunset, landing (vertical lines + labels)
- Current position scrubber: draggable, updates map plane position
- Altitude reference line

### 4g. Journey Document Logger (Main — new)
- Modal/panel view (tab-based)
- Sections: Architecture Decisions, Prompts Used, Iterations, Technical Notes
- Each entry: timestamp + title + expandable content
- Export button: downloads as `.md` file
- Pre-populated with actual development journey
- "Add Note" form at bottom

## 5. Ambient Effects (Premium tier)

- **Aurora background**: CSS animated gradient (3 color stops, 20s cycle) on body
- **Grid overlay**: faint CSS grid pattern on main stage (aviation chart feel)
- **Scanline accent**: single horizontal line that sweeps vertically on page load
- **Glow orbs**: 2-3 out-of-focus radial gradients that drift slowly (CSS only)
- **Route draw**: polyline animates from origin to destination on first render (SVG stroke-dashoffset)

## 6. Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| ≥1280px | Full sidebar + main (as designed) |
| 768-1279px | Narrower sidebar (320px) + main |
| <768px | Single column: main on top, sidebar panels in collapsible bottom sheet |

## 7. Implementation Phases

1. Install Tailwind v4 + migrate CSS → working app
2. Redesign layout (header + sidebar + main stage)
3. Rebuild SeatMap as SVG aircraft
4. Build Solar Timeline component
5. Build Journey Logger
6. Add scenic preference selector
7. Expand airports + fix solar engine + flight duration
8. Ambient effects + final polish
9. Responsive breakpoints + mobile

## 8. Files to Create/Modify

| File | Action |
|------|--------|
| `src/index.css` | Rewrite: Tailwind v4 import + @theme tokens + glass utilities |
| `vite.config.js` | Add @tailwindcss/vite plugin |
| `src/App.jsx` | Redesign: header + tabbed main + sidebar layout |
| `src/components/SeatMap.jsx` | Rewrite: SVG aircraft with proper seats |
| `src/components/FlightConfigurator.jsx` | Restyle: Tailwind classes + scenic preference |
| `src/components/MapVisualizer.jsx` | Enhance: markers, gradient path, sun indicator |
| `src/components/SolarTimeline.jsx` | NEW: full timeline visualization |
| `src/components/JourneyLogger.jsx` | NEW: dev log panel with export |
| `src/components/RecommendationBanner.jsx` | NEW: extracted confidence display |
| `src/components/Header.jsx` | NEW: navigation header |
| `src/lib/airports.js` | Expand: 25+ airports |
| `src/lib/solar-engine.js` | Fix: NOAA equations, flight duration calc |
| `src/lib/scenic-calculator.js` | Fix: preference-aware scoring, duration from distance |
| `src/lib/journey-data.js` | NEW: journey log entries |
