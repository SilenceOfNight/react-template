const paths = require('./paths');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: { 
        app: paths.appIndex
    },
    output: {
        filename: '[name]-[chunkhash:8].js',
        path: paths.appDist
    },
    devServer: {
        contentBase: paths.appDist,
        compress: true,
        port: 3000,
        open: true
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: ['babel-loader'],
            exclude: paths.appNodeModules
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist', 'build'], {
            root: paths.appRoot,
            dry: false,
            watch: false,
        }),
        new HtmlWebpackPlugin({
            title: 'React Template',
            template: paths.appHtml,
            filename: 'index.html',
            inject: true
        })
    ]
};