# Seven-slide presentation deck

Slide content, numbers, layouts, and speaker notes for `submission-kit/Tenth-Light-NASA-Space-Apps-2026.pptx`.

---

## Slide 1: Title and challenge premise

- Title: Tenth Light
- Subtitle: NASA Space Apps Challenge 2026: Space Mission Design Game
- Rule: "Design the ship. Stay in the seat. Send the droid."
- Team: Team Tenth Light (Lead: Ojus Sharma)
- Links: [tenth-light.vercel.app](https://tenth-light.vercel.app) | [github.com/sharmao07/tenth-light](https://github.com/sharmao07/tenth-light)
- Points:
  - An educational mission simulator pairing engineering trade-offs with NASA archival data and narrative stops.
  - Destination: TOI-700 e (Harbor), an Earth-sized exoplanet in the habitable zone, 101.5 light-years away.
  - Mission structure: Specialist Wren stays inside the pressurized cabin while autonomous droid Nori collects samples on the surface.
- Speaker notes:
  > Tenth Light was built for the 2026 NASA Space Apps Challenge in the Space Mission Design Game track. Our rule is simple: design the ship, stay in the seat, send the droid. Players balance real systems trade-offs in the assembly bay, navigate nine planetary stops using NASA data, and collect samples on an exoplanet 101.5 light-years away.

---

## Slide 2: Systems engineering trade-offs

- Title: The mission: systems engineering trade-offs
- Subtitle: Why space mission design requires hard choices
- The challenge:
  - Deep-space missions have tight margins. Payload mass, launcher limits, solar irradiance dropoff, and delta-V dictate what is possible.
  - When you spend mass on a heavier rocket or spare fuel, you have less budget for instruments.
- What Tenth Light simulates:
  - The sealed cabin: Humans cannot walk unprotected on cryogenic, high-radiation worlds, so surface exploration relies on autonomous robotic probes.
  - Delta-V budgeting: Sizing a patched-conic transit requiring 7,200+ m/s across nine stops teaches staging and the need for orbital refueling.
  - Mass limits: If your rocket can only lift 400 kg, carrying a drill means leaving a spectrometer behind.
- Speaker notes:
  > Slide 2 sets up the core problem. Space mission design is an exercise in balancing constraints. Tenth Light models four limits: mass margins, power availability, financial budget, and delta-V. Every choice in the assembly bay affects the mission downstream across nine planetary legs.

---

## Slide 3: The Vehicle Assembly Bay

- Title: Spacecraft assembly
- Subtitle: Modular 3D assembly and budget trade-offs
- Subsystem options:
  - Launchers: Kite booster (18 credits, 400 kg payload limit, low cost but forces instrument cuts) vs. Keel booster (36 credits, 560 kg payload limit, high cost but carries full science payload).
  - Propulsion: Hydrazine monopropellant for high immediate thrust vs. Hall-effect electric ion propulsion for high specific impulse with low thrust and high electrical draw.
  - Electrical power: UltraFlex solar arrays (160 W at Earth, dropping to 0.43 W at Uranus) vs. a nuclear RTG (constant wattage independent of solar distance).
  - Scientific payload: Infrared mass spectrometer (18 kg) for water detection and percussive core drill (32 kg) for regolith. Leaving either behind limits sample certification on Earth return.
- Speaker notes:
  > In the Vehicle Assembly Bay, players build their ship in an interactive 3D WebGL viewport. Each part updates mass, power draw, and cost. If you rely purely on solar arrays to save money, your systems freeze at Uranus where solar flux drops by a factor of 368. If you choose the cheaper Kite rocket, you have to decide whether to leave behind the drill or the spectrometer.

---

## Slide 4: Exploring the Solar System

- Title: Solar System transit
- Subtitle: Nine planetary stops grounded in real astrodynamics
- Stops:
  - Stop 1 (Moon): Align antenna azimuth to Earth using live JPL Horizons coordinates.
  - Stop 2 (Mars): Aerobraking insertion and cargo jettison under mass limits.
  - Stop 3 (Ceres): Asteroid belt puzzle identifying 1 Ceres (939.4 km) from Dawn mission data.
  - Stop 4 (Jupiter Depot): Orbital interceptor sequence followed by propellant refueling.
  - Stop 5 (Enceladus): Locating active south-polar cryovolcanic geysers on Cassini imagery.
  - Stops 6 and 7 (Uranus and Neptune): Balancing electrical breakers under solar dropoff, followed by a simulated 7-second buffer representing the 4.17-hour light lag at Neptune.
  - Stops 8 and 9 (Pluto and Heliopause): Identifying nitrogen glaciers at Tombaugh Regio, followed by packet queue ordering at the 122 AU boundary.
- Meme note:
  - Flork placard: "A photograph is NOT a soil sample!" Reminding players why remote flybys cannot substitute for ground sampling.
- Speaker notes:
  > Slide 4 covers the flight path through the Solar System. Rather than abstract levels, each stop is a physics or data puzzle. Players align dishes with JPL Horizons, balance breakers at Uranus under severe solar dropoff, and deal with light-travel delays at Neptune. The Flork sign makes an important point: orbital photos cannot tell you soil composition; you have to collect physical samples.

---

## Slide 5: NASA and JPL data integrations

- Title: NASA data integrations
- Subtitle: Live API queries, ephemerides, and public domain archives
- Data sources:
  - NASA Exoplanet Archive (TAP API): Loads radius (0.919 Earth radii), mass (0.718 Earth masses), insolation (1.27), and equilibrium temperature (272.9 K) for TOI-700 e.
  - JPL Horizons Ephemeris: Computes live topocentric Earth azimuth and elevation from the lunar south pole (`coord@301`) across a rolling 24-hour UTC window.
  - JPL Small-Body Database: Supplies orbital parameters and diameter (939.4 km) for 1 Ceres.
  - NASA NeoWs and DSCOVR EPIC: Near-Earth hazard parameters and calibrated natural-color Earth imagery.
  - Planetary photography: Public domain plates from Apollo 11, Dawn, Cassini, Voyager 2, and New Horizons.
- Offline resilience:
  - Dated snapshots act as fallbacks if API requests time out, keeping the simulation fully functional offline.
- Speaker notes:
  > Tenth Light uses verified astronomical data. The target, TOI-700 e, is queried directly from the NASA Exoplanet Archive TAP API. The lunar dish alignment puzzle uses real-time pointing angles from JPL Horizons. If the network is unavailable, dated snapshots ensure the game works reliably without fabricating values.

---

## Slide 6: Mission destination: Harbor (TOI-700 e)

- Title: Harbor: TOI-700 e
- Subtitle: Surface robotics and scientific honesty
- Surface sampling:
  - Autonomous Droid Nori: Deployed to the surface of TOI-700 e to navigate a 2D maze, avoid automated hazards, and retrieve water and soil canisters.
  - Directorate debriefing: Evaluates returned samples based on which instruments survived the voyage in the player's original spacecraft build.
- Scientific disclosures:
  - Speculative propulsion: Traveling 101.5 light-years at 0.1c takes about 1,015 years in Earth's reference frame. Solar sails and ion engines have flown in space, but 0.1c macroscopic flight remains an educational scenario.
  - Unconfirmed surface: TESS transit photometry confirms size and orbit in the optimistic habitable zone, but surface water and atmosphere remain unconfirmed. Canisters represent candidate biosignature simulants.
- Meme note:
  - Drake meme: Contrasting remote habitability guesses against physical regolith sampling by Droid Nori.
- Speaker notes:
  > Slide 6 covers our arrival at TOI-700 e. Specialist Wren remains in orbit while Droid Nori lands to collect regolith and water samples. We make our assumptions clear: reaching 101.5 light-years at 0.1c takes about 1,015 years in Earth's reference frame. While solar sails and ion drives have flown in space, 0.1c travel is speculative. And because surface conditions are unconfirmed by current telescopes, the samples are treated as candidate simulants.

---

## Slide 7: Technical architecture and links

- Title: Architecture, accessibility, and links
- Subtitle: Open source web stack and deployment
- Technical features:
  - Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Three.js WebGL canvas.
  - Procedural Web Audio API sound synthesis without downloaded audio files.
  - Zero cookies, no analytics tracking, client-side persistence via `localStorage`.
  - Accessible design: keyboard controls, audio captions, and reduced-motion support.
- Links:
  - Play the game: [tenth-light.vercel.app](https://tenth-light.vercel.app)
  - Source code: [github.com/sharmao07/tenth-light](https://github.com/sharmao07/tenth-light)
- Speaker notes:
  > Tenth Light runs entirely in modern web browsers without external plugins or installs. Built with Next.js 16, React 19, and procedural Web Audio, the game loads quickly and tracks zero user data. You can play the live build at tenth-light.vercel.app and review the full source code on GitHub. Thank you.
