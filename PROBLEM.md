# PROBLEM STATEMENT — Trilogy Innovation STS (Seat-to-Sun) Challenge — Task 2

> **Source:** Trilogy Innovation Hackathon PDF (provided by user).  
> **Task Selected:** Task 2 — "Solar & Scenic Flight Seat Advisor"

---

## 1. High-Level Goal

Build a **web application** that helps air travelers choose the **best airplane seat (Left/Port vs. Right/Starboard)** for optimal scenic views — sunrises, sunsets, mountain landscapes, and avoiding direct sun glare — on any given flight route and departure time.

---

## 2. Required User Inputs

| Input              | Description                                                       |
|--------------------|-------------------------------------------------------------------|
| **Origin Airport** | IATA code (e.g. `ZRH`, `JFK`) or dropdown selection              |
| **Destination Airport** | IATA code or dropdown selection                              |
| **Departure Date & Time** | UTC or local time, used to compute sun position in-flight |
| **Scenic Preference** | What the user wants: Sunrise, Sunset, Mountain View, or Shade |

---

## 3. Core Computational Requirements

### 3a. Great Circle Flight Path
- Given two airport coordinates (lat/lng), compute the **great circle route** (the shortest path over the sphere of the earth).
- Interpolate the path into N waypoints (e.g. 100 points), each with `{ lat, lng, heading }`.

### 3b. Solar Position Calculation
- For each waypoint along the flight path, calculate the **sun's azimuth and elevation** at that geographic position and UTC timestamp.
- Use simplified NOAA solar equations or an equivalent algorithm.
- Determine whether the sun is on the **left (port)** or **right (starboard)** side of the airplane at each point.

### 3c. Scenic Seat Scoring Engine
- Accumulate a **left score** and **right score** across all waypoints.
- Weight sunrise/sunset windows heavily (these are the premium scenic moments).
- Produce a final recommendation: `{ winner: 'left' | 'right', confidence: N%, reasoning: string }`.

---

## 4. Required Visual / UI Features

### 4a. Interactive Flight Route Map
- Display an interactive world map (dark-themed tiles preferred).
- Draw the **great circle flight path** as a polyline on the map.
- Show origin and destination markers.
- Optionally animate an airplane icon along the route.

### 4b. 2D Aircraft Cabin Seat Map
- Render a visual **top-down view of an aircraft cabin**.
- Highlight **left-side or right-side window seats** based on the recommendation.
- Color-code seats: Best View (blue/gold glow), Scenic, Standard, Direct Sunlight (red/warning).

### 4c. Solar Timeline / Flight View Timeline
- Show a minute-by-minute or waypoint-by-waypoint timeline of the flight.
- Indicate: takeoff time, sunrise/sunset window, scenic highlights, landing time.
- Show which side of the plane the sun is on at each point in the timeline.

### 4d. Seat Recommendation Banner
- A prominent, clear banner stating: **"Sit on the LEFT/RIGHT side"** with confidence %, reasoning, and a visual indicator.

---

## 5. Preset Scenic Routes

The app should include **preset flight routes** that are known for scenic views, so users can quickly test:

| Route                          | Why it's scenic                            |
|--------------------------------|--------------------------------------------|
| Zurich → San Francisco         | Polar route over Greenland/Arctic           |
| New York → London              | Transatlantic sunrise/sunset                |
| Sydney → Dubai                 | Desert/ocean sunset chaser                  |
| Tokyo → Vancouver              | Pacific sunrise, mountain approach           |

---

## 6. Journey Document / Reflection Log

The PDF also requires a **Journey Document** — a log/reflection of the LLM-assisted development process:
- What prompts were given to the LLM?
- What architectural decisions were made and why?
- What iterations and refinements happened?
- This should be exportable as a Markdown or HTML file from within the app.

---

## 7. Definition of Done (from PDF)

The project is complete when:
1. ✅ User can select an origin, destination, and departure time.
2. ✅ App computes the great circle path and solar trajectory.
3. ✅ App recommends LEFT or RIGHT window seat with a confidence score.
4. ✅ Interactive map visualizes the flight route.
5. ✅ 2D cabin seat map highlights the recommended side.
6. ⬜ Solar timeline shows sun position throughout the flight.
7. ⬜ Journey Document logger captures and exports the development log.
8. ✅ UI is polished, responsive, and visually stunning (dark theme preferred).

---

## 8. Constraints & Guidelines from PDF

- **No paid API keys required** — use free map tiles, offline solar math, and hardcoded airport data.
- **LLM-assisted development is expected** — the Journey Document should reflect this.
- **Creativity and uniqueness matter** — go beyond a basic calculator. Make it feel like a premium product.
- **Code quality** — clean, modular, well-commented code.
- **The app must run locally** without external server dependencies (pure frontend).
