const webpack = require("webpack");
const path = require("path");
const ARStudioDevPlugin = require('./plugin/ARStudioDevPlugin');

module.exports = {
  entry: "./src/script.js",
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "../../build"),
    filename: "main.bundle.js"
  },
  module: {
    rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }
    ]
  },
  externals: {
    Animation: "commonjs Animation",
    Diagnostics: "commonjs Diagnostics",
    FaceTracking: "commonjs FaceTracking",
    Reactive: "commonjs Reactive",
    Scene: "commonjs Scene"
  },
  plugins: [
    new ARStudioDevPlugin({
      serverHost: 'sourcemap-parse-api.eu.dev.monkapps.com',
      postEndPointAddress: 'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map',
      getEndPointAddress: 'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map/[id]?line=[line]&column=[column]'
    })
  ]
};
