export function nasaKey(): string {
  return process.env.NASA_API_KEY || "DEMO_KEY";
}

export async function nasaFetch(url: string): Promise<Response> {
  const first = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (first.ok || !url.includes("api_key=")) return first;
  if (first.status !== 403 && first.status !== 401 && first.status !== 429) return first;
  const fallback = url.replace(/api_key=[^&]+/, "api_key=DEMO_KEY");
  if (fallback === url) return first;
  return fetch(fallback, { signal: AbortSignal.timeout(12000) });
}
