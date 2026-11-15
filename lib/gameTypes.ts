// Tenth Light - Types and Constants
// NASA Space Apps 2026: Space Mission Design Game

export type Callsign = string;

export interface ShipPart {
  id: string;
  name: string;
  category: 'core' | 'propulsion' | 'power' | 'instrument' | 'utility';
  mass: number; // kg
  cost: number; // credits
  powerDraw: number; // Watts
  powerGen?: number; // Watts at 1 AU (if solar) or flat (if RTG)
  deltaV?: number; // m/s per tank
  maxCount?: number;
  description: string;
  isCore?: boolean;
}

export interface Launcher {
  id: 'kite' | 'keel';
  name: string;
  cost: number;
  massCap: number; // kg
  tagline: string;
}

export const LAUNCHERS: Record<string, Launcher> = {
  kite: {
    id: 'kite',
    name: 'Kite',
    cost: 18,
    massCap: 400,
    tagline: 'Leaves money. Leaves little mass.',
  },
  keel: {
    id: 'keel',
    name: 'Keel',
    cost: 36,
    massCap: 560,
    tagline: 'Eats the budget. Carries a full science ship.',
  },
};

// Core parts bolted on at start
export const CORE_PARTS: ShipPart[] = [
  {
    id: 'command_module',
    name: 'Command Module',
    category: 'core',
    mass: 90,
    cost: 12,
    powerDraw: 20,
    description: 'Pressurized avionics bus and navigation brain.',
    isCore: true,
  },
  {
    id: 'chemical_engine',
    name: 'Chemical Engine',
    category: 'propulsion',
    mass: 60,
    cost: 10,
    powerDraw: 5,
    description: 'High-thrust bipropellant main thruster.',
    isCore: true,
  },
  {
    id: 'high_gain_antenna',
    name: 'High-Gain Antenna',
    category: 'utility',
    mass: 25,
    cost: 8,
    powerDraw: 15,
    description: 'Deep-space parabolic dish for Earth telemetry.',
    isCore: true,
  },
];

// Optional parts
export const OPTIONAL_PARTS: ShipPart[] = [
  {
    id: 'propellant_tank',
    name: 'Propellant Tank',
    category: 'propulsion',
    mass: 40,
    cost: 6,
    powerDraw: 0,
    deltaV: 2400,
    maxCount: 4,
    description: '2400 m/s flat delta-v. Stack up to 4.',
  },
  {
    id: 'solar_array',
    name: 'Solar Array',
    category: 'power',
    mass: 30,
    cost: 7,
    powerDraw: 0,
    powerGen: 160, // at 1 AU; scales 1/r^2
    maxCount: 2,
    description: '160 W at 1 AU. Drops as 1/r². Near 0 at Uranus.',
  },
  {
    id: 'rtg',
    name: 'Radioisotope Unit',
    category: 'power',
    mass: 50,
    cost: 22,
    powerDraw: 0,
    powerGen: 100, // flat
    maxCount: 1,
    description: '100 W flat output. Does not fall off in deep space.',
  },
  {
    id: 'spectrometer',
    name: 'Mass Spectrometer',
    category: 'instrument',
    mass: 35,
    cost: 14,
    powerDraw: 20,
    maxCount: 1,
    description: 'The only thing that certifies water.',
  },
  {
    id: 'sample_drill',
    name: 'Sample Drill',
    category: 'instrument',
    mass: 40,
    cost: 12,
    powerDraw: 25,
    maxCount: 1,
    description: 'Certifies soil only.',
  },
  {
    id: 'imager',
    name: 'Narrow-Angle Imager',
    category: 'instrument',
    mass: 8,
    cost: 3,
    powerDraw: 5,
    maxCount: 1,
    description: 'Science camera. First thing to switch off.',
  },
];

export const STOP_DOSSIER_INFO: Record<number, { sector: string; distance: string; historicalMission: string }> = {
  0: { sector: 'Inner Terrestrial', distance: '1.00 AU (Origin)', historicalMission: 'Apollo & Artemis' },
  1: { sector: 'Lunar Vicinity', distance: '384,400 km', historicalMission: 'Apollo 11 & Surveyor' },
  2: { sector: 'Martian Orbit', distance: '1.52 AU', historicalMission: 'Mars Global Surveyor & Perseverance' },
  3: { sector: 'Asteroid Belt', distance: '2.77 AU', historicalMission: 'Dawn Spacecraft' },
  4: { sector: 'Jovian System', distance: '5.20 AU', historicalMission: 'Pioneer 10 & Cassini' },
  5: { sector: 'Saturnian Cryosphere', distance: '9.58 AU', historicalMission: 'Cassini-Huygens' },
  6: { sector: 'Ice Giant Void', distance: '19.2 AU', historicalMission: 'Voyager 2 (1986)' },
  7: { sector: 'Outer Solar Fringe', distance: '30.1 AU', historicalMission: 'Voyager 2 (1989)' },
  8: { sector: 'Kuiper Belt', distance: '39.5 AU', historicalMission: 'New Horizons (2015)' },
  9: { sector: 'Heliopause Frontier', distance: '122 AU', historicalMission: 'Voyager 1 (2012)' },
  10: { sector: 'TOI-700 Planetary System', distance: '101.5 Light-Years (31.13 pc)', historicalMission: 'TESS Exoplanet Archive' },
};

// Delta-v budget legs in m/s
export interface FlightLeg {
  fromStop: number;
  toStop: number;
  fromName: string;
  toName: string;
  costDeltaV: number;
  dodges: number;
  distanceAU: number;
}

export const FLIGHT_LEGS: FlightLeg[] = [
  { fromStop: 0, toStop: 1, fromName: 'Earth', toName: 'Moon', costDeltaV: 900, dodges: 1, distanceAU: 0.00257 },
  { fromStop: 1, toStop: 2, fromName: 'Moon', toName: 'Mars', costDeltaV: 2100, dodges: 1, distanceAU: 1.52 },
  { fromStop: 2, toStop: 3, fromName: 'Mars', toName: 'Ceres', costDeltaV: 1500, dodges: 2, distanceAU: 2.77 },
  { fromStop: 3, toStop: 4, fromName: 'Ceres', toName: 'Jupiter Depot', costDeltaV: 2200, dodges: 1, distanceAU: 5.2 },
  // Total to Jupiter: 6700 m/s
  { fromStop: 4, toStop: 5, fromName: 'Jupiter Depot', toName: 'Enceladus', costDeltaV: 1600, dodges: 1, distanceAU: 9.58 },
  { fromStop: 5, toStop: 6, fromName: 'Enceladus', toName: 'Uranus', costDeltaV: 1500, dodges: 1, distanceAU: 19.2 },
  { fromStop: 6, toStop: 7, fromName: 'Uranus', toName: 'Neptune', costDeltaV: 1400, dodges: 1, distanceAU: 30.1 },
  { fromStop: 7, toStop: 8, fromName: 'Neptune', toName: 'Pluto', costDeltaV: 1100, dodges: 1, distanceAU: 39.5 },
  { fromStop: 8, toStop: 9, fromName: 'Pluto', toName: 'Heliopause', costDeltaV: 1500, dodges: 2, distanceAU: 122 },
  // Total after Jupiter depot: 7100 m/s
  { fromStop: 9, toStop: 10, fromName: 'Heliopause', toName: 'Harbor (TOI-700 e)', costDeltaV: 0, dodges: 0, distanceAU: 2090000 },
];

export const MAX_TEACHING_BUDGET = 140;
export const URANUS_HEATER_BUS_WATTS = 55; // command (20) + antenna (15) + heater (20)

export interface ShipDesign {
  launcherId: 'kite' | 'keel';
  parts: { [partId: string]: number }; // partId -> count
}

export interface GameSaveState {
  version: 'tenth-light-v1';
  callsign: Callsign;
  currentStop: number; // 0..10
  phase: 'title' | 'briefing' | 'hangar' | 'transit' | 'gate' | 'ending';
  lives: number; // 0..3
  checkpointStop: number; // Stop where lives are restored
  shipDesign: ShipDesign;
  currentDeltaV: number; // remaining m/s
  hasSouvenir: boolean; // Stop 2 Mars
  uranusBreakersPassed: boolean;
  collectedWater: boolean; // Harbor maze
  collectedSoil: boolean; // Harbor maze
  isMuted: boolean;
  reducedMotion?: boolean;
  soundCaptions?: boolean;
  seenTutorials?: Record<number, boolean>;
  lastUpdated: string;
}

export type SpeakerId =
  | 'wren'
  | 'nori'
  | 'lumen'
  | 'redline'
  | 'pebble'
  | 'bolt'
  | 'spray'
  | 'tilt'
  | 'lag'
  | 'heart'
  | 'whisper'
  | 'narrator';

export interface DialogueLine {
  speaker: SpeakerId;
  speakerName: string;
  text: string;
}
