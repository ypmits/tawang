const webpack = require("webpack");

const compiler = webpack(require('./webpack.config'));

compiler.run((err, stats) => {
  //console.log(stats)
});

process.stdin.resume();