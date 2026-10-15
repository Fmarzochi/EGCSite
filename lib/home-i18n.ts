import en from '@/dictionaries/en.json';
import pt from '@/dictionaries/pt.json';
import { integrations } from '@/data/integrations';
import type { Lang } from '@/lib/lang';

// Texts of the home, copied from window.EGC_I18N in src/pages/index.astro by
// scripts/extract-i18n.mjs. The tool count in them follows data/integrations.ts.

export type HomeDictionary = Record<string, string>;

const TOOL_COUNT = /\b28(?= (ferramentas|tools|AI coding tools)\b)/g;

function withToolCount(dict: HomeDictionary): HomeDictionary {
  const count = String(integrations.length);
  return Object.fromEntries(Object.entries(dict).map(([key, value]) => [key, value.replace(TOOL_COUNT, count)]));
}

const DICTIONARIES: Record<Lang, HomeDictionary> = { pt: withToolCount(pt), en: withToolCount(en) };

export function homeDictionary(lang: Lang): HomeDictionary {
  return DICTIONARIES[lang];
}

/** Text lookup that fails the build on a missing key instead of rendering it. */
export function homeTranslator(lang: Lang): (key: string) => string {
  const dict = DICTIONARIES[lang];
  return (key) => {
    const value = dict[key];
    if (value === undefined) throw new Error(`Missing home text "${key}" (${lang})`);
    return value;
  };
}
