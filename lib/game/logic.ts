import { dodgeCount, legBetween, STOPS } from "./catalog";
import { SCRIPTS, briefingLines } from "./dialogue";
import { analyze, removeOne, togglePart } from "./ship";
import { NEO_SNAPSHOT } from "./snapshot";
import type {
  GameState,
  NeoBody,
  PartId,
  Phase,
  ScriptId,
  StopId,
  VehicleId,
} from "./types";

export const initialState: GameState = {
  v: 1,
  callsign: "Wren",
  lives: 3,
  ship: { vehicle: "kite", parts: ["command", "engine", "antenna"] },
  dv: 0,
  frozen: [],
  samples: { water: false, soil: false },
  neoCursor: 0,
  seenTip: false,
  log: ["The chair is empty. The budget is 140."],
  phase: { kind: "title" },
  neos: [],
  checkpoint: null,
};

const SCRIPT_FOR: Partial<Record<StopId, ScriptId>> = {
  1: "moon",
  2: "mars",
  3: "ceres",
  4: "ambush",
  5: "enceladus",
  6: "uranus",
  7: "neptune",
  8: "pluto",
  9: "whisper",
  10: "harbor",
};

export type Action =
  | { type: "callsign"; value: string }
  | { type: "begin" }
  | { type: "resume"; state: GameState }
  | { type: "next-line" }
  | { type: "prev-line" }
  | { type: "briefing-done" }
  | { type: "vehicle"; id: VehicleId }
  | { type: "autobuild" }
  | { type: "add"; id: PartId }
  | { type: "remove"; id: PartId }
  | { type: "launch" }
  | { type: "dodge"; hit: boolean }
  | { type: "coast-home" }
  | { type: "talk-next" }
  | { type: "talk-prev" }
  | { type: "talk-cta" }
  | { type: "puzzle-pass"; frozen?: PartId[] }
  | { type: "fight-hit" }
  | { type: "fight-win" }
  | { type: "maze-done"; water: boolean; soil: boolean }
  | { type: "maze-hit" }
  | { type: "scrub" }
  | { type: "neos"; bodies: NeoBody[] }
  | { type: "restart" };

function checkpointOf(state: GameState) {
  return {
    callsign: state.callsign,
    ship: state.ship,
    dv: state.dv,
    frozen: state.frozen,
    samples: state.samples,
    neoCursor: state.neoCursor,
    seenTip: state.seenTip,
    log: state.log,
    phase: state.phase,
  };
}

function enter(state: GameState, phase: Phase, patch: Partial<GameState> = {}): GameState {
  const next: GameState = { ...state, ...patch, phase };
  return { ...next, checkpoint: checkpointOf(next) };
}

function takeNeo(state: GameState): { neo: NeoBody; cursor: number } {
  const list = state.neos.length > 0 ? state.neos : NEO_SNAPSHOT;
  const neo = list[state.neoCursor % list.length];
  return { neo, cursor: state.neoCursor + 1 };
}

function scrub(state: GameState, reason: string): GameState {
  return {
    ...state,
    lives: 3,
    dv: 0,
    frozen: [],
    samples: { water: false, soil: false },
    phase: { kind: "hangar" },
    checkpoint: null,
    log: [...state.log, reason],
  };
}

function die(state: GameState, note: string): GameState {
  if (!state.checkpoint) {
    return scrub(state, `${note} No gate was saved. Back to the hangar.`);
  }
  const saved = state.checkpoint;
  return {
    ...state,
    ...saved,
    neos: state.neos,
    lives: 3,
    checkpoint: saved,
    log: [...saved.log, note, "The gate is still here. Three lives restored."],
  };
}

function startTransit(state: GameState, from: StopId, to: StopId): GameState {
  const leg = legBetween(from, to);
  if (state.dv < leg.cost) {
    return enter(state, { kind: "talk", script: "shortfall", line: 0, stop: from }, {
      log: [...state.log, `Short ${leg.cost - state.dv} m/s on ${leg.name}.`],
    });
  }
  const picked = takeNeo(state);
  const dodges = dodgeCount(from, to);
  return enter(
    state,
    {
      kind: "transit",
      from,
      to,
      dodgesLeft: dodges,
      neo: picked.neo,
      showTip: !state.seenTip && dodges > 0,
    },
    {
      dv: state.dv - leg.cost,
      neoCursor: picked.cursor,
      log: [...state.log, leg.cost > 0 ? `${leg.name}. ${leg.cost} m/s.` : leg.name],
    },
  );
}

function arrive(state: GameState, stop: StopId): GameState {
  const script = SCRIPT_FOR[stop];
  if (!script) return state;
  return enter(state, { kind: "talk", script, line: 0, stop }, {
    log: [...state.log, `Gate ${stop}. ${STOPS[stop].name}.`],
  });
}

function finishTransit(state: GameState): GameState {
  if (state.phase.kind !== "transit") return state;
  if (state.phase.to === 0) return enter(state, { kind: "ending" });
  return arrive(state, state.phase.to);
}

function cleanCallsign(value: string): string {
  return value.replace(/[^\p{L}\p{N} '\-]/gu, "").slice(0, 16);
}

export function reduce(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "callsign":
      return { ...state, callsign: cleanCallsign(action.value) };
    case "begin":
      return {
        ...initialState,
        callsign: state.callsign.trim() || "Wren",
        neos: state.neos,
        phase: { kind: "briefing", line: 0 },
      };
    case "resume":
      return action.state.v === 1 && action.state.phase ? action.state : state;
    case "restart":
      return { ...initialState, callsign: state.callsign.trim() || "Wren", neos: state.neos };
    case "neos":
      return { ...state, neos: action.bodies };
    case "next-line": {
      if (state.phase.kind !== "briefing") return state;
      const last = briefingLines(state.callsign).length - 1;
      if (state.phase.line >= last) return state;
      return { ...state, phase: { kind: "briefing", line: state.phase.line + 1 } };
    }
    case "prev-line": {
      if (state.phase.kind !== "briefing" || state.phase.line <= 0) return state;
      return { ...state, phase: { kind: "briefing", line: state.phase.line - 1 } };
    }
    case "briefing-done":
      return { ...state, phase: { kind: "hangar" }, log: [...state.log, "Hangar open."] };
    case "vehicle":
      if (state.phase.kind !== "hangar") return state;
      return { ...state, ship: { ...state.ship, vehicle: action.id } };
    case "autobuild":
      if (state.phase.kind !== "hangar") return state;
      return {
        ...state,
        ship: {
          vehicle: "keel",
          parts: ["command", "engine", "antenna", "tank", "tank", "tank", "rtg", "spectrometer", "drill"],
        },
        log: [...state.log, "Auto stack: Keel, three tanks, radioisotope unit, spectrometer, drill."],
      };
    case "add": {
      if (state.phase.kind !== "hangar") return state;
      if (action.id !== "tank" && state.ship.parts.includes(action.id)) return state;
      return { ...state, ship: { ...state.ship, parts: togglePart(state.ship.parts, action.id) } };
    }
    case "remove":
      if (state.phase.kind !== "hangar") return state;
      return { ...state, ship: { ...state.ship, parts: removeOne(state.ship.parts, action.id) } };
    case "launch": {
      if (state.phase.kind !== "hangar") return state;
      const report = analyze(state.ship);
      if (report.hard.length > 0) return state;
      const vehicle = state.ship.vehicle === "keel" ? "Keel" : "Kite";
      return startTransit(
        {
          ...state,
          dv: report.dv,
          frozen: [],
          samples: { water: false, soil: false },
          log: [...state.log, `Rollout on ${vehicle}. ${report.dv} m/s in the tanks.`],
        },
        0,
        1,
      );
    }
    case "dodge": {
      if (state.phase.kind !== "transit") return state;
      const neoName = state.phase.neo.name;
      if (!action.hit) {
        const note = `Missed ${neoName}. One life.`;
        if (state.lives <= 1) return die({ ...state, seenTip: true }, note);
        return {
          ...state,
          seenTip: true,
          lives: state.lives - 1,
          phase: { ...state.phase, showTip: false },
          log: [...state.log, note],
        };
      }
      const left = state.phase.dodgesLeft - 1;
      const cleared = { ...state, seenTip: true, log: [...state.log, `Cleared ${neoName}.`] };
      if (left <= 0) return finishTransit(cleared);
      const picked = takeNeo(cleared);
      return {
        ...cleared,
        neoCursor: picked.cursor,
        phase: { ...state.phase, dodgesLeft: left, neo: picked.neo, showTip: false },
      };
    }
    case "coast-home":
      if (state.phase.kind !== "return") return state;
      return enter(state, { kind: "ending" }, {
        log: [...state.log, "Earth has the ship."],
      });
    case "talk-next": {
      if (state.phase.kind !== "talk") return state;
      const last = SCRIPTS[state.phase.script](state.callsign).length - 1;
      if (state.phase.line >= last) return state;
      return { ...state, phase: { ...state.phase, line: state.phase.line + 1 } };
    }
    case "talk-prev": {
      if (state.phase.kind !== "talk" || state.phase.line <= 0) return state;
      return { ...state, phase: { ...state.phase, line: state.phase.line - 1 } };
    }
    case "talk-cta": {
      if (state.phase.kind !== "talk") return state;
      if (state.phase.script === "shortfall") {
        return scrub(state, "Scrubbed. The design is still on the floor. The corridor starts again.");
      }
      if (state.phase.script === "refuel") {
        const dv = analyze(state.ship).dv;
        return startTransit(
          { ...state, dv, log: [...state.log, "Depot tanks are full."] },
          4,
          5,
        );
      }
      if (state.phase.script === "ambush") return enter(state, { kind: "fight" });
      if (state.phase.script === "harbor") return enter(state, { kind: "maze" });
      return enter(state, { kind: "puzzle", stop: state.phase.stop });
    }
    case "puzzle-pass": {
      if (state.phase.kind !== "puzzle") return state;
      const frozen = action.frozen ?? state.frozen;
      const next = (state.phase.stop + 1) as StopId;
      return startTransit({ ...state, frozen }, state.phase.stop, next);
    }
    case "fight-hit":
      if (state.phase.kind !== "fight") return state;
      if (state.lives <= 1) return die(state, "The ambush got through.");
      return { ...state, lives: state.lives - 1, log: [...state.log, "A hit. The hull holds."] };
    case "fight-win":
      if (state.phase.kind !== "fight") return state;
      return enter(state, { kind: "talk", script: "refuel", line: 0, stop: 4 }, {
        log: [...state.log, "Ambush broken. The depot is open."],
      });
    case "maze-hit":
      if (state.phase.kind !== "maze") return state;
      if (state.lives <= 1) return die(state, "An alien caught the sleeve.");
      return { ...state, lives: state.lives - 1, log: [...state.log, "An alien touched Nori. One life."] };
    case "maze-done":
      if (state.phase.kind !== "maze") return state;
      return enter(state, { kind: "return" }, {
        samples: { water: action.water, soil: action.soil },
        log: [...state.log, "Sleeve is back inside. The hatch never opened."],
      });
    case "scrub":
      return scrub(state, "Scrubbed at Uranus. The heater could not hold. The design is still on the floor.");
    default:
      return state;
  }
}

