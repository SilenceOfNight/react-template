const paths = require('./paths');
const merge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: paths.appDist,
    compress: true,
    port: 3000,
    open: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8080',
    //     secure: false,
    //   },
    // },
  },
});
