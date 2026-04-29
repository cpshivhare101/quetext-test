# Text similarity module + Express API

Small, self-contained text comparison logic (similarity scoring and token overlap) with an HTTP API, built for the Quetext assessment task.

## Assumptions

- **`score`** is the average of the first scoring component (named `exact` in the brief) and **`tokenOverlap`**. The brief’s “identical strings → 1.0” and “one word changed → high score” conflict if `exact` is only a binary string equality flag on short texts, so **`strategies.exact`** (and the value averaged into **`score`**) is **character-level similarity** on the **normalized** strings (1 minus normalized Levenshtein distance). **`strategies.normalization`** is the same character-level metric for clarity under the name “after normalization.”
- **Both inputs empty** (`""` and `""`): **`score` is `0.0`** (per “empty string inputs … return score 0.0”). One-sided empty comparisons naturally score `0.0` from the metrics.
- **Tokenization** uses Unicode letters and numbers (`\p{L}`, `\p{N}`) so non-ASCII words count as tokens where supported by Node.
- **Stop words**: hardcoded English list in `src/config/stopWords.js` (extendable via future `options` if needed).

## Project layout

```
src/
  app.js                 # Express app factory (`createApp`)
  server.js              # HTTP listen + process entry (`npm start`)
  config/
    stopWords.js         # Stop-word list for token overlap
    textMatchConstants.js # Regex + numeric knobs for matching
  middleware/
    jsonContentType.js   # `Content-Type: application/json`
    errorHandler.js      # JSON error responses
  utils/
    textMatchUtils.js    # normalize, tokens, Jaccard, Levenshtein, empty result
  routes/
    healthRoutes.js      # `GET /health`
    compareRoutes.js     # `POST /compare`
  services/
    TextMatcher.js       # Orchestrates compare(); uses `utils/textMatchUtils`
    __tests__/
      textMatcher.test.js
  __tests__/
    integration/
      api.test.js         # HTTP API tests (supertest)
TextMatcher.js           # Re-exports `src/services/TextMatcher` (brief compatibility)
server.js                # Re-exports / runs `src/server` (brief compatibility)
```

## Requirements

- Node.js **18+** (uses `node --test` and `performance.now()`).

## Install

```bash
npm install
```

## Start the server

```bash
npm start
```

Runs `node src/server.js` on port **5010** (or **`PORT`**). From the repo root, `node server.js` does the same via a thin shim.

## Run tests

```bash
npm test
```

## Example: `POST /compare`

With the server running on port 5010:

```bash
curl -s -X POST http://localhost:5010/compare \
  -H 'Content-Type: application/json' \
  -d '{"source":"The quick brown fox jumps over the lazy dog.","candidate":"The quick brown fox leaps over the lazy dog."}'
```

Health check:

```bash
curl -s http://localhost:5010/health
```

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/compare` | Body: `{ "source": string, "candidate": string }`. Returns a `MatchResult` JSON object. |
| `GET` | `/health` | Returns `{ "status": "ok" }`. |

Missing `source` or `candidate`, or non-string values for those fields → **400** with a JSON `error` message. Responses use **`Content-Type: application/json`**.

## `MatchResult` shape

- `score` — number in `[0, 1]`
- `strategies` — `{ exact, normalization, tokenOverlap }` (each number in `[0, 1]`)
- `matchedTokens` — sorted list of **non–stop-word** tokens appearing in both strings
- `processingMs` — wall-clock milliseconds for the comparison
