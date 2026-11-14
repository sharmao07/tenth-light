export type StopId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type PartId =
  | "command"
  | "engine"
  | "tank"
  | "antenna"
  | "solar"
  | "rtg"
  | "spectrometer"
  | "drill"
  | "imager";

export type VehicleId = "kite" | "keel";

export type Who =
  | "wren"
  | "nori"
  | "lumen"
  | "redline"
  | "pebble"
  | "bolt"
  | "spray"
  | "tilt"
  | "lag"
  | "heart"
  | "whisper"
  | "shore"
  | "control"
  | "scientist";

export type ScriptId =
  | "moon"
  | "mars"
  | "ceres"
  | "ambush"
  | "refuel"
  | "enceladus"
  | "uranus"
  | "neptune"
  | "pluto"
  | "whisper"
  | "harbor"
  | "shortfall";

export type EndingId = "certified" | "uncertified" | "thin";

export type ShipDesign = {
  vehicle: VehicleId;
  parts: PartId[];
};

export type NeoBody = {
  name: string;
  diameterKm: number | null;
  velocityKmS: number | null;
  hazardous: boolean;
};

export type Phase =
  | { kind: "title" }
  | { kind: "briefing"; line: number }
  | { kind: "hangar" }
  | {
      kind: "transit";
      from: StopId;
      to: StopId;
      dodgesLeft: number;
      neo: NeoBody;
      showTip: boolean;
    }
  | { kind: "talk"; script: ScriptId; line: number; stop: StopId }
  | { kind: "puzzle"; stop: StopId }
  | { kind: "fight" }
  | { kind: "maze" }
  | { kind: "return" }
  | { kind: "ending" };

export type Checkpoint = {
  callsign: string;
  ship: ShipDesign;
  dv: number;
  frozen: PartId[];
  samples: { water: boolean; soil: boolean };
  neoCursor: number;
  seenTip: boolean;
  log: string[];
  phase: Phase;
};

export type GameState = Checkpoint & {
  v: 1;
  lives: number;
  neos: NeoBody[];
  checkpoint: Checkpoint | null;
};

export type Analysis = {
  mass: number;
  massCap: number;
  cost: number;
  budget: number;
  drawEarth: number;
  supplyEarth: number;
  aliveDraw: number;
  supplyUranus: number;
  dv: number;
  tanks: number;
  hard: string[];
  warnings: string[];
  water: boolean;
  soil: boolean;
};
