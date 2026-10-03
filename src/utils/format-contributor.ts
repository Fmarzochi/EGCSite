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

const STATS_REGEX = /(?:^|[.;,\s]+)(\d+)\s+commits?(?:\s+and\s+\+?([\d,]+)\s+lines)?(?:\s+in\s+([A-Za-z]+\s+\d{4}))?\.\s*$/i;

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

  const textWithoutStats = text.slice(0, match.index).trim().replace(/[.;,]+$/, '');
  return {
    stats: { commits, additions, period },
    textWithoutStats,
  };
}

/**
 * Splits text into high-level accomplishment items while preserving nested parentheses
 * (preventing accidental splits inside tool lists, PR notes, or functions).
 */
export function splitTopLevelItems(text: string): string[] {
  if (!text) return [];

  // If text has semicolons, they are deliberate high-level separators
  if (text.includes(';')) {
    return text
      .split(/;\s+/)
      .map(p => p.trim().replace(/^(?:and|also|then)\s+/i, '').replace(/[.;]+$/, ''))
      .filter(p => p.length > 0);
  }

  // Parse respecting parentheses depth
  const items: string[] = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '(' || char === '[' || char === '{') {
      parenDepth++;
      current += char;
    } else if (char === ')' || char === ']' || char === '}') {
      if (parenDepth > 0) parenDepth--;
      current += char;
    } else if (parenDepth === 0) {
      // Check for ", and ", ", then ", or ", also "
      const rest = text.slice(i);
      const andMatch = rest.match(/^,\s+(?:and|then|also)\s+/i);
      if (andMatch) {
        if (current.trim()) items.push(current.trim());
        current = '';
        i += andMatch[0].length - 1;
        continue;
      }

      // Check for top-level comma
      if (char === ',') {
        if (current.trim().length >= 15) {
          items.push(current.trim());
          current = '';
          continue;
        }
      }
      current += char;
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    items.push(current.trim());
  }

  return items
    .map(item => item.replace(/^(?:and|then|also)\s+/i, '').trim().replace(/[.;]+$/, ''))
    .filter(item => item.length > 0);
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
