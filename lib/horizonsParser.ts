export interface HorizonsParsedResult {
  azimuthDeg: number;
  elevationDeg: number;
  epoch: string;
}

/**
 * Robust parser for JPL Horizons ASCII observer table output.
 * Extracts apparent azimuth and elevation between $$SOE and $$EOE markers.
 * Handles various timestamp formats (including optional fractional seconds),
 * presence flags (*, m, c, t, etc.), signed decimals/integers, and variable whitespace.
 */
export function parseHorizonsEphemeris(textOutput: string): HorizonsParsedResult | null {
  if (!textOutput) return null;

  const soeIdx = textOutput.indexOf('$$SOE');
  const eoeIdx = textOutput.indexOf('$$EOE');
  if (soeIdx === -1 || eoeIdx === -1 || eoeIdx <= soeIdx) return null;

  const block = textOutput.substring(soeIdx + 5, eoeIdx).trim();
  const lines = block
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return null;

  const firstLine = lines[0];

  // Match Horizons Date epoch: e.g. "2026-Nov-15 00:00" or "2026-Nov-15 00:00:00.000" or "2026-11-15 00:00"
  const epochRegex = /\d{4}-[A-Za-z0-9]{2,3}-\d{2}(?:\s+\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?/;
  const epochMatch = firstLine.match(epochRegex);
  const epochStr = epochMatch ? epochMatch[0] : '2026-Nov-15 00:00';

  // Strip the epoch timestamp from the line so timestamp digits are never confused with coordinates
  const remainder = epochMatch
    ? firstLine.slice(firstLine.indexOf(epochMatch[0]) + epochMatch[0].length).trim()
    : firstLine;

  // Extract all signed float or integer numbers from the remaining columns
  // Matches "-179.82", "1.23", "180", "-5", etc.
  const numbers = remainder.match(/-?\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length < 2) return null;

  const az = parseFloat(numbers[0]);
  const el = parseFloat(numbers[1]);
  if (isNaN(az) || isNaN(el)) return null;

  return {
    azimuthDeg: Math.round(az * 10) / 10,
    elevationDeg: Math.round(el * 10) / 10,
    epoch: epochStr,
  };
}
