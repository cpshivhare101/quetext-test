const { createApp } = require('./app');

/**
 * @returns {import('http').Server}
 */
function start() {
  const app = createApp();
  const port = Number(process.env.PORT) || 5010;
  return app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { createApp, start };
