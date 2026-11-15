export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "earth";
  const plates: Record<string, { q: string; title: string }> = {
    enceladus: { q: "Enceladus plume Cassini", title: "Enceladus plume" },
    pluto: { q: "Pluto New Horizons", title: "Pluto" },
    mars: { q: "Perseverance Mars surface", title: "Mars" },
    earth: { q: "Earth from space Apollo", title: "Earth" },
    moon: { q: "Apollo lunar surface astronaut", title: "The Moon" },
    ceres: { q: "Ceres Dawn spacecraft", title: "Ceres" },
    jupiter: { q: "Jupiter Juno", title: "Jupiter" },
    uranus: { q: "Uranus Voyager 2", title: "Uranus" },
    neptune: { q: "Neptune Voyager 2", title: "Neptune" },
  };
  const plate = plates[id] ?? plates.earth;
  try {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(plate.q)}&media_type=image`,
      { signal: AbortSignal.timeout(12000) },
    );
    if (!response.ok) throw new Error(String(response.status));
    const payload = (await response.json()) as {
      collection?: {
        items?: {
          data?: { title?: string; nasa_id?: string }[];
          links?: { href?: string }[];
        }[];
      };
    };
    const item = payload.collection?.items?.find((entry) => entry.links?.[0]?.href);
    const href = item?.links?.[0]?.href;
    if (!href) throw new Error("no image");
    return Response.json({
      source: "live",
      href,
      title: item?.data?.[0]?.title ?? plate.title,
      nasaId: item?.data?.[0]?.nasa_id ?? "",
    });
  } catch {
    return Response.json({ source: "snapshot", href: null, title: plate.title, nasaId: "" });
  }
}
