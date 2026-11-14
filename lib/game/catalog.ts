import type { PartId, StopId, VehicleId } from "./types";

/** Teaching budget. Not an official NASA solicitation cap. */
export const BUDGET = 140;

export const HEATER_W = 20;
export const DV_PER_TANK = 2400;
export const TO_JUPITER_DV = 6700;
export const AFTER_DEPOT_DV = 7100;
export const URANUS_AU = 19.2;

export type PartRole = "draw" | "solar" | "rtg" | "none";

export type PartDef = {
  id: PartId;
  name: string;
  mass: number;
  /** Positive watts. Meaning depends on role. */
  watts: number;
  role: PartRole;
  cost: number;
  unique: boolean;
  required: boolean;
  blurb: string;
  cite: string;
};

export const PARTS: Record<PartId, PartDef> = {
  command: {
    id: "command",
    name: "Command module",
    mass: 90,
    watts: 20,
    role: "draw",
    cost: 12,
    unique: true,
    required: true,
    blurb: "Wren stays here. The computer stays on.",
    cite: "Teaching mass and draw. The phase language follows NASA CubeSat 101.",
  },
  engine: {
    id: "engine",
    name: "Chemical engine",
    mass: 60,
    watts: 5,
    role: "draw",
    cost: 10,
    unique: true,
    required: true,
    blurb: "Off during the cruise. On when a leg needs propellant.",
    cite: "Each tank is booked as 2.4 km/s in this teaching model. A real trajectory would be run in a tool such as GMAT. This table is a patched-conic sketch.",
  },
  tank: {
    id: "tank",
    name: "Propellant tank",
    mass: 40,
    watts: 0,
    role: "none",
    cost: 6,
    unique: false,
    required: false,
    blurb: "2.4 km/s in this model. Three tanks reach Jupiter with a thin margin. The depot fills them again.",
    cite: "Flat delta-v per tank, labeled as a simplification of the rocket equation. Not a GMAT output.",
  },
  antenna: {
    id: "antenna",
    name: "High-gain antenna",
    mass: 25,
    watts: 15,
    role: "draw",
    cost: 8,
    unique: true,
    required: true,
    blurb: "Earth is a direction. Without this, the corridor does not open.",
    cite: "Teaching mass. Reference shape: the New Horizons high-gain antenna, 2.1 m (NASA / JHUAPL).",
  },
  solar: {
    id: "solar",
    name: "Solar array",
    mass: 30,
    watts: 160,
    role: "solar",
    cost: 7,
    unique: true,
    required: false,
    blurb: "160 W at Earth. Power falls with the square of distance from the Sun.",
    cite: "Inverse-square teaching model. At Uranus (about 19.2 AU) this array makes well under 1 W.",
  },
  rtg: {
    id: "rtg",
    name: "Radioisotope unit",
    mass: 50,
    watts: 100,
    role: "rtg",
    cost: 22,
    unique: true,
    required: false,
    blurb: "Flat watts. Heavy. The outer planets do not care how large the arrays were.",
    cite: "Scaled for this budget. The New Horizons GPHS-RTG was about 57 kg and about 246 W at launch (NASA / JHUAPL).",
  },
  spectrometer: {
    id: "spectrometer",
    name: "Mass spectrometer",
    mass: 35,
    watts: 20,
    role: "draw",
    cost: 14,
    unique: true,
    required: false,
    blurb: "The only box that can certify a water reading.",
    cite: "Teaching mass and draw for a sampling spectrometer. Not a specific flight instrument's as-flown mass.",
  },
  drill: {
    id: "drill",
    name: "Sample drill",
    mass: 40,
    watts: 25,
    role: "draw",
    cost: 12,
    unique: true,
    required: false,
    blurb: "Rides in Nori's sleeve. Certifies soil. Does not certify water.",
    cite: "Teaching mass and draw for a sample-acquisition head.",
  },
  imager: {
    id: "imager",
    name: "Imager",
    mass: 8,
    watts: 5,
    role: "draw",
    cost: 3,
    unique: true,
    required: false,
    blurb: "Pictures. Useful, and the first thing the bus will ask you to switch off.",
    cite: "Teaching mass. A camera is not a laboratory.",
  },
};

export const VEHICLES: Record<
  VehicleId,
  { id: VehicleId; name: string; cost: number; massCap: number; blurb: string }
> = {
  kite: {
    id: "kite",
    name: "Kite",
    cost: 18,
    massCap: 400,
    blurb: "Leaves money. Leaves little mass.",
  },
  keel: {
    id: "keel",
    name: "Keel",
    cost: 36,
    massCap: 560,
    blurb: "Eats the budget. Carries a full science ship.",
  },
};

export type StopDef = {
  id: StopId;
  name: string;
  klass: string;
  keeper: string | null;
};

export const STOPS: StopDef[] = [
  { id: 0, name: "Earth", klass: "Departure", keeper: null },
  { id: 1, name: "Moon", klass: "Moon", keeper: "Lumen" },
  { id: 2, name: "Mars", klass: "Planet", keeper: "Redline" },
  { id: 3, name: "Ceres", klass: "Dwarf planet", keeper: "Pebble" },
  { id: 4, name: "Jupiter", klass: "Planet", keeper: "Bolt" },
  { id: 5, name: "Enceladus", klass: "Moon of Saturn", keeper: "Spray" },
  { id: 6, name: "Uranus", klass: "Planet", keeper: "Tilt" },
  { id: 7, name: "Neptune", klass: "Planet", keeper: "Lag" },
  { id: 8, name: "Pluto", klass: "Dwarf planet", keeper: "Heart" },
  { id: 9, name: "Heliopause", klass: "Boundary", keeper: "Whisper" },
  { id: 10, name: "Harbor", klass: "TOI-700 e, simulation", keeper: "Shore" },
];

export type Leg = { from: StopId; to: StopId; cost: number; name: string };

export const LEGS: Leg[] = [
  { from: 0, to: 1, cost: 900, name: "Earth to the Moon" },
  { from: 1, to: 2, cost: 2100, name: "Moon to Mars" },
  { from: 2, to: 3, cost: 1500, name: "Mars to Ceres" },
  { from: 3, to: 4, cost: 2200, name: "Ceres to Jupiter" },
  { from: 4, to: 5, cost: 1600, name: "Jupiter to Enceladus" },
  { from: 5, to: 6, cost: 1500, name: "Enceladus to Uranus" },
  { from: 6, to: 7, cost: 1400, name: "Uranus to Neptune" },
  { from: 7, to: 8, cost: 1100, name: "Neptune to Pluto" },
  { from: 8, to: 9, cost: 1500, name: "Pluto to the heliopause" },
  { from: 9, to: 10, cost: 0, name: "Arrival simulation" },
  { from: 10, to: 0, cost: 0, name: "Direct return" },
];

export function legBetween(from: StopId, to: StopId): Leg {
  const leg = LEGS.find((item) => item.from === from && item.to === to);
  if (!leg) throw new Error(`No leg ${from} -> ${to}`);
  return leg;
}

export function dodgeCount(from: StopId, to: StopId): number {
  if (to === 0 || to === 10) return to === 10 ? 1 : 0;
  if (from === 2 || from === 8) return 2;
  return 1;
}

/** Approximate heliocentric range used when Horizons is not on screen. */
export const RANGE_AU: Record<StopId, number> = {
  0: 1,
  1: 1,
  2: 1.52,
  3: 2.77,
  4: 5.2,
  5: 9.58,
  6: 19.2,
  7: 30.1,
  8: 34.5,
  9: 122,
  10: 122,
};

export function stopById(id: StopId): StopDef {
  return STOPS[id];
}
