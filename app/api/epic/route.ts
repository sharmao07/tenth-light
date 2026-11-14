type EpicImage = { image?: string; caption?: string; date?: string };

export async function GET() {
  try {
    const response = await fetch("https://epic.gsfc.nasa.gov/api/natural", {
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error(String(response.status));
    const list = (await response.json()) as EpicImage[];
    const latest = list[0];
    if (!latest?.image || !latest.date) throw new Error("empty");
    const [year, month, day] = latest.date.slice(0, 10).split("-");
    return Response.json({
      source: "live",
      caption: latest.caption ?? "Earth, from EPIC",
      date: latest.date,
      image: `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${latest.image}.jpg`,
    });
  } catch {
    return Response.json({ source: "snapshot", caption: "", date: "", image: null });
  }
}
