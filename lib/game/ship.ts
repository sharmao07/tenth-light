import {
  AFTER_DEPOT_DV,
  BUDGET,
  DV_PER_TANK,
  HEATER_W,
  PARTS,
  TO_JUPITER_DV,
  URANUS_AU,
  VEHICLES,
} from "./catalog";
import type { Analysis, PartId, ShipDesign } from "./types";

const SCIENCE: PartId[] = ["spectrometer", "drill", "imager"];

export function countTanks(parts: PartId[]): number {
  return parts.filter((part) => part === "tank").length;
}

export function hasPart(parts: PartId[], id: PartId): boolean {
  return parts.includes(id);
}

export function supplyWatts(parts: PartId[], au: number): number {
  let watts = 0;
  if (hasPart(parts, "rtg")) watts += PARTS.rtg.watts;
  if (hasPart(parts, "solar")) watts += PARTS.solar.watts / (au * au);
  return watts;
}

export function drawWatts(parts: PartId[], includeEngine: boolean): number {
  let watts = 0;
  for (const id of parts) {
    const part = PARTS[id];
    if (part.role !== "draw") continue;
    if (id === "engine" && !includeEngine) continue;
    if (id === "tank") continue;
    watts += part.watts;
  }
  return watts;
}

export function aliveDraw(parts: PartId[]): number {
  const computer = hasPart(parts, "command") ? PARTS.command.watts : 0;
  const radio = hasPart(parts, "antenna") ? PARTS.antenna.watts : 0;
  return computer + radio + HEATER_W;
}

export function scienceDraw(parts: PartId[], off: PartId[] = []): number {
  let watts = 0;
  for (const id of SCIENCE) {
    if (hasPart(parts, id) && !off.includes(id)) watts += PARTS[id].watts;
  }
  return watts;
}

export function analyze(ship: ShipDesign): Analysis {
  const { parts } = ship;
  const vehicle = VEHICLES[ship.vehicle];
  const mass = parts.reduce((sum, id) => sum + PARTS[id].mass, 0);
  const cost =
    vehicle.cost + parts.reduce((sum, id) => sum + PARTS[id].cost, 0);
  const tanks = countTanks(parts);
  const dv = tanks * DV_PER_TANK;
  const drawEarth = drawWatts(parts, true);
  const supplyEarth = supplyWatts(parts, 1);
  const alive = aliveDraw(parts);
  const supplyUranus = supplyWatts(parts, URANUS_AU);
  const hard: string[] = [];
  if (!hasPart(parts, "command")) hard.push("The command module is missing.");
  if (!hasPart(parts, "engine")) hard.push("There is no engine.");
  if (!hasPart(parts, "antenna")) hard.push("There is no antenna. Earth cannot hear you.");
  if (tanks < 1) hard.push("There is no propellant.");
  if (mass > vehicle.massCap) {
    hard.push(`Mass ${mass} kg is over the ${vehicle.name} cap of ${vehicle.massCap} kg.`);
  }
  if (cost > BUDGET) hard.push(`Cost ${cost} is over the budget of ${BUDGET}.`);
  if (supplyEarth + 0.05 < drawEarth) {
    hard.push("The bus is dark at Earth. Add solar or a radioisotope unit.");
  }
  const warnings: string[] = [];
  if (dv < TO_JUPITER_DV) {
    warnings.push("Propellant runs out before Jupiter. The launch will be scrubbed on the way.");
  } else if (dv < AFTER_DEPOT_DV) {
    warnings.push("Even after the Jupiter depot, propellant runs out before the heliopause.");
  }
  if (supplyUranus + 0.05 < alive) {
    warnings.push("At Uranus the heater cannot hold. Solar is a rumor that far out. This design will be scrubbed there.");
  }
  if (!hasPart(parts, "spectrometer")) {
    warnings.push("No spectrometer. A water sample cannot be certified.");
  }
  if (!hasPart(parts, "drill")) {
    warnings.push("No drill. A soil sample cannot be certified.");
  }
  return {
    mass,
    massCap: vehicle.massCap,
    cost,
    budget: BUDGET,
    drawEarth,
    supplyEarth,
    aliveDraw: alive,
    supplyUranus,
    dv,
    tanks,
    hard,
    warnings,
    water: hasPart(parts, "spectrometer"),
    soil: hasPart(parts, "drill"),
  };
}

export function togglePart(parts: PartId[], id: PartId): PartId[] {
  const part = PARTS[id];
  if (part.required) return parts;
  if (id === "tank") {
    const tanks = countTanks(parts);
    if (tanks >= 4) return parts;
    return [...parts, "tank"];
  }
  if (parts.includes(id)) return parts.filter((item) => item !== id);
  return [...parts, id];
}

export function removeOne(parts: PartId[], id: PartId): PartId[] {
  if (PARTS[id].required) return parts;
  const index = parts.lastIndexOf(id);
  if (index < 0) return parts;
  return parts.filter((_, item) => item !== index);
}

export function endingKind(input: {
  ship: ShipDesign;
  frozen: PartId[];
  samples: { water: boolean; soil: boolean };
}): "certified" | "uncertified" | "thin" {
  const water =
    input.samples.water &&
    hasPart(input.ship.parts, "spectrometer") &&
    !input.frozen.includes("spectrometer");
  const soil =
    input.samples.soil &&
    hasPart(input.ship.parts, "drill") &&
    !input.frozen.includes("drill");
  if (water && soil) return "certified";
  if (!water && !soil) return "thin";
  return "uncertified";
}
