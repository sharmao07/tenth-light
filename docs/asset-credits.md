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

## NASA scientific data sources

Public domain astronomical data and ephemerides under 17 U.S.C. § 105:

- NASA Exoplanet Archive (Caltech/IPAC / NExScI): TAP query against `pscomppars` for TOI-700 e parameters (radius 0.919 Earth radii, mass 0.718 Earth masses, orbital period 27.81 days, equilibrium temperature 272.9 K).
- JPL Horizons On-Line Ephemeris: Calculates topocentric azimuth and elevation of Earth from the lunar south pole (`coord@301`) across a rolling 24-hour UTC window.
- JPL Small-Body Database: Parameters for 1 Ceres (939.4 km diameter, semi-major axis 2.767 AU).
- NASA NeoWs: Hazard velocities and diameters for near-Earth asteroids.
- NASA DSCOVR EPIC: Calibrated natural-color daily Earth imagery from L1.

## Archival photography

Photographic plates from NASA and partner missions:

1. Plate 01: Apollo 11 Lunar surface view at Tranquility Base (`AS11-40-5903`), NASA / Neil Armstrong (U.S. Government Public Domain)
2. Plate 02: Mars Global Surveyor red planet view (`PIA04304`), NASA / JPL / Malin Space Science Systems (NASA Media Usage Guidelines)
3. Plate 03: Ceres Occator crater and bright spots (`PIA21079`), NASA / JPL-Caltech / UCLA / MPS / DLR / IDA (NASA Media Usage Guidelines)
4. Plate 04: Cassini true-color map of Jupiter (`PIA02873`), NASA / JPL / Space Science Institute (NASA Media Usage Guidelines)
5. Plate 05: Cassini backlit view of Enceladus plumes (`PIA07758`), NASA / JPL / Space Science Institute (NASA Media Usage Guidelines)
6. Plate 06: Voyager 2 Uranus encounter (`PIA18182`), NASA / JPL-Caltech (NASA Media Usage Guidelines)
7. Plate 07: Voyager 2 Neptune and Great Dark Spot (`PIA01492`), NASA / JPL (NASA Media Usage Guidelines)
8. Plate 08: New Horizons portrait of Tombaugh Regio (`PIA19952`), NASA / JHUAPL / SwRI (NASA Media Usage Guidelines)
9. Plate 09: Voyager 1 heliopause crossing illustration (`PIA17046`), NASA / JPL-Caltech (NASA Media Usage Guidelines)
10. Plate 10: Apollo 17 "Blue Marble" Earth portrait (`as17-148-22727`), NASA Apollo 17 Crew (U.S. Government Public Domain)

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
