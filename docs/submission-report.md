# Comprehensive Submission Report & Project Dossier
### NASA Space Apps Challenge 2026: Space Mission Design Game
**Project:** The Tenth Light  
**Team:** Hubble Horizons (`hubble-horizons`)  
**Target Destination:** TOI-700 e (Harbor), 101.5 light-years from Earth  
**Live Application Build:** [https://tenth-light.vercel.app](https://tenth-light.vercel.app)  
**Space Apps Submission:** [https://www.spaceappschallenge.org/2026/find-a-team/hubble-horizons/?tab=project](https://www.spaceappschallenge.org/2026/find-a-team/hubble-horizons/?tab=project)  
**Demonstration Deck (OneDrive):** [https://1drv.ms/p/c/5d6c8f0368f48b28/IQAK4XN06IYmS6RtsfYhzG--AeyV_eGfnFNZQRdago5KvD0?e=pgJLsE](https://1drv.ms/p/c/5d6c8f0368f48b28/IQAK4XN06IYmS6RtsfYhzG--AeyV_eGfnFNZQRdago5KvD0?e=pgJLsE)  
**Public Code Repository:** [https://github.com/sharmao07/tenth-light](https://github.com/sharmao07/tenth-light)  
**Documentation Root:** `docs/`  
**Submission Status:** **OFFICIALLY SUBMITTED (15 November 2026)**  

---

## 1. FINAL SUBMISSION STATUS

> [!IMPORTANT]
> The project has been officially submitted to the 2026 NASA Space Apps Challenge under team **Hubble Horizons** (*The Tenth Light*). This dossier preserves the final verification record, asset rights breakdown, and technical evidence.

### A. NASA Resources Confirmed (5 Qualifying + 1 Connectivity Check + 1 Archival Collection)
* **NASA Exoplanet Archive (Live TAP API + Snapshot Fallback):** Confirmed active live integration consuming transit photometry and planetary parameters for TOI-700 e and companion TOI-700 d from `pscomppars` (`app/api/nasa/exoplanet/route.ts`).
* **NASA / JPL Horizons On-Line Ephemeris System (Live API + Snapshot Fallback):** Confirmed active live integration calculating topocentric azimuth/elevation of Earth from lunar south pole (`coord@301`) across rolling 24h UTC window for Stop 1 dish pointing (`app/api/nasa/horizons/route.ts`).
* **NASA Near Earth Object Web Service / NeoWs (Live API + Snapshot Fallback):** Confirmed active query endpoint supplying encounter velocities, diameters, and miss distances for near-Earth asteroid vectors (`app/api/nasa/neows/route.ts`).
* **NASA DSCOVR EPIC API (Live API + Snapshot Fallback):** Confirmed daily natural-color Earth disc imagery and timestamps from L1 Lagrange point (`app/api/nasa/epic/route.ts`).
* **NASA Image and Video Library API (Live API Gateway):** Confirmed whitelisted API gateway for planetary imagery reconnaissance queries (`app/api/nasa/images/route.ts`).
* **NASA JPL Small-Body Database / SBDB (Endpoint Connectivity Check Only):** Confirmed network connectivity verification only; does **NOT** ingest live parameters. Serves static curated Dawn mission Ceres benchmarks. **Not counted as a qualifying live scientific data integration.**
* **NASA Archival Photographic Reconnaissance Plates:** 10 unique historical mission plates served across 11 game plate slots (Apollo 11, Apollo 17, Mars Global Surveyor, Dawn, Cassini, Voyager 1, Voyager 2, New Horizons).

### B. Other Resources Confirmed
* **Space Agency Reference:** JAXA IKAROS Solar Sail mission documented as a static engineering benchmark for solar radiation pressure propulsion (not a live data integration). The generic list of 17 partner agencies has been removed.
* **Open-Source Software Stack:** Next.js 16.4.6, React 19.3.0, React DOM 19.3.0, Three.js 0.187.0, Morphicons 2.0.2, Canvas-Confetti 1.9.4 (all verified MIT License).
* **Development & QA Tools:** TypeScript ^5, Tailwind CSS 4.3.3, Playwright 1.65.1, Google Lighthouse 13.6.0 (all verified Apache 2.0 / MIT).
* **Typography:** Fraunces, Instrument Sans, Martian Mono (all verified SIL Open Font License 1.1).
* **Original Procedural Code:** 100% original Three.js procedural meshes (zero 3D model files) and 100% original Web Audio API synthesis engine (zero imported audio files).
* **Cloud Infrastructure:** Vercel serverless edge deployment and GitHub public version control.

### C. Assets Cleared for Submission
* All 13 authentic 1920×1080 gameplay screenshots in `docs/screenshots/`.
* Apollo 11 (`as11-40-5903`) and Apollo 17 (`as17-148-22727`) photography (confirmed U.S. Federal Government Public Domain under 17 U.S.C. § 105).
* All source code, shaders, procedural audio synthesis, and responsive CSS in the GitHub repository.
* All open-source packages and OFL 1.1 fonts.

### D. Third-Party Media Removed
* **Pop-Culture Memes & Celebrity Photos:** All unverified commercial media (`drake_meme.jpg`, `sign_character.jpg`, `will_smith_presentation.jpg`, and the animated cat video) have been **permanently purged** from the repository to maintain strict copyright hygiene.
* **NASA Contractor Imagery Status:** Plates 02 through 09 (PIA04304, PIA21079, PIA02873, PIA07758, PIA18182, PIA01492, PIA19952, PIA17046) are produced by research consortia (Caltech/JPL, MSSS, UCLA/MPS/DLR, SSI, JHUAPL/SwRI) and displayed for non-commercial educational purposes under NASA Media Usage Guidelines with full scientific attribution.

### E. Official Submission Confirmation
* **Submitted to NASA Space Apps Challenge 2026** under Team **Hubble Horizons** (*The Tenth Light*) on 15 November 2026.
* **Submission Portal URL:** [https://www.spaceappschallenge.org/2026/find-a-team/hubble-horizons/?tab=project](https://www.spaceappschallenge.org/2026/find-a-team/hubble-horizons/?tab=project)
* **Project Demonstration Deck:** Hosted on OneDrive at [1drv.ms/p/c/...](https://1drv.ms/p/c/5d6c8f0368f48b28/IQAK4XN06IYmS6RtsfYhzG--AeyV_eGfnFNZQRdago5KvD0?e=pgJLsE)
* **Live Deployment:** [https://tenth-light.vercel.app](https://tenth-light.vercel.app)
* **Open Source Repository:** [https://github.com/sharmao07/tenth-light](https://github.com/sharmao07/tenth-light)

---

## 2. Project Vision & Aerospace Mission Architecture

### Challenge Statement Alignment
The 2026 NASA Space Apps Challenge **"Space Mission Design Game"** calls for interactive educational experiences that communicate the rigorous systems engineering, physical constraints, and real orbital mechanics required to plan and execute deep-space exploration.

Most existing space games fall into two unproductive extremes:
1. **Arcade Simplification:** Infinite propellant, instant reactionless turns, unconstrained power budgets, and arbitrary fantasy mechanics that conceal how space missions actually operate.
2. **Abstract Mathematics:** Dry numerical simulations that fail to engage learners or communicate the human and robotic drama of planetary reconnaissance.

**Tenth Light** bridges this divide by grounding every gameplay mechanic in real aerospace engineering trade-offs:
> *"Design the ship. Stay in the seat. Send the droid."*

### Systems Engineering in the Vehicle Assembly Bay (VAB)
Players begin in an interactive 3D Vehicle Assembly Bay, configuring an exploratory spacecraft within four tightly coupled physical constraints:

1. **Launcher Capacity vs. Payload Sizing:**
   * Launch vehicles impose strict payload mass margins and financial credit caps:
     * *Kite Class:* Low budget ($18\text{M}$ credits), strict $400\text{ kg}$ payload limit. Cannot carry both a high-resolution mass spectrometer and a core drilling rig.
     * *Keel Class:* Heavy lift ($36\text{M}$ credits), $560\text{ kg}$ payload limit. Accommodates comprehensive science suites but severely limits remaining budget for auxiliary propellant tanks.
2. **Propellant Sizing and Delta-V ($\Delta v$):**
   * Mission delta-V is sized using patched-conic approximation principles.
   * Each auxiliary propellant tank adds $2,400\text{ m/s}$ of vacuum $\Delta v$. Traversing the entire outbound route requires at least $7,200\text{ m/s}$, necessitating an orbital propellant transfer rendezvous at the Jupiter Orbital Depot.
3. **Power Generation & The Inverse-Square Law:**
   * Solar irradiance decreases inversely with the square of the distance from the Sun:
     $$S(r) = \frac{S_0}{r^2}$$
     where $S_0 \approx 1,361\text{ W/m}^2$ at $1\text{ AU}$.
   * At Uranus ($19.2\text{ AU}$), solar flux drops by a factor of $368$ down to only $3.7\text{ W/m}^2$. Photovoltaic panels produce insufficient wattage to power deep-space transmitters, triggering cascading electrical brownouts unless the player selected an RTG (Radioisotope Thermoelectric Generator) during VAB configuration.

---

## 3. Mission Route & Educational Learning Objectives

| Stage | Location | Distance / Regime | Astrodynamics & Engineering Focus | NASA Heritage Benchmark |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 00** | VAB / Earth Orbit | $0\text{ km}$ ($1.0\text{ AU}$) | Structural mass fractions, payload margins, and launch limits | Systems Engineering Handbook |
| **Stage 01** | Lunar Vicinity | $384,400\text{ km}$ | Topocentric coordinates, antenna beamwidth, and live ephemeris pointing | Apollo 11 / Surveyor 3 |
| **Stage 02** | Mars Vicinity | $1.52\text{ AU}$ | Orbital insertion mass limits and emergency cargo jettison trade-offs | Mars Global Surveyor (MGS) |
| **Stage 03** | Asteroid Belt | $2.77\text{ AU}$ | Asteroid orbital velocity, IAU dwarf planet criteria, and Occator bright spots | Dawn Mission (Ceres / Vesta) |
| **Stage 04** | Jupiter System | $5.20\text{ AU}$ | Orbital propellant transfer depots, reaction wheels, and debris defense | Cassini-Huygens / Galileo |
| **Stage 05** | Saturn / Enceladus | $9.58\text{ AU}$ | Cryovolcanic plume detection, water-ice geysers, and hydrothermal venting | Cassini E-Ring Flybys |
| **Stage 06** | Uranus Vicinity | $19.2\text{ AU}$ | Inverse-square power decline, circuit breaker shedding, and RTG power margins | Voyager 2 Uranus Encounter |
| **Stage 07** | Neptune Vicinity | $30.1\text{ AU}$ | Finite speed of light in vacuum and round-trip communications latency ($4.17\text{ h}$) | Voyager 2 Neptune Encounter |
| **Stage 08** | Kuiper Belt / Pluto | $39.5\text{ AU}$ | Cryo-geomorphology, nitrogen ice glaciers, and remote vs. physical sensing | New Horizons Flyby |
| **Stage 09** | Heliopause Gate | $122.0\text{ AU}$ | Solar wind termination shock, interstellar magnetic boundary, and telemetry queues | Voyager 1 Interstellar Mission |
| **Stage 10** | Harbor (TOI-700 e) | $101.5\text{ ly}$ | Autonomous surface robotics, sample canister recovery, and biosignature simulants | TESS Exoplanet Discovery |

---

## 4. Rigorous NASA Data Integration Audit

Every NASA integration in Tenth Light has been audited against the codebase to verify the exact nature of the connection, distinguishing between **live API queries**, **live connectivity health checks**, **offline fallback snapshots**, and **static curated benchmarks**:

```
                                 [Tenth Light Architecture]
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      ▼                                      ▼                                      ▼
[Live API Queries]                 [Connectivity Health Check]             [Archival Reconnaissance]
  • Exoplanet Archive (TAP API)      • JPL Small-Body DB (SBDB)              • 10 NASA Mission Plates
  • JPL Horizons (Topocentric Az/El)   (Verifies endpoint ping only;          (Unaltered, Apollo to
  • NASA NeoWs (Asteroid Vectors)       serves static Ceres benchmark)         New Horizons, 11 slots)
  • DSCOVR EPIC (L1 Earth Disc)
  • NASA Image API (Search Gateway)
```

### Integration Details & Consumed Fields

| Resource & Service | Integration Classification | Exact Fields Consumed by Application | Implementation Files |
| :--- | :--- | :--- | :--- |
| **NASA Exoplanet Archive**  <br>`https://exoplanetarchive.ipac.caltech.edu/docs/program_interfaces.html` | **Live API Query**  <br>(Graceful fallback snapshot) | `pl_name`, `pl_rade` ($0.919\ R_\oplus$), `pl_bmasse` ($0.718\ M_\oplus$), `pl_orbper` ($27.81\text{ d}$), `pl_insol` ($1.27\ S_\oplus$), `pl_eqt` ($272.9\text{ K}$), `sy_dist` ($31.13\text{ pc} \approx 101.5\text{ ly}$), `disc_year` ($2023$), `discoverymethod` (`Transit`). | `app/api/nasa/exoplanet/route.ts`  <br>`app/data/page.tsx`  <br>`components/phases/BriefingPhase.tsx`  <br>`lib/nasaSnapshots.ts` |
| **NASA JPL Horizons Ephemeris**  <br>`https://ssd-api.jpl.nasa.gov/doc/horizons.html` | **Live API Calculation**  <br>(Rolling 24h UTC window) | `Azi_(a-app)` (Earth apparent azimuth from lunar pole), `Elev_(a-app)` (Earth apparent elevation), parsed across tabular vector outputs. | `app/api/nasa/horizons/route.ts`  <br>`components/phases/FlightPhase.tsx`  <br>`lib/nasaSnapshots.ts` |
| **NASA Near Earth Object Web Service (NeoWs)**  <br>`https://api.nasa.gov/` | **Live API Query**  <br>(Archival fallback snapshot) | `estimated_diameter.meters.estimated_diameter_max`, `relative_velocity.kilometers_per_hour`, `relative_velocity.kilometers_per_second`, `miss_distance.kilometers`, `is_potentially_hazardous_asteroid`. | `app/api/nasa/neows/route.ts`  <br>`components/phases/FlightPhase.tsx`  <br>`lib/nasaSnapshots.ts` |
| **NASA DSCOVR EPIC API**  <br>`https://epic.gsfc.nasa.gov/about/api` | **Live API Query**  <br>(Archival fallback disc) | `image` (granule identifier), `date` (UTC acquisition timestamp), `caption`, formatted into full natural-color image archive URL. | `app/api/nasa/epic/route.ts`  <br>`app/data/page.tsx` |
| **NASA Image and Video Library**  <br>`https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf` | **Live API Gateway**  <br>(Whitelisted search) | `collection.items[].data[0].nasa_id`, `title`, `href` (JSON asset collection manifest). | `app/api/nasa/images/route.ts`  <br>`app/data/page.tsx` |
| **NASA JPL Small-Body Database (SBDB)**  <br>`https://ssd-api.jpl.nasa.gov/doc/sbdb.html` | **Connectivity Check ONLY**  <br>(Static Ceres benchmark) | Confirms endpoint status via `data.object.fullname`. **Zero live astronomical parameters ingested.** Serves static curated Dawn benchmark: Ceres ($939.4\text{ km}$), Vesta ($525.4\text{ km}$), Pallas ($512.0\text{ km}$). | `app/api/nasa/small-bodies/route.ts`  <br>`components/phases/FlightPhase.tsx`  <br>`lib/nasaSnapshots.ts` |

---

## 5. Archival Photographic Plates Reconciliation

The game features **11 plate slots (Plate 00 through Plate 10)** in the player's flight journal, displaying **10 unique unaltered NASA photographs**:

* **Plate 00 / 10:** Earth — *"The Blue Marble"* (`as17-148-22727`), Apollo 17 Crew (NASA JSC). **Confirmed Public Domain (17 U.S.C. § 105).**
* **Plate 01:** Moon — Tranquility Base (`as11-40-5903`), Neil Armstrong / Apollo 11 (NASA JSC). **Confirmed Public Domain (17 U.S.C. § 105).**
* **Plate 02:** Mars — MOC Global View (`PIA04304`), Malin Space Science Systems / JPL. **UNVERIFIED — Contractor Work.**
* **Plate 03:** Ceres — Occator Crater (`PIA21079`), UCLA / MPS / DLR / IDA / JPL-Caltech. **UNVERIFIED — Academic Consortium Work.**
* **Plate 04:** Jupiter — True Color Projection (`PIA02873`), Space Science Institute / JPL. **UNVERIFIED — Contractor Work.**
* **Plate 05:** Enceladus — Cryovolcanic Plumes (`PIA07758`), Space Science Institute / JPL. **UNVERIFIED — Contractor Work.**
* **Plate 06:** Uranus — True Color Reprocessed (`PIA18182`), Caltech / JPL. **UNVERIFIED — Contractor Work.**
* **Plate 07:** Neptune — Great Dark Spot (`PIA01492`), Caltech / JPL. **UNVERIFIED — Contractor Work.**
* **Plate 08:** Pluto — Tombaugh Regio (`PIA19952`), JHUAPL / SwRI. **UNVERIFIED — University / Institute Work.**
* **Plate 09:** Heliopause — Voyager 1 Artist Concept (`PIA17046`), Caltech / JPL. **UNVERIFIED — Artist Contractor Work.**

---

## 6. Space Agency Partner Citations & Software Architecture

### Partner Space Agency Benchmark: JAXA IKAROS
* **Agency:** Japan Aerospace Exploration Agency (JAXA) / ISAS
* **Documentation:** [https://global.jaxa.jp/projects/sas/ikaros/](https://global.jaxa.jp/projects/sas/ikaros/)
* **Nature of Integration:** **Documented Mission Reference / Engineering Benchmark** (Static citation).
* **Role in Game:** Documented in the VAB propulsion design and data dossier (`app/data/page.tsx`) alongside NASA's ACS3 mission as flight-proven validation that solar radiation pressure can deploy membranes and generate controllable propulsion in interplanetary space.
* **Removal of Unrelated Agencies:** The generic list of 17 partner agencies has been removed from submission records because the software does not ingest data or technical assets from those entities.

### Software Stack & Permissive Licensing
* **Runtime Frameworks:** Next.js 16.4.6 (App Router), React 19.3.0, React DOM 19.3.0 (MIT License).
* **Graphics & Visuals:** Three.js 0.187.0 (MIT), Morphicons 2.0.2 (MIT), Canvas-Confetti 1.9.4 (MIT).
* **Languages & Styling:** TypeScript ^5 (Apache 2.0), Tailwind CSS 4.3.3 (MIT).
* **QA & Standards:** Playwright 1.65.1 (Apache 2.0), Google Lighthouse 13.6.0 (Apache 2.0).
* **Open Fonts:** Fraunces, Instrument Sans, Martian Mono (all SIL Open Font License 1.1).
* **Zero External 3D/Audio Files:** All 3D modules are generated dynamically via Three.js procedural primitives; all audio effects and ambient hums are generated in real-time via the W3C Web Audio API.

---

## 7. Mandatory Scientific Disclosures

The application maintains strict, transparent boundaries between verified scientific measurements and speculative game narrative:

> *"Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive's numbers. The aliens, the depot fight, and the droid are the story."*

### A. Interstellar Travel Parameters
* **Target Distance:** $31.13\text{ pc} \approx 101.5\text{ light-years}$ ($9.60 \times 10^{14}\text{ km}$).
* **Cruising Velocity:** Speculative $0.1c$ ($30,000\text{ km/s}$).
* **Earth-Frame Transit Time:** Approximately $1,015\text{ years}$ ($t = d/v$).
* **Disclosed Physics:** While solar radiation pressure (JAXA IKAROS, NASA ACS3) and ion drives (Dawn, Deep Space 1) are flight-proven, macroscopic interstellar travel at $0.1c$ remains theoretical. Relativistic time dilation at $0.1c$ yields a Lorentz factor $\gamma = 1/\sqrt{1 - 0.1^2} \approx 1.005$, making shipboard time $1,010\text{ years}$.

### B. TOI-700 e Surface Environment & Simulants
* **Confirmed Empirical Data:** NASA TESS transit photometry establishes an orbital period of $27.81\text{ days}$, radius of $0.919\ R_\oplus$, estimated mass of $0.718\ M_\oplus$, and insolation flux of $1.27\ S_\oplus$, placing it within the optimistic circumstellar habitable zone.
* **Unconfirmed Surface Properties:** Telescopes have not confirmed the existence of an atmosphere, surface liquid water, magnetic fields, or plate tectonics on TOI-700 e.
* **Candidate Simulants:** In Act 10, the canisters recovered by Droid Nori are explicitly designated as **candidate biosignature simulants**, teaching players that physical sampling remains necessary to confirm habitability.

---

## 8. Complete Submission Kit Asset Index

All project documentation and screenshots are organized within the `docs/` directory:

```
docs/
├── screenshots/                           # 13 authentic 1920x1080 gameplay screenshots
│   ├── README.md                          # Educational captions for screenshots
│   ├── 01_title_screen.png
│   ├── 02_mission_briefing.png
│   ├── 03_vab_spacecraft_3d.png
│   ├── 04_engineering_configuration_tradeoffs.png
│   ├── 05_solar_system_mission_logbook.png
│   ├── 06_moon_horizons_telemetry.png
│   ├── 07_ceres_selection_puzzle.png
│   ├── 08_jupiter_depot_defense.png
│   ├── 09_uranus_power_breakers.png
│   ├── 10_neptune_light_travel_delay.png
│   ├── 11_harbor_sample_recovery_maze.png
│   ├── 12_mission_completion_debrief.png
│   └── 13_nasa_data_scientific_disclosures.png
├── submission-report.md                   # This primary synthesis report & status
├── nasa-data.md                           # Submitted NASA Data table & audit
├── other-resources.md                     # Submitted Partner & Stack table & audit
├── asset-license-audit.md                 # IP, rights, and asset audit
├── PROJECT_SUMMARY_AND_FACTS.md           # Concise project numbers, facts, and story
├── asset-credits.md                       # Source links and license citations
└── video-voiceover-script.md              # 30-second timed voiceover and scene guide
```

---

## 9. Submission Status Summary

The project **The Tenth Light** by Team **Hubble Horizons** is officially submitted to the NASA Space Apps Challenge 2026:

- [x] **Portal Field 1 (NASA Data):** Verified NASA Data table copied into the form (`docs/nasa-data.md`).
- [x] **Portal Field 2 (Other Resources):** Verified software and mission partner table copied into the form (`docs/other-resources.md`).
- [x] **Presentation Deck:** Exported and hosted on OneDrive (clean, authentic gameplay and mission diagrams).
- [x] **Live Deployment:** Verified live at `https://tenth-light.vercel.app`.
- [x] **GitHub Repository:** Open source at `https://github.com/sharmao07/tenth-light`.
- [x] **Asset Hygiene:** Zero third-party memes or unverified media in repository. NASA civil servant public domain photography distinguished from contractor educational use.
- [ ] **NASA Insignia Check:** Confirm no NASA logos, meatball insignias, or seals are used as in-game assets.
