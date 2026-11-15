# Asset sources and credits

NASA Space Apps Challenge 2026: Space Mission Design Game  
Project: Tenth Light

This document catalogs screenshots, photographic plates, datasets, memes, and media files in `submission-kit/`.

## Gameplay screenshots

Captured at 1920x1080 from the live build at [tenth-light.vercel.app](https://tenth-light.vercel.app):

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

Unaltered public domain photographic plates from NASA and partner missions:

1. Plate 01: Apollo 11 Lunar surface view at Tranquility Base (`AS11-40-5903`), NASA / Neil Armstrong
2. Plate 02: Mars Global Surveyor red planet view (`PIA04304`), NASA / JPL / Malin Space Science Systems
3. Plate 03: Ceres Occator crater and bright spots (`PIA21079`), NASA / JPL-Caltech / UCLA / MPS / DLR / IDA
4. Plate 04: Cassini true-color map of Jupiter (`PIA02873`), NASA / JPL / Space Science Institute
5. Plate 05: Cassini backlit view of Enceladus plumes (`PIA07758`), NASA / JPL / Space Science Institute
6. Plate 06: Voyager 2 Uranus encounter (`PIA18182`), NASA / JPL-Caltech
7. Plate 07: Voyager 2 Neptune and Great Dark Spot (`PIA01492`), NASA / JPL
8. Plate 08: New Horizons portrait of Tombaugh Regio (`PIA19952`), NASA / JHUAPL / SwRI
9. Plate 09: Voyager 1 heliopause crossing illustration (`PIA17046`), NASA / JPL-Caltech
10. Plate 10: Apollo 17 "Blue Marble" Earth portrait (`as17-148-22727`), NASA Apollo 17 Crew

## Memes and media

- Flork sign character (`flork_soil_sample_sign.png`): Internet comic stick figure holding a sign with text: "A photograph is NOT a soil sample!" Used on Slide 4 to explain why orbital flybys must be paired with ground collection.
- Drake template (`drake_meme_science.png`): Meme template contrasting remote exoplanet guesswork against physical robotic sampling. Used on Slide 6.
- Ending video and frame (`ending_slide_for_presentation.mp4` & `thank_you_cat_frame.png`): User-provided animated celebratory cat clip on Slide 7.

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
