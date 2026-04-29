/** Strip punctuation: keep letters (any script), numbers, whitespace. */
const NON_LETTER_NUMBER_REPLACE = /[^\p{L}\p{N}\s]/gu;

const WHITESPACE_COLLAPSE = /\s+/g;

/** Final score = average of (normalization-based exact) and token overlap. */
const STRATEGY_BLEND_DIVISOR = 2;

/** Score and per-strategy values when both inputs are empty. */
const EMPTY_BOTH_STRINGS_SCORE = 0.0;

module.exports = {
  NON_LETTER_NUMBER_REPLACE,
  WHITESPACE_COLLAPSE,
  STRATEGY_BLEND_DIVISOR,
  EMPTY_BOTH_STRINGS_SCORE,
};
