const webpack = require("webpack");
const path = require("path");

const config = {
  entry: {
    main: [
      "babel-polyfill",
      "./src/app/index.jsx",
    ],
  },
  // Render source-map file for final build
  devtool: "source-map",
  // output config
  output: {
    path: path.resolve(__dirname, "build"), // Path of output file
    filename: "app.js", // Name of output file
  },
  plugins: [
    // TODO: why doesn't this work...
    // Define production build to allow React to strip out unnecessary checks
    // new webpack.DefinePlugin({
    //   "process.env.NODE_ENV": JSON.stringify("production"),
    // }),
    // Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
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
