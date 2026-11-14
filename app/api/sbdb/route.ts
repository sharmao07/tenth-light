type Element = { name?: string; value?: string };
type Phys = { name?: string; value?: string };

const TARGETS = ["Ceres", "Vesta", "Pallas"];

async function one(name: string) {
  const response = await fetch(
    `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(name)}&phys-par=1`,
    { signal: AbortSignal.timeout(12000) },
  );
  if (!response.ok) throw new Error(String(response.status));
  const payload = (await response.json()) as {
    object?: { fullname?: string; orbit_class?: { name?: string } };
    phys_par?: Phys[];
    orbit?: { elements?: Element[] };
  };
  const diameter = payload.phys_par?.find((item) => item.name === "diameter");
  return {
    name: payload.object?.fullname ?? name,
    className: payload.object?.orbit_class?.name ?? "Small body",
    diameterKm: diameter?.value ? Number(diameter.value) : null,
  };
}

const SNAPSHOT = [
  { name: "1 Ceres", className: "Main-belt Asteroid", diameterKm: 939.4 },
  { name: "4 Vesta", className: "Main-belt Asteroid", diameterKm: 525.4 },
  { name: "2 Pallas", className: "Main-belt Asteroid", diameterKm: 511 },
];

export async function GET() {
  try {
    const bodies = await Promise.all(TARGETS.map((name) => one(name)));
    if (bodies.some((body) => body.diameterKm == null)) throw new Error("missing diameter");
    return Response.json({ source: "live", bodies });
  } catch {
    return Response.json({ source: "snapshot", bodies: SNAPSHOT });
  }
}
