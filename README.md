# Tenth Light — Space Mission Design Game

> **NASA Space Apps 2026 Challenge Entry: “Space Mission Design Game”**  
> *“Design the ship. Stay in the seat. Send the droid.”*

---

> “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive’s numbers. The aliens, the depot fight, and the droid are the story.”

---

## 🌟 Overview

**Tenth Light** is a browser-based space mission design game built from scratch for the NASA Space Apps 2026 challenge. 

You play as the **Specialist** (default callsign **Wren**). You never leave the ship's pressurized cabin and appear only in dialogue. Your companion is **Nori**, an astromech-style droid who ventures out into the vacuum, braving alien mazes and sub-zero surface environments to retrieve soil and water readings from **TOI-700 e** (nicknamed *Harbor*).

---

## 🚀 Key Features & Narrative Depth

### 1. Best Storytelling Architecture (Inspired by *A Solar Tale*)
- **11-Act Mission Logbook (`📖 Logbook`)**: Accessible from the header or title screen at any moment. As you journey across Stops 0 to 10, unlock chapters containing:
  - **Poetic Epigraph**: Mythic and philosophical framing of cosmic exploration.
  - **✍️ Specialist's Personal Journal**: First-person reflections on isolation, duty, and human hope.
  - **🤖 Droid Nori's Sensor Telemetry**: Whimsical sensor logs, gyroscopic stabilization reports, and cabin atmosphere compensation.
  - **🛰️ NASA Planetary Heritage**: Historical real-world mission context bridging Apollo, Pioneer, Voyager, Cassini, Dawn, and New Horizons to the Exoplanet Archive.
- **Starship Cabin Ambience**: Procedural dual-harmonic synthesizer (55 Hz & 110 Hz low-pass resonance) evokes the hum of living inside a sealed deep space vessel.
- **3-Button Dialogue Bar**: `◀ Previous` to review past dialogue, `▶ Auto (3s)` for automated 3-second pacing, and `Next ▶` to advance.

### 2. Engineering & Mission Design
- **Kerbal-Style Vertical Hangar**: Bolt together engines, propellant tanks, command capsules, high-gain dishes, and science instrumentation.
- **Strict Budget & Mass Constraints**:
  - Teaching budget of 140 credits (Kite 18c/400kg vs Keel 36c/560kg).
  - Patched-conic delta-v table: 2,400 m/s per tank (3 tanks required to clear the 6,700 m/s burn to Jupiter and 7,100 m/s post-refuel).
  - Uranus $1/r^2$ thermal check: Solar drops to ~0.43 W at 19.2 AU; a 100 W RTG is required to maintain the 55 W heater/computer/antenna bus.
- **Real NASA Planetary Gates**:
  - **Stop 1 Moon (Lumen)**: Align high-gain dish with Earth's JPL Horizons azimuth (124° ± 14°).
  - **Stop 2 Mars (Redline)**: Drop souvenir excess mass while safeguarding Nori's optical sensors.
  - **Stop 3 Ceres (Pebble)**: Query JPL SBDB to identify Dawn's target (1 Ceres, 939.4 km).
  - **Stop 4 Jupiter (Bolt)**: 3-wave arcade formation gallery shooter followed by tank refuel.
  - **Stop 5 Enceladus (Spray)**: Locate south-pole cryovolcanic vapor plumes on Cassini imagery.
  - **Stop 6 Uranus (Tilt)**: Breaker management under $1/r^2$ solar dropoff.
  - **Stop 7 Neptune (Lag)**: 7-second light-time lag countdown (simulating 4.17 hours one-way).
  - **Stop 8 Pluto (Heart ❤️)**: Identify Tombaugh Regio (*"A photograph is not a soil sample"*).
  - **Stop 9 Heliopause (Whisper)**: Packet sequence ordering at 122 AU.
  - **Stop 10 Harbor (TOI-700 e)**: 2D top-down probe maze; Nori evades patrolling drones, acquires the amber key, unlocks the red gate, and extracts certified water and soil canisters.
- **Certified Return**: Directorate verdict depending on physical samples and instrumentation survival.

---

## 🛠️ Stack & Data Sources

- **Framework**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- **3D Engine**: Three.js WebGL canvas (orbit camera, modular procedural meshes, starfield particles).
- **Audio Engine**: 100% procedural Web Audio API synthesis (UI chirps, laser bursts, explosions, cabin hum).
- **NASA Local Server Endpoints** (`app/api/nasa/`):
  - NASA Exoplanet Archive (TOI-700 e & d composite parameters)
  - JPL Horizons System (Earth ephemeris from Moon)
  - JPL Small-Body Database (Ceres, Vesta, Pallas)
  - NASA NeoWs (Asteroid dodge hazards)
  - NASA Image and Video Library & NASA EPIC
  - Dated 15 November 2026 fallback snapshots for offline resilience.
- **Save State**: Local browser `localStorage` under `tenth-light-v1`. Zero external database or tracking.

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/sharmao07/tenth-light.git
cd tenth-light

# Install dependencies
npm install

# Setup environment (Optional personal NASA API key)
cp .env.example .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📜 License & Disclaimers

Photographs courtesy of NASA. Unaltered and credited. Educational simulation built for NASA Space Apps 2026.
