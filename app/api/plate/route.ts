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
  const fallback: Record<string, string> = {
    moon: "https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg",
    mars: "https://images-assets.nasa.gov/image/PIA00405/PIA00405~medium.jpg",
    earth: "https://images-assets.nasa.gov/image/PIA00148/PIA00148~medium.jpg",
    ceres: "https://images-assets.nasa.gov/image/PIA20180/PIA20180~medium.jpg",
    jupiter: "https://images-assets.nasa.gov/image/PIA21974/PIA21974~medium.jpg",
    uranus: "https://images-assets.nasa.gov/image/PIA18182/PIA18182~medium.jpg",
    neptune: "https://images-assets.nasa.gov/image/PIA01492/PIA01492~medium.jpg",
    enceladus: "https://images-assets.nasa.gov/image/PIA11688/PIA11688~medium.jpg",
    pluto: "https://images-assets.nasa.gov/image/PIA19952/PIA19952~medium.jpg",
  };
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
    return Response.json({
      source: "snapshot",
      href: fallback[id] ?? fallback.earth,
      title: plate.title,
      nasaId: "",
    });
  }
}
