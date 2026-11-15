import { NextResponse } from 'next/server';
import { EXOPLANET_SNAPSHOT, ARCHIVE_SNAPSHOT_DATE } from '@/lib/nasaSnapshots';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const query =
      "select pl_name,pl_rade,pl_bmasse,pl_orbper,pl_insol,pl_eqt,sy_dist,disc_year,discoverymethod from pscomppars where pl_name in ('TOI-700 b','TOI-700 c','TOI-700 d','TOI-700 e') order by pl_name";
    const tapUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;

    const res = await fetch(tapUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const liveData = await res.json();
      if (Array.isArray(liveData) && liveData.length > 0) {
        return NextResponse.json({
          source: 'live',
          data: liveData,
          snapshotFallback: EXOPLANET_SNAPSHOT,
        });
      }
    }
  } catch {
    // Timeout or network error - use archival snapshot
  } finally {
    clearTimeout(timeoutId);
  }

  return NextResponse.json({
    source: 'snapshot',
    snapshotDate: ARCHIVE_SNAPSHOT_DATE,
    data: EXOPLANET_SNAPSHOT,
  });
}
