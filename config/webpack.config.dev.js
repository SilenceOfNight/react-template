const paths = require('./paths');
const merge = require('webpack-merge');
const config = require('./webpack.config');

const DEFAULT_SERVER_PORT = 3000;
const port = process.env.PORT || DEFAULT_SERVER_PORT;

module.exports = merge(config, {
  devServer: {
    contentBase: paths.appDist,
    compress: true,
    port: port,
    open: true,
    overlay: true,
    hot: true,
    stats: 'errors-only',
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8080',
    //     secure: false,
    //   },
    // },
  },
});
