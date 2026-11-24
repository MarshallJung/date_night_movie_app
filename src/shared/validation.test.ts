import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractJsonObject,
  isSafeHttpUrl,
  isTokenSpoilerFree,
  matchPeriodRomancesForServices,
  normalizeStreamingServices,
  sanitizeSalutation,
  validateMovieQuery,
  validateQuizAnswers,
} from './validation';

test('validateMovieQuery rejects empty or overly short queries and normalizes whitespace', () => {
  assert.equal(validateMovieQuery('').ok, false);
  assert.equal(validateMovieQuery('a').ok, false);
  const valid = validateMovieQuery('  The   Beekeeper  ');
  assert.equal(valid.ok, true);
  assert.equal(valid.query, 'The Beekeeper');
});

test('isSafeHttpUrl allows http/https and rejects javascript/data schemes', () => {
  assert.equal(isSafeHttpUrl('https://en.wikipedia.org/wiki/The_Beekeeper'), true);
  assert.equal(isSafeHttpUrl('http://example.com'), true);
  assert.equal(isSafeHttpUrl('javascript:alert(1)'), false);
  assert.equal(isSafeHttpUrl('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isSafeHttpUrl('not-a-url'), false);
});

test('sanitizeSalutation trims and defaults cleanly', () => {
  assert.equal(sanitizeSalutation('  My Dearest Clara \n'), 'My Dearest Clara');
  assert.equal(sanitizeSalutation('   '), 'Dearest');
  assert.equal(sanitizeSalutation(null), 'Dearest');
});

test('normalizeStreamingServices filters invalid ids and deduplicates', () => {
  assert.deepEqual(
    normalizeStreamingServices(['prime', 'netflix', 'prime', 'fake-service']),
    ['prime', 'netflix'],
  );
  assert.deepEqual(normalizeStreamingServices([]), ['prime']);
});

test('validateQuizAnswers requires all four fields', () => {
  const bad = validateQuizAnswers({ scandal: 'a', heroMood: 'b' });
  assert.equal(bad.ok, false);
  const good = validateQuizAnswers({
    scandal: 'swindled-benefactress',
    heroMood: 'taciturn-principled',
    setting: 'country-apiary',
    resolution: 'righteous-reckoning',
  });
  assert.equal(good.ok, true);
});

test('extractJsonObject parses fenced and raw JSON reliably', () => {
  const parsed = extractJsonObject<{ title: string }>(
    'Here is your result:\n```json\n{"title": "The Beekeeper"}\n```',
  );
  assert.equal(parsed?.title, 'The Beekeeper');
  assert.equal(extractJsonObject('no json here'), null);
});

test('isTokenSpoilerFree detects leaked title words and passes opaque tokens', () => {
  assert.equal(isTokenSpoilerFree('abc_beekeeper_123', 'The Beekeeper'), false);
  assert.equal(isTokenSpoilerFree('x9K2mPq8vR1tL0nW', 'The Beekeeper'), true);
});

test('matchPeriodRomancesForServices prioritizes matching streaming services', () => {
  const picks = matchPeriodRomancesForServices(['paramount'], 3);
  assert.equal(picks.length, 3);
  assert.equal(picks[0].title, 'Becoming Jane');
});
