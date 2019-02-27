const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const cssModuleLocalIdentName = "[name]_[local]-[hash:base64:5]";

module.exports = {
  entry: {
    app: paths.appIndex
  },
  output: {
    filename: "[name]-[chunkhash:8].js",
    path: paths.appDist
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: "pre",
        use: [
          {
            loader: "eslint-loader",
            options: {
              formatter: require.resolve("eslint-friendly-formatter")
              // fix: true
            }
          }
        ],
        include: paths.appSrc
      },
      {
        test: /\.(js|jsx)$/,
        use: ["babel-loader"],
        exclude: paths.appNodeModules
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: cssModuleRegex,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: cssModuleLocalIdentName,
              importLoaders: 1,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          "less-loader"
        ]
      },
      {
        test: lessModuleRegex,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: cssModuleLocalIdentName,
              importLoaders: 2,
              sourceMap: true
            }
          },
          "less-loader"
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist", "build"], {
      root: paths.appRoot,
      dry: false,
      watch: false
    }),
    new HtmlWebpackPlugin({
      title: "React Template",
      template: paths.appHtml,
      filename: "index.html",
      inject: true
    })
  ]
};
