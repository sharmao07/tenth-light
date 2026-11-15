'use client';

import { useEffect } from 'react';

const NORI_DATA_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA40lEQVR4nGNkIBJw8Qj8ZyABfPvygZEYdUwMAwwYifX5/VtnSDJYUc2EqJBgYhhgwEhtn5MaEkwMgz0EODi5UcTvOQpgVa+0/wOYvn7xIJjW1LcH0z++fx3cIcBCbQNhPicWMDEM9hC4Do1TGPiJSx2BXDBoQ4CRVvmf2PKAiWGwp4Ep87dSZEFOojdeeSaGwR4COQR8QClgYhgudQF6nQADg74uYBrxDmBkGOklISOuEFBQ0cSq4cGd6yg+qW2diNJfaK7OZyTFHCaGAQZMI94BjOT2AQn1eIg1h2mgo4BhxAMAl7VU6cn9cLMAAAAASUVORK5CYII=';

export default function FaviconManager() {
  useEffect(() => {
    try {
      // Remove any conflicting or stale icon link elements
      const existing = document.querySelectorAll("link[rel*='icon']");
      existing.forEach((el) => el.remove());

      // Inject clean, uncached data URI icon
      const link = document.createElement('link');
      link.rel = 'shortcut icon';
      link.type = 'image/png';
      link.href = NORI_DATA_URI;
      document.head.appendChild(link);
    } catch {
      // Ignore if document head is unavailable
    }
  }, []);

  return null;
}
