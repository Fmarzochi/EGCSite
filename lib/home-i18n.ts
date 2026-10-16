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
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value.replace(TOOL_COUNT, count)]),
  );
}

// Texts added after the port, kept apart so dictionaries/*.json stay verbatim copies of the
// Astro source: the home menu now lists the same pages as the inner Navbar, and the demo section
// links to the recorded demo on YouTube.
const ADDED: Record<Lang, HomeDictionary> = {
  pt: {
    'nav.home': 'Início',
    'a.discord': 'Discord do EGC (abre em nova aba)',
    'demo.videoTitle': 'Veja a gravação real',
    'demo.videoLede': 'A simulação acima explica o fluxo. Para ver o EGC de verdade, assista à demonstração gravada.',
    'demo.videoNote': 'Ao reproduzir, o vídeo é carregado do YouTube.',
    'demo.videoPlay': 'Reproduzir a demonstração gravada',
    'demo.videoFrame': 'Demonstração gravada do EGC',
  },
  en: {
    'nav.home': 'Home',
    'a.discord': 'EGC Discord (opens in a new tab)',
    'demo.videoTitle': 'Watch the real recording',
    'demo.videoLede': 'The simulation above explains the flow. To see EGC for real, watch the recorded demo.',
    'demo.videoNote': 'When you press play, the video loads from YouTube.',
    'demo.videoPlay': 'Play the recorded demo',
    'demo.videoFrame': 'Recorded demo of EGC',
  },
};

const DICTIONARIES: Record<Lang, HomeDictionary> = {
  pt: withToolCount({ ...pt, ...ADDED.pt }),
  en: withToolCount({ ...en, ...ADDED.en }),
};

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
