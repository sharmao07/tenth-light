import { AFTER_DEPOT_DV, BUDGET, TO_JUPITER_DV } from "../lib/game/catalog";
import { initialState, reduce } from "../lib/game/logic";
import { reachable } from "../lib/game/maze";
import { analyze, endingKind } from "../lib/game/ship";
import type { PartId, ShipDesign } from "../lib/game/types";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const required: PartId[] = ["command", "engine", "antenna"];

const certifying: ShipDesign = {
  vehicle: "keel",
  parts: [...required, "tank", "tank", "tank", "rtg", "spectrometer", "drill"],
};

const certifyingReport = analyze(certifying);
assert(certifyingReport.hard.length === 0, `certifying ship blocked: ${certifyingReport.hard.join("; ")}`);
assert(certifyingReport.cost <= BUDGET, "certifying ship over budget");
assert(certifyingReport.dv >= TO_JUPITER_DV, "certifying ship cannot reach Jupiter");
assert(certifyingReport.dv >= AFTER_DEPOT_DV, "certifying ship cannot finish after the depot");
assert(certifyingReport.supplyUranus + 0.05 >= certifyingReport.aliveDraw + 20 + 25, "RTG cannot hold both instruments");

const withImager: ShipDesign = {
  ...certifying,
  parts: [...certifying.parts, "imager"],
};
const imagerReport = analyze(withImager);
assert(imagerReport.hard.length === 0, "imager loadout should still launch");
assert(
  imagerReport.supplyUranus + 0.05 < imagerReport.aliveDraw + 20 + 25 + 5,
  "imager should force a breaker open at Uranus",
);

const solarTrap: ShipDesign = {
  vehicle: "kite",
  parts: [...required, "tank", "tank", "tank", "solar", "spectrometer", "drill"],
};
const trap = analyze(solarTrap);
assert(trap.hard.length === 0, `solar trap should be legal to launch: ${trap.hard.join("; ")}`);
assert(trap.mass === trap.massCap, "kite science ship should sit on the mass cap");
assert(trap.warnings.some((line) => line.includes("Uranus")), "solar trap should warn about Uranus");

const short: ShipDesign = {
  vehicle: "kite",
  parts: [...required, "tank", "tank", "solar"],
};
const shortReport = analyze(short);
assert(shortReport.dv < TO_JUPITER_DV, "two tanks should not reach Jupiter");

let state = reduce(initialState, { type: "begin" });
state = reduce(state, { type: "briefing-done" });
state = { ...state, ship: certifying };
state = reduce(state, { type: "launch" });
assert(state.phase.kind === "transit", "launch should enter transit");
if (state.phase.kind === "transit") {
  assert(state.phase.to === 1, "first leg is the Moon");
  assert(state.dv === certifyingReport.dv - 900, "Moon leg should spend 900 m/s");
}

state = reduce(state, { type: "dodge", hit: false });
assert(state.lives === 2, "a miss spends one life");
state = reduce(state, { type: "dodge", hit: true });
assert(state.phase.kind === "talk", "one dodge should arrive at the Moon");

const maze = reachable();
assert(maze.widthsOk, "maze rows must share a width");
assert(maze.keyBeforeGate, "the key must be reachable before the gate opens");
assert(maze.waterBehind, "both water samples must sit behind the gate");
assert(maze.soilBehind, "both soil samples must sit behind the gate");
assert(maze.exitBehind, "maze exit should be reachable once the gate is open");
assert(maze.aliens >= 2, "the sleeve should have aliens to dodge");

assert(
  endingKind({
    ship: certifying,
    frozen: [],
    samples: { water: true, soil: true },
  }) === "certified",
  "full samples should certify",
);
assert(
  endingKind({
    ship: certifying,
    frozen: ["drill"],
    samples: { water: true, soil: true },
  }) === "uncertified",
  "a frozen drill should leave the file incomplete",
);
assert(
  endingKind({
    ship: { vehicle: "keel", parts: required },
    frozen: [],
    samples: { water: true, soil: true },
  }) === "thin",
  "samples without instruments should be a thin file",
);

console.log("tenth-light checks passed");
