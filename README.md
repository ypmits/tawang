# Tawang

This plugin makes webpack compatible with [Facebook’s AR Studio](https://developers.facebook.com/products/ar-studio). With this plugin, it is possible to debug an AR Studio script using source maps.
It uses an external API to parse the source map which webpack generates. You can create such an API using the [Tawang-API](https://github.com/timstruthoff/tawang-server) Git repository.

## Install
```javascript
npm i -D @mediamonks/tawang
```
or
```javascript
yarn add -D @mediamonks/tawang
```
## Usage

To use this plugin, you first have to require it. Secondly, you have to add an instance of it to the plugin array in the webpack.config.js. Finally, you have to pass the API endpoints to the options object.
Alternatively, there is also a boilerplate project available [here](https://github.com/timstruthoff/tawang-starter), which you can just clone.

**webpack.config.js**
```javascript
const Tawang = require('@mediamonks/tawang');

module.exports = {
  // ...
  externals: {
    Animation: "commonjs Animation",
    Diagnostics: "commonjs Diagnostics",
    FaceTracking: "commonjs FaceTracking",
    Reactive: "commonjs Reactive",
    Scene: "commonjs Scene"
  },
  plugins: [
    new Tawang({
      serverHost: 'api.com',
      sourceMapEndpoint: '/source-map',
      parseEndpoint: '/source-map/[id]'
    })
  ]
}
```

### Options

You have to pass the following options to the plugin.

#### `serverHost: <String>` (required)
The domain name of the API without the protocol (e.g. “https://”) and with the TLD (e.g. “.com”).
Example: "api.com".

#### `sourceMapEndpoint: <String>` (optional)
The address of the source map POST endpoint relative to the serverHost domain. This is the address, where the plugin sends the source map during the compilation.
Example: "/source-map".

#### `parseEndpoint: <String>` (optional)
The address of the parsing GET endpoint relative to the serverHost domain. Any errors which occur in the AR Studio script are sent here. The API server then parses the line and column number from the error and returns the code location in the original source.
The URL should include placeholders for the source map id ("[id]"), line number ("[line]"), and column number ("[column]"). You have to enclose all placeholders in square brackets
Example: "/source-map/[id]?line=[line]&column=[column]".


### Example

This is an example `webpack.config.js` file with Babel support.

```javascript
const webpack = require("webpack");
const path = require("path");
const Tawang = require('@mediamonks/tawang');

module.exports = {
  entry: "./src/script.js",
  mode: "production",
  devtool: "source-map",
  output: {
    path: "./build"),
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
    new Tawang({
      serverHost: 'api.com',
      sourceMapEndpoint: '/source-map',
      parseEndpoint: '/source-map/[id]?line=[line]&column=[column]'
    })
  ]
};
```
