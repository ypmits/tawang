const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/script.js",
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "../../build"),
    filename: "main.bundle.js"
  },
  externals: {
    Animation: "commonjs Animation",
    Diagnostics: "commonjs Diagnostics",
    FaceTracking: "commonjs FaceTracking",
    Reactive: "commonjs Reactive",
    Scene: "commonjs Scene"
  }
};
