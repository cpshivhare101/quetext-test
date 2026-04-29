const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../../app');

describe('API', () => {
  const app = createApp();

  function assertMatchResultShape(body) {
    assert.equal(typeof body.score, 'number');
    assert.equal(typeof body.strategies.exact, 'number');
    assert.equal(typeof body.strategies.normalization, 'number');
    assert.equal(typeof body.strategies.tokenOverlap, 'number');
    assert.ok(Array.isArray(body.matchedTokens));
    assert.equal(typeof body.processingMs, 'number');
  }

  it('POST /compare with valid body returns 200 and MatchResult shape', async () => {
    const res = await request(app)
      .post('/compare')
      .send({ source: 'hello world', candidate: 'hello world' })
      .expect('Content-Type', /application\/json/)
      .expect(200);

    assertMatchResultShape(res.body);
    assert.equal(res.body.score, 1.0);
  });

  it('POST /compare with missing fields returns 400', async () => {
    const missingSource = await request(app)
      .post('/compare')
      .send({ candidate: 'x' })
      .expect('Content-Type', /application\/json/)
      .expect(400);
    assert.ok(missingSource.body.error);

    const missingCandidate = await request(app)
      .post('/compare')
      .send({ source: 'x' })
      .expect(400);
    assert.ok(missingCandidate.body.error);
  });

  it('GET /health returns 200 with { status: ok }', async () => {
    const res = await request(app)
      .get('/health')
      .expect('Content-Type', /application\/json/)
      .expect(200);

    assert.deepEqual(res.body, { status: 'ok' });
  });
});
