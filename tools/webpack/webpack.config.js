/*const path = require('path');
const webpack = require('webpack');


module.exports = {
    output: {
        // path: path.resolve(__dirname, '../../build'),
        path: __dirname,
        filename: '[name].[hash].js',
        publicPath: '/'
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
    plugins: []
};*/
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './source/script.js',
    output: {
        path: path.resolve(__dirname, '../../build'),
        filename: 'main.bundle.js'
    },
    externals: {
        'Animation': 'commonjs Animation',
        'Diagnostics': 'commonjs Diagnostics',
        'FaceTracking': 'commonjs FaceTracking',
        'Reactive': 'commonjs Reactive',
        'Scene': 'commonjs Scene'
    }
    /*,
      plugins: [
        new webpack.IgnorePlugin(/Animation/),
        new webpack.IgnorePlugin(/Diagnostics/),
        new webpack.IgnorePlugin(/FaceTracking/),
        new webpack.IgnorePlugin(/Reactive/),
        new webpack.IgnorePlugin(/Scene/)
      ]*/
};