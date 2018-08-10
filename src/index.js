const path = require('path');
const Validator = require('./lib/Validator');
const sendSourceMap = require('./lib/sendSourceMap');
const textAssembler = require('./lib/textAssembler');
const concatToFile = require('./lib/concatToFile');

/**
 * A webpack plugin for Facebook's AR Studio.
 */
module.exports = class {
  /**
   * Creates a new webpack plugin.
   * @param {object} options Options passed to the plugin.
   * @param {String} options.serverHost The domain name of the API without the protocol (e.g. “https://”) and with the TLD (e.g. “.com”). Example: "api.com".
   * @param {String} [options.sourceMapEndpoint=/source-map] The address of the source map POST endpoint relative to the serverHost domain.
   * @param {String} [options.parseEndpoint=/source-map/[id]?line=[line]&column=[column]] The address of the parsing GET endpoint relative to the serverHost domain.
   */
  constructor(options) {
    // Validating and sanitizing the options
    let validator = new Validator();

    if (typeof options !== 'object') {
      throw 'Tawang: Please provide an options object!';
    }

    if (typeof options.serverHost !== 'string') {
      throw 'Tawang: Please provide a serverHost string in the options object!';
    }

    let sourceMapEndpoint = validator.sourceMapEndpoint(options.sourceMapEndpoint);
    let parseEndpoint = validator.parseEndpoint(options.parseEndpoint);

    this.fullSourceMapEndpointAddress = 'https://' + options.serverHost + sourceMapEndpoint;
    this.fullParseEndpointAddress = 'https://' + options.serverHost + parseEndpoint;

    this.bind();
  }

  /**
   * Function gets called by webpack when the plugin is initialized.
   * @param {object} compiler The webpack compiler.
   */
  apply(compiler) {
    // Tapping into the compilation process and running plugin logic async.
    compiler.hooks.afterCompile.tapAsync('Tawang', (compilation, callback) => {
      this.handler(compilation)
        .then(() => {
          callback();
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  /**
   * Bind the classes scope to functions.
   */
  bind() {
    this.collectAssets = this.collectAssets.bind(this);
  }

  /**
   * Handles all plugin logic
   * @param {object} compilation Compilation object from an afterCompile event.
   * @return {Promise} Promise which gets resolved when the plugin is finished.
   */
  async handler(compilation) {
    // Getting source map and script from the compilation.
    let assets = this.collectAssets(compilation);

    // Checking if a sourcemap and a script exists
    if (assets.sourceMap !== null && assets.script !== null) {
      // Sending the source map to the API.
      let sourceMapOnServer = await sendSourceMap(
        assets.sourceMap.sourceContents._value,
        this.fullSourceMapEndpointAddress,
      );

      // Asembling the wrapper code using the id of the parsed source map on the server.
      let wrapper = await textAssembler({
        id: sourceMapOnServer.id,
        fullParseEndpointAddress: this.fullParseEndpointAddress,
      });

      // Concatenating the wrapper code to the script file.
      await concatToFile(compilation, assets.script.sourceName, wrapper.prepend, wrapper.append);
    }
  }

  /**
   * Gets the source map and the script asset from the compilation.
   * @param {object} compilation Compilation object from an afterCompile event.
   * @return {object} Object containing the source map and script.
   */
  collectAssets(compilation) {
    let sourceMap = null;
    let script = null;

    // Getting the source map and the script from the assets and storing it in two variables.
    Object.entries(compilation.assets).forEach(([sourceName, sourceContents]) => {
      let fileExtension = path.extname(sourceName);

      if (fileExtension === '.map') {
        // Checking if there is already a source map found.
        if (sourceMap !== null) {
          console.warn('Tawang only supports one output source map file.');
        }

        sourceMap = {
          sourceName,
          sourceContents,
        };
      } else if (fileExtension === '.js') {
        // Checking if there is already a script found.
        if (script !== null) {
          console.warn('Tawang only supports one output script file.');
        }

        script = {
          sourceName,
          sourceContents,
        };
      }
    });

    return {
      sourceMap,
      script,
    };
  }
};
