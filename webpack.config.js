const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  target: "node",
  mode: "production",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  // plugins: [new Dotenv()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.join(__dirname, "bundle"),
    filename: "bundle.js",
  },
  optimization: {
    minimize: true,
  },
};
