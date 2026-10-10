export function getBase(): string {
  const b = import.meta.env.BASE_URL;
  return b.endsWith('/') ? b : b + '/';
}

export const PRODUCTION_BASE = 'https://fmarzochi.github.io/EGCSite/';

export function getCanonicalUrl(pageUrl: URL): string {
  const base = getBase();
  const route = pageUrl.pathname === base.slice(0, -1)
    ? ''
    : pageUrl.pathname.startsWith(base)
      ? pageUrl.pathname.slice(base.length)
      : pageUrl.pathname.replace(/^\/+/, '');
  return new URL(route, PRODUCTION_BASE).href;
}
