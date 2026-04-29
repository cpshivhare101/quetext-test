const express = require('express');

function createCompareRoutes(matcher) {
  const router = express.Router();

  router.post('/compare', (req, res) => {
    const { source, candidate } = req.body || {};
    if (source === undefined || candidate === undefined) {
      return res.status(400).json({
        error: 'Request body must include both "source" and "candidate" strings.',
      });
    }
    if (typeof source !== 'string' || typeof candidate !== 'string') {
      return res.status(400).json({
        error: '"source" and "candidate" must be strings.',
      });
    }
    const result = matcher.compare(source, candidate);
    return res.status(200).json(result);
  });

  return router;
}

module.exports = { createCompareRoutes };
