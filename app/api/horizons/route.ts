import { MOON_SNAPSHOT } from "@/lib/game/snapshot";

export async function GET() {
  const params = new URLSearchParams({
    format: "json",
    COMMAND: "'399'",
    MAKE_EPHEM: "'YES'",
    EPHEM_TYPE: "'OBSERVER'",
    OBJ_DATA: "'NO'",
    CENTER: "'coord@301'",
    COORD_TYPE: "'GEODETIC'",
    SITE_COORD: "'0,-89.5,0'",
    START_TIME: "'2026-11-15'",
    STOP_TIME: "'2026-11-16'",
    STEP_SIZE: "'6 h'",
    QUANTITIES: "'4'",
  });
  try {
    const response = await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?${params.toString()}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error(String(response.status));
    const payload = (await response.json()) as { result?: string };
    const table = payload.result?.split("$$SOE")[1]?.split("$$EOE")[0];
    if (!table) throw new Error("no ephemeris");
    const line = table.trim().split(/\r?\n/).find((row) => /-?\d+\.\d+/.test(row));
    const numbers = line?.match(/-?\d+\.\d+/g);
    if (!numbers || numbers.length < 2) throw new Error("no angles");
    const azimuth = Number(numbers[numbers.length - 2]);
    const elevation = Number(numbers[numbers.length - 1]);
    if (!Number.isFinite(azimuth) || !Number.isFinite(elevation)) throw new Error("bad angles");
    return Response.json({
      source: "live",
      azimuth,
      elevation,
      note: "Earth, seen from a south-polar lunar site, 15 November 2026. JPL Horizons.",
    });
  } catch {
    return Response.json({ source: "snapshot", ...MOON_SNAPSHOT });
  }
}
