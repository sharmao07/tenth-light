import { NextRequest, NextResponse } from 'next/server';
import { NASA_IMAGE_PLATES, ARCHIVE_SNAPSHOT_DATE } from '@/lib/nasaSnapshots';

const WHITELIST_QUERIES: Record<string, number> = {
  moon: 1,
  mars: 2,
  ceres: 3,
  jupiter: 4,
  enceladus: 5,
  uranus: 6,
  neptune: 7,
  pluto: 8,
  heliopause: 9,
  earth: 10,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();

  const stopIdx = WHITELIST_QUERIES[q];
  if (!stopIdx) {
    return NextResponse.json({ error: 'Search term not in whitelist' }, { status: 400 });
  }

  const fallbackPlate = NASA_IMAGE_PLATES[stopIdx];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const searchUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image`;
    const res = await fetch(searchUrl, {
      signal: controller.signal,
      next: { revalidate: 86400 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const items = data.collection?.items || [];
      if (items.length > 0) {
        // Find first item with preview or medium href
        const item = items[0];
        const link = item.links?.find((l: { href?: string }) => l.href?.endsWith('.jpg'))?.href;
        const caption = item.data?.[0]?.title || fallbackPlate.caption;
        if (link) {
          return NextResponse.json({
            source: 'live',
            data: {
              stopIndex: stopIdx,
              locationName: fallbackPlate.locationName,
              url: link,
              caption,
              credit: 'NASA. Unaltered.',
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
    data: fallbackPlate,
  });
}
