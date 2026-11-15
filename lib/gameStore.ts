// Tenth Light - Save State & Game Engine Management
import { GameSaveState, ShipDesign, LAUNCHERS, OPTIONAL_PARTS, CORE_PARTS, URANUS_HEATER_BUS_WATTS } from './gameTypes';

const STORAGE_KEY = 'tenth-light-v1';

export const INITIAL_SHIP_DESIGN: ShipDesign = {
  launcherId: 'keel',
  parts: {
    command_module: 1,
    chemical_engine: 1,
    high_gain_antenna: 1,
    propellant_tank: 3,
    rtg: 1,
    spectrometer: 1,
    sample_drill: 1,
  },
};

export const DEFAULT_SAVE_STATE: GameSaveState = {
  version: 'tenth-light-v1',
  callsign: 'Wren',
  currentStop: 0,
  phase: 'title',
  lives: 3,
  checkpointStop: 0,
  shipDesign: INITIAL_SHIP_DESIGN,
  currentDeltaV: 7200,
  hasSouvenir: true,
  uranusBreakersPassed: false,
  collectedWater: false,
  collectedSoil: false,
  isMuted: false,
  reducedMotion: false,
  soundCaptions: false,
  seenTutorials: {},
  lastUpdated: new Date().toISOString(),
};

export function loadSave(): GameSaveState {
  if (typeof window === 'undefined') return DEFAULT_SAVE_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SAVE_STATE;
    const parsed = JSON.parse(raw);
    if (parsed.version === 'tenth-light-v1') {
      return { ...DEFAULT_SAVE_STATE, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load save from localStorage', e);
  }
  return DEFAULT_SAVE_STATE;
}

export function saveState(state: GameSaveState): void {
  if (typeof window === 'undefined') return;
  try {
    const stateToSave = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    console.warn('Failed to save to localStorage', e);
  }
}

export function clearSave(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear save', e);
  }
}

export function exportSaveString(state: GameSaveState): string {
  const exportPayload = {
    ...state,
    exportedAt: new Date().toISOString(),
    format: 'tenth-light-telemetry-manifest-v1',
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importSaveString(raw: string): { success: boolean; state?: GameSaveState; error?: string } {
  try {
    const trimmed = raw.trim();
    if (!trimmed) {
      return { success: false, error: 'Empty telemetry manifest string.' };
    }
    const parsed = JSON.parse(trimmed);
    if (!parsed || parsed.version !== 'tenth-light-v1') {
      return { success: false, error: 'Incompatible save format. Expected version tenth-light-v1.' };
    }
    if (typeof parsed.currentStop !== 'number' || parsed.currentStop < 0 || parsed.currentStop > 10) {
      return { success: false, error: 'Invalid stop index in telemetry manifest.' };
    }
    const validatedState: GameSaveState = {
      ...DEFAULT_SAVE_STATE,
      ...parsed,
      lastUpdated: new Date().toISOString(),
    };
    saveState(validatedState);
    return { success: true, state: validatedState };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Invalid JSON manifest.' };
  }
}

export interface ShipMetrics {
  totalMass: number;
  massCap: number;
  totalCost: number;
  isCostLegal: boolean;
  isMassLegal: boolean;
  powerDrawEarth: number;
  powerGenEarth: number;
  uranusSupplyWatts: number;
  uranusHeaterRequiredWatts: number;
  uranusSurvives: boolean;
  totalDeltaV: number;
  hasWaterCertifier: boolean; // spectrometer
  hasSoilCertifier: boolean; // sample_drill
  hasImager: boolean;
  hasRtg: boolean;
  canReachJupiter: boolean;
  canFinishRoute: boolean;
  isLaunchLegal: boolean;
  warnings: string[];
  hardErrors: string[];
}

export function calculateShipMetrics(design: ShipDesign): ShipMetrics {
  const launcher = LAUNCHERS[design.launcherId];
  let totalMass = 0;
  let totalCost = launcher.cost;
  let powerDrawEarth = 0;
  let powerGenEarth = 0;
  let uranusSupplyWatts = 0;
  let totalDeltaV = 0;

  // Add core parts
  for (const part of CORE_PARTS) {
    totalMass += part.mass;
    totalCost += part.cost;
    powerDrawEarth += part.powerDraw;
  }

  const parts = design.parts || {};

  // Check optional parts
  for (const part of OPTIONAL_PARTS) {
    const count = parts[part.id] || 0;
    if (count > 0) {
      totalMass += part.mass * count;
      totalCost += part.cost * count;
      powerDrawEarth += part.powerDraw * count;

      if (part.id === 'propellant_tank') {
        totalDeltaV += (part.deltaV || 2400) * count;
      }
      if (part.id === 'solar_array') {
        powerGenEarth += (part.powerGen || 160) * count;
        // At Uranus (19.2 AU), solar drops as 1/r^2: 160 / (19.2^2) = ~0.43 W per array
        uranusSupplyWatts += ((part.powerGen || 160) / (19.2 * 19.2)) * count;
      }
      if (part.id === 'rtg') {
        powerGenEarth += (part.powerGen || 100) * count;
        // RTG does not fall off
        uranusSupplyWatts += (part.powerGen || 100) * count;
      }
    }
  }

  const hasWaterCertifier = (parts['spectrometer'] || 0) > 0;
  const hasSoilCertifier = (parts['sample_drill'] || 0) > 0;
  const hasImager = (parts['imager'] || 0) > 0;
  const hasRtg = (parts['rtg'] || 0) > 0;

  // Uranus heater bus requirement: 55 W (command 20 + antenna 15 + heater 20)
  const uranusHeaterRequiredWatts = URANUS_HEATER_BUS_WATTS;
  const uranusSurvives = uranusSupplyWatts >= uranusHeaterRequiredWatts;

  const isCostLegal = totalCost <= 140;
  const isMassLegal = totalMass <= launcher.massCap;

  // 6700 m/s to reach Jupiter, 7100 m/s after depot
  // 2 tanks = 4800 m/s (cannot reach Jupiter)
  // 3 tanks = 7200 m/s (just enough for both halves)
  const canReachJupiter = totalDeltaV >= 6700;
  const canFinishRoute = totalDeltaV >= 7100; // after refuel

  const hardErrors: string[] = [];
  const warnings: string[] = [];

  if (!isCostLegal) {
    hardErrors.push(`Cost ${totalCost} exceeds teaching budget limit (140)`);
  }
  if (!isMassLegal) {
    hardErrors.push(`Mass ${totalMass} kg exceeds ${launcher.name} payload cap (${launcher.massCap} kg)`);
  }
  if (totalDeltaV < 6700) {
    hardErrors.push(`Delta-v ${totalDeltaV} m/s is insufficient to reach Jupiter (6700 m/s needed; minimum 3 tanks)`);
  }

  if (powerGenEarth < powerDrawEarth) {
    warnings.push(`Power generation at Earth (${Math.round(powerGenEarth)} W) is below full draw (${powerDrawEarth} W)`);
  }
  if (!hasRtg) {
    warnings.push(`No RTG aboard. Solar power drops as 1/r² to 0.4 W at Uranus. Flight will freeze at Uranus!`);
  }
  if (!hasWaterCertifier) {
    warnings.push(`Mass spectrometer missing: will NOT be able to certify water at Harbor.`);
  }
  if (!hasSoilCertifier) {
    warnings.push(`Sample drill missing: will NOT be able to certify soil at Harbor.`);
  }

  const isLaunchLegal = hardErrors.length === 0;

  return {
    totalMass,
    massCap: launcher.massCap,
    totalCost,
    isCostLegal,
    isMassLegal,
    powerDrawEarth,
    powerGenEarth,
    uranusSupplyWatts,
    uranusHeaterRequiredWatts,
    uranusSurvives,
    totalDeltaV,
    hasWaterCertifier,
    hasSoilCertifier,
    hasImager,
    hasRtg,
    canReachJupiter,
    canFinishRoute,
    isLaunchLegal,
    warnings,
    hardErrors,
  };
}
