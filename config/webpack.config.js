const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
// const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const webpack = require('webpack');

const jsRegex = /\.(js|jsx)$/;
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const cssModuleLocalIdentName = '[name]_[local]-[hash:base64:5]';
const imageRegex = /\.(png|svg|jpg|gif)$/;
const fontIconRegex = /\.(woff|woff2|eot|ttf|otf)$/;

const isEnvProduction = process.env.NODE_ENV === 'production';
// const isEnvDevelopment = process.env.NODE_ENV === 'development';

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: isEnvProduction,
      },
    },
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: isEnvProduction,
      },
    });
  }

  return loaders;
};

module.exports = {
  mode: isEnvProduction ? 'production' : 'development',
  devtool: isEnvProduction ? 'cheap-module-source-map' : 'inline-source-map',
  entry: {
    app: paths.appIndex,
  },
  output: {
    filename: !isEnvProduction
      ? 'static/js/[name].js'
      : 'static/js/[name].[chunkhash:8].js',
    chunkFilename: !isEnvProduction
      ? 'static/js/[name].chunk.js'
      : 'static/js/[name].[chunkhash:8].chunk.js',
    path: paths.appDist,
  },
  resolve: {
    modules: [ paths.appSrc, paths.appNodeModules ],
    plugins: [ PnpWebpackPlugin ],
  },
  resolveLoader: {
    plugins: [ PnpWebpackPlugin.moduleLoader(module) ],
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
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
        exclude: paths.appNodeModules,
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: isEnvProduction,
        }),
      },
      {
        test: cssModuleRegex,
        use: getStyleLoaders({
          modules: true,
          localIdentName: cssModuleLocalIdentName,
          importLoaders: 1,
          sourceMap: isEnvProduction,
        }),
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 2,
            sourceMap: isEnvProduction,
          },
          'less-loader'
        ),
      },
      {
        test: lessModuleRegex,
        use: getStyleLoaders(
          {
            modules: true,
            localIdentName: cssModuleLocalIdentName,
            importLoaders: 2,
            sourceMap: isEnvProduction,
          },
          'less-loader'
        ),
      },
      {
        test: imageRegex,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              name: isEnvProduction
                ? 'static/media/[name].[hash:8].[ext]'
                : 'static/media/[name].[ext]',
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
    minimize: isEnvProduction,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          title: 'React Template',
          template: paths.appHtml,
          filename: 'index.html',
          inject: true,
        },
        isEnvProduction
          ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
          : undefined
      )
    ),
    !isEnvProduction && new webpack.HotModuleReplacementPlugin(),
    // isEnvProduction && new ParallelUglifyPlugin({}),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: isEnvProduction
          ? 'static/css/[name].[contenthash:8].css'
          : 'static/css/[name].css',
        chunkFilename: isEnvProduction
          ? 'static/css/[name].[contenthash:8].chunk.css'
          : 'static/css/[name].chunk.css',
      }),
    !isEnvProduction && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
};
