/**
 * Ensures JSON responses (assessment requirement).
 */
function jsonContentType(_req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
}

module.exports = { jsonContentType };
