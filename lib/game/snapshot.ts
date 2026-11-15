import type { NeoBody } from "./types";

export type WorldCard = {
  name: string;
  nickname: string;
  radius: number;
  mass: number | null;
  period: number;
  insolation: number;
  eqt: number;
  distancePc: number;
  year: number;
};

/** Composite parameters retrieved 15 November 2026. Fallback if the archive is down. */
export const ARCHIVE_SNAPSHOT: WorldCard[] = [
  {
    name: "TOI-700 e",
    nickname: "Harbor",
    radius: 0.919,
    mass: 0.718,
    period: 27.810124,
    insolation: 1.27,
    eqt: 272.9,
    distancePc: 31.1265,
    year: 2023,
  },
  {
    name: "TOI-700 d",
    nickname: "The one you do not fly",
    radius: 1.145,
    mass: 1.58,
    period: 37.423457,
    insolation: 0.85,
    eqt: 268.8,
    distancePc: 31.1265,
    year: 2020,
  },
];

export const NEO_SNAPSHOT: NeoBody[] = [
  { name: "433 Eros", diameterKm: 16.84, velocityKmS: 5.3, hazardous: false },
  { name: "25143 Itokawa", diameterKm: 0.33, velocityKmS: 6.1, hazardous: false },
  { name: "101955 Bennu", diameterKm: 0.49, velocityKmS: 6.1, hazardous: true },
  { name: "162173 Ryugu", diameterKm: 0.9, velocityKmS: 5.2, hazardous: false },
  { name: "4179 Toutatis", diameterKm: 2.5, velocityKmS: 11.0, hazardous: true },
  { name: "99942 Apophis", diameterKm: 0.34, velocityKmS: 7.4, hazardous: true },
];

export const MOON_SNAPSHOT = {
  azimuth: 124,
  elevation: 18,
  note: "Sample fix for a south-polar lunar site. Horizons did not answer in time.",
};

export const HONESTY =
  "Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive's numbers. The aliens, the depot fight, and the droid are the story.";

export function parsecsToLightYears(pc: number): number {
  return pc * 3.261563777;
}
