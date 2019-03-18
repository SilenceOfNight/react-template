const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
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
const imageRegex = /\.(png|svg|jpg|gif)$/;
const fontIconRegex = /\.(woff|woff2|eot|ttf|otf)$/;
const cssModuleLocalIdentName = '[name]_[local]-[hash:base64:5]';

const isEnvProduction = process.env.NODE_ENV === 'production';
// const isEnvDevelopment = process.env.NODE_ENV === 'development';
const useCssModule = false;
const useLess = false;
const useLessModule = false;
const sourceMap = true;
const startAnalyze = false;

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
        sourceMap: sourceMap,
      },
    },
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: sourceMap,
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
    alias: {
      '@': paths.appSrc,
    },
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
          sourceMap: sourceMap,
        }),
      },
      useCssModule && {
        test: cssModuleRegex,
        use: getStyleLoaders({
          modules: true,
          localIdentName: cssModuleLocalIdentName,
          importLoaders: 1,
          sourceMap: sourceMap,
        }),
      },
      useLess && {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 2,
            sourceMap: sourceMap,
          },
          'less-loader'
        ),
      },
      useLessModule && {
        test: lessModuleRegex,
        use: getStyleLoaders(
          {
            modules: true,
            localIdentName: cssModuleLocalIdentName,
            importLoaders: 2,
            sourceMap: sourceMap,
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
                ? 'static/asserts/[name].[hash:8].[ext]'
                : 'static/asserts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: fontIconRegex,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isEnvProduction
                ? 'static/asserts/[name][hash:8].[ext]'
                : 'static/asserts/[name].[ext]',
            },
          },
        ],
      },
    ].filter(Boolean),
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [
      new UglifyJsPlugin({
        // 过滤以 .min.js 结尾的文件（PS：以.min.js 结尾的文件已压缩，不需要二次压缩）。
        exclude: /\.min\.js$/,
        cache: true,
        // 开启并行压缩，重复利用CPU 性能
        parallel: true,
        sourceMap: sourceMap,
        uglifyOptions: {
          ie8: false,
          ecma: 8,
          mangle: true,
          output: { comments: false },
          compress: {
            warnings: false,
            // eslint-disable-next-line camelcase
            drop_debugger: true,
          },
        },
      }),
      // new ParallelUglifyPlugin({
      //   sourceMap: sourceMap,
      // }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    // 分离出manifest代码块（webpack 编译运行时的代码）
    runtimeChunk: 'single',
    splitChunks: {
      name: 'vendors',
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
          chunks: [ 'runtime', 'app' ],
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
    // manifest 代码块比较小，直接插入到index.html中，避免1次额外的HTTP 请求。
    new InlineManifestWebpackPlugin('runtime'),
    !isEnvProduction && new webpack.HotModuleReplacementPlugin(),
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
    startAnalyze && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
};
