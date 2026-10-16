export type Lang = 'pt' | 'en';

// The address decides the language on every page, the home included: English at the current
// addresses (/), Portuguese under /pt/. No time zone detection and no redirect.

/**
 * Inline script for the <head> of each home version. It runs before the first paint: marks
 * <html> with .js and drops the key left by the old language switch.
 */
export function homeBootScript(): string {
  return `(function(){document.documentElement.classList.add('js');try{localStorage.removeItem('egc-lang')}catch(e){}})();`;
}
