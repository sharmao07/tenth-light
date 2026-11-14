import { NEO_SNAPSHOT } from "@/lib/game/snapshot";
import { nasaFetch, nasaKey } from "@/lib/server/nasa";

type Approach = { relative_velocity?: { kilometers_per_second?: string } };
type Neo = {
  name?: string;
  is_potentially_hazardous_asteroid?: boolean;
  estimated_diameter?: { kilometers?: { estimated_diameter_max?: number } };
  close_approach_data?: Approach[];
};

export async function GET() {
  const day = new Date().toISOString().slice(0, 10);
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${day}&end_date=${day}&api_key=${nasaKey()}`;
  try {
    const response = await nasaFetch(url);
    if (!response.ok) throw new Error(String(response.status));
    const payload = (await response.json()) as {
      near_earth_objects?: Record<string, Neo[]>;
    };
    const list = Object.values(payload.near_earth_objects ?? {}).flat();
    const bodies = list.slice(0, 12).map((item) => ({
      name: item.name ?? "Unnamed object",
      diameterKm: item.estimated_diameter?.kilometers?.estimated_diameter_max ?? null,
      velocityKmS: Number(item.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second) || null,
      hazardous: Boolean(item.is_potentially_hazardous_asteroid),
    }));
    if (bodies.length === 0) throw new Error("empty feed");
    return Response.json({ source: "live", day, bodies });
  } catch {
    return Response.json({ source: "snapshot", day, bodies: NEO_SNAPSHOT });
  }
}
