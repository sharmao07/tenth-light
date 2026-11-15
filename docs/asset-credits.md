# Asset sources and credits

NASA Space Apps Challenge 2026: Space Mission Design Game  
Project: Tenth Light

This document catalogs screenshots, photographic plates, datasets, and media files in `docs/`.

## Gameplay screenshots

Captured at 1920x1080 from the live build at [tenth-light.vercel.app](https://tenth-light.vercel.app) and stored in `docs/screenshots/`:

| File | Screen | Description |
| :--- | :--- | :--- |
| `01_title_screen.png` | Title Screen | Title view with callsign input and links to logbook, presentation deck, and data page. |
| `02_mission_briefing.png` | Mission Briefing | Briefing dossier, departure orders, and NASA Exoplanet Archive parameters for TOI-700 e and d. |
| `03_vab_spacecraft_3d.png` | Assembly Bay | 3D WebGL spacecraft rendering in the orbital assembly gantry. |
| `04_engineering_configuration_tradeoffs.png` | Subsystem Specs | Subsystem allocation panel showing mass limits, launcher selection (Kite vs Keel), and power budget. |
| `05_solar_system_mission_logbook.png` | Mission Logbook | Logbook modal tracking all 9 Solar System stops and the interstellar voyage to TOI-700 e. |
| `06_moon_horizons_telemetry.png` | Moon Station | Directional radio dish alignment puzzle powered by live JPL Horizons ephemeris data. |
| `07_ceres_selection_puzzle.png` | Ceres Station | Asteroid belt puzzle cross-referencing candidates against the JPL Small-Body Database. |
| `08_jupiter_depot_defense.png` | Jupiter Depot | Kinetic interceptor defense challenge and propellant tank refueling. |
| `09_uranus_power_breakers.png` | Uranus Station | Electrical breaker management under $1/r^2$ solar dropoff (0.43 W/array). |
| `10_neptune_light_travel_delay.png` | Neptune Station | Simulation demonstrating 4.17-hour round-trip radio latency at 29.8 AU. |
| `11_harbor_sample_recovery_maze.png` | Harbor Surface | Autonomous Droid Nori traversing a 2D surface maze to recover water and soil canisters. |
| `12_mission_completion_debrief.png` | Mission Debrief | Mission debrief report evaluating returned samples based on surviving science instruments. |
| `13_nasa_data_scientific_disclosures.png` | Data Disclosures | Disclosure page detailing NASA API connections, fallback snapshots, and the honesty statement. |

## NASA scientific data sources & open APIs

Open astronomical data, ephemeris calculations, and telemetry endpoints provided by NASA and partner centers:

- **NASA Exoplanet Archive (Caltech/IPAC / NExScI):** Live synchronous Table Access Protocol (TAP) queries against `pscomppars` for composite parameters of TOI-700 e (radius 0.919 Earth radii, mass 0.718 Earth masses, orbital period 27.81 days, equilibrium temperature 272.9 K) and companion TOI-700 d.
- **NASA JPL Horizons On-Line Ephemeris System:** Computes topocentric azimuth and elevation coordinates of Earth viewed from the lunar south pole (`coord@301`) across a rolling 24-hour UTC window.
- **NASA Near Earth Object Web Service (NeoWs):** Live near-Earth asteroid velocity, miss-distance, and diameter feeds for hazard sizing.
- **NASA DSCOVR EPIC API:** Daily calibrated natural-color full-disc Earth imagery telemetry from the Lagrange 1 observatory.
- **NASA JPL Small-Body Database API (SBDB):** Real-time endpoint connectivity verification check (`ssd-api.jpl.nasa.gov/sbdb.api`). In-game Ceres benchmark measurements (939.4 km diameter, 2.767 AU semi-major axis) and comparison asteroid data are curated static values derived from NASA Dawn mission publications.
- **NASA Image and Video Library API:** Search and metadata endpoint for NASA mission reconnaissance imagery.

## Archival photography & image licensing

Image rights are audited individually based on mission origin and producing agency:

### Confirmed Public-Domain Works (U.S. Federal Government)
In accordance with 17 U.S.C. § 105, works created solely by officers or employees of the United States Government as part of their official duties are not eligible for domestic copyright protection:
1. **Plate 01:** Apollo 11 Lunar surface view at Tranquility Base (`AS11-40-5903`), NASA / Neil Armstrong
2. **Plate 10:** Apollo 17 "Blue Marble" Earth portrait (`as17-148-22727`), NASA / Apollo 17 Crew

### NASA Contractor & Consortium Imagery (NASA Media Usage Guidelines)
Photographic plates produced by contractor institutions, academic research consortia, or instrument teams are reproduced for non-commercial educational purposes under NASA Media Usage Guidelines with full scientific attribution. Their underlying copyright is held by their respective creator institutions and is not claimed as statutory federal public domain:
1. **Plate 02:** Mars Global Surveyor red planet view (`PIA04304`), NASA / JPL / Malin Space Science Systems
2. **Plate 03:** Ceres Occator crater and bright spots (`PIA21079`), NASA / JPL-Caltech / UCLA / MPS / DLR / IDA
3. **Plate 04:** Cassini true-color map of Jupiter (`PIA02873`), NASA / JPL / Space Science Institute
4. **Plate 05:** Cassini backlit view of Enceladus plumes (`PIA07758`), NASA / JPL / Space Science Institute
5. **Plate 06:** Voyager 2 Uranus encounter (`PIA18182`), NASA / JPL-Caltech
6. **Plate 07:** Voyager 2 Neptune and Great Dark Spot (`PIA01492`), NASA / JPL
7. **Plate 08:** New Horizons portrait of Tombaugh Regio (`PIA19952`), NASA / JHUAPL / SwRI
8. **Plate 09:** Voyager 1 heliopause crossing illustration (`PIA17046`), NASA / JPL-Caltech

## Third-party media status

All uncleared third-party pop-culture memes and non-original media clips have been permanently removed from the repository. All presentation slides and project documentation exclusively reference authentic gameplay screenshots from `docs/screenshots/` and official NASA scientific imagery.

## Software and typefaces

- Next.js: MIT License (Vercel, Inc.)
- React and React DOM: MIT License (Meta Platforms, Inc.)
- TypeScript: Apache 2.0 (Microsoft Corporation)
- Tailwind CSS: MIT License (Tailwind Labs, Inc.)
- Three.js: MIT License (Ricardo Cabello)
- Fraunces: SIL Open Font License 1.1
- Instrument Sans: SIL Open Font License 1.1
- Martian Mono: SIL Open Font License 1.1
- python-pptx: MIT License (Steve Canny)
