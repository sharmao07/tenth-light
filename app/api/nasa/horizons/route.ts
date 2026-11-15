import { NextResponse } from 'next/server';
import { HORIZONS_MOON_SNAPSHOT, ARCHIVE_SNAPSHOT_DATE } from '@/lib/nasaSnapshots';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const horizonsUrl =
      "https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='399'&CENTER='coord@301'&EP_TYPE='OBSERVER'&QUANTITIES='4'&STEP_SIZE='1d'&START_TIME='2026-11-15'&STOP_TIME='2026-11-16'";

    const res = await fetch(horizonsUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const textOutput = data.result || '';
      // Look for azimuth and elevation in $$SOE ... $$EOE
      // Format usually: YYYY-Mon-DD HH:MM ... Azi Elev
      const soeIdx = textOutput.indexOf('$$SOE');
      const eoeIdx = textOutput.indexOf('$$EOE');
      if (soeIdx !== -1 && eoeIdx !== -1) {
        const line = textOutput.substring(soeIdx + 5, eoeIdx).trim();
        const tokens = line.split(/\s+/).filter(Boolean);
        // Usually tokens[3] is Azi, tokens[4] is Elev
        const az = parseFloat(tokens[3]);
        const el = parseFloat(tokens[4]);
        if (!isNaN(az) && !isNaN(el)) {
          return NextResponse.json({
            source: 'live',
            data: {
              target: 'Earth (399)',
              observer: 'South Polar Lunar Site (coord@301)',
              azimuthDeg: Math.round(az * 10) / 10,
              elevationDeg: Math.round(el * 10) / 10,
              targetToleranceDeg: 14,
              epoch: tokens[0] + ' ' + tokens[1],
            },
          });
        }
      }
    }
  } catch {
    // Timeout or network error
  } finally {
    clearTimeout(timeoutId);
  }

  return NextResponse.json({
    source: 'snapshot',
    snapshotDate: ARCHIVE_SNAPSHOT_DATE,
    data: HORIZONS_MOON_SNAPSHOT,
  });
}
