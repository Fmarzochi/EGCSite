// '/EGCSite' on GitHub Pages, '' on Vercel previews (set in next.config.ts).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const PRODUCTION_BASE = 'https://fmarzochi.github.io/EGCSite/';

/** Prefixes the base path for raw <img src> and <a href>; next/link already does this on its own. */
export function withBase(path: string): string {
  return `${BASE_PATH}/${path.replace(/^\/+/, '')}`;
}

/** Canonical URL of a route, always on GitHub Pages, including on Vercel previews. */
export function canonicalUrl(route: string): string {
  return new URL(route.replace(/^\/+/, ''), PRODUCTION_BASE).href;
}
