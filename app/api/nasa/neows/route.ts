import { NextResponse } from 'next/server';
import { NEOWS_SNAPSHOT, ARCHIVE_SNAPSHOT_DATE, NeoObject } from '@/lib/nasaSnapshots';

export async function GET() {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';

  if (!apiKey || apiKey === 'DEMO_KEY') {
    return NextResponse.json({
      source: 'snapshot',
      snapshotDate: ARCHIVE_SNAPSHOT_DATE,
      data: NEOWS_SNAPSHOT,
      reason: 'DEMO_KEY or unconfigured key: using verified archival snapshot',
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const today = new Date().toISOString().split('T')[0];
    const neowsUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(neowsUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const neoList: NeoObject[] = [];
      const days = Object.keys(data.near_earth_objects || {});
      for (const d of days) {
        for (const item of data.near_earth_objects[d]) {
          neoList.push({
            id: item.id,
            name: item.name,
            estimatedDiameterMeters: Math.round(
              (item.estimated_diameter?.meters?.estimated_diameter_max || 100)
            ),
            relativeVelocityKmh: Math.round(
              parseFloat(item.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || '50000')
            ),
            relativeVelocityKps: Math.round(
              parseFloat(item.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || '15') * 10
            ) / 10,
            isPotentiallyHazardous: !!item.is_potentially_hazardous_asteroid,
            missDistanceKm: Math.round(
              parseFloat(item.close_approach_data?.[0]?.miss_distance?.kilometers || '1000000')
            ),
          });
        }
      }

      if (neoList.length > 0) {
        return NextResponse.json({
          source: 'live',
          data: neoList,
        });
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
    data: NEOWS_SNAPSHOT,
  });
}
