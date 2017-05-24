const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const config = {
  // Entry points to the project
  entry: {
    main: [
      // only- means to only hot reload for successful updates
      "babel-polyfill",
      "webpack/hot/only-dev-server",
      "./src/app/index.jsx",
    ],
  },
  // Server Configuration options
  devServer: {
    contentBase: __dirname, // Relative directory for base of server
    hot: true, // Live-reload
    inline: true,
    port: 4000, // Port Number
    host: "localhost", // Change to '0.0.0.0' for external facing server
  },
  devtool: "eval",
  output: {
    path: path.resolve(__dirname, "build"), // Path of output file
    filename: "timeline-admin/build/app.js",
  },
  plugins: [
    // Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    // Moves files
    new CopyWebpackPlugin([
      { from: "main.css", to: "timeline-admin/main.css" },
    ]),
    new Dotenv({
      path: ".env",
      safe: false,
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          cacheDirectory: true,
        },
      },
    ],
  },
};

module.exports = config;
