# NASA and JPL data sources

NASA Space Apps Challenge 2026: Space Mission Design Game  
Project: Tenth Light

This document catalogs the NASA and JPL datasets, APIs, ephemerides, and photographic plates used across Tenth Light.

## NASA Exoplanet Archive

- Agency: NASA Exoplanet Science Institute (NExScI) / Caltech / IPAC
- Archive portal: [exoplanetarchive.ipac.caltech.edu](https://exoplanetarchive.ipac.caltech.edu/)
- Service: Table Access Protocol (TAP) Synchronous API (`TAP/sync`)
- Table: `pscomppars` (Planetary Systems Composite Parameters)
- Target objects:
  - TOI-700 e (Harbor): Radius 0.919 Earth radii, estimated mass 0.718 Earth masses, orbital period 27.81 days, stellar flux 1.27, equilibrium temperature 272.9 K (-0.25°C), distance 101.5 light-years. Discovered in 2023 by NASA TESS via transit photometry. Located in the optimistic habitable zone.
  - TOI-700 d (Twin): Radius 1.145 Earth radii, estimated mass 1.580 Earth masses, orbital period 37.42 days, equilibrium temperature 268.8 K. Located in the conservative habitable zone.
- Local endpoint: `GET /api/nasa/exoplanet`
- Fallback: Local snapshot dated 15 November 2026.

## JPL Horizons On-Line Ephemeris System

- Agency: NASA Jet Propulsion Laboratory Solar System Dynamics Group
- Service portal: [ssd.jpl.nasa.gov/horizons/](https://ssd.jpl.nasa.gov/horizons/)
- API endpoint: `https://ssd.jpl.nasa.gov/api/horizons.api`
- Mission stage: Stop 1 (Moon Station / Lumen).
- Query setup:
  - `COMMAND='399'` (Earth center)
  - `CENTER='coord@301'` (Lunar south pole site)
  - `COORD_TYPE='GEODETIC'`
  - `SITE_COORD='0.0,-89.9,2.0'` (0°E, 89.9°S, 2.0 km altitude)
  - `QUANTITIES='4'` (Azimuth and Elevation)
  - Rolling 24-hour UTC window calculated per request.
- Mechanics: Calculates Earth's real-time topocentric azimuth and elevation angles as viewed from the lunar south pole.
- Local endpoint: `GET /api/nasa/horizons`
- Fallback snapshot: 15 November 2026 capture (azimuth 357.4°, elevation -2.6°, ±14° pointing tolerance).

## JPL Small-Body Database (SBDB)

- Agency: NASA Jet Propulsion Laboratory Solar System Dynamics Group
- Service portal: [ssd.jpl.nasa.gov/tools/sbdb_lookup.html](https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html)
- API endpoint: `https://ssd-api.jpl.nasa.gov/sbdb.api`
- Mission stage: Stop 3 (Ceres Station / Pebble).
- Objects:
  - 1 Ceres: Dwarf planet, mean diameter 939.4 km, orbited by NASA Dawn (2015–2018).
  - 4 Vesta: Asteroid, mean diameter 525.4 km, orbited by Dawn (2011–2012).
  - 2 Pallas: Asteroid, mean diameter 512.0 km.
- Local endpoint: `GET /api/nasa/small-bodies`
- Mechanics: Verifies live connectivity to the JPL API and evaluates player selection against Dawn mission dimensions.

## NASA Near Earth Object Web Service (NeoWs)

- Agency: NASA Goddard Space Flight Center
- API portal: [api.nasa.gov](https://api.nasa.gov/)
- Mission stage: Asteroid transit hazard evasion (`components/DodgeRing.tsx`).
- Tracked objects:
  - 99942 Apophis: Diameter 340 m, relative velocity 30.7 km/s
  - 101955 Bennu: Diameter 490 m, relative velocity 27.8 km/s (OSIRIS-REx sample return target)
  - 162173 Ryugu: Diameter 900 m, relative velocity 23.4 km/s
  - 2024 YR4: Diameter 54 m, relative velocity 17.2 km/s
  - 4179 Toutatis: Diameter 4,500 m, relative velocity 37.5 km/s
  - 3200 Phaethon: Diameter 5,800 m, relative velocity 32.1 km/s
- Local endpoint: `GET /api/nasa/neows`

## NASA Image and Video Library & NASA EPIC

- Agency: NASA Headquarters & NASA Goddard Space Flight Center
- Endpoints: `https://images-api.nasa.gov/search` and `https://epic.gsfc.nasa.gov/api/natural`
- Local endpoints: `GET /api/nasa/images` and `GET /api/nasa/epic`

## Photographic reconnaissance plates

Unaltered public domain plates displayed at each flight stop:

| Plate | Location | Subject | NASA ID | Attribution |
| :--- | :--- | :--- | :--- | :--- |
| Plate 00 | Departure | Earth full disc (Blue Marble) | `as17-148-22727` | NASA Apollo 17 Crew |
| Plate 01 | Moon | Lunar surface at Tranquility Base | `as11-40-5903` | NASA Apollo 11 / Neil Armstrong |
| Plate 02 | Mars | Mars Global Surveyor wide-angle view | `PIA04304` | NASA / JPL / Malin Space Science Systems |
| Plate 03 | Ceres | Ceres full view with Occator crater | `PIA21079` | NASA / JPL-Caltech / UCLA / MPS / DLR / IDA |
| Plate 04 | Jupiter | Cassini true-color cylindrical map | `PIA02873` | NASA / JPL / Space Science Institute |
| Plate 05 | Enceladus | Cassini view of south polar vapor jets | `PIA07758` | NASA / JPL / Space Science Institute |
| Plate 06 | Uranus | Voyager 2 true-color image at 19.2 AU | `PIA18182` | NASA / JPL-Caltech |
| Plate 07 | Neptune | Voyager 2 view of Neptune and Dark Spot | `PIA01492` | NASA / JPL |
| Plate 08 | Pluto | New Horizons portrait of Tombaugh Regio | `PIA19952` | NASA / JHUAPL / SwRI |
| Plate 09 | Heliopause | Voyager 1 heliopause crossing (122 AU) | `PIA17046` | NASA / JPL-Caltech |
| Plate 10 | Harbor | Earth viewed from deep space | `as17-148-22727` | NASA Apollo 17 Crew |

## Notice

NASA imagery, video, audio, and scientific datasets are in the public domain in the United States under 17 U.S.C. § 105. Tenth Light displays these assets in accordance with NASA Media Usage Guidelines with credits and without implied endorsement.
