/**
 * Extract ASIN from various Amazon URL formats.
 *
 * Amazon ASINs are 10-character alphanumeric strings.
 * Supports:
 *   - /dp/ASIN
 *   - /product/ASIN
 *   - /gp/product/ASIN
 *   - dp/B0XXXXX?tag=...
 *   - amzn.com/dp/ASIN
 *   - amzn/dp/ASIN (short links)
 */
export function extractAsin(url: string): string | null {
  try {
    // Normalize: ensure URL has protocol
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(normalized);
    const path = parsed.pathname;

    // Pattern 1: /dp/ASIN or /product/ASIN or /gp/product/ASIN
    const dpMatch = path.match(/\/(?:dp|product|gp\/product)\/([A-Z0-9]{10})/i);
    if (dpMatch) return dpMatch[1].toUpperCase();

    // Pattern 2: ASIN in path as 10-char segment
    const segmentMatch = path.match(/\/([A-Z0-9]{10})(?:\/|$)/i);
    if (segmentMatch) return segmentMatch[1].toUpperCase();

    // Pattern 3: Some URL shorteners embed it in query params
    const asinParam = parsed.searchParams.get("asin") || parsed.searchParams.get("ASIN");
    if (asinParam && /^[A-Z0-9]{10}$/i.test(asinParam)) {
      return asinParam.toUpperCase();
    }

    return null;
  } catch {
    return null;
  }
}

export function isValidAmazonUrl(url: string): boolean {
  try {
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(normalized);
    const host = parsed.hostname.toLowerCase();
    return host.includes("amazon.") || host.includes("amzn.");
  } catch {
    return false;
  }
}
