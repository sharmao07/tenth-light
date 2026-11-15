import { DialogueLine, SpeakerId } from './gameTypes';

export function getBriefingLines(callsign: string): DialogueLine[] {
  return [
    {
      speaker: 'narrator',
      speakerName: 'Mission Control',
      text: `Telemetry link established. Cape Canaveral uplink confirmed. Callsign registered: ${callsign}. Mission: Tenth Light.`,
    },
    {
      speaker: 'wren',
      speakerName: callsign,
      text: 'Console is green. Through the quartz porthole, the Atlantic is a ribbon of blue glass. Nori, run the bus diagnostics and check the antenna gimbal.',
    },
    {
      speaker: 'nori',
      speakerName: 'Nori',
      text: '*chirp-whir-click* [All primary relays online. The specialist stays in the seat; the droid walks the cold ground. That was our vow in the cleanroom.]',
    },
    {
      speaker: 'wren',
      speakerName: callsign,
      text: 'Our target is TOI-700 e, nicknamed Harbor. 101.5 light-years out. Planetary science wants certified water and soil readings.',
    },
    {
      speaker: 'nori',
      speakerName: 'Nori',
      text: '*trill-bzzzt* [Do not confuse it with outer twin d. Stop 0 is Earth; Harbor is stop 10. Check the archive parameters before we bolt the hull: 0.919 Earth radii, 272.9 Kelvin.]',
    },
    {
      speaker: 'wren',
      speakerName: callsign,
      text: 'Ten stops across our solar system and beyond the heliopause. If our delta-v runs dry, or the cold takes the bus at Uranus, we scrub back to the hangar.',
    },
    {
      speaker: 'nori',
      speakerName: 'Nori',
      text: '*confident brassy chime* [Then let us build a ship worthy of the starlight. The hangar cranes are ready, Specialist.]',
    },
  ];
}

export const STOP_DIALOGUES: Record<number, { before: DialogueLine[]; success: DialogueLine[] }> = {
  1: {
    // Moon - Lumen
    before: [
      {
        speaker: 'lumen',
        speakerName: 'Lumen (Lunar Gatekeeper)',
        text: 'Travelers from the blue cradle. Before you leave the Moon, glance back at the world you call home. Every journey into the infinite begins by securing your line to the shore.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*whir-click* [JPL Horizons coordinate 301 at the south pole; target 399 Earth. We must align the high-gain dish within 14 degrees to maintain telemetry.]',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Earth hangs so small above the gray craters. Aligning dish to Earth azimuth now. Watching elevation as well.',
      },
    ],
    success: [
      {
        speaker: 'lumen',
        speakerName: 'Lumen (Lunar Gatekeeper)',
        text: 'Lock confirmed. Earth hears your heartbeat loud and clear across the vacuum. The lunar corridor stands open.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*triumphant chirp!* [Telemetry link locked. The umbilical to home is secure. Burning for Mars.]',
      },
    ],
  },
  2: {
    // Mars - Redline
    before: [
      {
        speaker: 'redline',
        speakerName: 'Redline (Mars Gatekeeper)',
        text: 'Hold your burn! The red desert forgives no excess. You are exactly 9 kg over your insertion mass cap. Jettison ballast or burn up in the thin atmosphere.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Wait—someone in the cleanroom stowed an unauthorized souvenir crate in the equipment bay!',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*indignant bleep-buzz!* [Drop the souvenir! Do NOT drop my optical array! Out here, nostalgia has a mass penalty, Specialist!]',
      },
    ],
    success: [
      {
        speaker: 'redline',
        speakerName: 'Redline (Mars Gatekeeper)',
        text: 'Mass margin restored. 9 kg souvenir crate ejected into parking orbit. Vector clear for the quiet belt.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Good catch, Nori. Ballast is gone. Engaging chemical engine toward the asteroids.',
      },
    ],
  },
  3: {
    // Ceres - Pebble
    before: [
      {
        speaker: 'pebble',
        speakerName: 'Pebble (Belt Gatekeeper)',
        text: 'I watch the billions of drifting stones in the main belt. Name the giant among our pebbles—the one NASA Dawn orbited in the dark.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Three candidates in the database: Ceres, Vesta, and Pallas. Dawn orbited the largest diameter, where bright salt deposits gleam.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*analytical chimes* [Remember: Ceres and Pluto are dwarf planets, not mere asteroids. The small worlds hold ancient water.]',
      },
    ],
    success: [
      {
        speaker: 'pebble',
        speakerName: 'Pebble (Belt Gatekeeper)',
        text: '1 Ceres it is. 939 kilometers of rock and salt-ice. The corridor to Jupiter opens before you.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Delta-v is holding. Setting course for the Jupiter orbital depot.',
      },
    ],
  },
  4: {
    // Jupiter - Ambush then Bolt
    before: [
      {
        speaker: 'narrator',
        speakerName: 'Proximity Radar',
        text: 'WARNING! Unidentified alien defense saucers approaching in battle formation above the Great Red Spot! Weapons hot!',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Ambush at the depot! Nori, man the point defense lasers! Evade their salvoes!',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*rapid combat chirps and combat beeps!* [Sliding horizontal thrusters! Clear all three waves to reach the fueling clamp!]',
      },
    ],
    success: [
      {
        speaker: 'bolt',
        speakerName: 'Bolt (Depot Stationmaster)',
        text: 'Magnificent shooting, Earthlings! You fought like angry wasps above the radiation storms. Dock at clamp 4.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Requesting refuel. Our propellant tanks are dry after clearing the inner solar system.',
      },
      {
        speaker: 'bolt',
        speakerName: 'Bolt (Depot Stationmaster)',
        text: 'Tanks refueled to capacity. No extra parts added. 7,100 m/s will carry you through the outer rim.',
      },
    ],
  },
  5: {
    // Enceladus - Spray
    before: [
      {
        speaker: 'spray',
        speakerName: 'Spray (Saturnian Gatekeeper)',
        text: 'You approach the ringed jewel. Enceladus hides a warm ocean beneath twenty kilometers of ice. Show me where life breathes into space.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Cassini flew through these very plumes. The cryovolcanic water vapor jets emerge from the south polar tiger stripes.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*reverent humming clicks* [Point sensor reticle directly at the South Polar ice vents. Salty vapor in the black.]',
      },
    ],
    success: [
      {
        speaker: 'spray',
        speakerName: 'Spray (Saturnian Gatekeeper)',
        text: 'Direct hit on the vapor plume. Salt grains and organic molecules recorded. Pass onward into the deep frost.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Plume spectra recorded. Preparing bus heaters for the freeze of Uranus.',
      },
    ],
  },
  6: {
    // Uranus - Tilt
    before: [
      {
        speaker: 'tilt',
        speakerName: 'Tilt (Ice Giant Gatekeeper)',
        text: 'At 19.2 AU, sunlight is a pale candle. The inverse-square law drops solar flux below half a watt. Without an RTG, this is where travelers freeze.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'The alive bus requires 55 W minimum: Command (20W) + Antenna (15W) + Heater (+20W). Plutonium decay is our campfire.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*tense bleeps* [Balance the breakers! If total draw exceeds supply, switch off the imager! Without the RTG, we become ice.]',
      },
    ],
    success: [
      {
        speaker: 'tilt',
        speakerName: 'Tilt (Ice Giant Gatekeeper)',
        text: 'Core bus stable. The ship breathes warm in the cold tomb of Uranus. You have mastered thermodynamic reality.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Systems green. RTG is humming. Setting course for Neptune.',
      },
    ],
  },
  7: {
    // Neptune - Lag
    before: [
      {
        speaker: 'lag',
        speakerName: 'Lag (Outer Guard)',
        text: 'Distance... thirty... point... one... AU. Light... takes... four... hours... to... cross... this... gulf. In... the... dark... patience... is... law.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'One command, then wait. A second command during transit will collide and cause reset.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*measured slow ticks* [Send one ping. Hold completely still for 7 seconds. You cannot rush the speed of light.]',
      },
    ],
    success: [
      {
        speaker: 'lag',
        speakerName: 'Lag (Outer Guard)',
        text: 'Signal... acknowledged. Clear... passage... to... the... Kuiper... realm.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Command verified. Burning toward Pluto.',
      },
    ],
  },
  8: {
    // Pluto - Heart
    before: [
      {
        speaker: 'heart',
        speakerName: 'Heart (Plutonian Spirit ❤️)',
        text: 'Welcome to the Kuiper Belt! Even at the ragged fringe of starlight, a world can wear a heart of nitrogen ice. Mark my bright frozen heart, not the scorched plains.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Tombaugh Regio—the vast nitrogen glacier shaped like a heart.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*gentle chirping* [Target the heart ❤️. Remember: a photograph is not a soil sample. That is why we carry drills!]',
      },
    ],
    success: [
      {
        speaker: 'heart',
        speakerName: 'Heart (Plutonian Spirit ❤️)',
        text: 'You found my heart! May your voyage into the interstellar void carry the warmth of human curiosity.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Pluto cleared. Pushing toward the Heliopause boundary.',
      },
    ],
  },
  9: {
    // Heliopause - Whisper
    before: [
      {
        speaker: 'whisper',
        speakerName: 'Whisper (Heliopause Sentinel)',
        text: 'At 122 AU, the solar wind halts. You stand where Voyager 1 crossed in 2012, entering the ocean of night. Before you jump to Harbor, lock your return protocol.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Science protocol priority: 1. Water and soil readings, 2. Power and navigation log, 3. Postcard.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*whirring confirmation* [Order matters. In the deep dark, discipline is our shield. Ahead lies TOI-700 e.]',
      },
    ],
    success: [
      {
        speaker: 'whisper',
        speakerName: 'Whisper (Heliopause Sentinel)',
        text: 'Protocol sealed. You leave the Sun behind. Ahead lies TOI-700 e—Harbor. May the silence treat you gently.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Initiating interstellar transit simulation. Harbor, here we come.',
      },
    ],
  },
  10: {
    // Harbor - Silent
    before: [
      {
        speaker: 'narrator',
        speakerName: 'Harbor Orbit',
        text: 'Arrival at TOI-700 e (Harbor). 101.5 light-years from Earth. Harbor is completely, reverently silent. The hatch stays shut. Nori prepares the sample sleeve.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Harbor is silent. No alien welcome, no fanfare. Just ancient winds and cold starlight. Nori, deploy the sample sleeve. Retrieve water and soil samples.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*solemn, determined clicks* [The specialist stays in the seat; the droid walks the cold ground. I will bring back the proof, Wren. Watch my telemetry.]',
      },
    ],
    success: [
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*triumphant fanfare chirps!* [Sample canisters locked in sleeve! Pristine water ice and mineral regolith retrieved! Returning through docking airlock!]',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Airlock cycling... air seal intact! Welcome back inside, Nori. We have the proof. Setting trajectory for Earth. We are going home.',
      },
    ],
  },
};
