# Screenshot captions

Captions and notes for the 13 gameplay screenshots in `submission-kit/screenshots/`, captured from `https://tenth-light.vercel.app/`.

---

### Screenshot 01: `01_title_screen.png`
Title screen with the specialist callsign input field and links to the mission logbook, demo deck, and scientific data page. Displays the mission rule: "Design the ship. Stay in the seat. Send the droid."

### Screenshot 02: `02_mission_briefing.png`
Mission briefing showing the departure protocol, an Apollo 17 photograph of Earth, and composite parameters from the NASA Exoplanet Archive for TOI-700 e and d. Establishes the distinction between optimistic and conservative habitable zones before players begin spacecraft assembly.

### Screenshot 03: `03_vab_spacecraft_3d.png`
Interactive Three.js WebGL viewport in the Vehicle Assembly Bay showing the modular spacecraft on its orbital integration gantry. Players rotate the camera to inspect attached stages, engines, propellant tanks, and communication dishes.

### Screenshot 04: `04_engineering_configuration_tradeoffs.png`
Subsystem configuration panel in the assembly bay showing mass limits, power draw, and teaching budget. Compares the lightweight Kite launcher (18 credits, 400 kg limit) against the heavy-lift Keel launcher (36 credits, 560 kg limit). The Kite cannot launch both a mass spectrometer and a core drill within its payload cap.

### Screenshot 05: `05_solar_system_mission_logbook.png`
Mission logbook modal tracking stops across the Solar System from departure to TOI-700 e. Each unlocked chapter includes Specialist Wren's personal log, Droid Nori's sensor telemetry, and historical mission context from Apollo, Dawn, Cassini, Voyager, and New Horizons.

### Screenshot 06: `06_moon_horizons_telemetry.png`
Stop 1 at Moon Station. Shows Apollo 11 surface photography at Tranquility Base alongside live topocentric coordinates from the JPL Horizons system for Earth observed from the lunar south pole (`coord@301`). The player aims the directional parabolic dish within a 14-degree beamwidth tolerance to clear the gate.

### Screenshot 07: `07_ceres_selection_puzzle.png`
Stop 3 at Ceres Station. Shows Dawn mission photography of Ceres and Occator crater alongside an active connection indicator for the JPL Small-Body Database API. The player identifies 1 Ceres by comparing its 939.4 km diameter against asteroids 4 Vesta and 2 Pallas.

### Screenshot 08: `08_jupiter_depot_defense.png`
Stop 4 at the Jupiter orbital propellant depot. Shows a Cassini cylindrical map of Jupiter alongside an arcade interceptor engagement where players clear three waves of incoming probes before docking to refuel propellant tanks to 7,200 m/s.

### Screenshot 09: `09_uranus_power_breakers.png`
Stop 6 at Uranus Station. Shows Voyager 2 imagery at 19.2 AU and a power bus load-balancing card. Solar irradiance falls off with the inverse-square law ($1/r^2$), dropping a 160 W solar panel down to ~0.43 W. Players must route power through nuclear RTG reserves to keep life support and computer systems alive.

### Screenshot 10: `10_neptune_light_travel_delay.png`
Stop 7 at Neptune Station. Shows Voyager 2 imagery of Neptune's Great Dark Spot at 30.1 AU. Demonstrates the speed of light by simulating a 7-second buffer representing the actual 4.17-hour round-trip delay. Sending a second signal while the first is in transit causes a packet collision and resets transmission.

### Screenshot 11: `11_harbor_sample_recovery_maze.png`
Stop 10 on the surface of TOI-700 e. Specialist Wren stays in orbit while Droid Nori traverses a 2D top-down surface maze, dodging automated hazards to collect water and soil sample canisters before returning through the recovery airlock.

### Screenshot 12: `12_mission_completion_debrief.png`
Mission debriefing screen. Shows the returned sample audit and Directorate verdict, which evaluates mission success based on which scientific instruments survived and whether certified samples were brought back.

### Screenshot 13: `13_nasa_data_scientific_disclosures.png`
The data disclosures page at `/data`. Documents the NASA and JPL endpoints used throughout the game, lists fallback snapshot dates, and outlines the honesty statement distinguishing flight-proven engineering from speculative 0.1c interstellar transit and unconfirmed exoplanet surface conditions.
