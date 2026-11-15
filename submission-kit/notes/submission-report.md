# Comprehensive Submission Report & Project Dossier
### NASA Space Apps Challenge 2026: Space Mission Design Game
**Project:** Tenth Light  
**Target Destination:** TOI-700 e (Harbor), 101.5 light-years from Earth  
**Live Application Build:** [https://tenth-light.vercel.app](https://tenth-light.vercel.app)  
**Public Code Repository:** [https://github.com/sharmao07/tenth-light](https://github.com/sharmao07/tenth-light)  
**Submission Kit Root:** `submission-kit/`  
**Audit & Generation Date:** 15 November 2026  

---

## 1. FINAL SUBMISSION STATUS

> [!IMPORTANT]
> This status overview highlights the confirmed assets, licensing boundaries, unverified third-party items requiring immediate replacement, and mandatory human verification steps prior to final competition submission.

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
* All 13 authentic 1920×1080 gameplay screenshots in `submission-kit/screenshots/`.
* Apollo 11 (`as11-40-5903`) and Apollo 17 (`as17-148-22727`) photography (confirmed U.S. Federal Government Public Domain under 17 U.S.C. § 105).
* All source code, shaders, procedural audio synthesis, and responsive CSS in the GitHub repository.
* All open-source packages and OFL 1.1 fonts.

### D. Assets Requiring Removal or Permission Prior to Public Submission
* **Pop-Culture Memes & Celebrity Photos (UNVERIFIED / THIRD-PARTY COPYRIGHTED — NOT CLEARED):**
  * `drake_meme.jpg` / `drake_meme_science.png` (Slide 6): Universal Music Group copyright. **Must be removed from presentation deck.**
  * `sign_character.jpg` / `flork_soil_sample_sign.png` (Slide 4): Flork of Cows copyright. **Must be removed from presentation deck.**
  * `will_smith_presentation.jpg`: Commercial celebrity press photo. **Must be removed from submission kit.**
  * `ending_slide_for_presentation.mp4` / `thank_you_cat_frame.png` (Slide 7): Unknown third-party animator copyright. **Must be removed from presentation deck and video demo.**
  * *Legal Principle:* Fair Use under 17 U.S.C. § 107 is an affirmative legal defense, not an upfront license. Commercial media assets must not be submitted to official space agency portals. Replace all meme elements with authentic in-engine screenshots (`11_harbor_sample_recovery_maze.png`, `07_ceres_selection_puzzle.png`, `12_mission_completion_debrief.png`).
* **NASA Contractor Imagery (UNVERIFIED — NEEDS HUMAN CONFIRMATION):**
  * Plates 02 through 09 (PIA04304, PIA21079, PIA02873, PIA07758, PIA18182, PIA01492, PIA19952, PIA17046) were produced by contractors or research consortia (Caltech/JPL, MSSS, UCLA/MPS/DLR, SSI, JHUAPL/SwRI). While permitted for educational display under NASA Media Usage Guidelines, they are not statutory federal public domain.

### E. Global Award NASA-Resource Requirement: UNVERIFIED — REQUIRES HUMAN CONFIRMATION
* **Rule Requirement:** To qualify for NASA Space Apps Global Judging and Global Awards, a project must demonstrate the use of at least one NASA or partner resource specifically listed under the **Resources tab** of the official challenge statement on [spaceappschallenge.org](https://www.spaceappschallenge.org/).
* **Current Status:** **UNVERIFIED — REQUIRES HUMAN CONFIRMATION.**
* **Action Required:** The team must log into the Space Apps portal, open the challenge page for **"Space Mission Design Game"**, review the listed resources, and confirm that at least one of Tenth Light's verified NASA integrations (e.g., NASA Exoplanet Archive, JPL Horizons, JPL Small-Body Database / NeoWs, DSCOVR EPIC, or NASA Image and Video Library) is explicitly cited.

### F. Remaining Manual Pre-Submission Actions
1. [ ] Log into the NASA Space Apps submission portal and verify challenge resource match.
2. [ ] Replace meme graphics on Slides 4, 6, and 7 of `Tenth-Light-NASA-Space-Apps-2026.pptx` with authentic game screenshots.
3. [ ] Verify that `Tenth-Light-30s-Demo.mp4` contains zero frames of third-party meme or animated footage.
4. [ ] Record custom human voiceover matching `submission-kit/notes/video-voiceover-script.md` if desired, or submit demo video with visual typography captions.
5. [ ] Copy the verified tables from `submission-kit/notes/nasa-data-submission.md` and `submission-kit/notes/other-resources-submission.md` directly into the portal submission fields.
6. [ ] Confirm that `https://tenth-light.vercel.app` is live and `https://github.com/sharmao07/tenth-light` is public.

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

All project assets, documents, and presentation deliverables are organized within the `submission-kit/` directory:

```
submission-kit/
├── Tenth-Light-NASA-Space-Apps-2026.pptx   # 7 widescreen slides with detailed speaker notes
├── Tenth-Light-30s-Demo.mp4               # High-definition 29.5-second demo video
├── screenshots/                           # 13 authentic 1920x1080 gameplay screenshots
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
├── notes/                                 # Audited submission documentation & scripts
│   ├── submission-report.md               # This primary synthesis report & status
│   ├── nasa-data-submission.md            # Copy-paste ready NASA Data table & audit
│   ├── other-resources-submission.md      # Copy-paste ready Partner & Stack table & audit
│   ├── asset-license-audit.md             # IP, rights, and pre-submission audit
│   ├── SCREENSHOT_CAPTIONS.md             # Detailed educational captions for screenshots
│   ├── PROJECT_SUMMARY_AND_FACTS.md       # Concise project numbers, facts, and story
│   ├── SEVEN_SLIDE_PRESENTATION_OUTLINE.md# Complete 7-slide script & visual breakdown
│   ├── slide-content.md                   # Slide text and speaker notes
│   ├── asset-credits.md                   # Source links and license citations
│   └── video-voiceover-script.md          # 30-second timed voiceover and scene guide
└── memes/                                 # Meme graphics & user video (FLAGGED FOR REMOVAL)
    ├── drake_meme.jpg                     # Commercial still (REMOVE FROM PRESENTATION)
    ├── drake_meme_science.png             # Modified still (REMOVE FROM PRESENTATION)
    ├── sign_character.jpg                 # Flork comic still (REMOVE FROM PRESENTATION)
    ├── flork_soil_sample_sign.png         # Modified comic still (REMOVE FROM PRESENTATION)
    ├── flork_sign_cropped.png             # Cropped comic still (REMOVE FROM PRESENTATION)
    ├── will_smith_presentation.jpg        # Celebrity press photo (REMOVE FROM SUBMISSION)
    ├── thank_you_cat_frame.png            # Video frame (REMOVE FROM PRESENTATION)
    └── ending_slide_for_presentation.mp4  # Unverified animated video (REMOVE FROM PRESENTATION)
```

---

## 9. Final Pre-Submission Execution Checklist

Before submitting **Tenth Light** to the official NASA Space Apps Challenge portal:

- [ ] **Portal Field 1 (NASA Data):** Copy the table from `submission-kit/notes/nasa-data-submission.md` directly into the form.
- [ ] **Portal Field 2 (Other Resources):** Copy the table from `submission-kit/notes/other-resources-submission.md` directly into the form.
- [ ] **Challenge Resources Verification:** Check the **Resources tab** of "Space Mission Design Game" on spaceappschallenge.org and confirm resource match for Global Award eligibility.
- [ ] **Presentation Deck Sanitization:** Open `submission-kit/Tenth-Light-NASA-Space-Apps-2026.pptx`, replace meme graphics on Slides 4, 6, and 7 with authentic gameplay screenshots, and export as PDF.
- [ ] **Demo Video Check:** Ensure `submission-kit/Tenth-Light-30s-Demo.mp4` contains no third-party copyrighted frames. Upload to YouTube/Vimeo as an unlisted/public video.
- [ ] **Live Deployment:** Verify responsive performance on desktop and mobile at `https://tenth-light.vercel.app`.
- [ ] **GitHub Repository:** Confirm public visibility at `https://github.com/sharmao07/tenth-light`.
- [ ] **NASA Insignia Check:** Confirm no NASA logos, meatball insignias, or seals are used as in-game assets.
