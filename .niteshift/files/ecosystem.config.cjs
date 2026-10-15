const path = require('node:path');
const original = require('../../ecosystem.config.js');
const cwd = path.resolve(__dirname, '../..');

// The repository's deployment config selects production. Use its same processes
// with development compilation and an explicit port for each child.
module.exports = {
  apps: original.apps.map((app) => ({
    ...app,
    cwd,
    env: {
      ...app.env,
      NODE_ENV: 'development',
      EXPORT_ENABLED: 'false',
      PORT: app.name === 'phpserver' ? '4000' : '3000',
    },
  })),
};
