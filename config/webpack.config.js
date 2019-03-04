const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const webpack = require('webpack');

const jsRegex = /\.(js|jsx)$/;
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const cssModuleLocalIdentName = '[name]_[local]-[hash:base64:5]';
const imageRegex = /\.(png|svg|jpg|gif)$/;
const fontIconRegex = /\.(woff|woff2|eot|ttf|otf)$/;

const isEnvProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    app: paths.appIndex,
  },
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].js',
    path: paths.appDist,
  },
  module: {
    rules: [
      {
        test: jsRegex,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              formatter: require.resolve('eslint-friendly-formatter'),
              // fix: true
            },
          },
        ],
        include: paths.appSrc,
      },
      {
        test: jsRegex,
        use: [ 'babel-loader' ],
        exclude: paths.appNodeModules,
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: [
          isEnvProduction ? MiniCssExtractPlugin.loader: 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: isEnvProduction,
            },
          },
        ],
      },
      {
        test: cssModuleRegex,
        use: [
          isEnvProduction ? MiniCssExtractPlugin.loader: 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: cssModuleLocalIdentName,
              importLoaders: 1,
              sourceMap: isEnvProduction,
            },
          },
        ],
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: [
          isEnvProduction ? MiniCssExtractPlugin.loader: 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: isEnvProduction,
            },
          },
          'less-loader',
        ],
      },
      {
        test: lessModuleRegex,
        use: [
          isEnvProduction ? MiniCssExtractPlugin.loader: 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: cssModuleLocalIdentName,
              importLoaders: 2,
              sourceMap: isEnvProduction,
            },
          },
          'less-loader',
        ],
      },
      {
        test: imageRegex,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: fontIconRegex,
        use: [ 'file-loader' ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin([ 'dist', 'build' ], {
      root: paths.appRoot,
      dry: false,
      watch: false,
    }),
    new HtmlWebpackPlugin({
      title: 'React Template',
      template: paths.appHtml,
      filename: 'index.html',
      inject: true,
    }),
    // isEnvProduction &&
    //   new MiniCssExtractPlugin({
    //     filename: 'static/css/[name].[contenthash:8].css',
    //     chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    //   }),
  ],
};
