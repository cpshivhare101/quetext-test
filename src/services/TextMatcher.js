const { STRATEGY_BLEND_DIVISOR } = require('../config/textMatchConstants');
const {
  normalize,
  meaningfulTokens,
  jaccard,
  characterSimilarity,
  emptyBothStringsResult,
} = require('../utils/textMatchUtils');

class TextMatcher {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * @param {string} source
   * @param {string} candidate
   */
  compare(source, candidate) {
    const start = performance.now();
    const s = source == null ? '' : String(source);
    const c = candidate == null ? '' : String(candidate);

    if (s === '' && c === '') {
      const processingMs = Math.round(performance.now() - start);
      return emptyBothStringsResult(processingMs);
    }

    const normSource = normalize(s);
    const normCandidate = normalize(c);

    const normalizationSim = characterSimilarity(normSource, normCandidate);

    const tokensA = meaningfulTokens(normSource);
    const tokensB = meaningfulTokens(normCandidate);
    const tokenOverlap = jaccard(tokensA, tokensB);

    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    const matchedTokens = [...setA].filter((t) => setB.has(t)).sort();

    const exactForScore = normalizationSim;
    const score = (exactForScore + tokenOverlap) / STRATEGY_BLEND_DIVISOR;

    const processingMs = Math.round(performance.now() - start);

    return {
      score,
      strategies: {
        exact: exactForScore,
        normalization: normalizationSim,
        tokenOverlap,
      },
      matchedTokens,
      processingMs,
    };
  }
}

module.exports = TextMatcher;
