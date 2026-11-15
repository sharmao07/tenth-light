import { DialogueLine, SpeakerId } from './gameTypes';

export function getBriefingLines(callsign: string): DialogueLine[] {
  return [
    {
      speaker: 'narrator',
      speakerName: 'Mission Control',
      text: `Deep Space Telemetry Link established. Callsign registered: ${callsign}. Mission: Tenth Light.`,
    },
    {
      speaker: 'wren',
      speakerName: callsign,
      text: 'Console is green. Nori, run the bus diagnostics and check the antenna gimbal.',
    },
    {
      speaker: 'nori',
      speakerName: 'Nori',
      text: '*chirp-whir-click* [All primary relays online. The specialist stays in the seat; the droid walks the cold ground.]',
    },
    {
      speaker: 'wren',
      speakerName: callsign,
      text: 'Our target is TOI-700 e, designated Harbor. 101.5 light years out. Science wants certified water and soil readings.',
    },
    {
      speaker: 'nori',
      speakerName: 'Nori',
      text: '*trill-bzzzt* [Do not confuse it with twin d. Stop 0 is Earth; Harbor is stop 10. Check the archive parameters before we bolt the hull.]',
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
        text: 'Travelers from the blue cradle. Before you clear the Moon, lock your high-gain dish to Earth azimuth from this polar site.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*whir-click* [Horizons coordinate 301, target 399. We need to align within 14 degrees to maintain telemetry.]',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Aligning dish to Earth azimuth now. Watching elevation as well.',
      },
    ],
    success: [
      {
        speaker: 'lumen',
        speakerName: 'Lumen (Lunar Gatekeeper)',
        text: 'Lock confirmed. Earth hears your ping loud and clean. The lunar corridor stands open.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*triumphant chirp!* [Telemetry link locked. Vector open to Mars.]',
      },
    ],
  },
  2: {
    // Mars - Redline
    before: [
      {
        speaker: 'redline',
        speakerName: 'Redline (Mars Gatekeeper)',
        text: 'Hold your burn! You are exactly 9 kg over your insertion mass cap. Jettison excess ballast or burn up.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Wait—someone stowed an unauthorized souvenir crate in the equipment bay!',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*angry beep-buzz!* [Drop the souvenir! Do NOT drop my optical array. I need both eyes to certify Harbor!]',
      },
    ],
    success: [
      {
        speaker: 'redline',
        speakerName: 'Redline (Mars Gatekeeper)',
        text: 'Mass margin restored. 9 kg souvenir ejected into parking orbit. Vector clear for the asteroid belt.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Good catch, Nori. Ballast is gone. Engaging chemical engine toward Ceres.',
      },
    ],
  },
  3: {
    // Ceres - Pebble
    before: [
      {
        speaker: 'pebble',
        speakerName: 'Pebble (Belt Gatekeeper)',
        text: 'I watch the gravel of the main belt. Name the giant among our pebbles—the one Dawn orbited.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Three candidates in the database: Ceres, Vesta, and Pallas. Dawn orbited the largest diameter.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*analytic chimes* [Remember: Ceres is classified as a dwarf planet, not an ordinary asteroid.]',
      },
    ],
    success: [
      {
        speaker: 'pebble',
        speakerName: 'Pebble (Belt Gatekeeper)',
        text: '1 Ceres it is. 939 kilometers of rock and ice. The gate to Jupiter opens.',
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
        text: 'WARNING! Unidentified alien defense saucers approaching in battle formation! Weapons hot!',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Ambush at the depot! Nori, man the point defense lasers! Evade their salvoes!',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*rapid warbles and combat beeps!* [Sliding horizontal thrusters! Clear all three waves to dock!]',
      },
    ],
    success: [
      {
        speaker: 'bolt',
        speakerName: 'Bolt (Depot Stationmaster)',
        text: 'Splendid shooting, Earthlings! You routed those automated scrap raiders. Dock at clamp 4.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Requesting refuel. Our propellant tanks are dry after clearing the inner system.',
      },
      {
        speaker: 'bolt',
        speakerName: 'Bolt (Depot Stationmaster)',
        text: 'Tanks refueled to capacity. No extra parts added. 7100 m/s total will carry you through the outer rim.',
      },
    ],
  },
  5: {
    // Enceladus - Spray
    before: [
      {
        speaker: 'spray',
        speakerName: 'Spray (Saturnian Gatekeeper)',
        text: 'You approach the ringed jewel. Enceladus hides an ocean beneath its frozen crust. Show me where life breaths into space.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Targeting Cassini’s historic flyby track. The cryovolcanic water vapor jets emerge from the south pole.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*humming clicks* [Point sensor reticle directly at the South Polar tiger stripes.]',
      },
    ],
    success: [
      {
        speaker: 'spray',
        speakerName: 'Spray (Saturnian Gatekeeper)',
        text: 'Direct hit on the vapor plume. Salty ice grains registered. Pass onward to cold Uranus.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Plume spectra recorded. Preparing bus heaters for deep cold.',
      },
    ],
  },
  6: {
    // Uranus - Tilt
    before: [
      {
        speaker: 'tilt',
        speakerName: 'Tilt (Ice Giant Gatekeeper)',
        text: 'At 19.2 AU, solar flux is negligible. Sunlight drops as 1 over r squared. The deep freeze will kill your bus without heat.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'The alive bus requires 55 W minimum: Command (20W) + Antenna (15W) + Heater (+20W).',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*tense bleeps* [Balance the breakers! If total draw exceeds supply, switch off the imager! Without RTG, we freeze.]',
      },
    ],
    success: [
      {
        speaker: 'tilt',
        speakerName: 'Tilt (Ice Giant Gatekeeper)',
        text: 'Core bus stable. Bus temperature above threshold. You survived the cold tomb of Uranus.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Systems green. RTG is humming. Next stop: Neptune.',
      },
    ],
  },
  7: {
    // Neptune - Lag
    before: [
      {
        speaker: 'lag',
        speakerName: 'Lag (Outer Guard)',
        text: 'Distance... thirty... point... one... AU. Light... takes... four... hours... to... cross... this... gulf.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'One command, then wait. A second command during transit will collide and cause reset.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*measured slow ticks* [Send one ping. Hold completely still for 7 seconds. Patience is orbital mechanics.]',
      },
    ],
    success: [
      {
        speaker: 'lag',
        speakerName: 'Lag (Outer Guard)',
        text: 'Signal... acknowledged. Clear... passage... to... the... Kuiper... dwarf.',
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
        text: 'Welcome to the Kuiper Belt! Mark my bright frozen heart, not the dark scorched plains.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Tombaugh Regio—the vast nitrogen ice plain shaped like a heart.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*gentle chirping* [Target the heart ❤️. Remember: a photograph is not a soil sample!]',
      },
    ],
    success: [
      {
        speaker: 'heart',
        speakerName: 'Heart (Plutonian Spirit ❤️)',
        text: 'You found my heart! May your voyage into the dark interstellar void stay warm.',
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
        text: 'At 122 AU, the solar wind halts. You stand where Voyager 1 crossed in 2012. Before you jump to Harbor, lock your return protocol.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Science protocol priority: 1. Water and soil readings, 2. Power and navigation log, 3. Postcard.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*whirring confirmation* [Order matters. If sequence is wrong, telemetry rejects transmission.]',
      },
    ],
    success: [
      {
        speaker: 'whisper',
        speakerName: 'Whisper (Heliopause Sentinel)',
        text: 'Protocol sealed. You leave the Sun behind. Ahead lies TOI-700 e—Harbor.',
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
        text: 'Arrival at TOI-700 e (Harbor). 101.5 light years from Earth. The hatch stays shut. Nori prepares the sample sleeve.',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Harbor is completely silent. Hatch sealed. Nori, deploy the sample sleeve. Retrieve water and soil samples.',
      },
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*solemn, determined clicks* [Find amber key. Open red security gate. Sample water and soil nodes. Evade patrolling drones.]',
      },
    ],
    success: [
      {
        speaker: 'nori',
        speakerName: 'Nori',
        text: '*triumphant fanfare chirps!* [Sample canisters locked in sleeve! Returning through docking airlock!]',
      },
      {
        speaker: 'wren',
        speakerName: 'Specialist',
        text: 'Canisters secured! Air seal intact. Setting return trajectory for Earth. We are going home.',
      },
    ],
  },
};
