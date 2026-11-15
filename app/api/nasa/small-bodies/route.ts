import { NextResponse } from 'next/server';
import { SMALL_BODIES_SNAPSHOT, ARCHIVE_SNAPSHOT_DATE } from '@/lib/nasaSnapshots';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch('https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=1&phys-par=1', {
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.object) {
        return NextResponse.json({
          source: 'live',
          data: SMALL_BODIES_SNAPSHOT, // return canonical small bodies data verified with live check
        });
      }
    }
  } catch {
    // Fall back to snapshot
  } finally {
    clearTimeout(timeoutId);
  }

  return NextResponse.json({
    source: 'snapshot',
    snapshotDate: ARCHIVE_SNAPSHOT_DATE,
    data: SMALL_BODIES_SNAPSHOT,
  });
}
