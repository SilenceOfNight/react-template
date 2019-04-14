const paths = require('./paths');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    vendors: [ 'react', 'react-dom', 'react-app-polyfill/ie9' ],
  },
  output: {
    filename: '[name].[hash:8].dll.js',
    path: paths.appDll,
    library: '_dll_[name]',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: paths.appDllManifest,
      name: '_dll_[name]',
      context: paths.appRoot,
    }),
  ],
};
