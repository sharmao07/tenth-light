# Project summary and facts

NASA Space Apps Challenge 2026: Space Mission Design Game  
Project: Tenth Light  
Target destination: TOI-700 e (Harbor), 101.5 light-years from Earth

## Systems engineering in the assembly bay

The Vehicle Assembly Bay introduces engineering trade-offs where choosing one capability requires giving up another:

1. Launch mass and launcher limits:
   The Kite launcher costs 18 credits and caps payload at 400 kg. It cannot launch both a mass spectrometer and a core drill. The Keel launcher costs 36 credits and raises the cap to 560 kg, fitting both instruments at the cost of secondary systems.
2. Propellant and delta-V sizing:
   Sized with a patched-conic mission profile. Each propellant tank provides 2,400 m/s of vacuum delta-V. Clearing nine transit legs takes at least 7,200 m/s, requiring three tanks and an orbital refueling rendezvous at the Jupiter Depot.
3. Thermal and electrical power budget:
   Solar irradiance drops according to the inverse-square law ($1/r^2$). Past Jupiter, maintaining the 55 W power bus (avionics heater, computer, and antenna) requires a nuclear Radioisotope Thermoelectric Generator (RTG).

## NASA and JPL data integration

- NASA Exoplanet Archive: Ingests composite planetary parameters (`pscomppars` table via TAP API) for TOI-700 e (radius 0.919 Earth radii, mass 0.718 Earth masses, orbital period 27.81 days, equilibrium temperature 272.9 K) and sister planet TOI-700 d.
- JPL Horizons Ephemeris: Calculates topocentric azimuth and elevation of Earth viewed from a lunar south pole observer site (`coord@301`), requiring antenna dish alignment within 14 degrees.
- JPL Small-Body Database: Validates dimensions and classification of 1 Ceres (939.4 km diameter) from NASA Dawn mission measurements.
- NASA NeoWs API: Uses real near-Earth asteroid parameters (Apophis, Bennu, Ryugu, Toutatis) to generate obstacle speeds and sizes.
- NASA Image and Video Library: Serves public domain photographic plates from Apollo 11, Mars Global Surveyor, Dawn, Cassini, Voyager 2, and New Horizons.

## Learning objectives across mission stops

| Stop | Location | Subject | Game mechanic |
| :--- | :--- | :--- | :--- |
| 00 | VAB Cape Canaveral | Payload mass fraction and delta-V budgets | Rocket assembly and budget limits |
| 01 | Moon (Lumen) | Topocentric pointing and radio beamwidth | JPL Horizons antenna dish alignment |
| 02 | Mars (Redline) | Orbital capture mass limits and margins | Airlock cargo ejection |
| 03 | Ceres (Pebble) | Asteroid belt dimensions and taxonomy | JPL SBDB diameter lookup |
| 04 | Jupiter Depot (Bolt) | Orbital refueling and gravitational staging | Arcade defense sequence and propellant refuel |
| 05 | Enceladus (Spray) | Cryovolcanism and hydrothermal plumes | Targeting active geysers on Cassini imagery |
| 06 | Uranus (Tilt) | Inverse-square law and power margins | Breaker load balancing under solar deficit |
| 07 | Neptune (Lag) | Speed-of-light communications latency | 7-second buffer simulating 4.17-hour delay |
| 08 | Pluto (Heart) | Planetary geomorphology and ground truth | Locating Tombaugh Regio |
| 09 | Heliopause (Whisper) | Interstellar boundaries and queue priority | Transmission packet sequence ordering |
| 10 | Harbor (TOI-700 e) | Autonomous robotic surface sampling | 2D probe recovery maze with Droid Nori |

## Simplifications vs. real physics

To keep gameplay approachable while teaching the core physics, several mechanics are simplified:

1. Astrodynamics: Uses patched-conic delta-V allowances (2,400 m/s per tank) instead of n-body numerical integration.
2. Radio latency: Neptune's actual 4.17-hour one-way light delay is simulated via a 7-second buffer to convey latency without stalling gameplay.
3. Electrical loads: Subsystems use grouped wattages (computer 20 W, heater 20 W, radio 15 W) to teach power management clearly.

## Scientific disclosures

### Interstellar travel speed and duration
- Distance: 101.5 light-years (31.13 parsecs)
- Speed: 0.1c (~30,000 km/s)
- Travel duration: In Earth's reference frame, traveling 101.5 light-years at 0.1c takes about 1,015 years.
- Technology status: Solar radiation pressure (JAXA IKAROS, NASA ACS3) and ion drives (Dawn, Deep Space 1) have flown in space. Accelerating a macroscopic spacecraft to 0.1c is not possible with current technology and is used here as an educational scenario.

### TOI-700 e surface conditions
- Confirmed facts: NASA TESS transit photometry confirms the 27.81-day orbit, 0.919 Earth radius, and optimistic habitable zone placement.
- Unconfirmed facts: No existing telescope has confirmed whether TOI-700 e has an atmosphere, surface water, or soil.
- Simulants: The sample canisters collected by Droid Nori are treated as candidate biosignature simulants.

## Stack, development, and credits

- Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Three.js, Web Audio API, Playwright.
- Storage: Saves live in browser `localStorage` under `tenth-light-v1`. No cookies or server tracking.
- AI-assisted development: Developed using AI coding assistants (Google DeepMind Antigravity, Claude, Gemini) for code drafting and tests. Game rules, formulas, and data integrations were verified by the team.
- Assets: NASA public domain plates under 17 U.S.C. § 105. Fonts licensed under the SIL Open Font License 1.1.
