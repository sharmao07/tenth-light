# NASA Data Resources & Submission Inventory
### NASA Space Apps Challenge 2026: Space Mission Design Game
**Project:** Tenth Light

---

## 1. NASA Data Submission Table (Copy-Paste Ready)

The following table is formatted for direct copy-pasting into the **NASA Data** fields of the official NASA Space Apps Challenge submission portal:

| Link Text | Link URL | Actual usage |
| :--- | :--- | :--- |
| NASA Exoplanet Archive (Table Access Protocol API) | https://exoplanetarchive.ipac.caltech.edu/docs/program_interfaces.html | Supplies astronomical parameters for interstellar target TOI-700 e (radius, estimated mass, orbital period, insolation flux, and equilibrium temperature) queried live via Table Access Protocol (TAP) against the pscomppars table, with an offline fallback snapshot. |
| NASA JPL Horizons On-Line Ephemeris System API | https://ssd-api.jpl.nasa.gov/doc/horizons.html | Generates real-time topocentric azimuth and elevation of Earth observed from the lunar south pole (coord@301) across a rolling 24-hour UTC window for the high-gain dish pointing puzzle at Moon Station (Stop 1), with an offline fallback snapshot. |
| NASA Near Earth Object Web Service (NeoWs API) | https://api.nasa.gov/ | Supplies encounter velocities, maximum estimated diameters, and miss distances for verified near-Earth asteroid hazard vectors (e.g. Apophis, Bennu, Toutatis) during transit navigation segments, with an archival fallback snapshot. |
| NASA DSCOVR Earth Polychromatic Imaging Camera (EPIC API) | https://epic.gsfc.nasa.gov/about/api | Provides calibrated daily natural-color Earth disc imagery and acquisition timestamps from the L1 Lagrange point (1.5 million km sunward) displayed during departure and mission data views. |
| NASA Image and Video Library API | https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf | Whitelisted search endpoint for planetary imagery queries, acting as an API gateway for historical space mission reconnaissance photographs. |
| NASA JPL Photojournal & Mission Archives (Curated Reconnaissance Plates) | https://photojournal.jpl.nasa.gov/ | Provides 10 unaltered historical reconnaissance photographs (displayed across 11 game plate slots, Plate 00 to Plate 10) from Apollo 11, Apollo 17, Mars Global Surveyor, Dawn, Cassini, Voyager 1, Voyager 2, and New Horizons. |
| NASA JPL Small-Body Database API (Endpoint Health Verification Only) | https://ssd-api.jpl.nasa.gov/doc/sbdb.html | Connectivity check confirming network reachability to the JPL SSD API endpoint; does not ingest live orbital parameters, serving instead a curated static Dawn mission comparative benchmark dataset for 1 Ceres, 4 Vesta, and 2 Pallas. |

---

## 2. Technical Integration & Consumed Field Audit

This section documents the exact API fields consumed by the application code, distinguishing live data, fallback snapshots, curated static benchmarks, and static references.

### A. NASA Exoplanet Archive (Caltech / IPAC / NExScI)
* **Official Service:** NASA Exoplanet Archive Table Access Protocol (TAP) Synchronous Service
* **Direct Documentation URL:** [https://exoplanetarchive.ipac.caltech.edu/docs/program_interfaces.html](https://exoplanetarchive.ipac.caltech.edu/docs/program_interfaces.html)
* **User Guide & Field Reference:** [https://exoplanetarchive.ipac.caltech.edu/docs/API_pscomppars_columns.html](https://exoplanetarchive.ipac.caltech.edu/docs/API_pscomppars_columns.html)
* **Active Query URL:** `https://exoplanetarchive.ipac.caltech.edu/TAP/sync`
* **Query Statement:**
  ```sql
  select pl_name,pl_rade,pl_bmasse,pl_orbper,pl_insol,pl_eqt,sy_dist,disc_year,discoverymethod 
  from pscomppars 
  where pl_name in ('TOI-700 b','TOI-700 c','TOI-700 d','TOI-700 e') 
  order by pl_name
  ```
* **Specific Fields Consumed by Code:**
  * `pl_name`: String identifier, used to match target world `TOI-700 e` and companion `TOI-700 d`.
  * `pl_rade`: Planet radius in Earth radii ($0.919\ R_\oplus$ for e; $1.145\ R_\oplus$ for d).
  * `pl_bmasse`: Best-estimate planet mass in Earth masses ($0.718\ M_\oplus$ for e; $1.580\ M_\oplus$ for d).
  * `pl_orbper`: Orbital period in terrestrial days ($27.81\ \text{d}$ for e; $37.42\ \text{d}$ for d).
  * `pl_insol`: Stellar insolation flux ($1.27\ S_\oplus$ for e; $0.85\ S_\oplus$ for d).
  * `pl_eqt`: Equilibrium temperature in Kelvin ($272.9\ \text{K}$ for e; $268.8\ \text{K}$ for d).
  * `sy_dist`: Distance in parsecs ($31.13\ \text{pc} \approx 101.5\ \text{light-years}$).
  * `disc_year`: Discovery year ($2023$ for e; $2020$ for d).
  * `discoverymethod`: Method of discovery (`Transit`).
* **Integration Classification:** **Live API Query** with automatic graceful degradation to an offline fallback snapshot.
* **Code Implementation:**
  * Route: `app/api/nasa/exoplanet/route.ts`
  * Consumed in: `app/data/page.tsx` (live comparison table) and `components/phases/BriefingPhase.tsx` (target parameters).
  * Fallback Data: `EXOPLANET_SNAPSHOT` in `lib/nasaSnapshots.ts` (captured 15 November 2026), returned when external network latency exceeds 2,500 ms.

---

### B. NASA / JPL Horizons On-Line Ephemeris System
* **Official Service:** JPL Solar System Dynamics Horizons REST API
* **Direct Documentation URL:** [https://ssd-api.jpl.nasa.gov/doc/horizons.html](https://ssd-api.jpl.nasa.gov/doc/horizons.html)
* **Ephemeris User Manual:** [https://ssd.jpl.nasa.gov/horizons/manual.html](https://ssd.jpl.nasa.gov/horizons/manual.html)
* **Active Query URL:** `https://ssd.jpl.nasa.gov/api/horizons.api`
* **Query Parameters:**
  * `COMMAND='399'` (Target: Earth geocenter)
  * `CENTER='coord@301'` (Observer: coordinate site on lunar surface, Moon body 301)
  * `COORD_TYPE='GEODETIC'` (JPL Geodetic standard: East longitude, latitude, altitude in km)
  * `SITE_COORD='0,-89,0'` ($0^\circ\text{E}$ longitude, $-89^\circ\text{S}$ latitude, $0\ \text{km}$ altitude)
  * `MAKE_EPHEM='YES'` & `EPHEM_TYPE='OBSERVER'`
  * `QUANTITIES='4'` (Observer Azimuth and Elevation: `Azi_(a-app)`, `Elev_(a-app)`)
  * `STEP_SIZE='1d'`
  * `START_TIME` & `STOP_TIME`: Rolling 24-hour UTC window anchored to the request minute via `lib/horizonsParser.ts` (`formatHorizonsDateTime`).
* **Specific Fields Consumed by Code:**
  * Horizons API returns a JSON payload containing `{ "result": "..." }` with plaintext tabular output.
  * In `lib/horizonsParser.ts`, regex parses the line between `$$SOE` and `$$EOE` markers:
    * `Azi_(a-app)`: Apparent azimuth angle in decimal degrees (e.g. `357.4`).
    * `Elev_(a-app)`: Apparent elevation angle in decimal degrees (e.g. `-2.6`).
    * `epoch`: Timestamp string of the calculated coordinate.
* **Integration Classification:** **Live API Calculation** with **Curated Offline Fallback Snapshot**.
* **Code Implementation:**
  * Route: `app/api/nasa/horizons/route.ts`
  * Consumed in: `components/puzzles/MoonHorizons.tsx` (the player rotates a parabolic antenna slider to match Earth's live azimuth within a $\pm 14^\circ$ beamwidth margin).
  * Fallback Data: `HORIZONS_MOON_SNAPSHOT` in `lib/nasaSnapshots.ts` (`azimuthDeg: 357.4`, `elevationDeg: -2.6`, epoch: 15 November 2026).

---

### C. NASA Near Earth Object Web Service (NeoWs)
* **Official Service:** NASA Open Innovation Near Earth Object Web Service REST API
* **Direct Documentation URL:** [https://api.nasa.gov/](https://api.nasa.gov/) (under "Asteroids - NeoWs")
* **API Documentation Repository:** [https://github.com/SpaceScraper/neows](https://github.com/SpaceScraper/neows)
* **Active Query URL:** `https://api.nasa.gov/neo/rest/v1/feed`
* **Specific Fields Consumed by Code (when API key is supplied):**
  * `near_earth_objects[date]` array.
  * `item.id`: Unique asteroid SPK-ID string.
  * `item.name`: Designation (e.g. `99942 Apophis`).
  * `item.estimated_diameter.meters.estimated_diameter_max`: Maximum estimated diameter in meters, used to scale in-game obstacle collision geometry.
  * `item.close_approach_data[0].relative_velocity.kilometers_per_hour` and `kilometers_per_second`: Relative approach velocity, used to dictate obstacle traversal speed.
  * `item.is_potentially_hazardous_asteroid`: Boolean flag determining hazard indicator color.
  * `item.close_approach_data[0].miss_distance.kilometers`: Miss distance in kilometers.
* **Integration Classification:** **Live API Data** (conditional on custom API key) / **Curated Archival Snapshot** (default under DEMO_KEY).
* **Code Implementation:**
  * Route: `app/api/nasa/neows/route.ts`
  * Consumed in: `components/DodgeRing.tsx` (interplanetary transit obstacle dodging).
  * Fallback Data: `NEOWS_SNAPSHOT` in `lib/nasaSnapshots.ts` (6 curated objects: Apophis, Bennu, Ryugu, 2024 YR4, Toutatis, Phaethon).

---

### D. NASA DSCOVR Earth Polychromatic Imaging Camera (EPIC)
* **Official Service:** DSCOVR EPIC REST API (NASA Goddard Space Flight Center)
* **Direct Documentation URL:** [https://epic.gsfc.nasa.gov/about/api](https://epic.gsfc.nasa.gov/about/api)
* **Active Query URL:** `https://epic.gsfc.nasa.gov/api/natural`
* **Specific Fields Consumed by Code:**
  * `data[0].date`: Image capture timestamp string (`YYYY-MM-DD HH:MM:SS`).
  * `data[0].image`: Image asset identifier string.
  * Constructed Image URL: `https://epic.gsfc.nasa.gov/archive/natural/{YYYY}/{MM}/{DD}/jpg/{image}.jpg`
* **Integration Classification:** **Live API Query** + **Static Image Fallback**.
* **Code Implementation:**
  * Route: `app/api/nasa/epic/route.ts`
  * Consumed in: `components/EndingView.tsx` and `app/data/page.tsx`.
  * Fallback: Apollo 17 "Blue Marble" plate (`NASA_IMAGE_PLATES[10]`).

---

### E. NASA Image and Video Library
* **Official Service:** NASA Image and Video Library REST API
* **Direct Documentation URL:** [https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)
* **Active Query URL:** `https://images-api.nasa.gov/search?q={query}&media_type=image`
* **Specific Fields Consumed by Code:**
  * Queries whitelisted keywords: `moon`, `mars`, `ceres`, `jupiter`, `enceladus`, `uranus`, `neptune`, `pluto`, `heliopause`, `earth`.
  * `collection.items[0].links[0].href`: Direct image preview link.
  * `collection.items[0].data[0].title`: Asset descriptive title.
* **Integration Classification:** **Live Search Route Gateway** + **Curated Remote Image Fallbacks**.
* **Code Implementation:** `app/api/nasa/images/route.ts`.

---

### F. JPL Small-Body Database API (Endpoint Health Verification Only)
* **Official Service:** JPL SSD Small-Body Database (SBDB) API
* **Direct Documentation URL:** [https://ssd-api.jpl.nasa.gov/doc/sbdb.html](https://ssd-api.jpl.nasa.gov/doc/sbdb.html)
* **Active Query URL:** `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=1&phys-par=1`
* **Specific Fields Consumed by Code:**
  * `data.object.fullname`: String checked solely to confirm valid API connectivity (expected: `'1 Ceres'`).
  * **ZERO scientific data fields from the live API response are consumed or rendered into gameplay state.**
* **Curated Benchmark Values Used Instead:**
  * `SMALL_BODIES_SNAPSHOT` in `lib/nasaSnapshots.ts`:
    * 1 Ceres: diameter $939.4\ \text{km}$, IAU classification Dwarf Planet (Dawn mission reference).
    * 4 Vesta: diameter $525.4\ \text{km}$, asteroid.
    * 2 Pallas: diameter $512.0\ \text{km}$, asteroid.
* **Integration Classification:** **Live Endpoint Connectivity Check** + **Curated Static Benchmark Dataset**.
* **Important Note:** This endpoint is an API reachability and status test. It is **NOT** a qualifying live scientific data integration.
* **Code Implementation:**
  * Route: `app/api/nasa/small-bodies/route.ts`
  * Consumed in: `components/puzzles/CeresSelection.tsx`.

---

## 3. Reconciliation of NASA Photographic Reconnaissance Plates

The game UI references **11 plate slots** (Plate 00 through Plate 10) across its mission stages, which correspond to **10 unique NASA photographic reconnaissance images**:
- **Plate 00** (Departure Earth disc in `BriefingPhase.tsx`) and **Plate 10** (Deep space Earth view at debriefing in `EndingView.tsx`) both display the identical Apollo 17 "Blue Marble" photograph (`as17-148-22727`).
- All 10 unique images are loaded remotely from NASA CDN endpoints (`images-assets.nasa.gov`). None are stored as local image files in the repository.

### Inventory of the 10 Unique NASA Images

| Plate Slot | Celestial Stop | NASA Asset ID | Source Page URL | Image Title | Primary Creator / Credit | Rights Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **00 & 10** | Earth (Departure & Debrief) | `as17-148-22727` | [images.nasa.gov/details/as17-148-22727](https://images.nasa.gov/details/as17-148-22727) | Apollo 17 View of Earth ("The Blue Marble") | NASA Apollo 17 Crew (Cernan, Evans, Schmitt) | **Confirmed Public Domain** (17 U.S.C. § 105; U.S. Federal Government employee work) |
| **01** | Moon (Stop 1) | `as11-40-5903` | [images.nasa.gov/details/as11-40-5903](https://images.nasa.gov/details/as11-40-5903) | Astronaut Buzz Aldrin Walks on the Surface of the Moon | NASA / Neil Armstrong | **Confirmed Public Domain** (17 U.S.C. § 105; U.S. Federal Government employee work) |
| **02** | Mars (Stop 2) | `PIA04304` | [photojournal.jpl.nasa.gov/catalog/PIA04304](https://photojournal.jpl.nasa.gov/catalog/PIA04304) | Mars Global Surveyor MOC Wide-Angle View | NASA / JPL / Malin Space Science Systems (MSSS) | **UNVERIFIED — NEEDS HUMAN CONFIRMATION** (MSSS contractor work; educational use allowed by JPL, but not pure federal public domain) |
| **03** | Ceres (Stop 3) | `PIA21079` | [photojournal.jpl.nasa.gov/catalog/PIA21079](https://photojournal.jpl.nasa.gov/catalog/PIA21079) | Dawn's Ceres in Color / Occator Crater | NASA / JPL-Caltech / UCLA / MPS / DLR / IDA | **UNVERIFIED — NEEDS HUMAN CONFIRMATION** (International science consortium and university partnership) |
| **04** | Jupiter (Stop 4) | `PIA02873` | [photojournal.jpl.nasa.gov/catalog/PIA02873](https://photojournal.jpl.nasa.gov/catalog/PIA02873) | Cassini True-Color Cylindrical Map of Jupiter | NASA / JPL / Space Science Institute (SSI) | **UNVERIFIED — NEEDS HUMAN CONFIRMATION** (SSI contractor image processing mosaic) |
| **05** | Enceladus (Stop 5) | `PIA07758` | [photojournal.jpl.nasa.gov/catalog/PIA07758](https://photojournal.jpl.nasa.gov/catalog/PIA07758) | Cassini Backlit View of South Polar Cryovolcanic Jets | NASA / JPL / Space Science Institute (SSI) | **UNVERIFIED — NEEDS HUMAN CONFIRMATION** (SSI contractor image processing product) |
| **06** | Uranus (Stop 6) | `PIA18182` | [photojournal.jpl.nasa.gov/catalog/PIA18182](https://photojournal.jpl.nasa.gov/catalog/PIA18182) | Uranus in Natural Color (Voyager 2) | NASA / JPL-Caltech | **UNVERIFIED — NEEDS HUMAN CONFIRMATION** (Caltech contractor management under NASA contract) |
| **07** | Neptune (Stop 7) | `PIA01492` | [photojournal.jpl.nasa.gov/catalog/PIA01492](https://photojournal.jpl.nasa.gov/catalog/PIA01492) | Neptune and the Great Dark Spot (Voyager 2) | NASA / JPL | **UNVERIFIED — NEEDS HUMAN CONFIRMATION** (Caltech contractor management under NASA contract) |
| **08** | Pluto (Stop 8) | `PIA19952` | [photojournal.jpl.nasa.gov/catalog/PIA19952](https://photojournal.jpl.nasa.gov/catalog/PIA19952) | High-Resolution Color Portrait of Pluto (Tombaugh Regio) | NASA / JHUAPL / Southwest Research Institute (SwRI) | **UNVERIFIED — NEEDS HUMAN CONFIRMATION** (JHUAPL/SwRI institutional contractor works) |
| **09** | Heliopause (Stop 9) | `PIA17046` | [photojournal.jpl.nasa.gov/catalog/PIA17046](https://photojournal.jpl.nasa.gov/catalog/PIA17046) | Voyager 1 Enters Interstellar Space (Artist Concept) | NASA / JPL-Caltech | **UNVERIFIED — NEEDS HUMAN CONFIRMATION** (Contractor-commissioned artistic illustration) |

---

## 4. Rights and Legal Notice

* **No Blanket Public Domain Exemption:** U.S. copyright law (17 U.S.C. § 105) applies exclusively to works created by officers and employees of the United States Federal Government as part of their official duties. Apollo 11 and Apollo 17 photography taken by civil service astronauts is confirmed in the public domain. However, mission photography and mosaics produced under contract by universities, private corporations, or international partners (e.g. Caltech, Malin Space Science Systems, Space Science Institute, JHUAPL, SwRI, DLR, MPS) are subject to contractual terms; while NASA and JPL release them for non-commercial educational use with attribution, their underlying public domain status cannot be assumed without legal verification.
* **No Implied NASA Endorsement:** In strict compliance with NASA Brand Center Media Usage Guidelines, all NASA imagery is presented unaltered and fully credited. No NASA insignias, "meatball" emblems, "worm" logotypes, or official agency seals are used as game assets or application icons.
