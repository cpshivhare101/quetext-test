const express = require('express');
const TextMatcher = require('./services/TextMatcher');
const { jsonContentType } = require('./middleware/jsonContentType');
const { errorHandler } = require('./middleware/errorHandler');
const { createHealthRoutes } = require('./routes/healthRoutes');
const { createCompareRoutes } = require('./routes/compareRoutes');

/**
 * Build the Express application (no listen).
 * @param {{ matcher?: import('./services/TextMatcher') }} [options]  Optional injected matcher (tests).
 */
function createApp(options = {}) {
  const matcher = options.matcher ?? new TextMatcher();

  const app = express();

  app.use(express.json());
  app.use(jsonContentType);

  app.use(createHealthRoutes());
  app.use(createCompareRoutes(matcher));

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
