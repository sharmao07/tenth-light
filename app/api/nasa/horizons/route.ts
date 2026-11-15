import { NextResponse } from 'next/server';
import { HORIZONS_MOON_SNAPSHOT, ARCHIVE_SNAPSHOT_DATE } from '@/lib/nasaSnapshots';
import { parseHorizonsEphemeris } from '@/lib/horizonsParser';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const horizonsUrl =
      "https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND=%27399%27&CENTER=%27coord@301%27&COORD_TYPE=%27GEODETIC%27&SITE_COORD=%270,-89,0%27&MAKE_EPHEM=%27YES%27&EPHEM_TYPE=%27OBSERVER%27&QUANTITIES=%274%27&STEP_SIZE=%271d%27&START_TIME=%272026-11-15%27&STOP_TIME=%272026-11-16%27";

    const res = await fetch(horizonsUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const parsed = parseHorizonsEphemeris(data.result || '');
      if (parsed) {
        return NextResponse.json({
          source: 'live',
          data: {
            target: 'Earth (399)',
            observer: 'South Polar Lunar Aitken Basin (coord@301 0,-89,0)',
            azimuthDeg: parsed.azimuthDeg,
            elevationDeg: parsed.elevationDeg,
            targetToleranceDeg: 14,
            epoch: parsed.epoch,
          },
        });
      }
    }
  } catch {
    // Timeout or network error - fall back to verified archive snapshot
  } finally {
    clearTimeout(timeoutId);
  }

  return NextResponse.json({
    source: 'snapshot',
    snapshotDate: ARCHIVE_SNAPSHOT_DATE,
    data: HORIZONS_MOON_SNAPSHOT,
  });
}
