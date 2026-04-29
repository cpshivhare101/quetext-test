const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const TextMatcher = require('../TextMatcher');

describe('TextMatcher', () => {
  const matcher = new TextMatcher();

  it('identical strings produce score 1.0', () => {
    const r = matcher.compare('Hello, World!', 'hello world');
    assert.equal(r.score, 1.0);
    assert.equal(r.strategies.tokenOverlap, 1.0);
  });

  it('completely unrelated strings produce score below 0.3', () => {
    const r = matcher.compare(
      'quantum chromodynamics',
      'zebra migrations in winter'
    );
    assert.ok(r.score < 0.3, `expected score < 0.3, got ${r.score}`);
  });

  it('near-duplicate strings (one word changed) produce score above 0.7', () => {
    const r = matcher.compare(
      'The quick brown fox jumps over the lazy dog.',
      'The quick brown fox leaps over the lazy dog.'
    );
    assert.ok(r.score > 0.7, `expected score > 0.7, got ${r.score}`);
  });

  it('empty string inputs do not throw and return score 0.0', () => {
    assert.doesNotThrow(() => {
      const a = matcher.compare('', 'hello');
      const b = matcher.compare('hello', '');
      const c = matcher.compare('', '');
      assert.equal(a.score, 0.0);
      assert.equal(b.score, 0.0);
      assert.equal(c.score, 0.0);
    });
  });

  it('stop words are excluded from matchedTokens', () => {
    const r = matcher.compare(
      'The algorithm is fast',
      'The algorithm was fast'
    );
    assert.ok(!r.matchedTokens.includes('the'));
    assert.ok(!r.matchedTokens.includes('is'));
    assert.ok(!r.matchedTokens.includes('was'));
    assert.ok(r.matchedTokens.includes('algorithm'));
    assert.ok(r.matchedTokens.includes('fast'));
  });

  it('returns MatchResult shape', () => {
    const r = matcher.compare('alpha beta', 'alpha gamma');
    assert.equal(typeof r.score, 'number');
    assert.equal(typeof r.strategies.exact, 'number');
    assert.equal(typeof r.strategies.normalization, 'number');
    assert.equal(typeof r.strategies.tokenOverlap, 'number');
    assert.ok(Array.isArray(r.matchedTokens));
    assert.equal(typeof r.processingMs, 'number');
  });
});
