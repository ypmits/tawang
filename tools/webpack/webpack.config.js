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
};