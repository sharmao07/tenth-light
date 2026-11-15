import { NextResponse } from 'next/server';
import { HORIZONS_MOON_SNAPSHOT, ARCHIVE_SNAPSHOT_DATE } from '@/lib/nasaSnapshots';

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
      const textOutput = data.result || '';
      // Look for azimuth and elevation in $$SOE ... $$EOE
      // Format: YYYY-Mon-DD HH:MM [flags] Azi Elev ...
      const soeIdx = textOutput.indexOf('$$SOE');
      const eoeIdx = textOutput.indexOf('$$EOE');
      if (soeIdx !== -1 && eoeIdx !== -1) {
        const block = textOutput.substring(soeIdx + 5, eoeIdx).trim();
        const lines = block.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
        if (lines.length > 0) {
          const firstLine = lines[0];
          const epochMatch = firstLine.match(/\d{4}-[A-Za-z]{3}-\d{2}\s+\d{2}:\d{2}/);
          // Match all float values (handles optional presence flags like '*' or 'm')
          const numbers = firstLine.match(/-?\d+\.\d+/g);
          if (numbers && numbers.length >= 2) {
            const az = parseFloat(numbers[0]);
            const el = parseFloat(numbers[1]);
            if (!isNaN(az) && !isNaN(el)) {
              return NextResponse.json({
                source: 'live',
                data: {
                  target: 'Earth (399)',
                  observer: 'South Polar Lunar Aitken Basin (coord@301 0,-89,0)',
                  azimuthDeg: Math.round(az * 10) / 10,
                  elevationDeg: Math.round(el * 10) / 10,
                  targetToleranceDeg: 14,
                  epoch: epochMatch ? epochMatch[0] : '2026-Nov-15 00:00',
                },
              });
            }
          }
        }
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
