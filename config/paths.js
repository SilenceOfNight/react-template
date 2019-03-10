const path = require('path');

const resolveApp = (...paths) => {
  return path.resolve(__dirname, '..', ...paths);
};

module.exports = {
  appRoot: resolveApp(),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
  appHtml: resolveApp('src/index.html'),
  appIndex: resolveApp('src/index.js'),
  appDist: resolveApp('dist'),
};
