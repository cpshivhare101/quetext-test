const { STOP_WORDS } = require('../config/stopWords');
const {
  NON_LETTER_NUMBER_REPLACE,
  WHITESPACE_COLLAPSE,
  EMPTY_BOTH_STRINGS_SCORE,
} = require('../config/textMatchConstants');

/**
 * Lowercase, strip punctuation, collapse whitespace.
 * @param {string} str
 * @returns {string}
 */
function normalize(str) {
  if (str == null || str === '') return '';
  return String(str)
    .toLowerCase()
    .replace(NON_LETTER_NUMBER_REPLACE, ' ')
    .replace(WHITESPACE_COLLAPSE, ' ')
    .trim();
}

/**
 * Word tokens after normalization, excluding stop words and empties.
 * @param {string} normalized
 * @returns {string[]}
 */
function meaningfulTokens(normalized) {
  if (!normalized) return [];
  return normalized.split(' ').filter((t) => t && !STOP_WORDS.has(t));
}

/**
 * Jaccard similarity on two sets represented by unique token arrays.
 * Both empty → 1.0 (no substantive difference in token sets).
 * One empty, one not → 0.0.
 * @param {string[]} tokensA
 * @param {string[]} tokensB
 */
function jaccard(tokensA, tokensB) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;
  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 1.0 : intersection / union;
}

/**
 * Levenshtein edit distance.
 * @param {string} a
 * @param {string} b
 */
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  let prev = new Array(n + 1);
  let cur = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + cost
      );
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

/**
 * Normalized Levenshtein similarity in [0, 1].
 * @param {string} a
 * @param {string} b
 */
function characterSimilarity(a, b) {
  if (a === b) return 1.0;
  const la = a.length;
  const lb = b.length;
  if (la === 0 && lb === 0) return 1.0;
  if (la === 0 || lb === 0) return 0.0;
  const dist = levenshtein(a, b);
  return 1.0 - dist / Math.max(la, lb);
}

/**
 * @param {number} processingMs
 */
function emptyBothStringsResult(processingMs) {
  return {
    score: EMPTY_BOTH_STRINGS_SCORE,
    strategies: {
      exact: EMPTY_BOTH_STRINGS_SCORE,
      normalization: EMPTY_BOTH_STRINGS_SCORE,
      tokenOverlap: EMPTY_BOTH_STRINGS_SCORE,
    },
    matchedTokens: [],
    processingMs,
  };
}

module.exports = {
  normalize,
  meaningfulTokens,
  jaccard,
  levenshtein,
  characterSimilarity,
  emptyBothStringsResult,
};
