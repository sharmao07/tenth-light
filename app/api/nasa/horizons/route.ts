import { NextResponse } from 'next/server';
import { HORIZONS_MOON_SNAPSHOT, ARCHIVE_SNAPSHOT_DATE } from '@/lib/nasaSnapshots';
import { parseHorizonsEphemeris } from '@/lib/horizonsParser';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    // Rolling 24-hour UTC ephemeris window
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const startDate = now.toISOString().slice(0, 10);
    const stopDate = tomorrow.toISOString().slice(0, 10);

    // JPL Horizons Observer Ephemeris Query:
    // COMMAND='399' (Target: Earth)
    // CENTER='coord@301' (Center: Coordinate site on Moon body 301)
    // COORD_TYPE='GEODETIC' (JPL Geodetic standard: East Longitude, Latitude, Altitude in km above ellipsoid)
    // SITE_COORD='0,-89,0' (0 deg East, -89 deg South polar Aitken rim, 0 km altitude)
    const horizonsUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND=%27399%27&CENTER=%27coord@301%27&COORD_TYPE=%27GEODETIC%27&SITE_COORD=%270,-89,0%27&MAKE_EPHEM=%27YES%27&EPHEM_TYPE=%27OBSERVER%27&QUANTITIES=%274%27&STEP_SIZE=%271d%27&START_TIME=%27${startDate}%27&STOP_TIME=%27${stopDate}%27`;

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
            observer: 'Lunar South Pole (coord@301 0°E, -89°S, 0 km alt geodetic)',
            coordinateConvention: 'JPL GEODETIC: East Longitude (deg), Latitude (deg), Altitude (km)',
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
