const path = require('path');

const resolveApp = (...paths) => {
  return path.resolve(__dirname, '..', ...paths);
};

module.exports = {
  appRoot: resolveApp(),
  appSrc: resolveApp('src'),
  appPublic: resolveApp('public'),
  appNodeModules: resolveApp('node_modules'),
  appHtml: resolveApp('public/index.html'),
  appIndex: resolveApp('src/index.js'),
  appDist: resolveApp('dist'),
};
