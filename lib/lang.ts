import { BASE_PATH } from '@/lib/base';

export type Lang = 'pt' | 'en';

// Language follows where the visitor is, read from the device time zone (no request leaves the browser).
// Portuguese for Brazil, Portugal, Angola, Mozambique, Cape Verde, Guinea-Bissau, São Tomé and East Timor.
export const PT_TIME_ZONES =
  '^(America\\/(Araguaina|Bahia|Belem|Boa_Vista|Campo_Grande|Cuiaba|Eirunepe|Fortaleza|Maceio|Manaus|Noronha|Porto_Acre|Porto_Velho|Recife|Rio_Branco|Santarem|Sao_Paulo)|Brazil\\/\\w+|Portugal|Europe\\/Lisbon|Atlantic\\/(Azores|Madeira|Cape_Verde)|Africa\\/(Luanda|Maputo|Bissau|Sao_Tome)|Asia\\/Dili)$';

/** True when the time zone opens the home in Portuguese; an unreadable zone also does. */
export function isPortugueseTimeZone(tz: string): boolean {
  return !tz || new RegExp(PT_TIME_ZONES).test(tz);
}

/**
 * Inline script for the <head> of each home version. It runs before the first paint:
 * marks <html> with .js, drops the key left by the old language switch and, when the
 * time zone asks for the other language, replaces the URL with that version.
 */
export function langRedirectScript(lang: Lang): string {
  const target = JSON.stringify(lang === 'pt' ? `${BASE_PATH}/en/` : `${BASE_PATH}/`);
  const wantsOther = lang === 'pt' ? '!pt' : 'pt';
  return `(function(){var d=document.documentElement;d.classList.add('js');var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}var pt=!tz||new RegExp(${JSON.stringify(PT_TIME_ZONES)}).test(tz);try{localStorage.removeItem('egc-lang')}catch(e){}if(${wantsOther})location.replace(${target}+location.search+location.hash)})();`;
}
