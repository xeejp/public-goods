const path = require('path');
require("@babel/polyfill");

module.exports = {
  mode: "production",
  entry: {
    host: ["@babel/polyfill", "./host/index"],
    participant: ["@babel/polyfill", "./participant/index"],
  },
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "[name].js",
    publicPath: "",
  },
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        },
      }
    ]
  },
  resolve: {
     extensions: ['.js', '.jsx'],
   },
}
