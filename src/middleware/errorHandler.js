/**
 * Express error handler: JSON parse errors and generic failures.
 */
function errorHandler(err, _req, res, next) {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ error: 'Internal server error.' });
}

module.exports = { errorHandler };
