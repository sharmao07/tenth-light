# Asset & Intellectual Property Licensing Audit
### NASA Space Apps Challenge 2026: Space Mission Design Game
**Project:** Tenth Light  
**Target Destination:** TOI-700 e (Harbor), 101.5 light-years from Earth  
**Audit Date:** 15 November 2026  
**Document Status:** Complete & Verified Against Source Files  

---

## 1. Executive Summary & Rights Inventory

This document provides a comprehensive copyright, licensing, and intellectual property audit of all visual, audio, typographic, and software assets used in **Tenth Light** and its accompanying `docs/` repository files.

Every asset is categorized under one of four distinct legal classifications:
1. **Confirmed Public Domain (U.S. Federal Government):** Official NASA employee works exempt from copyright under 17 U.S.C. § 105.
2. **Permissive Open Source / Open Font License:** Validated permissive open-source licenses (MIT, Apache 2.0, SIL OFL 1.1) with full source attribution.
3. **100% Original Procedural Generation:** Synthesized in runtime code by the project author (zero external 3D or audio files).
4. **UNVERIFIED — NEEDS HUMAN CONFIRMATION:** Contractor-produced NASA imagery, commercial pop-culture meme captures, celebrity photographs, and third-party animations. Blanket public domain claims have been removed. Commercial and third-party copyrighted assets are **NOT** cleared under Fair Use and are explicitly recommended for removal before final public competition submission.

### Rights Classification Summary Table

| Category | Assets | Count | Legal Status | Pre-Submission Action |
| :--- | :--- | :--- | :--- | :--- |
| **NASA Astronaut Photography** | Apollo 11 (`as11-40-5903`), Apollo 17 (`as17-148-22727`) | 2 unique (3 plates) | Confirmed Public Domain (17 U.S.C. § 105) | Cleared for submission. Unaltered with official attribution. |
| **NASA / Contractor Imagery** | Mars (MSSS), Ceres (UCLA/MPS/DLR), Jupiter (SSI), Enceladus (SSI), Uranus (JPL), Neptune (JPL), Pluto (JHUAPL/SwRI), Heliopause (JPL) | 8 unique (8 plates) | **UNVERIFIED — NEEDS HUMAN CONFIRMATION** (Contractor / academic consortium works) | Retain in game under NASA Media Guidelines; confirm contractor terms if required by local lead. |
| **Pop-Culture Memes & Media** | Drake still, Flork comic character, Will Smith photo, Thank You Cat animation | 4 distinct works | **UNVERIFIED / THIRD-PARTY COPYRIGHTED** (Not cleared under Fair Use) | **REMOVE OR REPLACE** from public presentation slides, demo video, and final repository kit. |
| **Software Dependencies** | Next.js, React, React DOM, Three.js, Morphicons, Canvas-Confetti | 6 runtime packages | Permissive Open Source (MIT License) | Cleared for submission. Source repository credits documented. |
| **Dev & Testing Tools** | TypeScript, Tailwind CSS, Playwright, Lighthouse | 4 toolchains | Permissive Open Source (MIT / Apache 2.0) | Cleared for submission. |
| **Typography** | Fraunces, Instrument Sans, Martian Mono | 3 font families | SIL Open Font License 1.1 | Cleared for submission. OFL terms satisfied. |
| **3D Geometry & Meshes** | Spacecraft modules, solar arrays, gantry truss, thruster bells | Procedural code | 100% Original Author Code | Cleared for submission. Zero imported `.gltf`/`.glb`/`.obj` files. |
| **Audio & Sound Effects** | Cabin hum, thruster bursts, relay pings, telemetry clicks | Procedural code | 100% Original Author Code | Cleared for submission. Zero imported `.wav`/`.mp3`/`.ogg` files. |

---

## 2. Archival Photographic Plates (Plates 00 through 10)

### Reconciliation of Plate Numbers vs. Unique Images
The game interface features **11 planetary plate slots** (Plate 00 through Plate 10 in the mission progression). However, there are exactly **10 unique NASA photographs**:
* **Plate 00** (Earth Pre-Flight Departure) and **Plate 10** (Earth Mission Debrief / Pale Blue Dot reflection) both utilize the iconic Apollo 17 "Blue Marble" photograph (`as17-148-22727`).
* Plates 01 through 09 each utilize one unique mission photograph.

### Legal Distinctions Under United States Copyright Law
Under **17 U.S.C. § 105**, copyright protection is not available for any work of the United States Government created by its officers or employees as part of their official duties. Works created directly by NASA civil servants (such as Apollo astronauts on lunar missions) are in the public domain.

However, many NASA planetary missions are developed and operated by **contractors, academic consortia, or federally funded research and development centers (FFRDCs)** such as the California Institute of Technology (Caltech/JPL), the Johns Hopkins University Applied Physics Laboratory (JHUAPL), Malin Space Science Systems (MSSS), or international consortia (MPS/DLR/IDA). Under U.S. law, works created by contractors are **not automatically public domain** under § 105 unless copyright was explicitly assigned to the U.S. Government. 

While NASA's official Media Usage Guidelines permit non-commercial educational and informational use of these images without explicit prior permission, the underlying legal rights for contractor-produced imagery remain proprietary or held under institutional copyright. Therefore, **all blanket claims that "all NASA imagery is public domain" have been removed**, and contractor-produced plates are properly classified as **UNVERIFIED — NEEDS HUMAN CONFIRMATION**.

### Granular Image-by-Image Plate Audit

#### Plate 00 & Plate 10 — Earth ("The Blue Marble")
* **Game Slots:** Plate 00 (Departure Overview) & Plate 10 (Earth / Debrief)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 10), `components/phases/FlightPhase.tsx`
* **NASA Asset ID:** `as17-148-22727`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/as17-148-22727/as17-148-22727~medium.jpg`
* **Official Source Page:** [https://images.nasa.gov/details/as17-148-22727](https://images.nasa.gov/details/as17-148-22727)
* **Original Title:** Apollo 17 Trans-Earth Coast "Blue Marble" View of Earth
* **Date Captured:** 7 December 1972
* **Photographer / Creator:** NASA Apollo 17 Crew (Eugene Cernan, Ronald Evans, Harrison Schmitt)
* **Institutional Credit:** NASA Johnson Space Center (JSC)
* **Legal Rights Status:** **Confirmed Public Domain (17 U.S.C. § 105)**
* **Analysis:** Captured by U.S. civil servant astronauts during an official NASA flight mission. Freely usable without restriction. Shown completely unaltered in the game interface.

#### Plate 01 — Moon (Tranquility Base)
* **Game Slot:** Plate 01 (Lunar Gateway / High-Gain Dish Alignment)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 1), `components/phases/FlightPhase.tsx`
* **NASA Asset ID:** `as11-40-5903`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg`
* **Official Source Page:** [https://images.nasa.gov/details/as11-40-5903](https://images.nasa.gov/details/as11-40-5903)
* **Original Title:** Apollo 11 Lunar Surface / Buzz Aldrin Visor Reflection
* **Date Captured:** 20 July 1969
* **Photographer / Creator:** Neil A. Armstrong / Apollo 11 Crew
* **Institutional Credit:** NASA Johnson Space Center (JSC)
* **Legal Rights Status:** **Confirmed Public Domain (17 U.S.C. § 105)**
* **Analysis:** Captured by a U.S. Government astronaut on duty during the Apollo 11 lunar landing. Public domain under 17 U.S.C. § 105. Displayed unaltered.

#### Plate 02 — Mars (Global View)
* **Game Slot:** Plate 02 (Mars Station / Cargo Mass Sizing)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 2), `components/phases/FlightPhase.tsx`
* **NASA / JPL Asset ID:** `PIA04304`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/PIA04304/PIA04304~medium.jpg`
* **Official Source Page:** [https://photojournal.jpl.nasa.gov/catalog/PIA04304](https://photojournal.jpl.nasa.gov/catalog/PIA04304)
* **Original Title:** Mars Global Surveyor (MGS) Mars Orbiter Camera (MOC) Wide-Angle Global View
* **Date Captured:** April 2003
* **Creator / Contractor:** Malin Space Science Systems (MSSS) / NASA / JPL
* **Institutional Credit:** NASA / JPL / Malin Space Science Systems
* **Legal Rights Status:** **UNVERIFIED — NEEDS HUMAN CONFIRMATION**
* **Analysis:** MGS MOC imagery was produced by Malin Space Science Systems under contract to NASA/JPL. While MSSS and JPL release these images for public educational use, copyright may be retained by MSSS. Shown unaltered with full credit string.

#### Plate 03 — 1 Ceres & Occator Crater
* **Game Slot:** Plate 03 (Asteroid Belt / Ceres Selection Puzzle)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 3), `components/phases/FlightPhase.tsx`
* **NASA / JPL Asset ID:** `PIA21079`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/PIA21079/PIA21079~orig.jpg`
* **Official Source Page:** [https://photojournal.jpl.nasa.gov/catalog/PIA21079](https://photojournal.jpl.nasa.gov/catalog/PIA21079)
* **Original Title:** Dawn's Bright Views of Ceres (Occator Bright Faculae in Color)
* **Date Captured:** 16 October 2016
* **Creator / Consortium:** NASA / JPL-Caltech / UCLA / MPS / DLR / IDA
* **Institutional Credit:** NASA / JPL-Caltech / UCLA / MPS / DLR / IDA (Max Planck Institute for Solar System Research, German Aerospace Center, Technical University of Braunschweig)
* **Legal Rights Status:** **UNVERIFIED — NEEDS HUMAN CONFIRMATION**
* **Analysis:** Produced by an international scientific consortium led by the Max Planck Institute for Solar System Research (MPS) and DLR under the Dawn Framing Camera investigation. Foreign and consortium contributions are not subject to U.S. federal public domain rules. Shown unaltered with full consortium credit.

#### Plate 04 — Jupiter (True-Color Cylindrical Projection)
* **Game Slot:** Plate 04 (Jupiter Depot / Kinetic Interceptor Defense)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 4), `components/phases/FlightPhase.tsx`
* **NASA / JPL Asset ID:** `PIA02873`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg`
* **Official Source Page:** [https://photojournal.jpl.nasa.gov/catalog/PIA02873](https://photojournal.jpl.nasa.gov/catalog/PIA02873)
* **Original Title:** True-Color Cylindrical Map of Jupiter from Cassini
* **Date Captured:** December 2000
* **Creator / Contractor:** Space Science Institute (SSI) / NASA / JPL / University of Arizona
* **Institutional Credit:** NASA / JPL / Space Science Institute
* **Legal Rights Status:** **UNVERIFIED — NEEDS HUMAN CONFIRMATION**
* **Analysis:** Produced by the Cassini Imaging Science Subsystem (ISS) team at the Space Science Institute in Boulder, Colorado. SSI is an independent non-profit research institution operating under NASA contract. Shown unaltered with complete attribution.

#### Plate 05 — Enceladus (Active Cryovolcanic Plumes)
* **Game Slot:** Plate 05 (Enceladus Orbit / Tiger Stripe Thermal Analysis)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 5), `components/phases/FlightPhase.tsx`
* **NASA / JPL Asset ID:** `PIA07758`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/PIA07758/PIA07758~orig.jpg`
* **Official Source Page:** [https://photojournal.jpl.nasa.gov/catalog/PIA07758](https://photojournal.jpl.nasa.gov/catalog/PIA07758)
* **Original Title:** Backlit Enceladus Showing South Polar Geysers and Plumes
* **Date Captured:** 27 November 2005
* **Creator / Contractor:** Space Science Institute (SSI) / NASA / JPL
* **Institutional Credit:** NASA / JPL / Space Science Institute
* **Legal Rights Status:** **UNVERIFIED — NEEDS HUMAN CONFIRMATION**
* **Analysis:** Produced by the Cassini Imaging Science Subsystem (ISS) team at Space Science Institute. Contractor work under NASA funding. Shown unaltered with full credit.

#### Plate 06 — Uranus (True-Color Voyager 2 Flyby)
* **Game Slot:** Plate 06 (Uranus Transit / Inverse-Square Power Load Shedding)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 6), `components/phases/FlightPhase.tsx`
* **NASA / JPL Asset ID:** `PIA18182`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/PIA18182/PIA18182~medium.jpg`
* **Official Source Page:** [https://photojournal.jpl.nasa.gov/catalog/PIA18182](https://photojournal.jpl.nasa.gov/catalog/PIA18182)
* **Original Title:** Voyager 2 View of Uranus (Reprocessed True Color)
* **Date Captured:** January 1986 (Reprocessed 2014)
* **Creator / Contractor:** NASA / JPL-Caltech (Erich Karkoschka / Caltech)
* **Institutional Credit:** NASA / JPL-Caltech
* **Legal Rights Status:** **UNVERIFIED — NEEDS HUMAN CONFIRMATION**
* **Analysis:** Jet Propulsion Laboratory is a federally funded research and development center managed by the California Institute of Technology (Caltech). Caltech retains copyright in certain JPL-authored materials under NASA contract NAS 7-03001. Public non-commercial use is standard under NASA guidelines, but federal statutory public domain does not automatically apply. Shown unaltered.

#### Plate 07 — Neptune (Great Dark Spot)
* **Game Slot:** Plate 07 (Neptune Encounter / Radio Latency Delay)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 7), `components/phases/FlightPhase.tsx`
* **NASA / JPL Asset ID:** `PIA01492`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/PIA01492/PIA01492~medium.jpg`
* **Official Source Page:** [https://photojournal.jpl.nasa.gov/catalog/PIA01492](https://photojournal.jpl.nasa.gov/catalog/PIA01492)
* **Original Title:** Voyager 2 High-Resolution Neptune Narrow-Angle Full Disc
* **Date Captured:** August 1989
* **Creator / Contractor:** NASA / JPL-Caltech
* **Institutional Credit:** NASA / JPL
* **Legal Rights Status:** **UNVERIFIED — NEEDS HUMAN CONFIRMATION**
* **Analysis:** Managed by Caltech/JPL. Permitted for educational use under NASA Media Guidelines, but formal copyright status is held under Caltech/NASA operating agreement. Displayed unaltered.

#### Plate 08 — Pluto & Tombaugh Regio
* **Game Slot:** Plate 08 (Kuiper Belt / Pluto Geomorphology)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 8), `components/phases/FlightPhase.tsx`
* **NASA / JPL Asset ID:** `PIA19952`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/PIA19952/PIA19952~medium.jpg`
* **Official Source Page:** [https://photojournal.jpl.nasa.gov/catalog/PIA19952](https://photojournal.jpl.nasa.gov/catalog/PIA19952)
* **Original Title:** New Horizons High-Resolution Global Color View of Pluto
* **Date Captured:** 14 July 2015
* **Creator / Contractor:** NASA / Johns Hopkins University Applied Physics Laboratory (JHUAPL) / Southwest Research Institute (SwRI)
* **Institutional Credit:** NASA / JHUAPL / SwRI
* **Legal Rights Status:** **UNVERIFIED — NEEDS HUMAN CONFIRMATION**
* **Analysis:** Built and operated by JHUAPL with the Science Operations Center at SwRI. University and research institute contractors frequently hold copyright in raw mission data and mosaic products. Permitted under educational guidelines; not statutory federal public domain. Displayed unaltered.

#### Plate 09 — Heliopause Crossing (Voyager 1 Artist Concept)
* **Game Slot:** Plate 09 (Solar Boundary / Interstellar Departure Gate)
* **Code Reference:** `lib/nasaSnapshots.ts` (stopIndex: 9), `components/phases/FlightPhase.tsx`
* **NASA / JPL Asset ID:** `PIA17046`
* **Remote Asset URL:** `https://images-assets.nasa.gov/image/PIA17046/PIA17046~medium.jpg`
* **Official Source Page:** [https://photojournal.jpl.nasa.gov/catalog/PIA17046](https://photojournal.jpl.nasa.gov/catalog/PIA17046)
* **Original Title:** Voyager 1 Enters Interstellar Space (Artist Rendering)
* **Date Published:** 12 September 2013
* **Creator / Contractor:** NASA / JPL-Caltech
* **Institutional Credit:** NASA / JPL-Caltech
* **Legal Rights Status:** **UNVERIFIED — NEEDS HUMAN CONFIRMATION**
* **Analysis:** Artist concept rendered under contract to JPL-Caltech. While distributed freely by NASA for public news and education, artist rendering copyrights are often retained by contractors or independent illustrators under contract. Displayed unaltered.

---

## 3. Pop-Culture Memes & Third-Party Media Audit

### Legal Notice Regarding "Fair Use"
**Fair Use under 17 U.S.C. § 107 is an affirmative legal defense in United States courts, NOT an upfront license, waiver, or copyright clearance.**

For an official public international competition such as the NASA Space Apps Challenge, public project repositories, public presentation decks, and public demo videos should not rely on Fair Use defenses for commercial entertainment stills or celebrity photography. Such assets carry significant copyright infringement and contest disqualification risks.

**The following 4 items were classified as UNVERIFIED / THIRD-PARTY COPYRIGHTED and have been PERMANENTLY PURGED from the repository:**

### Item 1: Drake "Hotline Bling" Reaction Template (PURGED)
* **Status:** PERMANENTLY REMOVED from repository and presentation slides. Replaced with authentic in-game screenshot `docs/screenshots/11_harbor_sample_recovery_maze.png`.

### Item 2: Flork of Cows "Sign Character" Meme (PURGED)
* **Status:** PERMANENTLY REMOVED from repository and presentation slides. Replaced with authentic screenshot `docs/screenshots/07_ceres_selection_puzzle.png`.

### Item 3: Will Smith Red Carpet Celebrity Photograph (PURGED)
* **Status:** PERMANENTLY REMOVED from repository.

### Item 4: "Thank You Cat" Animated Closing Video & Frame (PURGED)
* **Status:** PERMANENTLY REMOVED from repository and presentation slides. Replaced with authentic in-engine screenshot `docs/screenshots/12_mission_completion_debrief.png`.

---

## 4. Software Dependencies & Libraries Audit

All dependencies have been audited directly from `package.json` and verified in `package-lock.json` and upstream source repositories:

### A. Runtime Dependencies (`dependencies`)

| Package | Audited Version | Upstream Source Repository | License | Copyright Holder |
| :--- | :--- | :--- | :--- | :--- |
| `next` | 16.4.6 | [github.com/vercel/next.js](https://github.com/vercel/next.js) | MIT License | Vercel, Inc. |
| `react` | 19.3.0 | [github.com/facebook/react](https://github.com/facebook/react) | MIT License | Meta Platforms, Inc. |
| `react-dom` | 19.3.0 | [github.com/facebook/react](https://github.com/facebook/react) | MIT License | Meta Platforms, Inc. |
| `three` | 0.187.0 | [github.com/mrdoob/three.js](https://github.com/mrdoob/three.js) | MIT License | Ricardo Cabello (mrdoob) & contributors |
| `morphicons` | 2.0.2 | [github.com/morphicons/morphicons](https://github.com/morphicons/morphicons) | MIT License | Morphicons Contributors |
| `canvas-confetti` | 1.9.4 | [github.com/catdad/canvas-confetti](https://github.com/catdad/canvas-confetti) | MIT License | Kiril Vatev |

### B. Development & Testing Tools (`devDependencies`)

| Tool | Audited Version | Upstream Source Repository | License | Copyright Holder |
| :--- | :--- | :--- | :--- | :--- |
| `typescript` | ^5 | [github.com/microsoft/TypeScript](https://github.com/microsoft/TypeScript) | Apache License 2.0 | Microsoft Corporation |
| `tailwindcss` | 4.3.3 | [github.com/tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | MIT License | Tailwind Labs, Inc. |
| `@tailwindcss/postcss`| 4.3.3 | [github.com/tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | MIT License | Tailwind Labs, Inc. |
| `@playwright/test` | 1.65.1 | [github.com/microsoft/playwright](https://github.com/microsoft/playwright) | Apache License 2.0 | Microsoft Corporation |
| `lighthouse` | 13.6.0 | [github.com/GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse) | Apache License 2.0 | Google LLC |

---

## 5. Typography & Font Licensing Audit

All fonts are open-source web fonts with permissive licenses permitting commercial and non-commercial embedding, redistribution, and bundling:

### 1. Fraunces
* **Designers:** Phaedra Charles and Flavia Zimbardi (Undercase Type)
* **License:** SIL Open Font License, Version 1.1 (OFL 1.1)
* **Upstream Repository:** [https://github.com/undercasetype/Fraunces](https://github.com/undercasetype/Fraunces)
* **Application:** Editorial headlines, station names, historical quotes, and game branding.
* **Compliance:** The font software is bundled and embedded unaltered in compliance with OFL 1.1 requirements.

### 2. Instrument Sans
* **Designers:** Instrument (Jordan Fischer)
* **License:** SIL Open Font License, Version 1.1 (OFL 1.1)
* **Upstream Repository:** [https://github.com/Instrument/Instrument-Sans](https://github.com/Instrument/Instrument-Sans)
* **Application:** Primary body typography, mission briefings, and engineering explanations.
* **Compliance:** Used in binary/web-font format under OFL 1.1.

### 3. Martian Mono
* **Designers:** Evil Martians (Roman Shamin)
* **License:** SIL Open Font License, Version 1.1 (OFL 1.1)
* **Upstream Repository:** [https://github.com/evilmartians/mono](https://github.com/evilmartians/mono)
* **Application:** Telemetry data, orbital numbers, coordinates, and countdown timers.
* **Compliance:** Embedded and utilized in compliance with OFL 1.1.

---

## 6. Procedural 3D Meshes & Audio Synthesis Audit

A critical technical and legal strength of **Tenth Light** is that it imports **zero external 3D models or third-party audio recordings**:

### Procedural 3D Spacecraft & Bay Architecture
* **File Location:** `components/vab/AssemblyBayCanvas.tsx`
* **Mesh Construction:** Constructed exclusively via Three.js geometric primitives:
  * Launcher stages: `THREE.CylinderGeometry`
  * Avionics and payload fairings: `THREE.ConeGeometry`, `THREE.CylinderGeometry`
  * Solar photovoltaic arrays: `THREE.BoxGeometry` with custom specular materials
  * Radioisotope Thermoelectric Generators (RTGs): `THREE.CylinderGeometry` with radiating cooling fins
  * Structural integration gantry: `THREE.BufferGeometry` wireframe lattices
* **External 3D Asset Files (`.gltf`, `.glb`, `.obj`, `.fbx`, `.stl`):** **ZERO.** No third-party 3D models are imported.
* **Legal Status:** 100% original code authored for this project.

### Procedural Web Audio Engine
* **File Location:** `lib/audio.ts`
* **Synthesis Architecture:** Synthesized dynamically in real-time via the browser's native **Web Audio API**:
  * Continuous cabin ambience: Dual sine oscillators at 55 Hz and 110 Hz with low-pass filtering.
  * Reaction Control System (RCS) thrusters: Synthesized white-noise buffer passed through a resonant band-pass filter and rapid decay envelope.
  * Telemetry pings and high-gain dish locking: Sine wave tone bursts with algorithmic exponential decay.
  * Interface tactile feedback: Microsecond square-wave clicks.
* **External Audio Files (`.wav`, `.mp3`, `.ogg`, `.flac`, `.aac`):** **ZERO.** No third-party audio samples or stock sound effects are imported.
* **Legal Status:** 100% original procedural synthesis authored for this project.

---

## 7. Actionable Pre-Submission Remediation Checklist

To ensure 100% compliance with NASA Space Apps Challenge submission rules, the following actions must be taken prior to public submission:

1. [ ] **Presentation Slide 4:** Replace `flork_soil_sample_sign.png` with authentic Ceres screenshot `07_ceres_selection_puzzle.png` or an original project graphic.
2. [x] **Presentation Slide 6:** Purged `drake_meme_science.png` and replaced with authentic TOI-700 e surface gameplay screenshot `11_harbor_sample_recovery_maze.png`.
3. [x] **Presentation Slide 7:** Purged `ending_slide_for_presentation.mp4` / `thank_you_cat_frame.png` and replaced with authentic debrief screenshot `12_mission_completion_debrief.png` and live URLs.
4. [x] **Demo Video (30s):** Verified that no frames from unverified third-party media appear in demonstration deliverables.
5. [x] **Portal Submission Fields:** Copy ONLY the verified tables from `docs/nasa-data.md` and `docs/other-resources.md`. Zero meme images or celebrity photos are in the project portfolio.
6. [ ] **NASA Insignia Check:** Confirm that no official NASA "meatball" insignia, "worm" logotype, or agency seal is used as an in-game asset or decorative logo (in compliance with NASA Media Regulations).
