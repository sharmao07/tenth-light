import { ARCHIVE_SNAPSHOT } from "@/lib/game/snapshot";
import { nasaFetch, nasaKey } from "@/lib/server/nasa";

type Row = {
  pl_name?: string;
  pl_rade?: number;
  pl_bmasse?: number;
  pl_orbper?: number;
  pl_insol?: number;
  pl_eqt?: number;
  sy_dist?: number;
  disc_year?: number;
};

const NICK: Record<string, string> = {
  "TOI-700 e": "Harbor",
  "TOI-700 d": "The one you do not fly",
};

export async function GET() {
  const query = encodeURIComponent(
    "select pl_name,pl_rade,pl_bmasse,pl_orbper,pl_insol,pl_eqt,sy_dist,disc_year from pscomppars where pl_name in ('TOI-700 e','TOI-700 d')",
  );
  try {
    const response = await nasaFetch(
      `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${query}&format=json`,
    );
    if (!response.ok) throw new Error(String(response.status));
    const rows = (await response.json()) as Row[];
    const worlds = rows
      .filter((row) => row.pl_name === "TOI-700 e" || row.pl_name === "TOI-700 d")
      .map((row) => ({
        name: row.pl_name,
        nickname: NICK[row.pl_name ?? ""] ?? row.pl_name,
        radius: row.pl_rade,
        mass: row.pl_bmasse ?? null,
        period: row.pl_orbper,
        insolation: row.pl_insol,
        eqt: row.pl_eqt,
        distancePc: row.sy_dist,
        year: row.disc_year,
      }));
    if (worlds.length < 2) throw new Error("incomplete archive row");
    return Response.json({
      source: "live",
      fetchedAt: new Date().toISOString(),
      key: nasaKey() === "DEMO_KEY" ? "DEMO_KEY" : "personal",
      worlds,
    });
  } catch {
    return Response.json({
      source: "snapshot",
      fetchedAt: "2026-11-15",
      key: "none",
      worlds: ARCHIVE_SNAPSHOT,
    });
  }
}
