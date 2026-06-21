// ============================================================================
//  Image helpers — sized URLs, blur data URLs, lazy loading utilities
// ============================================================================

/**
 * Build a sized Unsplash URL from any Unsplash photo URL.
 * Replaces the existing query params with the requested width/quality.
 * Smaller widths load dramatically faster on cards / thumbnails.
 */
export function sizedImage(url: string, width: number, quality = 75): string {
  if (!url) return url;
  // Strip existing query string and apply new params
  const base = url.split("?")[0];
  return `${base}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

/**
 * Card thumbnail URL — optimized for ~600px display (2x for retina).
 * Much faster than the default w=1200.
 */
export function cardImage(url: string): string {
  return sizedImage(url, 640, 70);
}

/**
 * Detail/gallery image URL — higher res for the property detail page.
 */
export function detailImage(url: string): string {
  return sizedImage(url, 1200, 78);
}

/**
 * Hero (LCP) image URL — full width but optimized.
 */
export function heroImage(url: string): string {
  return sizedImage(url, 1920, 80);
}

/**
 * Tiny image URL for blur placeholders (10px wide, very low quality).
 * Used as `placeholder="blur"` `blurDataURL` in next/image.
 */
export function blurImage(url: string): string {
  return sizedImage(url, 8, 20);
}

/**
 * Generate a solid-color blur data URL (no network request).
 * Used when we don't want to fetch a tiny version of the image.
 */
export function solidBlur(hex = "e5e7eb"): string {
  // 8x6 SVG → base64 data URL
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='6'><rect width='8' height='6' fill='#${hex}'/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * A neutral shimmer blur data URL — works for any image, light theme.
 */
export const SHIMMER_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjYiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjYiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=";
