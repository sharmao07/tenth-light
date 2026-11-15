# Seven-slide presentation outline

This outline matches the 7-slide structure used for the NASA Space Apps Challenge submission deck and the interactive presentation at `/presentation`.

---

## Slide 1: Title and mission premise

- Title: Tenth Light
- Subtitle: NASA Space Apps Challenge 2026: Space Mission Design Game
- Core rule: "Design the ship. Stay in the seat. Send the droid."
- The setup: You play as flight specialist Wren, commanding an interstellar mission to TOI-700 e (Harbor), 101.5 light-years away. You stay inside the cabin while autonomous droid Nori handles hazardous surface sampling.

## Slide 2: Spacecraft assembly and engineering trade-offs

- Title: Systems engineering in the assembly bay
- Mass limits: The Kite launcher (18 credits, 400 kg limit) cannot carry both a spectrometer and a core drill into orbit. The Keel launcher (36 credits, 560 kg limit) carries both instruments at the expense of secondary budget.
- Delta-V budgeting: Patched-conic mission sizing requires at least 7,200 m/s across nine legs, demanding orbital refueling at Jupiter.
- Power dropoff: Solar irradiance follows the inverse-square law ($1/r^2$). At Uranus (19.2 AU), solar output drops to ~0.43 W per array, making a nuclear RTG necessary to keep life support and navigation online.

## Slide 3: Real NASA and JPL data integrations

- Title: Data sources and ephemerides
- NASA Exoplanet Archive: Ingests radius (0.919 Earth radii), mass (0.718 Earth masses), and equilibrium temperature (272.9 K) for TOI-700 e via TAP API sync.
- JPL Horizons: Uses live topocentric azimuth and elevation of Earth from a lunar south pole observer site (`coord@301`) to drive the dish alignment puzzle at Moon Station.
- JPL Small-Body Database: Pulls dimensions for 1 Ceres (939.4 km diameter) to test player identification against Dawn mission data.
- NASA NeoWs and imagery: Real asteroid hazard trajectories and public domain reconnaissance plates from Apollo, Dawn, Cassini, Voyager 2, and New Horizons.

## Slide 4: Journey through the Solar System

- Title: Flight route across the Solar System
- Stops 1 to 3: Lunar dish pointing, Mars cargo mass jettison, and Ceres dwarf planet classification.
- Stops 4 to 5: Jupiter orbital depot defense and refueling, followed by locating active south-polar geysers on Cassini Enceladus photography.
- Stops 6 to 9: Electrical load balancing at Uranus under solar dropoff, Neptune light delay buffer simulation, Pluto nitrogen glacier identification, and packet queuing at the heliopause.

## Slide 5: Surface mission at TOI-700 e

- Title: Surface exploration with Droid Nori
- The handoff: The spacecraft stays in orbit while Nori descends to the surface.
- Surface challenge: 2D maze where Nori dodges automated hazards, collects a security key, and retrieves water and soil sample canisters.
- Directorate evaluation: Mission debriefing assesses returned samples based on which scientific instruments survived the trip.

## Slide 6: Scientific honesty line

- Title: Separating science from narrative
- The mission statement: "Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive's numbers. The aliens, the depot fight, and the droid are the story."
- Interstellar travel time: Reaching 101.5 light-years at 0.1c takes approximately 1,015 years in Earth's reference frame. Accelerating macroscopic spacecraft to relativistic speeds remains an educational concept.
- Surface conditions: NASA TESS confirms size and orbit in the optimistic habitable zone, but surface water and soil remain unconfirmed. Canisters represent candidate biosignature simulants.

## Slide 7: Technical architecture and open source stack

- Title: Stack and project links
- Web technologies: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Three.js WebGL canvas for the 3D assembly bay.
- Procedural audio: Web Audio API synthesizes cabin hum, interface clicks, and thrusters at runtime without external audio downloads.
- Resilience: Browser `localStorage` holds save data with zero trackers, alongside dated snapshots for offline play.
- Links: Live deployment at `https://tenth-light.vercel.app` and source code at `https://github.com/sharmao07/tenth-light`.
