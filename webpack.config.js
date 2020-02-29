// Imports
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// Import the plugin:
var DashboardPlugin = require("webpack-dashboard/plugin");

// Webpack Configuration
const config = {
  // Entry
  entry: "./src/index.js",

  // Output
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js"
  },
  // Loaders
  module: {
    rules: [
      // JavaScript Files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      // CSS Files
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin()
  ],
  // Development Tools (Map Errors To Source File)
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    hot: true,
    port: 9000
  }
};
// Exports
module.exports = config;
