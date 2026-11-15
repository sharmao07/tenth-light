# Space Agency Partner & Other Resources Submission Inventory
### NASA Space Apps Challenge 2026: Space Mission Design Game
**Project:** Tenth Light

---

## 1. Space Agency Partner & Other Data Table (Copy-Paste Ready)

The following table is formatted for direct copy-pasting into the **Space Agency Partner & Other Data** section of the official NASA Space Apps Challenge submission portal:

| Link Text | Link URL | Category | Actual usage / attribution |
| :--- | :--- | :--- | :--- |
| JAXA IKAROS Solar Sail Mission (Project Documentation) | https://global.jaxa.jp/projects/sas/ikaros/ | Space Agency Mission Reference | Documented engineering mission benchmark for flight-proven solar-sail radiation-pressure navigation in deep space, cited in the VAB propulsion design and disclosures as an empirical baseline (not a live data integration). |
| Next.js Framework (v16.4.6) | https://github.com/vercel/next.js | Runtime Code and Software | Core full-stack web application framework, App Router routing architecture, and edge API route orchestration (MIT License, Vercel, Inc.). |
| React & React DOM (v19.3.0) | https://github.com/facebook/react | Runtime Code and Software | Component state management, UI rendering, and reactive game loop execution (MIT License, Meta Platforms, Inc.). |
| Three.js WebGL 3D Engine (v0.187.0) | https://github.com/mrdoob/three.js | Runtime Code and Software | Real-time 3D spacecraft mesh generation, orbital integration gantry rendering, and interactive camera controls in the Vehicle Assembly Bay (MIT License, Ricardo Cabello). |
| Morphicons (v2.0.2) | https://github.com/morphicons/morphicons | Runtime Code and Software | Vector telemetry indicators, directional interface markers, and status feedback icons (MIT License). |
| Canvas-Confetti (v1.9.4) | https://github.com/catdad/canvas-confetti | Runtime Code and Software | Real-time particle physics celebratory effect on mission completion debrief (MIT License, Kiril Vatev). |
| TypeScript (v5.x) | https://github.com/microsoft/TypeScript | Development and Testing Tools | Type-safe mission architecture, astrodynamics interfaces, and API schema verification (Apache 2.0, Microsoft Corp.). |
| Tailwind CSS (v4.3.3) | https://github.com/tailwindlabs/tailwindcss | Development and Testing Tools | Custom typographical hierarchy, dark void styling, and responsive mission interface layout (MIT License, Tailwind Labs, Inc.). |
| Playwright Test Runner (v1.65.1) | https://github.com/microsoft/playwright | Development and Testing Tools | Automated end-to-end mission verification, Horizons API validation, and full-resolution screenshot/video capture (Apache 2.0, Microsoft Corp.). |
| Google Lighthouse (v13.6.0) | https://github.com/GoogleChrome/lighthouse | Development and Testing Tools | Performance, accessibility, responsive viewport, and web standards auditing (Apache 2.0, Google LLC). |
| Fraunces Typeface | https://github.com/undercasetype/Fraunces | Fonts and Typography | Variable display serif typeface used for mission titles, station headings, and historical quotes (SIL Open Font License 1.1, Undercase Type). |
| Instrument Sans Typeface | https://github.com/Instrument/Instrument-Sans | Fonts and Typography | Contemporary sans-serif used for mission briefings, dialog scripts, and narrative text (SIL Open Font License 1.1, Instrument). |
| Martian Mono Typeface | https://github.com/evilmartians/mono | Fonts and Typography | Monospaced technical font used for telemetry readouts, ephemeris coordinates, and mass/power budgets (SIL Open Font License 1.1, Evil Martians). |
| Web Audio API (W3C Standard) | https://www.w3.org/TR/webaudio/ | Procedural Audio | 100% original procedural sound synthesis engine: dual-oscillator cabin hum, filtered white-noise thrusters, and interface clicks (W3C Standard, zero third-party audio files). |
| Vercel Cloud Platform | https://vercel.com/ | Hosting & Infrastructure | Serverless edge hosting, automatic HTTPS certificate provisioning, and global distribution for https://tenth-light.vercel.app. |
| GitHub | https://github.com/sharmao07/tenth-light | Hosting & Infrastructure | Git version control repository hosting, issue tracking, and automated build triggering. |

---

## 2. Granular Resource Categorization & License Verification

Only resources actually utilized in the creation, execution, or verification of Tenth Light are documented below. All licenses have been verified from their original source repositories.

### A. Space Agency Mission Reference (Static Documentation)

#### JAXA IKAROS (Interplanetary Kite-craft Accelerated by Radiation Of the Sun)
* **Agency:** Japan Aerospace Exploration Agency (JAXA) / Institute of Space and Astronautical Science (ISAS)
* **Official URL:** [https://global.jaxa.jp/projects/sas/ikaros/](https://global.jaxa.jp/projects/sas/ikaros/)
* **Nature of Use:** **Documented Mission Reference / Engineering Benchmark** (Static citation).
* **Important Note:** This is **NOT** a live data integration, API connection, or downloaded dataset.
* **Actual Application in Project:**
  * Cited in the Vehicle Assembly Bay (VAB) and the Data Disclosures dossier (`app/data/page.tsx`) alongside NASA's ACS3 mission as an empirical baseline proving that solar radiation pressure can deploy and steer a spacecraft in deep space.
  * Serves as an educational contrast against the game's speculative 0.1c interstellar propulsion, teaching players the boundary between demonstrated technology and future concepts.
* **Removal of General Partner Agency List:** The generic list of 17 Space Apps partner space agencies previously acknowledged in descriptive notes has been removed from this submission document because the project did not ingest data or technical resources from those agencies.

---

### B. Runtime Code & Software Dependencies

All runtime dependencies are audited directly from `package.json` (`dependencies` block) and verified in `package-lock.json`:

1. **Next.js (`next: 16.4.6`)**
   * **Source Repository:** [https://github.com/vercel/next.js](https://github.com/vercel/next.js)
   * **License:** MIT License (Vercel, Inc.)
   * **Role:** Server-side React rendering, App Router dynamic routing, and edge API route handling for `/api/nasa/*`.
2. **React & React DOM (`react`, `react-dom: 19.3.0`)**
   * **Source Repository:** [https://github.com/facebook/react](https://github.com/facebook/react)
   * **License:** MIT License (Meta Platforms, Inc.)
   * **Role:** Declarative component rendering, React hooks (`useState`, `useEffect`, `useCallback`, `useRef`), and reactive game state execution.
3. **Three.js (`three: ^0.187.0`, `@types/three: ^0.187.0`)**
   * **Source Repository:** [https://github.com/mrdoob/three.js](https://github.com/mrdoob/three.js)
   * **License:** MIT License (Ricardo Cabello / mrdoob)
   * **Role:** Powers the real-time 3D Vehicle Assembly Bay canvas (`components/SpacecraftCanvas.tsx`), rendering procedural spacecraft meshes, wireframe scaffolds, and dynamic orbital camera controls.
4. **Morphicons (`morphicons: ^2.0.2`)**
   * **Source Repository:** [https://github.com/morphicons/morphicons](https://github.com/morphicons/morphicons)
   * **License:** MIT License
   * **Role:** Vector micro-icons for subsystem indicators, navigation arrows, and audio mute/unmute status buttons.
5. **Canvas-Confetti (`canvas-confetti: ^1.9.4`, `@types/canvas-confetti: ^1.9.0`)**
   * **Source Repository:** [https://github.com/catdad/canvas-confetti](https://github.com/catdad/canvas-confetti)
   * **License:** MIT License (Kiril Vatev)
   * **Role:** Renders particle physics celebratory burst upon successful scientific certification in the mission debriefing view (`components/EndingView.tsx`).

---

### C. Development & Testing Tools

Audited from `package.json` (`devDependencies` block):

1. **TypeScript (`typescript: ^5`)**
   * **Source Repository:** [https://github.com/microsoft/TypeScript](https://github.com/microsoft/TypeScript)
   * **License:** Apache 2.0 (Microsoft Corporation)
   * **Role:** Compile-time type safety across astrodynamics interfaces, ephemeris data models, and game store actions.
2. **Tailwind CSS (`tailwindcss: 4.3.3`, `@tailwindcss/turbopack: 4.3.3`)**
   * **Source Repository:** [https://github.com/tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
   * **License:** MIT License (Tailwind Labs, Inc.)
   * **Role:** Utility styling, layout grids, and CSS variable mapping (`--void`, `--paper`, `--signal`, `--surface`).
3. **Playwright Test Runner (`@playwright/test: ^1.65.1`)**
   * **Source Repository:** [https://github.com/microsoft/playwright](https://github.com/microsoft/playwright)
   * **License:** Apache 2.0 (Microsoft Corporation)
   * **Role:** Automated browser-based test suite verifying:
     * JPL Horizons 24-hour UTC rolling window ephemeris calculations and date-rollover formatting.
     * End-to-end mission flow from Departure to TOI-700 e.
     * Full-resolution screenshot and video capture.
4. **Google Lighthouse (`lighthouse: ^13.6.0`)**
   * **Source Repository:** [https://github.com/GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse)
   * **License:** Apache 2.0 (Google LLC)
   * **Role:** Performance, keyboard navigability, and WCAG AA contrast standards auditing.

---

### D. Typography & Web Fonts

Served locally via `next/font/google` under the **SIL Open Font License 1.1 (OFL)**:

1. **Fraunces**
   * **Source Repository:** [https://github.com/undercasetype/Fraunces](https://github.com/undercasetype/Fraunces)
   * **Designers:** Phaedra Charles and Flavia Zimbardi (Undercase Type)
   * **License:** SIL Open Font License 1.1
   * **Usage:** Variable display serif used for primary titles, planetary station titles ("Moon Station", "Enceladus Station"), and historical quotes.
2. **Instrument Sans**
   * **Source Repository:** [https://github.com/Instrument/Instrument-Sans](https://github.com/Instrument/Instrument-Sans)
   * **Designer:** Instrument (Jordan Fischer)
   * **License:** SIL Open Font License 1.1
   * **Usage:** Body sans-serif used for Specialist Wren's mission briefing, dialog scripts, and educational text.
3. **Martian Mono**
   * **Source Repository:** [https://github.com/evilmartians/mono](https://github.com/evilmartians/mono)
   * **Designer:** Evil Martians (Roman Shamin)
   * **License:** SIL Open Font License 1.1
   * **Usage:** Monospaced data font used for all numerical telemetry, subsystem mass/power readouts, JPL ephemeris tables, and clock displays.

---

### E. Procedural Audio Engine (100% Original Code)

* **Specification Standard:** W3C Web Audio API Recommendation ([https://www.w3.org/TR/webaudio/](https://www.w3.org/TR/webaudio/))
* **Implementation Source:** `components/AudioController.ts`
* **Originality Verification:**
  * **Zero External Audio Assets:** The repository contains zero `.mp3`, `.wav`, `.ogg`, or `.aac` audio files.
  * All soundscapes are synthesized at runtime using native browser audio nodes:
    * Starship Cabin Ambience: Dual harmonic sine-wave oscillators operating at $55\ \text{Hz}$ and $110\ \text{Hz}$ with low-frequency depth modulation.
    * Interface & Gate Clicks: Resonant bandpass filtered impulses at $880\ \text{Hz}$ and $1760\ \text{Hz}$.
    * Thruster Burns: Procedural white noise passed through a dynamic low-pass resonant filter.
  * Built-in accessibility caption listener (`addCaptionListener`) emits textual descriptions of audio events to screen readers.

---

### F. Hosting, Deployment & Infrastructure Services

1. **Vercel Cloud Platform**
   * **URL:** [https://tenth-light.vercel.app](https://tenth-light.vercel.app)
   * **Provider:** Vercel, Inc.
   * **Role:** Edge CDN deployment, automated HTTPS certificate management, and serverless API execution.
2. **GitHub**
   * **Repository:** [https://github.com/sharmao07/tenth-light](https://github.com/sharmao07/tenth-light)
   * **Provider:** GitHub, Inc. / Microsoft Corporation
   * **Role:** Git version control, source code hosting, and automated deployment triggering.
