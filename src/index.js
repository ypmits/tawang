const path = require('path');
const Validator = require('./lib/Validator');
const sendSourceMap = require('./lib/sendSourceMap');
const textAssembler = require('./lib/textAssembler');
const concatToFile = require('./lib/concatToFile');

module.exports = class {
  constructor(options) {
    // Validating and sanitizing the options
    let validator = new Validator();

    if (typeof options !== 'object') {
      throw 'Tawang: Please provide an options object!';
    }

    if (typeof options.serverHost !== 'string') {
      throw 'Tawang: Please provide a serverHost string in the options object!';
    }

    let postEndPoint = validator.postEndPoint(options.postEndPoint);
    let getEndPoint = validator.getEndPoint(options.getEndPoint);

    this.fullPostEndPointAddress = 'https://' + options.serverHost + postEndPoint;
    this.fullGetEndPointAddress = 'https://' + options.serverHost + getEndPoint;

    this.bind();
  }

  apply(compiler) {
    // Tapping into the compilation process
    compiler.hooks.afterCompile.tapAsync('ARStudioDevPlugin', (compilation, callback) => {
      this.handler(compilation)
        .then(() => {
          callback();
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  bind() {
    this.collectAssets = this.collectAssets.bind(this);
  }

  async handler(compilation) {
    let assets = this.collectAssets(compilation);

    // Checking if a sourcemap and a script exists
    if (assets.sourceMap !== null && assets.script !== null) {
      let sourceMapOnServer = await sendSourceMap(
        assets.sourceMap.sourceContents._value,
        this.fullPostEndPointAddress,
      );
      let wrapper = await textAssembler({
        id: sourceMapOnServer.id,
        getEndPointAddress: this.fullGetEndPointAddress,
      });
      await concatToFile(compilation, assets.script.sourceName, wrapper.prepend, wrapper.append);
    }
  }

  collectAssets(compilation) {
    let sourceMap = null;
    let script = null;

    Object.entries(compilation.assets).forEach(([sourceName, sourceContents]) => {
      let fileExtension = path.extname(sourceName);

      if (fileExtension === '.map') {
        sourceMap = {
          sourceName,
          sourceContents,
        };
      } else if (fileExtension === '.js') {
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
