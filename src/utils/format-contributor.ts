export interface ContributorStats {
  commits: number;
  additions?: number;
  period?: string;
}

export interface FormattedContribution {
  /** Numeric statistics extracted from text (commits, additions, month) */
  stats: ContributorStats | null;
  /** Cleaned text with trailing stats removed */
  cleanText: string;
  /** Individual accomplishment items / topics */
  items: string[];
  /** Whether the text was structured into multiple items */
  isStructured: boolean;
  /** Original unformatted text for fallback */
  rawText: string;
}

const STATS_REGEX = /(?:^|\s+)(\d+)\s+commits?(?:\s+and\s+\+?([\d,]+)\s+lines)?(?:\s+in\s+([A-Za-z]+\s+\d{4}))?\.\s*$/i;

/**
 * Extracts trailing commit and lines statistics (e.g. "4 commits and +2,394 lines in September 2026.")
 */
export function parseStats(text: string): { stats: ContributorStats | null; textWithoutStats: string } {
  if (!text) return { stats: null, textWithoutStats: '' };

  const match = text.match(STATS_REGEX);
  if (!match) {
    return { stats: null, textWithoutStats: text.trim() };
  }

  const commits = parseInt(match[1], 10);
  const additions = match[2] ? parseInt(match[2].replace(/,/g, ''), 10) : undefined;
  const period = match[3] || undefined;

  const textWithoutStats = text.slice(0, match.index).trim();
  return {
    stats: { commits, additions, period },
    textWithoutStats,
  };
}

/**
 * Only explicit top-level semicolons separate accomplishments. Commas and conjunctions
 * may be part of a single fact, so splitting them would change the author's meaning.
 */
export function splitTopLevelItems(text: string): string[] {
  if (!text) return [];
  const items: string[] = [];
  let current = '';
  let parenDepth = 0;
  let inUrl = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (!inUrl && /^https?:\/\//i.test(text.slice(i))) inUrl = true;
    if (inUrl && /\s/.test(char)) inUrl = false;
    if (char === '(' || char === '[' || char === '{') {
      parenDepth++;
    } else if (char === ')' || char === ']' || char === '}') {
      if (parenDepth > 0) parenDepth--;
    }
    current += char;
    if (char === ';' && parenDepth === 0 && !inUrl && /\s/.test(text[i + 1] ?? '')) {
      items.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) items.push(current.trim());
  return items;
}

/**
 * Formats a contributor's highlight/reason into an organized presentation model.
 */
export function formatContribution(rawText: string): FormattedContribution {
  if (!rawText || typeof rawText !== 'string') {
    return {
      stats: null,
      cleanText: '',
      items: [],
      isStructured: false,
      rawText: rawText || '',
    };
  }

  const { stats, textWithoutStats } = parseStats(rawText);
  const clean = textWithoutStats || rawText;
  const rawItems = splitTopLevelItems(clean);

  // If text is short (< 70 chars) or only 1 item, keep as clean prose
  const isStructured = rawItems.length >= 2 && clean.length > 70;

  return {
    stats,
    cleanText: clean,
    items: isStructured ? rawItems : [clean],
    isStructured,
    rawText,
  };
}
