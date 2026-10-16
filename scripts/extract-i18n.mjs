// Port tool: copies window.EGC_I18N out of the Astro home (src/pages/index.astro) into
// dictionaries/pt.json and dictionaries/en.json, byte for byte, so no text is retyped.
// Usage: node scripts/extract-i18n.mjs <path to index.astro> [output dir]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [, , source, outDir = 'dictionaries'] = process.argv;
if (!source) {
  console.error('usage: node scripts/extract-i18n.mjs <path to index.astro> [output dir]');
  process.exit(1);
}

const text = readFileSync(source, 'utf8');
const marker = 'window.EGC_I18N = ';
const start = text.indexOf(marker);
if (start < 0) throw new Error(`${marker} not found in ${source}`);

// Walk the object literal to its closing brace, skipping braces inside strings.
let i = start + marker.length;
let depth = 0;
let inString = false;
for (; i < text.length; i++) {
  const ch = text[i];
  if (inString) {
    if (ch === '\\') i++;
    else if (ch === '"') inString = false;
  } else if (ch === '"') inString = true;
  else if (ch === '{') depth++;
  else if (ch === '}' && --depth === 0) break;
}

const dictionaries = JSON.parse(text.slice(start + marker.length, i + 1));
mkdirSync(outDir, { recursive: true });
for (const [lang, entries] of Object.entries(dictionaries)) {
  writeFileSync(join(outDir, `${lang}.json`), `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`${lang}: ${Object.keys(entries).length} keys`);
}
