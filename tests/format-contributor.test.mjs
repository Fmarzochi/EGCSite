import test from 'node:test';
import assert from 'node:assert/strict';
import { formatContribution, parseStats, splitTopLevelItems } from '../src/utils/format-contributor.ts';

test('keeps simple text as prose', () => {
  const text = 'Fixed the installer.';
  assert.deepEqual(formatContribution(text).items, [text]);
});

test('does not turn commas or conjunctions in long prose into list items', () => {
  const text = 'Fixed the installer, including the config parser, and added regression cases for the same failure.';
  const result = formatContribution(text);
  assert.equal(result.isStructured, false);
  assert.equal(result.cleanText, text);
});

test('splits explicit top-level semicolons without dropping punctuation', () => {
  const text = 'Fixed the installer with regression coverage; updated the parser and its documentation.';
  const result = formatContribution(text);
  assert.equal(result.isStructured, true);
  assert.deepEqual(result.items, [
    'Fixed the installer with regression coverage;',
    'updated the parser and its documentation.',
  ]);
  assert.equal(result.items.join(' '), text);
});

test('keeps semicolons inside parentheses and technical references', () => {
  const text = 'Fixed the parser (cases A; B) in PR #1751; added coverage for issue #1666.';
  assert.deepEqual(splitTopLevelItems(text), [
    'Fixed the parser (cases A; B) in PR #1751;',
    'added coverage for issue #1666.',
  ]);
});

test('keeps URLs and their punctuation', () => {
  const text = 'Verified https://example.test/path;a?x=1; then recorded PR #1751.';
  assert.deepEqual(splitTopLevelItems(text), [text]);
});

test('keeps line breaks and special characters', () => {
  const text = 'First line <safe> & ü\nSecond line with #1751.';
  const result = formatContribution(text);
  assert.equal(result.cleanText, text);
  assert.equal(result.rawText, text);
});

test('preserves HTML-like input as plain text for escaped Astro rendering', () => {
  const text = '<img src=x onerror=alert(1)>; <script>alert(1)</script>';
  const result = formatContribution(text);
  assert.equal(result.rawText, text);
  assert.equal(result.cleanText, text);
  assert.equal(result.items.join(' '), text);
});

test('extracts trailing statistics while keeping preceding punctuation', () => {
  const text = 'Fixed the parser. 4 commits and +2,394 lines in September 2026.';
  const result = parseStats(text);
  assert.deepEqual(result.stats, { commits: 4, additions: 2394, period: 'September 2026' });
  assert.equal(result.textWithoutStats, 'Fixed the parser.');
});
