import { NextResponse } from 'next/server';
import { NASA_IMAGE_PLATES, ARCHIVE_SNAPSHOT_DATE } from '@/lib/nasaSnapshots';

export async function GET() {
  const fallbackPlate = NASA_IMAGE_PLATES[10];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    // Calling epic.gsfc.nasa.gov directly as requested (not api.nasa.gov proxy)
    const epicUrl = 'https://epic.gsfc.nasa.gov/api/natural';
    const res = await fetch(epicUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const latest = data[0];
        const dateStr = latest.date.split(' ')[0].replaceAll('-', '/');
        const imgName = latest.image;
        const jpgUrl = `https://epic.gsfc.nasa.gov/archive/natural/${dateStr}/jpg/${imgName}.jpg`;

        return NextResponse.json({
          source: 'live',
          data: {
            url: jpgUrl,
            caption: `EPIC DSCOVR natural color Earth captured on ${latest.date}`,
            credit: 'NASA/DSCOVR EPIC Team. Unaltered.',
          },
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
    data: {
      url: fallbackPlate.url,
      caption: fallbackPlate.caption,
      credit: fallbackPlate.credit,
    },
  });
}
