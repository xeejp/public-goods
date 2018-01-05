const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  entry: {
    host: ["babel-polyfill", "./host/index.js"],
    participant: ["babel-polyfill", "./participant/index.js"],
  },
  output: {
    path: `${__dirname}/`,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["es2015", "react"]
          },
        }
      }
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new MinifyPlugin(),
    new webpack.ContextReplacementPlugin(/.*/, path.resolve(__dirname, 'node_modules', 'jsondiffpatch'), {
      '../package.json': './package.json',
      './formatters': './src/formatters/index.js',
      './console': './src/formatters/console.js'
    }),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'), 'node_modules',
    ],
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {
      root: path.resolve(__dirname, './'),
    },
  },
};
