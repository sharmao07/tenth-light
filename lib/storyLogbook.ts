// Tenth Light - Mission Logbook & Specialist's Journal
// Award-winning narrative documentation for NASA Space Apps

export interface LogbookEntry {
  stopIndex: number;
  chapterTitle: string;
  locationName: string;
  realDistance: string;
  epigraph: string;
  specialistJournal: string;
  noriLog: string;
  historicalContext: string;
}

export const MISSION_LOGBOOK: Record<number, LogbookEntry> = {
  0: {
    stopIndex: 0,
    chapterTitle: "Act I: The Blue Cradle & The Metal Seed",
    locationName: "Earth (Cape Canaveral Launch Complex)",
    realDistance: "0.0 AU (Origin)",
    epigraph: "“To build a ship is to confess that an ocean is not a barrier, but an invitation.”",
    specialistJournal:
      "The straps across my flight suit are tight, smelling of clean nylon and fresh copper solder. Through the double-paned quartz porthole, Florida is an emerald smudge against a sapphire Atlantic. Nori’s internal gyroscope is already spooling up with a low, reassuring purr against the bulkhead. Everyone in the cleanroom told me: 'The specialist stays in the seat; the droid walks the cold ground.' They are right. My lungs belong to nitrogen-oxygen canisters. Nori’s optics belong to whatever starlight awaits us at the rim.",
    noriLog:
      "*chirp-whir-click* [Primary power bus: nominal. Gyro stabilization: locked. Thermal blankets: sealed. Diagnostic note: Specialist Wren’s resting pulse is 84 bpm. Elevated by 14% compared to baseline simulation. I have adjusted the cabin oxygen mix to compensate. Let us launch before Earth’s scientists change their minds about the mass spectrometer.]",
    historicalContext:
      "Tenth Light draws heritage from the Apollo Saturn V stack, the robotic Pioneer and Voyager lineages, and the modern commercial launch architectures that opened deep space transit.",
  },
  1: {
    stopIndex: 1,
    chapterTitle: "Act II: The Selenian Mirror",
    locationName: "The Moon (South Polar Aitken Basin)",
    realDistance: "0.00257 AU (~384,400 km)",
    epigraph: "“Every voyage into the infinite begins by glancing back at the dust we left behind.”",
    specialistJournal:
      "The Moon doesn't look like a stepping stone; it looks like an old watchmaker’s workbench, gray and pocked with four billion years of quiet hammer blows. When Lumen spoke, it was not sound through vacuum, but electromagnetic vibration resonating through our high-gain dish. Earth was hanging upside down in the black sky—so small I could cover every human city, every forest fire, and every ocean with my thumb. Aligning the antenna to Earth azimuth wasn't just orbital mechanics. It was tethering our leash.",
    noriLog:
      "*soft harmonic whistle* [JPL Horizons target 399 locked at 124° azimuth, 18° elevation. Offset within 1.2° tolerance. High-gain carrier signal confirmed. Telemetry return time: 1.28 seconds. Wren stared at Earth for 4 minutes without speaking. I refrained from sounding the low-fuel buzzer.]",
    historicalContext:
      "NASA’s Artemis program targets the lunar South Pole to extract water ice in permanently shadowed craters, serving as the staging ground for deep-space missions.",
  },
  2: {
    stopIndex: 2,
    chapterTitle: "Act III: The Crimson Ballast",
    locationName: "Mars (Low Orbit above Olympus Mons)",
    realDistance: "1.52 AU (~225 million km)",
    epigraph: "“The red desert forgives no excess. What you carry must keep you breathing or keep you learning.”",
    specialistJournal:
      "Redline came over the tactical frequency like dry static across iron filings. Nine kilograms over cap. In orbital mechanics, 9 kg is the difference between an aerocapture and a fiery streak across the Martian rust plains. Someone in logistics slipped an unauthorized souvenir crate into bay 3—pressed pine and brass trinkets. For three seconds, the flight manifest highlighted Nori’s secondary optical sensor as an alternate jettison candidate. Nori looked at me with her brass dome tilted, silent. I jettisoned the crate. Watching that box drift into the red dust storms below made me realize: out here, nostalgia has a mass penalty.",
    noriLog:
      "*indignant sequence of warbles, followed by relieved hum* [Mass reduction confirmed: -9.00 kg. Margin restored to 0.04%. Optical array remains 100% intact. I have recorded the trajectory of the discarded souvenir crate. It will enter the Martian atmosphere in 42 years. A fitting burial for unnecessary sentiment.]",
    historicalContext:
      "Mars has been explored by orbiters and rovers since Mariner 4 in 1965. Every gram sent to Mars requires exponential propellant on Earth due to Tsiolkovsky’s rocket equation.",
  },
  3: {
    stopIndex: 3,
    chapterTitle: "Act IV: The Quiet Belt",
    locationName: "1 Ceres (Main Asteroid Belt)",
    realDistance: "2.77 AU (~414 million km)",
    epigraph: "“Among billions of drifting pebbles, the giants are the ones that hold ancient ice.”",
    specialistJournal:
      "The asteroid belt in holovids is an impossible thicket of tumbling boulders. In reality, it is a vast, lonely cathedral of empty space. Pebble greeted us not as a threat, but as an archivist of rubble. Identifying Ceres wasn't a trivia exam—it was recognizing the first dwarf planet humankind ever visited. Dawn spent years spiraling into Ceres' gravity well, revealing the bright sodium carbonate salt deposits of Occator Crater. Out here, Ceres is a reservoir of water ice in a desert of stones.",
    noriLog:
      "*analytical trills* [Radar cross-section matched to 1 Ceres. Mean diameter: 939.4 km. Density: 2.16 g/cm³. Note: Dawn confirmed water vapor plumes and salty brine pockets here. Ceres and Pluto share the dwarf planet classification. Humans argued about the definition for decades; the rocks never cared.]",
    historicalContext:
      "NASA's Dawn mission (2007–2018) was the first spacecraft to orbit two extraterrestrial bodies (Vesta and Ceres), discovering that dwarf planets can host active subsurface geology.",
  },
  4: {
    stopIndex: 4,
    chapterTitle: "Act V: The Storm & The Anvil",
    locationName: "Jupiter Orbital Depot (Lagrange Point 2)",
    realDistance: "5.20 AU (~778 million km)",
    epigraph: "“Beneath the king of worlds, survival is measured in milliseconds and muzzle velocity.”",
    specialistJournal:
      "Jupiter filled three-quarters of the sky—a terrifying churning wall of amber, ochre, and radiation-poisoned white. The automated raiders struck as we cleared Io's orbital torus. Automated scrap drones, left over from some long-forgotten outer system mining war. Nori was screaming binary firing solutions into my headset as I slued the maneuvering thrusters. The ship shuddered with each plasma discharge. When the last saucer disintegrated into shimmering vapor, Bolt clamped onto our docking collar with a thunderous clunk that rattled the filings in my teeth. Refueled. We earned every liter of propellant.",
    noriLog:
      "*rapid high-pitch combat chirps fading into deep purr* [Point-defense lasers: 48 pulses fired. Hull integrity: preserved. Propellant tanks refilled to 7,200 m/s capacity. Bolt commented that Earthlings fight like angry terrestrial wasps. I believe that was a compliment in Jovian dialect.]",
    historicalContext:
      "Jupiter's intense radiation belts and massive gravitational well have assisted Voyager, Cassini, and New Horizons, acting as the primary gravity-assist gateway to the outer solar system.",
  },
  5: {
    stopIndex: 5,
    chapterTitle: "Act VI: The Breathing Ocean",
    locationName: "Enceladus (Saturnian System)",
    realDistance: "9.58 AU (~1.43 billion km)",
    epigraph: "“Through cracks in the ice, a hidden sea breathes its secrets into the void.”",
    specialistJournal:
      "Saturn's rings looked like spun phonograph grooves carved out of diamond dust. But it was tiny, brilliant white Enceladus that held our breath. Spray’s voice was like ice cracking on a winter lake. When we banked the ship toward the south pole, Cassini’s ghost felt very close. Those towering geysers—hundreds of kilometers of frozen water crystals erupting from the tiger stripes—glittered in the weak sunlight. There is an ocean down there, warm from tidal friction, dreaming in pitch blackness under twenty kilometers of ice.",
    noriLog:
      "*reverent, slow clicks* [Ion spectrometer sniffed the outer envelope of the south polar plume. Spectra: H2O vapor, nitrogen, methane, trace organic macromolecules, and sodium salts. pH estimated at 9–11. If life exists here, it has never seen a sunrise.]",
    historicalContext:
      "NASA's Cassini mission discovered in 2005 that Enceladus has active cryovolcanism at its south pole, with hydrothermal vents on its ocean floor that make it a prime candidate for astrobiology.",
  },
  6: {
    stopIndex: 6,
    chapterTitle: "Act VII: The Tilted Solitude",
    locationName: "Uranus (19.2 AU Deep System)",
    realDistance: "19.2 AU (~2.87 billion km)",
    epigraph: "“Here the sun is only a pale candle, and the thermodynamic law is law indeed.”",
    specialistJournal:
      "Uranus is a ghostly cyan marble rolling through the void on its side, tilted ninety-eight degrees. Sunlight here is less than 0.3% of what we felt at Earth. The cold seeped through the double hull like an invisible liquid. Tilt warned us: without an RTG, this is where missions die. I watched the power bus telemetry drop as the solar arrays faded to less than half a watt. We switched off the science imager, listening to the solid, rhythmic thrum of our radioisotope generator. The plutonium decay was our campfire in the deep frost. We kept the heater on; we kept the computer awake.",
    noriLog:
      "*chilled, steady ticking* [Thermal bus stabilized at 55 W. Command module: 20W. Antenna: 15W. Bus heater: 20W. External temperature: 49 Kelvin (-224°C). The solar arrays are now decorative wings. The RTG core is keeping Wren’s cabin above freezing. Good machine. Sturdy isotopes.]",
    historicalContext:
      "Voyager 2 is the only spacecraft to have visited Uranus (January 1986). At 19.2 AU, solar flux follows the inverse-square law (1/r²), making nuclear power (RTGs) mandatory for survival.",
  },
  7: {
    stopIndex: 7,
    chapterTitle: "Act VIII: The Echo of Time",
    locationName: "Neptune (30.1 AU Kuiper Horizon)",
    realDistance: "30.1 AU (~4.50 billion km)",
    epigraph: "“Distance is not miles; distance is the wait between a question and its answer.”",
    specialistJournal:
      "Neptune was cobalt blue, with wisps of white methane clouds streaking across the Great Dark Spot at supersonic speeds. Lag spoke in drawn-out, echoing cadences. Out here, light itself takes over four hours to travel back to the ears that love us on Earth. Seven seconds in our simulation felt like an eternity. If I panicked and double-tapped the uplink key, the signal collision would reset the buffer. I sat with my hands folded, listening to Nori count down each second. You cannot rush the speed of light.",
    noriLog:
      "*rhythmic metronome pinging* [Simulated packet transit delay: 7.000 seconds. Equivalent to 4.17 hours real one-way propagation. Signal verified without collision. Wren kept her hands off the console as instructed. Patience is an unnatural evolutionary trait for primates; she is learning.]",
    historicalContext:
      "Neptune orbits at 30.1 AU. Voyager 2 passed it in August 1989. Radio signals traveling at 300,000 km/s take approximately 4 hours and 10 minutes to reach Earth.",
  },
  8: {
    stopIndex: 8,
    chapterTitle: "Act IX: The Heart in the Deep Frost",
    locationName: "Pluto & Charon (39.5 AU)",
    realDistance: "39.5 AU (~5.91 billion km)",
    epigraph: "“Even at the ragged fringe of starlight, a world can wear a heart of nitrogen ice.”",
    specialistJournal:
      "When New Horizons flew past Pluto in 2015, humankind expected a dead, cratered ball of dirty ice. Instead, we found young mountains of water ice as steep as the Rockies, and Tombaugh Regio—a vast, convecting glacier of frozen nitrogen shaped uncannily like a heart. Heart’s voice in our comms was playful, almost tender. She reminded us of the central tenet of planetary science: 'A photograph is not a soil sample.' You can look at starlight forever, but until a drill touches the rock and a spectrometer tastes the vapor, you only have pictures, not proof.",
    noriLog:
      "*warm melodic trill* [Target locked: Tombaugh Regio ❤️. Nitrogen ice convection cells mapped. Cthulhu Macula bypassed. Calibration check: The sample drill and mass spectrometer are verified for Harbor touchdown. Photographs build dreams; drills build archives.]",
    historicalContext:
      "NASA’s New Horizons arrived at Pluto in July 2015 after a 9.5-year voyage, revealing active cryo-geology, nitrogen glaciers, and a complex atmosphere at nearly 40 AU.",
  },
  9: {
    stopIndex: 9,
    chapterTitle: "Act X: The Boundary of the Sun",
    locationName: "The Heliopause (Terminal Shock Boundary)",
    realDistance: "122 AU (~18.25 billion km)",
    epigraph: "“Here the sun’s breath ceases, and the true dark begins.”",
    specialistJournal:
      "One hundred and twenty-two astronomical units. August 2012—that was when Voyager 1 crossed this line, leaving the heliosphere and entering the interstellar medium. Out here, the solar wind stops. The magnetic field of the Sun yields to the galactic wind of distant supernovae. Whisper stood at the threshold like a veil between epochs. Before jumping our simulation across the 100-light-year void to TOI-700 e, we had to seal our priorities. Science first: water and soil readings. Then power and navigation logs. And only then, the digital postcard back to Earth. In the dark, order is sanity.",
    noriLog:
      "*deep resonant pulse* [Heliopause boundary crossed. Solar wind density: near zero. Interstellar cosmic ray flux: increased by 380%. Transmission queue confirmed: 1. Sample Data → 2. Nav Log → 3. Postcard. Ahead lies the 101.5 light-year simulation jump to TOI-700. We are leaving the Sun behind.]",
    historicalContext:
      "Voyager 1 officially crossed the heliopause into interstellar space on August 25, 2012, at a distance of 121.6 AU, becoming humankind’s first interstellar emissary.",
  },
  10: {
    stopIndex: 10,
    chapterTitle: "Act XI: Harbor in the Silence",
    locationName: "TOI-700 e (Harbor, 31.13 parsecs out)",
    realDistance: "101.5 light-years (NASA Exoplanet Archive)",
    epigraph: "“No trumpets sounded. No alien banners waved. Only ancient soil, and a droid walking into the wind.”",
    specialistJournal:
      "One hundred and one point five light-years from Cape Canaveral. TOI-700 e—Harbor. The sky above is unfamiliar; the constellations are twisted into shapes no human poet ever named. Harbor is completely, reverently silent. The hatch stayed shut. The atmosphere outside is unbreathable, the pressure alien, the temperature 272.9 Kelvin—just hovering around the freezing point of water. I watched through the panoramic camera as the airlock cycling lights went green. Nori rolled down the ramp onto the regolith. A small metal droid carrying humankind’s curiosity. She found the key, opened the ancient maze, and retrieved the water and soil cylinders. When she climbed back into the airlock with frost clinging to her optical turret, I felt tears in my visor. We did it.",
    noriLog:
      "*proud, triumphant brassy fanfare* [Sample extraction complete. 2 canisters of liquid water ice cores secured. 2 canisters of silicate mineral regolith locked in sleeve. Surface temperature: 272.9 K. Equilibrium confirmed. Airlock pressurized. Specialist Wren, we have the archive proof. Plot our burn for home.]",
    historicalContext:
      "TOI-700 e was discovered in 2023 by NASA’s Transiting Exoplanet Survey Satellite (TESS). It is an Earth-sized world (0.92 Earth radii) orbiting an M-dwarf star in the habitable zone where liquid water could exist on its surface.",
  },
};
